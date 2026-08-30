'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { ReportsHeader, ReportRange } from '@/components/reports/ReportsHeader'
import { ReportCatalog } from '@/components/reports/ReportCatalog'
import { reportsApi, type ReportType } from '@/lib/api/reports'

function toDateInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

/** Mirrors the server's period handling so the UI can state the exact range. */
function resolveRange(range: ReportRange, startDate: string, endDate: string) {
  if (range === 'CUSTOM') {
    return { start: startDate, end: endDate }
  }

  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let start: Date

  switch (range) {
    case 'DAILY':
      start = new Date(end)
      break
    case 'WEEKLY':
      start = new Date(end)
      start.setDate(end.getDate() - 6)
      break
    case 'YEARLY':
      start = new Date(now.getFullYear(), 0, 1)
      break
    case 'MONTHLY':
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  return { start: toDateInput(start), end: toDateInput(end) }
}

function formatGreek(value: string): string {
  if (!value) return '—'
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return value
  return new Date(y, m - 1, d).toLocaleDateString('el-GR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function ReportsPage() {
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busyType, setBusyType] = useState<string | null>(null)

  const [range, setRange] = useState<ReportRange>('MONTHLY')
  const [startDate, setStartDate] = useState(() => toDateInput(new Date()))
  const [endDate, setEndDate] = useState(() => toDateInput(new Date()))

  const resolved = useMemo(
    () => resolveRange(range, startDate, endDate),
    [range, startDate, endDate],
  )

  const fetchTypes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await reportsApi.getReportTypes()
      setReportTypes(response?.data ?? [])
      setError(null)
    } catch (err) {
      console.error('Error fetching report types:', err)
      setError(errorMessage(err, 'Αποτυχία φόρτωσης των διαθέσιμων αναφορών.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTypes()
  }, [fetchTypes])

  const handleDownload = async (reportType: ReportType) => {
    if (range === 'CUSTOM' && (!startDate || !endDate)) {
      setError('Συμπληρώστε και τις δύο ημερομηνίες για προσαρμοσμένη περίοδο.')
      return
    }

    setBusyType(reportType.id)
    setError(null)
    setNotice(null)

    try {
      const { blob, fileName } = await reportsApi.downloadReport({
        type: reportType.id,
        period: range,
        startDate: resolved.start,
        endDate: resolved.end,
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setNotice(`Η αναφορά «${reportType.nameGr}» κατέβηκε.`)
    } catch (err) {
      console.error('Error downloading report:', err)
      setError(errorMessage(err, 'Η δημιουργία της αναφοράς απέτυχε.'))
    } finally {
      setBusyType(null)
    }
  }

  return (
    <div className="space-y-6">
      <ReportsHeader
        range={range}
        onRangeChange={setRange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        rangeLabel={`${formatGreek(resolved.start)} — ${formatGreek(resolved.end)}`}
      />

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-red-200">{error}</p>
          <button
            onClick={() => setError(null)}
            aria-label="Κλείσιμο"
            className="text-red-300 hover:text-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {notice && (
        <div className="flex items-start gap-3 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-green-200">{notice}</p>
          <button
            onClick={() => setNotice(null)}
            aria-label="Κλείσιμο"
            className="text-green-300 hover:text-green-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <ReportCatalog
        reportTypes={reportTypes}
        loading={loading}
        busyType={busyType}
        onDownload={handleDownload}
      />
    </div>
  )
}
