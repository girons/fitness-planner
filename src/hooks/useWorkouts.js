import { useState, useCallback } from 'react'

const KEY = 'fp_workouts'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(load)

  const addWorkout = useCallback((workout) => {
    setWorkouts(prev => {
      const next = [...prev, { ...workout, id: Date.now() }]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const updateWorkout = useCallback((id, updates) => {
    setWorkouts(prev => {
      const next = prev.map(w => w.id === id ? { ...w, ...updates } : w)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => {
      const next = prev.filter(w => w.id !== id)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { workouts, addWorkout, updateWorkout, deleteWorkout }
}
