'use client'

import { BarChart3, PieChart, TrendingUp, Activity, Inbox } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'
import type {
  AnalyticsPeriod,
  RevenueChartData,
  BookingTrendData,
  UserDistributionData,
  ActivityData,
} from '@/lib/api/analytics'
import { ChartTooltip } from './ChartTooltip'
import {
  SERIES,
  CHART_CHROME,
  formatBucketLabel,
  formatBucketTooltipLabel,
  formatCurrency,
  formatCurrencyTick,
  isAllZero,
} from './analyticsTheme'

interface AnalyticsChartsProps {
  period: AnalyticsPeriod
  revenueData: RevenueChartData[]
  bookingData: BookingTrendData[]
  userDistribution: UserDistributionData[]
  activityData: ActivityData[]
  loading: boolean
  refreshing?: boolean
}

const axisTick = { fontSize: 12, fill: CHART_CHROME.tick }

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconClass,
  children,
}: {
  title: string
  subtitle: string
  icon: typeof BarChart3
  iconClass: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-100">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <Icon className={`h-4 w-4 flex-shrink-0 ${iconClass}`} />
      </div>
      {/* Height covers plot + x-axis band + legend so nothing gets clipped. */}
      <div className="h-72">{children}</div>
    </div>
  )
}

function NoData({ message }: { message: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <Inbox className="h-8 w-8 text-slate-600" />
      <p className="mt-3 text-sm text-slate-400">{message}</p>
      <p className="mt-1 text-xs text-slate-500">Δοκιμάστε μεγαλύτερο χρονικό διάστημα.</p>
    </div>
  )
}

const legendStyle = { fontSize: 12, color: CHART_CHROME.tick, paddingTop: 8 }

function legendLabel(value: string) {
  return <span className="text-xs text-slate-300">{value}</span>
}

export function AnalyticsCharts({
  period,
  revenueData,
  bookingData,
  userDistribution,
  activityData,
  loading,
  refreshing,
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-800/60 border border-slate-700 p-5 animate-pulse"
          >
            <div className="h-4 w-40 bg-slate-700/60 rounded" />
            <div className="mt-2 h-3 w-56 bg-slate-700/40 rounded" />
            <div className="mt-5 h-72 bg-slate-700/30 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  const bucketLabel = (value: string) => formatBucketLabel(value, period.period)
  const tooltipLabel = (value: string) => formatBucketTooltipLabel(value, period.period)

  return (
    // Hold the previous render at reduced opacity while refetching — no skeleton flash.
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-200 ${
        refreshing ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <ChartCard
        title="Τάσεις Εσόδων"
        subtitle="Έσοδα και καθαρό κέρδος ανά περίοδο"
        icon={BarChart3}
        iconClass="text-blue-400"
      >
        {isAllZero(revenueData, ['revenue', 'profit']) ? (
          <NoData message="Δεν υπάρχουν έσοδα σε αυτό το διάστημα" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SERIES.slot1} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={SERIES.slot1} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={SERIES.slot3} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={SERIES.slot3} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART_CHROME.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tick={axisTick}
                tickLine={false}
                axisLine={{ stroke: CHART_CHROME.axis }}
                tickFormatter={bucketLabel}
                minTickGap={24}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={formatCurrencyTick}
              />
              <Tooltip
                cursor={{ stroke: CHART_CHROME.cursorLine, strokeWidth: 1 }}
                content={
                  <ChartTooltip
                    labelFormatter={tooltipLabel}
                    valueFormatter={(value) => formatCurrency(value)}
                    seriesNames={{ revenue: 'Έσοδα', profit: 'Καθαρό κέρδος' }}
                  />
                }
              />
              <Legend wrapperStyle={legendStyle} formatter={legendLabel} iconType="circle" />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Έσοδα"
                stroke={SERIES.slot1}
                fill="url(#fillRevenue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Καθαρό κέρδος"
                stroke={SERIES.slot3}
                fill="url(#fillProfit)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Κατανομή Χρηστών"
        subtitle="Χρήστες ανά κατηγορία"
        icon={PieChart}
        iconClass="text-green-400"
      >
        {userDistribution.length === 0 ? (
          <NoData message="Δεν υπάρχουν χρήστες" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="45%"
                innerRadius={48}
                outerRadius={84}
                paddingAngle={2}
                dataKey="count"
                nameKey="category"
                stroke="#1e293b"
                strokeWidth={2}
              >
                {userDistribution.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={[SERIES.slot1, SERIES.slot2, SERIES.slot3][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={
                  <ChartTooltip
                    valueFormatter={(value) => `${value.toLocaleString('el-GR')} χρήστες`}
                  />
                }
              />
              <Legend wrapperStyle={legendStyle} formatter={legendLabel} iconType="circle" />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Τάσεις Κρατήσεων"
        subtitle="Κρατήσεις και ακυρώσεις ανά περίοδο"
        icon={TrendingUp}
        iconClass="text-orange-400"
      >
        {isAllZero(bookingData, ['bookings', 'cancelled']) ? (
          <NoData message="Δεν υπάρχουν κρατήσεις σε αυτό το διάστημα" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_CHROME.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tick={axisTick}
                tickLine={false}
                axisLine={{ stroke: CHART_CHROME.axis }}
                tickFormatter={bucketLabel}
                minTickGap={24}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                width={40}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ stroke: CHART_CHROME.cursorLine, strokeWidth: 1 }}
                content={
                  <ChartTooltip
                    labelFormatter={tooltipLabel}
                    seriesNames={{ bookings: 'Κρατήσεις', cancelled: 'Ακυρώσεις' }}
                  />
                }
              />
              <Legend wrapperStyle={legendStyle} formatter={legendLabel} iconType="circle" />
              <Line
                type="monotone"
                dataKey="bookings"
                name="Κρατήσεις"
                stroke={SERIES.slot1}
                strokeWidth={2}
                dot={{ fill: SERIES.slot1, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                name="Ακυρώσεις"
                stroke={SERIES.slot2}
                strokeWidth={2}
                dot={{ fill: SERIES.slot2, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#1e293b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Επισκόπηση Δραστηριότητας"
        subtitle="Νέοι χρήστες και κρατήσεις ανά περίοδο"
        icon={Activity}
        iconClass="text-cyan-400"
      >
        {isAllZero(activityData, ['users', 'bookings']) ? (
          <NoData message="Δεν υπάρχει δραστηριότητα σε αυτό το διάστημα" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid stroke={CHART_CHROME.grid} vertical={false} />
              <XAxis
                dataKey="time"
                tick={axisTick}
                tickLine={false}
                axisLine={{ stroke: CHART_CHROME.axis }}
                tickFormatter={bucketLabel}
                minTickGap={24}
              />
              <YAxis
                tick={axisTick}
                tickLine={false}
                axisLine={false}
                width={40}
                allowDecimals={false}
              />
              {/* The default cursor is a light grey block that covers the card on dark. */}
              <Tooltip
                cursor={{ fill: CHART_CHROME.cursorFill }}
                content={
                  <ChartTooltip
                    labelFormatter={tooltipLabel}
                    seriesNames={{ users: 'Νέοι χρήστες', bookings: 'Κρατήσεις' }}
                  />
                }
              />
              <Legend wrapperStyle={legendStyle} formatter={legendLabel} iconType="circle" />
              <Bar dataKey="users" name="Νέοι χρήστες" fill={SERIES.slot1} radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="bookings"
                name="Κρατήσεις"
                fill={SERIES.slot2}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  )
}
