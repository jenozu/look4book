import { summarizeActiveListings } from "@/lib/pricing";
import type { MarketplaceResult } from "@/lib/marketplace-types";

type EbayTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type EbaySearchResponse = {
  total?: number;
  itemSummaries?: Array<{
    price?: {
      value?: string;
      currency?: string;
    };
  }>;
};

let cachedToken:
  | {
      value: string;
      expiresAt: number;
    }
  | undefined;

export class EbayConfigurationError extends Error {
  constructor() {
    super("eBay API credentials are not configured.");
    this.name = "EbayConfigurationError";
  }
}

function getCredentials() {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new EbayConfigurationError();
  }

  return { clientId, clientSecret };
}

async function getApplicationToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const { clientId, clientSecret } = getCredentials();
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "https://api.ebay.com/oauth/api_scope",
  });

  const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`eBay OAuth failed with ${response.status}`);
  }

  const payload = (await response.json()) as EbayTokenResponse;

  if (!payload.access_token || !payload.expires_in) {
    throw new Error("eBay OAuth did not return an access token.");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(payload.expires_in - 60, 60) * 1000,
  };

  return cachedToken.value;
}

function selectDominantCurrency(
  items: NonNullable<EbaySearchResponse["itemSummaries"]>,
): { currency: string; prices: number[] } | null {
  const byCurrency = new Map<string, number[]>();

  for (const item of items) {
    const currency = item.price?.currency;
    const numericPrice = Number(item.price?.value);

    if (!currency || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      continue;
    }

    const prices = byCurrency.get(currency) ?? [];
    prices.push(numericPrice);
    byCurrency.set(currency, prices);
  }

  const dominant = [...byCurrency.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  )[0];

  return dominant ? { currency: dominant[0], prices: dominant[1] } : null;
}

export async function searchEbayByIsbn(
  isbn13: string,
): Promise<MarketplaceResult | null> {
  const token = await getApplicationToken();
  const marketplaceId = process.env.EBAY_MARKETPLACE_ID || "EBAY_CA";

  const url = new URL(
    "https://api.ebay.com/buy/browse/v1/item_summary/search",
  );
  url.searchParams.set("gtin", isbn13);
  url.searchParams.set("filter", "conditions:{USED}");
  url.searchParams.set("limit", "50");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`eBay Browse search failed with ${response.status}`);
  }

  const payload = (await response.json()) as EbaySearchResponse;
  const items = payload.itemSummaries ?? [];
  const dominant = selectDominantCurrency(items);

  if (!dominant) return null;

  return summarizeActiveListings(
    dominant.prices,
    dominant.currency,
    payload.total ?? items.length,
  );
}
