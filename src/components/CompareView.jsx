import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const METRICS = [
  { key: 'calories', label: 'Calories (kcal)' },
  { key: 'hrAvg',    label: 'Avg HR (bpm)' },
  { key: 'hrMax',    label: 'Max HR (bpm)' },
  { key: 'duration', label: 'Duration (min)' },
]

const ZONE_COLORS = ['#9ca3af', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
const ZONE_LABELS = ['Z1 50–60%', 'Z2 60–70%', 'Z3 70–80%', 'Z4 80–90%', 'Z5 90–100%']

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function CompareView({ workouts }) {
  const workoutTypes = useMemo(() =>
    [...new Set(workouts.map(w => w.name).filter(Boolean))].sort(),
    [workouts]
  )

  const [selectedType, setSelectedType]     = useState('')
  const [selectedMetric, setSelectedMetric] = useState('calories')

  const activeType = selectedType || workoutTypes[0] || ''

  const filtered = useMemo(() => {
    if (!activeType) return []
    return workouts
      .filter(w => w.name === activeType)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [workouts, activeType])

  const chartData = useMemo(() =>
    filtered.map((w, i) => ({
      session: `#${i + 1}`,
      date: formatDate(w.date),
      value: w[selectedMetric] || 0,
    })),
    [filtered, selectedMetric]
  )

  const metricLabel = METRICS.find(m => m.key === selectedMetric)?.label || ''
  const unit = metricLabel.match(/\((.+)\)/)?.[1] || ''

  if (workouts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">No workouts to compare yet</p>
          <p className="text-gray-300 text-xs mt-1">Log workouts first, then compare them here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Compare Workouts</h2>
        <p className="text-sm text-gray-400">Track performance across repeated sessions</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Workout type</label>
          <select
            value={activeType}
            onChange={e => setSelectedType(e.target.value)}
            className="input w-44"
          >
            {workoutTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Metric</label>
          <select
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
            className="input w-44"
          >
            {METRICS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
          No sessions logged for "{activeType}"
        </div>
      ) : filtered.length < 2 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
          Log at least 2 "{activeType}" sessions to compare
        </div>
      ) : (
        <>
          {/* Line chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              {metricLabel} — {filtered.length} sessions
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="session" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0]?.payload
                    return (
                      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-3 text-xs">
                        <p className="font-semibold text-gray-700 mb-1">{d?.session} — {d?.date}</p>
                        <p className="text-accent font-bold text-sm">{payload[0]?.value} <span className="font-normal text-gray-400">{unit}</span></p>
                      </div>
                    )
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#E24B4A"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#E24B4A', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Zone breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">HR Zone Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {filtered.map((w, i) => {
                const total = w.zones?.reduce((a, b) => a + b, 0) || 0
                if (total === 0) return null
                return (
                  <div key={w.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-gray-700">Session #{i + 1} — {formatDate(w.date)}</span>
                      <span className="text-xs text-gray-400">{total} min</span>
                    </div>
                    <div className="flex h-4 rounded-lg overflow-hidden gap-px">
                      {w.zones.map((z, zi) =>
                        z > 0 ? (
                          <div
                            key={zi}
                            style={{ width: `${(z / total) * 100}%`, backgroundColor: ZONE_COLORS[zi] }}
                            title={`Z${zi + 1}: ${z} min`}
                          />
                        ) : null
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
                      {w.zones.map((z, zi) => (
                        <span key={zi} className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: ZONE_COLORS[zi] }} />
                          Z{zi + 1} {z}m
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Zone legend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Zone Legend</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5">
              {ZONE_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: ZONE_COLORS[i] }} />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
