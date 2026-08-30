import { apiRequest } from './config';

export type ContentTypeValue =
  | 'TEXT'
  | 'HTML'
  | 'MARKDOWN'
  | 'JSON'
  | 'IMAGE'
  | 'GALLERY'
  | 'HERO';

/** Field names mirror the Content model: contentGr / contentEn, not valueGr / valueEn. */
export interface ContentItem {
  id: string;
  page: string;
  section: string;
  key: string;
  type: ContentTypeValue;
  contentGr: string | null;
  contentEn: string | null;
  active: boolean;
  order: number;
  metaTitleGr?: string | null;
  metaTitleEn?: string | null;
  metaDescriptionGr?: string | null;
  metaDescriptionEn?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentListResponse {
  success: boolean;
  data: ContentItem[];
  pagination?: {
    total: number;
    skip: number;
    take: number;
  };
}

export interface ContentQueryParams {
  page?: string;
  section?: string;
  type?: ContentTypeValue;
  skip?: number;
  take?: number;
}

export const contentApi = {
  async getAll(params: ContentQueryParams = {}): Promise<ContentListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.section) query.append('section', params.section);
    if (params.type) query.append('type', params.type);
    if (params.skip !== undefined) query.append('skip', String(params.skip));
    if (params.take !== undefined) query.append('take', String(params.take));

    const queryString = query.toString();
    return apiRequest<ContentListResponse>(`/content${queryString ? `?${queryString}` : ''}`);
  },

  async create(data: Partial<ContentItem>): Promise<{ success: boolean; data: ContentItem }> {
    return apiRequest<{ success: boolean; data: ContentItem }>('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: Partial<ContentItem>,
  ): Promise<{ success: boolean; data: ContentItem }> {
    return apiRequest<{ success: boolean; data: ContentItem }>(`/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/content/${id}`, {
      method: 'DELETE',
    });
  },
};
