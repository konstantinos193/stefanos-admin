'use client'

import { useState, useRef } from 'react'
import { Room, RoomType, roomsApi } from '@/lib/api/rooms'
import { uploadApi } from '@/lib/api/upload'
import { X, Upload, Trash2, ToggleLeft, ToggleRight, GripVertical, Image as ImageIcon, ZoomIn, Star, ArrowUp, ArrowDown, Plus } from 'lucide-react'

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
  const [dragOver, setDragOver] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const response = await uploadApi.uploadMultipleRoomImages(Array.from(files))
      if (response.success && response.data.urls.length > 0) {
        setEditedRoom(prev => ({
          ...prev,
          images: [...(prev.images || []), ...response.data.urls]
        }))
      } else {
        throw new Error('No images uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Αποτυχία μεταφόρτωσης εικόνων')
    } finally {
      setUploading(false)
    }
  }

  const handleSingleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleImageUpload(e.target.files)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setEditedRoom(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const images = [...(editedRoom.images || [])]
    const draggedImage = images[draggedIndex]
    images.splice(draggedIndex, 1)
    images.splice(dropIndex, 0, draggedImage)

    setEditedRoom(prev => ({ ...prev, images }))
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    await handleImageUpload(e.dataTransfer.files)
  }

  const handleDragOverArea = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const setAsPrimary = (index: number) => {
    const images = [...(editedRoom.images || [])]
    const [primaryImage] = images.splice(index, 1)
    images.unshift(primaryImage)
    setEditedRoom(prev => ({ ...prev, images }))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const images = [...(editedRoom.images || [])]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= images.length) return
    
    [images[index], images[newIndex]] = [images[newIndex], images[index]]
    setEditedRoom(prev => ({ ...prev, images }))
  }

  const addMoreImages = () => {
    fileInputRef.current?.click()
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
              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-[#334155]">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-slate-400">Εικόνες:</span>
                    <span className="ml-2 font-medium text-slate-200">
                      {editedRoom.images?.length || 0}
                    </span>
                  </div>
                  {editedRoom.images && editedRoom.images.length > 0 && (
                    <div className="text-xs text-slate-500">
                      Η πρώτη εικόνα είναι η κύρια
                    </div>
                  )}
                </div>
                
                <button
                  onClick={addMoreImages}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {uploading ? 'Μεταφόρτωση...' : 'Προσθήκη Εικόνων'}
                </button>
              </div>

              {/* Images List - Much easier to manage */}
              {editedRoom.images && editedRoom.images.length > 0 ? (
                <div className="space-y-3">
                  {editedRoom.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-[#334155] hover:border-[#475569] transition-all group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                        <img
                          src={image}
                          alt={`Room image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute top-1 left-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Κύρια
                          </div>
                        )}
                        
                        {/* Index Badge */}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-semibold bg-black/50 text-white rounded">
                          #{index + 1}
                        </div>
                      </div>

                      {/* Image Info & Actions */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-200">
                              {index === 0 ? 'Κύρια Εικόνα' : `Εικόνα ${index + 1}`}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Κάντε κλικ για προεπισκόπηση
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* Reordering */}
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveImage(index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                                title="Μετακίνηση πάνω"
                              >
                                <ArrowUp className="w-3 h-3 text-slate-300" />
                              </button>
                              <button
                                onClick={() => moveImage(index, 'down')}
                                disabled={index === editedRoom.images.length - 1}
                                className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
                                title="Μετακίνηση κάτω"
                              >
                                <ArrowDown className="w-3 h-3 text-slate-300" />
                              </button>
                            </div>

                            {/* Set Primary */}
                            {index !== 0 && (
                              <button
                                onClick={() => setAsPrimary(index)}
                                className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                                title="Ορισμός ως κύρια"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            )}

                            {/* Preview */}
                            <button
                              onClick={() => setSelectedImage(image)}
                              className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                              title="Προεπισκόπηση"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                              title="Διαγραφή"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div
                  className={`flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    dragOver 
                      ? 'border-accent-blue bg-blue-500/10' 
                      : 'border-[#475569] hover:border-accent-blue hover:bg-slate-800'
                  }`}
                  onClick={addMoreImages}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOverArea}
                  onDragLeave={handleDragLeave}
                >
                  <ImageIcon className="w-12 h-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">
                    Δεν υπάρχουν εικόνες
                  </h3>
                  <p className="text-sm text-slate-500 text-center mb-4">
                    Προσθέστε εικόνες για το δωμάτιο για να εμφανίζονται στην κράτηση
                  </p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    Πρώτη Εικόνα
                  </button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleSingleImageUpload}
                className="hidden"
              />

              {/* Image Preview Modal */}
              {selectedImage && (
                <div 
                  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedImage(null)}
                >
                  <div className="relative max-w-4xl max-h-full">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
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
