'use client'

import { useEffect, useState } from 'react'
import { ServicesHeader } from '@/components/services/ServicesHeader'
import { ServicesTable } from '@/components/services/ServicesTable'
import { ServiceDialog } from '@/components/services/ServiceDialog'
import { servicesApi } from '@/lib/api/services'
import { Service } from '@/lib/api/services'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await servicesApi.getAll({ limit: 100 })
      if (response.success) {
        setServices(response.data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = () => {
    setEditingService(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleViewService = (service: Service) => {
    setEditingService(service)
    setDialogMode('view')
    setDialogOpen(true)
  }

  const handleSubmitService = async (data: Partial<Service>) => {
    try {
      setSubmitting(true)
      
      if (dialogMode === 'edit' && editingService) {
        // Update existing service
        const response = await servicesApi.update(editingService.id, data)
        if (response.success) {
          setServices(prev => 
            prev.map(s => s.id === editingService.id ? response.data : s)
          )
        }
      } else if (dialogMode === 'create') {
        // Create new service
        const response = await servicesApi.create(data)
        if (response.success) {
          setServices(prev => [...prev, response.data])
        }
      }

      setDialogOpen(false)
      setEditingService(null)
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      const response = await servicesApi.toggleActive(service.id)
      if (response.success) {
        setServices(prev => 
          prev.map(s => s.id === service.id ? response.data : s)
        )
      }
    } catch (error) {
      console.error('Error toggling service:', error)
    }
  }

  const handleDeleteService = async (service: Service) => {
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε την υπηρεσία "${service.titleGr}";`)) {
      return
    }

    try {
      const response = await servicesApi.delete(service.id)
      if (response.success) {
        setServices(prev => prev.filter(s => s.id !== service.id))
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const filteredServices = services.filter(service => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      service.titleGr?.toLowerCase().includes(query) ||
      service.titleEn?.toLowerCase().includes(query) ||
      service.descriptionGr?.toLowerCase().includes(query) ||
      service.descriptionEn?.toLowerCase().includes(query) ||
      service.features?.some((feature: string) => feature.toLowerCase().includes(query))
    )
  })

  return (
    <div className="space-y-6">
      <ServicesHeader
        onSearch={setSearchQuery}
        onCreate={handleCreateService}
        searchValue={searchQuery}
      />

      {/* Services Table */}
      <ServicesTable
        services={filteredServices}
        loading={loading}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
        onToggleActive={handleToggleActive}
      />

      {/* Create/Edit/View Dialog */}
      <ServiceDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditingService(null)
        }}
        onSubmit={handleSubmitService}
        service={editingService}
        mode={dialogMode}
        loading={submitting}
      />
    </div>
  )
}

