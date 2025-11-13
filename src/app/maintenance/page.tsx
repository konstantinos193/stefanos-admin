import { MaintenanceHeader } from '@/components/maintenance/MaintenanceHeader'
import { MaintenanceTable } from '@/components/maintenance/MaintenanceTable'

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <MaintenanceHeader />
      <MaintenanceTable />
    </div>
  )
}

