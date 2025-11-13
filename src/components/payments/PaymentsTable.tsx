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
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <p className="text-gray-600">Φόρτωση πληρωμών...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κράτηση</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ποσό</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Μέθοδος</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Κατάσταση</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ημερομηνία</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ενέργειες</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Δεν βρέθηκαν πληρωμές
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {payment.id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.booking?.guestName || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.property?.titleGr || payment.property?.titleEn || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    {payment.refundAmount && (
                      <div className="text-xs text-red-600">
                        Επιστροφή: {formatCurrency(payment.refundAmount, payment.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {payment.status === 'COMPLETED' && (
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
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

