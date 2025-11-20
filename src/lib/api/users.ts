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

  async create(data: {
    email: string;
    name: string;
    phone?: string;
    password: string;
    role?: 'USER' | 'ADMIN' | 'PROPERTY_OWNER' | 'MANAGER';
  }): Promise<{ success: boolean; message: string; user: User }> {
    return apiRequest<{ success: boolean; message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAllForExport(): Promise<User[]> {
    // Fetch all users without pagination for export
    // Use a large limit to get all users
    const allUsers: User[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await this.getAll(page, 100)
      const users = response.data?.users || []
      allUsers.push(...users)
      
      hasMore = users.length === 100 && page < (response.data?.pagination?.totalPages || 1)
      page++
    }

    return allUsers
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    // Since backend doesn't have DELETE, we'll deactivate the user
    // In a real scenario, you might want to implement actual deletion
    const result = await this.deactivate(id);
    return {
      success: result.success,
      message: 'Ο χρήστης απενεργοποιήθηκε επιτυχώς'
    };
  },
};

