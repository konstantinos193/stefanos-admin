import { apiRequest } from './config';
import { PropertiesResponse, Property } from './types';

export interface PropertyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const propertiesApi = {
  async getAll(params: PropertyQueryParams = {}): Promise<PropertiesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    if (params.city) queryParams.append('city', params.city);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    const queryString = queryParams.toString();
    return apiRequest<PropertiesResponse>(`/properties${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Property }> {
    return apiRequest<{ success: boolean; data: Property }>(`/properties/${id}`);
  },

  async create(data: Partial<Property>): Promise<{ success: boolean; data: Property }> {
    return apiRequest<{ success: boolean; data: Property }>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Property>): Promise<{ success: boolean; data: Property }> {
    return apiRequest<{ success: boolean; data: Property }>(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

