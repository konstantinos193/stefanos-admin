import { apiRequest } from './config';

export interface Edition {
  id: string;
  category: string;
  titleGr: string;
  titleEn: string;
  descriptionGr: string | null;
  descriptionEn: string | null;
  contentGr: string | null;
  contentEn: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  order: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EditionsResponse {
  success: boolean;
  data: {
    editions: Edition[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface EditionQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  featured?: boolean;
}

export const contentApi = {
  async getAll(params: EditionQueryParams = {}): Promise<EditionsResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const queryString = queryParams.toString();
    return apiRequest<EditionsResponse>(`/editions${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Edition }> {
    return apiRequest<{ success: boolean; data: Edition }>(`/editions/${id}`);
  },

  async create(data: Partial<Edition>): Promise<{ success: boolean; data: Edition }> {
    return apiRequest<{ success: boolean; data: Edition }>('/editions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Edition>): Promise<{ success: boolean; data: Edition }> {
    return apiRequest<{ success: boolean; data: Edition }>(`/editions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/editions/${id}`, {
      method: 'DELETE',
    });
  },

  async publish(id: string): Promise<{ success: boolean; data: Edition }> {
    return apiRequest<{ success: boolean; data: Edition }>(`/editions/${id}/publish`, {
      method: 'POST',
    });
  },
};

