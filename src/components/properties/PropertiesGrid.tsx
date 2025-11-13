'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square } from 'lucide-react'
import { propertiesApi } from '@/lib/api/properties'
import { Property } from '@/lib/api/types'

const mockProperties = [
  {
    id: 1,
    title: 'Σύγχρονο Διαμέρισμα στην Αθήνα',
    location: 'Αθήνα, Ελλάδα',
    type: 'Apartment',
    price: '€1,200/μήνα',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    status: 'Available',
    image: 'bg-gradient-to-br from-blue-400 to-purple-500',
  },
  {
    id: 2,
    title: 'Πολυτελής Βίλα στη Μύκονο',
    location: 'Μύκονος, Ελλάδα',
    type: 'Villa',
    price: '€5,000/μήνα',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    status: 'Rented',
    image: 'bg-gradient-to-br from-purple-400 to-pink-500',
  },
  {
    id: 3,
    title: 'Ζεστό Σπίτι στη Θεσσαλονίκη',
    location: 'Θεσσαλονίκη, Ελλάδα',
    type: 'House',
    price: '€800/μήνα',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    status: 'Available',
    image: 'bg-gradient-to-br from-green-400 to-cyan-500',
  },
  {
    id: 4,
    title: 'Στούντιο Διαμέρισμα στην Κρήτη',
    location: 'Κρήτη, Ελλάδα',
    type: 'Apartment',
    price: '€600/μήνα',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    status: 'Available',
    image: 'bg-gradient-to-br from-orange-400 to-red-500',
  },
  {
    id: 5,
    title: 'Επαγγελματικός Χώρος στην Αθήνα',
    location: 'Αθήνα, Ελλάδα',
    type: 'Commercial',
    price: '€2,500/μήνα',
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    status: 'Available',
    image: 'bg-gradient-to-br from-indigo-400 to-blue-500',
  },
  {
    id: 6,
    title: 'Βίλα Δίπλα στη Θάλασσα στη Σαντορίνη',
    location: 'Σαντορίνη, Ελλάδα',
    type: 'Villa',
    price: '€8,000/μήνα',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    status: 'Rented',
    image: 'bg-gradient-to-br from-pink-400 to-purple-500',
  },
]

export function PropertiesGrid() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        const response = await propertiesApi.getAll({ limit: 12 })
        setProperties(response.data?.properties || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

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
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
}

