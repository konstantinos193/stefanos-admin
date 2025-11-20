'use client'

import { X } from 'lucide-react'
import { AddBookingForm } from './AddBookingForm'

interface AddBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddBookingModal({ isOpen, onClose, onSuccess }: AddBookingModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Νέα Κράτηση</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <AddBookingForm
            onSuccess={() => {
              onSuccess()
              onClose()
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}

