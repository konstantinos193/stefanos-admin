'use client'

import { useEffect, useState } from 'react'
import { Calendar, BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { analyticsApi, type BookingTrendData, type AnalyticsPeriod } from '@/lib/api/analytics'

function buildSixMonthPeriod(): AnalyticsPeriod {
  const now = new Date()
  const start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
  return {
    period: 'MONTHLY',
    startDate: start.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0],
  }
}

function formatMonth(dateStr: unknown) {
  return new Date(String(dateStr)).toLocaleDateString('el-GR', { month: 'short' })
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '0.75rem',
    color: '#f1f5f9',
    fontSize: 13,
  },
  labelStyle: { color: '#94a3b8' },
}

export function BookingTrendsChart() {
  const [data, setData] = useState<BookingTrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await analyticsApi.getBookingTrendsData(buildSixMonthPeriod())
        setData(result)
      } catch (err: any) {
        if (!err?.message?.includes('Unauthorized') && !err?.message?.includes('401')) {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-purple-500/15 p-2.5 rounded-xl">
          <Calendar className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Τάσεις Κρατήσεων</h2>
          <p className="text-xs text-slate-500">Τελευταίοι 6 μήνες</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse bg-slate-700/50 rounded-xl h-[280px]" />
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[280px] text-slate-500">
          <BarChart3 className="h-10 w-10 mb-2 text-slate-700" />
          <p className="text-sm">Αδυναμία φόρτωσης γραφήματος</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[280px] text-slate-500">
          <BarChart3 className="h-10 w-10 mb-2 text-slate-700" />
          <p className="text-sm">Δεν υπάρχουν δεδομένα ακόμα</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tickFormatter={formatMonth}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              formatter={(value, name) => [
                value,
                name === 'bookings' ? 'Κρατήσεις' : 'Ακυρώσεις',
              ]}
              labelFormatter={formatMonth}
              {...tooltipStyle}
            />
            <Legend
              formatter={(value) => (value === 'bookings' ? 'Κρατήσεις' : 'Ακυρώσεις')}
              wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
            />
            <Bar dataKey="bookings" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
