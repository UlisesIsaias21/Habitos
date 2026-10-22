import { addDays, todayKey } from './dates.js'

export function isDone(completions, dateKey, habitId) {
  return !!completions[dateKey]?.includes(habitId)
}

// Racha actual: cuenta días consecutivos completados hacia atrás.
// Da un día de gracia: si hoy aún no se marca, la racha no se rompe
// hasta que el día termine (se sigue contando desde ayer).
export function currentStreak(habitId, completions, today = todayKey()) {
  let cursor = today
  if (!isDone(completions, cursor, habitId)) {
    cursor = addDays(cursor, -1)
  }
  let count = 0
  while (isDone(completions, cursor, habitId)) {
    count++
    cursor = addDays(cursor, -1)
  }
  return count
}

export function bestStreak(habitId, completions) {
  const dates = Object.keys(completions)
    .filter((d) => isDone(completions, d, habitId))
    .sort()
  if (!dates.length) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < dates.length; i++) {
    if (addDays(dates[i - 1], 1) === dates[i]) {
      run++
    } else {
      run = 1
    }
    best = Math.max(best, run)
  }
  return best
}

export function completionRate(habitId, completions, sinceKey, today = todayKey()) {
  let total = 0
  let done = 0
  let cursor = sinceKey
  while (cursor <= today) {
    total++
    if (isDone(completions, cursor, habitId)) done++
    cursor = addDays(cursor, 1)
  }
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

export function dayCompletionCount(completions, dateKey) {
  return completions[dateKey]?.length || 0
}
