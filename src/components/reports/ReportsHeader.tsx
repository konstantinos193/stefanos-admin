'use client'

export type ReportRange = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM'

interface ReportsHeaderProps {
  range: ReportRange
  onRangeChange: (range: ReportRange) => void
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  rangeLabel: string
}

const RANGE_OPTIONS: { value: ReportRange; label: string }[] = [
  { value: 'DAILY', label: 'Σήμερα' },
  { value: 'WEEKLY', label: 'Τελευταίες 7 ημέρες' },
  { value: 'MONTHLY', label: 'Τρέχων μήνας' },
  { value: 'YEARLY', label: 'Τρέχον έτος' },
  { value: 'CUSTOM', label: 'Προσαρμοσμένο' },
]

export function ReportsHeader({
  range,
  onRangeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  rangeLabel,
}: ReportsHeaderProps) {
  const dateClass =
    'h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors [color-scheme:dark]'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Αναφορές</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Επιλέξτε περίοδο και κατεβάστε την αναφορά που θέλετε σε CSV
        </p>
      </div>

      {/* One filter row scoping every report below it. */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Περίοδος
            </label>
            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map((option) => {
                const isActive = range === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onRangeChange(option.value)}
                    className={`h-10 px-3.5 rounded-xl border text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-500/15 border-blue-500 text-blue-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {range === 'CUSTOM' && (
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Από
                </label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className={dateClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Έως
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className={dateClass}
                />
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Οι αναφορές καλύπτουν την περίοδο: <span className="text-slate-300">{rangeLabel}</span>
        </p>
      </div>
    </div>
  )
}
