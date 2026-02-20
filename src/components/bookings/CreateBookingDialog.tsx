'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { roomsApi, Room } from '@/lib/api/rooms'

interface CreateBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

interface BookingFormData {
  roomId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: string
  checkOut: string
  guests: number
  specialRequests: string
}

const initialFormData: BookingFormData = {
  roomId: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  specialRequests: '',
}

export function CreateBookingDialog({ isOpen, onClose, onCreated }: CreateBookingDialogProps) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [rooms, setRooms] = useState<Room[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingRooms, setLoadingRooms] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData)
      setError(null)
      fetchRooms()
    }
  }, [isOpen])

  async function fetchRooms() {
    setLoadingRooms(true)
    try {
      const response = await roomsApi.getBookable()
      setRooms(response.data?.rooms || [])
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setRooms([])
    } finally {
      setLoadingRooms(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.roomId || !formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
      setError('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.')
      return
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Η ημερομηνία αναχώρησης πρέπει να είναι μετά την ημερομηνία άφιξης.')
      return
    }

    const selectedRoom = rooms.find(r => r.id === formData.roomId)
    if (!selectedRoom) {
      setError('Παρακαλώ επιλέξτε δωμάτιο.')
      return
    }

    setSaving(true)
    try {
      await bookingsApi.create({
        propertyId: selectedRoom.propertyId,
        roomId: selectedRoom.id,
        roomName: selectedRoom.nameGr || selectedRoom.nameEn || selectedRoom.name,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone || null,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        specialRequests: formData.specialRequests || null,
      })
      onCreated()
      onClose()
    } catch (err: any) {
      console.error('Error creating booking:', err)
      setError(err.message || 'Αποτυχία δημιουργίας κράτησης.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">Νέα Κράτηση</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Room */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Δωμάτιο <span className="text-red-400">*</span>
            </label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              className="input"
              disabled={loadingRooms}
            >
              <option value="">
                {loadingRooms ? 'Φόρτωση...' : 'Επιλέξτε δωμάτιο'}
              </option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.nameGr || r.nameEn || r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Όνομα Επισκέπτη <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              className="input"
              placeholder="π.χ. Γιάννης Παπαδόπουλος"
            />
          </div>

          {/* Guest Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email Επισκέπτη <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              className="input"
              placeholder="email@example.com"
            />
          </div>

          {/* Guest Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Τηλέφωνο Επισκέπτη
            </label>
            <input
              type="tel"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleChange}
              className="input"
              placeholder="+30 69x xxx xxxx"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Άφιξη <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Αναχώρηση <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Αριθμός Επισκεπτών
            </label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min={1}
              max={20}
              className="input"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Ειδικά Αιτήματα
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="Προαιρετικά σχόλια ή αιτήματα..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary text-sm"
            >
              {saving ? 'Δημιουργία...' : 'Δημιουργία Κράτησης'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
