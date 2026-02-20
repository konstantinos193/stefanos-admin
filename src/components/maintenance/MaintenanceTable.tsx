'use client'

import { useState, useEffect } from 'react'
import { maintenanceApi, MaintenanceRequest } from '@/lib/api/maintenance'
import { propertiesApi } from '@/lib/api/properties'
import { Property } from '@/lib/api/types'
import { AlertCircle, CheckCircle, Clock, XCircle, Eye, Edit, Trash2 } from 'lucide-react'
import { MaintenanceDialog } from './MaintenanceDialog'

interface MaintenanceTableProps {
  searchQuery?: string
}

export function MaintenanceTable({ searchQuery: externalSearchQuery }: MaintenanceTableProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '')
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery)
    }
  }, [externalSearchQuery])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [maintenanceResponse, propertiesResponse] = await Promise.all([
          maintenanceApi.getAll({ page, limit: 10 }),
          propertiesApi.getAll({ page: 1, limit: 100 })
        ])
        setRequests(maintenanceResponse.data?.maintenance || [])
        setProperties(propertiesResponse.data?.properties || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setRequests([])
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page])

  const handleCreateRequest = () => {
    setSelectedRequest(null)
    setIsDialogOpen(true)
  }

  const handleEditRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const handleSubmitRequest = async (data: Partial<MaintenanceRequest>) => {
    try {
      setDialogLoading(true)
      
      if (selectedRequest) {
        // Update existing request
        const response = await maintenanceApi.update(selectedRequest.id, data)
        setRequests(requests.map(req => 
          req.id === selectedRequest.id ? response.data : req
        ))
      } else {
        // Create new request
        const response = await maintenanceApi.create(data)
        setRequests([response.data, ...requests])
      }
      
      setIsDialogOpen(false)
      setSelectedRequest(null)
    } catch (error) {
      console.error('Error saving maintenance request:', error)
    } finally {
      setDialogLoading(false)
    }
  }

  const handleAssignRequest = async (requestId: string) => {
    try {
      const response = await maintenanceApi.assign(requestId, 'current-user') // This would be the actual user ID
      setRequests(requests.map(req => 
        req.id === requestId ? response.data : req
      ))
    } catch (error) {
      console.error('Error assigning request:', error)
    }
  }

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const response = await maintenanceApi.complete(requestId)
      setRequests(requests.map(req => 
        req.id === requestId ? response.data : req
      ))
    } catch (error) {
      console.error('Error completing request:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR')
  }

  const filteredRequests = requests.filter(request => 
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.property?.titleGr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.property?.titleEn?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-600">Φόρτωση αιτημάτων...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Τίτλος</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ακίνητο</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Προτεραιότητα</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κατάσταση</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ημερομηνία</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'Δεν βρέθηκαν αιτήματα με αυτά τα κριτήρια' : 'Δεν βρέθηκαν αιτήματα'}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{request.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.property?.titleGr || request.property?.titleEn || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEditRequest(request)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {request.status === 'OPEN' && (
                          <button 
                            onClick={() => handleAssignRequest(request.id)}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Ανάθεση
                          </button>
                        )}
                        {request.status === 'IN_PROGRESS' && (
                          <button 
                            onClick={() => handleCompleteRequest(request.id)}
                            className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          >
                            Ολοκλήρωση
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MaintenanceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitRequest}
        request={selectedRequest}
        properties={properties}
        loading={dialogLoading}
      />
    </>
  )
}

