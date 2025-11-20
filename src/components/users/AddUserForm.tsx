'use client'

import { useState } from 'react'
import { User, Mail, Phone, Lock, Shield } from 'lucide-react'
import { usersApi } from '@/lib/api/users'

interface AddUserFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AddUserForm({ onSuccess, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    role: 'USER' as 'USER' | 'ADMIN' | 'PROPERTY_OWNER' | 'MANAGER',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await usersApi.create({
        email: formData.email,
        name: formData.name,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role,
      })
      console.log('User created successfully:', response)
      // Reset form
      setFormData({
        email: '',
        name: '',
        phone: '',
        password: '',
        role: 'USER',
      })
      onSuccess()
    } catch (err: any) {
      console.error('Error creating user:', err)
      setError(err.message || 'Σφάλμα κατά τη δημιουργία χρήστη')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="input pl-10"
            placeholder="user@example.com"
            required
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Όνομα <span className="text-red-500">*</span>
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
            required
            minLength={2}
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

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Κωδικός <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="input pl-10"
            placeholder="Ελάχιστο 8 χαρακτήρες"
            required
            minLength={8}
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Ρόλος <span className="text-red-500">*</span>
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
            required
          >
            <option value="USER">Χρήστης</option>
            <option value="PROPERTY_OWNER">Ιδιοκτήτης Ακινήτου</option>
            <option value="MANAGER">Διαχειριστής</option>
            <option value="ADMIN">Διαχειριστής Συστήματος</option>
          </select>
        </div>
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
              <span>Δημιουργία...</span>
            </>
          ) : (
            <span>Δημιουργία Χρήστη</span>
          )}
        </button>
      </div>
    </form>
  )
}

