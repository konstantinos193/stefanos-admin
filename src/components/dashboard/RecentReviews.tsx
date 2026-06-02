'use client'

import { useEffect, useState } from 'react'
import { Star, User, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { reviewsApi, type Review } from '@/lib/api/reviews'
import { format } from 'date-fns'
import { el } from 'date-fns/locale'

export function RecentReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await reviewsApi.getAll({ limit: 4 })
        setReviews(res.data.reviews)
      } catch (error: any) {
        if (!error?.message?.includes('Unauthorized') && !error?.message?.includes('401')) {
          console.error('Error fetching reviews:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100">Πρόσφατες Αξιολογήσεις</h2>
          <Star className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-slate-100">Πρόσφατες Αξιολογήσεις</h2>
        </div>
        <Link href="/reviews" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Δείτε όλες →
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <Star className="h-8 w-8 mb-2 text-slate-700" />
          <p className="text-sm">Δεν υπάρχουν αξιολογήσεις ακόμα</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">
                    {review.property?.titleGr ?? review.property?.titleEn ?? 'Ακίνητο'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-400">
                      {review.guest?.name ?? 'Επισκέπτης'}
                    </span>
                    {review.createdAt && (
                      <span className="text-xs text-slate-600">
                        · {format(new Date(review.createdAt), 'd MMM', { locale: el })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-0.5 ml-2">
                  {renderStars(review.rating)}
                </div>
              </div>
              {(review.comment ?? review.title) && (
                <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                  {review.comment ?? review.title}
                </p>
              )}
              {review.response && (
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 rounded-lg px-2 py-1 w-fit">
                  <MessageSquare className="h-3 w-3" />
                  <span>Έχει απάντηση</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
