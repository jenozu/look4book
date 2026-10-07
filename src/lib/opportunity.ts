import type { Confidence } from "@/lib/marketplace-types";

export type Opportunity = {
  estimatedFee: number;
  estimatedProfit: number;
  roi: number;
  recommendation: "buy" | "maybe" | "pass";
};

export const DEFAULT_BOOK_FEE_RATE = 0.153;
export const DEFAULT_SHIPPING_COST_CAD = 12;
export const DEFAULT_MIN_PROFIT_CAD = 15;
export const DEFAULT_MIN_ROI_PERCENT = 75;

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function estimateEbayBookFee(salePrice: number): number {
  const orderFee = salePrice <= 10 ? 0.3 : 0.4;
  return roundMoney(salePrice * DEFAULT_BOOK_FEE_RATE + orderFee);
}

export function calculateOpportunityWithFee({
  purchasePrice,
  resalePrice,
  estimatedFee,
  confidence,
  shippingCost = DEFAULT_SHIPPING_COST_CAD,
}: {
  purchasePrice: number;
  resalePrice: number;
  estimatedFee: number;
  confidence: Confidence;
  shippingCost?: number;
}): Opportunity {
  const estimatedProfit = roundMoney(
    resalePrice - estimatedFee - shippingCost - purchasePrice,
  );
  const roi =
    purchasePrice > 0
      ? Math.round((estimatedProfit / purchasePrice) * 100)
      : 0;

  let recommendation: Opportunity["recommendation"] = "pass";

  if (
    confidence !== "low" &&
    estimatedProfit >= DEFAULT_MIN_PROFIT_CAD &&
    roi >= DEFAULT_MIN_ROI_PERCENT
  ) {
    recommendation = "buy";
  } else if (estimatedProfit >= 7) {
    recommendation = "maybe";
  }

  return {
    estimatedFee: roundMoney(estimatedFee),
    estimatedProfit,
    roi,
    recommendation,
  };
}

export function calculateOpportunity({
  purchasePrice,
  resalePrice,
  confidence,
  shippingCost = DEFAULT_SHIPPING_COST_CAD,
}: {
  purchasePrice: number;
  resalePrice: number;
  confidence: Confidence;
  shippingCost?: number;
}): Opportunity {
  return calculateOpportunityWithFee({
    purchasePrice,
    resalePrice,
    estimatedFee: estimateEbayBookFee(resalePrice),
    confidence,
    shippingCost,
  });
}
