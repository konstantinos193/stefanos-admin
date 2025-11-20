'use client'

import { useState, useEffect } from 'react'
import { bookingsApi } from '@/lib/api/bookings'
import { propertiesApi } from '@/lib/api/properties'
import { usersApi } from '@/lib/api/users'
import { Property } from '@/lib/api/types'
import { User } from '@/lib/api/types'

interface AddBookingFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AddBookingForm({ onSuccess, onCancel }: AddBookingFormProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [formData, setFormData] = useState({
    propertyId: '',
    guestId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingProperties(true)
        setLoadingUsers(true)
        const [propertiesData, usersData] = await Promise.all([
          propertiesApi.getAllForSearch(),
          usersApi.getAllForExport()
        ])
        setProperties(propertiesData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Σφάλμα φόρτωσης δεδομένων')
      } finally {
        setLoadingProperties(false)
        setLoadingUsers(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.propertyId) {
      setError('Παρακαλώ επιλέξτε ακίνητο')
      return
    }

    if (!formData.guestId && (!formData.guestName || !formData.guestEmail)) {
      setError('Παρακαλώ επιλέξτε επισκέπτη ή εισάγετε όνομα και email')
      return
    }

    if (!formData.checkIn || !formData.checkOut) {
      setError('Παρακαλώ επιλέξτε ημερομηνίες άφιξης και αναχώρησης')
      return
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setError('Η ημερομηνία αναχώρησης πρέπει να είναι μετά την άφιξη')
      return
    }

    try {
      setLoading(true)
      await bookingsApi.create({
        propertyId: formData.propertyId,
        guestId: formData.guestId || undefined,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone || undefined,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        specialRequests: formData.specialRequests || undefined,
      })
      setFormData({
        propertyId: '',
        guestId: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: '',
      })
      onSuccess()
    } catch (err: any) {
      console.error('Error creating booking:', err)
      setError(err.message || 'Σφάλμα κατά τη δημιουργία κράτησης')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'guests') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 1 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleGuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const guestId = e.target.value
    const guest = users.find(u => u.id === guestId)
    setFormData((prev) => ({
      ...prev,
      guestId,
      guestName: guest?.name || '',
      guestEmail: guest?.email || '',
      guestPhone: guest?.phone || '',
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property */}
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-2">
            Ακίνητο <span className="text-red-500">*</span>
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            className="input w-full"
            required
            disabled={loadingProperties}
          >
            <option value="">Επιλέξτε ακίνητο...</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.titleGr} - {property.city}
              </option>
            ))}
          </select>
        </div>

        {/* Guest */}
        <div>
          <label htmlFor="guestId" className="block text-sm font-medium text-gray-700 mb-2">
            Επισκέπτης
          </label>
          <select
            id="guestId"
            name="guestId"
            value={formData.guestId}
            onChange={handleGuestChange}
            className="input w-full"
            disabled={loadingUsers}
          >
            <option value="">Επιλέξτε επισκέπτη...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guest Name */}
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
            Όνομα Επισκέπτη
          </label>
          <input
            id="guestName"
            name="guestName"
            type="text"
            value={formData.guestName}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Guest Email */}
        <div>
          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email Επισκέπτη
          </label>
          <input
            id="guestEmail"
            name="guestEmail"
            type="email"
            value={formData.guestEmail}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guest Phone */}
        <div>
          <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Τηλέφωνο Επισκέπτη
          </label>
          <input
            id="guestPhone"
            name="guestPhone"
            type="tel"
            value={formData.guestPhone}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Check In */}
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
            Αφιξη <span className="text-red-500">*</span>
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            value={formData.checkIn}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Check Out */}
        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
            Αναχώρηση <span className="text-red-500">*</span>
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            value={formData.checkOut}
            onChange={handleChange}
            min={formData.checkIn}
            className="input w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guests */}
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
            Αριθμός Επισκεπτών <span className="text-red-500">*</span>
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            value={formData.guests}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
          Ειδικές Αιτήσεις
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          className="input w-full"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Ακύρωση
        </button>
        <button
          type="submit"
          disabled={loading || loadingProperties || loadingUsers}
          className="btn btn-primary"
        >
          {loading ? 'Δημιουργία...' : 'Δημιουργία Κράτησης'}
        </button>
      </div>
    </form>
  )
}

