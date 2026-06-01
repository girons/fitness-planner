const TABLE_ROWS = [
  { item: 'Basal metabolic rate (BMR)',              value: '~2,200 kcal' },
  { item: 'Activity multiplier (very active)',        value: '×1.725' },
  { item: 'TDEE (total daily energy expenditure)',    value: '~3,295 kcal' },
  { item: 'HIIT burn (45 min, 6×/week, avg daily)',   value: '~643 kcal' },
  { item: 'Total daily calories available',           value: '~3,938 kcal' },
  { item: 'Deficit for ~1 kg/week loss',              value: '−1,000 kcal' },
]

const MACROS = [
  { label: 'Protein', value: '160g+', note: 'minimum per day',  color: 'text-blue-600',  bg: 'bg-blue-50' },
  { label: 'Carbs',   value: '~200g', note: 'adjust to hunger', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Fat',     value: '~70g',  note: 'healthy fats',     color: 'text-amber-600', bg: 'bg-amber-50' },
]

const TIPS = [
  { icon: '🥩', tip: 'Prioritise protein at every meal — chicken, eggs, Greek yogurt, fish' },
  { icon: '💧', tip: 'Drink 3–4 L water daily, especially on training days' },
  { icon: '⏰', tip: 'Eat your largest carb meals around workouts for fuel and recovery' },
  { icon: '🥗', tip: 'Fill half your plate with vegetables to hit fibre and micronutrient targets' },
]

export default function CaloriesView() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Calories & Nutrition</h2>
        <p className="text-sm text-gray-400">Your personalised daily targets for the 12-week plan</p>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-start">
        {/* Left column */}
        <div className="space-y-4">
          {/* Target card */}
          <div className="bg-accent rounded-2xl p-6 text-white flex items-center gap-6">
            <div>
              <p className="text-sm font-medium opacity-80 mb-1">Daily calorie target</p>
              <p className="text-6xl font-bold tracking-tight leading-none">2,300</p>
              <p className="text-sm opacity-70 mt-2">kcal per day</p>
            </div>
            <div className="ml-auto text-right opacity-70 text-sm space-y-1">
              <p>45-min HIIT</p>
              <p>6× per week</p>
              <p>−1 kg/week</p>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pt-4 pb-2">
              How it's calculated
            </p>
            <div className="divide-y divide-gray-50">
              {TABLE_ROWS.map((row, i) => (
                <div key={i} className="flex items-start justify-between px-4 py-3 gap-4">
                  <span className="text-sm text-gray-600 leading-snug">{row.item}</span>
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50">
                <span className="text-sm font-bold text-gray-900">Daily intake target</span>
                <span className="text-sm font-bold text-accent">2,300 kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Safety note */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">Important</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Losing 16 kg in 12 weeks (1.33 kg/week) is at the upper limit of safe weight loss.
              Targeting <strong>1 kg/week</strong> keeps muscle mass and is sustainable.
              Eat at least <strong>160 g protein/day</strong> to preserve muscle during HIIT training.
            </p>
          </div>

          {/* Macros */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Macro targets</p>
            <div className="grid grid-cols-3 gap-3">
              {MACROS.map(m => (
                <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{m.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{m.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nutrition tips</p>
            {TIPS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg leading-tight mt-0.5 shrink-0">{t.icon}</span>
                <p className="text-sm text-gray-600 leading-snug">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
