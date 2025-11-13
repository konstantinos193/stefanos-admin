import { RoomsHeader } from '@/components/rooms/RoomsHeader'
import { RoomsGrid } from '@/components/rooms/RoomsGrid'

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <RoomsHeader />
      <RoomsGrid />
    </div>
  )
}

