'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { apiRequest } from '@/lib/api/config'

interface BookingSlot {
  id: string
  roomId: string | null
  roomName: string | null
  guestName: string
  checkIn: string
  checkOut: string
  status: string
}

interface RoomRow {
  id: string
  name: string
}

const MONTH_NAMES = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
  'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-600',
  CONFIRMED: 'bg-indigo-600',
  CHECKED_IN: 'bg-emerald-600',
  COMPLETED: 'bg-slate-500',
  CANCELLED: 'bg-red-700',
}

export function RoomCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [bookings, setBookings] = useState<BookingSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

      const [roomsRes, bookingsRes] = await Promise.all([
        apiRequest<any>('/rooms/dashboard-stats'),
        apiRequest<any>('/bookings/export'),
      ])

      const allRooms: any[] = roomsRes?.data?.rooms || []
      setRooms(
        allRooms
          .filter((r) => r.id)
          .map((r) => ({ id: r.id, name: r.name || r.nameEn || r.nameGr || 'Room' })),
      )

      const allBookings: BookingSlot[] = bookingsRes?.data?.bookings || []
      const monthBookings = allBookings.filter((b) => {
        if (!b.roomId) return false
        if (b.status === 'CANCELLED' || b.status === 'NO_SHOW') return false
        const checkIn = new Date(b.checkIn)
        const checkOut = new Date(b.checkOut)
        return checkIn <= endOfMonth && checkOut >= startOfMonth
      })
      setBookings(monthBookings)
    } catch (e: any) {
      setError(e?.message || 'Failed to load calendar')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  const getBookingForDay = (roomId: string, day: number): BookingSlot | null => {
    const date = new Date(year, month, day)
    return (
      bookings.find((b) => {
        if (b.roomId !== roomId) return false
        const checkIn = new Date(b.checkIn)
        const checkOut = new Date(b.checkOut)
        // Occupied from checkIn (inclusive) to checkOut (exclusive)
        return date >= checkIn && date < checkOut
      }) ?? null
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="font-semibold text-slate-100">Ημερολόγιο Δωματίων</h2>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-slate-200 font-medium w-48 text-center">
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1 text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">Φόρτωση ημερολογίου...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-3 py-2 text-slate-400 font-medium min-w-[130px] sticky left-0 bg-slate-900 z-10 border-r border-slate-700">
                  Διαμέρισμα
                </th>
                {days.map((d) => {
                  const isToday =
                    d === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                  return (
                    <th
                      key={d}
                      className={`px-0.5 py-2 text-center min-w-[34px] font-normal text-xs ${
                        isToday ? 'text-indigo-400 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {d}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 1} className="p-8 text-center text-slate-500">
                    Δεν βρέθηκαν δωμάτια
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-slate-800 hover:bg-slate-800/20">
                    <td className="px-3 py-1.5 text-slate-300 text-xs font-medium sticky left-0 bg-slate-900 z-10 border-r border-slate-700 truncate max-w-[130px]">
                      {room.name}
                    </td>
                    {days.map((d) => {
                      const booking = getBookingForDay(room.id, d)
                      const isCheckIn =
                        booking && new Date(booking.checkIn).getDate() === d &&
                        new Date(booking.checkIn).getMonth() === month &&
                        new Date(booking.checkIn).getFullYear() === year
                      const colorClass = booking ? (STATUS_COLORS[booking.status] || 'bg-slate-600') : ''
                      return (
                        <td key={d} className="p-0.5">
                          {booking ? (
                            <div
                              title={`${booking.guestName} — ${booking.status}\n${booking.checkIn?.split('T')[0]} → ${booking.checkOut?.split('T')[0]}`}
                              className={`h-6 rounded-sm text-xs flex items-center justify-center text-white overflow-hidden cursor-default select-none ${colorClass}`}
                            >
                              {isCheckIn
                                ? <span className="px-0.5 truncate text-[10px]">{booking.guestName?.split(' ')[0]?.slice(0, 7)}</span>
                                : null}
                            </div>
                          ) : (
                            <div className="h-6" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-3 border-t border-slate-700 flex flex-wrap gap-4 text-xs text-slate-500">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm inline-block ${color}`} />
            {status === 'PENDING' && 'Εκκρεμής'}
            {status === 'CONFIRMED' && 'Επιβεβαιωμένη'}
            {status === 'CHECKED_IN' && 'Check-in'}
            {status === 'COMPLETED' && 'Ολοκληρωμένη'}
            {status === 'CANCELLED' && 'Ακυρωμένη'}
          </span>
        ))}
      </div>
    </div>
  )
}
