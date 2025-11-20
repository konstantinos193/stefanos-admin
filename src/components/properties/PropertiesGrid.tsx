'use client'

import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square } from 'lucide-react'
import { propertiesApi } from '@/lib/api/properties'
import { Property } from '@/lib/api/types'
import { matchesSearch } from '@/lib/utils/textNormalization'

export interface PropertiesGridRef {
  refresh: () => void
}

interface PropertiesGridProps {
  searchQuery?: string
  typeFilter?: string
  statusFilter?: string
  cityFilter?: string
  onEditProperty?: (property: Property) => void
  onDeleteProperty?: (property: Property) => void
  onViewProperty?: (property: Property) => void
}

export const PropertiesGrid = forwardRef<PropertiesGridRef, PropertiesGridProps>(({ 
  searchQuery = '', 
  typeFilter = 'all', 
  statusFilter = 'all', 
  cityFilter = 'all',
  onEditProperty,
  onDeleteProperty,
  onViewProperty
}, ref) => {
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesApi.getAll({ limit: 100 })
      const fetchedProperties = response.data?.properties || []
      setAllProperties(fetchedProperties)
      return fetchedProperties
    } catch (error) {
      console.error('Error fetching properties:', error)
      setAllProperties([])
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchProperties()
    }
  }))

  // Apply filters
  useEffect(() => {
    let filtered = [...allProperties]

    // Search filter (accent-insensitive and case-insensitive)
    if (searchQuery.trim()) {
      filtered = filtered.filter((property) => {
        return (
          matchesSearch(property.titleGr || '', searchQuery) ||
          matchesSearch(property.titleEn || '', searchQuery) ||
          matchesSearch(property.city || '', searchQuery) ||
          matchesSearch(property.address || '', searchQuery) ||
          matchesSearch(property.country || '', searchQuery)
        )
      })
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((property) => property.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((property) => property.status === statusFilter)
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter((property) => property.city === cityFilter)
    }

    setProperties(filtered)
  }, [allProperties, searchQuery, typeFilter, statusFilter, cityFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ενεργό'
      case 'INACTIVE':
        return 'Ανενεργό'
      case 'MAINTENANCE':
        return 'Συντήρηση'
      case 'SUSPENDED':
        return 'Αναστολή'
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return 'Διαμέρισμα'
      case 'HOUSE':
        return 'Κατοικία'
      case 'ROOM':
        return 'Δωμάτιο'
      case 'COMMERCIAL':
        return 'Επαγγελματικό'
      case 'STORAGE':
        return 'Αποθήκη'
      case 'VACATION_RENTAL':
        return 'Διακοπές'
      case 'LUXURY':
        return 'Πολυτελές'
      case 'INVESTMENT':
        return 'Επένδυση'
      default:
        return type
    }
  }

  const formatPrice = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">Δεν βρέθηκαν ακίνητα</p>
        </div>
      ) : (
        properties.map((property) => (
          <div key={property.id} className="card hover:shadow-lg transition-shadow">
            <div className="h-48 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.titleGr}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">{getTypeLabel(property.type).charAt(0)}</span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{property.titleGr}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{property.city}, {property.country}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms}</span>
                </div>
                {property.area && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.area}m²</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(property.basePrice, property.currency)}/μήνα</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
                    {getStatusLabel(property.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onViewProperty?.(property)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Προβολή"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEditProperty?.(property)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Επεξεργασία"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteProperty?.(property)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Διαγραφή"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
})

PropertiesGrid.displayName = 'PropertiesGrid'

