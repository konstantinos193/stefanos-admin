'use client'

import { Star, User, MessageSquare } from 'lucide-react'

export function RecentReviews() {
  const reviews = [
    { id: '1', property: 'Luxury Apartment', guest: 'John Doe', rating: 5, comment: 'Εξαιρετική παραμονή!', hasResponse: false },
    { id: '2', property: 'Beach House', guest: 'Jane Smith', rating: 4, comment: 'Πολύ καλή τοποθεσία', hasResponse: true },
    { id: '3', property: 'City Studio', guest: 'Mike Johnson', rating: 5, comment: 'Συνιστάται!', hasResponse: false },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Πρόσφατες Αξιολογήσεις</h2>
        <Star className="h-5 w-5 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{review.property}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{review.guest}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
            {review.hasResponse && (
              <div className="mt-2 flex items-center space-x-1 text-blue-600 text-xs">
                <MessageSquare className="h-3 w-3" />
                <span>Έχει απάντηση</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

