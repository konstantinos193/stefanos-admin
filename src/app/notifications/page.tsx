'use client'

import { NotificationsHeader } from '@/components/notifications/NotificationsHeader'
import { NotificationsList } from '@/components/notifications/NotificationsList'
import { notificationsApi } from '@/lib/api/notifications'
import { useState, useEffect } from 'react'

export default function NotificationsPage() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await notificationsApi.getUnreadCount()
        if (response.success) {
          setUnreadCount(response.data.unreadCount)
        }
      } catch (error) {
        console.error('Failed to load unread count:', error)
      }
    }

    loadUnreadCount()
  }, [refreshKey])

  const handleMarkAllAsRead = () => {
    setUnreadCount(0)
    setRefreshKey(prev => prev + 1)
  }

  const handleDeleteAll = () => {
    setUnreadCount(0)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <NotificationsHeader 
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteAll={handleDeleteAll}
      />
      <NotificationsList key={refreshKey} />
    </div>
  )
}

