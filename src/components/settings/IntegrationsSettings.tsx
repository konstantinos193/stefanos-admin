'use client'

import { CheckCircle, XCircle, Settings } from 'lucide-react'

export function IntegrationsSettings() {
  const integrations = [
    { name: 'Stripe', description: 'Πληρωμές και χρέωση', enabled: true, icon: '💳' },
    { name: 'SendGrid', description: 'Email notifications', enabled: true, icon: '📧' },
    { name: 'Google Analytics', description: 'Analytics tracking', enabled: false, icon: '📊' },
    { name: 'Facebook Pixel', description: 'Marketing tracking', enabled: false, icon: '📱' },
    { name: 'Zapier', description: 'Automation workflows', enabled: false, icon: '⚡' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ενσωματώσεις</h2>
        <p className="text-gray-600 mb-6">Διαχείριση ενσωματώσεων τρίτων υπηρεσιών</p>
        
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {integration.enabled ? (
                    <span className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Ενεργό</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2 text-gray-400">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Ανενεργό</span>
                    </span>
                  )}
                  <button className="btn btn-secondary flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Ρυθμίσεις</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

