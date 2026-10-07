# Look4Book — Current Project State

**Last updated:** 2026-10-07  
**Status:** Amazon + eBay marketplace architecture is implemented. Live marketplace credentials and physical-device testing remain.

## Core flow

`Scan ISBN → identify book → confirm → enter thrift price → Amazon + eBay analytics → estimated profit/ROI → BUY / MAYBE / PASS`

## Implemented

### Scanner and identification
- Mobile-first ZXing ISBN scanner.
- Manual ISBN fallback.
- ISBN-10 / ISBN-13 validation and conversion.
- Open Library remains the no-key metadata fallback.

### eBay
- eBay Browse API adapter.
- Exact ISBN/GTIN matching.
- CAD active-listing range.
- Outlier filtering.
- Approximate eBay fee model.
- Graceful operation when eBay is not connected.

### Amazon SP-API
- Private-app LWA refresh-token authentication helper.
- Current SP-API connection style: LWA access token + SP-API headers, no legacy AWS SigV4 implementation.
- Amazon.ca Marketplace ID default: `A2EUQ1WTGCTBG2`.
- North America endpoint default: `https://sellingpartnerapi-na.amazon.com`.
- Catalog Items API lookup: ISBN → ASIN.
- Sales-rank extraction when available.
- Product Pricing API used-offer lookup.
- Used-offer count and current price range.
- Product Fees API estimate at the median Amazon resale price.
- Merchant-fulfilled fee assumption for the MVP.
- Amazon profit/ROI is used only when Amazon returns a fee estimate.
- Amazon and eBay adapters can fail or be unconfigured independently.

### Marketplace comparison
- New valuation endpoint aggregates Amazon and eBay.
- UI displays separate marketplace cards.
- Shows the marketplace with the highest current estimated profit when fee data is sufficient.
- Amazon card can show ASIN, sales rank, rank category, used offers, price range, fees, and profit.
- Missing credentials are source-specific setup notices rather than breaking the entire flow.

### Security
- Real SP-API credentials are server-only environment variables.
- `.env.example` contains names/placeholders only.
- No customer PII or restricted SP-API roles are required.
- Detailed setup guide: `40-Research/amazon-sp-api-setup.md`.

## Credentials still required

### Amazon
- `AMAZON_SPAPI_LWA_CLIENT_ID`
- `AMAZON_SPAPI_LWA_CLIENT_SECRET`
- `AMAZON_SPAPI_REFRESH_TOKEN`

Defaults:
- `AMAZON_SPAPI_MARKETPLACE_ID=A2EUQ1WTGCTBG2`
- `AMAZON_SPAPI_ENDPOINT=https://sellingpartnerapi-na.amazon.com`

### eBay
- `EBAY_CLIENT_ID`
- `EBAY_CLIENT_SECRET`

## Physical verification still required

- iPhone camera permission.
- Physical ISBN scan.
- Several real-book metadata checks.
- Live Amazon result after SP-API setup.
- Live eBay result after eBay credentials are configured.
- Compare Look4Book against the Amazon Seller app on real books.

## Known limitations

- Amazon sales rank is a demand signal, not exact monthly-sales count.
- Amazon pricing is current offer data, not completed-sale history.
- eBay pricing is current listing data, not completed-sale history.
- Shipping remains a flat configurable CAD assumption for the MVP.
- Amazon fee estimate currently assumes merchant fulfillment.

## Planned sourcing-intelligence expansion

A formal **Phase 7 — Sourcing Intelligence & Learning** has been added to `master_plan.md`.

The design is documented in:

`10-Strategy/SOURCING_INTELLIGENCE.md`

The planned system will eventually capture scan history, Amazon BSR + rank category, offer counts, sourcing location, buy/pass decisions, actual sales, days-to-sell, sell-through, category performance, store performance, seasonality, estimated-vs-actual accuracy, and an explainable Look4Book Opportunity Score.

This work remains post-MVP. It should begin only after live Amazon/eBay data and the basic physical-phone sourcing flow are verified.

## Next action

Complete `40-Research/amazon-sp-api-setup.md`, add Amazon credentials to Vercel, then run one real-book test.

## Handoff order

1. `.hermes.md`
2. `master_plan.md`
3. This file
4. `10-Strategy/PRD.md`
5. `40-Research/amazon-sp-api-setup.md`
6. `10-Strategy/SOURCING_INTELLIGENCE.md`
7. Relevant architecture/decision notes
