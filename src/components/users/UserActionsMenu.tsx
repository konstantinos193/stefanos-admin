'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Power, PowerOff } from 'lucide-react'
import { User } from '@/lib/api/types'
import { usersApi } from '@/lib/api/users'

interface UserActionsMenuProps {
  user: User
  onEdit: () => void
  onDelete: () => void
  onUpdate: () => void
  onRefresh?: () => void
}

export function UserActionsMenu({ user, onEdit, onDelete, onUpdate, onRefresh }: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      if (user.isActive) {
        await usersApi.deactivate(user.id)
      } else {
        await usersApi.activate(user.id)
      }
      setIsOpen(false)
      onUpdate()
      if (onRefresh) {
        onRefresh()
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error)
      alert(`Σφάλμα: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="text-gray-600 hover:text-gray-900 p-1 relative"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                onEdit()
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <span>Επεξεργασία</span>
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
            >
              {user.isActive ? (
                <>
                  <PowerOff className="h-4 w-4" />
                  <span>Απενεργοποίηση</span>
                </>
              ) : (
                <>
                  <Power className="h-4 w-4" />
                  <span>Ενεργοποίηση</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                onDelete()
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <span>Διαγραφή</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

