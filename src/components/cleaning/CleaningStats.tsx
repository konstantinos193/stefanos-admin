'use client'

import { Sparkles, Clock, CheckCircle, AlertTriangle, Star, Home } from 'lucide-react'
import { CleaningStats } from '@/lib/api/types'

interface CleaningStatsCardsProps {
  stats: CleaningStats
  loading?: boolean
}

export function CleaningStatsCards({ stats, loading }: CleaningStatsCardsProps) {
  const cards = [
    {
      title: 'Συνολικά Προγράμματα',
      value: stats.totalSchedules,
      icon: Home,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Σημερινές Εκκρεμότητες',
      value: stats.pendingToday,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Ολοκληρωμένες (Εβδομάδα)',
      value: stats.completedThisWeek,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Εκπρόθεσμες',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Μέση Βαθμολογία Καθαριότητας',
      value: stats.averageCleanlinessRating 
        ? `${stats.averageCleanlinessRating.toFixed(1)}/5.0` 
        : 'N/A',
      icon: Star,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Ακίνητα με Καθαρισμό',
      value: stats.propertiesWithCleaning,
      icon: Sparkles,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="card hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-600">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
