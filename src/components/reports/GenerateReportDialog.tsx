'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, FileText, Download } from 'lucide-react'
import { reportsApi, ReportType, GenerateReportParams } from '@/lib/api/reports'

interface GenerateReportDialogProps {
  isOpen: boolean
  onClose: () => void
  onReportGenerated: () => void
}

export function GenerateReportDialog({ isOpen, onClose, onReportGenerated }: GenerateReportDialogProps) {
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchReportTypes()
      // Set default dates to last month
      const now = new Date()
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      
      setStartDate(lastMonth.toISOString().split('T')[0])
      setEndDate(lastMonthEnd.toISOString().split('T')[0])
    }
  }, [isOpen])

  const fetchReportTypes = async () => {
    try {
      const response = await reportsApi.getReportTypes()
      if (response.success) {
        setReportTypes(response.data)
        if (response.data.length > 0) {
          setSelectedType(response.data[0].id)
        }
      }
    } catch (err) {
      setError('Failed to load report types')
      console.error('Error fetching report types:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedType || !startDate || !endDate) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params: GenerateReportParams = {
        type: selectedType,
        period: selectedPeriod,
        startDate,
        endDate,
      }

      const response = await reportsApi.generateReport(params)
      if (response.success) {
        onReportGenerated()
        onClose()
        // Reset form
        setSelectedType('')
        setSelectedPeriod('monthly')
        setStartDate('')
        setEndDate('')
      } else {
        setError('Failed to generate report')
      }
    } catch (err) {
      setError('Error generating report')
      console.error('Error generating report:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generate Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a report type</option>
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.nameGr} - {type.descriptionGr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
