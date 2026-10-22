import { addDays, todayKey } from '../utils/dates.js'

// Calcula el nivel de intensidad (0-4) según % de hábitos completados ese día.
function levelFor(pct) {
  if (pct <= 0) return 0
  if (pct < 30) return 1
  if (pct < 60) return 2
  if (pct < 90) return 3
  return 4
}

const LEVEL_OPACITY = [0, 0.28, 0.5, 0.72, 1]

export default function Heatmap({ completions, totalHabits, weeks = 17 }) {
  const today = todayKey()
  const days = weeks * 7
  // Alinear para que la última columna termine en "hoy"
  const start = addDays(today, -(days - 1))
  const cells = []
  for (let i = 0; i < days; i++) {
    const key = addDays(start, i)
    const doneCount = completions[key]?.length || 0
    const pct = totalHabits > 0 ? (doneCount / totalHabits) * 100 : 0
    cells.push({ key, level: levelFor(pct), doneCount })
  }

  return (
    <div>
      <div className="heatmap-scroll">
        <div className="heatmap-grid">
          {cells.map((c) => (
            <div
              key={c.key}
              className="heatmap-cell"
              title={`${c.key} · ${c.doneCount} hábito(s)`}
              style={{
                background:
                  c.level === 0
                    ? 'var(--border)'
                    : `color-mix(in srgb, var(--accent) ${LEVEL_OPACITY[c.level] * 100}%, var(--surface))`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span>menos</span>
        {LEVEL_OPACITY.map((op, i) => (
          <div
            key={i}
            className="heatmap-cell"
            style={{
              background: op === 0 ? 'var(--border)' : `color-mix(in srgb, var(--accent) ${op * 100}%, var(--surface))`,
            }}
          />
        ))}
        <span>más</span>
      </div>
    </div>
  )
}
