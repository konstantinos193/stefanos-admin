'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { calculateBalance, getAvailableActions, getStayProgress, BookingActionType } from '@/lib/bookings/booking-rules'
import { EditBookingDialog } from '@/components/bookings/EditBookingDialog'
import { DeleteBookingDialog } from '@/components/bookings/DeleteBookingDialog'
import { BookingActionDialog } from '@/components/bookings/detail/BookingActionDialog'
import { BookingDetailError } from '@/components/bookings/detail/BookingDetailError'
import { BookingDetailHeader } from '@/components/bookings/detail/BookingDetailHeader'
import { BookingDetailSkeleton } from '@/components/bookings/detail/BookingDetailSkeleton'
import { BookingMetaCard } from '@/components/bookings/detail/BookingMetaCard'
import { ChargesCard } from '@/components/bookings/detail/ChargesCard'
import { GuestCard } from '@/components/bookings/detail/GuestCard'
import { PaymentHistoryCard } from '@/components/bookings/detail/PaymentHistoryCard'
import { StayTimelineCard } from '@/components/bookings/detail/StayTimelineCard'
import { useBookingDetail } from '@/components/bookings/detail/useBookingDetail'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const { booking, payments, isLoading, loadError, isRunningAction, reload, runAction } = useBookingDetail(bookingId)

  const [confirmingAction, setConfirmingAction] = useState<BookingActionType | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  function askForConfirmation(action: BookingActionType) {
    setActionError(null)
    setConfirmingAction(action)
  }

  async function confirmAction(input: { reason?: string }) {
    if (!confirmingAction) return
    const result = await runAction(confirmingAction, input)
    if (result.ok) {
      setConfirmingAction(null)
      return
    }
    setActionError(result.error ?? null)
  }

  if (isLoading && !booking) return <BookingDetailSkeleton />
  if (!booking) return <BookingDetailError bookingId={bookingId} message={loadError} onRetry={reload} />

  const progress = getStayProgress(booking)
  const balance = calculateBalance(booking, payments)
  const actions = getAvailableActions(booking)

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Κρατήσεις
      </Link>

      <BookingDetailHeader
        booking={booking}
        progress={progress}
        actions={actions}
        isBusy={isRunningAction}
        onAction={askForConfirmation}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <StayTimelineCard booking={booking} progress={progress} />
          <ChargesCard booking={booking} balance={balance} nights={progress.nights} />
          <PaymentHistoryCard payments={payments} />
        </div>

        <div className="space-y-5">
          <GuestCard booking={booking} />
          <BookingMetaCard booking={booking} />
        </div>
      </div>

      {confirmingAction && (
        <BookingActionDialog
          action={confirmingAction}
          booking={booking}
          isSubmitting={isRunningAction}
          error={actionError}
          onClose={() => setConfirmingAction(null)}
          onConfirm={confirmAction}
        />
      )}

      {isEditOpen && (
        <EditBookingDialog booking={booking} isOpen onClose={() => setIsEditOpen(false)} onSaved={reload} />
      )}

      {isDeleteOpen && (
        <DeleteBookingDialog
          booking={booking}
          isOpen
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={() => router.push('/bookings')}
        />
      )}
    </div>
  )
}
