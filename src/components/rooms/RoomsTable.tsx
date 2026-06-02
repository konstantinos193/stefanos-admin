'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Pencil, Calendar, CheckCircle, XCircle, Clock,
  Sparkles, ToggleLeft, ToggleRight, Tag,
  CalendarDays, Settings, ImageIcon, LogIn,
} from 'lucide-react'
import { DashboardRoom, roomsApi } from '@/lib/api/rooms'
import { getImageUrl } from '@/lib/utils/images'
import { RoomEditDialog } from './RoomEditDialog'
import { RoomPricingDialog } from './RoomPricingDialog'
import { AvailabilityCalendar } from './AvailabilityCalendar'
import { TaxManagementDialog } from './TaxManagementDialog'

interface RoomsTableProps {
  rooms: DashboardRoom[]
  loading: boolean
  searchQuery: string
  filterType: string
  filterStatus: string
  onRoomUpdated: () => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('el-GR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
function formatPrice(p: number) {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 0,
  }).format(p)
}

export function RoomsTable({
  rooms, loading, searchQuery, filterType, filterStatus, onRoomUpdated,
}: RoomsTableProps) {
  const [editingRoom,      setEditingRoom]      = useState<DashboardRoom | null>(null)
  const [pricingRoom,      setPricingRoom]      = useState<DashboardRoom | null>(null)
  const [availabilityRoom, setAvailabilityRoom] = useState<DashboardRoom | null>(null)
  const [togglingId,       setTogglingId]       = useState<string | null>(null)

  const filtered = rooms.filter((room) => {
    const name = (room.nameGr || room.nameEn || room.name || '').toLowerCase()
    const matchesSearch  = !searchQuery  || name.includes(searchQuery.toLowerCase())
    const matchesType    = !filterType   || room.type === filterType
    const matchesStatus  =
      !filterStatus ||
      (filterStatus === 'bookable'     && room.isBookable) ||
      (filterStatus === 'unavailable'  && !room.isBookable) ||
      (filterStatus === 'occupied'     && room.isOccupied)
    return matchesSearch && matchesType && matchesStatus
  })

  async function handleToggle(room: DashboardRoom) {
    setTogglingId(room.id)
    try {
      await roomsApi.update(room.id, { isBookable: !room.isBookable })
      onRoomUpdated()
    } catch {}
    finally { setTogglingId(null) }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-40 bg-slate-700/50 rounded-xl mb-4" />
            <div className="h-5 w-40 bg-slate-700/50 rounded mb-2" />
            <div className="h-4 w-24 bg-slate-700/50 rounded mb-4" />
            <div className="h-8 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="card py-16 text-center">
        <ImageIcon className="h-12 w-12 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-400 text-lg">Δεν βρέθηκαν διαμερίσματα</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            toggling={togglingId === room.id}
            onToggle={handleToggle}
            onEdit={setEditingRoom}
            onPricing={setPricingRoom}
            onAvailability={setAvailabilityRoom}
          />
        ))}
      </div>

      {editingRoom && (
        <RoomEditDialog
          room={editingRoom}
          isOpen
          onClose={() => setEditingRoom(null)}
          onSave={() => { setEditingRoom(null); onRoomUpdated() }}
        />
      )}
      {pricingRoom && (
        <RoomPricingDialog
          room={pricingRoom}
          isOpen
          onClose={() => setPricingRoom(null)}
        />
      )}
      {availabilityRoom && (
        <AvailabilityCalendar
          roomId={availabilityRoom.id}
          roomName={availabilityRoom.nameGr || availabilityRoom.nameEn || availabilityRoom.name}
          onClose={() => setAvailabilityRoom(null)}
          onAvailabilityUpdate={onRoomUpdated}
        />
      )}
    </>
  )
}

// ── Room Card ─────────────────────────────────────────────────────────────────

interface RoomCardProps {
  room: DashboardRoom
  toggling: boolean
  onToggle: (r: DashboardRoom) => void
  onEdit: (r: DashboardRoom) => void
  onPricing: (r: DashboardRoom) => void
  onAvailability: (r: DashboardRoom) => void
}

function RoomCard({ room, toggling, onToggle, onEdit, onPricing, onAvailability }: RoomCardProps) {
  const router = useRouter()
  const [imgError, setImgError] = useState(false)
  const name = room.nameGr || room.nameEn || room.name

  return (
    <div
      className="card p-0 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-black/30 transition-shadow cursor-pointer"
      onClick={() => router.push(`/rooms/${room.id}`)}
    >
      {/* Image / placeholder */}
      {room.images && room.images.length > 0 && !imgError ? (
        <div className="relative h-44 shrink-0 overflow-hidden">
          <img
            src={getImageUrl(room.images[0])}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {room.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
              +{room.images.length - 1}
            </div>
          )}
          {/* Status overlay badge */}
          <div className="absolute top-3 left-3">
            <StatusBadge room={room} />
          </div>
        </div>
      ) : (
        <div className="h-44 shrink-0 bg-linear-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center relative">
          <ImageIcon className="h-10 w-10 text-slate-600 mb-2" />
          <p className="text-xs text-slate-600">Χωρίς εικόνα</p>
          <div className="absolute top-3 left-3">
            <StatusBadge room={room} />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Name + toggle */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-100 leading-tight">{name}</h3>
            {room.descriptionGr && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{room.descriptionGr}</p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(room) }}
            disabled={toggling}
            title={room.isBookable ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              room.isBookable
                ? 'text-green-400 hover:bg-green-500/15'
                : 'text-slate-500 hover:bg-slate-700'
            } ${toggling ? 'opacity-40' : ''}`}
          >
            {room.isBookable
              ? <ToggleRight className="h-6 w-6" />
              : <ToggleLeft className="h-6 w-6" />
            }
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-amber-400">{formatPrice(room.basePrice)}</p>
            <p className="text-xs text-slate-500 mt-0.5">ανά βράδυ</p>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-slate-100 flex items-center justify-center gap-1">
              <Users className="h-4 w-4 text-slate-400" />
              {room.capacity}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">άτομα</p>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-emerald-400">
              {room.totalRevenue > 0 ? formatPrice(room.totalRevenue) : '—'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">έσοδα</p>
          </div>
        </div>

        {/* Next booking / occupancy */}
        <div className="flex-1">
          {room.isOccupied && room.nextBooking ? (
            <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="bg-purple-500/20 p-1.5 rounded-lg shrink-0">
                <LogIn className="h-4 w-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-purple-300 truncate">
                  {room.nextBooking.guestName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDate(room.nextBooking.checkIn)} → {formatDate(room.nextBooking.checkOut)}
                </p>
              </div>
            </div>
          ) : room.nextBooking ? (
            <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div className="bg-blue-500/15 p-1.5 rounded-lg shrink-0">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                  Επόμενη κράτηση
                </p>
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {room.nextBooking.guestName}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDate(room.nextBooking.checkIn)} → {formatDate(room.nextBooking.checkOut)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-xl">
              <Sparkles className="h-4 w-4 text-slate-600" />
              <p className="text-sm text-slate-600">Χωρίς επερχόμενες κρατήσεις</p>
            </div>
          )}
        </div>

        {/* Cleaning */}
        {room.lastCleaned && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            Τελευταίος καθαρισμός: {formatDate(room.lastCleaned)}
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/50">
          <button
            onClick={(e) => { e.stopPropagation(); onAvailability(room) }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
          >
            <CalendarDays className="h-5 w-5" />
            <span className="text-xs font-semibold">Ημερολόγιο</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPricing(room) }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
          >
            <Tag className="h-5 w-5" />
            <span className="text-xs font-semibold">Τιμές</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(room) }}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
          >
            <Pencil className="h-5 w-5" />
            <span className="text-xs font-semibold">Διαχείριση</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ room }: { room: DashboardRoom }) {
  if (room.isOccupied) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-900/80 text-purple-200 backdrop-blur-sm border border-purple-500/30">
        <Clock className="h-3.5 w-3.5" />
        Κατειλημμένο
      </span>
    )
  }
  if (room.isBookable) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-green-900/80 text-green-200 backdrop-blur-sm border border-green-500/30">
        <CheckCircle className="h-3.5 w-3.5" />
        Διαθέσιμο
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-900/80 text-red-200 backdrop-blur-sm border border-red-500/30">
      <XCircle className="h-3.5 w-3.5" />
      Μη Διαθέσιμο
    </span>
  )
}

// ── Wrapper (keeps page.tsx import intact) ────────────────────────────────────

export function RoomsTableWithTaxManagement(props: RoomsTableProps) {
  const [showTaxDialog, setShowTaxDialog] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-100">Διαχείριση Διαμερισμάτων</h2>
        <button
          onClick={() => setShowTaxDialog(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-400 bg-indigo-500/15 hover:bg-indigo-500/25 rounded-xl transition-colors"
        >
          <Settings className="h-4 w-4" />
          Φορολογικές Ρυθμίσεις
        </button>
      </div>
      <RoomsTable {...props} />
      {showTaxDialog && (
        <TaxManagementDialog
          isOpen
          onClose={() => setShowTaxDialog(false)}
          onTaxUpdate={() => {}}
        />
      )}
    </>
  )
}
