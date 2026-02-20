'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { BookingQueryParams } from '@/lib/api/bookings'

interface BookingsFiltersProps {
  filters: BookingQueryParams
  onFiltersChange: (filters: BookingQueryParams) => void
}

const STATUS_OPTIONS = [
  { value: '', label: 'Όλες οι Καταστάσεις', color: '' },
  { value: 'CONFIRMED', label: 'Επιβεβαιωμένη', color: 'bg-green-500' },
  { value: 'PENDING', label: 'Σε Αναμονή', color: 'bg-yellow-500' },
  { value: 'CHECKED_IN', label: 'Check-in', color: 'bg-purple-500' },
  { value: 'COMPLETED', label: 'Ολοκληρωμένη', color: 'bg-blue-500' },
  { value: 'CANCELLED', label: 'Ακυρωμένη', color: 'bg-red-500' },
  { value: 'NO_SHOW', label: 'Απουσία', color: 'bg-slate-500' },
]

const MONTHS_GR = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος',
  'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
  'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
]

const DAYS_GR = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ']

function formatDateGr(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function BookingsFilters({ filters, onFiltersChange }: BookingsFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [statusOpen, setStatusOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const [selectingEnd, setSelectingEnd] = useState(false)
  const [hoverDate, setHoverDate] = useState<string | null>(null)

  const statusRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // Sync internal search value when filters.search changes externally (e.g. header search)
  useEffect(() => {
    setSearchValue(filters.search || '')
  }, [filters.search])

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined, page: 1 })
    }, 400)
  }, [filters, onFiltersChange])

  const handleStatusChange = useCallback((status: string) => {
    onFiltersChange({ ...filters, status: status || undefined, page: 1 })
    setStatusOpen(false)
  }, [filters, onFiltersChange])

  const handleDateClick = useCallback((dateStr: string) => {
    if (!selectingEnd || !filters.dateFrom) {
      // Selecting start date
      onFiltersChange({ ...filters, dateFrom: dateStr, dateTo: undefined, page: 1 })
      setSelectingEnd(true)
    } else {
      // Selecting end date
      if (dateStr < filters.dateFrom) {
        // Clicked before start — reset start
        onFiltersChange({ ...filters, dateFrom: dateStr, dateTo: undefined, page: 1 })
      } else {
        onFiltersChange({ ...filters, dateTo: dateStr, page: 1 })
        setSelectingEnd(false)
        setCalendarOpen(false)
      }
    }
  }, [selectingEnd, filters, onFiltersChange])

  const clearDates = useCallback(() => {
    onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined, page: 1 })
    setSelectingEnd(false)
  }, [filters, onFiltersChange])

  const clearAll = useCallback(() => {
    setSearchValue('')
    onFiltersChange({ limit: filters.limit })
  }, [filters.limit, onFiltersChange])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday-based
  }

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  const isInRange = (dateStr: string) => {
    if (!filters.dateFrom) return false
    const end = filters.dateTo || hoverDate
    if (!end) return false
    return dateStr >= filters.dateFrom && dateStr <= end
  }

  const isStart = (dateStr: string) => dateStr === filters.dateFrom
  const isEnd = (dateStr: string) => dateStr === (filters.dateTo || (selectingEnd ? hoverDate : null))

  const selectedStatus = STATUS_OPTIONS.find(s => s.value === (filters.status || ''))
  const hasActiveFilters = !!(filters.search || filters.status || filters.dateFrom || filters.dateTo)

  const dateLabel = filters.dateFrom
    ? filters.dateTo
      ? `${formatDateGr(filters.dateFrom)} — ${formatDateGr(filters.dateTo)}`
      : `${formatDateGr(filters.dateFrom)} — ...`
    : 'Εύρος Ημερομηνιών'

  // Build calendar grid
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth)
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth)
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  return (
    <div className="card">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Αναζήτηση με όνομα, email, τηλέφωνο ή ID κράτησης..."
            className="input pl-12 pr-10"
          />
          {searchValue && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status dropdown */}
          <div ref={statusRef} className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="input w-full sm:w-56 text-left flex items-center gap-2 cursor-pointer"
            >
              {selectedStatus?.color && (
                <span className={`w-2.5 h-2.5 rounded-full ${selectedStatus.color} shrink-0`} />
              )}
              <span className="truncate">{selectedStatus?.label || 'Όλες οι Καταστάσεις'}</span>
              <svg className={`ml-auto h-4 w-4 text-slate-400 shrink-0 transition-transform ${statusOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {statusOpen && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-56 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl z-50 py-1 animate-slide-down overflow-hidden">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 hover:bg-slate-700/50 transition-colors text-sm ${
                      (filters.status || '') === opt.value ? 'bg-slate-700/70 text-white' : 'text-slate-300'
                    }`}
                  >
                    {opt.color ? (
                      <span className={`w-2.5 h-2.5 rounded-full ${opt.color} shrink-0`} />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-500 shrink-0" />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date range picker */}
          <div ref={calendarRef} className="relative">
            <button
              onClick={() => {
                setCalendarOpen(!calendarOpen)
                if (!calendarOpen) {
                  // Reset calendar view to current month or dateFrom month
                  if (filters.dateFrom) {
                    const d = new Date(filters.dateFrom + 'T00:00:00')
                    setCalendarMonth(d.getMonth())
                    setCalendarYear(d.getFullYear())
                  } else {
                    setCalendarMonth(new Date().getMonth())
                    setCalendarYear(new Date().getFullYear())
                  }
                }
              }}
              className={`input w-full sm:w-64 text-left flex items-center gap-2 cursor-pointer ${
                filters.dateFrom ? 'border-accent-blue/50' : ''
              }`}
            >
              <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
              <span className={`truncate text-sm ${filters.dateFrom ? 'text-slate-100' : 'text-slate-400'}`}>
                {dateLabel}
              </span>
              {filters.dateFrom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    clearDates()
                  }}
                  className="ml-auto p-0.5 hover:bg-slate-600 rounded transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
            </button>

            {calendarOpen && (
              <div className="absolute top-full right-0 sm:left-0 mt-2 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl z-50 p-4 animate-slide-down w-[320px]">
                {/* Calendar header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-300" />
                  </button>
                  <span className="text-sm font-semibold text-slate-100">
                    {MONTHS_GR[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </button>
                </div>

                {/* Hint */}
                <p className="text-xs text-slate-500 text-center mb-3">
                  {!filters.dateFrom
                    ? 'Επιλέξτε ημερομηνία άφιξης'
                    : selectingEnd
                      ? 'Επιλέξτε ημερομηνία αναχώρησης'
                      : 'Επιλέξτε ημερομηνία άφιξης'}
                </p>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {DAYS_GR.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-0">
                  {calendarDays.map((day, i) => {
                    if (day === null) {
                      return <div key={`empty-${i}`} className="h-9" />
                    }
                    const dateStr = toISODate(calendarYear, calendarMonth, day)
                    const inRange = isInRange(dateStr)
                    const start = isStart(dateStr)
                    const end = isEnd(dateStr)
                    const isToday = dateStr === new Date().toISOString().slice(0, 10)

                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateClick(dateStr)}
                        onMouseEnter={() => selectingEnd && setHoverDate(dateStr)}
                        onMouseLeave={() => setHoverDate(null)}
                        className={`
                          h-9 text-sm font-medium transition-all relative
                          ${start || end
                            ? 'bg-accent-blue text-white rounded-lg z-10'
                            : inRange
                              ? 'bg-accent-blue/20 text-blue-300'
                              : isToday
                                ? 'text-accent-blue font-bold'
                                : 'text-slate-300 hover:bg-slate-700/50'
                          }
                          ${start && !end ? 'rounded-l-lg' : ''}
                          ${end && !start ? 'rounded-r-lg' : ''}
                          ${start && end ? 'rounded-lg' : ''}
                        `}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
                  <button
                    onClick={() => {
                      const today = new Date()
                      const todayStr = today.toISOString().slice(0, 10)
                      const next30 = new Date(today)
                      next30.setDate(next30.getDate() + 30)
                      const next30Str = next30.toISOString().slice(0, 10)
                      onFiltersChange({ ...filters, dateFrom: todayStr, dateTo: next30Str, page: 1 })
                      setSelectingEnd(false)
                      setCalendarOpen(false)
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Επόμενες 30 μέρες
                  </button>
                  <button
                    onClick={() => {
                      clearDates()
                      setCalendarOpen(false)
                    }}
                    className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Καθαρισμός
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset all filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="btn-sm flex items-center justify-center gap-2 whitespace-nowrap text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors px-3 py-2"
              title="Καθαρισμός φίλτρων"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sm:inline hidden">Καθαρισμός</span>
            </button>
          )}
        </div>
      </div>

      {/* Active filters chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
          <span className="text-xs text-slate-500 font-medium">Ενεργά φίλτρα:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
              Αναζήτηση: &ldquo;{filters.search}&rdquo;
              <button onClick={() => { setSearchValue(''); onFiltersChange({ ...filters, search: undefined, page: 1 }) }}>
                <X className="h-3 w-3 text-slate-500 hover:text-slate-300" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
              <span className={`w-2 h-2 rounded-full ${STATUS_OPTIONS.find(s => s.value === filters.status)?.color}`} />
              {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
              <button onClick={() => onFiltersChange({ ...filters, status: undefined, page: 1 })}>
                <X className="h-3 w-3 text-slate-500 hover:text-slate-300" />
              </button>
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
              {formatDateGr(filters.dateFrom)}{filters.dateTo ? ` — ${formatDateGr(filters.dateTo)}` : ' — ...'}
              <button onClick={clearDates}>
                <X className="h-3 w-3 text-slate-500 hover:text-slate-300" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

