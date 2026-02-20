'use client'

import { useState, useEffect, useCallback } from 'react'
import { RoomsHeader } from '@/components/rooms/RoomsHeader'
import { RoomStats } from '@/components/rooms/RoomStats'
import { RoomsTable } from '@/components/rooms/RoomsTable'
import { roomsApi, DashboardRoom, RoomDashboardStats } from '@/lib/api/rooms'

export default function RoomsPage() {
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
      <RoomsTable
        rooms={rooms}
        loading={loading}
        searchQuery={searchQuery}
        filterType={filterType}
        filterStatus={filterStatus}
        onRoomUpdated={fetchDashboard}
      />
    </div>
  )
}

