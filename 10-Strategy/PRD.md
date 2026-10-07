# Look4Book — Lean MVP PRD

## Product summary

Look4Book is a mobile-first personal web app for evaluating used books while sourcing at thrift stores.

The intended flow is:

> **Scan ISBN → identify book → enter store price → estimate resale → BUY / MAYBE / PASS**

## Problem

Checking a used book manually requires searching the exact edition, comparing resale prices, estimating fees and shipping, and deciding whether enough profit remains. Doing that repeatedly in a store is slow.

## Primary user

One user. No multi-user SaaS requirements.

## Primary device

Smartphone.

## Core MVP requirements

### 1. ISBN scanning
- Open the phone camera from the web app.
- Recognize EAN-13 / ISBN-13 barcodes.
- Normalize the ISBN.
- Provide manual ISBN entry if scanning fails.

### 2. Book identification
At minimum display:
- Title
- Author
- ISBN

When available also display:
- Cover
- Edition
- Publisher
- Publication year

The user must be able to confirm the detected book or scan again.

### 3. Purchase price
Ask for the thrift-store purchase price in CAD.

### 4. Resale pricing
- Search at least one useful marketplace source.
- Prefer exact ISBN matches.
- Estimate a realistic resale range.
- Avoid letting obvious outliers dominate the estimate.
- Show reduced confidence when data is sparse.

### 5. Profit calculation
Approximate:

`Net profit = resale price - marketplace fees - shipping - purchase price`

Also calculate ROI.

### 6. Recommendation
Return:
- **BUY**
- **MAYBE**
- **PASS**

Starting defaults:
- BUY: profit ≥ $15 CAD and ROI ≥ 75%
- MAYBE: profit ≥ $7 CAD or confidence is limited
- PASS: profit < $7 CAD or the margin is weak

Thresholds must remain configurable.

### 7. Confidence
Return HIGH, MEDIUM, or LOW confidence based on match quality and available pricing evidence.

## Core screens

1. Scanner
2. Book Confirmation
3. Purchase Price
4. Result

## Result screen

Show:
- Book
- Purchase price
- Estimated resale range
- Estimated net profit range
- ROI
- Confidence
- Marketplace pricing used
- BUY / MAYBE / PASS
- **Scan Another**

## Initial technical direction

- Next.js
- TypeScript
- Tailwind CSS
- Next.js server/API routes
- PWA/mobile-first
- Vercel deployment
- Database not required for the first functional version

## Out of scope

- Accounts
- Subscriptions
- Full inventory management
- Automated listing creation
- Tax/accounting
- Sales dashboards
- Native iOS/Android apps
- AI cover recognition
- Automatic condition grading
- Automatic shipping labels
- Batch scanning

## Success criterion

The MVP succeeds when it is meaningfully faster than manually searching marketplaces on a phone and can produce a useful scan-to-decision result for real thrift-store books.
