import type { MarketplaceResult } from "@/lib/marketplace-types";
import { summarizeMarketplacePrices } from "@/lib/pricing";

const DEFAULT_MARKETPLACE_ID = "A2EUQ1WTGCTBG2";
const DEFAULT_ENDPOINT = "https://sellingpartnerapi-na.amazon.com";

type LwaTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type CatalogRank = {
  rank?: number;
  title?: string;
};

type CatalogItem = {
  asin?: string;
  summaries?: Array<{ itemName?: string }>;
  salesRanks?: Array<{
    displayGroupRanks?: CatalogRank[];
    classificationRanks?: CatalogRank[];
  }>;
};

type CatalogSearchResponse = {
  items?: CatalogItem[];
};

type Money = {
  CurrencyCode?: string;
  Amount?: number;
};

type AmazonOffer = {
  BuyingPrice?: {
    LandedPrice?: Money;
    ListingPrice?: Money;
  };
};

type AmazonOffersResponse = {
  payload?: {
    Summary?: {
      TotalOfferCount?: number;
      NumberOfOffers?: Array<{ OfferCount?: number }>;
      LowestPrices?: Array<{
        LandedPrice?: Money;
        ListingPrice?: Money;
      }>;
    };
    Offers?: AmazonOffer[];
  };
};

type AmazonFeesResponse = {
  payload?: {
    FeesEstimateResult?: {
      FeesEstimate?: {
        TotalFeesEstimate?: Money;
      };
    };
  };
};

let cachedToken:
  | {
      value: string;
      expiresAt: number;
    }
  | undefined;

export class AmazonConfigurationError extends Error {
  constructor() {
    super("Amazon SP-API credentials are not configured.");
    this.name = "AmazonConfigurationError";
  }
}

function getConfig() {
  const clientId = process.env.AMAZON_SPAPI_LWA_CLIENT_ID;
  const clientSecret = process.env.AMAZON_SPAPI_LWA_CLIENT_SECRET;
  const refreshToken = process.env.AMAZON_SPAPI_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new AmazonConfigurationError();
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    marketplaceId:
      process.env.AMAZON_SPAPI_MARKETPLACE_ID || DEFAULT_MARKETPLACE_ID,
    endpoint: process.env.AMAZON_SPAPI_ENDPOINT || DEFAULT_ENDPOINT,
  };
}

function amazonDate(date = new Date()): string {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const { clientId, clientSecret, refreshToken } = getConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Amazon LWA authentication failed with ${response.status}`);
  }

  const payload = (await response.json()) as LwaTokenResponse;

  if (!payload.access_token || !payload.expires_in) {
    throw new Error("Amazon LWA did not return a usable access token.");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(payload.expires_in - 60, 60) * 1000,
  };

  return cachedToken.value;
}

async function spApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const { endpoint } = getConfig();
  const accessToken = await getAccessToken();

  const headers = new Headers(init.headers);
  headers.set("x-amz-access-token", accessToken);
  headers.set("x-amz-date", amazonDate());
  headers.set(
    "user-agent",
    "Look4Book/0.2 (Language=TypeScript; Platform=Vercel)",
  );

  return fetch(`${endpoint}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

function findSalesRank(item: CatalogItem): {
  salesRank?: number;
  salesRankTitle?: string;
} {
  for (const group of item.salesRanks ?? []) {
    const candidate =
      group.displayGroupRanks?.[0] ?? group.classificationRanks?.[0];

    if (candidate?.rank) {
      return {
        salesRank: candidate.rank,
        salesRankTitle: candidate.title,
      };
    }
  }

  return {};
}

async function findCatalogItemByIsbn(isbn13: string): Promise<CatalogItem | null> {
  const { marketplaceId } = getConfig();
  const params = new URLSearchParams({
    identifiers: isbn13,
    identifiersType: "ISBN",
    marketplaceIds: marketplaceId,
    includedData: "summaries,images,salesRanks,identifiers",
    pageSize: "1",
  });

  const response = await spApiFetch(
    `/catalog/2022-04-01/items?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Amazon Catalog Items search failed with ${response.status}`);
  }

  const payload = (await response.json()) as CatalogSearchResponse;
  return payload.items?.[0] ?? null;
}

function extractOfferPrices(
  response: AmazonOffersResponse,
  currency: string,
): number[] {
  const prices: number[] = [];

  for (const offer of response.payload?.Offers ?? []) {
    const landed = offer.BuyingPrice?.LandedPrice;
    const listing = offer.BuyingPrice?.ListingPrice;
    const money = landed ?? listing;

    if (
      money?.CurrencyCode === currency &&
      Number.isFinite(money.Amount) &&
      (money.Amount ?? 0) > 0
    ) {
      prices.push(money.Amount as number);
    }
  }

  if (prices.length > 0) return prices;

  for (const lowest of response.payload?.Summary?.LowestPrices ?? []) {
    const money = lowest.LandedPrice ?? lowest.ListingPrice;

    if (
      money?.CurrencyCode === currency &&
      Number.isFinite(money.Amount) &&
      (money.Amount ?? 0) > 0
    ) {
      prices.push(money.Amount as number);
    }
  }

  return prices;
}

function getOfferCount(response: AmazonOffersResponse): number {
  const total = response.payload?.Summary?.TotalOfferCount;
  if (Number.isFinite(total)) return total as number;

  return (response.payload?.Summary?.NumberOfOffers ?? []).reduce(
    (sum, offer) => sum + (offer.OfferCount ?? 0),
    0,
  );
}

async function getUsedOffers(
  asin: string,
): Promise<{ prices: number[]; offerCount: number; currency: string }> {
  const { marketplaceId } = getConfig();
  const currency = marketplaceId === DEFAULT_MARKETPLACE_ID ? "CAD" : "USD";
  const params = new URLSearchParams({
    MarketplaceId: marketplaceId,
    ItemCondition: "Used",
    CustomerType: "Consumer",
  });

  const response = await spApiFetch(
    `/products/pricing/v0/items/${encodeURIComponent(asin)}/offers?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Amazon Product Pricing request failed with ${response.status}`);
  }

  const payload = (await response.json()) as AmazonOffersResponse;

  return {
    prices: extractOfferPrices(payload, currency),
    offerCount: getOfferCount(payload),
    currency,
  };
}

async function getFeeEstimate(
  asin: string,
  price: number,
  currency: string,
): Promise<number | undefined> {
  const { marketplaceId } = getConfig();

  const response = await spApiFetch(
    `/products/fees/v0/items/${encodeURIComponent(asin)}/feesEstimate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        FeesEstimateRequest: {
          MarketplaceId: marketplaceId,
          IsAmazonFulfilled: false,
          PriceToEstimateFees: {
            ListingPrice: { CurrencyCode: currency, Amount: price },
            Shipping: { CurrencyCode: currency, Amount: 0 },
          },
          Identifier: `look4book-${asin}-${Date.now()}`,
        },
      }),
    },
  );

  if (!response.ok) return undefined;

  const payload = (await response.json()) as AmazonFeesResponse;
  const amount =
    payload.payload?.FeesEstimateResult?.FeesEstimate?.TotalFeesEstimate?.Amount;

  return Number.isFinite(amount) ? amount : undefined;
}

export async function getAmazonBookAnalytics(
  isbn13: string,
): Promise<MarketplaceResult | null> {
  const catalogItem = await findCatalogItemByIsbn(isbn13);
  const asin = catalogItem?.asin;

  if (!asin) return null;

  const offers = await getUsedOffers(asin);
  const summarized = summarizeMarketplacePrices({
    marketplace: "amazon",
    basis: "active_offers",
    prices: offers.prices,
    currency: offers.currency,
    listingCount: offers.offerCount,
    note:
      "Amazon estimate uses current used offers, not exact monthly sales. Sales rank is shown separately as a demand signal.",
  });

  if (!summarized) return null;

  const rank = findSalesRank(catalogItem);
  let estimatedFees: number | undefined;

  try {
    estimatedFees = await getFeeEstimate(
      asin,
      summarized.medianPrice,
      summarized.currency,
    );
  } catch {
    estimatedFees = undefined;
  }

  return {
    ...summarized,
    asin,
    ...rank,
    estimatedFees,
    estimatedFeesCurrency:
      estimatedFees === undefined ? undefined : summarized.currency,
  };
}
