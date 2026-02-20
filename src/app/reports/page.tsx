'use client'

import { ReportsHeader } from '@/components/reports/ReportsHeader'
import { ReportsList } from '@/components/reports/ReportsList'
import { useState } from 'react'

export default function ReportsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <ReportsHeader onRefresh={handleRefresh} />
      <ReportsList key={refreshKey} />
    </div>
  )
}

