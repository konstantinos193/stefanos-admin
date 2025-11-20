import { Payment } from '@/lib/api/payments'

export function paymentsToCSV(payments: Payment[]): string {
  const headers = [
    'ID',
    'Κράτηση',
    'Επισκέπτης',
    'Ακίνητο',
    'Ποσό',
    'Νόμισμα',
    'Μέθοδος',
    'Κατάσταση',
    'Transaction ID',
    'Refund Amount',
    'Refund Reason',
    'Ημερομηνία Δημιουργίας'
  ]

  const rows = payments.map((payment) => [
    payment.id,
    payment.bookingId,
    payment.booking?.guestName || '',
    payment.property?.titleGr || payment.property?.titleEn || '',
    payment.amount?.toString() || '0',
    payment.currency || 'EUR',
    payment.method,
    payment.status,
    payment.transactionId || '',
    payment.refundAmount?.toString() || '',
    payment.refundReason || '',
    new Date(payment.createdAt).toLocaleDateString('el-GR')
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return csvContent
}

export function downloadPaymentsCSV(payments: Payment[], filename: string = 'payments.csv') {
  const csv = paymentsToCSV(payments)
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

