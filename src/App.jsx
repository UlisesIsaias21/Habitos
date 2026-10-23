import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { addDays, formatLongDate, lastNDays, todayKey, weekdayShort } from './utils/dates.js'
import { bestStreak, completionRate, currentStreak, dayCompletionCount } from './utils/stats.js'
import HabitCard from './components/HabitCard.jsx'
import HabitModal from './components/HabitModal.jsx'
import ProgressRing from './components/ProgressRing.jsx'
import BarChart from './components/BarChart.jsx'
import Heatmap from './components/Heatmap.jsx'

const STORAGE_HABITS = 'atomico:habits'
const STORAGE_COMPLETIONS = 'atomico:completions'
const STORAGE_THEME = 'atomico:theme'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

const DEFAULT_HABITS = [
  { id: 'default-1', name: 'Tomar agua', emoji: '💧' },
  { id: 'default-2', name: 'Leer 20 páginas', emoji: '📖' },
  { id: 'default-3', name: 'Hacer ejercicio', emoji: '🏃' },
  { id: 'default-4', name: 'Meditar 5 minutos', emoji: '🧘' },
  { id: 'default-5', name: 'Dormir temprano', emoji: '😴' },
].map((h) => ({ ...h, createdAt: todayKey() }))

function prefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function App() {
  const [habits, setHabits] = useLocalStorage(STORAGE_HABITS, DEFAULT_HABITS)
  const [completions, setCompletions] = useLocalStorage(STORAGE_COMPLETIONS, {})
  const [theme, setTheme] = useLocalStorage(STORAGE_THEME, prefersDark() ? 'dark' : 'light')
  const [tab, setTab] = useState('hoy')
  const [modalState, setModalState] = useState(null) // null | 'new' | habit object

  const today = todayKey()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  function toggleHabitToday(habitId) {
    setCompletions((prev) => {
      const todayList = prev[today] || []
      const has = todayList.includes(habitId)
      const nextList = has ? todayList.filter((id) => id !== habitId) : [...todayList, habitId]
      return { ...prev, [today]: nextList }
    })
  }
  function saveHabit(data) {
    if (modalState && modalState !== 'new') {
      setHabits((prev) => prev.map((h) => (h.id === modalState.id ? { ...h, ...data } : h)))
    } else {
      setHabits((prev) => [...prev, { id: uid(), createdAt: today, ...data }])
    }
    setModalState(null)
  }

  function deleteHabit(id) {
    if (!window.confirm('¿Eliminar este hábito y su historial? Esta acción no se puede deshacer.')) return
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setCompletions((prev) => {
      const next = {}
      for (const [date, ids] of Object.entries(prev)) {
        next[date] = ids.filter((i) => i !== id)
      }
      return next
    })
  }

  const todayDoneIds = completions[today] || []
  const todayCount = todayDoneIds.length
  const totalHabits = habits.length
  const todayPct = totalHabits > 0 ? Math.round((todayCount / totalHabits) * 100) : 0

  const weeklyBars = useMemo(() => {
    const days = lastNDays(7)
    return days.map((key) => ({
      label: weekdayShort(key),
      value: totalHabits > 0 ? (dayCompletionCount(completions, key) / totalHabits) * 100 : 0,
      title: `${key}: ${dayCompletionCount(completions, key)} hábito(s)`,
    }))
  }, [completions, totalHabits])

  const monthlyBars = useMemo(() => {
    const weeksBack = 4
    const bars = []
    for (let w = weeksBack - 1; w >= 0; w--) {
      const weekEnd = addDays(today, -7 * w)
      const days = lastNDays(7, weekEnd)
      let sum = 0
      days.forEach((key) => {
        sum += totalHabits > 0 ? (dayCompletionCount(completions, key) / totalHabits) * 100 : 0
      })
      bars.push({
        label: `Sem ${weeksBack - w}`,
        value: sum / 7,
        title: `Promedio semanal: ${Math.round(sum / 7)}%`,
      })
    }
    return bars
  }, [completions, totalHabits, today])

  const overallBestStreak = useMemo(() => {
    if (!habits.length) return 0
    return Math.max(...habits.map((h) => bestStreak(h.id, completions)))
  }, [habits, completions])

  const avgCompletion30d = useMemo(() => {
    if (!habits.length) return 0
    const since = addDays(today, -29)
    const rates = habits.map((h) => completionRate(h.id, completions, since, today))
    return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
  }, [habits, completions, today])

  const habitRanking = useMemo(() => {
    const since = addDays(today, -29)
    return habits
      .map((h) => ({ ...h, rate: completionRate(h.id, completions, since, today) }))
      .sort((a, b) => b.rate - a.rate)
  }, [habits, completions, today])

  return (
    <div className="app">
      <header className="topbar">
        <div className="wordmark">
          <span className="dot" />
          Atómico
        </div>
        <div className="topbar-right">
          <span className="date-label">{formatLongDate(today)}</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            <span className="knob">{theme === 'dark' ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button className={`tab ${tab === 'hoy' ? 'active' : ''}`} onClick={() => setTab('hoy')}>
          Hoy
        </button>
        <button className={`tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
          Progreso
        </button>
      </nav>

      {tab === 'hoy' && (
        <>
          <section className="hero">
            <ProgressRing value={todayPct} />
            <div className="hero-copy">
              <h1>
                <span className="count">
                  {todayCount}/{totalHabits}
                </span>{' '}
                hábitos hoy
              </h1>
              <p>Cada vez que marcas un hábito, votas por la persona en la que te quieres convertir.</p>
            </div>
          </section>

          <h2 className="section-label">Tus hábitos</h2>
          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="glyph">⚛️</div>
              <h3>Todavía no tienes hábitos</h3>
              <p>Agrega el primero y empieza a construir tu racha desde hoy.</p>
              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary" style={{ flex: 'none', padding: '11px 22px' }} onClick={() => setModalState('new')}>
                  + Agregar hábito
                </button>
              </div>
            </div>
          ) : (
            <div className="habit-grid">
              {habits.map((h) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  done={todayDoneIds.includes(h.id)}
                  streak={currentStreak(h.id, completions, today)}
                  onToggle={toggleHabitToday}
                  onEdit={(habit) => setModalState(habit)}
                  onDelete={deleteHabit}
                />
              ))}
              <button className="add-card" onClick={() => setModalState('new')}>
                + Agregar hábito
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'stats' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value accent">{overallBestStreak}</div>
              <div className="stat-label">Mejor racha (días)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{todayCount}/{totalHabits}</div>
              <div className="stat-label">Completados hoy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{avgCompletion30d}%</div>
              <div className="stat-label">Promedio 30 días</div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Últimos 7 días</div>
            <BarChart bars={weeklyBars} />
          </div>

          <div className="panel">
            <div className="panel-title">Últimas 4 semanas</div>
            <BarChart bars={monthlyBars} />
          </div>

          <div className="panel">
            <div className="panel-title">Constancia (últimos ~4 meses)</div>
            <Heatmap completions={completions} totalHabits={totalHabits} />
          </div>

          {habits.length > 0 && (
            <div className="panel">
              <div className="panel-title">Por hábito · últimos 30 días</div>
              {habitRanking.map((h) => (
                <div className="rank-row" key={h.id}>
                  <span className="rank-emoji">{h.emoji}</span>
                  <span className="rank-name">{h.name}</span>
                  <div className="rank-bar-track">
                    <div className="rank-bar-fill" style={{ width: `${h.rate}%` }} />
                  </div>
                  <span className="rank-pct">{h.rate}%</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {modalState && (
        <HabitModal
          initial={modalState === 'new' ? null : modalState}
          onClose={() => setModalState(null)}
          onSave={saveHabit}
        />
      )}

      <footer className="app-footer">You Can Whit All U</footer>
    </div>
  )
}
