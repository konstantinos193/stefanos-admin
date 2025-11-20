'use client'

import { useState, useEffect } from 'react'
import { reviewsApi, Review } from '@/lib/api/reviews'
import { Star, MessageSquare, User } from 'lucide-react'

export function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const response = await reviewsApi.getAll({ page, limit: 10 })
        setReviews(response.data?.reviews || [])
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [page])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR')
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-600">Φόρτωση αξιολογήσεων...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ΑΚΙΝΗΤΟ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ΕΠΙΣΚΕΠΤΗΣ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ΑΞΙΟΛΟΓΗΣΗ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ΣΧΟΛΙΟ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ΗΜΕΡΟΜΗΝΙΑ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ΕΝΕΡΓΕΙΕΣ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Δεν βρέθηκαν αξιολογήσεις
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {review.property?.titleGr || review.property?.titleEn || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {review.guest?.name || 'Ανώνυμος'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-semibold text-gray-900">{review.rating}/5</span>
                    </div>
                    {review.cleanlinessRating && (
                      <div className="text-xs text-gray-500 mt-1">
                        Καθαριότητα: {review.cleanlinessRating}/5
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">
                      {review.comment || review.title || '-'}
                    </div>
                    {review.response && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>Έχει απάντηση</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {!review.response && (
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Απάντηση
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

