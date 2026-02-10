'use client'

import { useState, useEffect } from 'react'
import { roomsApi, Room } from '@/lib/api/rooms'
import { DoorOpen, Users, Euro, Pencil } from 'lucide-react'
import { RoomEditDialog } from './RoomEditDialog'

export function RoomsGrid() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<string>('')
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  useEffect(() => {
    async function fetchRooms() {
      if (!selectedProperty) {
        setRooms([])
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const response = await roomsApi.getByProperty(selectedProperty)
        setRooms(response.data?.rooms || [])
      } catch (error) {
        console.error('Error fetching rooms:', error)
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [selectedProperty])

  const handleSaveRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r))
  }

  if (loading) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <p className="text-gray-600">Φόρτωση δωματίων...</p>
        </div>
      </div>
    )
  }

  if (!selectedProperty) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <p className="text-gray-600">Επιλέξτε ένα ακίνητο για να δείτε τα δωμάτια</p>
        </div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <p className="text-gray-600">Δεν βρέθηκαν δωμάτια</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="card hover:shadow-lg transition-shadow">
            {/* Room Image */}
            {room.images && room.images.length > 0 ? (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={room.images[0]}
                  alt={room.nameGr || room.name}
                  className="w-full h-full object-cover"
                />
                {room.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    +{room.images.length - 1} more
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
                <p className="text-gray-400">No images</p>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DoorOpen className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {room.nameGr || room.nameEn || room.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  room.isBookable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {room.isBookable ? 'Διαθέσιμο' : 'Μη Διαθέσιμο'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Χωρητικότητα: {room.capacity}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Euro className="h-4 w-4" />
                  <span>Τιμή: €{room.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Τύπος: {room.type}</span>
                </div>
              </div>
              {room.descriptionGr || room.descriptionEn ? (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {room.descriptionGr || room.descriptionEn}
                </p>
              ) : null}
              <div className="flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  Προβολή
                </button>
                <button 
                  onClick={() => setEditingRoom(room)}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Επεξεργασία
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingRoom && (
        <RoomEditDialog
          room={editingRoom}
          isOpen={true}
          onClose={() => setEditingRoom(null)}
          onSave={handleSaveRoom}
        />
      )}
    </>
  )
}

