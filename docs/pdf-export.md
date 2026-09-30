# PDF export pipeline

Implementation: `src/lib/exportPdf.js`, triggered from the *Export PDF* button in `src/App.vue`.

## Flow

1. `App.vue` keeps a hidden `.export-stage` container (fixed, off-screen at `left: -10000px`) that renders one full-size `LabelCard` per submitted label. Function refs collect each card's root element.
2. On export, the card DOM nodes are passed to `exportLabelsPdf(nodes, filename, { save })`.
3. Each node is rasterized with **html-to-image** `toJpeg`:
   - `width/height`: 610 px (the label canvas)
   - `pixelRatio: 3` → 1830 × 1830 px raster (~500 dpi at the printed size)
   - `quality: 0.95`, `bgcolor: '#ffffff'`
   - Web fonts are embedded automatically by html-to-image (same-origin `@fontsource` files, so no CORS issues).
4. Rasters are placed into a **jsPDF** A4 portrait document (210 × 297 mm).
5. `pdf.save('product-labels.pdf')` downloads the file (skipped when `save: false`, used by tests).

JPEG (not PNG) is deliberate: jsPDF stores JPEGs as-is (DCTDecode), while RGBA PNGs are expanded to raw RGB and produced ~50 MB files for 5 labels. JPEG at q0.95 keeps the sheet around 0.2–0.3 MB per label.

## Page geometry

| Parameter     | Value                                   |
|---------------|-----------------------------------------|
| Page          | A4 portrait, 210 × 297 mm               |
| Grid          | 2 columns × 3 rows = 6 labels per page  |
| Page margin   | 8 mm                                    |
| Gap           | 6 mm (both axes)                        |
| Cell          | 94 × 89.67 mm                           |
| Label size    | 89.67 × 89.67 mm (square, `min(cellW, cellH)`) |
| Grid origin   | centered: `left = (210 − gridW)/2`, `top = (297 − gridH)/2` |
| Cut guide     | 0.25 mm black rectangle (`pdf.rect(..., 'S')`) drawn around each label slot |

Slot order is row-major: index `i` → page `floor(i/6)`, column `i%6 % 2`, row `floor(i%6 / 2)`. A new page is added whenever `i % 6 === 0`.

## Performance notes

- `await document.fonts.ready` runs once before capturing.
- The **first** capture in a session is slow (≈ 10–15 s in dev) because html-to-image parses every stylesheet and inlines all `@font-face` sources; subsequent captures are ~0.1 s each. Production builds bundle fewer stylesheets and are faster.
- The export button is disabled while `exporting` is true and shows *Exporting…*.

## Verifying output

Without poppler installed, pages can be rasterized on Windows with the built-in `Windows.Data.Pdf` WinRT API from PowerShell (`PdfDocument.LoadFromFileAsync` → `page.RenderToStreamAsync`), which is how the layout was validated during development.
