'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { statsApi } from '@/lib/api/stats'
import { usersApi } from '@/lib/api/users'
import { bookingsApi } from '@/lib/api/bookings'

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!(localStorage.getItem('admin_token') || localStorage.getItem('token'))
}

interface StatCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: typeof Users
  color: string
  bgColor: string
}

export function StatsCards() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      // Only fetch authenticated data if user is logged in
      if (!isAuthenticated()) {
        setLoading(false)
        // Set default stats when not authenticated
        setStats([
          {
            title: 'Σύνολο Χρηστών',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Ακίνητα',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: Building2,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            title: 'Κρατήσεις',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: Calendar,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
          },
          {
            title: 'Επιβεβαιωμένες Κρατήσεις',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
          },
        ])
        return
      }

      try {
        setLoading(true)
        // Only fetch public stats (no auth required) and authenticated endpoints
        const [platformStats, usersRes, bookingsRes] = await Promise.all([
          statsApi.getPlatformStats().catch(() => ({ success: true, data: { properties: 0, happyGuests: 0, cities: 0 } })),
          usersApi.getAll(1, 1).catch(() => ({ success: true, data: { users: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } })),
          bookingsApi.getAll({ limit: 1 }).catch(() => ({ success: true, data: { bookings: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } })),
        ])

        const totalUsers = usersRes.data?.pagination?.total || 0
        const totalBookings = bookingsRes.data?.pagination?.total || 0

        const statsData: StatCard[] = [
          {
            title: 'Σύνολο Χρηστών',
            value: totalUsers.toLocaleString('el-GR'),
            change: '+0%',
            trend: 'up',
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Ακίνητα',
            value: platformStats.data.properties.toLocaleString('el-GR'),
            change: '+0%',
            trend: 'up',
            icon: Building2,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            title: 'Κρατήσεις',
            value: totalBookings.toLocaleString('el-GR'),
            change: '+0%',
            trend: 'up',
            icon: Calendar,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
          },
          {
            title: 'Επιβεβαιωμένες Κρατήσεις',
            value: platformStats.data.happyGuests.toLocaleString('el-GR'),
            change: '+0%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
          },
        ]

        setStats(statsData)
      } catch (error: any) {
        // Silently handle authentication errors - don't log them
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('401')) {
          // User not authenticated, use default stats
        } else {
          console.error('Error fetching stats:', error)
        }
        // Fallback to default stats on error
        setStats([
          {
            title: 'Σύνολο Χρηστών',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Ακίνητα',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: Building2,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            title: 'Κρατήσεις',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: Calendar,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
          },
          {
            title: 'Επιβεβαιωμένες Κρατήσεις',
            value: '0',
            change: '+0%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-20 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div key={stat.title} className="card hover:shadow-lg hover:shadow-black/20 transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <Icon className={`h-7 w-7 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div>
              <p className="text-base font-medium text-slate-400">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-100 mt-1">{stat.value}</p>
              <div className={`flex items-center gap-1.5 mt-3 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-semibold">{stat.change}</span>
                <span className="text-sm text-slate-500">από προηγ. μήνα</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

