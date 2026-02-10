import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { MaintenanceAlerts } from '@/components/dashboard/MaintenanceAlerts'
import { PaymentStatus } from '@/components/dashboard/PaymentStatus'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Καλώς ήρθατε!</h1>
        <p className="text-lg text-slate-400 mt-2">Δείτε μια γρήγορη επισκόπηση του τι συμβαίνει σήμερα.</p>
      </div>

      {/* Quick Actions - most important, right at the top */}
      <QuickActions />

      {/* Stats Overview */}
      <StatsCards />

      {/* Two-column layout for activity and alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentActivity />
        <MaintenanceAlerts />
      </div>

      {/* Payment Status - full width */}
      <PaymentStatus />
    </div>
  )
}

