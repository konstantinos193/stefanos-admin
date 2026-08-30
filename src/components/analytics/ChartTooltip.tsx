'use client'

import type { TooltipProps } from 'recharts'

interface ChartTooltipProps extends TooltipProps<number, string> {
  labelFormatter?: (label: string) => string
  valueFormatter?: (value: number, dataKey: string) => string
  /** Greek display name per dataKey, so the tooltip never shows a raw field name. */
  seriesNames?: Record<string, string>
}

/**
 * Recharts' default tooltip is a white card with dark text — unreadable on this
 * dark surface. It also hid zeros: the old formatter returned '' for any falsy
 * value, so a real 0 rendered as a bare colon.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  seriesNames = {},
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      {label !== undefined && (
        <p className="text-xs font-semibold text-slate-200 mb-1.5">
          {labelFormatter ? labelFormatter(String(label)) : String(label)}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const key = String(entry.dataKey ?? entry.name ?? index)
          const value = Number(entry.value ?? 0)

          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-400">{seriesNames[key] ?? entry.name ?? key}</span>
              <span className="ml-auto font-semibold text-slate-100 tabular-nums">
                {valueFormatter ? valueFormatter(value, key) : value.toLocaleString('el-GR')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
