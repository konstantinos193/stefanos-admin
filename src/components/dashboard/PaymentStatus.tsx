'use client'

import { CreditCard, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'

export function PaymentStatus() {
  const stats = [
    { label: 'Ολοκληρωμένες', value: 1245, color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
    { label: 'Εκκρεμείς', value: 23, color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock },
    { label: 'Αποτυχημένες', value: 5, color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
  ]

  const recentPayments = [
    { id: '1', amount: 450, guest: 'John Doe', status: 'COMPLETED', date: '2024-01-20' },
    { id: '2', amount: 320, guest: 'Jane Smith', status: 'PENDING', date: '2024-01-20' },
    { id: '3', amount: 280, guest: 'Mike Johnson', status: 'COMPLETED', date: '2024-01-19' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Κατάσταση Πληρωμών</h2>
        <CreditCard className="h-5 w-5 text-blue-500" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`${stat.bgColor} p-3 rounded-lg`}>
              <div className="flex items-center space-x-2 mb-1">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-gray-600">{stat.label}</span>
              </div>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          )
        })}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Πρόσφατες Πληρωμές</span>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        {recentPayments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              {getStatusIcon(payment.status)}
              <div>
                <p className="text-sm font-medium text-gray-900">{payment.guest}</p>
                <p className="text-xs text-gray-500">{payment.date}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">€{payment.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

