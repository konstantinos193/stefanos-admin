'use client'

import { useState, useEffect, useCallback } from 'react'
import { LayoutGrid, Calendar } from 'lucide-react'
import { RoomsHeader } from '@/components/rooms/RoomsHeader'
import { RoomStats } from '@/components/rooms/RoomStats'
import { RoomsTableWithTaxManagement } from '@/components/rooms/RoomsTable'
import { RoomCalendar } from '@/components/rooms/RoomCalendar'
import { roomsApi, DashboardRoom, RoomDashboardStats } from '@/lib/api/rooms'

type ViewMode = 'list' | 'calendar'

export default function RoomsPage() {
  const [view, setView] = useState<ViewMode>('list')
  const [stats, setStats] = useState<RoomDashboardStats | null>(null)
  const [rooms, setRooms] = useState<DashboardRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const response = await roomsApi.getDashboardStats()
      if (response.success) {
        setStats(response.data.stats)
        setRooms(response.data.rooms)
      }
    } catch (error) {
      console.error('Error fetching room dashboard:', error)
      setStats(null)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return (
    <div className="space-y-6">
      <RoomsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />
      <RoomStats stats={stats} loading={loading} />

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            view === 'list'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-800'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Λίστα
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            view === 'calendar'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Ημερολόγιο
        </button>
      </div>

      {view === 'list' ? (
        <RoomsTableWithTaxManagement
          rooms={rooms}
          loading={loading}
          searchQuery={searchQuery}
          filterType={filterType}
          filterStatus={filterStatus}
          onRoomUpdated={fetchDashboard}
        />
      ) : (
        <RoomCalendar />
      )}
    </div>
  )
}
