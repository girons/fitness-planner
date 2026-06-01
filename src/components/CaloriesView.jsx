const TABLE_ROWS = [
  { item: 'Basal metabolic rate (BMR)', value: '~2,200 kcal' },
  { item: 'Activity multiplier (very active)', value: '×1.725' },
  { item: 'TDEE (total daily energy expenditure)', value: '~3,295 kcal' },
  { item: 'HIIT burn (45 min, 6×/week, avg daily)', value: '~643 kcal' },
  { item: 'Total daily calories available', value: '~3,938 kcal' },
  { item: 'Deficit for ~1 kg/week loss', value: '−1,000 kcal' },
]

const MACROS = [
  { label: 'Protein', value: '160g+', note: 'min per day', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Carbs', value: '~200g', note: 'adjust to hunger', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Fat', value: '~70g', note: 'healthy fats', color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function CaloriesView() {
  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Target card */}
      <div className="bg-accent rounded-2xl p-5 text-white text-center shadow-sm">
        <p className="text-sm font-medium opacity-80 mb-1">Daily calorie target</p>
        <p className="text-5xl font-bold tracking-tight">2,300</p>
        <p className="text-sm opacity-80 mt-1">kcal per day</p>
      </div>

      {/* Breakdown table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 pt-3 pb-2">
          How it's calculated
        </p>
        <div className="divide-y divide-gray-50">
          {TABLE_ROWS.map((row, i) => (
            <div key={i} className="flex items-start justify-between px-3 py-3 gap-3">
              <span className="text-sm text-gray-600 flex-1 leading-snug">{row.item}</span>
              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-3.5 bg-gray-50">
            <span className="text-sm font-bold text-gray-900">Daily intake target</span>
            <span className="text-sm font-bold text-accent">2,300 kcal</span>
          </div>
        </div>
      </div>

      {/* Safety note */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-700 mb-1.5 uppercase tracking-wide">Important</p>
        <p className="text-sm text-amber-800 leading-relaxed">
          Losing 16 kg in 12 weeks (1.33 kg/week) is at the upper limit of safe weight loss.
          Targeting <strong>1 kg/week</strong> keeps muscle mass and is sustainable.
          Eat at least <strong>160 g protein/day</strong> to preserve muscle during HIIT training.
        </p>
      </div>

      {/* Macros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Macro targets
        </p>
        <div className="grid grid-cols-3 gap-3">
          {MACROS.map(m => (
            <div key={m.label} className={`${m.bg} rounded-xl p-3 text-center`}>
              <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">{m.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{m.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nutrition tips</p>
        {[
          { icon: '🥩', tip: 'Prioritise protein at every meal — chicken, eggs, Greek yogurt, fish' },
          { icon: '💧', tip: 'Drink 3–4L water daily, especially on training days' },
          { icon: '⏰', tip: 'Eat your largest carb meals around workouts for fuel and recovery' },
          { icon: '🥗', tip: 'Fill half your plate with vegetables to hit fibre and micronutrient targets' },
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-base leading-tight mt-0.5">{t.icon}</span>
            <p className="text-sm text-gray-600 leading-snug">{t.tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
