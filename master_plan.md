# Look4Book — Master Task List

**Project:** Look4Book  
**Type:** Personal project  
**Target:** Mobile-first PWA  
**MVP principle:** Scan. Check. Buy or pass. Move on.

## MVP Definition of Done

The MVP is complete when I can open Look4Book on my phone, scan a book's ISBN barcode, confirm the detected book, enter the thrift-store price, retrieve useful resale pricing, see estimated fees/shipping/profit/ROI, receive a BUY / MAYBE / PASS recommendation, and immediately scan another book.

---

## Phase 0 — Project Foundation

- [x] Create `jenozu/look4book` repository.
- [x] Create the 2nd Brain project structure.
- [x] Add the product requirements document.
- [x] Add the master task list.
- [x] Add project-state handoff documentation.
- [x] Add the eBayBay-derived UI style guide.
- [x] Lock the MVP scope to a single-user personal tool.
- [x] Set the initial palette to pink, cyan/blue, white, and black.

**Phase exit:** Planning foundation is committed and implementation can begin.

---

## Phase 1 — ISBN Scanner

- [x] Scaffold a Next.js + TypeScript application.
- [x] Add Tailwind CSS.
- [x] Build the mobile-first scanner screen.
- [x] Request phone-camera permission cleanly.
- [x] Integrate browser barcode scanning for EAN-13 / ISBN-13.
- [x] Validate and normalize scanned ISBN values.
- [x] Add manual ISBN entry as a fallback.
- [x] Add clear scan-success, scan-failure, and retry states.
- [ ] Test barcode scanning on a real phone.

**Phase exit:** A physical book barcode reliably produces a normalized ISBN.

---

## Phase 2 — Book Identification

- [x] Create a `getBookByISBN(isbn)` service boundary.
- [x] Connect one book-metadata provider (Open Library).
- [x] Return title, author, and ISBN.
- [x] Display cover, publisher, edition-related metadata, and publication date when available.
- [x] Build the book-confirmation screen.
- [x] Add **Correct Book** and **Scan Again** actions.
- [x] Handle unknown or incomplete ISBN results gracefully.
- [ ] Test several common and uncommon books.

**Phase exit:** A scanned ISBN shows the correct book and lets me confirm it.

---

## Phase 3 — Resale Pricing

- [x] Define a normalized `MarketplaceResult` model.
- [x] Build the first marketplace adapter using eBay Browse API.
- [x] Search marketplace data using exact ISBN/GTIN.
- [x] Extract usable comparable active-listing prices.
- [x] Exclude obvious pricing outliers using IQR filtering.
- [x] Calculate low, median, and high resale estimates.
- [x] Return listing/comparable count when available.
- [x] Reduce confidence when market data is sparse; active listings are capped at MEDIUM confidence.
- [x] Keep marketplace adapters independent so another source can be added later.
- [x] Add Amazon SP-API as the second pricing/analytics source without making it mandatory for eBay fallback.
- [x] Add Amazon ISBN → ASIN catalog lookup and sales-rank analytics.
- [x] Add Amazon used-offer pricing and offer-count analytics.
- [x] Add Amazon Product Fees estimate support for merchant-fulfilled books.
- [ ] Verify live Amazon SP-API calls after private-app credentials are approved and added to Vercel.

**Phase exit:** An ISBN can produce a defensible resale-value range from at least one useful marketplace source.

---

## Phase 4 — Profit & Buy/Pass Engine

- [x] Add thrift-store purchase-price input in CAD.
- [x] Add centrally configurable default shipping cost ($12 CAD initially).
- [x] Add centrally configurable eBay book fee assumptions.
- [x] Calculate estimated net profit.
- [x] Calculate ROI.
- [x] Add centrally configurable minimum-profit threshold.
- [x] Add centrally configurable minimum-ROI threshold.
- [x] Implement BUY / MAYBE / PASS rules.
- [x] Implement HIGH / MEDIUM / LOW confidence model; active-listing-only data cannot produce HIGH yet.
- [x] Compare connected marketplaces and show the current best estimated-profit option.
- [x] Make calculations deterministic and unit-test ISBN, pricing/outliers, fees, profit, ROI, and recommendation.

### Initial recommendation defaults

- **BUY:** estimated profit ≥ $15 CAD and ROI ≥ 75%.
- **MAYBE:** estimated profit ≥ $7 CAD or confidence is limited.
- **PASS:** estimated profit < $7 CAD or likely margin is too weak.

These are starting values and must remain configurable.

**Phase exit:** A scan plus purchase price produces a transparent profitability recommendation.

---

## Phase 5 — Mobile UI & PWA

- [x] Implement the approved Look4Book theme tokens globally.
- [x] Use bubblegum pink as the app canvas.
- [x] Use cyan for primary actions.
- [x] Use white surfaces with strong black borders and offset shadows.
- [x] Build the four core views: Scanner, Book Confirmation, Purchase Price, Result.
- [x] Keep primary mobile touch targets at least ~44px.
- [x] Make **Scan Another** a prominent result-screen action.
- [x] Add loading states for metadata and marketplace pricing.
- [x] Add readable scanner, metadata, and marketplace error/setup states without breaking the flow.
- [x] Add PWA manifest, app icon, and home-screen metadata.
- [ ] Test the full flow at phone width.

**Phase exit:** The app is fast and comfortable to use while standing in a thrift store.

---

## Phase 6 — MVP QA & Deployment

- [x] Add environment-variable documentation in `.env.example`.
- [x] Ensure secrets are excluded by `.gitignore`; only placeholder env names are committed.
- [x] Add unit tests for ISBN normalization/validation/conversion.
- [x] Add unit tests for pricing/outlier logic.
- [x] Add unit tests for fee, profit, ROI, and recommendation logic.
- [x] Handle and test-safe missing/unconfigured marketplace states in the API/UI.
- [ ] Test camera denial and manual-entry fallback.
- [ ] Test slow or failed third-party requests.
- [x] Run production build and typecheck on Vercel.
- [x] Deploy to Vercel and link GitHub main branch.
- [ ] Test the deployed app on a real phone using real thrift-store books.
- [x] Update `70-Project-State/current-state.md` with the current verified implementation state.

**Phase exit:** The deployed app can be used for real-world sourcing.

---

## Phase 7 — Sourcing Intelligence & Learning

**Goal:** Turn Look4Book from a one-book calculator into a sourcing system that learns which book categories, stores, price bands, and demand signals produce the fastest and most profitable inventory for this user.

### Scan & sourcing history

- [ ] Add a persistent database for scan history.
- [ ] Save every scan, not only purchases.
- [ ] Record scan timestamp and ISBN/ASIN.
- [ ] Record book title, author, publisher, and subject/category when available.
- [ ] Record Amazon sales rank and the rank category at time of scan.
- [ ] Record Amazon used-offer count and current used-price range.
- [ ] Record eBay listing/comparable count and current price range.
- [ ] Record thrift-store purchase price.
- [ ] Record sourcing location/store.
- [ ] Record the initial Look4Book BUY / MAYBE / PASS recommendation.
- [ ] Allow the user to mark each scan as **Bought** or **Passed**.
- [ ] Preserve the original scan-time marketplace data so later results can be compared against what Look4Book predicted.

### Inventory & actual-sale outcomes

- [ ] Add a lightweight purchased-book inventory.
- [ ] Record listing date.
- [ ] Record marketplace listed on.
- [ ] Record listing price.
- [ ] Record sold date.
- [ ] Record actual sale price.
- [ ] Record actual marketplace fees.
- [ ] Record actual shipping/packaging cost.
- [ ] Calculate actual net profit.
- [ ] Calculate actual ROI.
- [ ] Calculate **days to sell**.
- [ ] Compare estimated profit vs actual profit.
- [ ] Compare estimated resale price vs actual sale price.

### Category intelligence

- [ ] Group results by book subject/category.
- [ ] Calculate number scanned, number bought, and number sold by category.
- [ ] Calculate median days to sell by category.
- [ ] Calculate 30-day / 60-day / 90-day sell-through rate by category.
- [ ] Calculate average and median net profit by category.
- [ ] Calculate average purchase cost and average sale price by category.
- [ ] Calculate average Amazon BSR for books that sold vs books that remained unsold.
- [ ] Identify categories that combine strong demand, low competition, and high margin.
- [ ] Surface categories that consume sourcing time but rarely produce worthwhile buys.

### Store / sourcing-location intelligence

- [ ] Calculate scans per store.
- [ ] Calculate BUY-rate and purchase-rate per store.
- [ ] Calculate expected profit sourced per store.
- [ ] Calculate realized profit sourced per store.
- [ ] Calculate average profit per purchased book by store.
- [ ] Calculate median days to sell by sourcing location.
- [ ] Calculate profit per sourcing trip.
- [ ] Rank sourcing locations by historical return on time and money.
- [ ] Show which categories are strongest at each store.

### Demand, competition & turnover

- [ ] Treat Amazon BSR as a relative demand signal, never as exact monthly sales.
- [ ] Always retain the Amazon rank category alongside BSR.
- [ ] Combine BSR with used-offer count so high demand / low competition can be distinguished from crowded listings.
- [ ] Track historical BSR at scan time for purchased books.
- [ ] Explore BSR bands by category once enough actual sales data exists.
- [ ] Learn which BSR ranges correspond to fast, medium, and slow turnover in this user's own inventory.
- [ ] Add a simple demand label such as **Fast / Moderate / Slow** only after enough historical evidence exists.

### Seasonality

- [ ] Analyze sales and sourcing results by month.
- [ ] Identify seasonal categories such as textbooks and academic material.
- [ ] Compare days-to-sell by category and month.
- [ ] Surface seasonal sourcing prompts when evidence supports them.
- [ ] Avoid claiming a seasonal pattern until enough historical observations exist.

### Look4Book Opportunity Score

- [ ] Design an explainable 0–100 Opportunity Score.
- [ ] Include **Demand** as one component.
- [ ] Include **Competition** as one component.
- [ ] Include **Expected Profit / ROI** as one component.
- [ ] Include **Historical Turnover** from the user's own data as one component.
- [ ] Include **Category performance** as one component once enough data exists.
- [ ] Include **Store/source performance** as an optional component once enough data exists.
- [ ] Make every score component visible so the score is not a black box.
- [ ] Fall back gracefully when historical data is sparse.
- [ ] Do not let a strong Amazon BSR override obviously poor economics.

### Analytics dashboard

- [ ] Add an overview dashboard.
- [ ] Show realized monthly profit.
- [ ] Show current inventory count and inventory cost.
- [ ] Show books sold this month.
- [ ] Show median days to sell.
- [ ] Show 30-day sell-through rate.
- [ ] Show average actual profit per sold book.
- [ ] Show estimated-vs-actual profit accuracy.
- [ ] Show top categories by profit.
- [ ] Show fastest categories by turnover.
- [ ] Show top sourcing locations by realized profit.
- [ ] Show slow/dead inventory requiring repricing or liquidation.
- [ ] Add filters for date range, category, store, and marketplace.

### Data-quality guardrails

- [ ] Separate Amazon demand signals from actual observed user sales.
- [ ] Keep scan-time estimates immutable for later backtesting.
- [ ] Require enough samples before drawing category/store conclusions.
- [ ] Show sample size beside every learned metric.
- [ ] Avoid exact monthly-sales estimates unless a source genuinely provides them.
- [ ] Prefer median values for turnover/profit summaries where outliers could mislead.

**Phase exit:** Look4Book can answer not only “Should I buy this book?” but also “What kinds of books should I spend my sourcing time on, where should I source them, and how quickly do they actually sell for me?”


---

## Post-MVP Backlog — Not Part of Current Scope

Do not start these until the core MVP has been used in the real world.

- Condition selector
- Automatic shipping-rate lookup
- Cover-photo identification when no ISBN exists
- AI-assisted edition matching
- Automated eBay/Amazon listing
- Multi-user accounts
- Subscription/SaaS features

---

## Project Guardrails

1. Prefer one reliable integration over three fragile integrations.
2. Do not block the MVP on perfect fee or shipping precision.
3. ISBN/barcode identification is the primary path; image recognition is post-MVP.
4. Do not add user authentication for a personal single-user MVP unless deployment security requires it.
5. Keep all pricing assumptions visible to the user.
6. Never call an asking price a market value without enough supporting comparables.
7. Update this file when a task is completed, removed, or deliberately moved out of scope.
