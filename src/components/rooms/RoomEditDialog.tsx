'use client'

import { useState, useRef } from 'react'
import { Room, RoomType, roomsApi } from '@/lib/api/rooms'
import { uploadApi } from '@/lib/api/upload'
import { X, Upload, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface RoomEditDialogProps {
  room: Room
  isOpen: boolean
  onClose: () => void
  onSave: (room?: Room) => void
}

const roomTypeOptions: { value: RoomType; label: string }[] = [
  { value: 'BEDROOM', label: 'Υπνοδωμάτιο' },
  { value: 'STUDIO', label: 'Στούντιο' },
  { value: 'LIVING_ROOM', label: 'Καθιστικό' },
  { value: 'KITCHEN', label: 'Κουζίνα' },
  { value: 'BATHROOM', label: 'Μπάνιο' },
  { value: 'BALCONY', label: 'Μπαλκόνι' },
  { value: 'TERRACE', label: 'Βεράντα' },
  { value: 'GARDEN', label: 'Κήπος' },
  { value: 'OTHER', label: 'Άλλο' },
]

export function RoomEditDialog({ room, isOpen, onClose, onSave }: RoomEditDialogProps) {
  const [editedRoom, setEditedRoom] = useState<Room>({ ...room })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'capacity' | 'images' | 'descriptions'>('general')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadApi.uploadRoomImage(file)
      if (response.success && response.data.url) {
        setEditedRoom(prev => ({
          ...prev,
          images: [...(prev.images || []), response.data.url]
        }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Αποτυχία μεταφόρτωσης εικόνας')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setEditedRoom(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await roomsApi.update(room.id, {
        name: editedRoom.name,
        nameGr: editedRoom.nameGr,
        nameEn: editedRoom.nameEn,
        descriptionGr: editedRoom.descriptionGr,
        descriptionEn: editedRoom.descriptionEn,
        type: editedRoom.type,
        basePrice: editedRoom.basePrice,
        capacity: editedRoom.capacity,
        maxAdults: editedRoom.maxAdults,
        maxChildren: editedRoom.maxChildren,
        maxInfants: editedRoom.maxInfants,
        isBookable: editedRoom.isBookable,
        images: editedRoom.images,
        amenities: editedRoom.amenities,
      })
      if (response.success) {
        onSave(response.data)
      }
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Αποτυχία αποθήκευσης')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general' as const, label: 'Γενικά' },
    { id: 'capacity' as const, label: 'Χωρητικότητα' },
    { id: 'descriptions' as const, label: 'Περιγραφές' },
    { id: 'images' as const, label: 'Εικόνες' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Διαχείριση Δωματίου
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {room.nameGr || room.nameEn || room.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-slate-800/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent-blue text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#334155] bg-slate-800/30">
                <div>
                  <p className="text-sm font-medium text-slate-200">Διαθεσιμότητα</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editedRoom.isBookable ? 'Το δωμάτιο είναι διαθέσιμο για κρατήσεις' : 'Το δωμάτιο δεν δέχεται κρατήσεις'}
                  </p>
                </div>
                <button
                  onClick={() => setEditedRoom(prev => ({ ...prev, isBookable: !prev.isBookable }))}
                  className={`p-2 rounded-lg transition-colors ${
                    editedRoom.isBookable
                      ? 'text-green-400 bg-green-500/15'
                      : 'text-slate-400 bg-slate-500/15'
                  }`}
                >
                  {editedRoom.isBookable ? (
                    <ToggleRight className="h-8 w-8" />
                  ) : (
                    <ToggleLeft className="h-8 w-8" />
                  )}
                </button>
              </div>

              {/* Room Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Όνομα (Ελληνικά)
                  </label>
                  <input
                    type="text"
                    value={editedRoom.nameGr || ''}
                    onChange={(e) => setEditedRoom(prev => ({ ...prev, nameGr: e.target.value || null }))}
                    placeholder={editedRoom.name}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Όνομα (Αγγλικά)
                  </label>
                  <input
                    type="text"
                    value={editedRoom.nameEn || ''}
                    onChange={(e) => setEditedRoom(prev => ({ ...prev, nameEn: e.target.value || null }))}
                    placeholder={editedRoom.name}
                    className="input"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Τύπος Δωματίου
                </label>
                <select
                  value={editedRoom.type}
                  onChange={(e) => setEditedRoom(prev => ({ ...prev, type: e.target.value as RoomType }))}
                  className="input"
                >
                  {roomTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Τιμή ανά Βράδυ (€)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={editedRoom.basePrice}
                  onChange={(e) => setEditedRoom(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                  className="input"
                />
              </div>
            </>
          )}

          {/* Capacity Tab */}
          {activeTab === 'capacity' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Συνολική Χωρητικότητα
                </label>
                <input
                  type="number"
                  min={1}
                  value={editedRoom.capacity}
                  onChange={(e) => setEditedRoom(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  className="input"
                />
                <p className="text-xs text-slate-500 mt-1">Μέγιστος αριθμός ατόμων συνολικά.</p>
              </div>

              <div className="border-t border-[#334155] pt-6">
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Ανάλυση Χωρητικότητας
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-[#334155] bg-slate-800/30">
                    <label className="block text-xs font-medium text-blue-400 mb-2">Ενήλικες (13+)</label>
                    <input
                      type="number"
                      min={0}
                      value={editedRoom.maxAdults ?? ''}
                      placeholder={String(editedRoom.capacity)}
                      onChange={(e) => setEditedRoom(prev => ({ ...prev, maxAdults: e.target.value ? parseInt(e.target.value) : null }))}
                      className="input"
                    />
                  </div>
                  <div className="p-4 rounded-xl border border-[#334155] bg-slate-800/30">
                    <label className="block text-xs font-medium text-green-400 mb-2">Παιδιά (2–12)</label>
                    <input
                      type="number"
                      min={0}
                      value={editedRoom.maxChildren ?? ''}
                      placeholder="0"
                      onChange={(e) => setEditedRoom(prev => ({ ...prev, maxChildren: e.target.value ? parseInt(e.target.value) : null }))}
                      className="input"
                    />
                  </div>
                  <div className="p-4 rounded-xl border border-[#334155] bg-slate-800/30">
                    <label className="block text-xs font-medium text-purple-400 mb-2">Βρέφη (&lt;2)</label>
                    <input
                      type="number"
                      min={0}
                      value={editedRoom.maxInfants ?? ''}
                      placeholder="0"
                      onChange={(e) => setEditedRoom(prev => ({ ...prev, maxInfants: e.target.value ? parseInt(e.target.value) : null }))}
                      className="input"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Αφήστε κενό αν δεν υπάρχει όριο. Η συνολική χωρητικότητα χρησιμοποιείται ως fallback.
                </p>
              </div>
            </>
          )}

          {/* Descriptions Tab */}
          {activeTab === 'descriptions' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Περιγραφή (Ελληνικά)
                </label>
                <textarea
                  rows={4}
                  value={editedRoom.descriptionGr || ''}
                  onChange={(e) => setEditedRoom(prev => ({ ...prev, descriptionGr: e.target.value || null }))}
                  placeholder="Περιγραφή δωματίου στα ελληνικά..."
                  className="input resize-none"
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Περιγραφή (Αγγλικά)
                </label>
                <textarea
                  rows={4}
                  value={editedRoom.descriptionEn || ''}
                  onChange={(e) => setEditedRoom(prev => ({ ...prev, descriptionEn: e.target.value || null }))}
                  placeholder="Room description in English..."
                  className="input resize-none"
                  style={{ minHeight: '100px' }}
                />
              </div>
            </>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <>
              {editedRoom.images && editedRoom.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {editedRoom.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={image}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded">
                          Κύρια
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-3 w-full border-2 border-dashed border-[#475569] rounded-lg hover:border-accent-blue hover:bg-slate-800 transition-colors disabled:opacity-50 justify-center"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400">Μεταφόρτωση...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400">Προσθήκη Εικόνας</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {(!editedRoom.images || editedRoom.images.length === 0) && (
                <p className="text-sm text-slate-500 text-center py-4">
                  Δεν υπάρχουν εικόνες. Προσθέστε εικόνες για το δωμάτιο.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#334155] flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Τελ. ενημέρωση: {new Date(room.updatedAt).toLocaleDateString('el-GR')}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Ακύρωση
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary text-sm"
            >
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
