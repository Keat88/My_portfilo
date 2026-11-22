export function formatDate(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return String(value) }
}
export function formatDateTime(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch { return String(value) }
}
export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'A'
}
export function formatShortDate(value) {
  if (!value) return '—'
  try { return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) } catch { return String(value) }
}
