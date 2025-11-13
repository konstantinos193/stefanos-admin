'use client'

import { CheckCircle, AlertCircle, Info, XCircle, Clock } from 'lucide-react'

const mockNotifications = [
  {
    id: 1,
    title: 'New user registered',
    message: 'John Doe has created a new account',
    type: 'success',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    title: 'Booking confirmed',
    message: 'Booking #1234 has been confirmed',
    type: 'info',
    time: '15 minutes ago',
    read: false,
  },
  {
    id: 3,
    title: 'Payment received',
    message: 'Payment of €600 received for booking #1234',
    type: 'success',
    time: '1 hour ago',
    read: true,
  },
  {
    id: 4,
    title: 'System maintenance',
    message: 'Scheduled maintenance will occur tonight at 2 AM',
    type: 'warning',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 5,
    title: 'Error detected',
    message: 'An error was detected in the payment processing system',
    type: 'error',
    time: '3 hours ago',
    read: true,
  },
]

export function NotificationsList() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'info':
        return Info
      case 'warning':
        return AlertCircle
      case 'error':
        return XCircle
      default:
        return Info
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {mockNotifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type)
        return (
          <div
            key={notification.id}
            className={`card border-l-4 ${getNotificationColor(notification.type)} ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

