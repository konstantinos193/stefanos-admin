import { BookingsHeader } from '@/components/bookings/BookingsHeader'
import { BookingsTable } from '@/components/bookings/BookingsTable'
import { BookingsFilters } from '@/components/bookings/BookingsFilters'

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <BookingsHeader />
      <BookingsFilters />
      <BookingsTable />
    </div>
  )
}

