'use client'

import { useState, useEffect, useCallback } from 'react'
import { RoomsHeader } from '@/components/rooms/RoomsHeader'
import { RoomStats } from '@/components/rooms/RoomStats'
import { RoomsTableWithTaxManagement } from '@/components/rooms/RoomsTable'
import { roomsApi, DashboardRoom, RoomDashboardStats } from '@/lib/api/rooms'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

// ── Status Tabs ───────────────────────────────────────────────────────────────

type StatusFilter = '' | 'bookable' | 'occupied' | 'unavailable'

const STATUS_TABS: { value: StatusFilter; label: string; icon?: React.ElementType; dot: string }[] = [
  { value: '',            label: 'Όλα',            dot: 'bg-slate-400' },
  { value: 'bookable',   label: 'Διαθέσιμα',       dot: 'bg-green-400',  icon: CheckCircle },
  { value: 'occupied',   label: 'Κατειλημμένα',    dot: 'bg-purple-400', icon: Clock },
  { value: 'unavailable',label: 'Μη Διαθέσιμα',    dot: 'bg-red-400',   icon: XCircle },
]

function StatusTabs({
  rooms,
  activeTab,
  onTabChange,
}: {
  rooms: DashboardRoom[]
  activeTab: StatusFilter
  onTabChange: (v: StatusFilter) => void
}) {
  const counts: Record<StatusFilter, number> = {
    '':            rooms.length,
    bookable:     rooms.filter(r => r.isBookable && !r.isOccupied).length,
    occupied:     rooms.filter(r => r.isOccupied).length,
    unavailable:  rooms.filter(r => !r.isBookable).length,
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto bg-slate-800/50 border border-slate-700/50 rounded-xl p-1.5">
      {STATUS_TABS.map((tab) => {
        const isActive = activeTab === tab.value
        const count    = counts[tab.value]
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${tab.dot} shrink-0`} />
            {tab.label}
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-700 text-slate-400'
              }`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RoomsPage() {
  const [stats,        setStats]        = useState<RoomDashboardStats | null>(null)
  const [rooms,        setRooms]        = useState<DashboardRoom[]>([])
  const [loading,      setLoading]      = useState(true)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [filterType,   setFilterType]   = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const res = await roomsApi.getDashboardStats()
      if (res.success) {
        setStats(res.data.stats)
        setRooms(res.data.rooms)
      }
    } catch {
      setStats(null)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  return (
    <div className="space-y-5">
      <RoomsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterStatus=""
        onFilterStatusChange={() => {}}
      />

      <StatusTabs
        rooms={rooms}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
      />

      <RoomStats stats={stats} loading={loading} />

      <RoomsTableWithTaxManagement
        rooms={rooms}
        loading={loading}
        searchQuery={searchQuery}
        filterType={filterType}
        filterStatus={statusFilter}
        onRoomUpdated={fetchDashboard}
      />
    </div>
  )
}
