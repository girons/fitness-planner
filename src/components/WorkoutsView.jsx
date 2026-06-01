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
    <div className="pb-6">
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setModal({ workout: null })}
          className="w-full py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-red-600 active:bg-red-700 transition-colors"
        >
          + Log Workout
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No workouts logged yet</p>
          <p className="text-gray-300 text-xs mt-1">Tap the button above to log your first session</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {sorted.map(w => (
            <button
              key={w.id}
              onClick={() => setModal({ workout: w })}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-900 text-sm">{w.name || 'Workout'}</span>
                <span className="text-xs text-gray-400">{formatDate(w.date)}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                {w.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-gray-300">⏱</span>{w.duration} min
                  </span>
                )}
                {w.hrAvg > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-gray-300">♥</span>{w.hrAvg} bpm
                  </span>
                )}
                {w.calories > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-gray-300">🔥</span>{w.calories} kcal
                  </span>
                )}
              </div>
              {w.notes ? (
                <p className="text-xs text-gray-400 mt-1 truncate">{w.notes}</p>
              ) : null}
            </button>
          ))}
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
