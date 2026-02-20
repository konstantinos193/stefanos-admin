import { StatsCards } from '@/components/dashboard/StatsCards'
import { RealEstateActions } from '@/components/dashboard/RealEstateActions'
import { HotelActions } from '@/components/dashboard/HotelActions'
import { SystemActions } from '@/components/dashboard/SystemActions'

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Καλώς ήρθατε!</h1>
        <p className="text-lg text-slate-400 mt-2">Επιλέξτε τι θέλετε να διαχειριστείτε σήμερα.</p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Two Business Sections side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RealEstateActions />
        <HotelActions />
      </div>

      {/* System / General actions */}
      <SystemActions />
    </div>
  )
}

