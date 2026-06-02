'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, LogIn, LogOut, Users, CalendarRange,
} from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { roomsApi, type Room } from '@/lib/api/rooms'
import { Booking } from '@/lib/api/types'

// ── Date helpers ──────────────────────────────────────────────────────────────

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
function toStr(date: Date): string {
  return date.toISOString().split('T')[0]
}
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

const DAYS_SHORT = ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ']
const MONTHS_SHORT = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
const MONTHS_FULL  = ['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος']

// ── Status styles ─────────────────────────────────────────────────────────────

const STATUS_START: Record<string, string> = {
  CONFIRMED:  'bg-green-500/30 border-l-2 border-green-500',
  CHECKED_IN: 'bg-purple-500/30 border-l-2 border-purple-500',
  PENDING:    'bg-yellow-500/30 border-l-2 border-yellow-500',
  COMPLETED:  'bg-blue-500/20  border-l-2 border-blue-500',
}
const STATUS_CONT: Record<string, string> = {
  CONFIRMED:  'bg-green-500/15',
  CHECKED_IN: 'bg-purple-500/15',
  PENDING:    'bg-yellow-500/15',
  COMPLETED:  'bg-blue-500/10',
}
const STATUS_DOT: Record<string, string> = {
  CONFIRMED:  'bg-green-500',
  CHECKED_IN: 'bg-purple-500',
  PENDING:    'bg-yellow-500',
  COMPLETED:  'bg-blue-500',
}

const DAYS_IN_VIEW = 14

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>(() => getMonday(new Date()))
  const [rooms, setRooms]       = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading]   = useState(true)

  const days    = useMemo(() => Array.from({ length: DAYS_IN_VIEW }, (_, i) => addDays(startDate, i)), [startDate])
  const todayStr = toStr(new Date())

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await roomsApi.getBookable()
        setRooms(res.data?.rooms ?? [])
      } catch {}

      try {
        // Fetch wide range so ongoing stays (started before period) are included
        const from = toStr(addDays(startDate, -60))
        const to   = toStr(addDays(startDate, DAYS_IN_VIEW + 1))
        const res  = await bookingsApi.getAll({ dateFrom: from, dateTo: to, limit: 300 })
        setBookings(
          (res.data?.bookings ?? []).filter(b => !['CANCELLED', 'NO_SHOW'].includes(b.status))
        )
      } catch {}

      setLoading(false)
    }
    load()
  }, [startDate])

  // roomId → dayStr → Booking  (for cells that are occupied)
  const occupiedMap = useMemo(() => {
    const map: Record<string, Record<string, Booking>> = {}
    bookings.forEach(b => {
      if (!b.roomId) return
      const ci = new Date(b.checkIn)
      const co = new Date(b.checkOut) // checkout day = free
      for (let d = new Date(ci); d < co; d = addDays(d, 1)) {
        const s = toStr(d)
        if (!map[b.roomId]) map[b.roomId] = {}
        map[b.roomId][s] = b
      }
    })
    return map
  }, [bookings])

  // roomId → dayStr → Booking  (for the checkout day itself)
  const checkoutMap = useMemo(() => {
    const map: Record<string, Record<string, Booking>> = {}
    bookings.forEach(b => {
      if (!b.roomId) return
      const s = toStr(new Date(b.checkOut))
      if (!map[b.roomId]) map[b.roomId] = {}
      map[b.roomId][s] = b
    })
    return map
  }, [bookings])

  // Today stats
  const todayArrivals   = bookings.filter(b => b.checkIn.startsWith(todayStr)).length
  const todayDepartures = bookings.filter(b => b.checkOut.startsWith(todayStr)).length
  const occupiedToday   = new Set(
    bookings.filter(b => b.roomId && occupiedMap[b.roomId]?.[todayStr]).map(b => b.roomId)
  ).size

  // Period label
  const periodLabel = (() => {
    const s = days[0], e = days[DAYS_IN_VIEW - 1]
    if (s.getMonth() === e.getMonth())
      return `${s.getDate()} – ${e.getDate()} ${MONTHS_FULL[s.getMonth()]} ${s.getFullYear()}`
    return `${s.getDate()} ${MONTHS_SHORT[s.getMonth()]} – ${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`
  })()

  const noRoomBookings = useMemo(
    () => bookings.filter(b => !b.roomId && days.some(d => {
      const ds = toStr(d)
      return b.checkIn <= ds && b.checkOut > ds
    })),
    [bookings, days]
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/15 p-2.5 rounded-xl">
            <CalendarRange className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Ημερολόγιο</h1>
            <p className="text-sm text-slate-400">Επισκόπηση διαθεσιμότητας ανά δωμάτιο</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartDate(getMonday(new Date()))}
            className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
          >
            Σήμερα
          </button>
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setStartDate(d => addDays(d, -7))}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-slate-100 px-3 min-w-72 text-center">
              {periodLabel}
            </span>
            <button
              onClick={() => setStartDate(d => addDays(d, 7))}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card py-4 flex items-center gap-4">
          <div className="bg-emerald-500/15 p-3 rounded-xl">
            <LogIn className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-100">{todayArrivals}</p>
            <p className="text-sm text-slate-400">Αφίξεις σήμερα</p>
          </div>
        </div>
        <div className="card py-4 flex items-center gap-4">
          <div className="bg-orange-500/15 p-3 rounded-xl">
            <LogOut className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-100">{todayDepartures}</p>
            <p className="text-sm text-slate-400">Αναχωρήσεις σήμερα</p>
          </div>
        </div>
        <div className="card py-4 flex items-center gap-4">
          <div className="bg-blue-500/15 p-3 rounded-xl">
            <Users className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-100">
              {occupiedToday}
              <span className="text-lg text-slate-500 font-medium">/{rooms.length}</span>
            </p>
            <p className="text-sm text-slate-400">Κατειλημμένα δωμάτια</p>
          </div>
        </div>
      </div>

      {/* Room Timeline */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700">
                {/* Room header */}
                <th
                  className="sticky left-0 z-20 bg-slate-800 border-r border-slate-700 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400"
                  style={{ minWidth: '160px', width: '160px' }}
                >
                  Δωμάτιο
                </th>
                {/* Day headers */}
                {days.map(day => {
                  const ds        = toStr(day)
                  const isToday   = ds === todayStr
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6
                  return (
                    <th
                      key={ds}
                      className={`border-r border-slate-700/50 px-1 py-2 text-center transition-colors ${
                        isToday ? 'bg-blue-600/20' : isWeekend ? 'bg-slate-800/40' : ''
                      }`}
                      style={{ minWidth: '64px', width: '64px' }}
                    >
                      <p className={`text-xs font-semibold ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                        {DAYS_SHORT[day.getDay()]}
                      </p>
                      <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-blue-300' : 'text-slate-200'}`}>
                        {day.getDate()}
                      </p>
                      {isToday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mx-auto mt-0.5" />
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/40">
              {loading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i}>
                    <td className="sticky left-0 z-10 bg-slate-900 px-4 py-3 border-r border-slate-700">
                      <div className="h-4 w-28 bg-slate-700/60 rounded animate-pulse" />
                    </td>
                    {days.map(d => (
                      <td key={toStr(d)} className="px-1 py-2 border-r border-slate-700/30">
                        <div className="h-8 rounded bg-slate-800/60 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={DAYS_IN_VIEW + 1} className="py-16 text-center text-slate-400">
                    Δεν βρέθηκαν δωμάτια. Ελέγξτε τη σύνδεση με τον server.
                  </td>
                </tr>
              ) : (
                rooms.map(room => {
                  const occupied  = occupiedMap[room.id]  ?? {}
                  const checkouts = checkoutMap[room.id]  ?? {}

                  return (
                    <tr key={room.id} className="group hover:bg-slate-800/20 transition-colors">
                      {/* Room name — sticky */}
                      <td
                        className="sticky left-0 z-10 bg-slate-900 group-hover:bg-slate-800/40 px-4 border-r border-slate-700 transition-colors"
                        style={{ minWidth: '160px', width: '160px', height: '52px' }}
                      >
                        <p className="text-sm font-semibold text-slate-100 truncate">
                          {room.nameGr || room.nameEn || room.name}
                        </p>
                      </td>

                      {/* Day cells */}
                      {days.map(day => {
                        const ds        = toStr(day)
                        const booking   = occupied[ds]
                        const departure = checkouts[ds]
                        const isToday   = ds === todayStr
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6
                        const isStart   = booking ? toStr(new Date(booking.checkIn)) === ds : false

                        let cellBg = isToday
                          ? 'bg-blue-500/5'
                          : isWeekend
                          ? 'bg-slate-800/20'
                          : ''

                        if (booking) {
                          cellBg = isStart
                            ? (STATUS_START[booking.status] ?? 'bg-slate-500/20 border-l-2 border-slate-500')
                            : (STATUS_CONT[booking.status]  ?? 'bg-slate-500/10')
                        }

                        return (
                          <td
                            key={ds}
                            className={`border-r border-slate-700/30 px-0.5 py-1 relative ${cellBg} ${booking ? 'cursor-pointer hover:brightness-110' : ''}`}
                            style={{ minWidth: '64px', width: '64px', height: '52px' }}
                            onClick={() => booking && router.push(`/bookings/${booking.id}`)}
                            title={
                              booking
                                ? `${booking.guestName} · ${booking.checkIn} → ${booking.checkOut}`
                                : departure
                                ? `Αναχώρηση: ${departure.guestName}`
                                : undefined
                            }
                          >
                            {isStart && booking && (
                              <div className="px-1.5">
                                <p className="text-xs font-bold text-white leading-tight truncate">
                                  {booking.guestName.split(' ')[0]}
                                </p>
                                <p className="text-[10px] text-white/60 leading-tight mt-0.5 truncate">
                                  {booking.guests} {booking.guests === 1 ? 'άτομο' : 'άτομα'}
                                </p>
                              </div>
                            )}
                            {!booking && departure && (
                              <div className="flex items-center justify-center h-full opacity-40">
                                <LogOut className="h-3.5 w-3.5 text-slate-400" />
                              </div>
                            )}
                            {isStart && booking && (
                              <div
                                className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status] ?? 'bg-slate-400'}`}
                              />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-5 px-5 py-3 border-t border-slate-700/50 bg-slate-800/30">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Κατάσταση:</span>
          {[
            { label: 'Επιβεβαιωμένη', cls: 'bg-green-500' },
            { label: 'Check-in (Μέσα)', cls: 'bg-purple-500' },
            { label: 'Εκκρεμεί',        cls: 'bg-yellow-500' },
            { label: 'Ολοκληρωμένη',    cls: 'bg-blue-500' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-sm ${s.cls} opacity-70`} />
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-4">
            <LogOut className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">Αναχώρηση</span>
          </div>
        </div>
      </div>

      {/* Unassigned bookings (no roomId) */}
      {!loading && noRoomBookings.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Κρατήσεις χωρίς δωμάτιο — {noRoomBookings.length}
          </h3>
          <div className="space-y-2">
            {noRoomBookings.map(b => (
              <Link
                key={b.id}
                href={`/bookings/${b.id}`}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{b.guestName}</p>
                  <p className="text-xs text-slate-400">{b.property?.titleGr || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-300">{b.checkIn} → {b.checkOut}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.status}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
