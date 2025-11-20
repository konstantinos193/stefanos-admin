'use client'

import { X, Upload, FileText } from 'lucide-react'
import { ImportUsersForm } from './ImportUsersForm'

interface ImportUsersModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportUsersModal({ isOpen, onClose, onSuccess }: ImportUsersModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Εισαγωγή Χρηστών</h2>
              <p className="text-sm text-gray-500 mt-1">Εισαγωγή χρηστών από CSV αρχείο</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-2">Οδηγίες:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Το CSV αρχείο πρέπει να περιέχει τις στήλες: Email, Name, Phone, Role, Password</li>
                <li>Η πρώτη γραμμή πρέπει να είναι οι επικεφαλίδες</li>
                <li>Ο ρόλος πρέπει να είναι ένα από: USER, ADMIN, PROPERTY_OWNER, MANAGER</li>
                <li>Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <ImportUsersForm onSuccess={onSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  )
}

