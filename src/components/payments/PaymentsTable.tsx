'use client'

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { paymentsApi, Payment } from '@/lib/api/payments'
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { matchesSearch } from '@/lib/utils/textNormalization'

export interface PaymentsTableRef {
  refresh: () => void
}

interface PaymentsTableProps {
  searchQuery?: string
  statusFilter?: string
  methodFilter?: string
  dateFromFilter?: string
  dateToFilter?: string
  onRefund?: (payment: Payment) => void
  onPaymentsUpdate?: (payments: Payment[]) => void
}

// Mock data for development/testing
const mockPayments: Payment[] = [
  {
    id: 'pay_1234567890abcdef',
    bookingId: 'booking_001',
    propertyId: 'prop_001',
    amount: 450.00,
    currency: 'EUR',
    status: 'COMPLETED',
    method: 'CREDIT_CARD',
    transactionId: 'txn_1234567890',
    stripePaymentIntentId: 'pi_1234567890',
    stripeChargeId: 'ch_1234567890',
    refundAmount: null,
    refundReason: null,
    refundedAt: null,
    payoutId: null,
    payoutStatus: null,
    payoutScheduledFor: null,
    processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_001',
      guestName: 'John Smith',
      checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_001',
      titleGr: 'Σύγχρονο Διαμέρισμα στην Αθήνα',
      titleEn: 'Modern Apartment in Athens',
    },
  },
  {
    id: 'pay_2345678901bcdefg',
    bookingId: 'booking_002',
    propertyId: 'prop_002',
    amount: 1200.00,
    currency: 'EUR',
    status: 'COMPLETED',
    method: 'STRIPE_LINK',
    transactionId: 'txn_2345678901',
    stripePaymentIntentId: 'pi_2345678901',
    stripeChargeId: 'ch_2345678901',
    refundAmount: null,
    refundReason: null,
    refundedAt: null,
    payoutId: 'po_1234567890',
    payoutStatus: 'COMPLETED',
    payoutScheduledFor: null,
    processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_002',
      guestName: 'Maria Papadopoulos',
      checkIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_002',
      titleGr: 'Βίλα με Θέα στη Θάλασσα',
      titleEn: 'Villa with Sea View',
    },
  },
  {
    id: 'pay_3456789012cdefgh',
    bookingId: 'booking_003',
    propertyId: 'prop_003',
    amount: 320.50,
    currency: 'EUR',
    status: 'PENDING',
    method: 'CREDIT_CARD',
    transactionId: null,
    stripePaymentIntentId: 'pi_3456789012',
    stripeChargeId: null,
    refundAmount: null,
    refundReason: null,
    refundedAt: null,
    payoutId: null,
    payoutStatus: null,
    payoutScheduledFor: null,
    processedAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_003',
      guestName: 'Michael Brown',
      checkIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_003',
      titleGr: 'Studio στη Χανιά',
      titleEn: 'Studio in Chania',
    },
  },
  {
    id: 'pay_4567890123defghij',
    bookingId: 'booking_004',
    propertyId: 'prop_004',
    amount: 850.00,
    currency: 'EUR',
    status: 'REFUNDED',
    method: 'CREDIT_CARD',
    transactionId: 'txn_4567890123',
    stripePaymentIntentId: 'pi_4567890123',
    stripeChargeId: 'ch_4567890123',
    refundAmount: 850.00,
    refundReason: 'Guest cancellation',
    refundedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    payoutId: null,
    payoutStatus: null,
    payoutScheduledFor: null,
    processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_004',
      guestName: 'Sophia Konstantinou',
      checkIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_004',
      titleGr: 'Πολυτελές Διαμέρισμα στη Φιρά',
      titleEn: 'Luxury Apartment in Fira',
    },
  },
  {
    id: 'pay_5678901234efghijk',
    bookingId: 'booking_005',
    propertyId: 'prop_005',
    amount: 650.00,
    currency: 'EUR',
    status: 'COMPLETED',
    method: 'PAYPAL',
    transactionId: 'PP_1234567890',
    stripePaymentIntentId: null,
    stripeChargeId: null,
    refundAmount: null,
    refundReason: null,
    refundedAt: null,
    payoutId: 'po_2345678901',
    payoutStatus: 'PENDING',
    payoutScheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_005',
      guestName: 'David Wilson',
      checkIn: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_005',
      titleGr: 'Επαγγελματικός Χώρος στο Κέντρο',
      titleEn: 'Commercial Space in the Center',
    },
  },
  {
    id: 'pay_6789012345fghijkl',
    bookingId: 'booking_006',
    propertyId: 'prop_001',
    amount: 280.00,
    currency: 'EUR',
    status: 'FAILED',
    method: 'CREDIT_CARD',
    transactionId: null,
    stripePaymentIntentId: 'pi_6789012345',
    stripeChargeId: null,
    refundAmount: null,
    refundReason: null,
    refundedAt: null,
    payoutId: null,
    payoutStatus: null,
    payoutScheduledFor: null,
    processedAt: null,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_006',
      guestName: 'Anna Petrou',
      checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_001',
      titleGr: 'Σύγχρονο Διαμέρισμα στην Αθήνα',
      titleEn: 'Modern Apartment in Athens',
    },
  },
  {
    id: 'pay_7890123456ghijklm',
    bookingId: 'booking_007',
    propertyId: 'prop_006',
    amount: 950.00,
    currency: 'EUR',
    status: 'COMPLETED',
    method: 'BANK_TRANSFER',
    transactionId: 'BT_9876543210',
    stripePaymentIntentId: null,
    stripeChargeId: null,
    refundAmount: null,
    refundReason: null,
    refundedAt: null,
    payoutId: 'po_3456789012',
    payoutStatus: 'COMPLETED',
    payoutScheduledFor: null,
    processedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_007',
      guestName: 'George Dimitriou',
      checkIn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_006',
      titleGr: 'Κατοικία με Κήπο',
      titleEn: 'House with Garden',
    },
  },
  {
    id: 'pay_8901234567hijklmn',
    bookingId: 'booking_008',
    propertyId: 'prop_002',
    amount: 1500.00,
    currency: 'EUR',
    status: 'PARTIALLY_REFUNDED',
    method: 'CREDIT_CARD',
    transactionId: 'txn_8901234567',
    stripePaymentIntentId: 'pi_8901234567',
    stripeChargeId: 'ch_8901234567',
    refundAmount: 500.00,
    refundReason: 'Partial refund due to early checkout',
    refundedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    payoutId: null,
    payoutStatus: null,
    payoutScheduledFor: null,
    processedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    booking: {
      id: 'booking_008',
      guestName: 'Elena Nikolaou',
      checkIn: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      checkOut: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    property: {
      id: 'prop_002',
      titleGr: 'Βίλα με Θέα στη Θάλασσα',
      titleEn: 'Villa with Sea View',
    },
  },
]

export const PaymentsTable = forwardRef<PaymentsTableRef, PaymentsTableProps>(({ 
  searchQuery = '', 
  statusFilter = 'all', 
  methodFilter = 'all',
  dateFromFilter = '',
  dateToFilter = '',
  onRefund,
  onPaymentsUpdate
}, ref) => {
  const [allPayments, setAllPayments] = useState<Payment[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentsApi.getAll({ limit: 100 })
      const fetchedPayments = response.data?.payments || []
      // Use mock data if no real data is available
      const paymentsToUse = fetchedPayments.length > 0 ? fetchedPayments : mockPayments
      setAllPayments(paymentsToUse)
      return paymentsToUse
    } catch (error) {
      console.error('Error fetching payments:', error)
      // Use mock data on error
      setAllPayments(mockPayments)
      return mockPayments
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    if (onPaymentsUpdate && allPayments.length > 0) {
      onPaymentsUpdate(allPayments)
    }
  }, [allPayments, onPaymentsUpdate])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchPayments()
    }
  }))

  // Apply filters
  useEffect(() => {
    let filtered = [...allPayments]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    // Method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.method === methodFilter)
    }

    // Search filter (accent-insensitive and case-insensitive)
    if (searchQuery.trim()) {
      filtered = filtered.filter((payment) => {
        return (
          matchesSearch(payment.booking?.guestName || '', searchQuery) ||
          matchesSearch(payment.property?.titleGr || '', searchQuery) ||
          matchesSearch(payment.property?.titleEn || '', searchQuery) ||
          matchesSearch(payment.id, searchQuery) ||
          matchesSearch(payment.transactionId || '', searchQuery)
        )
      })
    }

    // Date range filter
    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter)
      fromDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt)
        paymentDate.setHours(0, 0, 0, 0)
        return paymentDate >= fromDate
      })
    }

    if (dateToFilter) {
      const toDate = new Date(dateToFilter)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.createdAt)
        return paymentDate <= toDate
      })
    }

    setPayments(filtered)
  }, [allPayments, searchQuery, statusFilter, methodFilter, dateFromFilter, dateToFilter])

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

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CREDIT_CARD: 'Πιστωτική Κάρτα',
      DEBIT_CARD: 'Χρεωστική Κάρτα',
      APPLE_PAY: 'Apple Pay',
      GOOGLE_PAY: 'Google Pay',
      PAYPAL: 'PayPal',
      BANK_TRANSFER: 'Τραπεζική Μεταφορά',
      STRIPE_LINK: 'Stripe Link',
    }
    return labels[method] || method
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
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ΚΡΑΤΗΣΗ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ΠΟΣΟ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ΜΕΘΟΔΟΣ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ΚΑΤΑΣΤΑΣΗ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ΗΜΕΡΟΜΗΝΙΑ
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ΕΝΕΡΓΕΙΕΣ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Δεν βρέθηκαν πληρωμές</p>
                    <p className="text-sm text-gray-400 mt-1">Δοκιμάστε να αλλάξετε τα φίλτρα</p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
                      #{payment.id.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[200px]">
                      <div className="text-sm font-semibold text-gray-900">
                        {payment.booking?.guestName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {payment.property?.titleGr || payment.property?.titleEn || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-bold text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    {payment.refundAmount && (
                      <div className="text-xs text-red-600 font-medium mt-1">
                        Επιστροφή: {formatCurrency(payment.refundAmount, payment.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{getMethodLabel(payment.method)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(payment.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {payment.status === 'COMPLETED' && (
                      <button 
                        onClick={() => onRefund?.(payment)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
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
      {payments.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Εμφάνιση <span className="font-semibold text-gray-900">{payments.length}</span> πληρωμ{payments.length === 1 ? 'ής' : 'ών'}
          </div>
        </div>
      )}
    </div>
  )
})

PaymentsTable.displayName = 'PaymentsTable'

