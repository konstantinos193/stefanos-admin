'use client'

import { useState, useEffect, useCallback } from 'react'
import { paymentsApi, Payment } from '@/lib/api/payments'
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw, ChevronLeft, ChevronRight, Calendar, Send } from 'lucide-react'

type ModalType = 'refund' | 'schedule-payout' | 'mark-payout-sent' | null

interface PendingAction {
  type: ModalType
  payment: Payment
}

interface PaymentQueryParams {
  limit?: number
  page?: number
  search?: string
  status?: string
  method?: string
  dateFrom?: string
  dateTo?: string
}

interface PaymentsTableProps {
  filters: PaymentQueryParams
}

export function PaymentsTable({ filters }: PaymentsTableProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [payoutDate, setPayoutDate] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await paymentsApi.getAll({ 
        page: filters.page || page, 
        limit: filters.limit || 10,
        search: filters.search,
        status: filters.status,
        method: filters.method,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      })
      setPayments(response.data?.payments || [])
      setTotalPages(response.data?.pagination?.totalPages || 1)
      setTotal(response.data?.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const openModal = (type: ModalType, payment: Payment) => {
    setRefundAmount(payment.amount.toString())
    setRefundReason('')
    setPayoutDate('')
    setActionError('')
    setPending({ type, payment })
  }

  const closeModal = () => {
    setPending(null)
    setActionError('')
  }

  const confirmAction = async () => {
    if (!pending) return
    setActionLoading(true)
    setActionError('')
    try {
      if (pending.type === 'refund') {
        const amount = parseFloat(refundAmount)
        if (isNaN(amount) || amount <= 0) throw new Error('Μη έγκυρο ποσό')
        await paymentsApi.refund(pending.payment.id, amount, refundReason)
      } else if (pending.type === 'schedule-payout') {
        if (!payoutDate) throw new Error('Επιλέξτε ημερομηνία')
        await paymentsApi.schedulePayout(pending.payment.id, payoutDate)
      } else if (pending.type === 'mark-payout-sent') {
        await paymentsApi.markPayoutSent(pending.payment.id)
      }
      closeModal()
      fetchPayments()
    } catch (err: any) {
      setActionError(err?.message || 'Σφάλμα. Δοκιμάστε ξανά.')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-400" />
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-400" />
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED': return <RefreshCw className="h-4 w-4 text-blue-400" />
      default: return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-900/30 text-green-400 border border-green-800/50'
      case 'FAILED': return 'bg-red-900/30 text-red-400 border border-red-800/50'
      case 'PENDING': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED': return 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
      default: return 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
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

  const getPayoutStatusLabel = (status: string | null) => {
    if (!status) return null
    const labels: Record<string, string> = {
      SCHEDULED: 'Προγραμματισμένη',
      PAID: 'Αποστάλθηκε',
    }
    return labels[status] || status
  }

  const formatCurrency = (amount: number, currency: string = 'EUR') =>
    new Intl.NumberFormat('el-GR', { style: 'currency', currency }).format(amount)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('el-GR', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const formatDateOnly = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('el-GR', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  const modalTitle = () => {
    switch (pending?.type) {
      case 'refund': return 'Επιστροφή Χρημάτων'
      case 'schedule-payout': return 'Προγραμματισμός Πληρωμής'
      case 'mark-payout-sent': return 'Επιβεβαίωση Αποστολής'
      default: return ''
    }
  }

  const confirmLabel = () => {
    switch (pending?.type) {
      case 'refund': return 'Επιστροφή'
      case 'schedule-payout': return 'Προγραμματισμός'
      case 'mark-payout-sent': return 'Επιβεβαίωση'
      default: return 'Επιβεβαίωση'
    }
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-slate-400">Φόρτωση πληρωμών...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Κράτηση</th>
                <th className="table-header-cell">Ποσό</th>
                <th className="table-header-cell">Μέθοδος</th>
                <th className="table-header-cell">Κατάσταση</th>
                <th className="table-header-cell">Payout</th>
                <th className="table-header-cell">Ημερομηνία</th>
                <th className="table-header-cell text-right">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900/30 divide-y divide-slate-700">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-body-cell text-center text-slate-400">
                    Δεν βρέθηκαν πληρωμές
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="table-body-cell font-mono text-slate-400">
                      {payment.id.slice(-8)}
                    </td>
                    <td className="table-body-cell">
                      <div className="text-sm text-slate-100">
                        {payment.booking?.guestName || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {payment.property?.titleGr || payment.property?.titleEn || 'N/A'}
                      </div>
                    </td>
                    <td className="table-body-cell">
                      <div className="text-sm font-semibold text-slate-100">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      {payment.refundAmount != null && payment.refundAmount > 0 && (
                        <div className="text-xs text-red-400">
                          Επιστροφή: {formatCurrency(payment.refundAmount, payment.currency)}
                        </div>
                      )}
                    </td>
                    <td className="table-body-cell">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-100">{payment.method}</span>
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
                    <td className="table-body-cell">
                      {payment.payoutStatus ? (
                        <div>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${payment.payoutStatus === 'PAID' ? 'bg-green-900/30 text-green-400' : 'bg-orange-900/30 text-orange-400'}`}>
                            {getPayoutStatusLabel(payment.payoutStatus)}
                          </span>
                          {payment.payoutScheduledFor && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {formatDateOnly(payment.payoutScheduledFor)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>
                    <td className="table-body-cell text-slate-400 text-sm">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="table-body-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === 'COMPLETED' && (
                          <button
                            onClick={() => openModal('refund', payment)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 rounded transition-colors"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Επιστροφή
                          </button>
                        )}
                        {payment.status === 'COMPLETED' && !payment.payoutStatus && (
                          <button
                            onClick={() => openModal('schedule-payout', payment)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-400 hover:text-orange-300 bg-orange-900/20 hover:bg-orange-900/40 rounded transition-colors"
                          >
                            <Calendar className="h-3 w-3" />
                            Πρόγραμμα
                          </button>
                        )}
                        {payment.payoutStatus === 'SCHEDULED' && (
                          <button
                            onClick={() => openModal('mark-payout-sent', payment)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/40 rounded transition-colors"
                          >
                            <Send className="h-3 w-3" />
                            Αποστολή
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Σύνολο: {total} πληρωμές
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-slate-400" />
              </button>
              <span className="text-sm text-slate-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{modalTitle()}</h3>
            <p className="text-sm text-slate-400 mb-4">
              Πληρωμή #{pending.payment.id.slice(-8)} —{' '}
              {pending.payment.booking?.guestName || 'N/A'} —{' '}
              {formatCurrency(pending.payment.amount, pending.payment.currency)}
            </p>

            {pending.type === 'refund' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ποσό Επιστροφής ({pending.payment.currency})</label>
                  <input
                    type="number"
                    min="0.01"
                    max={pending.payment.amount}
                    step="0.01"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Λόγος (προαιρετικό)</label>
                  <input
                    type="text"
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                    placeholder="π.χ. Αίτημα πελάτη"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-yellow-400">
                  Η επιστροφή θα γίνει μέσω Stripe εάν υπάρχει charge ID.
                </p>
              </div>
            )}

            {pending.type === 'schedule-payout' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Ημερομηνία Πληρωμής</label>
                  <input
                    type="date"
                    value={payoutDate}
                    onChange={e => setPayoutDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Ποσό: {formatCurrency(pending.payment.amount, pending.payment.currency)}
                </p>
              </div>
            )}

            {pending.type === 'mark-payout-sent' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  Επιβεβαιώνετε ότι η πληρωμή{' '}
                  <strong>{formatCurrency(pending.payment.amount, pending.payment.currency)}</strong>{' '}
                  έχει αποσταλεί στον ιδιοκτήτη;
                </p>
                {pending.payment.payoutScheduledFor && (
                  <p className="text-xs text-gray-500">
                    Προγραμματισμένη: {formatDateOnly(pending.payment.payoutScheduledFor)}
                  </p>
                )}
              </div>
            )}

            {actionError && (
              <p className="mt-3 text-sm text-red-400">{actionError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Ακύρωση
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                  pending.type === 'refund'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : pending.type === 'schedule-payout'
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {actionLoading ? 'Επεξεργασία...' : confirmLabel()}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
