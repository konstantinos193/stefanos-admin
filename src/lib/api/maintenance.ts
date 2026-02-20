import { apiRequest } from './config';
import { MaintenanceRequest } from './types';

export type { MaintenanceRequest };

export interface MaintenanceResponse {
  success: boolean;
  data: {
    maintenance: MaintenanceRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MaintenanceQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  propertyId?: string;
}

export const maintenanceApi = {
  async getAll(params: MaintenanceQueryParams = {}): Promise<MaintenanceResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);

    const queryString = queryParams.toString();
    return apiRequest<MaintenanceResponse>(`/maintenance${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: MaintenanceRequest }> {
    return apiRequest<{ success: boolean; data: MaintenanceRequest }>(`/maintenance/${id}`);
  },

  async create(data: Partial<MaintenanceRequest>): Promise<{ success: boolean; data: MaintenanceRequest }> {
    return apiRequest<{ success: boolean; data: MaintenanceRequest }>('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<MaintenanceRequest>): Promise<{ success: boolean; data: MaintenanceRequest }> {
    return apiRequest<{ success: boolean; data: MaintenanceRequest }>(`/maintenance/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async assign(id: string, assignedTo: string): Promise<{ success: boolean; data: MaintenanceRequest }> {
    return apiRequest<{ success: boolean; data: MaintenanceRequest }>(`/maintenance/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assignedTo }),
    });
  },

  async complete(id: string): Promise<{ success: boolean; data: MaintenanceRequest }> {
    return apiRequest<{ success: boolean; data: MaintenanceRequest }>(`/maintenance/${id}/complete`, {
      method: 'POST',
    });
  },
};

