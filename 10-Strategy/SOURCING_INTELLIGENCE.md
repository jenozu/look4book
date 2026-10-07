# Look4Book — Sourcing Intelligence Strategy

**Status:** Planned  
**Priority:** Post-MVP, after live Amazon/eBay validation and initial real-world sourcing  
**Purpose:** Make Look4Book learn from actual sourcing and sale outcomes rather than relying only on marketplace snapshots.

## Core idea

Amazon can provide useful demand and competition signals such as:

- Amazon sales rank (BSR)
- sales-rank category
- used-offer count
- current used-offer pricing
- ASIN
- Amazon fee estimates

Those signals help evaluate a book **today**, but they do not tell us exactly how quickly this user will sell that kind of inventory.

Look4Book should therefore build its own historical dataset from real sourcing activity.

The long-term loop is:

`Scan → evaluate → buy/pass → list → sell → record outcome → learn → improve next recommendation`

## What should be captured at scan time

For every scan:

- timestamp
- ISBN / ASIN
- title / author
- subject/category
- sourcing store/location
- thrift price
- Amazon BSR
- Amazon BSR category
- Amazon used-offer count
- Amazon used-price range
- Amazon fee estimate
- eBay comparable/listing count
- eBay price range
- Look4Book recommendation
- estimated profit
- estimated ROI
- confidence
- buy/pass decision

The scan-time snapshot must remain immutable so later actual results can be compared to the original recommendation.

## What should be captured after purchase

For purchased books:

- purchase cost
- listing marketplace
- listing date
- listing price
- sold date
- actual sale price
- actual fees
- actual shipping/packaging
- actual net profit
- actual ROI
- days to sell

## Metrics that matter most

### Turnover
- median days to sell
- 30-day sell-through
- 60-day sell-through
- 90-day sell-through

### Profitability
- average and median net profit
- average ROI
- profit per purchased book
- profit per sourcing trip
- estimated-vs-actual profit accuracy

### Category performance
For each subject/category:
- scans
- buys
- sales
- purchase rate
- sell-through
- median days to sell
- average/median profit
- average BSR for sold inventory
- average used-offer count

### Store performance
For each sourcing location:
- scans
- purchases
- realized profit
- average profit/book
- median days to sell
- strongest book categories
- profit per trip

## How Amazon BSR should be used

BSR is a **relative demand signal**, not an exact sales count.

Rules:

1. Always store rank category with the rank.
2. Do not blindly compare rank numbers across unrelated categories.
3. Combine BSR with used-offer count.
4. A low BSR with heavy competition can still be unattractive.
5. A slower book with very low competition and large margin can still be worthwhile.
6. Once Look4Book has enough actual outcomes, learn category-specific BSR bands from this user's own sales history.

Example future learned rule:

- Nursing books with BSR < 80,000 and <= 6 used offers: historically fast movers.
- Photography books with BSR > 350,000: historically slow unless expected profit is exceptional.

These rules must come from observed history, not hard-coded assumptions.

## Opportunity Score concept

Future score: **0–100**, fully explainable.

Possible components:

- Demand
- Competition
- Expected profit
- ROI
- Historical category turnover
- Historical store performance
- Seasonality

Example:

- Demand: 8/10
- Competition: 8/10
- Profit: 9/10
- Historical turnover: 9/10
- Category performance: 8/10

**Opportunity Score: 86/100 — Strong Buy**

The score should never hide the underlying numbers.

## Seasonality

Track actual sales by month so Look4Book can discover patterns such as textbook demand around academic terms.

Seasonality should be learned only when enough observations exist. Until then, show raw historical results rather than making predictive claims.

## Example future dashboard

Look4Book should eventually answer questions such as:

- Which categories make me the most money?
- Which categories sell fastest?
- Which categories have the best 30-day sell-through?
- Which thrift stores produce the highest profit per visit?
- Which Amazon BSR ranges have historically sold fastest for me?
- Which books are sitting too long?
- How accurate are Look4Book's profit predictions?
- What was my realized profit this month?
- What should I prioritize on my next sourcing trip?

## Product principle

The long-term competitive advantage of Look4Book is not simply aggregating Amazon and eBay.

It is combining marketplace signals with **the user's own local sourcing and actual-sale history** so recommendations improve over time.
