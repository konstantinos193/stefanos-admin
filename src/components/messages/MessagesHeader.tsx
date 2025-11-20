'use client'

import { Plus } from 'lucide-react'

interface MessagesHeaderProps {
  onNewMessage: () => void
}

export function MessagesHeader({ onNewMessage }: MessagesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Μηνύματα</h1>
        <p className="text-gray-600 mt-1">Διαχείριση μηνυμάτων και επικοινωνίας</p>
      </div>
      <button 
        onClick={onNewMessage}
        className="btn btn-primary flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Νέο Μήνυμα</span>
      </button>
    </div>
  )
}

