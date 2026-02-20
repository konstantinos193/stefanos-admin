'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Check, CheckCheck, Trash2, Calendar, CreditCard, Wrench, Star, MessageSquare, Info, X, Loader2 } from 'lucide-react'
import { notificationsApi, type Notification } from '@/lib/api/notifications'

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  BOOKING_CONFIRMED: { icon: Calendar, color: 'text-green-400', bg: 'bg-green-500/15' },
  BOOKING_CANCELLED: { icon: Calendar, color: 'text-red-400', bg: 'bg-red-500/15' },
  PAYMENT_RECEIVED: { icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  MAINTENANCE_REQUEST: { icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  REVIEW_RECEIVED: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  MESSAGE_RECEIVED: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  SYSTEM_UPDATE: { icon: Info, color: 'text-purple-400', bg: 'bg-purple-500/15' },
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Μόλις τώρα'
  if (diffMin < 60) return `πριν ${diffMin} λεπτ${diffMin === 1 ? 'ό' : 'ά'}`
  if (diffHour < 24) return `πριν ${diffHour} ώρ${diffHour === 1 ? 'α' : 'ες'}`
  if (diffDay < 7) return `πριν ${diffDay} ημέρ${diffDay === 1 ? 'α' : 'ες'}`
  return date.toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })
}

export function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationsApi.getUnreadCount()
      if (res.success) {
        setUnreadCount(res.data.unreadCount)
      }
    } catch {
      // Silently fail for count polling
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await notificationsApi.getAll(1, 15)
      if (res.success) {
        setNotifications(res.data.notifications)
        setUnreadCount(res.data.unreadCount)
      }
    } catch (err) {
      setError('Αποτυχία φόρτωσης ειδοποιήσεων')
    } finally {
      setLoading(false)
    }
  }, [])

  // Poll unread count every 30s
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  // Fetch full list when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, fetchNotifications])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // ignore
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const wasUnread = notifications.find((n) => n.id === id && !n.isRead)
      await notificationsApi.delete(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // ignore
    }
  }

  return (
    <div ref={popupRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl hover:bg-slate-700 transition-colors"
        aria-label="Ειδοποιήσεις"
      >
        <Bell className="h-5 w-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-slate-800">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[400px] max-h-[520px] bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-semibold text-slate-100">Ειδοποιήσεις</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                  {unreadCount} νέ{unreadCount === 1 ? 'α' : 'ες'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200"
                  title="Σήμανση όλων ως αναγνωσμένα"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 text-slate-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={fetchNotifications}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Δοκιμάστε ξανά
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="h-12 w-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-400">Δεν υπάρχουν ειδοποιήσεις</p>
                <p className="text-xs text-slate-500 mt-1">Θα εμφανιστούν εδώ όταν υπάρξουν νέες</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type] || typeConfig.SYSTEM_UPDATE
                  const Icon = config.icon

                  return (
                    <div
                      key={notification.id}
                      className={`group relative px-5 py-3.5 hover:bg-slate-700/40 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-500/5' : ''
                      }`}
                      onClick={() => {
                        if (!notification.isRead) handleMarkAsRead(notification.id)
                      }}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 h-9 w-9 rounded-lg ${config.bg} flex items-center justify-center mt-0.5`}>
                          <Icon className={`h-4.5 w-4.5 ${config.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-snug ${!notification.isRead ? 'font-semibold text-slate-100' : 'font-medium text-slate-300'}`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-[11px] text-slate-500 mt-1.5">{formatTimeAgo(notification.createdAt)}</p>
                        </div>

                        {/* Actions (visible on hover) */}
                        <div className="flex-shrink-0 flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="p-1.5 rounded-md hover:bg-slate-600 transition-colors text-slate-400 hover:text-green-400"
                              title="Σήμανση ως αναγνωσμένο"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(notification.id)
                            }}
                            className="p-1.5 rounded-md hover:bg-slate-600 transition-colors text-slate-400 hover:text-red-400"
                            title="Διαγραφή"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-700/60 px-5 py-3">
              <a
                href="/notifications"
                className="block text-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Προβολή όλων των ειδοποιήσεων
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
