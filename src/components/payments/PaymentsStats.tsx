'use client'

import { Payment } from '@/lib/api/payments'
import { TrendingUp, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'

interface PaymentsStatsProps {
  payments: Payment[]
}

export function PaymentsStats({ payments }: PaymentsStatsProps) {
  const totalAmount = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount - (p.refundAmount || 0)), 0)

  const pendingAmount = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)

  const completedCount = payments.filter(p => p.status === 'COMPLETED').length
  const pendingCount = payments.filter(p => p.status === 'PENDING').length
  const failedCount = payments.filter(p => p.status === 'FAILED').length
  const refundedCount = payments.filter(p => p.status === 'REFUNDED' || p.status === 'PARTIALLY_REFUNDED').length

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">Συνολικό Έσοδο</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalAmount)}</p>
            <p className="text-xs text-green-600 mt-1">{completedCount} ολοκληρωμένες</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="card bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-700">Εκκρεμείς</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">{formatCurrency(pendingAmount)}</p>
            <p className="text-xs text-yellow-600 mt-1">{pendingCount} πληρωμές</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Failed Payments */}
      <div className="card bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-700">Αποτυχημένες</p>
            <p className="text-2xl font-bold text-red-900 mt-1">{failedCount}</p>
            <p className="text-xs text-red-600 mt-1">πληρωμές</p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Refunded Payments */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Επιστροφές</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{refundedCount}</p>
            <p className="text-xs text-blue-600 mt-1">πληρωμές</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

