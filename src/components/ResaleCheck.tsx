"use client";

import { FormEvent, useState } from "react";
import type { MarketplaceResult } from "@/lib/marketplace-types";
import {
  calculateOpportunity,
  DEFAULT_SHIPPING_COST_CAD,
} from "@/lib/opportunity";

type PricingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "setup"; message: string }
  | { status: "error"; message: string }
  | { status: "ready"; result: MarketplaceResult };

function money(value: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
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
        `/api/pricing/${encodeURIComponent(isbn)}`,
      );
      const payload = (await response.json()) as {
        result?: MarketplaceResult;
        error?: string;
        setupRequired?: boolean;
      };

      if (payload.setupRequired) {
        setPricing({
          status: "setup",
          message:
            "The pricing engine is ready, but eBay credentials still need to be added to Vercel.",
        });
        return;
      }

      if (!response.ok || !payload.result) {
        setPricing({
          status: "error",
          message: payload.error ?? "Could not estimate resale value.",
        });
        return;
      }

      setPricing({ status: "ready", result: payload.result });
    } catch {
      setPricing({
        status: "error",
        message: "Could not reach the pricing service.",
      });
    }
  }

  const numericPurchasePrice = Number(purchasePrice);
  const opportunity =
    pricing.status === "ready" &&
    Number.isFinite(numericPurchasePrice) &&
    numericPurchasePrice >= 0
      ? calculateOpportunity({
          purchasePrice: numericPurchasePrice,
          resalePrice: pricing.result.medianPrice,
          confidence: pricing.result.confidence,
        })
      : null;

  return (
    <section className="resale-card">
      <span className="step-chip">STEP 3</span>
      <h2>Check resale value</h2>
      <p className="resale-intro">
        Enter what the thrift store is charging for this copy.
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

      {pricing.status === "setup" && (
        <div className="pricing-message pricing-setup">
          <strong>EBAY CONNECTION NEEDED</strong>
          <p>{pricing.message}</p>
        </div>
      )}

      {pricing.status === "error" && (
        <div className="pricing-message pricing-error">
          <strong>COULD NOT PRICE BOOK</strong>
          <p>{pricing.message}</p>
        </div>
      )}

      {pricing.status === "ready" && opportunity && (
        <div className="pricing-results">
          <div className={`recommendation recommendation-${opportunity.recommendation}`}>
            <span>RECOMMENDATION</span>
            <strong>{opportunity.recommendation.toUpperCase()}</strong>
          </div>

          <div className="metric-grid">
            <div>
              <span>Estimated resale</span>
              <strong>{money(pricing.result.medianPrice, pricing.result.currency)}</strong>
              <small>
                {money(pricing.result.lowPrice, pricing.result.currency)}–
                {money(pricing.result.highPrice, pricing.result.currency)}
              </small>
            </div>
            <div>
              <span>Est. profit</span>
              <strong>{money(opportunity.estimatedProfit)}</strong>
              <small>after approx. fees + shipping</small>
            </div>
            <div>
              <span>ROI</span>
              <strong>{opportunity.roi}%</strong>
              <small>vs. purchase price</small>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{pricing.result.confidence.toUpperCase()}</strong>
              <small>{pricing.result.sampleSize} usable comps</small>
            </div>
          </div>

          <p className="pricing-note">
            eBay fee estimate uses 15.3% + order fee. Shipping assumption:{" "}
            {money(DEFAULT_SHIPPING_COST_CAD)}. {pricing.result.note}
          </p>
        </div>
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
