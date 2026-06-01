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
  { key: 'hrAvg', label: 'Avg HR (bpm)' },
  { key: 'hrMax', label: 'Max HR (bpm)' },
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
  const workoutTypes = useMemo(() => {
    return [...new Set(workouts.map(w => w.name).filter(Boolean))].sort()
  }, [workouts])

  const [selectedType, setSelectedType] = useState('')
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

  if (workouts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">No workouts to compare yet</p>
        <p className="text-gray-300 text-xs mt-1">Log workouts first, then compare them here</p>
      </div>
    )
  }

  const metricLabel = METRICS.find(m => m.key === selectedMetric)?.label || ''

  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Workout type</label>
          <select
            value={activeType}
            onChange={e => setSelectedType(e.target.value)}
            className="input"
          >
            {workoutTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Metric</label>
          <select
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
            className="input"
          >
            {METRICS.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No sessions logged for "{activeType}"
        </div>
      ) : filtered.length < 2 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Log at least 2 "{activeType}" sessions to compare
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-3">
            <p className="text-xs font-medium text-gray-500 mb-3">
              {metricLabel} across {filtered.length} sessions
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="session"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0]?.payload
                    return (
                      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-2 text-xs">
                        <p className="font-medium text-gray-700">{d?.session} — {d?.date}</p>
                        <p className="text-accent font-bold">{payload[0]?.value} {metricLabel.split('(')[1]?.replace(')', '') || ''}</p>
                      </div>
                    )
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#E24B4A"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#E24B4A', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">HR Zone Breakdown</p>
            {filtered.map((w, i) => {
              const total = w.zones?.reduce((a, b) => a + b, 0) || 0
              if (total === 0) return null
              return (
                <div key={w.id} className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Session #{i + 1} — {formatDate(w.date)}
                    </span>
                    <span className="text-xs text-gray-400">{total} min</span>
                  </div>
                  <div className="flex h-4 rounded-md overflow-hidden gap-px">
                    {w.zones.map((z, zi) =>
                      z > 0 ? (
                        <div
                          key={zi}
                          style={{
                            width: `${(z / total) * 100}%`,
                            backgroundColor: ZONE_COLORS[zi],
                          }}
                          title={`Z${zi + 1}: ${z} min`}
                        />
                      ) : null
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {w.zones.map((z, zi) => (
                      <span key={zi} className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span
                          className="inline-block w-2 h-2 rounded-sm shrink-0"
                          style={{ backgroundColor: ZONE_COLORS[zi] }}
                        />
                        Z{zi + 1} {z}m
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Zone legend</p>
            <div className="space-y-1">
              {ZONE_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: ZONE_COLORS[i] }}
                  />
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
