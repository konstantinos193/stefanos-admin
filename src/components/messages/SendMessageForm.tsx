'use client'

import { useState, useEffect } from 'react'
import { messagesApi } from '@/lib/api/messages'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'

interface SendMessageFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function SendMessageForm({ onSuccess, onCancel }: SendMessageFormProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [formData, setFormData] = useState({
    bookingId: '',
    content: '',
    type: 'TEXT' as 'TEXT' | 'IMAGE' | 'FILE'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoadingBookings(true)
        const allBookings = await bookingsApi.getAllForSearch()
        setBookings(allBookings)
      } catch (error) {
        console.error('Error loading bookings:', error)
        setError('Σφάλμα φόρτωσης κρατήσεων')
      } finally {
        setLoadingBookings(false)
      }
    }
    loadBookings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.bookingId) {
      setError('Παρακαλώ επιλέξτε κράτηση')
      return
    }

    if (!formData.content.trim()) {
      setError('Παρακαλώ εισάγετε περιεχόμενο μηνύματος')
      return
    }

    try {
      setLoading(true)
      await messagesApi.send(formData.bookingId, formData.content, formData.type)
      setFormData({
        bookingId: '',
        content: '',
        type: 'TEXT'
      })
      onSuccess()
    } catch (error: any) {
      console.error('Error sending message:', error)
      setError(error.message || 'Σφάλμα αποστολής μηνύματος')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700 mb-2">
          Κράτηση <span className="text-red-500">*</span>
        </label>
        <select
          id="bookingId"
          value={formData.bookingId}
          onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
          className="input w-full"
          required
          disabled={loadingBookings}
        >
          <option value="">Επιλέξτε κράτηση...</option>
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              {booking.guestName || booking.guest?.name || 'Άγνωστος'} - {booking.property?.titleGr || booking.propertyId} ({new Date(booking.checkIn).toLocaleDateString('el-GR')} - {new Date(booking.checkOut).toLocaleDateString('el-GR')})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Τύπος Μηνύματος
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'TEXT' | 'IMAGE' | 'FILE' })}
          className="input w-full"
        >
          <option value="TEXT">Κείμενο</option>
          <option value="IMAGE">Εικόνα</option>
          <option value="FILE">Αρχείο</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Περιεχόμενο <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
          className="input w-full"
          placeholder="Γράψτε το μήνυμά σας..."
          required
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
          className="btn btn-primary"
          disabled={loading || loadingBookings}
        >
          {loading ? 'Αποστολή...' : 'Αποστολή'}
        </button>
      </div>
    </form>
  )
}

