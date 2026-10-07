# 60 — Data Sources

Document external data providers here.

For each provider record:

- Purpose
- Authentication method
- Query identifier used (prefer ISBN)
- Important fields
- Rate limits/quotas
- Known data-quality issues
- Marketplace/country coverage
- Failure behavior
- Whether the integration is required for MVP

## Initial source strategy

1. One book-metadata provider for ISBN → book identity.
2. One reliable marketplace source for MVP resale comparables.
3. Add additional marketplaces only after the core flow works.
