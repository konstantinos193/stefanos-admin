import { apiRequest } from './config';

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  guestId: string;
  rating: number;
  cleanlinessRating: number | null;
  accuracyRating: number | null;
  communicationRating: number | null;
  locationRating: number | null;
  valueRating: number | null;
  title: string | null;
  comment: string | null;
  response: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    titleGr: string;
    titleEn: string;
    images: string[];
  };
  guest?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  booking?: {
    id: string;
    checkIn: string;
    checkOut: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  propertyId?: string;
  rating?: number;
  minRating?: number;
}

export const reviewsApi = {
  async getAll(params: ReviewQueryParams = {}): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);
    if (params.rating) queryParams.append('rating', params.rating.toString());
    if (params.minRating) queryParams.append('minRating', params.minRating.toString());

    const queryString = queryParams.toString();
    return apiRequest<ReviewsResponse>(`/reviews${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Review }> {
    return apiRequest<{ success: boolean; data: Review }>(`/reviews/${id}`);
  },

  async create(data: Partial<Review>): Promise<{ success: boolean; data: Review }> {
    return apiRequest<{ success: boolean; data: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Review>): Promise<{ success: boolean; data: Review }> {
    return apiRequest<{ success: boolean; data: Review }>(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async respond(id: string, response: string): Promise<{ success: boolean; data: Review }> {
    return apiRequest<{ success: boolean; data: Review }>(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ response }),
    });
  },
};

