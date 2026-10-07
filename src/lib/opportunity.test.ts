import { describe, expect, it } from "vitest";
import { calculateOpportunity, estimateEbayBookFee } from "./opportunity";

describe("opportunity engine", () => {
  it("estimates the configured eBay book fee", () => {
    expect(estimateEbayBookFee(40)).toBe(6.52);
  });

  it("returns BUY when profit, ROI, and confidence clear the thresholds", () => {
    const result = calculateOpportunity({
      purchasePrice: 5.99,
      resalePrice: 40,
      confidence: "medium",
    });

    expect(result.estimatedProfit).toBe(15.49);
    expect(result.roi).toBe(259);
    expect(result.recommendation).toBe("buy");
  });

  it("will not issue a BUY on low-confidence data", () => {
    const result = calculateOpportunity({
      purchasePrice: 5,
      resalePrice: 50,
      confidence: "low",
    });

    expect(result.estimatedProfit).toBeGreaterThan(15);
    expect(result.recommendation).toBe("maybe");
  });
});
