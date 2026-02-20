'use client'

import { CheckCircle, AlertCircle, Info, XCircle, Clock, Calendar, DollarSign, MessageSquare, Settings, Bell } from 'lucide-react'
import { notificationsApi, type Notification } from '@/lib/api/notifications'
import { useEffect, useState } from 'react'

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'BOOKING_CONFIRMED',
    title: 'Επιβεβαιώθηκε κράτηση',
    message: 'Η κράτηση #1234 για το Apartment Sea View επιβεβαιώθηκε',
    isRead: false,
    data: { bookingId: '1234', propertyTitle: 'Apartment Sea View' },
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'PAYMENT_RECEIVED',
    title: 'Ελήφθη πληρωμή',
    message: 'Πληρωμή €600 ελήφθη για την κράτηση #1234',
    isRead: false,
    data: { amount: 600, currency: 'EUR', bookingId: '1234' },
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'BOOKING_CANCELLED',
    title: 'Ακυρώθηκε κράτηση',
    message: 'Η κράτηση #1235 ακυρώθηκε από τον επισκέπτη',
    isRead: true,
    data: { bookingId: '1235', reason: 'Guest cancellation' },
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '4',
    userId: 'user-1',
    type: 'MAINTENANCE_REQUEST',
    title: 'Αίτημα συντήρησης',
    message: 'Νέο αίτημα συντήρησης για το Apartment Sea View',
    isRead: true,
    data: { propertyId: 'prop-1', priority: 'MEDIUM' },
    createdAt: '2024-01-14T16:30:00Z',
  },
  {
    id: '5',
    userId: 'user-1',
    type: 'REVIEW_RECEIVED',
    title: 'Νέα κριτική',
    message: 'Έλαβε νέα κριτική 5 αστέρων για το Apartment Sea View',
    isRead: true,
    data: { rating: 5, propertyId: 'prop-1' },
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '6',
    userId: 'user-1',
    type: 'MESSAGE_RECEIVED',
    title: 'Νέο μήνυμα',
    message: 'Έχετε νέο μήνυμα από τον John Doe σχετικά με την κράτηση #1234',
    isRead: true,
    data: { senderId: 'guest-1', bookingId: '1234' },
    createdAt: '2024-01-14T12:10:00Z',
  },
  {
    id: '7',
    userId: 'user-1',
    type: 'SYSTEM_UPDATE',
    title: 'Ενημέρωση συστήματος',
    message: 'Το σύστημα ενημερώθηκε στην έκδοση 2.1.0',
    isRead: true,
    data: { version: '2.1.0', features: ['Performance improvements', 'Bug fixes'] },
    createdAt: '2024-01-14T10:00:00Z',
  },
]

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        const response = await notificationsApi.getAll()
        if (response.success) {
          setNotifications(response.data.notifications)
        }
      } catch (error) {
        console.error('Failed to load notifications:', error)
        // Keep using mock data on error
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return CheckCircle
      case 'BOOKING_CANCELLED':
        return XCircle
      case 'PAYMENT_RECEIVED':
        return DollarSign
      case 'MAINTENANCE_REQUEST':
        return Settings
      case 'REVIEW_RECEIVED':
        return Bell
      case 'MESSAGE_RECEIVED':
        return MessageSquare
      case 'SYSTEM_UPDATE':
        return Info
      default:
        return Info
    }
  }

  const getNotificationColors = (type: Notification['type']) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          accent: 'border-emerald-500',
          iconBg: 'bg-emerald-100',
          iconText: 'text-emerald-600'
        }
      case 'BOOKING_CANCELLED':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          accent: 'border-red-500',
          iconBg: 'bg-red-100',
          iconText: 'text-red-600'
        }
      case 'PAYMENT_RECEIVED':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          accent: 'border-green-500',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600'
        }
      case 'MAINTENANCE_REQUEST':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          accent: 'border-amber-500',
          iconBg: 'bg-amber-100',
          iconText: 'text-amber-600'
        }
      case 'REVIEW_RECEIVED':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          accent: 'border-purple-500',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600'
        }
      case 'MESSAGE_RECEIVED':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          accent: 'border-blue-500',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600'
        }
      case 'SYSTEM_UPDATE':
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          accent: 'border-slate-500',
          iconBg: 'bg-slate-100',
          iconText: 'text-slate-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          accent: 'border-gray-500',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600'
        }
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 60) {
      return `πριν ${diffInMins} λεπτά`
    } else if (diffInHours < 24) {
      return `πριν ${diffInHours} ώρες`
    } else {
      return `πριν ${diffInDays} ημέρες`
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type)
        const colors = getNotificationColors(notification.type)
        
        return (
          <div
            key={notification.id}
            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            className={`card border-l-4 ${colors.bg} ${colors.border} ${colors.text} ${colors.accent} ${
              !notification.isRead 
                ? 'ring-2 ring-blue-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer' 
                : 'opacity-75'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.iconText} flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {notification.title}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {notification.message}
                </p>
                {!notification.isRead && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Νέα
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Δεν υπάρχουν ειδοποιήσεις</h3>
          <p className="text-gray-500">Δεν έχετε νέες ειδοποιήσεις αυτή τη στιγμή.</p>
        </div>
      )}
    </div>
  )
}

