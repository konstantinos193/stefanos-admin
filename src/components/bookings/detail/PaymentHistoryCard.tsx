'use client'

import Link from 'next/link'
import { ArrowUpRight, CreditCard, Receipt } from 'lucide-react'
import { Payment } from '@/lib/api/payments'
import { formatDateTime, formatMoney } from '@/lib/bookings/booking-format'
import { getPaymentMethodLabel, getPaymentStatusPresentation } from '@/lib/bookings/booking-labels'
import { SectionTitle } from './SectionTitle'

interface PaymentHistoryCardProps {
  payments: Payment[]
}

/** Every transaction recorded against this booking, newest first. */
export function PaymentHistoryCard({ payments }: PaymentHistoryCardProps) {
  const ordered = [...payments].sort(
    (a, b) => new Date(b.processedAt || b.createdAt).getTime() - new Date(a.processedAt || a.createdAt).getTime(),
  )

  return (
    <section className="card">
      <SectionTitle
        icon={<Receipt className="h-4 w-4" />}
        title="Συναλλαγές"
        action={
          <Link
            href="/payments"
            className="flex items-center gap-1 text-xs font-semibold text-blue-400 transition-colors hover:text-blue-300"
          >
            Όλες οι πληρωμές
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {ordered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center">
          <CreditCard className="mx-auto h-6 w-6 text-slate-600" />
          <p className="mt-2 text-sm text-slate-400">Δεν έχει καταγραφεί συναλλαγή για την κράτηση.</p>
          <p className="mt-1 text-xs text-slate-500">
            Χρησιμοποιήστε «Καταχώρηση πληρωμής» όταν εισπραχθούν χρήματα στη ρεσεψιόν.
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-700/70">
          {ordered.map((payment) => {
            const status = getPaymentStatusPresentation(payment.status)
            return (
              <li key={payment.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-100">{getPaymentMethodLabel(payment.method)}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatDateTime(payment.processedAt || payment.createdAt)}
                    {payment.transactionId && ` · ${payment.transactionId.slice(-12)}`}
                  </p>
                  {!!payment.refundAmount && (
                    <p className="mt-1 text-xs text-orange-300">
                      Επιστροφή {formatMoney(payment.refundAmount, payment.currency)}
                      {payment.refundReason && ` — ${payment.refundReason}`}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-slate-50">{formatMoney(payment.amount, payment.currency)}</p>
                  <span className={`mt-1 inline-flex rounded-lg px-2 py-0.5 text-[11px] font-semibold ${status.chip}`}>
                    {status.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
