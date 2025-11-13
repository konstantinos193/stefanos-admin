'use client'

import { Plus, Webhook, Trash2, CheckCircle, XCircle } from 'lucide-react'

export function WebhooksSettings() {
  const webhooks = [
    { id: '1', url: 'https://example.com/webhook/booking', events: ['booking.created', 'booking.updated'], active: true },
    { id: '2', url: 'https://api.example.com/payments', events: ['payment.completed'], active: true },
    { id: '3', url: 'https://webhook.example.com/reviews', events: ['review.created'], active: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Webhooks</h2>
            <p className="text-gray-600 mt-1">Διαχείριση webhooks για real-time events</p>
          </div>
          <button className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Νέο Webhook</span>
          </button>
        </div>

        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Webhook className="h-5 w-5 text-blue-500" />
                    <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {webhook.url}
                    </code>
                    {webhook.active ? (
                      <span className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Active</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-gray-400">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Inactive</span>
                      </span>
                    )}
                  </div>
                  <div className="ml-8">
                    <p className="text-xs text-gray-500 mb-1">Events:</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-900 ml-4">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

