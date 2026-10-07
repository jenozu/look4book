import { describe, expect, it } from "vitest";
import { removePriceOutliers, summarizeActiveListings } from "./pricing";

describe("pricing utilities", () => {
  it("removes an obvious high-price outlier", () => {
    expect(removePriceOutliers([20, 22, 23, 24, 25, 26, 100])).toEqual([
      20, 22, 23, 24, 25, 26,
    ]);
  });

  it("summarizes active listings without pretending they are high confidence", () => {
    const result = summarizeActiveListings(
      [20, 22, 23, 24, 25, 26, 27, 28],
      "CAD",
      8,
    );

    expect(result).not.toBeNull();
    expect(result?.currency).toBe("CAD");
    expect(result?.medianPrice).toBe(24.5);
    expect(result?.confidence).toBe("medium");
    expect(result?.basis).toBe("active_listings");
  });
});
