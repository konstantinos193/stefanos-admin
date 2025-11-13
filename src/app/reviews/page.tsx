import { ReviewsHeader } from '@/components/reviews/ReviewsHeader'
import { ReviewsTable } from '@/components/reviews/ReviewsTable'

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <ReviewsHeader />
      <ReviewsTable />
    </div>
  )
}

