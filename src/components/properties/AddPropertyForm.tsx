'use client'

import { useState } from 'react'
import { propertiesApi } from '@/lib/api/properties'
import { Property } from '@/lib/api/types'

interface AddPropertyFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AddPropertyForm({ onSuccess, onCancel }: AddPropertyFormProps) {
  const [formData, setFormData] = useState({
    titleGr: '',
    titleEn: '',
    descriptionGr: '',
    descriptionEn: '',
    type: 'APARTMENT' as Property['type'],
    status: 'ACTIVE' as Property['status'],
    address: '',
    city: '',
    country: 'Greece',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    area: null as number | null,
    basePrice: 0,
    currency: 'EUR',
    cleaningFee: null as number | null,
    serviceFee: null as number | null,
    taxes: null as number | null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await propertiesApi.create(formData)
      setFormData({
        titleGr: '',
        titleEn: '',
        descriptionGr: '',
        descriptionEn: '',
        type: 'APARTMENT',
        status: 'ACTIVE',
        address: '',
        city: '',
        country: 'Greece',
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        area: null,
        basePrice: 0,
        currency: 'EUR',
        cleaningFee: null,
        serviceFee: null,
        taxes: null,
      })
      onSuccess()
    } catch (err: any) {
      console.error('Error creating property:', err)
      setError(err.message || 'Σφάλμα κατά τη δημιουργία ακινήτου')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'bedrooms' || name === 'bathrooms' || name === 'maxGuests' || name === 'basePrice' || name === 'area' || name === 'cleaningFee' || name === 'serviceFee' || name === 'taxes') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }))
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title GR */}
        <div>
          <label htmlFor="titleGr" className="block text-sm font-medium text-gray-700 mb-2">
            Τίτλος (Ελληνικά) <span className="text-red-500">*</span>
          </label>
          <input
            id="titleGr"
            name="titleGr"
            type="text"
            value={formData.titleGr}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Title EN */}
        <div>
          <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-2">
            Τίτλος (Αγγλικά)
          </label>
          <input
            id="titleEn"
            name="titleEn"
            type="text"
            value={formData.titleEn}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Description GR */}
        <div>
          <label htmlFor="descriptionGr" className="block text-sm font-medium text-gray-700 mb-2">
            Περιγραφή (Ελληνικά)
          </label>
          <textarea
            id="descriptionGr"
            name="descriptionGr"
            value={formData.descriptionGr}
            onChange={handleChange}
            className="input w-full"
            rows={3}
          />
        </div>

        {/* Description EN */}
        <div>
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2">
            Περιγραφή (Αγγλικά)
          </label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleChange}
            className="input w-full"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Τύπος <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input w-full"
            required
          >
            <option value="APARTMENT">Διαμέρισμα</option>
            <option value="HOUSE">Κατοικία</option>
            <option value="ROOM">Δωμάτιο</option>
            <option value="COMMERCIAL">Επαγγελματικό</option>
            <option value="STORAGE">Αποθήκη</option>
            <option value="VACATION_RENTAL">Διακοπές</option>
            <option value="LUXURY">Πολυτελές</option>
            <option value="INVESTMENT">Επένδυση</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Κατάσταση <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input w-full"
            required
          >
            <option value="ACTIVE">Ενεργό</option>
            <option value="INACTIVE">Ανενεργό</option>
            <option value="MAINTENANCE">Συντήρηση</option>
            <option value="SUSPENDED">Αναστολή</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
            Νόμισμα <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="input w-full"
            required
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Διεύθυνση
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Πόλη <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Χώρα <span className="text-red-500">*</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
            Υπνοδωμάτια <span className="text-red-500">*</span>
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
            Μπάνια <span className="text-red-500">*</span>
          </label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            value={formData.bathrooms}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Max Guests */}
        <div>
          <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
            Μέγιστοι Επισκέπτες <span className="text-red-500">*</span>
          </label>
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            value={formData.maxGuests}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Area */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
            Περιοχή (m²)
          </label>
          <input
            id="area"
            name="area"
            type="number"
            min="0"
            value={formData.area || ''}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Base Price */}
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
            Βασική Τιμή <span className="text-red-500">*</span>
          </label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.basePrice}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        {/* Cleaning Fee */}
        <div>
          <label htmlFor="cleaningFee" className="block text-sm font-medium text-gray-700 mb-2">
            Χρέωση Καθαρισμού
          </label>
          <input
            id="cleaningFee"
            name="cleaningFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.cleaningFee || ''}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Service Fee */}
        <div>
          <label htmlFor="serviceFee" className="block text-sm font-medium text-gray-700 mb-2">
            Χρέωση Υπηρεσίας
          </label>
          <input
            id="serviceFee"
            name="serviceFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.serviceFee || ''}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Taxes */}
        <div>
          <label htmlFor="taxes" className="block text-sm font-medium text-gray-700 mb-2">
            Φόροι
          </label>
          <input
            id="taxes"
            name="taxes"
            type="number"
            min="0"
            step="0.01"
            value={formData.taxes || ''}
            onChange={handleChange}
            className="input w-full"
          />
        </div>
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
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Δημιουργία...' : 'Δημιουργία Ακινήτου'}
        </button>
      </div>
    </form>
  )
}

