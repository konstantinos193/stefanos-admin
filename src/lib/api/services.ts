import { apiRequest } from './config';

export interface Service {
  id: string;
  titleGr: string;
  titleEn: string;
  descriptionGr: string | null;
  descriptionEn: string | null;
  icon: string | null;
  features: string[];
  pricingGr: string | null;
  pricingEn: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  success: boolean;
  data: {
    services: Service[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const servicesApi = {
  async getAll(params: ServiceQueryParams = {}): Promise<ServicesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const queryString = queryParams.toString();
    return apiRequest<ServicesResponse>(`/services${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Service }> {
    return apiRequest<{ success: boolean; data: Service }>(`/services/${id}`);
  },

  async create(data: Partial<Service>): Promise<{ success: boolean; data: Service }> {
    return apiRequest<{ success: boolean; data: Service }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Service>): Promise<{ success: boolean; data: Service }> {
    return apiRequest<{ success: boolean; data: Service }>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/services/${id}`, {
      method: 'DELETE',
    });
  },

  async toggleActive(id: string): Promise<{ success: boolean; data: Service }> {
    return apiRequest<{ success: boolean; data: Service }>(`/services/${id}/toggle`, {
      method: 'PATCH',
    });
  },
};

