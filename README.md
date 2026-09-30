# Happy Thai Herb — Product Label Studio

A Vue 3 web app for creating cannabis product labels for **Happy Thai Herb Co.,Ltd** and exporting them as print-ready A4 PDF sheets.

The label design replicates the company's existing artwork (logo header, product name, THC/type row, effects list and price table). Labels are built with a form, previewed live, collected in a list, and exported six per A4 page with black cut-guide borders.

## Features

- **Label form** — product name, THC %, strain type (Sativa / Indica / Hybrid), effects list and the five fixed price tiers (1 G / 10 G / 30 G / 50 G / 100 G).
- **Live preview** — the label updates as you type, at true 610 × 610 px proportions (scaled to fit narrow screens).
- **Automatic name sizing** — the product name font size picks Big / Medium / Small from the name length, with a manual override and a shrink guard so long names never clip.
- **Label list** — submitted labels appear in a table (with per-row remove); submitting resets the form.
- **PDF export** — one click produces an A4 portrait PDF with up to **6 labels per page** (2 columns × 3 rows), each label framed by a thin black cut-guide border.

## Tech stack

| Purpose            | Tool                                              |
| ------------------ | ------------------------------------------------- |
| Framework          | Vue 3 (Composition API, `<script setup>`)          |
| Build tool         | Vite                                               |
| PDF generation     | jsPDF                                              |
| Label snapshotting | html-to-image (DOM → JPEG)                         |
| Fonts              | @fontsource Montserrat, Inter, Noto Sans Thai (self-hosted, no CDN) |

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # start dev server on http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

## Using the app

1. **Fill the form** (left panel). The preview on the right updates instantly.
   - *Product name* — required; rendered uppercase on the label.
   - *THC (%)* — required number, 0–100.
   - *Type* — Sativa Dominant (red pill), Indica Dominant (blue pill), Hybrid (green pill).
   - *Name font size* — `Auto` picks by length (≤ 12 chars Big, ≤ 22 Medium, else Small); you can force Big/Medium/Small.
   - *Effects* — comma-separated; rendered as a bullet-separated row.
   - *Prices* — the five tier quantities are fixed; only the amounts are editable. Amounts are formatted with thousand separators and a ฿ suffix.
2. **Add to label list** — appends the label to the table below and resets the form.
3. **Export PDF** — captures every label in the list and downloads `product-labels.pdf`. The button shows *Exporting…* while captures run and is disabled when the list is empty.

## PDF output

- A4 portrait (210 × 297 mm), 6 labels per page in a centered 2 × 3 grid.
- Each label ≈ 89.7 × 89.7 mm with 6 mm gaps and 8 mm page margins.
- Labels are rasterized at 1830 × 1830 px (pixelRatio 3, JPEG quality 0.95) for crisp print.
- A 0.25 mm black rectangle is drawn around every label as a cutting guide.
- Overflow labels continue on the next page (label 7 starts page 2, slot 1).

See [docs/label-design.md](docs/label-design.md) for the label anatomy/colors and [docs/pdf-export.md](docs/pdf-export.md) for the export pipeline details.

## Project structure

```
index.html
vite.config.js
src/
  main.js                  # app bootstrap + font imports
  style.css                # global styles
  App.vue                  # page layout, label state, preview scaling, export stage
  components/
    LabelCard.vue          # the 610×610 label (also used off-screen for export captures)
    LabelForm.vue          # input form (controlled by App state)
    LabelsTable.vue        # submitted-labels table
  lib/
    exportPdf.js           # jsPDF + html-to-image A4 sheet builder
  assets/
    logo.png               # company logo (cropped from the original artwork)
```

## Notes & troubleshooting

- **First export is slow** (≈ 10–15 s in dev): html-to-image embeds the web fonts on the first capture of a session; later captures take ~0.1 s each. Production builds are faster.
- **฿ glyph**: Inter ships no Thai subset, so Noto Sans Thai is bundled as a fallback to guarantee the baht sign renders identically everywhere and inside PDF captures.
- **Download name** is always `product-labels.pdf`; repeated exports overwrite the previous file in your Downloads folder.
- The hidden `.export-stage` container renders one full-size copy of every submitted label off-screen; PDF export snapshots those nodes, so what you see in the preview is exactly what prints.
