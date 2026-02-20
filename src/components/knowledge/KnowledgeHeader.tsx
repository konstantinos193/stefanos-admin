'use client'

import { Plus } from 'lucide-react'
import { CreateKnowledgeDialog } from './CreateKnowledgeDialog'
import { useState } from 'react'

export function KnowledgeHeader() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Βάση Γνώσης</h1>
          <p className="text-gray-600 mt-1">Διαχείριση άρθρων βάσης γνώσης</p>
        </div>
        <button 
          onClick={() => setShowCreateDialog(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Νέο Άρθρο</span>
        </button>
      </div>

      {showCreateDialog && (
        <CreateKnowledgeDialog
          onClose={() => setShowCreateDialog(false)}
          onSuccess={() => setShowCreateDialog(false)}
        />
      )}
    </>
  )
}
