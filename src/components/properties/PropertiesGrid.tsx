'use client'

import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square } from 'lucide-react'

const mockProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Athens',
    location: 'Athens, Greece',
    type: 'Apartment',
    price: '€1,200/month',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    status: 'Available',
    image: 'bg-gradient-to-br from-blue-400 to-purple-500',
  },
  {
    id: 2,
    title: 'Luxury Villa in Mykonos',
    location: 'Mykonos, Greece',
    type: 'Villa',
    price: '€5,000/month',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    status: 'Rented',
    image: 'bg-gradient-to-br from-purple-400 to-pink-500',
  },
  {
    id: 3,
    title: 'Cozy House in Thessaloniki',
    location: 'Thessaloniki, Greece',
    type: 'House',
    price: '€800/month',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    status: 'Available',
    image: 'bg-gradient-to-br from-green-400 to-cyan-500',
  },
  {
    id: 4,
    title: 'Studio Apartment in Crete',
    location: 'Crete, Greece',
    type: 'Apartment',
    price: '€600/month',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    status: 'Available',
    image: 'bg-gradient-to-br from-orange-400 to-red-500',
  },
  {
    id: 5,
    title: 'Commercial Space in Athens',
    location: 'Athens, Greece',
    type: 'Commercial',
    price: '€2,500/month',
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    status: 'Available',
    image: 'bg-gradient-to-br from-indigo-400 to-blue-500',
  },
  {
    id: 6,
    title: 'Beachfront Villa in Santorini',
    location: 'Santorini, Greece',
    type: 'Villa',
    price: '€8,000/month',
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    status: 'Rented',
    image: 'bg-gradient-to-br from-pink-400 to-purple-500',
  },
]

export function PropertiesGrid() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Rented':
        return 'bg-blue-100 text-blue-800'
      case 'Sold':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProperties.map((property) => (
        <div key={property.id} className="card hover:shadow-lg transition-shadow">
          <div className={`${property.image} h-48 rounded-lg mb-4 flex items-center justify-center`}>
            <span className="text-white text-2xl font-bold">{property.id}</span>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{property.location}</span>
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
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area}m²</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <p className="text-lg font-bold text-gray-900">{property.price}</p>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
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
      ))}
    </div>
  )
}

