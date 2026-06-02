'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { analyticsApi, type RevenueChartData, type AnalyticsPeriod } from '@/lib/api/analytics'

type PeriodKey = '3μ' | '6μ' | '12μ'

const PERIODS: Record<PeriodKey, number> = { '3μ': 90, '6μ': 180, '12μ': 365 }

function buildPeriod(days: number): AnalyticsPeriod {
  const now = new Date()
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
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

export function RevenueChart() {
  const [data, setData] = useState<RevenueChartData[]>([])
  const [activePeriod, setActivePeriod] = useState<PeriodKey>('6μ')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(false)
      try {
        const result = await analyticsApi.getRevenueChartData(buildPeriod(PERIODS[activePeriod]))
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
  }, [activePeriod])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/15 p-2.5 rounded-xl">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Τάσεις Εσόδων</h2>
            <p className="text-xs text-slate-500">Μηνιαία επισκόπηση</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl p-1">
          {(Object.keys(PERIODS) as PeriodKey[]).map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activePeriod === p
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
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
          <p className="text-sm">Δεν υπάρχουν δεδομένα για αυτή την περίοδο</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dashProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tickFormatter={formatMonth}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(value, name) => [
                `€${Number(value).toLocaleString('el-GR')}`,
                name === 'revenue' ? 'Έσοδα' : 'Κέρδος',
              ]}
              labelFormatter={formatMonth}
              {...tooltipStyle}
            />
            <Legend
              formatter={(value) => (value === 'revenue' ? 'Έσοδα' : 'Κέρδος')}
              wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#dashRevenue)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#dashProfit)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
