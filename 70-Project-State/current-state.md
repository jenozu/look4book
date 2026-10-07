# Look4Book — Current Project State

**Last updated:** 2026-10-07  
**Status:** Core MVP implementation is complete through resale recommendation. Live eBay pricing credentials and physical iPhone/book verification remain.

## Implemented

### Scanner
- Next.js 16.4 + React 19.3 + TypeScript + Tailwind.
- Mobile-first eBayBay-derived pink/cyan/white/black visual system.
- ZXing browser camera scanning for EAN-13 / ISBN-13.
- Rear-camera preference.
- ISBN-10 / ISBN-13 manual fallback.
- ISBN validation, normalization, and ISBN-10 → ISBN-13 conversion.
- Camera denied, invalid ISBN, stop/retry, and scan-again recovery states.

### Book identification
- `getBookByISBN(isbn)` provider boundary.
- Open Library metadata adapter with no API key required.
- Title, author, ISBN, publisher, publication date, page count, and cover when available.
- Book confirmation screen with **Correct Book** / **Scan Again**.
- Missing-book and provider-error states.

### Resale pricing
- Normalized `MarketplaceResult` model.
- eBay Browse API adapter using application OAuth client credentials.
- Exact ISBN/GTIN lookup for used listings.
- Canadian marketplace defaults to `EBAY_CA`.
- Only CAD comparables are used for the Canadian profit calculation.
- IQR outlier filtering.
- Low / median / high active-listing estimate.
- Comparable count.
- Sparse-data confidence reduction.
- Active asking-price estimates are deliberately capped at MEDIUM confidence because they are not completed-sales history.
- Graceful setup state when eBay credentials are not configured.

### Profit / decision engine
- Purchase price input in CAD.
- Initial shipping assumption: $12 CAD.
- Approximate eBay book fee model: 15.3% plus per-order fee.
- Net-profit calculation.
- ROI calculation.
- BUY / MAYBE / PASS recommendation.
- Initial BUY threshold: profit ≥ $15 CAD, ROI ≥ 75%, and confidence above LOW.
- Central constants make thresholds/assumptions easy to change later.

### QA
- Vitest is installed.
- Production builds run unit tests before Next.js build.
- Unit tests cover:
  - ISBN validation/normalization/conversion.
  - Outlier filtering and active-listing summarization.
  - Fee calculation.
  - Profit and ROI.
  - BUY/MAYBE/PASS confidence behavior.
- Test-gated Vercel deployment reached READY successfully.
- TypeScript and Next.js production compilation pass.

### PWA
- Web app manifest added.
- Look4Book app icon added.
- Standalone/home-screen metadata added.
- Pink theme/background configured.

## Deployment

Vercel project: `look4book`  
Git source: `jenozu/look4book` → `main`  
Primary alias: `https://look4book-jenozus-projects.vercel.app`

Vercel treats `main` as this project's production branch, so pushes to `main` deploy automatically.

## What I still need from the user

### 1. eBay production credentials
The pricing adapter is built, but live eBay data cannot run until these are configured securely in Vercel:

- `EBAY_CLIENT_ID`
- `EBAY_CLIENT_SECRET`
- `EBAY_MARKETPLACE_ID=EBAY_CA` (optional; this is already the code default)

Do **not** commit or paste secrets into GitHub/chat. Add them directly in Vercel project environment settings.

### 2. Physical iPhone/book verification
Still unverified:
- Camera permission flow on the user's iPhone.
- Successful physical ISBN barcode scan.
- Metadata accuracy across several real books.
- Full scan → confirm → price → recommendation flow on-device after eBay credentials are connected.

## Known MVP limitation

The standard eBay Browse integration currently uses **active asking prices**, not completed/sold prices. The UI communicates this and caps confidence at MEDIUM. A future data source for sold-history / sell-through would materially improve valuation quality.

## Next recommended action

Configure the eBay credentials in Vercel, redeploy, then test one real book end-to-end on the user's iPhone.

## Handoff order

1. `.hermes.md`
2. `master_plan.md`
3. This file
4. `10-Strategy/PRD.md`
5. Relevant architecture/decision notes
