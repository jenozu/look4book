# Amazon SP-API Setup — Look4Book

**Purpose:** Connect the private Look4Book app to the owner's own Amazon.ca seller account.

**Last verified:** 2026-10-07

## Cost

Amazon currently does **not** charge the SP-API annual developer subscription or per-call usage fees that were previously proposed. Amazon cancelled those fees in 2026.

For a private seller application, Amazon requires a **Professional Selling Account**. In Canada this is currently **CAD $29.99/month plus normal selling fees**.

The API integration itself therefore has no separate Amazon API charge at this time, but the Professional seller subscription is an ongoing cost.

## Roles Look4Book needs

Request only the non-restricted roles required for the personal sourcing tool:

- **Product Listing** — Catalog Items API / catalog lookup / sales-rank data.
- **Pricing** — Product Pricing API.
- The Product Fees workflow also requires the relevant Pricing/Product Listing permissions.

Look4Book does not need customer PII, Orders, restricted data, or an RDT.

## Registration path

### 1. Create or upgrade the Amazon.ca seller account

Use a Professional selling account.

Seller Central Canada:
https://sellercentral.amazon.ca

Amazon Canada selling plan information:
https://sell.amazon.ca/pricing

### 2. Open the developer registration area

Sign in as the **primary account user**.

In Seller Central:

**Apps and Services → Develop Apps**

If Amazon has moved the account to Solution Provider Portal, use:

**Solution Provider Portal → Settings → Developer Profile**

Choose:

**Private Developer: I build application(s) that integrate my own company with Amazon Services APIs.**

### 3. Complete the Developer Profile

Use the real personal/business information associated with the seller account.

Suggested Look4Book use-case description:

> Look4Book is a private, single-user sourcing application used only by my own Amazon seller account. It scans ISBNs on used books and uses Amazon catalog, pricing, sales-rank, and fee-estimate data to help me evaluate whether a book is worth purchasing for resale. The application does not access customer personal information, orders, payment data, or restricted data, and it is not offered to third parties.

For security controls, answer truthfully based on the deployment:

- Secrets are stored as encrypted Vercel environment variables.
- Secrets are not exposed to the browser/client.
- Credentials are not committed to GitHub.
- API calls are made server-side.
- The app does not request or store customer PII.

Do not copy Amazon policy wording into the application. Amazon asks developers to describe their own implementation.

### 4. Register the private application

After the developer profile is approved:

**Develop Apps → Add new app client**

Create a **private seller application**.

Suggested app name:

**Look4Book**

Select only the roles required for this tool:

- Product Listing
- Pricing

Do not select unrelated restricted roles.

### 5. Self-authorize Look4Book

Private apps do not need to be published in the Selling Partner Appstore.

Use Amazon's **self-authorization** option for your own seller account. This generates the LWA refresh token Look4Book needs.

Keep the resulting refresh token private.

### 6. Retrieve the LWA credentials

From the application details/credentials screen, obtain:

- LWA Client ID
- LWA Client Secret

After self-authorization, obtain:

- LWA Refresh Token

Look4Book does **not** use the older AWS IAM / Signature Version 4 integration pattern. Amazon's current SP-API connection documentation shows requests using the LWA access token and SP-API headers without signing information.

### 7. Add credentials to Vercel

Open:

**Vercel → look4book → Settings → Environment Variables**

Add:

```text
AMAZON_SPAPI_LWA_CLIENT_ID=<your LWA client id>
AMAZON_SPAPI_LWA_CLIENT_SECRET=<your LWA client secret>
AMAZON_SPAPI_REFRESH_TOKEN=<your self-authorization refresh token>
AMAZON_SPAPI_MARKETPLACE_ID=A2EUQ1WTGCTBG2
AMAZON_SPAPI_ENDPOINT=https://sellingpartnerapi-na.amazon.com
```

Apply them to **Production**. Preview and Development can also be selected if desired.

Never commit the real values to `.env.example`, GitHub, screenshots, or chat.

### 8. Redeploy Look4Book

After adding the environment variables, redeploy the latest `main` deployment.

The Amazon card should then return, when available:

- ASIN
- used-offer price range
- used-offer count
- Amazon sales rank
- sales-rank category
- Amazon fee estimate
- Amazon estimated net profit / ROI

## Amazon.ca constants

- SP-API region: North America
- Endpoint: `https://sellingpartnerapi-na.amazon.com`
- Amazon.ca Marketplace ID: `A2EUQ1WTGCTBG2`
- Currency: CAD
- Pricing condition: Used
- Fee estimate: merchant fulfilled for the MVP

## APIs used

### Catalog Items API v2022-04-01
ISBN → ASIN + sales rank.

### Product Pricing API v0
ASIN → current used offers.

### Product Fees API v0
ASIN + proposed sale price → Amazon fee estimate.

## Important limitation

Amazon sales rank is a useful demand signal, but it is **not an exact monthly-sales count**. Look4Book displays the rank instead of inventing an exact sales velocity.

Current Amazon offers are also offer/asking data rather than completed-sale history.

## Official references

- https://developer-docs.amazon.com/sp-api/docs/sp-api-registration-overview
- https://developer-docs.amazon.com/sp-api/docs/register-as-a-private-developer
- https://developer-docs.amazon.com/sp-api/docs/registering-your-application
- https://developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api
- https://developer-docs.amazon.com/sp-api/reference/searchcatalogitems
- https://developer-docs.amazon.com/sp-api/reference/getitemoffers
- https://developer-docs.amazon.com/sp-api/reference/getmyfeesestimateforasin
- https://developer.amazonservices.com/cancellation-of-sp-api-fees
