'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, RefreshCw, TrendingUp, Search } from 'lucide-react'
import { apiRequest } from '@/lib/api/config'

interface ExternalBooking {
  id: string
  source: string
  externalId: string | null
  propertyId: string
  roomId: string | null
  guestName: string
  guestEmail: string | null
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  currency: string
  status: string
  syncedAt: string | null
  createdAt: string
  property?: { id: string; titleEn: string; titleGr: string }
}

interface RevenueBySource {
  source: string
  totalRevenue: number
  totalBookings: number
  averageBookingValue: number
}

const SOURCE_LABELS: Record<string, string> = {
  BOOKING_COM: 'Booking.com',
  AIRBNB: 'Airbnb',
  VRBO: 'VRBO',
  EXPEDIA: 'Expedia',
  MANUAL: 'Χειροκίνητη',
  OTHER: 'Άλλη',
  DIRECT: 'Άμεση',
}

const SOURCE_COLORS: Record<string, string> = {
  BOOKING_COM: 'bg-blue-900/40 text-blue-400',
  AIRBNB: 'bg-rose-900/40 text-rose-400',
  VRBO: 'bg-cyan-900/40 text-cyan-400',
  EXPEDIA: 'bg-yellow-900/40 text-yellow-400',
  MANUAL: 'bg-slate-700 text-slate-300',
  OTHER: 'bg-slate-700 text-slate-400',
  DIRECT: 'bg-emerald-900/40 text-emerald-400',
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-indigo-900/40 text-indigo-400',
  PENDING: 'bg-yellow-900/40 text-yellow-400',
  CANCELLED: 'bg-red-900/40 text-red-400',
  COMPLETED: 'bg-slate-700 text-slate-400',
  CHECKED_IN: 'bg-emerald-900/40 text-emerald-400',
}

export default function ExternalBookingsPage() {
  const [bookings, setBookings] = useState<ExternalBooking[]>([])
  const [revenueBySource, setRevenueBySource] = useState<RevenueBySource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterSource, setFilterSource] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (filterSource) params.set('source', filterSource)

      const [bookingsRes, revenueRes] = await Promise.all([
        apiRequest<any>(`/external-bookings?${params}`),
        apiRequest<any>('/external-bookings/revenue-by-source'),
      ])

      setBookings(bookingsRes?.data?.bookings || bookingsRes?.data || [])
      setTotal(bookingsRes?.data?.pagination?.total || bookingsRes?.data?.length || 0)
      setRevenueBySource(revenueRes?.data || [])
    } catch (e: any) {
      setError(e?.message || 'Αποτυχία φόρτωσης')
    } finally {
      setLoading(false)
    }
  }, [page, filterSource])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase()
    return (
      !q ||
      b.guestName.toLowerCase().includes(q) ||
      (b.guestEmail || '').toLowerCase().includes(q) ||
      (b.externalId || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Εξωτερικές Κρατήσεις</h1>
          <p className="text-slate-400 mt-1">Booking.com, Airbnb, VRBO και άλλες πλατφόρμες</p>
        </div>
        <button
          onClick={fetchData}
          className="btn btn-secondary flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Ανανέωση
        </button>
      </div>

      {/* Revenue by Source */}
      {revenueBySource.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {revenueBySource.map((src) => (
            <div key={src.source} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[src.source] || 'bg-slate-700 text-slate-400'}`}>
                  {SOURCE_LABELS[src.source] || src.source}
                </span>
                <TrendingUp className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-xl font-bold text-slate-100">
                €{src.totalRevenue.toLocaleString('el-GR', { minimumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{src.totalBookings} κρατήσεις</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Μ.Ο. €{Math.round(src.averageBookingValue)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση επισκέπτη ή ID..."
            className="input pl-10"
          />
        </div>
        <select
          value={filterSource}
          onChange={(e) => { setFilterSource(e.target.value); setPage(1) }}
          className="input max-w-[200px]"
        >
          <option value="">Όλες οι Πηγές</option>
          {Object.entries(SOURCE_LABELS).filter(([k]) => k !== 'DIRECT').map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Φόρτωση...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Globe className="h-10 w-10 mx-auto mb-3 text-slate-600" />
            Δεν βρέθηκαν εξωτερικές κρατήσεις
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Πηγή / ID</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Επισκέπτης</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Ακίνητο</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Ημερομηνίες</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-medium">Σύνολο</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">Κατάσταση</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[booking.source] || 'bg-slate-700 text-slate-400'}`}>
                        {SOURCE_LABELS[booking.source] || booking.source}
                      </span>
                      {booking.externalId && (
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">{booking.externalId}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200">{booking.guestName}</p>
                      {booking.guestEmail && (
                        <p className="text-xs text-slate-500">{booking.guestEmail}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-slate-300 text-xs">
                        {booking.property?.titleEn || booking.property?.titleGr || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300 text-xs">
                        {new Date(booking.checkIn).toLocaleDateString('el-GR')}
                      </p>
                      <p className="text-slate-500 text-xs">
                        → {new Date(booking.checkOut).toLocaleDateString('el-GR')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-slate-200">
                        {booking.currency} {booking.totalPrice.toLocaleString('el-GR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status] || 'bg-slate-700 text-slate-400'}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-700 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Σελίδα {page} από {totalPages} ({total} συνολικά)
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn btn-secondary text-xs py-1 px-3 disabled:opacity-50"
                  >
                    Προηγούμενη
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-secondary text-xs py-1 px-3 disabled:opacity-50"
                  >
                    Επόμενη
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
