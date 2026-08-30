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
  /**
   * Admin listing. GET /reviews is the public route and filters to isPublic:true,
   * so a hidden review would vanish from the admin panel too and could never be
   * restored. This route is ADMIN/MANAGER-guarded and returns hidden ones as well.
   */
  async getAll(params: ReviewQueryParams = {}): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);

    const queryString = queryParams.toString();
    return apiRequest<ReviewsResponse>(
      `/reviews/admin/all${queryString ? `?${queryString}` : ''}`,
    );
  },

  async setVisibility(id: string, isPublic: boolean): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublic }),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/reviews/${id}`, {
      method: 'DELETE',
    });
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

