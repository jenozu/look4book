# Look4Book 2nd Brain Schema

The 2nd Brain is intentionally lightweight. Save durable knowledge, not routine chatter.

## Folder structure

```text
00-Inbox/
10-Strategy/
20-Architecture/
30-Decisions/
40-Research/
50-Backtests/
60-Data-Sources/
70-Project-State/
80-Glossary/
90-Sources/
Templates/
```

## Folder purposes

### 00-Inbox
Unsorted ideas, questions, rough notes, and things that need triage.

### 10-Strategy
Product goals, PRD, MVP scope, success criteria, and business/product assumptions.

### 20-Architecture
System design, data models, technical boundaries, UI system, and implementation patterns.

### 30-Decisions
Durable technical/product decisions. Prefer one Markdown note per meaningful decision.

### 40-Research
API research, barcode/library notes, marketplace research, shipping/fee research, and experiments.

### 50-Backtests
Validation of pricing logic using known books, expected prices, edge cases, and later real purchase/sale outcomes.

### 60-Data-Sources
Marketplace APIs, metadata providers, identifiers, field mappings, rate limits, and data-quality notes.

### 70-Project-State
Current verified state, what works, what is blocked, and what should happen next.

### 80-Glossary
Project-specific terminology such as ISBN-10, ISBN-13, EAN-13, comparable, ROI, and confidence.

### 90-Sources
Durable external references worth keeping.

### Templates
Reusable decision, research, and test-note templates.

## Note conventions

- Use Markdown.
- Prefer descriptive filenames.
- Use `[[wikilinks]]` when useful.
- Record decisions and durable findings, not routine logs.
- Code/tests/configuration override stale notes.
- Keep `70-Project-State/current-state.md` current after meaningful implementation work.
