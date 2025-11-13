'use client'

import { CheckCircle, AlertCircle, Info, XCircle, Clock } from 'lucide-react'

const mockNotifications = [
  {
    id: 1,
    title: 'Νέος χρήστης εγγράφηκε',
    message: 'Ο John Doe δημιούργησε νέο λογαριασμό',
    type: 'success',
    time: 'πριν 2 λεπτά',
    read: false,
  },
  {
    id: 2,
    title: 'Επιβεβαιώθηκε κράτηση',
    message: 'Η κράτηση #1234 επιβεβαιώθηκε',
    type: 'info',
    time: 'πριν 15 λεπτά',
    read: false,
  },
  {
    id: 3,
    title: 'Ελήφθη πληρωμή',
    message: 'Πληρωμή €600 ελήφθη για την κράτηση #1234',
    type: 'success',
    time: 'πριν 1 ώρα',
    read: true,
  },
  {
    id: 4,
    title: 'Συντήρηση συστήματος',
    message: 'Προγραμματισμένη συντήρηση θα πραγματοποιηθεί απόψε στις 2 π.μ.',
    type: 'warning',
    time: 'πριν 2 ώρες',
    read: true,
  },
  {
    id: 5,
    title: 'Εντοπίστηκε σφάλμα',
    message: 'Εντοπίστηκε σφάλμα στο σύστημα επεξεργασίας πληρωμών',
    type: 'error',
    time: 'πριν 3 ώρες',
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

