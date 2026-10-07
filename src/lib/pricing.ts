import type { Confidence, MarketplaceResult } from "@/lib/marketplace-types";

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function quantile(sorted: number[], position: number): number {
  if (sorted.length === 1) return sorted[0];

  const index = (sorted.length - 1) * position;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sorted[lower];

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function removePriceOutliers(prices: number[]): number[] {
  const sorted = prices
    .filter((price) => Number.isFinite(price) && price > 0)
    .sort((a, b) => a - b);

  if (sorted.length < 4) return sorted;

  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  if (iqr === 0) return sorted;

  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const filtered = sorted.filter(
    (price) => price >= lowerFence && price <= upperFence,
  );

  return filtered.length >= 3 ? filtered : sorted;
}

export function summarizeMarketplacePrices({
  marketplace,
  basis,
  prices,
  currency,
  listingCount,
  note,
}: {
  marketplace: MarketplaceResult["marketplace"];
  basis: MarketplaceResult["basis"];
  prices: number[];
  currency: string;
  listingCount: number;
  note: string;
}): MarketplaceResult | null {
  const filtered = removePriceOutliers(prices);
  if (filtered.length === 0) return null;

  let confidence: Confidence = "low";
  if (filtered.length >= 8) confidence = "medium";

  return {
    marketplace,
    basis,
    currency,
    listingCount,
    sampleSize: filtered.length,
    lowPrice: roundMoney(quantile(filtered, 0.25)),
    medianPrice: roundMoney(quantile(filtered, 0.5)),
    highPrice: roundMoney(quantile(filtered, 0.75)),
    confidence,
    note,
  };
}

export function summarizeActiveListings(
  prices: number[],
  currency: string,
  listingCount: number,
): MarketplaceResult | null {
  return summarizeMarketplacePrices({
    marketplace: "ebay",
    basis: "active_listings",
    prices,
    currency,
    listingCount,
    note:
      "Estimate is based on active asking prices, not completed sales, so confidence is capped at medium.",
  });
}
