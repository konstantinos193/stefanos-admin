'use client'

import { useState } from 'react'
import {
  Users,
  Pencil,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Baby,
  UserRound,
  PersonStanding,
  BedDouble,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { DashboardRoom, roomsApi } from '@/lib/api/rooms'
import { RoomEditDialog } from './RoomEditDialog'

interface RoomsTableProps {
  rooms: DashboardRoom[]
  loading: boolean
  searchQuery: string
  filterType: string
  filterStatus: string
  onRoomUpdated: () => void
}

const roomTypeLabels: Record<string, string> = {
  BEDROOM: 'Υπνοδωμάτιο',
  LIVING_ROOM: 'Καθιστικό',
  STUDIO: 'Στούντιο',
  KITCHEN: 'Κουζίνα',
  BATHROOM: 'Μπάνιο',
  BALCONY: 'Μπαλκόνι',
  TERRACE: 'Βεράντα',
  GARDEN: 'Κήπος',
  OTHER: 'Άλλο',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function RoomsTable({ rooms, loading, searchQuery, filterType, filterStatus, onRoomUpdated }: RoomsTableProps) {
  const [editingRoom, setEditingRoom] = useState<DashboardRoom | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filteredRooms = rooms.filter((room) => {
    const name = (room.nameGr || room.nameEn || room.name || '').toLowerCase()
    const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase())
    const matchesType = !filterType || room.type === filterType
    const matchesStatus =
      !filterStatus ||
      (filterStatus === 'bookable' && room.isBookable) ||
      (filterStatus === 'unavailable' && !room.isBookable) ||
      (filterStatus === 'occupied' && room.isOccupied)
    return matchesSearch && matchesType && matchesStatus
  })

  const handleToggleBookable = async (room: DashboardRoom) => {
    setTogglingId(room.id)
    try {
      await roomsApi.update(room.id, { isBookable: !room.isBookable })
      onRoomUpdated()
    } catch (error) {
      console.error('Error toggling room availability:', error)
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-slate-400">Φόρτωση δωματίων...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Δωμάτιο
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Τύπος
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Τιμή / Βράδυ
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Χωρητικότητα
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Κατάσταση
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Κρατήσεις
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Καθαριότητα
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Έσοδα
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ενέργειες
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 text-lg">
                    Δεν βρέθηκαν δωμάτια
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Room Name + Image */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {room.images && room.images.length > 0 ? (
                          <img
                            src={room.images[0]}
                            alt={room.nameGr || room.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <BedDouble className="h-5 w-5 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-slate-100">
                            {room.nameGr || room.nameEn || room.name}
                          </div>
                          {room.descriptionGr && (
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">
                              {room.descriptionGr}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-300">
                        {roomTypeLabels[room.type] || room.type}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-amber-400">
                        {formatPrice(room.basePrice)}
                      </span>
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-300">
                        <Users className="h-3.5 w-3.5 text-slate-500" />
                        <span>{room.capacity}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {room.maxAdults != null && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/15 text-blue-400 rounded">
                            <UserRound className="h-2.5 w-2.5" />
                            {room.maxAdults}
                          </span>
                        )}
                        {room.maxChildren != null && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-green-500/15 text-green-400 rounded">
                            <PersonStanding className="h-2.5 w-2.5" />
                            {room.maxChildren}
                          </span>
                        )}
                        {room.maxInfants != null && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-purple-500/15 text-purple-400 rounded">
                            <Baby className="h-2.5 w-2.5" />
                            {room.maxInfants}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {room.isOccupied ? (
                        <span className="px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg bg-purple-500/15 text-purple-400">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Κατειλημμένο
                        </span>
                      ) : room.isBookable ? (
                        <span className="px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg bg-green-500/15 text-green-400">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Διαθέσιμο
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg bg-red-500/15 text-red-400">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Μη Διαθέσιμο
                        </span>
                      )}
                    </td>

                    {/* Bookings */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-300">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{room.upcomingBookingsCount}</span>
                      </div>
                      {room.nextBooking && (
                        <div className="text-xs text-slate-500 mt-1">
                          <span className="text-slate-400">{room.nextBooking.guestName}</span>
                          <br />
                          {formatDate(room.nextBooking.checkIn)} — {formatDate(room.nextBooking.checkOut)}
                        </div>
                      )}
                    </td>

                    {/* Cleaning */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {room.lastCleaned ? (
                        <div>
                          <div className="flex items-center gap-1 text-xs text-slate-300">
                            <Sparkles className="h-3 w-3 text-emerald-400" />
                            {formatDate(room.lastCleaned)}
                          </div>
                          {room.cleaningFrequency && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {room.cleaningFrequency}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-emerald-400">
                        {room.totalRevenue > 0 ? formatPrice(room.totalRevenue) : '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleBookable(room)}
                          disabled={togglingId === room.id}
                          title={room.isBookable ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                          className={`p-2 rounded-lg transition-colors ${
                            room.isBookable
                              ? 'text-green-400 bg-green-500/15 hover:bg-green-500/25'
                              : 'text-slate-400 bg-slate-500/15 hover:bg-slate-500/25'
                          } ${togglingId === room.id ? 'opacity-50' : ''}`}
                        >
                          {room.isBookable ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingRoom(room)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Διαχείριση</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingRoom && (
        <RoomEditDialog
          room={editingRoom}
          isOpen={true}
          onClose={() => setEditingRoom(null)}
          onSave={() => {
            setEditingRoom(null)
            onRoomUpdated()
          }}
        />
      )}
    </>
  )
}
