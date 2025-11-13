'use client'

import { Building2, Star, Euro, TrendingUp } from 'lucide-react'

export function TopProperties() {
  const properties = [
    { id: '1', name: 'Luxury Apartment Athens', revenue: 12500, bookings: 24, rating: 4.8 },
    { id: '2', name: 'Beach House Preveza', revenue: 9800, bookings: 18, rating: 4.9 },
    { id: '3', name: 'City Center Studio', revenue: 7600, bookings: 15, rating: 4.6 },
    { id: '4', name: 'Mountain Villa', revenue: 11200, bookings: 20, rating: 4.7 },
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Κορυφαία Ακίνητα</h2>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>
      <div className="space-y-4">
        {properties.map((property, index) => (
          <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{property.name}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{property.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{property.bookings} κρατήσεις</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <Euro className="h-4 w-4" />
              <span className="text-sm font-semibold">{property.revenue.toLocaleString('el-GR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

