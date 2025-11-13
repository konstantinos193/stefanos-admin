import { apiRequest } from './config';

export interface KnowledgeArticle {
  id: string;
  titleGr: string;
  titleEn: string;
  contentGr: string | null;
  contentEn: string | null;
  category: string;
  tags: string[];
  author: string;
  readTime: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeResponse {
  success: boolean;
  data: {
    articles: KnowledgeArticle[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface KnowledgeQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string;
  search?: string;
}

export const knowledgeApi = {
  async getAll(params: KnowledgeQueryParams = {}): Promise<KnowledgeResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return apiRequest<KnowledgeResponse>(`/knowledge${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: KnowledgeArticle }> {
    return apiRequest<{ success: boolean; data: KnowledgeArticle }>(`/knowledge/${id}`);
  },

  async create(data: Partial<KnowledgeArticle>): Promise<{ success: boolean; data: KnowledgeArticle }> {
    return apiRequest<{ success: boolean; data: KnowledgeArticle }>('/knowledge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<KnowledgeArticle>): Promise<{ success: boolean; data: KnowledgeArticle }> {
    return apiRequest<{ success: boolean; data: KnowledgeArticle }>(`/knowledge/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/knowledge/${id}`, {
      method: 'DELETE',
    });
  },

  async publish(id: string): Promise<{ success: boolean; data: KnowledgeArticle }> {
    return apiRequest<{ success: boolean; data: KnowledgeArticle }>(`/knowledge/${id}/publish`, {
      method: 'POST',
    });
  },
};

