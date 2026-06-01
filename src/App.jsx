import { useState } from 'react'
import PlanView from './components/PlanView'
import WorkoutsView from './components/WorkoutsView'
import CompareView from './components/CompareView'
import WeightView from './components/WeightView'
import CaloriesView from './components/CaloriesView'
import { useWorkouts } from './hooks/useWorkouts'
import { useWeights } from './hooks/useWeights'

const TABS = [
  { id: 'Plan',      icon: '📅' },
  { id: 'Workouts',  icon: '💪' },
  { id: 'Compare',   icon: '📊' },
  { id: 'Weight',    icon: '⚖️' },
  { id: 'Calories',  icon: '🥗' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('Plan')
  const workouts = useWorkouts()
  const weights = useWeights()

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-gray-100 shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-gray-100">
          <h1 className="text-sm font-bold text-gray-900 tracking-tight">Fitness Planner</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Jun – Aug 2026 · 12 weeks</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === id
                  ? 'bg-accent/10 text-accent'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="text-base leading-none">{icon}</span>
              {id}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-300 leading-snug">45-min HIIT · 6×/week<br />Target: −16 kg in 12 weeks</p>
        </div>
      </aside>

      {/* ── Mobile header + tab bar ── */}
      <div className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 pt-3 pb-1.5">
          <h1 className="text-base font-bold text-gray-900 tracking-tight">Fitness Planner</h1>
          <p className="text-[11px] text-gray-400">June – August 2026 · 12 weeks</p>
        </div>
        <div className="flex">
          {TABS.map(({ id }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors
                ${activeTab === id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {activeTab === 'Plan'     && <PlanView {...workouts} />}
        {activeTab === 'Workouts' && <WorkoutsView {...workouts} />}
        {activeTab === 'Compare'  && <CompareView workouts={workouts.workouts} />}
        {activeTab === 'Weight'   && <WeightView {...weights} />}
        {activeTab === 'Calories' && <CaloriesView />}
      </main>
    </div>
  )
}
