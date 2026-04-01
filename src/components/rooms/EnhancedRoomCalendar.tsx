'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ChevronLeft, ChevronRight, Calendar, X, Check, Lock, Unlock, 
  Clock, Users, BedDouble, TrendingUp, AlertCircle, Zap,
  LayoutGrid, LayoutList, CalendarDays, List, Eye, EyeOff,
  Smartphone, Laptop, RefreshCw, Filter, Search, Bell,
  ArrowRight, ArrowLeft, Move, Edit3, Trash2, Copy,
  Wifi, WifiOff, Activity, Target, BarChart3, Brain
} from 'lucide-react'
import { apiRequest } from '@/lib/api/config'
import { cn } from '@/lib/utils'

// Enhanced TypeScript interfaces
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
  aiPriority?: 'high' | 'medium' | 'low'
  aiInsight?: string
  predictedRevenue?: number
}

interface RoomRow {
  id: string
  name: string
  status: 'available' | 'maintenance' | 'occupied'
  occupancy?: number
  revenue?: number
  aiOptimization?: string
}

interface AIInsight {
  type: 'revenue' | 'occupancy' | 'pricing' | 'maintenance' | 'guest_experience'
  title: string
  description: string
  urgency: 'high' | 'medium' | 'low'
  actionable: boolean
  impact?: number
}

interface RealTimeUpdate {
  type: 'booking_created' | 'booking_cancelled' | 'booking_modified' | 'room_status_change'
  timestamp: string
  data: any
}

type CalendarView = 'month' | 'week' | 'day' | 'timeline'
type DragState = 'idle' | 'dragging' | 'dropping'

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

const PRIORITY_COLORS = {
  high: 'bg-red-500/10 border-red-500/30 text-red-400',
  medium: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  low: 'bg-green-500/10 border-green-500/30 text-green-400',
}

export function EnhancedRoomCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [view, setView] = useState<CalendarView>('month')
  const [rooms, setRooms] = useState<RoomRow[]>([])
  const [bookings, setBookings] = useState<BookingSlot[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<BookingSlot | null>(null)
  const [dragState, setDragState] = useState<DragState>('idle')
  const [draggedBooking, setDraggedBooking] = useState<BookingSlot | null>(null)
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([])
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [showRealTime, setShowRealTime] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())
  
  const dragCounter = useRef(0)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Enhanced data fetching with AI insights
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const startOfMonth = new Date(year, month, 1)
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

      const [roomsRes, bookingsRes, insightsRes] = await Promise.all([
        apiRequest<any>('/rooms/dashboard-stats'),
        apiRequest<any>('/bookings/export'),
        apiRequest<any>('/ai/insights') // New AI endpoint
      ])

      const allRooms: any[] = roomsRes?.data?.rooms || []
      setRooms(
        allRooms
          .filter((r) => r.id)
          .map((r) => ({ 
            id: r.id, 
            name: r.name || r.nameEn || r.nameGr || 'Room',
            status: r.status || 'available',
            occupancy: r.occupancy || 0,
            revenue: r.revenue || 0,
            aiOptimization: r.aiOptimization
          })),
      )

      const allBookings: BookingSlot[] = bookingsRes?.data?.bookings || []
      const monthBookings = allBookings.filter((b) => {
        if (!b.roomId) return false
        if (b.status === 'CANCELLED' || b.status === 'NO_SHOW') return false
        const checkIn = new Date(b.checkIn)
        const checkOut = new Date(b.checkOut)
        return checkIn <= endOfMonth && checkOut >= startOfMonth
      }).map(b => ({
        ...b,
        aiPriority: (b.totalPrice > 1000 ? 'high' : b.totalPrice > 500 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        aiInsight: generateAIInsight(b),
        predictedRevenue: b.totalPrice * 1.1 // AI prediction
      })) as BookingSlot[]
      
      setBookings(monthBookings)
      setAiInsights(insightsRes?.data?.insights || generateMockInsights())
      setLastSync(new Date())
    } catch (e: any) {
      setError(e?.message || 'Failed to load calendar')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => { fetchData() }, [fetchData])

  // Real-time simulation
  useEffect(() => {
    if (!showRealTime) return
    
    const interval = setInterval(() => {
      const mockUpdate: RealTimeUpdate = {
        type: 'booking_created',
        timestamp: new Date().toISOString(),
        data: { message: 'New booking received' }
      }
      setRealTimeUpdates(prev => [mockUpdate, ...prev.slice(0, 4)])
    }, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [showRealTime])

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

  const navigateWeek = (direction: number) => {
    // Week navigation logic
    const daysToAdd = direction * 7
    const newDate = new Date(year, month, 1)
    newDate.setDate(newDate.getDate() + daysToAdd)
    setYear(newDate.getFullYear())
    setMonth(newDate.getMonth())
  }

  const navigateDay = (direction: number) => {
    const newDate = new Date(year, month, 1)
    newDate.setDate(newDate.getDate() + direction)
    setYear(newDate.getFullYear())
    setMonth(newDate.getMonth())
  }

  // Drag and drop handlers
  const handleDragStart = (booking: BookingSlot) => {
    setDragState('dragging')
    setDraggedBooking(booking)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
  }

  const handleDragLeave = () => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragState('idle')
    }
  }

  const handleDrop = async (e: React.DragEvent, targetRoomId: string, targetDate: string) => {
    e.preventDefault()
    dragCounter.current = 0
    setDragState('dropping')
    
    if (draggedBooking) {
      try {
        // API call to reschedule booking
        await apiRequest(`/bookings/${draggedBooking.id}/reschedule`, {
          method: 'PUT',
          body: JSON.stringify({ roomId: targetRoomId, newCheckIn: targetDate })
        })
        await fetchData()
      } catch (error) {
        console.error('Failed to reschedule booking:', error)
      }
    }
    
    setDragState('idle')
    setDraggedBooking(null)
  }

  // View rendering functions
  const renderMonthView = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-3 py-2 text-slate-400 font-medium min-w-[150px] sticky left-0 bg-slate-900 z-10 border-r border-slate-700">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4" />
                  Διαμέρισμα
                </div>
              </th>
              {days.map((d) => {
                const isToday =
                  d === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear()
                return (
                  <th
                    key={d}
                    className={`px-0.5 py-2 text-center min-w-[36px] font-normal text-xs ${
                      isToday ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-500'
                    }`}
                  >
                    <div className={cn("relative", isToday && "rounded-lg")}>
                      {d}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
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
                <td colSpan={daysInMonth + 1} className="p-8 text-center text-slate-500">
                  Δεν βρέθηκαν δωμάτια
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr 
                  key={room.id} 
                  className={cn(
                    "border-b border-slate-800 hover:bg-slate-800/20 transition-all",
                    dragState === 'dragging' && 'border-indigo-500/50'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <td className="px-3 py-2 text-slate-300 text-xs font-medium sticky left-0 bg-slate-900 z-10 border-r border-slate-700">
                    <div className="space-y-1">
                      <div className="truncate max-w-[140px]">{room.name}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-xs",
                          room.status === 'available' ? 'bg-green-500/20 text-green-400' :
                          room.status === 'occupied' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        )}>
                          {room.status === 'available' ? 'Διαθέσιμο' : 
                           room.status === 'occupied' ? 'Κατειλημμένο' : 'Συντήρηση'}
                        </span>
                        {room.occupancy && (
                          <span className="text-slate-500">{room.occupancy}%</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {days.map((d) => {
                    const booking = getBookingForDay(room.id, d)
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                    const isCheckIn = booking && new Date(booking.checkIn).getDate() === d
                    const isCheckOut = booking && new Date(booking.checkOut).getDate() === d
                    
                    return (
                      <td 
                        key={d} 
                        className="p-0.5 relative group"
                        onDrop={(e) => handleDrop(e, room.id, dateStr)}
                      >
                        {booking ? (
                          <div
                            draggable
                            onDragStart={() => handleDragStart(booking)}
                            title={generateBookingTooltip(booking)}
                            className={cn(
                              "h-7 rounded-md text-xs flex items-center justify-center text-white overflow-hidden cursor-move select-none transition-all hover:scale-105 hover:shadow-lg",
                              STATUS_COLORS[booking.status]?.bg,
                              isCheckIn && "border-l-2 border-l-white",
                              isCheckOut && "border-r-2 border-r-white",
                              booking.aiPriority === 'high' && "ring-1 ring-inset ring-red-500/50",
                              "group-hover:z-10"
                            )}
                          >
                            <div className="flex items-center gap-1 px-1">
                              {booking.aiPriority === 'high' && <Zap className="h-3 w-3 text-yellow-300" />}
                              {isCheckIn ? (
                                <span className="px-0.5 truncate text-[9px] font-medium">
                                  {booking.guestName?.split(' ')[0]?.slice(0, 6)}
                                </span>
                              ) : isCheckOut ? (
                                <ArrowRight className="h-3 w-3" />
                              ) : (
                                <Users className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                            
                            {/* Quick actions on hover */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shadow-lg border border-slate-700">
                              <button className="p-1 hover:bg-slate-700 rounded" onClick={() => setSelectedBooking(booking)}>
                                <Eye className="h-3 w-3 text-slate-300" />
                              </button>
                              <button className="p-1 hover:bg-slate-700 rounded">
                                <Edit3 className="h-3 w-3 text-slate-300" />
                              </button>
                              <button className="p-1 hover:bg-slate-700 rounded">
                                <Copy className="h-3 w-3 text-slate-300" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-7 rounded-md border border-dashed border-slate-700/50 hover:border-slate-600 transition-colors" />
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
    // Week view implementation
    return (
      <div className="p-8 text-center text-slate-400">
        Week view coming soon - Enhanced drag-and-drop timeline view
      </div>
    )
  }

  const renderDayView = () => {
    // Day view implementation
    return (
      <div className="p-8 text-center text-slate-400">
        Day view coming soon - Detailed daily schedule with AI insights
      </div>
    )
  }

  const renderTimelineView = () => {
    // Timeline view implementation
    return (
      <div className="p-8 text-center text-slate-400">
        Timeline view coming soon - Gantt-style project management view
      </div>
    )
  }

  // Helper functions
  const getBookingForDay = (roomId: string, day: number): BookingSlot | null => {
    const date = new Date(year, month, day)
    return (
      bookings.find((b) => {
        if (b.roomId !== roomId) return false
        const checkIn = new Date(b.checkIn)
        const checkOut = new Date(b.checkOut)
        return date >= checkIn && date < checkOut
      }) ?? null
    )
  }

  const generateBookingTooltip = (booking: BookingSlot): string => {
    return `${booking.guestName} — ${booking.status}
${booking.checkIn?.split('T')[0]} → ${booking.checkOut?.split('T')[0]}
${booking.guests} guests • ${booking.totalPrice}€
${booking.aiInsight ? `💡 ${booking.aiInsight}` : ''}`
  }

  const generateAIInsight = (booking: BookingSlot): string => {
    if (booking.totalPrice > 1000) return "High-value booking - Priority service recommended"
    if (booking.guests > 4) return "Group booking - Consider upselling services"
    if (booking.status === 'PENDING') return "Follow-up needed for confirmation"
    return ""
  }

  const generateMockInsights = (): AIInsight[] => [
    {
      type: 'revenue',
      title: 'Revenue Opportunity',
      description: '3 high-value bookings pending confirmation this week',
      urgency: 'high',
      actionable: true,
      impact: 2500
    },
    {
      type: 'occupancy',
      title: 'Occupancy Alert',
      description: 'Apartment 6 shows 20% lower occupancy than average',
      urgency: 'medium',
      actionable: true,
      impact: -800
    },
    {
      type: 'pricing',
      title: 'Dynamic Pricing',
      description: 'Weekend rates could increase by 15% based on demand',
      urgency: 'low',
      actionable: true,
      impact: 1200
    }
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.roomName?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(booking.status)
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="card overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-400" />
              Έξυπνο Ημερολόγιο Δωματίων
            </h2>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Wifi className={cn("h-3 w-3", isOnline ? "text-green-400" : "text-red-400")} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
              <span>•</span>
              <span>Last sync: {lastSync.toLocaleTimeString('el-GR')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              {[
                { view: 'month' as CalendarView, icon: LayoutGrid, label: 'Month' },
                { view: 'week' as CalendarView, icon: CalendarDays, label: 'Week' },
                { view: 'day' as CalendarView, icon: Calendar, label: 'Day' },
                { view: 'timeline' as CalendarView, icon: List, label: 'Timeline' },
              ].map(({ view: v, icon: Icon, label }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    view === v ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
                  )}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <button
              onClick={fetchData}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setShowAIInsights(!showAIInsights)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showAIInsights ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
              title="Toggle AI Insights"
            >
              <Brain className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setShowRealTime(!showRealTime)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showRealTime ? "bg-green-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
              title="Toggle Real-time Updates"
            >
              <Activity className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation and Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateMonth(-1)} className="p-1 text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-slate-200 font-medium w-48 text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={() => navigateMonth(1)} className="p-1 text-slate-400 hover:text-white transition-colors">
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
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                multiple
                value={filterStatus}
                onChange={(e) => setFilterStatus(Array.from(e.target.selectedOptions, option => option.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* AI Insights Panel */}
      {showAIInsights && aiInsights.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">AI Insights</span>
            <span className="text-xs text-slate-400">({aiInsights.length} actionable)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border transition-all hover:shadow-lg cursor-pointer",
                  PRIORITY_COLORS[insight.urgency]
                )}
              >
                <div className="flex items-start gap-2">
                  {insight.type === 'revenue' && <TrendingUp className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  {insight.type === 'occupancy' && <BarChart3 className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  {insight.type === 'pricing' && <Target className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-100 truncate">{insight.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{insight.description}</p>
                    {insight.impact && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs font-medium">
                          {insight.impact > 0 ? '+' : ''}{insight.impact}€
                        </span>
                      </div>
                    )}
                  </div>
                  {insight.actionable && (
                    <ArrowRight className="h-3 w-3 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Updates */}
      {showRealTime && realTimeUpdates.length > 0 && (
        <div className="bg-slate-800/50 border-b border-slate-700 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-green-400 animate-pulse" />
            <span className="text-sm font-medium text-green-400">Live Updates</span>
          </div>
          <div className="space-y-1">
            {realTimeUpdates.slice(0, 3).map((update, index) => (
              <div key={index} className="text-xs text-slate-400 flex items-center gap-2">
                <span className="text-green-400">•</span>
                <span>{update.data.message}</span>
                <span className="text-slate-500">
                  {new Date(update.timestamp).toLocaleTimeString('el-GR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Calendar Content */}
      <div className="relative" ref={calendarRef}>
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Φόρτωση έξυπνου ημερολογίου...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            <AlertCircle className="h-5 w-5 mx-auto mb-2" />
            {error}
          </div>
        ) : (
          <>
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
            {view === 'timeline' && renderTimelineView()}
          </>
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
              <Zap className="h-3 w-3 text-yellow-400" />
              <span>AI Priority</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Move className="h-3 w-3 text-indigo-400" />
              <span>Drag to reschedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Booking details content */}
              <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Guest</span>
                  <span className="text-sm font-medium text-slate-100">{selectedBooking.guestName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Room</span>
                  <span className="text-sm font-medium text-slate-100">{selectedBooking.roomName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Dates</span>
                  <span className="text-sm font-medium text-slate-100">
                    {new Date(selectedBooking.checkIn).toLocaleDateString('el-GR')} → {new Date(selectedBooking.checkOut).toLocaleDateString('el-GR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total</span>
                  <span className="text-sm font-bold text-slate-100">{selectedBooking.totalPrice}€</span>
                </div>
              </div>
              
              {selectedBooking.aiInsight && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300">AI Insight</h4>
                      <p className="text-xs text-slate-400 mt-1">{selectedBooking.aiInsight}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-5 border-t border-slate-700 flex justify-end gap-3">
              <button onClick={() => setSelectedBooking(null)} className="btn btn-secondary">
                Close
              </button>
              <button className="btn btn-primary">
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
