'use client'

import { Download, Eye, Calendar, FileText } from 'lucide-react'

const mockReports = [
  {
    id: 1,
    name: 'Μηνιαία Αναφορά Εσόδων',
    type: 'Revenue',
    generatedDate: '2024-11-01',
    size: '2.4 MB',
    status: 'Ready',
  },
  {
    id: 2,
    name: 'Αναφορά Δραστηριότητας Χρηστών',
    type: 'Users',
    generatedDate: '2024-11-05',
    size: '1.8 MB',
    status: 'Ready',
  },
  {
    id: 3,
    name: 'Αναφορά Απόδοσης Ακινήτων',
    type: 'Properties',
    generatedDate: '2024-11-10',
    size: '3.2 MB',
    status: 'Ready',
  },
  {
    id: 4,
    name: 'Αναφορά Ανάλυσης Κρατήσεων',
    type: 'Bookings',
    generatedDate: '2024-11-12',
    size: '2.1 MB',
    status: 'Generating',
  },
]

export function ReportsList() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockReports.map((report) => (
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
            <button className="flex-1 btn btn-secondary flex items-center justify-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Προβολή</span>
            </button>
            <button className="flex-1 btn btn-primary flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Λήψη</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

