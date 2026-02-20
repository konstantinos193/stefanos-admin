'use client'

import { useState } from 'react'
import { MaintenanceHeader } from '@/components/maintenance/MaintenanceHeader'
import { MaintenanceTable } from '@/components/maintenance/MaintenanceTable'

export default function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreateRequest = () => {
    setShowCreateDialog(true)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  return (
    <div className="space-y-6">
      <MaintenanceHeader
        onCreate={handleCreateRequest}
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchValue={searchQuery}
      />
      <MaintenanceTable searchQuery={searchQuery} />
    </div>
  )
}

