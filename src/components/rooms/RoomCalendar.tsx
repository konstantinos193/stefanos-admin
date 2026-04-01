'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ChevronLeft, ChevronRight, Calendar, X, Check, Lock, Unlock, 
  Clock, Users, BedDouble, TrendingUp, AlertCircle, Zap,
  LayoutGrid, LayoutList, CalendarDays, Eye, EyeOff,
  Smartphone, Laptop, RefreshCw, Filter, Search, Bell,
  ArrowRight, ArrowLeft, Move, Edit3, Trash2, Copy,
  Wifi, WifiOff, Activity, Target, BarChart3, Brain, Plus, Settings
} from 'lucide-react'
import { roomsApi, DashboardRoom } from '@/lib/api/rooms'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
import { cn } from '@/lib/utils'

interface BookingSlot {
  id: string
  roomId: string | null
  roomName: string | null
  guestName: string
  guestEmail?: string
  guestPhone?: string
  checkIn: string
  checkOut: string
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  totalPrice: number
  currency: string
  source?: string
  guests: number
  property?: {
    id: string
    titleGr: string
  }
}

interface RoomRow {
  id: string
  name: string
  status: 'available' | 'maintenance' | 'occupied'
}

const MONTH_NAMES = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
  'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
]

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  CONFIRMED: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  CHECKED_IN: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  COMPLETED: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
  CANCELLED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  NO_SHOW: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
}

type CalendarView = 'month' | 'week' | 'day'

export function RoomCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [bookings, setBookings] = useState<BookingSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<BookingSlot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  
  const calendarRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

      // Use the correct API endpoints
      const [roomsRes, bookingsRes] = await Promise.all([
        roomsApi.getDashboardStats(),
        bookingsApi.getAll({
          dateFrom: startOfMonth.toISOString().split('T')[0],
          dateTo: endOfMonth.toISOString().split('T')[0],
          limit: 1000 // Get all bookings for the month
        }),
      ])

      const allRooms: DashboardRoom[] = roomsRes?.data?.rooms || []
      console.log('Loaded rooms:', allRooms) // Debug log
      setRooms(
        allRooms
          .filter((r) => r.id)
          .map((r) => ({ 
            id: r.id, 
            name: r.nameGr || r.nameEn || r.name || `Room ${r.id}`,
            status: r.isOccupied ? 'occupied' : 'available'
          })),
      )

      const allBookings: Booking[] = bookingsRes?.data?.bookings || []
      console.log('Loaded bookings:', allBookings) // Debug log
      const monthBookings: BookingSlot[] = allBookings.filter((b) => {
        // Accept bookings with either roomId or propertyId for property-level bookings
        if (!b.roomId && !b.propertyId) return false
        if (b.status === 'CANCELLED' || b.status === 'NO_SHOW') return false
        const checkIn = new Date(b.checkIn)
        const checkOut = new Date(b.checkOut)
        return checkIn <= endOfMonth && checkOut >= startOfMonth
      }).map(b => {
        // Find room name - try roomId first, then use property title for property-level bookings
        let roomName = 'Unknown'
        if (b.roomId) {
          roomName = allRooms.find(r => r.id === b.roomId)?.nameGr || 
                    allRooms.find(r => r.id === b.roomId)?.nameEn || 
                    b.roomName || 
                    'Unknown'
        } else if (b.property?.titleGr) {
          roomName = b.property.titleGr
        } else if (b.property?.titleEn) {
          roomName = b.property.titleEn
        }
        
        return {
          id: b.id,
          roomId: b.roomId || b.propertyId, // Use propertyId as fallback for roomId
          roomName,
          guestName: b.guestName || b.guest?.name || 'Unknown',
          guestEmail: b.guestEmail || b.guest?.email || undefined,
          guestPhone: b.guestPhone || b.guest?.phone || undefined,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status,
          totalPrice: b.totalPrice || 0,
          currency: b.currency || 'EUR',
          source: b.source,
          guests: b.guests || 1,
          property: b.property
        }
      })
      
      console.log('Processed month bookings:', monthBookings) // Debug log
      setBookings(monthBookings)
    } catch (e: any) {
      console.error('Calendar fetch error:', e)
      setError(e?.message || 'Failed to load calendar')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Simplified loading states
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setTimeout(() => setIsRefreshing(false), 300)
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && e.ctrlKey) {
        navigateMonth(-1)
      } else if (e.key === 'ArrowRight' && e.ctrlKey) {
        navigateMonth(1)
      } else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault()
        handleRefresh()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [month, year])

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

  // Helper functions
  const generateBookingTooltip = (booking: BookingSlot): string => {
    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000)
    return `${booking.guestName} — ${booking.status}
${booking.checkIn?.split('T')[0]} → ${booking.checkOut?.split('T')[0]} (${nights} nights)
${booking.guests} guests • ${booking.totalPrice}€
${booking.source ? `Via ${booking.source}` : ''}`
  }

  // Enhanced navigation
  const navigateMonth = (direction: number) => {
    if (direction === -1) {
      if (month === 0) { setMonth(11); setYear((y) => y - 1) }
      else setMonth((m) => m - 1)
    } else {
      if (month === 11) { setMonth(0); setYear((y) => y + 1) }
      else setMonth((m) => m + 1)
    }
  }

  // Enhanced skeleton with modern design
  const CalendarSkeleton = () => (
    <div className="animate-pulse opacity-60">
      {/* Modern header skeleton */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-8 bg-slate-700/50 rounded-xl w-56 backdrop-blur-sm"></div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-4 w-4 bg-slate-600/50 rounded-full animate-pulse"></div>
              <div className="h-3 w-20 bg-slate-600/50 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"></div>
            <div className="h-10 w-10 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"></div>
            <div className="h-10 w-10 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors animate-spin"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"></div>
            <div className="h-6 w-56 bg-slate-700/50 rounded-lg"></div>
            <div className="h-10 w-10 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-72 bg-slate-700/50 rounded-lg backdrop-blur-sm"></div>
            <div className="h-10 w-24 bg-slate-700/50 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Calendar grid skeleton with enhanced design */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-4 py-3 min-w-[160px]">
                <div className="h-5 bg-slate-700/50 rounded-lg w-24 backdrop-blur-sm"></div>
              </th>
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i} className="px-1 py-3 min-w-[40px]">
                  <div className="h-5 bg-slate-700/50 rounded w-6 mx-auto backdrop-blur-sm"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }, (_, roomIndex) => (
              <tr key={roomIndex} className="border-b border-slate-800/30 hover:bg-slate-800/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-36 backdrop-blur-sm"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 bg-slate-600/50 rounded w-20 backdrop-blur-sm"></div>
                      <div className="h-4 bg-slate-600/50 rounded w-12 backdrop-blur-sm"></div>
                    </div>
                  </div>
                </td>
                {Array.from({ length: 31 }, (_, dayIndex) => (
                  <td key={dayIndex} className="p-1">
                    <div className="h-8 bg-slate-700/30 rounded-lg hover:bg-slate-600/30 transition-colors backdrop-blur-sm"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const AISkeleton = () => (
    <div className="animate-pulse bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-4 bg-indigo-600 rounded"></div>
        <div className="h-4 bg-indigo-600 rounded w-24"></div>
        <div className="h-3 bg-indigo-600 rounded w-16"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="p-3 rounded-lg border bg-slate-800/50">
            <div className="flex items-start gap-2">
              <div className="h-4 w-4 bg-slate-600 rounded"></div>
              <div className="flex-1">
                <div className="h-3 bg-slate-600 rounded w-32 mb-2"></div>
                <div className="h-2 bg-slate-600 rounded w-full mb-1"></div>
                <div className="h-2 bg-slate-600 rounded w-3/4"></div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="h-3 bg-slate-600 rounded w-12"></div>
                </div>
              </div>
              <div className="h-3 w-3 bg-slate-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Enhanced month view with modern UX
  const renderMonthView = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-4 py-3 text-slate-400 font-medium min-w-[160px] sticky left-0 bg-slate-900/95 backdrop-blur-sm z-10 border-r border-slate-700/50">
                <div className="flex items-center gap-3">
                  <BedDouble className="h-4 w-4 text-indigo-400" />
                  <span className="text-slate-300">Διαμέρισμα</span>
                </div>
              </th>
              {days.map((d) => {
                const isToday =
                  d === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear()
                const isWeekend = new Date(year, month, d).getDay() === 0 || new Date(year, month, d).getDay() === 6
                
                return (
                  <th
                    key={d}
                    className={`px-1 py-3 text-center min-w-[40px] font-normal text-xs transition-all duration-200 ${
                      isToday 
                        ? 'text-indigo-400 font-bold bg-indigo-500/10 rounded-lg' 
                        : isWeekend 
                          ? 'text-slate-500 bg-slate-800/30' 
                          : 'text-slate-400'
                    }`}
                  >
                    <div className={cn("relative group", isToday && "rounded-lg")}>
                      <span className="group-hover:scale-110 transition-transform duration-200">{d}</span>
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-lg shadow-indigo-400/50" />
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 1} className="p-12 text-center text-slate-500">
                  <div className="space-y-3">
                    <BedDouble className="h-12 w-12 text-slate-600 mx-auto" />
                    <p className="text-lg font-medium">Δεν βρέθηκαν δωμάτια</p>
                    <p className="text-sm text-slate-600">Προσθέστε δωμάτια για να ξεκινήσετε</p>
                  </div>
                </td>
              </tr>
            ) : (
              rooms.map((room, roomIndex) => (
                <tr 
                  key={room.id} 
                  className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-all duration-300 group"
                  style={{
                    animationDelay: `${roomIndex * 50}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <td className="px-4 py-3 text-slate-300 text-xs font-medium sticky left-0 bg-slate-900/95 backdrop-blur-sm z-10 border-r border-slate-700/50">
                    <div className="space-y-2">
                      <div className="truncate max-w-[150px] group-hover:text-slate-200 transition-colors">
                        {room.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
                          room.status === 'available' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : room.status === 'occupied' 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        )}>
                          {room.status === 'available' ? 'Διαθέσιμο' : 
                           room.status === 'occupied' ? 'Κατειλημμένο' : 'Συντήρηση'}
                        </span>
                      </div>
                    </div>
                  </td>
                  {days.map((d) => {
                    const booking = getBookingForDay(room.id, d)
                    const isCheckIn = booking && new Date(booking.checkIn).getDate() === d
                    const isCheckOut = booking && new Date(booking.checkOut).getDate() === d
                    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                    
                    return (
                      <td 
                        key={d} 
                        className="p-1 relative group"
                        style={{
                          animationDelay: `${(roomIndex * 31 + d) * 10}ms`,
                          animation: 'fadeIn 0.3s ease-out forwards'
                        }}
                      >
                        {booking ? (
                          <div
                            title={generateBookingTooltip(booking)}
                            className={cn(
                              "h-8 rounded-lg text-xs flex items-center justify-center text-white overflow-hidden cursor-default select-none transition-all duration-300 hover:scale-105 hover:shadow-xl hover:z-20",
                              STATUS_COLORS[booking.status]?.bg,
                              isCheckIn && "border-l-2 border-l-white shadow-lg",
                              isCheckOut && "border-r-2 border-r-white shadow-lg",
                              isToday && "ring-2 ring-indigo-400/50",
                              "group-hover:ring-2 group-hover:ring-white/30"
                            )}
                          >
                            <div className="flex items-center gap-1 px-1">
                              {isCheckIn ? (
                                <span className="px-1 truncate text-[9px] font-medium animate-pulse">
                                  {booking.guestName?.split(' ')[0]?.slice(0, 6)}
                                </span>
                              ) : isCheckOut ? (
                                <ArrowRight className="h-3 w-3 animate-pulse" />
                              ) : (
                                <Users className="h-3 w-3 opacity-80" />
                              )}
                            </div>
                            
                            {/* Enhanced quick actions */}
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-sm rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 shadow-xl border border-slate-700/50">
                              <button 
                                className="p-1.5 hover:bg-slate-700 rounded transition-colors group/action"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="h-3 w-3 text-slate-300 group-hover/action:text-indigo-400 transition-colors" />
                              </button>
                              <button className="p-1.5 hover:bg-slate-700 rounded transition-colors group/action">
                                <Edit3 className="h-3 w-3 text-slate-300 group-hover/action:text-amber-400 transition-colors" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={cn(
                            "h-8 rounded-lg border border-dashed transition-all duration-200",
                            isToday 
                              ? "border-indigo-400/50 bg-indigo-500/5 hover:border-indigo-400 hover:bg-indigo-500/10" 
                              : "border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-700/20"
                          )} />
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
    )
  }

  const renderWeekView = () => {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CalendarDays className="h-8 w-8 text-indigo-400" />
            <span className="text-lg font-medium">Week View</span>
          </div>
          <p className="text-sm">Enhanced week view with drag-and-drop timeline coming soon</p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Move className="h-3 w-3" />
              <span>Drag bookings to reschedule</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span>AI-powered optimization</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="h-8 w-8 text-indigo-400" />
            <span className="text-lg font-medium">Day View</span>
          </div>
          <p className="text-sm">Detailed daily schedule with AI insights coming soon</p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Hour-by-hour scheduling</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Revenue predictions</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show skeleton on initial load
  if (loading && rooms.length === 0) {
    return <CalendarSkeleton />
  }

  return (
    <div className="card overflow-hidden">
      {/* Enhanced Header with smooth transitions */}
      <div className="p-4 border-b border-slate-700 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                  Ημερολόγιο Δωματίων
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Switcher */}
                <div className="flex bg-slate-800 rounded-lg p-1">
                  {[
                    { view: 'month' as CalendarView, icon: LayoutGrid, label: 'Month' },
                    { view: 'week' as CalendarView, icon: CalendarDays, label: 'Week' },
                    { view: 'day' as CalendarView, icon: Calendar, label: 'Day' },
                  ].map(({ view: v, icon: Icon, label }) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        "p-1.5 rounded transition-all duration-200",
                        view === v ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                      )}
                      title={label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isRefreshing 
                      ? "bg-indigo-600 text-white animate-spin" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Navigation and Search */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigateMonth(-1)} 
                  className="p-1 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-slate-200 font-medium w-48 text-center transition-all duration-200">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button 
                  onClick={() => navigateMonth(1)} 
                  className="p-1 text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookings..."
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    multiple
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(Array.from(e.target.selectedOptions, option => option.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CHECKED_IN">Check-in</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar Content with smooth transitions */}
          <div className="relative" ref={calendarRef}>
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <div className="flex items-center justify-center gap-3">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Refreshing calendar...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">
                <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                {error}
              </div>
            ) : (
              <div className={cn(
                "transition-all duration-500",
                isRefreshing ? "opacity-50" : "opacity-100"
              )}>
                {view === 'month' && renderMonthView()}
                {view === 'week' && renderWeekView()}
                {view === 'day' && renderDayView()}
              </div>
            )}
          </div>

          {/* Enhanced Legend */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                  <span key={status} className="flex items-center gap-1.5">
                    <span className={cn("w-3 h-3 rounded-sm border", colors.bg, colors.border)} />
                    {status === 'PENDING' && 'Εκκρεμής'}
                    {status === 'CONFIRMED' && 'Επιβεβαιωμένη'}
                    {status === 'CHECKED_IN' && 'Check-in'}
                    {status === 'COMPLETED' && 'Ολοκληρωμένη'}
                    {status === 'CANCELLED' && 'Ακυρωμένη'}
                    {status === 'NO_SHOW' && 'Απουσία'}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Eye className="h-3 w-3 text-indigo-400" />
                  <span>Click for details</span>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}
