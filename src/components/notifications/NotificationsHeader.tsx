'use client'

import { Bell, Settings, CheckCircle, Trash2 } from 'lucide-react'
import { notificationsApi } from '@/lib/api/notifications'
import { useState } from 'react'

export function NotificationsHeader({ 
  unreadCount, 
  onMarkAllAsRead, 
  onDeleteAll 
}: { 
  unreadCount?: number
  onMarkAllAsRead?: () => void
  onDeleteAll?: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleMarkAllAsRead = async () => {
    if (loading) return
    
    try {
      setLoading(true)
      await notificationsApi.markAllAsRead()
      onMarkAllAsRead?.()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    if (loading) return
    
    if (!confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε όλες τις ειδοποιήσεις;')) {
      return
    }
    
    try {
      setLoading(true)
      await notificationsApi.deleteAll()
      onDeleteAll?.()
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <span>Ειδοποιήσεις</span>
          {unreadCount && unreadCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {unreadCount} νέες
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-2">Διαχείριση ειδοποιήσεων και ενημερώσεων</p>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={handleMarkAllAsRead}
          disabled={loading || !unreadCount}
          className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Mark All Read</span>
        </button>
        <button 
          onClick={handleDeleteAll}
          disabled={loading}
          className="btn btn-danger flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete All</span>
        </button>
        <button className="btn btn-secondary flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Ρυθμίσεις</span>
        </button>
      </div>
    </div>
  )
}

