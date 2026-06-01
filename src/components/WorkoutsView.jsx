import { useState } from 'react'
import WorkoutModal from './WorkoutModal'

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function WorkoutsView({ workouts, addWorkout, updateWorkout, deleteWorkout }) {
  const [modal, setModal] = useState(null)

  const today = new Date().toISOString().slice(0, 10)
  const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date))

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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Workouts</h2>
          <p className="text-sm text-gray-400">{sorted.length} session{sorted.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button
          onClick={() => setModal({ workout: null })}
          className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-red-600 active:bg-red-700 transition-colors"
        >
          + Log Workout
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm">No workouts logged yet</p>
          <p className="text-gray-300 text-xs mt-1">Tap the button above to log your first session</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Table header — desktop only */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Workout</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Duration</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Avg HR</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Calories</span>
          </div>

          <div className="divide-y divide-gray-50">
            {sorted.map(w => (
              <button
                key={w.id}
                onClick={() => setModal({ workout: w })}
                className="w-full text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                {/* Mobile layout */}
                <div className="md:hidden px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{w.name || 'Workout'}</span>
                    <span className="text-xs text-gray-400">{formatDate(w.date)}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    {w.duration > 0 && <span>{w.duration} min</span>}
                    {w.hrAvg > 0 && <span>{w.hrAvg} bpm</span>}
                    {w.calories > 0 && <span>{w.calories} kcal</span>}
                  </div>
                  {w.notes && <p className="text-xs text-gray-400 mt-1 truncate">{w.notes}</p>}
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-5 py-3.5">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{w.name || 'Workout'}</span>
                    {w.notes && <p className="text-xs text-gray-400 truncate mt-0.5 max-w-xs">{w.notes}</p>}
                  </div>
                  <span className="text-sm text-gray-600">{formatDate(w.date)}</span>
                  <span className="text-sm text-gray-600">{w.duration > 0 ? `${w.duration} min` : '—'}</span>
                  <span className="text-sm text-gray-600">{w.hrAvg > 0 ? `${w.hrAvg} bpm` : '—'}</span>
                  <span className="text-sm text-gray-600">{w.calories > 0 ? `${w.calories} kcal` : '—'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <WorkoutModal
          date={today}
          workout={modal.workout}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
