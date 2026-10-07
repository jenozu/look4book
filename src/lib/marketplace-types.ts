export type Confidence = "high" | "medium" | "low";

export type MarketplaceResult = {
  marketplace: "ebay";
  basis: "active_listings";
  currency: string;
  listingCount: number;
  sampleSize: number;
  lowPrice: number;
  medianPrice: number;
  highPrice: number;
  confidence: Confidence;
  note: string;
};
