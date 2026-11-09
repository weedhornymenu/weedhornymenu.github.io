import * as XLSX from 'xlsx'
import { PRICE_PRESETS } from './pricePresets.js'

function normType(raw) {
  const t = String(raw || '').trim().toLowerCase()
  if (t.includes('domin')) {
    if (t.includes('sativa')) return 'sativaD'
    if (t.includes('indica')) return 'indicaD'
  }
  if (t.includes('hybrid')) return 'hybrid'
  if (t.includes('sativa')) return 'sativa'
  if (t.includes('indica')) return 'indica'
  return 'hybrid'
}

function toThc(v) {
  let n = Number(v)
  if (!Number.isFinite(n)) return ''
  if (n > 0 && n <= 1) n *= 100
  return Math.round(n * 10) / 10
}

function toNum(v) {
  if (typeof v === 'string') v = v.replace(/[,\s฿]/g, '')
  const n = Number(v)
  return Number.isFinite(n) && v !== '' ? Math.round(n * 100) / 100 : ''
}

function toPrices(row, idx) {
  const { iG1, iG10, iG30, iG50, iG100, iPrice } = idx
  if (iG1 !== -1) {
    return {
      g1: toNum(row[iG1]),
      g10: iG10 === -1 ? '' : toNum(row[iG10]),
      g30: iG30 === -1 ? '' : toNum(row[iG30]),
      g50: iG50 === -1 ? '' : toNum(row[iG50]),
      g100: iG100 === -1 ? '' : toNum(row[iG100])
    }
  }
  const n = Number(row[iPrice])
  const preset = iPrice !== -1 && PRICE_PRESETS.find((p) => p.prices.g1 === n)
  if (preset) return { ...preset.prices }
  return { g1: iPrice !== -1 && Number.isFinite(n) ? n : '', g10: '', g30: '', g50: '', g100: '' }
}

export function parseMenuWorkbook(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  if (!ws) throw new Error('The file has no sheets.')

  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  if (!rows.length) throw new Error('The sheet is empty.')

  const header = rows[0].map((h) => String(h).trim().toLowerCase())
  const iName = header.indexOf('name')
  const iThc = header.indexOf('thc')
  const iType = header.indexOf('type')
  const iEffects = header.indexOf('effects')
  const priceIdx = {
    iG1: header.indexOf('1g'),
    iG10: header.indexOf('10g'),
    iG30: header.indexOf('30g'),
    iG50: header.indexOf('50g'),
    iG100: header.indexOf('100g'),
    iPrice: header.indexOf('price')
  }
  if (iName === -1) throw new Error('Missing "NAME" column.')

  const labels = []
  for (const r of rows.slice(1)) {
    const name = String(r[iName] ?? '').trim()
    if (!name) continue
    labels.push({
      name,
      fontSize: 'auto',
      thc: iThc === -1 ? '' : toThc(r[iThc]),
      type: normType(iType === -1 ? '' : r[iType]),
      effects: String(iEffects === -1 ? '' : r[iEffects])
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      prices: toPrices(r, priceIdx)
    })
  }
  return labels
}
