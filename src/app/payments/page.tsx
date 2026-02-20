'use client'

import { useState } from 'react'
import { PaymentsHeader } from '@/components/payments/PaymentsHeader'
import { PaymentsTable } from '@/components/payments/PaymentsTable'

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked')
  }

  const handleCreate = () => {
    // TODO: Implement create payment functionality
    console.log('Create payment clicked')
  }

  return (
    <div className="space-y-6">
      <PaymentsHeader
        onSearch={handleSearch}
        onFilter={handleFilter}
        onExport={handleExport}
        onCreate={handleCreate}
        searchValue={searchQuery}
      />
      <PaymentsTable />
    </div>
  )
}

