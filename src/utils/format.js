export const cn = (...values) =>
  values.flat(Infinity).filter((value) => typeof value === 'string' && value.trim()).join(' ')

export const money = (amount) => `$${Number(amount || 0).toFixed(2)}`

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

export const createId = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`

export const createBookingReference = (prefix) =>
  `${prefix}-${new Date().getFullYear()}${String(Math.floor(Math.random() * 900000) + 100000)}`

export const downloadFile = (filename, content, type = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const exportCsv = (filename, rows) => {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((key) => escape(row[key])).join(','))].join('\r\n')
  downloadFile(filename, `\uFEFF${csv}`, 'text/csv;charset=utf-8')
}

export const statusTone = (status) => {
  const map = {
    ACTIVE: 'success',
    PAID: 'success',
    VERIFIED: 'success',
    CONFIRMED: 'brand',
    COMPLETED: 'brand',
    PENDING: 'warning',
    PROOF_UPLOADED: 'warning',
    MAINTENANCE: 'warning',
    CANCELLED: 'danger',
    FAILED: 'danger',
    INACTIVE: 'neutral',
    FULL: 'neutral',
  }
  return map[status] || 'neutral'
}
