'use client'

import { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { knowledgeApi } from '@/lib/api/knowledge'
import { KnowledgeArticle } from '@/lib/api/knowledge'

interface DeleteKnowledgeDialogProps {
  article: KnowledgeArticle
  onClose: () => void
  onSuccess: () => void
}

export function DeleteKnowledgeDialog({ article, onClose, onSuccess }: DeleteKnowledgeDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      await knowledgeApi.delete(article.id)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting article:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Διαγραφή Άρθρου</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το άρθρο;
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">{article.titleGr}</h3>
              <p className="text-sm text-gray-500">{article.titleEn}</p>
              <div className="flex items-center text-xs text-gray-400 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-600 mr-2">
                  {article.category}
                </span>
                <span>Από {article.author}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-900 mb-1">Προσοχή</h4>
                <p className="text-sm text-amber-800">
                  Αυτή η ενέργεια είναι οριστική και δεν μπορεί να αναιρεθεί. Το άρθρο θα διαγραφεί μόνιμα από τη βάση γνώσης.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Ακύρωση
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? 'Διαγραφή...' : 'Διαγραφή'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
