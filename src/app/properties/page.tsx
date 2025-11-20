'use client'

import { useState, useRef } from 'react'
import { PropertiesHeader } from '@/components/properties/PropertiesHeader'
import { PropertiesGrid, PropertiesGridRef } from '@/components/properties/PropertiesGrid'
import { PropertiesFilters } from '@/components/properties/PropertiesFilters'
import { AddPropertyModal } from '@/components/properties/AddPropertyModal'
import { ImportPropertiesModal } from '@/components/properties/ImportPropertiesModal'
import { propertiesApi } from '@/lib/api/properties'
import { downloadPropertiesCSV } from '@/lib/utils/exportProperties'
import { Property } from '@/lib/api/types'

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const propertiesGridRef = useRef<PropertiesGridRef>(null)

  const handleAddProperty = () => {
    setIsModalOpen(true)
  }

  const handlePropertyCreated = async () => {
    setIsModalOpen(false)
    await new Promise(resolve => setTimeout(resolve, 300))
    if (propertiesGridRef.current) {
      propertiesGridRef.current.refresh()
    }
  }

  const handleExport = async () => {
    try {
      const properties = await propertiesApi.getAllForExport()
      const timestamp = new Date().toISOString().split('T')[0]
      downloadPropertiesCSV(properties, `properties_${timestamp}.csv`)
    } catch (error: any) {
      console.error('Error exporting properties:', error)
      alert(`Σφάλμα εξαγωγής: ${error.message}`)
    }
  }

  const handleImport = () => {
    setIsImportModalOpen(true)
  }

  const handleImportSuccess = async () => {
    setIsImportModalOpen(false)
    await new Promise(resolve => setTimeout(resolve, 500))
    if (propertiesGridRef.current) {
      propertiesGridRef.current.refresh()
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setStatusFilter('all')
    setCityFilter('all')
  }

  const handleEditProperty = (property: Property) => {
    // TODO: Implement edit modal
    console.log('Edit property:', property)
  }

  const handleDeleteProperty = async (property: Property) => {
    if (confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το "${property.titleGr}"?`)) {
      try {
        await propertiesApi.delete(property.id)
        if (propertiesGridRef.current) {
          propertiesGridRef.current.refresh()
        }
      } catch (error: any) {
        console.error('Error deleting property:', error)
        alert(`Σφάλμα διαγραφής: ${error.message}`)
      }
    }
  }

  const handleViewProperty = (property: Property) => {
    // TODO: Implement view modal or navigate to detail page
    console.log('View property:', property)
  }

  return (
    <div className="space-y-6">
      <PropertiesHeader 
        onAddProperty={handleAddProperty}
        onExport={handleExport}
        onImport={handleImport}
      />
      <PropertiesFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        cityFilter={cityFilter}
        onSearchChange={setSearchQuery}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onCityChange={setCityFilter}
        onClearFilters={handleClearFilters}
      />
      <PropertiesGrid
        ref={propertiesGridRef}
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        cityFilter={cityFilter}
        onEditProperty={handleEditProperty}
        onDeleteProperty={handleDeleteProperty}
        onViewProperty={handleViewProperty}
      />
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePropertyCreated}
      />
      <ImportPropertiesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  )
}
