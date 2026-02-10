'use client'

import { useState, useRef } from 'react'
import { Room, roomsApi } from '@/lib/api/rooms'
import { uploadApi } from '@/lib/api/upload'
import { X, Upload, ImageIcon, Trash2 } from 'lucide-react'

interface RoomEditDialogProps {
  room: Room
  isOpen: boolean
  onClose: () => void
  onSave: (room: Room) => void
}

export function RoomEditDialog({ room, isOpen, onClose, onSave }: RoomEditDialogProps) {
  const [editedRoom, setEditedRoom] = useState<Room>(room)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
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
      alert('Failed to upload image')
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
        images: editedRoom.images,
        name: editedRoom.name,
        nameGr: editedRoom.nameGr,
        nameEn: editedRoom.nameEn,
        descriptionGr: editedRoom.descriptionGr,
        descriptionEn: editedRoom.descriptionEn,
        basePrice: editedRoom.basePrice,
        capacity: editedRoom.capacity,
        amenities: editedRoom.amenities,
      })
      if (response.success) {
        onSave(response.data)
        onClose()
      }
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Failed to save room')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Room Images</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Name (Greek)
            </label>
            <input
              type="text"
              value={editedRoom.nameGr || editedRoom.name}
              onChange={(e) => setEditedRoom(prev => ({ ...prev, nameGr: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Room Images
            </label>
            
            {/* Current Images */}
            {editedRoom.images && editedRoom.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {editedRoom.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Upload Image</span>
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
          </div>

          {/* Price & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night (€)
              </label>
              <input
                type="number"
                value={editedRoom.basePrice}
                onChange={(e) => setEditedRoom(prev => ({ ...prev, basePrice: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={editedRoom.capacity}
                onChange={(e) => setEditedRoom(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
