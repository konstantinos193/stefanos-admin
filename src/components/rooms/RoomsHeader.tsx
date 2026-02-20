'use client'

import { Search } from 'lucide-react'

interface RoomsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterType: string
  onFilterTypeChange: (type: string) => void
  filterStatus: string
  onFilterStatusChange: (status: string) => void
}

const roomTypeOptions: { value: string; label: string }[] = [
  { value: '', label: 'Όλοι οι Τύποι' },
  { value: 'BEDROOM', label: 'Υπνοδωμάτιο' },
  { value: 'STUDIO', label: 'Στούντιο' },
  { value: 'LIVING_ROOM', label: 'Καθιστικό' },
  { value: 'KITCHEN', label: 'Κουζίνα' },
  { value: 'BATHROOM', label: 'Μπάνιο' },
  { value: 'BALCONY', label: 'Μπαλκόνι' },
  { value: 'TERRACE', label: 'Βεράντα' },
  { value: 'GARDEN', label: 'Κήπος' },
  { value: 'OTHER', label: 'Άλλο' },
]

const statusOptions = [
  { value: '', label: 'Όλες οι Καταστάσεις' },
  { value: 'bookable', label: 'Διαθέσιμα' },
  { value: 'unavailable', label: 'Μη Διαθέσιμα' },
  { value: 'occupied', label: 'Κατειλημμένα' },
]

export function RoomsHeader({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterStatus,
  onFilterStatusChange,
}: RoomsHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Διαχείριση Δωματίων</h1>
        <p className="text-slate-400 mt-1">Πλήρης διαχείριση δωματίων — τιμές, διαθεσιμότητα, χωρητικότητα & περισσότερα</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Αναζήτηση δωματίου..."
            className="input pl-10"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
          className="input max-w-[200px]"
        >
          {roomTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="input max-w-[200px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

