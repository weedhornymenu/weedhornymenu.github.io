# Label design specification

The label is a fixed **610 × 610 px** white card (`src/components/LabelCard.vue`), rendered identically in the live preview and in the off-screen export stage. All lengths below are CSS pixels at that canvas size.

## Anatomy (top → bottom)

| # | Section          | Contents                                                                                     |
|---|------------------|----------------------------------------------------------------------------------------------|
| 1 | Header (static)  | Logo circle 70 px + company wordmark + tagline rule row                                       |
| 2 | Product name     | Uppercase Montserrat 800, size class Big / Medium / Small                                     |
| 3 | THC + Type       | THC percentage (left) and strain-type pill (right), separated by a vertical rule              |
| 4 | Effects          | Bullet-separated effect words                                                                 |
| 5 | Price table      | Fixed tiers 1/10/30 G (left column) and 50/100 G (right column) with editable amounts         |

Horizontal rules (2 px) separate sections 1–4; the price table is pinned to the bottom of the card.

## Typography

| Element        | Font                    | Weight | Size  | Notes                                  |
|----------------|-------------------------|--------|-------|----------------------------------------|
| Company name   | Montserrat              | 900    | 40 px | letter-spacing 6 px, nowrap            |
| Tagline        | Montserrat              | 600    | 10 px | letter-spacing 1.1 px, flex rule lines |
| Product name   | Montserrat              | 800    | 58 / 36 / 26 px | Big / Medium / Small; letter-spacing 0.5 px |
| Section tags (THC, TYPE, EFFECTS, PRICE) | Montserrat | 700 | 18 px (17 px in price header) | |
| THC value      | Montserrat              | 800    | 46 px |                                        |
| Type pill text | Montserrat              | 700    | 20 px | white, letter-spacing 0.8 px           |
| Effects list   | Inter                   | 600    | 26 px | bullets spaced 12 px                   |
| Price rows     | Inter                   | 700    | 25 px | amounts right-aligned, `en-US` grouping + ` ฿` |

Fonts are self-hosted via `@fontsource` (no CDN): Montserrat 500–800, Inter 600/700, plus **Noto Sans Thai** 600/700 as fallback for the ฿ sign (Inter has no Thai subset).

## Colors

| Token            | Hex       | Used for                                        |
|------------------|-----------|-------------------------------------------------|
| Primary green    | `#005116` | all text, product name, THC value               |
| Rule green       | `#68a879` | horizontal/vertical rules, tagline lines        |
| Box border       | `#7bb389` | price table outline                             |
| Price header     | `#2e5e3a` | price table header bar                          |
| Sativa pill      | `#d84747` | type pill + table badge                         |
| Indica pill      | `#475fd8` | type pill + table badge                         |
| Hybrid pill      | `#44b948` | type pill + table badge                         |
| Background       | `#ffffff` | label canvas                                    |

## Product name sizing rules

- `Auto` (default): name length ≤ 12 chars → Big (58 px), ≤ 22 → Medium (36 px), else Small (26 px).
- Manual override available in the form (Big / Medium / Small).
- Shrink guard: after render, if the name overflows its 554 px row it is scaled down proportionally (`fitName()` in `LabelCard.vue`), so long names never clip.

## Type pill

- Height 38 px, fully rounded (radius 19 px), spans the type column.
- Text: `SATIVA DOMINANT` / `INDICA DOMINANT` / `HYBRID`.

## Price table

- Outline 1.5 px `#7bb389`, radius 10 px, total height 175 px.
- Header bar `#2e5e3a` with white `PRICE` tag.
- Two columns split by a 2 px rule; each row is a 3-track grid (quantity / dash / amount).
- Tier quantities are static; only amounts are user-editable.

## Logo

`src/assets/logo.png` — 89 × 89 px crop of the circular emblem from the original artwork (`MainProductLabelSativa.png`, region x 28, y 26), displayed at 70 px with `border-radius: 50%`.
