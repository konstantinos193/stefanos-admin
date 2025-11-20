'use client'

import { X, AlertTriangle } from 'lucide-react'
import { User } from '@/lib/api/types'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  user: User | null
  loading?: boolean
}

export function DeleteUserModal({ isOpen, onClose, onConfirm, user, loading = false }: DeleteUserModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Διαγραφή Χρήστη</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Είστε σίγουροι ότι θέλετε να διαγράψετε τον χρήστη{' '}
            <span className="font-semibold">{user.name || user.email}</span>?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Ο χρήστης θα αφαιρεθεί μόνιμα από το σύστημα.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Ακύρωση
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="btn btn-danger flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Διαγραφή...</span>
                </>
              ) : (
                <span>Διαγραφή</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

