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

- [ ] Scaffold a Next.js + TypeScript application.
- [ ] Add Tailwind CSS.
- [ ] Build the mobile-first scanner screen.
- [ ] Request phone-camera permission cleanly.
- [ ] Integrate browser barcode scanning for EAN-13 / ISBN-13.
- [ ] Validate and normalize scanned ISBN values.
- [ ] Add manual ISBN entry as a fallback.
- [ ] Add clear scan-success, scan-failure, and retry states.
- [ ] Test barcode scanning on a real phone.

**Phase exit:** A physical book barcode reliably produces a normalized ISBN.

---

## Phase 2 — Book Identification

- [ ] Create a `getBookByISBN(isbn)` service boundary.
- [ ] Connect one book-metadata provider.
- [ ] Return title, author, and ISBN.
- [ ] Display cover, publisher, edition, and publication date when available.
- [ ] Build the book-confirmation screen.
- [ ] Add **Correct Book** and **Scan Again** actions.
- [ ] Handle unknown or incomplete ISBN results gracefully.
- [ ] Test several common and uncommon books.

**Phase exit:** A scanned ISBN shows the correct book and lets me confirm it.

---

## Phase 3 — Resale Pricing

- [ ] Define a normalized `MarketplaceResult` model.
- [ ] Build the first marketplace adapter, with eBay as the preferred first source.
- [ ] Search marketplace data using the exact ISBN whenever possible.
- [ ] Extract usable comparable prices.
- [ ] Exclude obvious pricing outliers.
- [ ] Calculate low, median, and high resale estimates.
- [ ] Return listing/comparable count when available.
- [ ] Reduce confidence when market data is sparse.
- [ ] Keep marketplace adapters independent so another source can be added later.
- [ ] Add a second pricing source only if it can be integrated without bloating the MVP.

**Phase exit:** An ISBN can produce a defensible resale-value range from at least one useful marketplace source.

---

## Phase 4 — Profit & Buy/Pass Engine

- [ ] Add thrift-store purchase-price input in CAD.
- [ ] Add configurable default shipping cost.
- [ ] Add configurable marketplace fee percentages.
- [ ] Calculate estimated net profit.
- [ ] Calculate ROI.
- [ ] Add configurable minimum-profit threshold.
- [ ] Add configurable minimum-ROI threshold.
- [ ] Implement BUY / MAYBE / PASS rules.
- [ ] Implement HIGH / MEDIUM / LOW confidence.
- [ ] Show which marketplace currently looks best.
- [ ] Make calculations deterministic and unit-test them.

### Initial recommendation defaults

- **BUY:** estimated profit ≥ $15 CAD and ROI ≥ 75%.
- **MAYBE:** estimated profit ≥ $7 CAD or confidence is limited.
- **PASS:** estimated profit < $7 CAD or likely margin is too weak.

These are starting values and must remain configurable.

**Phase exit:** A scan plus purchase price produces a transparent profitability recommendation.

---

## Phase 5 — Mobile UI & PWA

- [ ] Implement the approved Look4Book theme tokens globally.
- [ ] Use bubblegum pink as the app canvas.
- [ ] Use cyan for primary actions.
- [ ] Use white surfaces with strong black borders and offset shadows.
- [ ] Build the four core views: Scanner, Book Confirmation, Purchase Price, Result.
- [ ] Keep primary mobile touch targets at least ~44px.
- [ ] Make **Scan Another** a prominent result-screen action.
- [ ] Add loading states while metadata and prices are fetched.
- [ ] Add readable error states without breaking the scan flow.
- [ ] Add PWA manifest and installability.
- [ ] Test the full flow at phone width.

**Phase exit:** The app is fast and comfortable to use while standing in a thrift store.

---

## Phase 6 — MVP QA & Deployment

- [ ] Add environment-variable documentation.
- [ ] Ensure secrets are never committed.
- [ ] Add unit tests for ISBN normalization.
- [ ] Add unit tests for pricing/outlier logic.
- [ ] Add unit tests for fee, profit, ROI, and recommendation logic.
- [ ] Test missing marketplace data.
- [ ] Test camera denial and manual-entry fallback.
- [ ] Test slow or failed third-party requests.
- [ ] Run production build and typecheck.
- [ ] Deploy to Vercel.
- [ ] Test the deployed app on a real phone using real thrift-store books.
- [ ] Update `70-Project-State/current-state.md` with the verified MVP state.

**Phase exit:** The deployed app can be used for real-world sourcing.

---

## Post-MVP Backlog — Not Part of Current Scope

Do not start these until the core MVP has been used in the real world.

- Scan history
- Purchase tracking
- Condition selector
- Actual-sale tracking
- Estimated-vs-actual profit
- Inventory management
- Sell-through / demand scoring
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
