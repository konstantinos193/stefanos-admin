'use client'

import { useState } from 'react'
import { User, Mail, Phone, Shield } from 'lucide-react'
import { usersApi } from '@/lib/api/users'
import { User as UserType } from '@/lib/api/types'

interface EditUserFormProps {
  user: UserType
  onSuccess: () => void
  onCancel: () => void
}

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    role: user.role,
    isActive: user.isActive,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await usersApi.update(user.id, {
        name: formData.name || null,
        phone: formData.phone || null,
        role: formData.role,
        isActive: formData.isActive,
      })
      onSuccess()
    } catch (err: any) {
      console.error('Error updating user:', err)
      setError(err.message || 'Σφάλμα κατά την ενημέρωση χρήστη')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Email (read-only) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            value={user.email}
            className="input pl-10 bg-gray-50 cursor-not-allowed"
            disabled
            readOnly
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Το email δεν μπορεί να αλλάξει</p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Όνομα
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="input pl-10"
            placeholder="Όνομα Χρήστη"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Τηλέφωνο
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="input pl-10"
            placeholder="+30 210 123 4567"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Ρόλος
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input pl-10 appearance-none"
          >
            <option value="USER">Χρήστης</option>
            <option value="PROPERTY_OWNER">Ιδιοκτήτης Ακινήτου</option>
            <option value="MANAGER">Διαχειριστής</option>
            <option value="ADMIN">Διαχειριστής Συστήματος</option>
          </select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Ενεργός Χρήστης</span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-7">
          Ανενεργοποιημένοι χρήστες δεν μπορούν να συνδεθούν
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Αποθήκευση...</span>
            </>
          ) : (
            <span>Αποθήκευση</span>
          )}
        </button>
      </div>
    </form>
  )
}

