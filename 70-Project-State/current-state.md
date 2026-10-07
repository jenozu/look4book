# Look4Book — Current Project State

**Last updated:** 2026-10-07  
**Status:** Planning foundation complete; application implementation not started.

## Completed

- Repository exists at `jenozu/look4book`.
- Lean MVP scope is defined.
- Master task list exists in `master_plan.md`.
- 2nd Brain folder structure is initialized.
- PRD is stored in `10-Strategy/PRD.md`.
- UI direction is stored in `20-Architecture/UI_STYLE_GUIDE.md`.
- Look4Book uses the same core palette as eBayBay:
  - Pink `#FFD8E8`
  - Cyan `#9BE9FB`
  - White `#FFFFFF`
  - Black `#000000`

## Verified product direction

Primary flow:

`Scan ISBN → identify book → enter thrift price → estimate resale → BUY / MAYBE / PASS`

The MVP is single-user, mobile-first, and intentionally does not include inventory management, automated listings, accounts, subscriptions, or AI cover recognition.

## Next task

Start **Phase 1 — ISBN Scanner**:

1. Scaffold Next.js + TypeScript.
2. Add Tailwind.
3. Build the mobile scanner view.
4. Integrate EAN-13 / ISBN-13 camera scanning.
5. Add manual ISBN fallback.

## Blockers

None currently documented.

## Handoff rule

Any future agent should read, in order:

1. `.hermes.md`
2. `master_plan.md`
3. This file
4. `10-Strategy/PRD.md`
5. Relevant architecture/decision notes
