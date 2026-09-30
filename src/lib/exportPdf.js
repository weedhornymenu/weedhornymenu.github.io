import { jsPDF } from 'jspdf'
import { toJpeg } from 'html-to-image'

const LABEL_PX = 610
const PAGE = { w: 210, h: 297 }
const MARGIN = 8
const GAP = 6
const COLS = 2
const ROWS = 3
const PER_PAGE = COLS * ROWS

export async function exportLabelsPdf(nodes, filename = 'product-labels.pdf', { save = true } = {}) {
  await document.fonts.ready

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const cellW = (PAGE.w - 2 * MARGIN - (COLS - 1) * GAP) / COLS
  const cellH = (PAGE.h - 2 * MARGIN - (ROWS - 1) * GAP) / ROWS
  const size = Math.min(cellW, cellH)
  const gridW = COLS * size + (COLS - 1) * GAP
  const gridH = ROWS * size + (ROWS - 1) * GAP
  const left = (PAGE.w - gridW) / 2
  const top = (PAGE.h - gridH) / 2

  for (let i = 0; i < nodes.length; i++) {
    if (i > 0 && i % PER_PAGE === 0) pdf.addPage()
    const dataUrl = await toJpeg(nodes[i], {
      width: LABEL_PX,
      height: LABEL_PX,
      pixelRatio: 3,
      quality: 0.95,
      bgcolor: '#ffffff',
      cacheBust: true
    })
    const slot = i % PER_PAGE
    const col = slot % COLS
    const row = Math.floor(slot / COLS)
    const x = left + col * (size + GAP)
    const y = top + row * (size + GAP)
    pdf.addImage(dataUrl, 'JPEG', x, y, size, size)
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.25)
    pdf.rect(x, y, size, size, 'S')
  }

  if (save) pdf.save(filename)
  return pdf
}
