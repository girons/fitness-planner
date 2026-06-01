import { useState } from 'react'
import PlanView from './components/PlanView'
import WorkoutsView from './components/WorkoutsView'
import CompareView from './components/CompareView'
import WeightView from './components/WeightView'
import CaloriesView from './components/CaloriesView'
import { useWorkouts } from './hooks/useWorkouts'
import { useWeights } from './hooks/useWeights'

const TABS = ['Plan', 'Workouts', 'Compare', 'Weight', 'Calories']

export default function App() {
  const [activeTab, setActiveTab] = useState('Plan')
  const workouts = useWorkouts()
  const weights = useWeights()

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white flex flex-col shadow-sm">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 pt-3 pb-1.5">
          <h1 className="text-base font-bold text-gray-900 tracking-tight">Fitness Planner</h1>
          <p className="text-[11px] text-gray-400">June – August 2026 · 12 weeks</p>
        </div>
        {/* Tab bar */}
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors
                ${activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Plan' && <PlanView {...workouts} />}
        {activeTab === 'Workouts' && <WorkoutsView {...workouts} />}
        {activeTab === 'Compare' && <CompareView workouts={workouts.workouts} />}
        {activeTab === 'Weight' && <WeightView {...weights} />}
        {activeTab === 'Calories' && <CaloriesView />}
      </div>
    </div>
  )
}
