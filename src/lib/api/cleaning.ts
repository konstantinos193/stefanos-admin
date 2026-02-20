import { apiRequest } from './config';
import { CleaningSchedule, CleaningStats, PropertyCleanliness } from './types';

export interface CleaningSchedulesResponse {
  success: boolean;
  data: {
    schedules: CleaningSchedule[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CleaningStatsResponse {
  success: boolean;
  data: CleaningStats;
}

export interface PropertyCleanlinessResponse {
  success: boolean;
  data: PropertyCleanliness;
}

export interface CleaningQueryParams {
  page?: number;
  limit?: number;
  propertyId?: string;
  frequency?: string;
  status?: string;
  search?: string;
}

export const cleaningApi = {
  async getAll(params: CleaningQueryParams = {}): Promise<CleaningSchedulesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);
    if (params.frequency) queryParams.append('frequency', params.frequency);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return apiRequest<CleaningSchedulesResponse>(`/cleaning${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>(`/cleaning/${id}`);
  },

  async create(data: Partial<CleaningSchedule>): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>('/cleaning/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CleaningSchedule>): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>(`/cleaning/schedule/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async markCleaned(id: string, date?: string): Promise<{ success: boolean; data: CleaningSchedule }> {
    const queryParams = date ? `?date=${encodeURIComponent(date)}` : '';
    return apiRequest<{ success: boolean; data: CleaningSchedule }>(`/cleaning/schedule/${id}/cleaned${queryParams}`, {
      method: 'PATCH',
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/cleaning/schedule/${id}`, {
      method: 'DELETE',
    });
  },

  async getStats(): Promise<CleaningStatsResponse> {
    return apiRequest<CleaningStatsResponse>('/cleaning/stats');
  },

  async getPropertyCleanliness(propertyId: string): Promise<PropertyCleanlinessResponse> {
    return apiRequest<PropertyCleanlinessResponse>(`/cleaning/property/${propertyId}`);
  },

  async getPropertySchedules(propertyId: string, userId: string): Promise<CleaningSchedulesResponse> {
    return apiRequest<CleaningSchedulesResponse>(`/cleaning/property/${propertyId}/schedules?userId=${userId}`);
  }
};

