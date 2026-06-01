import { useState, useMemo } from 'react'
import WorkoutModal from './WorkoutModal'

const PLAN_START = new Date('2026-06-01T00:00:00')
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export default function PlanView({ workouts, addWorkout, updateWorkout, deleteWorkout }) {
  const [modal, setModal] = useState(null)

  const today = toISO(new Date())

  const workoutsByDate = useMemo(() => {
    const map = {}
    workouts.forEach(w => {
      if (!map[w.date]) map[w.date] = []
      map[w.date].push(w)
    })
    return map
  }, [workouts])

  const weeks = useMemo(() => {
    const ws = []
    for (let w = 0; w < 12; w++) {
      const days = []
      for (let d = 0; d < 7; d++) {
        days.push(addDays(PLAN_START, w * 7 + d))
      }
      ws.push(days)
    }
    return ws
  }, [])

  const handleDayClick = (date) => {
    const iso = toISO(date)
    const existing = workoutsByDate[iso]
    setModal({ date: iso, workout: existing?.[0] || null })
  }

  const handleSave = (data) => {
    if (modal.workout) {
      updateWorkout(modal.workout.id, data)
    } else {
      addWorkout(data)
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    deleteWorkout(id)
    setModal(null)
  }

  return (
    <div className="pb-6">
      {/* Day column headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-white sticky top-0 z-10">
        {DAY_HEADERS.map(d => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {weeks.map((days, wi) => (
          <div key={wi}>
            <div className="px-3 py-1.5 bg-gray-50 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Week {wi + 1}
              </span>
              <span className="text-[11px] text-gray-300">
                {toISO(days[0]).slice(5).replace('-', '/')} – {toISO(days[6]).slice(5).replace('-', '/')}
              </span>
            </div>
            <div className="grid grid-cols-7 divide-x divide-gray-50">
              {days.map((date, di) => {
                const iso = toISO(date)
                const isToday = iso === today
                const dayWorkouts = workoutsByDate[iso] || []
                const hasWorkout = dayWorkouts.length > 0
                const isPast = iso < today

                return (
                  <button
                    key={di}
                    onClick={() => handleDayClick(date)}
                    className={`flex flex-col items-center pt-2 pb-2.5 min-h-[58px] transition-colors
                      ${isToday ? 'bg-red-50' : isPast && !hasWorkout ? 'bg-gray-50/60' : 'bg-white'}
                      hover:bg-gray-100 active:bg-gray-200`}
                  >
                    <span className={`text-xs leading-none mb-1.5 flex items-center justify-center
                      ${isToday
                        ? 'w-5 h-5 rounded-full bg-accent text-white font-bold text-[10px]'
                        : isPast ? 'text-gray-400 font-normal' : 'text-gray-700 font-medium'
                      }`}>
                      {date.getDate()}
                    </span>
                    {hasWorkout && (
                      <span className="text-[9px] leading-tight bg-accent/90 text-white rounded px-1 py-0.5 max-w-[90%] truncate font-medium">
                        {dayWorkouts[0].name || '✓'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <WorkoutModal
          date={modal.date}
          workout={modal.workout}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
