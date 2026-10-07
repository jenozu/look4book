# Look4Book — Current Project State

**Last updated:** 2026-10-07  
**Status:** Scanner + book-identification flow implemented and building successfully on Vercel.

## Completed

- Repository and 2nd Brain foundation are in place.
- Next.js 16.4 + React 19.3 + TypeScript + Tailwind scaffold is committed.
- Mobile-first eBayBay-derived pink/cyan/white/black UI is implemented.
- EAN-13 / ISBN-13 camera scanning is implemented with ZXing.
- Scanner prefers the rear-facing phone camera.
- ISBN-10 and ISBN-13 manual entry fallback is implemented.
- ISBN check-digit validation and normalization are implemented.
- Camera-denied, invalid-ISBN, stop/retry, and scan-again states are implemented.
- `getBookByISBN(isbn)` is implemented behind a provider boundary.
- Open Library is connected as the first no-key metadata provider.
- Book lookup returns title, authors, ISBN, publisher, publication date, page count, and cover when available.
- Book confirmation UI includes **Correct Book** and **Scan Again**.
- Unknown/missing metadata returns a readable recovery state.
- Vercel project `look4book` is linked to `jenozu/look4book`.
- Production builds compile successfully and pass Next.js TypeScript validation.

## Current deployment

Vercel project: `look4book`  
Git source: `jenozu/look4book` → `main`  
Primary Vercel alias: `look4book-jenozus-projects.vercel.app`

When the Git project was linked, Vercel treated `main` as the production branch, so the initial deployment went to the project's production target rather than remaining preview-only.

## Still needs physical-device verification

These cannot be truthfully marked complete without using a real phone/book:

1. Camera permission flow on the user's iPhone.
2. Successful scan of a physical ISBN-13 barcode.
3. Book identification across several common/uncommon physical books.

## Next development phase

**Phase 3 — Resale Pricing**

The recommended first marketplace is eBay. The app can be structured now, but live eBay marketplace lookup will require eBay application credentials configured as Vercel environment variables. Credentials must not be committed to Git.

Planned next work:

1. Define `MarketplaceResult`.
2. Build the eBay marketplace adapter.
3. Add outlier-resistant resale range calculation.
4. Add comparable count + confidence.
5. Connect the confirmed-book screen to resale pricing.

## Blocker for live marketplace data

Live eBay API authentication requires project credentials (client ID / client secret or the appropriate eBay application-token flow). No secrets are currently stored in this repository.

## Handoff rule

Any future agent should read, in order:

1. `.hermes.md`
2. `master_plan.md`
3. This file
4. `10-Strategy/PRD.md`
5. Relevant architecture/decision notes
