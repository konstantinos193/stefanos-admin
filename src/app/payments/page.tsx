'use client'

import { useState, useRef } from 'react'
import { PaymentsHeader } from '@/components/payments/PaymentsHeader'
import { PaymentsTable, PaymentsTableRef } from '@/components/payments/PaymentsTable'
import { PaymentsFilters } from '@/components/payments/PaymentsFilters'
import { PaymentsStats } from '@/components/payments/PaymentsStats'
import { paymentsApi } from '@/lib/api/payments'
import { downloadPaymentsCSV } from '@/lib/utils/exportPayments'
import { Payment } from '@/lib/api/payments'

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFromFilter, setDateFromFilter] = useState('')
  const [dateToFilter, setDateToFilter] = useState('')
  const [allPayments, setAllPayments] = useState<Payment[]>([])
  const paymentsTableRef = useRef<PaymentsTableRef>(null)

  const handleExport = async () => {
    try {
      const payments = allPayments.length > 0 ? allPayments : await paymentsApi.getAllForExport()
      const timestamp = new Date().toISOString().split('T')[0]
      downloadPaymentsCSV(payments, `payments_${timestamp}.csv`)
    } catch (error: any) {
      console.error('Error exporting payments:', error)
      alert(`Σφάλμα εξαγωγής: ${error.message}`)
    }
  }

  const handlePaymentsUpdate = (payments: Payment[]) => {
    setAllPayments(payments)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setMethodFilter('all')
    setDateFromFilter('')
    setDateToFilter('')
  }

  const handleRefund = async (payment: Payment) => {
    const amount = prompt(`Εισάγετε το ποσό επιστροφής (Μέγιστο: ${payment.amount} ${payment.currency}):`)
    if (!amount) return

    const refundAmount = parseFloat(amount)
    if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > payment.amount) {
      alert('Μη έγκυρο ποσό επιστροφής')
      return
    }

    const reason = prompt('Λόγος επιστροφής:')
    if (!reason) return

    try {
      await paymentsApi.refund(payment.id, refundAmount, reason)
      alert('Η επιστροφή ολοκληρώθηκε επιτυχώς')
      if (paymentsTableRef.current) {
        paymentsTableRef.current.refresh()
      }
    } catch (error: any) {
      console.error('Error processing refund:', error)
      alert(`Σφάλμα επιστροφής: ${error.message}`)
    }
  }

  // Calculate filtered payments for stats
  const getFilteredPayments = () => {
    let filtered = [...allPayments]
    if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter)
    if (methodFilter !== 'all') filtered = filtered.filter(p => p.method === methodFilter)
    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter)
      fromDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter(p => new Date(p.createdAt) >= fromDate)
    }
    if (dateToFilter) {
      const toDate = new Date(dateToFilter)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(p => new Date(p.createdAt) <= toDate)
    }
    return filtered
  }

  return (
    <div className="space-y-6">
      <PaymentsHeader onExport={handleExport} />
      
      {allPayments.length > 0 && (
        <PaymentsStats payments={getFilteredPayments()} />
      )}

      <PaymentsFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        methodFilter={methodFilter}
        dateFromFilter={dateFromFilter}
        dateToFilter={dateToFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onMethodChange={setMethodFilter}
        onDateFromChange={setDateFromFilter}
        onDateToChange={setDateToFilter}
        onClearFilters={handleClearFilters}
      />
      
      <PaymentsTable
        ref={paymentsTableRef}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        methodFilter={methodFilter}
        dateFromFilter={dateFromFilter}
        dateToFilter={dateToFilter}
        onRefund={handleRefund}
        onPaymentsUpdate={handlePaymentsUpdate}
      />
    </div>
  )
}
