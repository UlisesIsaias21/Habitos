import { useState } from 'react'

// Botón "ignición": al marcar el hábito como hecho, dispara una
// pequeña explosión de chispas en el color de acento — una referencia
// visual a la idea de "encender" un hábito atómico.
export default function IgniteButton({ done, onToggle }) {
  const [bursts, setBursts] = useState([])

  function handleClick() {
    if (!done) {
      const id = Date.now()
      const particles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.3
        const dist = 22 + Math.random() * 12
        return {
          key: `${id}-${i}`,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
        }
      })
      setBursts((b) => [...b, { id, particles }])
      setTimeout(() => {
        setBursts((b) => b.filter((x) => x.id !== id))
      }, 600)
    }
    onToggle()
  }

  return (
    <button
      className={`ignite-btn ${done ? 'on' : ''}`}
      onClick={handleClick}
      aria-pressed={done}
      aria-label={done ? 'Marcar como no hecho' : 'Marcar como hecho'}
      type="button"
    >
      {bursts.map((b) => (
        <span className="spark" key={b.id}>
          {b.particles.map((p) => (
            <span key={p.key} style={{ '--dx': p.dx, '--dy': p.dy }} />
          ))}
        </span>
      ))}
      <svg viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  )
}
