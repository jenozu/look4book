"use client";

import { FormEvent, useMemo, useState } from "react";
import type { MarketplaceResult } from "@/lib/marketplace-types";
import {
  calculateOpportunity,
  calculateOpportunityWithFee,
  DEFAULT_SHIPPING_COST_CAD,
  type Opportunity,
} from "@/lib/opportunity";

type SourceName = "amazon" | "ebay";

type PricingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      results: MarketplaceResult[];
      setupRequired: SourceName[];
      errors: Array<{ source: SourceName; message: string }>;
    };

function money(value: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function getOpportunity(
  result: MarketplaceResult,
  purchasePrice: number,
): Opportunity | null {
  if (result.marketplace === "amazon") {
    if (result.estimatedFees === undefined) return null;

    return calculateOpportunityWithFee({
      purchasePrice,
      resalePrice: result.medianPrice,
      estimatedFee: result.estimatedFees,
      confidence: result.confidence,
    });
  }

  return calculateOpportunity({
    purchasePrice,
    resalePrice: result.medianPrice,
    confidence: result.confidence,
  });
}

function sourceLabel(source: SourceName) {
  return source === "amazon" ? "Amazon" : "eBay";
}

export default function ResaleCheck({
  isbn,
  onScanAnother,
}: {
  isbn: string;
  onScanAnother: () => void;
}) {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [pricing, setPricing] = useState<PricingState>({ status: "idle" });

  async function checkPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericPurchasePrice = Number(purchasePrice);

    if (!Number.isFinite(numericPurchasePrice) || numericPurchasePrice < 0) {
      setPricing({ status: "error", message: "Enter a valid purchase price." });
      return;
    }

    setPricing({ status: "loading" });

    try {
      const response = await fetch(
        `/api/valuation/${encodeURIComponent(isbn)}`,
      );
      const payload = (await response.json()) as {
        results?: MarketplaceResult[];
        setupRequired?: SourceName[];
        errors?: Array<{ source: SourceName; message: string }>;
        error?: string;
      };

      if (!response.ok) {
        setPricing({
          status: "error",
          message: payload.error ?? "Could not estimate resale value.",
        });
        return;
      }

      setPricing({
        status: "ready",
        results: payload.results ?? [],
        setupRequired: payload.setupRequired ?? [],
        errors: payload.errors ?? [],
      });
    } catch {
      setPricing({
        status: "error",
        message: "Could not reach the pricing service.",
      });
    }
  }

  const numericPurchasePrice = Number(purchasePrice);

  const analyzed = useMemo(() => {
    if (
      pricing.status !== "ready" ||
      !Number.isFinite(numericPurchasePrice) ||
      numericPurchasePrice < 0
    ) {
      return [];
    }

    return pricing.results.map((result) => ({
      result,
      opportunity: getOpportunity(result, numericPurchasePrice),
    }));
  }, [numericPurchasePrice, pricing]);

  const best = useMemo(() => {
    return analyzed
      .filter(
        (
          item,
        ): item is {
          result: MarketplaceResult;
          opportunity: Opportunity;
        } => item.opportunity !== null,
      )
      .sort(
        (a, b) =>
          b.opportunity.estimatedProfit - a.opportunity.estimatedProfit,
      )[0];
  }, [analyzed]);

  return (
    <section className="resale-card">
      <span className="step-chip">STEP 3</span>
      <h2>Check resale value</h2>
      <p className="resale-intro">
        Enter what the thrift store is charging. Look4Book will compare the
        marketplaces that are connected.
      </p>

      <form onSubmit={checkPrice}>
        <label htmlFor="purchase-price">Purchase price (CAD)</label>
        <div className="price-input-wrap">
          <span aria-hidden="true">$</span>
          <input
            id="purchase-price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="5.99"
            value={purchasePrice}
            onChange={(event) => setPurchasePrice(event.target.value)}
          />
        </div>

        <button
          className="button button-primary"
          type="submit"
          disabled={!purchasePrice || pricing.status === "loading"}
        >
          {pricing.status === "loading" ? "CHECKING…" : "CHECK RESALE VALUE"}
        </button>
      </form>

      {pricing.status === "error" && (
        <div className="pricing-message pricing-error">
          <strong>COULD NOT PRICE BOOK</strong>
          <p>{pricing.message}</p>
        </div>
      )}

      {pricing.status === "ready" && (
        <>
          {best && (
            <div className="pricing-results">
              <div
                className={`recommendation recommendation-${best.opportunity.recommendation}`}
              >
                <span>BEST CURRENT OPTION · {sourceLabel(best.result.marketplace)}</span>
                <strong>{best.opportunity.recommendation.toUpperCase()}</strong>
              </div>

              <div className="metric-grid">
                <div>
                  <span>Best resale</span>
                  <strong>
                    {money(best.result.medianPrice, best.result.currency)}
                  </strong>
                  <small>
                    {money(best.result.lowPrice, best.result.currency)}–
                    {money(best.result.highPrice, best.result.currency)}
                  </small>
                </div>
                <div>
                  <span>Est. profit</span>
                  <strong>{money(best.opportunity.estimatedProfit)}</strong>
                  <small>after estimated fees + shipping</small>
                </div>
                <div>
                  <span>ROI</span>
                  <strong>{best.opportunity.roi}%</strong>
                  <small>vs. thrift purchase price</small>
                </div>
                <div>
                  <span>Confidence</span>
                  <strong>{best.result.confidence.toUpperCase()}</strong>
                  <small>{best.result.sampleSize} usable price points</small>
                </div>
              </div>
            </div>
          )}

          {analyzed.length > 0 && (
            <div className="marketplace-list">
              {analyzed.map(({ result, opportunity }) => (
                <article className="marketplace-card" key={result.marketplace}>
                  <div className="marketplace-card-heading">
                    <div>
                      <span className="marketplace-name">
                        {sourceLabel(result.marketplace)}
                      </span>
                      {result.marketplace === "amazon" && result.asin && (
                        <small>ASIN {result.asin}</small>
                      )}
                    </div>
                    <strong>
                      {money(result.medianPrice, result.currency)}
                    </strong>
                  </div>

                  <dl className="marketplace-stats">
                    <div>
                      <dt>Range</dt>
                      <dd>
                        {money(result.lowPrice, result.currency)}–
                        {money(result.highPrice, result.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt>
                        {result.marketplace === "amazon"
                          ? "Used offers"
                          : "Listings"}
                      </dt>
                      <dd>{result.listingCount}</dd>
                    </div>
                    {result.marketplace === "amazon" &&
                      result.salesRank !== undefined && (
                        <div>
                          <dt>Sales rank</dt>
                          <dd>#{result.salesRank.toLocaleString("en-CA")}</dd>
                        </div>
                      )}
                    {result.marketplace === "amazon" &&
                      result.salesRankTitle && (
                        <div>
                          <dt>Rank category</dt>
                          <dd>{result.salesRankTitle}</dd>
                        </div>
                      )}
                    {opportunity && (
                      <>
                        <div>
                          <dt>Est. fees</dt>
                          <dd>{money(opportunity.estimatedFee)}</dd>
                        </div>
                        <div>
                          <dt>Est. profit</dt>
                          <dd>{money(opportunity.estimatedProfit)}</dd>
                        </div>
                      </>
                    )}
                  </dl>

                  {result.marketplace === "amazon" &&
                    result.estimatedFees === undefined && (
                      <p className="marketplace-warning">
                        Amazon pricing loaded, but Amazon did not return a fee
                        estimate, so Look4Book is not using this source for the
                        BUY/PASS profit decision yet.
                      </p>
                    )}

                  <p className="pricing-note">{result.note}</p>
                </article>
              ))}
            </div>
          )}

          {pricing.setupRequired.map((source) => (
            <div className="pricing-message pricing-setup" key={source}>
              <strong>{sourceLabel(source).toUpperCase()} CONNECTION NEEDED</strong>
              <p>
                The {sourceLabel(source)} adapter is built, but its credentials
                still need to be added securely in Vercel.
              </p>
            </div>
          ))}

          {pricing.errors.map((error) => (
            <div className="pricing-message pricing-error" key={error.source}>
              <strong>{sourceLabel(error.source).toUpperCase()} UNAVAILABLE</strong>
              <p>{error.message}</p>
            </div>
          ))}

          {pricing.results.length === 0 &&
            pricing.setupRequired.length === 0 &&
            pricing.errors.length === 0 && (
              <div className="pricing-message pricing-error">
                <strong>NO MARKET DATA</strong>
                <p>No usable current marketplace pricing was found for this ISBN.</p>
              </div>
            )}

          <p className="pricing-note overall-pricing-note">
            Shipping assumption: {money(DEFAULT_SHIPPING_COST_CAD)}. Amazon
            profit uses Amazon&apos;s fee estimate when available; eBay still
            uses the configured approximate fee model.
          </p>
        </>
      )}

      <button
        className="button button-secondary full-width scan-another-button"
        type="button"
        onClick={onScanAnother}
      >
        SCAN ANOTHER
      </button>
    </section>
  );
}
