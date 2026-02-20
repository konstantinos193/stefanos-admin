'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import { Service } from '@/lib/api/services'
import { ServiceDialog } from './ServiceDialog'

interface ServicesTableProps {
  services: Service[]
  loading: boolean
  onEdit: (service: Service) => void
  onDelete: (service: Service) => void
  onToggleActive: (service: Service) => void
}

export function ServicesTable({ 
  services, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: ServicesTableProps) {
  const [viewService, setViewService] = useState<Service | null>(null)

  if (loading) {
    return (
      <div className="card">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="card">
        <div className="p-6 text-center text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Δεν βρέθηκαν υπηρεσίες</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">Υπηρεσία</th>
                <th className="text-left p-4 font-medium text-gray-700">Περιγραφή</th>
                <th className="text-left p-4 font-medium text-gray-700">Χαρακτηριστικά</th>
                <th className="text-left p-4 font-medium text-gray-700">Τιμολόγηση</th>
                <th className="text-left p-4 font-medium text-gray-700">Κατάσταση</th>
                <th className="text-left p-4 font-medium text-gray-700">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {service.icon && (
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-sm">{service.icon}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{service.titleGr}</div>
                        <div className="text-sm text-gray-500">{service.titleEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {service.descriptionGr || service.descriptionEn || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {service.features && service.features.length > 0 ? (
                        service.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {feature}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                      {service.features && service.features.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{service.features.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{service.pricingGr || '-'}</div>
                      {service.pricingEn && service.pricingEn !== service.pricingGr && (
                        <div className="text-gray-500 text-xs">{service.pricingEn}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onToggleActive(service)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {service.isActive ? (
                        <ToggleRight className="h-3 w-3" />
                      ) : (
                        <ToggleLeft className="h-3 w-3" />
                      )}
                      <span>{service.isActive ? 'Ενεργή' : 'Ανενεργή'}</span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewService(service)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Προβολή"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(service)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Επεξεργασία"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(service)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Διαγραφή"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Service Dialog */}
      <ServiceDialog
        isOpen={!!viewService}
        onClose={() => setViewService(null)}
        service={viewService}
        mode="view"
      />
    </>
  )
}
