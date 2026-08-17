'use client'

import { useCallback, useEffect, useState } from 'react'
import { bookingsApi } from '@/lib/api/bookings'
import { paymentsApi, Payment } from '@/lib/api/payments'
import { Booking } from '@/lib/api/types'
import { BookingActionType } from '@/lib/bookings/booking-rules'

export interface BookingActionInput {
  /** Cancellation reason, sent with the cancel action only. */
  reason?: string
}

export interface BookingActionResult {
  ok: boolean
  error?: string
}

interface BookingDetailState {
  booking: Booking | null
  payments: Payment[]
  isLoading: boolean
  loadError: string | null
  isRunningAction: boolean
  reload: () => Promise<void>
  runAction: (action: BookingActionType, input?: BookingActionInput) => Promise<BookingActionResult>
}

function executeAction(bookingId: string, action: BookingActionType, input: BookingActionInput) {
  switch (action) {
    case 'confirm':
      return bookingsApi.update(bookingId, { status: 'CONFIRMED' })
    case 'check-in':
      return bookingsApi.checkIn(bookingId)
    case 'check-out':
      return bookingsApi.checkOut(bookingId)
    case 'mark-paid':
      return bookingsApi.markAsPaid(bookingId)
    case 'cancel':
      return bookingsApi.cancel(bookingId, input.reason)
  }
}

/** Loads a booking with its payment records and runs reception actions against it. */
export function useBookingDetail(bookingId: string): BookingDetailState {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isRunningAction, setIsRunningAction] = useState(false)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const response = await bookingsApi.getById(bookingId)
      setBooking(response.data)
    } catch (error) {
      setBooking(null)
      setLoadError(error instanceof Error ? error.message : 'Η κράτηση δεν φορτώθηκε.')
    } finally {
      setIsLoading(false)
    }

    // Payment records are supporting detail — a failure here must not blank out the page.
    try {
      const response = await paymentsApi.getAll({ bookingId, limit: 50 })
      setPayments(response.data.payments)
    } catch {
      setPayments([])
    }
  }, [bookingId])

  useEffect(() => {
    reload()
  }, [reload])

  const runAction = useCallback(
    async (action: BookingActionType, input: BookingActionInput = {}): Promise<BookingActionResult> => {
      setIsRunningAction(true)
      try {
        await executeAction(bookingId, action, input)
        await reload()
        return { ok: true }
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : 'Η ενέργεια απέτυχε. Δοκιμάστε ξανά.' }
      } finally {
        setIsRunningAction(false)
      }
    },
    [bookingId, reload],
  )

  return { booking, payments, isLoading, loadError, isRunningAction, reload, runAction }
}
