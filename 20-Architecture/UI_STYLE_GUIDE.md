# Look4Book — UI Style Guide

**Status:** Approved MVP direction  
**Source:** Reuses the eBayBay visual palette and neo-brutalist component language.

## Visual direction

Use a playful but practical neo-brutalist mobile interface:

- thick black borders
- solid black offset shadows
- rounded but clearly outlined controls
- bright pastel panels
- high-contrast black typography
- restrained pink/cyan/lilac accents
- large phone-friendly actions
- white surfaces for dense book/pricing information

The app should feel distinctive without slowing down repeated scanning.

## Color palette

| Token | Name | Hex | Usage |
|---|---|---:|---|
| `--brand-pink` | Bubblegum Pink | `#FFD8E8` | App canvas, brand background |
| `--ink` | Solid Black | `#000000` | Borders, shadows, headings |
| `--surface` | Pure White | `#FFFFFF` | Cards, forms, result surfaces |
| `--cta-cyan` | Pastel Cyan | `#9BE9FB` | Primary buttons, BUY emphasis |
| `--cta-cyan-hover` | Soft Cyan | `#83DFEF` | Hover/pressed primary action |
| `--lilac` | Pastel Lilac | `#FAE8FF` | Secondary actions, MAYBE/supporting panels |
| `--ice-blue` | Soft Ice Blue | `#EBF8FF` | Selected states, informational backgrounds |
| `--rose-muted` | Candy Rose | `#F6BED5` | Secondary pink accents |
| `--danger` | Danger Crimson | `#CC0000` | Actual errors/destructive warnings |
| `--danger-bright` | Bright Red | `#E02424` | Critical errors |
| `--neutral-light` | Off White | `#FBFBFB` | Inputs/page sections |
| `--neutral-divider` | Light Grey | `#F1F1F1` | Dividers |

### CSS variables

```css
:root {
  --brand-pink: #FFD8E8;
  --ink: #000000;
  --surface: #FFFFFF;
  --cta-cyan: #9BE9FB;
  --cta-cyan-hover: #83DFEF;
  --lilac: #FAE8FF;
  --ice-blue: #EBF8FF;
  --rose-muted: #F6BED5;
  --danger: #CC0000;
  --danger-bright: #E02424;
  --neutral-light: #FBFBFB;
  --neutral-divider: #F1F1F1;
}
```

## Component rules

### Borders

```css
border: 2px solid var(--ink);
```

Reserve 4px borders for major framing/emphasis.

### Shadows

```css
box-shadow: 4px 4px 0 var(--ink);
```

Pressed state:

```css
transform: translate(2px, 2px);
box-shadow: 2px 2px 0 var(--ink);
```

### Radius

- Inputs: 10–12px
- Buttons: 12–16px
- Cards: 14–18px
- Major panels: 16–22px
- Pills/chips: 999px

## Typography

Use a clean system sans-serif stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             "Segoe UI", sans-serif;
```

Prioritize fast scanning of prices, ISBNs, profit, and recommendation over decorative type.

## Core screen treatment

### Scanner
- Pink canvas
- Large white camera/scanner panel
- Cyan **Scan Book** action
- Manual ISBN as secondary white/lilac action

### Book confirmation
- White card
- Large title
- Visible ISBN
- Book cover when available
- Cyan **Correct Book**
- White/lilac **Scan Again**

### Purchase price
- Large numeric input
- CAD label visible
- Cyan **Check Resale Value**

### Result
The recommendation must dominate the screen.

Suggested mapping:

- **BUY:** cyan panel with black text/border
- **MAYBE:** lilac or pink panel with black text/border
- **PASS:** white/rose-muted treatment with strong black text

Do not use error red simply because a book is a PASS. Red is reserved for actual application errors or destructive actions.

## Mobile requirements

- Minimum comfortable touch target: ~44px.
- No horizontal scrolling.
- Primary actions should be large/full-width where useful.
- Keep **Scan Another** easy to reach.
- Pricing and profit numbers should be visually prominent.
- Preserve strong contrast in bright store lighting.

## Accessibility

- Never communicate recommendation/confidence by color alone.
- Keep visible text labels.
- Preserve keyboard focus.
- Use semantic form labels.
- Keep black text on pale/white backgrounds.
- Error messages must explain the issue in text.

## Implementation rule

Define theme tokens centrally. Do not scatter raw hex values throughout components.
