import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts'
import { AnalyticsMetrics } from '@/components/analytics/AnalyticsMetrics'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      <AnalyticsMetrics />
      <AnalyticsCharts />
    </div>
  )
}

