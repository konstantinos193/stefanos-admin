'use client'

import Link from 'next/link'
import { ArrowLeft, RotateCw, SearchX } from 'lucide-react'

interface BookingDetailErrorProps {
  bookingId: string
  message: string | null
  onRetry: () => void
}

export function BookingDetailError({ bookingId, message, onRetry }: BookingDetailErrorProps) {
  return (
    <div className="card mx-auto max-w-lg py-14 text-center">
      <SearchX className="mx-auto h-10 w-10 text-slate-600" />
      <p className="mt-4 text-xl font-bold text-slate-100">Η κράτηση δεν φορτώθηκε</p>
      <p className="mt-2 text-sm text-slate-400">{message || `Το ID «${bookingId}» δεν αντιστοιχεί σε κράτηση.`}</p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={onRetry} className="btn btn-secondary flex items-center gap-2">
          <RotateCw className="h-4 w-4" />
          Δοκιμή ξανά
        </button>
        <Link href="/bookings" className="btn btn-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Στις κρατήσεις
        </Link>
      </div>
    </div>
  )
}
