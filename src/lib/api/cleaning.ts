import { apiRequest } from './config';

export interface CleaningSchedule {
  id: string;
  propertyId: string;
  frequency: 'AFTER_EACH_BOOKING' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM';
  lastCleaned: string | null;
  nextCleaning: string | null;
  assignedCleaner: string | null;
  ownerId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    titleGr: string;
    titleEn: string;
    address: string;
  };
}

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

export interface CleaningQueryParams {
  page?: number;
  limit?: number;
  propertyId?: string;
  frequency?: string;
}

export const cleaningApi = {
  async getAll(params: CleaningQueryParams = {}): Promise<CleaningSchedulesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);
    if (params.frequency) queryParams.append('frequency', params.frequency);

    const queryString = queryParams.toString();
    return apiRequest<CleaningSchedulesResponse>(`/cleaning${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>(`/cleaning/${id}`);
  },

  async create(data: Partial<CleaningSchedule>): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>('/cleaning', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CleaningSchedule>): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>(`/cleaning/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async markCleaned(id: string): Promise<{ success: boolean; data: CleaningSchedule }> {
    return apiRequest<{ success: boolean; data: CleaningSchedule }>(`/cleaning/${id}/mark-cleaned`, {
      method: 'POST',
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/cleaning/${id}`, {
      method: 'DELETE',
    });
  },
};

