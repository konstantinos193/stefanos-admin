'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import { adminApi } from '@/lib/api/admin'
import { AdminRecentBooking, AdminRecentUser } from '@/lib/api/types'

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING:   { label: 'Εκκρεμής',       className: 'bg-yellow-500/15 text-yellow-400' },
  CONFIRMED: { label: 'Επιβεβαιωμένη',  className: 'bg-green-500/15 text-green-400' },
  ACTIVE:    { label: 'Ενεργή',         className: 'bg-blue-500/15 text-blue-400' },
  COMPLETED: { label: 'Ολοκληρώθηκε',  className: 'bg-slate-500/15 text-slate-400' },
  CANCELLED: { label: 'Ακυρώθηκε',      className: 'bg-red-500/15 text-red-400' },
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN:          'Διαχειριστής',
  MANAGER:        'Διευθυντής',
  PROPERTY_OWNER: 'Ιδιοκτήτης',
  USER:           'Χρήστης',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function RecentActivity() {
  const [recentBookings, setRecentBookings] = useState<AdminRecentBooking[]>([])
  const [recentUsers, setRecentUsers] = useState<AdminRecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboardStats()
      .then((res) => {
        setRecentBookings(res.recentBookings ?? [])
        setRecentUsers(res.recentUsers ?? [])
      })
      .catch((err) => {
        if (!err?.message?.includes('Unauthorized') && !err?.message?.includes('401')) {
          console.error('RecentActivity fetch error:', err)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[0, 1].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-40 mb-5" />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="h-14 bg-slate-700/50 rounded-xl mb-2" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Recent Bookings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/15 p-2.5 rounded-xl">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Πρόσφατες Κρατήσεις</h3>
          </div>
          <Link href="/bookings" className="text-xs text-slate-400 hover:text-orange-400 transition-colors">
            Όλες →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Δεν υπάρχουν κρατήσεις</p>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => {
              const status = STATUS_STYLES[b.status] ?? { label: b.status, className: 'bg-slate-500/15 text-slate-400' }
              const guestName = b.guest?.name ?? b.guestName ?? '—'
              const propertyName = b.property?.titleGr ?? b.property?.titleEn ?? '—'
              return (
                <Link
                  key={b.id}
                  href={`/bookings/${b.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-orange-500/20 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 group-hover:text-orange-300 transition-colors truncate">
                      {guestName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{propertyName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>
                      {status.label}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {fmtDate(b.checkIn)} – {fmtDate(b.checkOut)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/15 p-2.5 rounded-xl">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Νέοι Χρήστες</h3>
          </div>
          <Link href="/users" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
            Όλοι →
          </Link>
        </div>

        {recentUsers.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Δεν υπάρχουν νέοι χρήστες</p>
        ) : (
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <Link
                key={u.id}
                href={`/users/${u.id}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-blue-500/20 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                    {u.name ?? u.email}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{fmtDate(u.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
