'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'

export function ApiKeysSettings() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'sk_live_1234567890abcdef', created: '2024-01-15', lastUsed: '2024-01-20' },
    { id: '2', name: 'Development API Key', key: 'sk_test_abcdef1234567890', created: '2024-01-10', lastUsed: '2024-01-19' },
  ])
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskKey = (key: string) => {
    return key.slice(0, 8) + '•'.repeat(key.length - 12) + key.slice(-4)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
            <p className="text-gray-600 mt-1">Διαχείριση API keys για πρόσβαση</p>
          </div>
          <button className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Νέο API Key</span>
          </button>
        </div>

        <div className="space-y-4">
          {keys.map((apiKey) => (
            <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                  <div className="mt-2 flex items-center space-x-2">
                    <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                      {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => toggleVisibility(apiKey.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {visibleKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Δημιουργήθηκε: {apiKey.created} | Τελευταία χρήση: {apiKey.lastUsed}
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-900">
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

