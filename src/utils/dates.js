// Todas las fechas se manejan como strings 'YYYY-MM-DD' en hora local.

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey() {
  return toKey(new Date())
}

export function addDays(key, delta) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + delta)
  return toKey(date)
}

export function lastNDays(n, endKey = todayKey()) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    days.push(addDays(endKey, -i))
  }
  return days
}

const WEEKDAY_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

export function weekdayShort(key) {
  const [y, m, d] = key.split('-').map(Number)
  return WEEKDAY_SHORT[new Date(y, m - 1, d).getDay()]
}

export function formatLongDate(key = todayKey()) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function isSameOrBefore(a, b) {
  return a <= b
}
