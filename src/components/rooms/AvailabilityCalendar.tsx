'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Calendar, X, Check, Lock, Unlock } from 'lucide-react'
import { roomsApi } from '@/lib/api/rooms'

interface DayAvailability {
  date: string
  isAvailable: boolean
  reason?: string
  bookingId?: string
  guestName?: string
}

interface AvailabilityCalendarProps {
  roomId: string
  roomName: string
  onClose: () => void
  onAvailabilityUpdate: () => void
}

const MONTH_NAMES = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
  'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
]

export function AvailabilityCalendar({ roomId, roomName, onClose, onAvailabilityUpdate }: AvailabilityCalendarProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)
  const [bulkAction, setBulkAction] = useState<'open' | 'close'>('open')
  const [bulkReason, setBulkReason] = useState('')

  const fetchAvailability = useCallback(async () => {
    setLoading(true)
    try {
      const response = await roomsApi.getRoomAvailabilityCalendar(roomId, year, month)
      if (response.success) {
        setAvailability(response.data)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }, [roomId, year, month])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const getDayAvailability = (day: number): DayAvailability | null => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return availability.find(d => d.date === dateStr) || null
  }

  const toggleDateSelection = (dateStr: string) => {
    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    )
  }

  const handleBulkUpdate = async () => {
    if (selectedDates.length === 0) return

    try {
      const startDate = selectedDates[0]
      const endDate = selectedDates[selectedDates.length - 1]
      
      await roomsApi.updateRoomAvailability(roomId, {
        isAvailable: bulkAction === 'open',
        reason: bulkReason || undefined,
        startDate,
        endDate
      })

      setSelectedDates([])
      setShowBulkUpdate(false)
      setBulkReason('')
      fetchAvailability()
      onAvailabilityUpdate()
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const handleSingleDateUpdate = async (dateStr: string, isAvailable: boolean) => {
    try {
      await roomsApi.updateRoomAvailability(roomId, {
        isAvailable,
        startDate: dateStr,
        endDate: dateStr
      })
      fetchAvailability()
      onAvailabilityUpdate()
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Διαθεσιμότητα Διαμερίσματος</h2>
            <p className="text-slate-400 mt-1">{roomName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium text-slate-200">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedDates.length > 0 && (
          <div className="p-4 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Επιλεγμένες ημερομηνίες: {selectedDates.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBulkAction('open')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    bulkAction === 'open'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Unlock className="h-4 w-4 inline mr-1" />
                  Άνοιγμα
                </button>
                <button
                  onClick={() => setBulkAction('close')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    bulkAction === 'close'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Lock className="h-4 w-4 inline mr-1" />
                  Κλείσιμο
                </button>
                <button
                  onClick={() => setShowBulkUpdate(true)}
                  className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Εφαρμογή
                </button>
                <button
                  onClick={() => setSelectedDates([])}
                  className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Καθαρισμός
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="p-6 overflow-auto max-h-[500px]">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Φόρτωση ημερολογίου...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Weekday headers */}
              {['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayAvail = getDayAvailability(day)
                const isSelected = selectedDates.includes(dateStr)
                const isToday = 
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear()
                const isPast = new Date(dateStr) < today && !isToday

                return (
                  <div
                    key={day}
                    onClick={() => !isPast && toggleDateSelection(dateStr)}
                    className={`relative p-2 border rounded-lg transition-all cursor-pointer ${
                      isPast 
                        ? 'border-slate-800 bg-slate-800/50 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 ring-2 ring-indigo-500'
                        : dayAvail?.isAvailable === false
                        ? 'border-red-500/30 bg-red-500/10 hover:border-red-500/50'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    } ${isToday ? 'ring-2 ring-indigo-400' : ''}`}
                  >
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        isPast ? 'text-slate-600' 
                        : isSelected ? 'text-indigo-300'
                        : isToday ? 'text-indigo-400'
                        : 'text-slate-300'
                      }`}>
                        {day}
                      </div>
                      
                      {/* Status indicator */}
                      {dayAvail && !isPast && (
                        <div className="mt-1">
                          {dayAvail.isAvailable === false ? (
                            <Lock className="h-3 w-3 text-red-400 mx-auto" />
                          ) : dayAvail.bookingId ? (
                            <Calendar className="h-3 w-3 text-amber-400 mx-auto" />
                          ) : (
                            <Check className="h-3 w-3 text-green-400 mx-auto" />
                          )}
                        </div>
                      )}

                      {/* Booking info */}
                      {dayAvail?.guestName && (
                        <div className="text-xs text-slate-500 mt-1 truncate">
                          {dayAvail.guestName}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-slate-700 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Check className="h-3 w-3 text-green-400" />
            <span>Διαθέσιμο</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-red-400" />
            <span>Κλειστό</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-amber-400" />
            <span>Κρατηση</span>
          </div>
        </div>
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              {bulkAction === 'open' ? 'Άνοιγμα' : 'Κλείσιμο'} Διαθεσιμότητας
            </h3>
            <p className="text-slate-400 mb-4">
              {selectedDates.length} ημερομηνίες θα {bulkAction === 'open' ? 'ανοιχτούν' : 'κλειστούν'}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Αιτιολόγηση (προαιρετικό)
              </label>
              <textarea
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Αιτία αλλαγής διαθεσιμότητας..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkUpdate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Επιβεβαίωση
              </button>
              <button
                onClick={() => {
                  setShowBulkUpdate(false)
                  setBulkReason('')
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Ακύρωση
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
