import { useState, useCallback } from 'react'

const KEY = 'fp_weights'
const SEED = [{ date: '2026-06-01', kg: 106 }]

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY))
    if (stored && stored.length > 0) return stored
    localStorage.setItem(KEY, JSON.stringify(SEED))
    return SEED
  } catch {
    localStorage.setItem(KEY, JSON.stringify(SEED))
    return SEED
  }
}

export function useWeights() {
  const [weights, setWeights] = useState(load)

  const addWeight = useCallback((entry) => {
    setWeights(prev => {
      const next = [...prev.filter(w => w.date !== entry.date), entry]
        .sort((a, b) => a.date.localeCompare(b.date))
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteWeight = useCallback((date) => {
    setWeights(prev => {
      const next = prev.filter(w => w.date !== date)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { weights, addWeight, deleteWeight }
}
