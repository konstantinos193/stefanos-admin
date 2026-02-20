'use client'

import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { GenerateReportDialog } from './GenerateReportDialog'

interface ReportsHeaderProps {
  onRefresh?: () => void
}

export function ReportsHeader({ onRefresh }: ReportsHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleReportGenerated = () => {
    // Refresh the reports list
    onRefresh?.()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Αναφορές</h1>
          <p className="text-gray-600 mt-1">Προβολή και δημιουργία αναφορών συστήματος</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="btn btn-primary flex items-center space-x-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <FileText className="h-4 w-4" />
            <span>Δημιουργία Αναφοράς</span>
          </button>
        </div>
      </div>

      <GenerateReportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onReportGenerated={handleReportGenerated}
      />
    </>
  )
}

