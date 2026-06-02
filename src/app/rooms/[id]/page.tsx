'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, BedDouble, Users, Euro, Calendar, Sparkles,
  CheckCircle, XCircle, Clock, ToggleLeft, ToggleRight,
  CalendarDays, Tag, Pencil, ImageIcon, X,
  UserRound, PersonStanding, Baby,
} from 'lucide-react'
import { roomsApi, type DashboardRoom, type Room } from '@/lib/api/rooms'
import { getImageUrl } from '@/lib/utils/images'
import { RoomEditDialog } from '@/components/rooms/RoomEditDialog'
import { RoomPricingDialog } from '@/components/rooms/RoomPricingDialog'
import { AvailabilityCalendar } from '@/components/rooms/AvailabilityCalendar'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROOM_TYPE_LABELS: Record<string, string> = {
  BEDROOM: 'Υπνοδωμάτιο', LIVING_ROOM: 'Καθιστικό', STUDIO: 'Στούντιο',
  KITCHEN: 'Κουζίνα', BATHROOM: 'Μπάνιο', BALCONY: 'Μπαλκόνι',
  TERRACE: 'Βεράντα', GARDEN: 'Κήπος', OTHER: 'Άλλο',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatPrice(p: number) {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(p)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const [room,        setRoom]        = useState<DashboardRoom | null>(null)
  const [imgErrors,   setImgErrors]   = useState<Record<number, boolean>>({})
  const [loading,     setLoading]     = useState(true)
  const [togglingId,  setTogglingId]  = useState(false)
  const [editOpen,    setEditOpen]    = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [calOpen,     setCalOpen]     = useState(false)
  const [imgIndex,    setImgIndex]    = useState(0)

  async function fetchRoom() {
    try {
      setLoading(true)
      const res = await roomsApi.getDashboardStats()
      const found = res.data.rooms.find(r => r.id === id)
      if (found) { setRoom(found); return }
      // Fallback: plain Room without dashboard fields
      const plain = await roomsApi.getById(id)
      setRoom(plain.data as unknown as DashboardRoom)
    } catch {
      setRoom(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRoom() }, [id])

  async function handleToggle() {
    if (!room) return
    setTogglingId(true)
    try {
      await roomsApi.update(room.id, { isBookable: !room.isBookable })
      await fetchRoom()
    } catch {}
    finally { setTogglingId(false) }
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-5 w-32 bg-slate-700/50 rounded animate-pulse" />
        <div className="card animate-pulse h-56" />
        <div className="card animate-pulse h-32" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="card animate-pulse h-40" />)}
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="card text-center py-16 max-w-lg mx-auto">
        <BedDouble className="h-12 w-12 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-300 text-xl font-semibold mb-2">Δωμάτιο δεν βρέθηκε</p>
        <Link href="/rooms" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-4">
          <ArrowLeft className="h-4 w-4" />Επιστροφή στα Δωμάτια
        </Link>
      </div>
    )
  }

  const name = room.nameGr || room.nameEn || room.name
  const images = room.images ?? []

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <Link href="/rooms" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-base">
        <ArrowLeft className="h-5 w-5" />
        Επιστροφή στα Δωμάτια
      </Link>

      {/* Image gallery */}
      {images.length > 0 && !imgErrors[imgIndex] ? (
        <div className="relative rounded-2xl overflow-hidden h-64">
          <img
            src={getImageUrl(images[imgIndex])}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgErrors(prev => ({ ...prev, [imgIndex]: true }))}
          />
          {images.length > 1 && (
            <>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >‹</button>
              <button
                onClick={() => setImgIndex(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >›</button>
            </>
          )}
        </div>
      ) : (
        <div className="h-48 rounded-2xl bg-linear-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center">
          <ImageIcon className="h-12 w-12 text-slate-600 mb-2" />
          <p className="text-slate-600 text-sm">Χωρίς εικόνες</p>
        </div>
      )}

      {/* Header card */}
      <div className="card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {room.isOccupied ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
                  <Clock className="h-4 w-4" />Κατειλημμένο
                </span>
              ) : room.isBookable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-green-500/15 text-green-400 border border-green-500/20">
                  <CheckCircle className="h-4 w-4" />Διαθέσιμο
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
                  <XCircle className="h-4 w-4" />Μη Διαθέσιμο
                </span>
              )}
              <span className="text-sm text-slate-500">
                {ROOM_TYPE_LABELS[room.type] ?? room.type}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleToggle}
              disabled={togglingId}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                room.isBookable
                  ? 'text-green-400 bg-green-500/15 hover:bg-green-500/25'
                  : 'text-slate-400 bg-slate-700 hover:bg-slate-600'
              } ${togglingId ? 'opacity-50' : ''}`}
            >
              {room.isBookable
                ? <><ToggleRight className="h-5 w-5" />Ενεργό</>
                : <><ToggleLeft className="h-5 w-5" />Ανενεργό</>
              }
            </button>
            <button
              onClick={() => setCalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-purple-400 bg-purple-500/15 hover:bg-purple-500/25 rounded-xl transition-colors"
            >
              <CalendarDays className="h-5 w-5" />Ημερολόγιο
            </button>
            <button
              onClick={() => setPricingOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 rounded-xl transition-colors"
            >
              <Tag className="h-5 w-5" />Τιμές
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 rounded-xl transition-colors"
            >
              <Pencil className="h-5 w-5" />Επεξεργασία
            </button>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Χωρητικότητα */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-blue-500/15 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Χωρητικότητα</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Μέγιστη χωρητικότητα</span>
              <span className="text-base font-bold text-slate-100">{room.capacity} άτομα</span>
            </div>
            {room.maxAdults != null && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <UserRound className="h-3.5 w-3.5" />Ενήλικες
                </span>
                <span className="text-sm font-semibold text-blue-400">{room.maxAdults}</span>
              </div>
            )}
            {room.maxChildren != null && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <PersonStanding className="h-3.5 w-3.5" />Παιδιά
                </span>
                <span className="text-sm font-semibold text-green-400">{room.maxChildren}</span>
              </div>
            )}
            {room.maxInfants != null && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Baby className="h-3.5 w-3.5" />Βρέφη
                </span>
                <span className="text-sm font-semibold text-purple-400">{room.maxInfants}</span>
              </div>
            )}
          </div>
        </div>

        {/* Τιμολόγηση */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-amber-500/15 p-2 rounded-lg">
              <Euro className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Τιμολόγηση</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Βασική τιμή / βράδυ</span>
              <span className="text-2xl font-bold text-amber-400">{formatPrice(room.basePrice)}</span>
            </div>
            {(room as DashboardRoom).totalRevenue != null && (
              <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                <span className="text-sm text-slate-400">Συνολικά έσοδα</span>
                <span className="text-base font-bold text-emerald-400">
                  {(room as DashboardRoom).totalRevenue > 0
                    ? formatPrice((room as DashboardRoom).totalRevenue)
                    : '—'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Κρατήσεις */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-orange-500/15 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Κρατήσεις</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Επερχόμενες κρατήσεις</span>
              <span className="text-2xl font-bold text-slate-100">
                {(room as DashboardRoom).upcomingBookingsCount ?? '—'}
              </span>
            </div>
            {(room as DashboardRoom).nextBooking && (
              <div className="mt-3 p-3 bg-slate-800/60 rounded-xl space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Επόμενη κράτηση</p>
                <p className="text-base font-semibold text-slate-100">
                  {(room as DashboardRoom).nextBooking!.guestName}
                </p>
                <p className="text-sm text-slate-400">
                  {formatDate((room as DashboardRoom).nextBooking!.checkIn)} →{' '}
                  {formatDate((room as DashboardRoom).nextBooking!.checkOut)}
                </p>
                <p className="text-xs text-slate-500">
                  {(room as DashboardRoom).nextBooking!.guests} επισκέπτες
                </p>
              </div>
            )}
            {!(room as DashboardRoom).nextBooking && (
              <p className="text-sm text-slate-600 italic">Χωρίς επερχόμενες κρατήσεις</p>
            )}
          </div>
        </div>

        {/* Καθαριότητα */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-emerald-500/15 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Καθαριότητα</h3>
          </div>
          <div className="space-y-3">
            {(room as DashboardRoom).lastCleaned ? (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Τελευταίος καθαρισμός</span>
                <span className="text-sm font-semibold text-slate-200">
                  {formatDate((room as DashboardRoom).lastCleaned!)}
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-600 italic">Χωρίς ιστορικό καθαρισμού</p>
            )}
            {(room as DashboardRoom).nextCleaning && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Επόμενος καθαρισμός</span>
                <span className="text-sm font-semibold text-slate-200">
                  {formatDate((room as DashboardRoom).nextCleaning!)}
                </span>
              </div>
            )}
            {(room as DashboardRoom).cleaningFrequency && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Συχνότητα</span>
                <span className="text-sm font-semibold text-slate-200">
                  {(room as DashboardRoom).cleaningFrequency}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {(room.descriptionGr || room.descriptionEn) && (
        <div className="card">
          <h3 className="text-base font-bold text-slate-100 mb-3">Περιγραφή</h3>
          <p className="text-slate-300 leading-relaxed">
            {room.descriptionGr || room.descriptionEn}
          </p>
        </div>
      )}

      {/* Amenities */}
      {room.amenities && room.amenities.length > 0 && (
        <div className="card">
          <h3 className="text-base font-bold text-slate-100 mb-4">Παροχές</h3>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="px-3 py-1.5 text-sm font-medium bg-slate-700/60 text-slate-300 rounded-xl border border-slate-700/50"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-sm text-slate-600">
        Δημιουργήθηκε: {formatDate(room.createdAt)} · Ενημερώθηκε: {formatDate(room.updatedAt)}
      </p>

      {/* Dialogs */}
      {editOpen && (
        <RoomEditDialog
          room={room}
          isOpen
          onClose={() => setEditOpen(false)}
          onSave={() => { setEditOpen(false); fetchRoom() }}
        />
      )}
      {pricingOpen && (
        <RoomPricingDialog
          room={room}
          isOpen
          onClose={() => setPricingOpen(false)}
        />
      )}
      {calOpen && (
        <AvailabilityCalendar
          roomId={room.id}
          roomName={name}
          onClose={() => setCalOpen(false)}
          onAvailabilityUpdate={fetchRoom}
        />
      )}
    </div>
  )
}
