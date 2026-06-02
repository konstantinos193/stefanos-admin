'use client'

import { useEffect, useState } from 'react'
import { Sun, DoorOpen, LogOut, Users } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'

type Tab = 'arrivals' | 'departures'

export function TodaysActivity() {
  const [arrivals, setArrivals] = useState<Booking[]>([])
  const [departures, setDepartures] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('arrivals')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const today = new Date().toISOString().split('T')[0]
        const [confirmedRes, checkedInRes] = await Promise.all([
          bookingsApi.getAll({ status: 'CONFIRMED', limit: 20 }),
          bookingsApi.getAll({ status: 'CHECKED_IN', limit: 20 }),
        ])
        const todayArrivals = confirmedRes.data.bookings.filter((b) =>
          b.checkIn.startsWith(today),
        )
        const todayDepartures = checkedInRes.data.bookings.filter((b) =>
          b.checkOut.startsWith(today),
        )
        setArrivals(todayArrivals)
        setDepartures(todayDepartures)
      } catch (error: any) {
        if (!error?.message?.includes('Unauthorized') && !error?.message?.includes('401')) {
          console.error('Error fetching today activity:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [])

  const current = activeTab === 'arrivals' ? arrivals : departures
  const emptyMsg = activeTab === 'arrivals'
    ? 'Δεν υπάρχουν αφίξεις σήμερα'
    : 'Δεν υπάρχουν αναχωρήσεις σήμερα'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/15 p-2.5 rounded-xl">
            <Sun className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Δραστηριότητα Σήμερα</h2>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'arrivals'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
          }`}
        >
          <DoorOpen className="h-4 w-4" />
          Αφίξεις
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
            activeTab === 'arrivals' ? 'bg-emerald-500/30' : 'bg-slate-700'
          }`}>
            {loading ? '–' : arrivals.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('departures')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'departures'
              ? 'bg-orange-500/20 text-orange-400'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
          }`}
        >
          <LogOut className="h-4 w-4" />
          Αναχωρήσεις
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
            activeTab === 'departures' ? 'bg-orange-500/30' : 'bg-slate-700'
          }`}>
            {loading ? '–' : departures.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-14 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      ) : current.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <DoorOpen className="h-8 w-8 mb-2 text-slate-700" />
          <p className="text-sm">{emptyMsg}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {current.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {activeTab === 'arrivals'
                  ? <DoorOpen className="h-4 w-4 text-emerald-400 shrink-0" />
                  : <LogOut className="h-4 w-4 text-orange-400 shrink-0" />
                }
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{booking.guestName}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {booking.property?.titleGr ?? booking.property?.titleEn ?? 'Ακίνητο'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <div className="flex items-center gap-1 text-slate-500">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">{booking.guests}</span>
                </div>
                <span className="text-sm font-semibold text-slate-100">
                  €{Number(booking.totalPrice).toLocaleString('el-GR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
