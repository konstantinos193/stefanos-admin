'use client'

import { Mail, Edit, Eye } from 'lucide-react'

export function EmailTemplatesSettings() {
  const templates = [
    { id: '1', name: 'Booking Confirmation', subject: 'Κράτηση επιβεβαιώθηκε', type: 'booking' },
    { id: '2', name: 'Payment Receipt', subject: 'Απόδειξη πληρωμής', type: 'payment' },
    { id: '3', name: 'Welcome Email', subject: 'Καλώς ήρθατε!', type: 'welcome' },
    { id: '4', name: 'Password Reset', subject: 'Επαναφορά κωδικού', type: 'auth' },
    { id: '5', name: 'Review Request', subject: 'Αξιολογήστε την παραμονή σας', type: 'review' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Email Templates</h2>
        <p className="text-gray-600 mb-6">Διαχείριση email templates</p>

        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.subject}</p>
                    <span className="text-xs text-gray-500 mt-1 inline-block">
                      Type: {template.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn btn-secondary flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Προβολή</span>
                  </button>
                  <button className="btn btn-primary flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Επεξεργασία</span>
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

