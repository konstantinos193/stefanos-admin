'use client'

import { useState, useEffect } from 'react'
import { Download, Eye, Calendar, FileText, RefreshCw } from 'lucide-react'
import { reportsApi, Report } from '@/lib/api/reports'

export function ReportsList() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await reportsApi.getReports()
      if (response.success) {
        setReports(response.data)
      } else {
        setError('Failed to load reports')
      }
    } catch (err) {
      setError('Error loading reports')
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (reportId: string, reportName: string) => {
    try {
      const blob = await reportsApi.downloadReport(reportId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportName}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading report:', err)
      setError('Failed to download report')
    }
  }

  const handleView = (reportId: string) => {
    // For now, just download the report
    // In a real implementation, this could open a preview modal
    handleDownload(reportId, `report_${reportId}`)
  }

  const refreshReports = () => {
    fetchReports()
  }
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Revenue':
        return 'bg-green-100 text-green-800'
      case 'Users':
        return 'bg-blue-100 text-blue-800'
      case 'Properties':
        return 'bg-purple-100 text-purple-800'
      case 'Bookings':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Revenue':
        return 'Έσοδα'
      case 'Users':
        return 'Χρήστες'
      case 'Properties':
        return 'Ακίνητα'
      case 'Bookings':
        return 'Κρατήσεις'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading reports...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchReports}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
        <p className="text-gray-600">Generate your first report to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <div key={report.id} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">{report.name}</h3>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(report.type)}`}>
                {getTypeLabel(report.type)}
              </span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Δημιουργήθηκε: {report.generatedDate}</span>
            </div>
            <div className="text-sm text-gray-600">
              Μέγεθος: {report.size}
            </div>
            <div className="text-sm">
              Κατάσταση: <span className={`font-medium ${report.status === 'Ready' ? 'text-green-600' : 'text-yellow-600'}`}>
                {report.status === 'Ready' ? 'Έτοιμο' : 'Σε Δημιουργία'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
            <button 
              className="flex-1 btn btn-secondary flex items-center justify-center space-x-2"
              onClick={() => handleView(report.id)}
              disabled={report.status !== 'Ready'}
            >
              <Eye className="h-4 w-4" />
              <span>Προβολή</span>
            </button>
            <button 
              className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
              onClick={() => handleDownload(report.id, report.name)}
              disabled={report.status !== 'Ready'}
            >
              <Download className="h-4 w-4" />
              <span>Λήψη</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

