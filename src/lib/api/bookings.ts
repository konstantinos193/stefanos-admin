import { apiRequest } from './config';
import { BookingsResponse, Booking } from './types';

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const bookingsApi = {
  async getAll(params: BookingQueryParams = {}): Promise<BookingsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    return apiRequest<BookingsResponse>(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Booking }> {
    return apiRequest<{ success: boolean; data: Booking }>(`/bookings/${id}`);
  },

  async create(data: Partial<Booking>): Promise<{ success: boolean; data: Booking }> {
    return apiRequest<{ success: boolean; data: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Booking>): Promise<{ success: boolean; data: Booking }> {
    return apiRequest<{ success: boolean; data: Booking }>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async cancel(id: string, reason?: string): Promise<{ success: boolean; data: Booking }> {
    return apiRequest<{ success: boolean; data: Booking }>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async getAllForSearch(): Promise<Booking[]> {
    const allBookings: Booking[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await this.getAll({ page, limit: 100 })
      const bookings = response.data?.bookings || []
      allBookings.push(...bookings)
      
      hasMore = bookings.length === 100 && page < (response.data?.pagination?.totalPages || 1)
      page++
    }

    return allBookings
  },

  async getAllForExport(): Promise<Booking[]> {
    return this.getAllForSearch()
  },
};

