'use client'

import { useEffect, useState } from 'react'
import { CleaningHeader } from '@/components/cleaning/CleaningHeader'
import { CleaningStatsCards } from '@/components/cleaning/CleaningStats'
import { CleaningTable } from '@/components/cleaning/CleaningTable'
import { CleaningScheduleDialog } from '@/components/cleaning/CleaningScheduleDialog'
import { cleaningApi } from '@/lib/api/cleaning'
import { propertiesApi } from '@/lib/api/properties'
import { CleaningSchedule, CleaningStats, Property } from '@/lib/api/types'

export default function CleaningPage() {
  const [schedules, setSchedules] = useState<CleaningSchedule[]>([])
  const [stats, setStats] = useState<CleaningStats | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CleaningSchedule | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [schedulesRes, statsRes, propertiesRes] = await Promise.all([
        cleaningApi.getAll(),
        cleaningApi.getStats(),
        propertiesApi.getAll({ limit: 100 })
      ])

      if (schedulesRes.success) {
        setSchedules(schedulesRes.data.schedules)
      }
      if (statsRes.success) {
        setStats(statsRes.data)
      }
      if (propertiesRes.success) {
        setProperties(propertiesRes.data.properties)
      }
    } catch (error) {
      console.error('Error fetching cleaning data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = () => {
    setEditingSchedule(null)
    setDialogOpen(true)
  }

  const handleEditSchedule = (schedule: CleaningSchedule) => {
    setEditingSchedule(schedule)
    setDialogOpen(true)
  }

  const handleSubmitSchedule = async (data: Partial<CleaningSchedule>) => {
    try {
      setSubmitting(true)
      
      if (editingSchedule) {
        // Update existing schedule
        const response = await cleaningApi.update(editingSchedule.id, data)
        if (response.success) {
          setSchedules(prev => 
            prev.map(s => s.id === editingSchedule.id ? response.data : s)
          )
        }
      } else {
        // Create new schedule
        const response = await cleaningApi.create(data)
        if (response.success) {
          setSchedules(prev => [...prev, response.data])
        }
      }

      setDialogOpen(false)
      setEditingSchedule(null)
      
      // Refresh stats
      const statsRes = await cleaningApi.getStats()
      if (statsRes.success) {
        setStats(statsRes.data)
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkCleaned = async (schedule: CleaningSchedule) => {
    try {
      const response = await cleaningApi.markCleaned(schedule.id, new Date().toISOString())
      if (response.success) {
        setSchedules(prev => 
          prev.map(s => s.id === schedule.id ? response.data : s)
        )
        
        // Refresh stats
        const statsRes = await cleaningApi.getStats()
        if (statsRes.success) {
          setStats(statsRes.data)
        }
      }
    } catch (error) {
      console.error('Error marking schedule as cleaned:', error)
    }
  }

  const handleDeleteSchedule = async (schedule: CleaningSchedule) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το πρόγραμμα καθαρισμού;')) {
      return
    }

    try {
      const response = await cleaningApi.delete(schedule.id)
      if (response.success) {
        setSchedules(prev => prev.filter(s => s.id !== schedule.id))
        
        // Refresh stats
        const statsRes = await cleaningApi.getStats()
        if (statsRes.success) {
          setStats(statsRes.data)
        }
      }
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  const filteredSchedules = schedules.filter(schedule => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      schedule.property?.titleGr?.toLowerCase().includes(query) ||
      schedule.property?.titleEn?.toLowerCase().includes(query) ||
      schedule.property?.city?.toLowerCase().includes(query) ||
      schedule.assignedCleaner?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      <CleaningHeader
        onSearch={setSearchQuery}
        onCreate={handleCreateSchedule}
        searchValue={searchQuery}
      />

      {/* Stats Cards */}
      {stats && (
        <CleaningStatsCards stats={stats} loading={loading} />
      )}

      {/* Schedules Table */}
      <CleaningTable
        schedules={filteredSchedules}
        loading={loading}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
        onMarkCleaned={handleMarkCleaned}
      />

      {/* Create/Edit Dialog */}
      <CleaningScheduleDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditingSchedule(null)
        }}
        onSubmit={handleSubmitSchedule}
        schedule={editingSchedule}
        properties={properties}
        loading={submitting}
      />
    </div>
  )
}

