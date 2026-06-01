import { useState, useMemo } from 'react'
import WorkoutModal from './WorkoutModal'

const PLAN_START  = new Date('2026-06-01T00:00:00')
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_PER_DAY = 2

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

function friendlyDate(iso) {
  const [y, m, d] = iso.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Bottom sheet shown when a day already has workouts
function DaySheet({ date, workouts, onEdit, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-[430px] md:max-w-lg bg-white rounded-t-2xl pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{friendlyDate(date)}</p>
            <p className="text-xs text-gray-400">{workouts.length} of {MAX_PER_DAY} workouts logged</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="p-3 space-y-2">
          {workouts.map((w, i) => (
            <button
              key={w.id}
              onClick={() => onEdit(w)}
              className="w-full text-left flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{w.name || 'Workout'}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
                  {w.duration > 0 && <span>{w.duration} min</span>}
                  {w.hrAvg > 0  && <span>{w.hrAvg} bpm avg</span>}
                  {w.calories > 0 && <span>{w.calories} kcal</span>}
                </div>
              </div>
              <span className="text-xs text-accent font-medium ml-4 shrink-0">Edit →</span>
            </button>
          ))}

          {workouts.length < MAX_PER_DAY && (
            <button
              onClick={onAdd}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 hover:border-accent hover:text-accent rounded-xl text-sm font-medium text-gray-400 transition-colors"
            >
              + Add second workout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlanView({ workouts, addWorkout, updateWorkout, deleteWorkout }) {
  const [modal,    setModal]    = useState(null) // { date, workout|null }
  const [daySheet, setDaySheet] = useState(null) // { date, workouts[] }

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
      for (let d = 0; d < 7; d++) days.push(addDays(PLAN_START, w * 7 + d))
      ws.push(days)
    }
    return ws
  }, [])

  const handleDayClick = (date) => {
    const iso = toISO(date)
    const dayWorkouts = workoutsByDate[iso] || []

    if (dayWorkouts.length === 0) {
      setModal({ date: iso, workout: null })
    } else {
      setDaySheet({ date: iso, workouts: dayWorkouts })
    }
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
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        {DAY_HEADERS.map(d => (
          <div key={d} className="py-2 md:py-3 text-center text-[11px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {weeks.map((days, wi) => (
          <div key={wi}>
            <div className="px-4 py-1.5 bg-gray-50 flex items-center gap-2 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Week {wi + 1}</span>
              <span className="text-[11px] text-gray-300">
                {toISO(days[0]).slice(5).replace('-', '/')} – {toISO(days[6]).slice(5).replace('-', '/')}
              </span>
            </div>

            <div className="grid grid-cols-7 divide-x divide-gray-50">
              {days.map((date, di) => {
                const iso         = toISO(date)
                const isToday     = iso === today
                const dayWorkouts = workoutsByDate[iso] || []
                const count       = dayWorkouts.length
                const isPast      = iso < today

                return (
                  <button
                    key={di}
                    onClick={() => handleDayClick(date)}
                    className={`flex flex-col items-center pt-2 pb-2 min-h-[64px] md:min-h-[84px] transition-colors gap-0.5
                      ${isToday ? 'bg-red-50' : isPast && count === 0 ? 'bg-gray-50/60' : 'bg-white'}
                      hover:bg-gray-100 active:bg-gray-200`}
                  >
                    {/* Date number */}
                    <span className={`text-xs leading-none flex items-center justify-center shrink-0
                      ${isToday
                        ? 'w-6 h-6 rounded-full bg-accent text-white font-bold text-[11px]'
                        : isPast ? 'text-gray-400' : 'text-gray-700 font-medium'
                      }`}>
                      {date.getDate()}
                    </span>

                    {/* Workout badges — up to 2 */}
                    <div className="flex flex-col gap-0.5 w-full px-0.5 mt-0.5">
                      {dayWorkouts.slice(0, MAX_PER_DAY).map((w, wi) => (
                        <span
                          key={wi}
                          className={`text-[8px] md:text-[9px] leading-tight text-white rounded px-1 py-0.5 truncate font-medium text-center
                            ${wi === 0 ? 'bg-accent/90' : 'bg-accent/60'}`}
                        >
                          {w.name || '✓'}
                        </span>
                      ))}
                    </div>

                    {/* Calorie total on desktop */}
                    {count > 0 && (
                      <span className="hidden md:block text-[10px] text-gray-400 mt-0.5 shrink-0">
                        {dayWorkouts.reduce((s, w) => s + (w.calories || 0), 0)} kcal
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Day sheet — shown when day already has workouts */}
      {daySheet && (
        <DaySheet
          date={daySheet.date}
          workouts={daySheet.workouts}
          onEdit={(w) => { setDaySheet(null); setModal({ date: daySheet.date, workout: w }) }}
          onAdd={() => { setDaySheet(null); setModal({ date: daySheet.date, workout: null }) }}
          onClose={() => setDaySheet(null)}
        />
      )}

      {/* Workout modal */}
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
