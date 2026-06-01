import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const START_DATE = '2026-06-01'
const END_DATE = '2026-08-24'
const START_KG = 106
const GOAL_KG = 90

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function targetAt(iso) {
  const startMs = new Date(START_DATE).getTime()
  const endMs = new Date(END_DATE).getTime()
  const currMs = new Date(iso).getTime()
  const t = Math.min(1, Math.max(0, (currMs - startMs) / (endMs - startMs)))
  return +(START_KG - (START_KG - GOAL_KG) * t).toFixed(1)
}

const MS_PER_DAY = 86_400_000

export default function WeightView({ weights, addWeight, deleteWeight }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [kg, setKg] = useState('')

  const sorted = useMemo(
    () => [...weights].sort((a, b) => a.date.localeCompare(b.date)),
    [weights]
  )

  const currentKg = sorted.length > 0 ? sorted[sorted.length - 1].kg : START_KG
  const lost = +(START_KG - currentKg).toFixed(1)
  const toGo = +(currentKg - GOAL_KG).toFixed(1)
  const progress = Math.min(100, Math.max(0, ((START_KG - currentKg) / (START_KG - GOAL_KG)) * 100))

  const chartData = useMemo(() => {
    const actualMap = {}
    sorted.forEach(e => { actualMap[e.date] = e.kg })

    const startMs = new Date(START_DATE).getTime()
    const endMs = new Date(END_DATE).getTime()

    const targetDates = new Set()
    for (let ms = startMs; ms <= endMs; ms += MS_PER_DAY * 7) {
      targetDates.add(new Date(ms).toISOString().slice(0, 10))
    }
    targetDates.add(END_DATE)

    const allDates = [...new Set([...Object.keys(actualMap), ...targetDates])].sort()

    return allDates.map(d => ({
      date: formatDate(d),
      actual: actualMap[d] ?? null,
      target: targetDates.has(d) ? targetAt(d) : null,
    }))
  }, [sorted])

  const handleAdd = () => {
    const kgNum = parseFloat(kg)
    if (!date || isNaN(kgNum) || kgNum <= 0) return
    addWeight({ date, kg: kgNum })
    setKg('')
  }

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Start', value: `${START_KG} kg`, sub: '1 Jun 2026' },
          { label: 'Goal', value: `${GOAL_KG} kg`, sub: '24 Aug 2026' },
          { label: 'Current', value: `${currentKg} kg`, sub: lost > 0 ? `−${lost} kg lost` : 'Starting weight' },
          { label: 'To go', value: `${Math.max(0, toGo)} kg`, sub: `${progress.toFixed(0)}% to goal` },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-3">
            <p className="text-xs text-gray-400 mb-0.5">{card.label}</p>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{START_KG} kg</span>
          <span className="font-medium text-gray-600">{progress.toFixed(0)}% complete</span>
          <span>{GOAL_KG} kg</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700"
            style={{ width: `${Math.max(1, progress)}%` }}
          />
        </div>
      </div>

      {/* Log form */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Log weight</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input flex-1 min-w-0"
          />
          <input
            type="number"
            step="0.1"
            min="30"
            max="300"
            placeholder="kg"
            value={kg}
            onChange={e => setKg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="input w-20 text-center shrink-0"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-red-600 active:bg-red-700 shrink-0 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <p className="text-xs font-medium text-gray-500 mb-3">Weight progress</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[Math.max(50, GOAL_KG - 5), START_KG + 2]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual (kg)"
              stroke="#E24B4A"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#E24B4A', strokeWidth: 0 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target (kg)"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent entries */}
      <div className="bg-white rounded-xl border border-gray-100">
        <p className="text-xs font-medium text-gray-500 px-3 pt-3 pb-2">Weight log</p>
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No entries yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...sorted].reverse().map(e => {
              const prevEntry = sorted[sorted.findIndex(x => x.date === e.date) - 1]
              const delta = prevEntry ? +(e.kg - prevEntry.kg).toFixed(1) : null
              return (
                <div key={e.date} className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-sm text-gray-600">{formatDate(e.date)}</span>
                  <div className="flex items-center gap-3">
                    {delta !== null && (
                      <span className={`text-xs font-medium ${delta < 0 ? 'text-green-500' : delta > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {delta > 0 ? '+' : ''}{delta} kg
                      </span>
                    )}
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">{e.kg} kg</span>
                    <button
                      onClick={() => deleteWeight(e.date)}
                      className="text-gray-200 hover:text-red-400 text-lg leading-none transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
