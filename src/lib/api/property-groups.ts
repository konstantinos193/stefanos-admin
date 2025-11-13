import { apiRequest } from './config';

export interface PropertyGroup {
  id: string;
  name: string;
  nameGr: string | null;
  nameEn: string | null;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string | null;
    email: string;
  };
  properties?: Array<{
    id: string;
    titleGr: string;
    titleEn: string;
    status: string;
  }>;
}

export interface PropertyGroupsResponse {
  success: boolean;
  data: {
    groups: PropertyGroup[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const propertyGroupsApi = {
  async getAll(): Promise<PropertyGroupsResponse> {
    return apiRequest<PropertyGroupsResponse>('/property-groups');
  },

  async getById(id: string): Promise<{ success: boolean; data: PropertyGroup }> {
    return apiRequest<{ success: boolean; data: PropertyGroup }>(`/property-groups/${id}`);
  },

  async create(data: Partial<PropertyGroup>): Promise<{ success: boolean; data: PropertyGroup }> {
    return apiRequest<{ success: boolean; data: PropertyGroup }>('/property-groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<PropertyGroup>): Promise<{ success: boolean; data: PropertyGroup }> {
    return apiRequest<{ success: boolean; data: PropertyGroup }>(`/property-groups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/property-groups/${id}`, {
      method: 'DELETE',
    });
  },
};

