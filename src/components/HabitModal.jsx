import { useState } from 'react'

const EMOJIS = ['📖', '💧', '🏃', '🧘', '💪', '🥗', '😴', '✍️', '🎯', '🎸', '🧠', '🌱', '☀️', '🚭', '💰']

export default function HabitModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || EMOJIS[0])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSave({ name: trimmed, emoji })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h3>{initial ? 'Editar hábito' : 'Nuevo hábito'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="habit-name">Nombre</label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Leer 10 páginas"
              autoFocus
              maxLength={40}
            />
          </div>
          <div className="field">
            <label>Ícono</label>
            <div className="emoji-grid">
              {EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  className={`emoji-opt ${emoji === em ? 'selected' : ''}`}
                  onClick={() => setEmoji(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
