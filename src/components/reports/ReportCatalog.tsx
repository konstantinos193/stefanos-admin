'use client'

import {
  Download,
  Loader2,
  FileText,
  DollarSign,
  CalendarRange,
  Building2,
  Users,
  Wrench,
} from 'lucide-react'
import type { ReportType } from '@/lib/api/reports'

interface ReportCatalogProps {
  reportTypes: ReportType[]
  loading: boolean
  busyType: string | null
  onDownload: (reportType: ReportType) => void
}

const TYPE_STYLE: Record<string, { icon: typeof FileText; tone: string }> = {
  revenue: { icon: DollarSign, tone: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  bookings: { icon: CalendarRange, tone: 'bg-orange-500/15 text-orange-300 border-orange-500/25' },
  properties: { icon: Building2, tone: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  users: { icon: Users, tone: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  maintenance: { icon: Wrench, tone: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25' },
}

const CATEGORY_LABELS: Record<string, string> = {
  Financial: 'Οικονομικά',
  Operations: 'Λειτουργία',
  Performance: 'Απόδοση',
  Users: 'Χρήστες',
}

export function ReportCatalog({
  reportTypes,
  loading,
  busyType,
  onDownload,
}: ReportCatalogProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-slate-800/50 border border-slate-700/60 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (reportTypes.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 py-16 text-center">
        <FileText className="h-8 w-8 text-slate-600 mx-auto" />
        <p className="mt-3 text-sm text-slate-400">Δεν υπάρχουν διαθέσιμες αναφορές.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportTypes.map((reportType) => {
        const style = TYPE_STYLE[reportType.id] ?? {
          icon: FileText,
          tone: 'bg-slate-600/25 text-slate-300 border-slate-600/40',
        }
        const Icon = style.icon
        const busy = busyType === reportType.id

        return (
          <div
            key={reportType.id}
            className="flex flex-col rounded-2xl bg-slate-800/60 border border-slate-700 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`p-2.5 rounded-xl border ${style.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs font-semibold text-slate-300">
                {CATEGORY_LABELS[reportType.category] ?? reportType.category}
              </span>
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-100">{reportType.nameGr}</h3>
            <p className="mt-1 text-sm text-slate-400 flex-1">{reportType.descriptionGr}</p>

            <button
              onClick={() => onDownload(reportType)}
              disabled={busy}
              className="mt-4 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {busy ? 'Δημιουργία…' : 'Λήψη CSV'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
