'use client'

import { useEffect, useState } from 'react'
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { paymentsApi, type Payment } from '@/lib/api/payments'
import { format } from 'date-fns'
import { el } from 'date-fns/locale'

export function PaymentStatus() {
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const [recentRes, pendingRes, failedRes] = await Promise.all([
          paymentsApi.getAll({ limit: 5 }),
          paymentsApi.getAll({ status: 'PENDING', limit: 1 }),
          paymentsApi.getAll({ status: 'FAILED', limit: 1 }),
        ])
        setRecentPayments(recentRes.data.payments)
        setPendingCount(pendingRes.data.pagination.total)
        setFailedCount(failedRes.data.pagination.total)
      } catch (error: any) {
        if (!error?.message?.includes('Unauthorized') && !error?.message?.includes('401')) {
          console.error('Error fetching payments:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

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
      case 'REFUNDED': return 'Επιστράφηκε'
      case 'PARTIALLY_REFUNDED': return 'Μερική Επιστροφή'
      default: return 'Αποτυχία'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">Κατάσταση Πληρωμών</h2>
          <CreditCard className="h-5 w-5 text-blue-400" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-slate-100">Κατάσταση Πληρωμών</h2>
        </div>
        <Link href="/payments" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Δείτε όλες →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-yellow-500/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-slate-300">Εκκρεμείς</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{pendingCount.toLocaleString('el-GR')}</p>
        </div>
        <div className="bg-red-500/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-slate-300">Αποτυχημένες</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{failedCount.toLocaleString('el-GR')}</p>
        </div>
      </div>

      {recentPayments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-slate-500">
          <CreditCard className="h-8 w-8 mb-2 text-slate-700" />
          <p className="text-sm">Δεν υπάρχουν πληρωμές ακόμα</p>
        </div>
      ) : (
        <div className="space-y-3">
          <span className="text-sm font-semibold text-slate-300">Πρόσφατες Πληρωμές</span>
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {getStatusIcon(payment.status)}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">
                    {payment.booking?.guestName ?? 'Επισκέπτης'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(payment.createdAt), 'd MMM', { locale: el })} · {getStatusLabel(payment.status)}
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-100 shrink-0 ml-2">
                €{Number(payment.amount).toLocaleString('el-GR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
