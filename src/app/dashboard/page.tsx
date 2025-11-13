import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { ChartsSection } from '@/components/dashboard/ChartsSection'
import { TopProperties } from '@/components/dashboard/TopProperties'
import { RecentReviews } from '@/components/dashboard/RecentReviews'
import { MaintenanceAlerts } from '@/components/dashboard/MaintenanceAlerts'
import { PaymentStatus } from '@/components/dashboard/PaymentStatus'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Πίνακας Ελέγχου</h1>
        <p className="text-gray-600 mt-1">Καλώς ήρθατε! Δείτε τι συμβαίνει σήμερα.</p>
      </div>

      <StatsCards />
      <ChartsSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProperties />
        <RecentReviews />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceAlerts />
        <PaymentStatus />
      </div>
    </div>
  )
}

