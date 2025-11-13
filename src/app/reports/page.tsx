import { ReportsHeader } from '@/components/reports/ReportsHeader'
import { ReportsList } from '@/components/reports/ReportsList'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsList />
    </div>
  )
}

