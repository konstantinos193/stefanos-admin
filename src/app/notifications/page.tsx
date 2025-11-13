import { NotificationsHeader } from '@/components/notifications/NotificationsHeader'
import { NotificationsList } from '@/components/notifications/NotificationsList'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationsHeader />
      <NotificationsList />
    </div>
  )
}

