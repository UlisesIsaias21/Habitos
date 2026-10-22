import { useEffect, useRef, useState } from 'react'
import IgniteButton from './IgniteButton.jsx'

export default function HabitCard({ habit, done, streak, onToggle, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className={`habit-card ${done ? 'done' : ''}`} ref={ref}>
      <div className="habit-card-top">
        <div>
          <div className="habit-emoji">{habit.emoji}</div>
          <div className="habit-name">{habit.name}</div>
          <div className={`habit-streak ${streak > 0 ? 'active' : ''}`}>
            🔥 {streak} {streak === 1 ? 'día' : 'días'}
          </div>
        </div>
        <button className="habit-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Opciones del hábito">
          ⋯
        </button>
        {menuOpen && (
          <div className="habit-menu">
            <button onClick={() => { setMenuOpen(false); onEdit(habit) }}>Editar</button>
            <button className="danger" onClick={() => { setMenuOpen(false); onDelete(habit.id) }}>Eliminar</button>
          </div>
        )}
      </div>
      <div className="habit-action-row">
        <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
          {done ? 'Completado hoy' : 'Pendiente hoy'}
        </span>
        <IgniteButton done={done} onToggle={() => onToggle(habit.id)} />
      </div>
    </div>
  )
}
