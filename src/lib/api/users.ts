import { apiRequest } from './config';
import { UsersResponse, User } from './types';

export const usersApi = {
  async getAll(page = 1, limit = 10): Promise<UsersResponse> {
    return apiRequest<UsersResponse>(`/users?page=${page}&limit=${limit}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: User }> {
    return apiRequest<{ success: boolean; data: User }>(`/users/${id}`);
  },

  async update(id: string, data: Partial<User>): Promise<{ success: boolean; data: User }> {
    return apiRequest<{ success: boolean; data: User }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async activate(id: string): Promise<{ success: boolean; data: User }> {
    return apiRequest<{ success: boolean; data: User }>(`/users/${id}/activate`, {
      method: 'POST',
    });
  },

  async deactivate(id: string): Promise<{ success: boolean; data: User }> {
    return apiRequest<{ success: boolean; data: User }>(`/users/${id}/deactivate`, {
      method: 'POST',
    });
  },
};

