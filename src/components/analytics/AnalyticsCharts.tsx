'use client'

import { useEffect, useState } from 'react'
import { BarChart3, PieChart, TrendingUp, Activity, Loader2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'
import { analyticsApi, type AnalyticsPeriod, type RevenueChartData, type BookingTrendData, type UserDistributionData, type ActivityData } from '@/lib/api/analytics'

const defaultPeriod: AnalyticsPeriod = {
  period: 'MONTHLY',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function AnalyticsCharts() {
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([])
  const [bookingData, setBookingData] = useState<BookingTrendData[]>([])
  const [userDistribution, setUserDistribution] = useState<UserDistributionData[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const [revenue, bookings, users, activity] = await Promise.all([
          analyticsApi.getRevenueChartData(defaultPeriod),
          analyticsApi.getBookingTrendsData(defaultPeriod),
          analyticsApi.getUserDistributionData(),
          analyticsApi.getActivityData(defaultPeriod),
        ])

        setRevenueData(revenue)
        setBookingData(bookings)
        setUserDistribution(users)
        setActivityData(activity)
      } catch (err) {
        console.error('Failed to fetch chart data:', err)
        setError('Αποτυχία φόρτωσης γραφημάτων')
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-center h-80">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Τάσεις Εσόδων</h2>
            <p className="text-sm text-gray-600 mt-1">Μηνιαία έσοδα με την πάροδο του χρόνου</p>
          </div>
          <BarChart3 className="h-5 w-5 text-blue-500" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('el-GR', { month: 'short' })}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value ? [`€${value.toLocaleString('el-GR')}`, ''] : ['', '']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('el-GR')}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Κατανομή Χρηστών</h2>
            <p className="text-sm text-gray-600 mt-1">Χρήστες ανά κατηγορία</p>
          </div>
          <PieChart className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(data: any) => `${data.category}: ${data.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => value ? [value.toLocaleString('el-GR'), 'Χρήστες'] : ['', 'Χρήστες']} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Τάσεις Κρατήσεων</h2>
            <p className="text-sm text-gray-600 mt-1">Μοτίβα κρατήσεων με την πάροδο του χρόνου</p>
          </div>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('el-GR', { month: 'short' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleDateString('el-GR')}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="cancelled" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Επισκόπηση Δραστηριότητας</h2>
            <p className="text-sm text-gray-600 mt-1">Μετρικές δραστηριότητας συστήματος</p>
          </div>
          <Activity className="h-5 w-5 text-pink-500" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('el-GR', { month: 'short' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleDateString('el-GR')}
              />
              <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookings" fill="#EC4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

