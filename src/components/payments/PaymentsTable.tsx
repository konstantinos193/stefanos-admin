'use client'

import { useState, useEffect } from 'react'
import { paymentsApi, Payment } from '@/lib/api/payments'
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

export function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true)
        const response = await paymentsApi.getAll({ page, limit: 10 })
        setPayments(response.data?.payments || [])
      } catch (error) {
        console.error('Error fetching payments:', error)
        setPayments([])
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [page])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return <RefreshCw className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-900/30 text-green-400 border border-green-800/50'
      case 'FAILED':
        return 'bg-red-900/30 text-red-400 border border-red-800/50'
      case 'PENDING':
        return 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
      default:
        return 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      COMPLETED: 'Ολοκληρωμένη',
      FAILED: 'Αποτυχημένη',
      PENDING: 'Εκκρεμής',
      REFUNDED: 'Επιστροφή',
      PARTIALLY_REFUNDED: 'Μερική Επιστροφή',
    }
    return labels[status] || status
  }

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-400">Φόρτωση πληρωμών...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-gray-700">
            <tr>
              <th className="table-header-cell">ID</th>
              <th className="table-header-cell">Κράτηση</th>
              <th className="table-header-cell">Ποσό</th>
              <th className="table-header-cell">Μέθοδος</th>
              <th className="table-header-cell">Κατάσταση</th>
              <th className="table-header-cell">Ημερομηνία</th>
              <th className="table-header-cell text-right">Ενέργειες</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900/30 divide-y divide-gray-700">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-body-cell text-center text-gray-400">
                  Δεν βρέθηκαν πληρωμές
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="table-body-cell font-mono text-gray-400">
                    {payment.id.slice(-8)}
                  </td>
                  <td className="table-body-cell">
                    <div className="text-sm text-gray-100">
                      {payment.booking?.guestName || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {payment.property?.titleGr || payment.property?.titleEn || 'N/A'}
                    </div>
                  </td>
                  <td className="table-body-cell">
                    <div className="text-sm font-semibold text-gray-100">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    {payment.refundAmount && (
                      <div className="text-xs text-red-400">
                        Επιστροφή: {formatCurrency(payment.refundAmount, payment.currency)}
                      </div>
                    )}
                  </td>
                  <td className="table-body-cell">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-100">{payment.method}</span>
                    </div>
                  </td>
                  <td className="table-body-cell">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="table-body-cell text-gray-400">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="table-body-cell text-right">
                    {payment.status === 'COMPLETED' && (
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                        Επιστροφή
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

