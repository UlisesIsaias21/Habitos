export default function BarChart({ bars }) {
  // bars: [{ label, value (0-100), title }]
  return (
    <div className="week-bars">
      {bars.map((b, i) => (
        <div className="week-bar-col" key={i} title={b.title}>
          <div className="week-bar-track">
            <div className="week-bar-fill" style={{ height: `${Math.max(b.value, 2)}%` }} />
          </div>
          <div className="week-bar-label">{b.label}</div>
        </div>
      ))}
    </div>
  )
}
