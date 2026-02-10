'use client'

import { CreditCard, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'

export function PaymentStatus() {
  const stats = [
    { label: 'Ολοκληρωμένες', value: 1245, color: 'text-green-400', bgColor: 'bg-green-500/15', icon: CheckCircle },
    { label: 'Εκκρεμείς', value: 23, color: 'text-yellow-400', bgColor: 'bg-yellow-500/15', icon: Clock },
    { label: 'Αποτυχημένες', value: 5, color: 'text-red-400', bgColor: 'bg-red-500/15', icon: XCircle },
  ]

  const recentPayments = [
    { id: '1', amount: 450, guest: 'John Doe', status: 'COMPLETED', date: '2024-01-20' },
    { id: '2', amount: 320, guest: 'Jane Smith', status: 'PENDING', date: '2024-01-20' },
    { id: '3', amount: 280, guest: 'Mike Johnson', status: 'COMPLETED', date: '2024-01-19' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return <XCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Ολοκληρώθηκε'
      case 'PENDING': return 'Εκκρεμεί'
      default: return 'Αποτυχία'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Κατάσταση Πληρωμών</h2>
        <CreditCard className="h-5 w-5 text-blue-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`${stat.bgColor} p-5 rounded-xl`}>
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`h-6 w-6 ${stat.color}`} />
                <span className="text-base font-medium text-slate-300">{stat.label}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString('el-GR')}</p>
            </div>
          )
        })}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-300">Πρόσφατες Πληρωμές</span>
          <TrendingUp className="h-5 w-5 text-green-400" />
        </div>
        {recentPayments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              {getStatusIcon(payment.status)}
              <div>
                <p className="text-base font-semibold text-slate-100">{payment.guest}</p>
                <p className="text-sm text-slate-400">{payment.date} · {getStatusLabel(payment.status)}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-100">€{payment.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

