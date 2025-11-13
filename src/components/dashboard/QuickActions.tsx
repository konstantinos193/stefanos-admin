'use client'

import Link from 'next/link'

import { Plus, Edit, Trash2, Download, Upload, Settings, CreditCard, Star, Wrench, MessageSquare, FileText, BarChart3 } from 'lucide-react'

const actions = [
  { label: 'Προσθήκη Χρήστη', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600', href: '/users' },
  { label: 'Προσθήκη Ακινήτου', icon: Plus, color: 'bg-purple-500 hover:bg-purple-600', href: '/properties' },
  { label: 'Νέα Κράτηση', icon: Plus, color: 'bg-orange-500 hover:bg-orange-600', href: '/bookings' },
  { label: 'Πληρωμή', icon: CreditCard, color: 'bg-emerald-500 hover:bg-emerald-600', href: '/payments' },
  { label: 'Αξιολόγηση', icon: Star, color: 'bg-yellow-500 hover:bg-yellow-600', href: '/reviews' },
  { label: 'Συντήρηση', icon: Wrench, color: 'bg-red-500 hover:bg-red-600', href: '/maintenance' },
  { label: 'Μήνυμα', icon: MessageSquare, color: 'bg-blue-600 hover:bg-blue-700', href: '/messages' },
  { label: 'Αναφορά', icon: FileText, color: 'bg-cyan-500 hover:bg-cyan-600', href: '/reports' },
  { label: 'Αναλυτικά', icon: BarChart3, color: 'bg-pink-500 hover:bg-pink-600', href: '/analytics' },
  { label: 'Εξαγωγή', icon: Download, color: 'bg-green-500 hover:bg-green-600', href: '/settings' },
  { label: 'Εισαγωγή', icon: Upload, color: 'bg-indigo-500 hover:bg-indigo-600', href: '/settings' },
  { label: 'Ρυθμίσεις', icon: Settings, color: 'bg-gray-500 hover:bg-gray-600', href: '/settings' },
]

export function QuickActions() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Γρήγορες Ενέργειες</h2>
        <Settings className="h-5 w-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              href={action.href}
              className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

