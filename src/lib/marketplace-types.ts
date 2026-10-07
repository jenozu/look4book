export type Confidence = "high" | "medium" | "low";

export type MarketplaceResult = {
  marketplace: "ebay" | "amazon";
  basis: "active_listings" | "active_offers";
  currency: string;
  listingCount: number;
  sampleSize: number;
  lowPrice: number;
  medianPrice: number;
  highPrice: number;
  confidence: Confidence;
  note: string;
  asin?: string;
  salesRank?: number;
  salesRankTitle?: string;
  estimatedFees?: number;
  estimatedFeesCurrency?: string;
};
