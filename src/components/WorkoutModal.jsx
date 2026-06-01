import { useState, useEffect } from 'react'

const EMPTY = {
  name: '',
  date: '',
  duration: '',
  hrAvg: '',
  hrMax: '',
  calories: '',
  fatPct: '',
  zones: ['', '', '', '', ''],
  notes: '',
}

function toForm(workout) {
  if (!workout) return EMPTY
  return {
    ...workout,
    duration: workout.duration ?? '',
    hrAvg: workout.hrAvg ?? '',
    hrMax: workout.hrMax ?? '',
    calories: workout.calories ?? '',
    fatPct: workout.fatPct ?? '',
    zones: workout.zones ? workout.zones.map(String) : ['', '', '', '', ''],
  }
}

function toWorkout(form) {
  return {
    name: form.name,
    date: form.date,
    duration: Number(form.duration) || 0,
    hrAvg: Number(form.hrAvg) || 0,
    hrMax: Number(form.hrMax) || 0,
    calories: Number(form.calories) || 0,
    fatPct: Number(form.fatPct) || 0,
    zones: form.zones.map(Number),
    notes: form.notes,
  }
}

export default function WorkoutModal({ date, workout, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() =>
    workout ? toForm(workout) : { ...EMPTY, date: date || '' }
  )

  useEffect(() => {
    setForm(workout ? toForm(workout) : { ...EMPTY, date: date || '' })
  }, [workout, date])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const setZone = (i, value) =>
    setForm(f => {
      const zones = [...f.zones]
      zones[i] = value
      return { ...f, zones }
    })

  const handleSave = () => {
    if (!form.name.trim() || !form.date) return
    onSave(toWorkout(form))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white rounded-t-2xl max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900">
            {workout ? 'Edit Workout' : 'Log Workout'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl leading-none rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          <Field label="Workout name *">
            <input
              type="text"
              placeholder="e.g. Workout 1, Chest day"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="input"
              autoFocus
            />
          </Field>

          <Field label="Date *">
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration (min)">
              <input
                type="number"
                min="0"
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                className="input"
                placeholder="45"
              />
            </Field>
            <Field label="Calories (kcal)">
              <input
                type="number"
                min="0"
                value={form.calories}
                onChange={e => set('calories', e.target.value)}
                className="input"
                placeholder="500"
              />
            </Field>
            <Field label="Avg HR (bpm)">
              <input
                type="number"
                min="0"
                value={form.hrAvg}
                onChange={e => set('hrAvg', e.target.value)}
                className="input"
                placeholder="145"
              />
            </Field>
            <Field label="Max HR (bpm)">
              <input
                type="number"
                min="0"
                value={form.hrMax}
                onChange={e => set('hrMax', e.target.value)}
                className="input"
                placeholder="175"
              />
            </Field>
            <Field label="Fat burn %">
              <input
                type="number"
                min="0"
                max="100"
                value={form.fatPct}
                onChange={e => set('fatPct', e.target.value)}
                className="input"
                placeholder="30"
              />
            </Field>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">HR Zones — time in each zone (min)</p>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { label: 'Z1', sub: '50–60%' },
                { label: 'Z2', sub: '60–70%' },
                { label: 'Z3', sub: '70–80%' },
                { label: 'Z4', sub: '80–90%' },
                { label: 'Z5', sub: '90–100%' },
              ].map(({ label, sub }, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-medium text-gray-500 mb-1">
                    {label}
                    <span className="text-gray-300 ml-0.5">{sub}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.zones[i]}
                    onChange={e => setZone(i, e.target.value)}
                    className="input text-center px-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <Field label="Notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="input resize-none"
              placeholder="How did it feel? Any observations..."
            />
          </Field>
        </div>

        <div className="flex gap-2 px-4 pb-8 pt-3 border-t border-gray-100 shrink-0">
          {workout && (
            <button
              onClick={() => onDelete(workout.id)}
              className="px-3 py-2.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || !form.date}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
