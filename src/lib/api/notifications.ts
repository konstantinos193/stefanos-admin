import { apiRequest } from './config';

export interface Notification {
  id: string;
  userId: string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'PAYMENT_RECEIVED' | 'MAINTENANCE_REQUEST' | 'REVIEW_RECEIVED' | 'MESSAGE_RECEIVED' | 'SYSTEM_UPDATE';
  title: string;
  message: string;
  isRead: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export const notificationsApi = {
  async getAll(page = 1, limit = 20): Promise<NotificationsResponse> {
    return apiRequest<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`);
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiRequest<UnreadCountResponse>('/notifications/unread-count');
  },

  async markAsRead(id: string): Promise<{ success: boolean; data: Notification }> {
    return apiRequest<{ success: boolean; data: Notification }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/notifications/mark-all-read', {
      method: 'POST',
    });
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },

  async deleteAll(): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>('/notifications', {
      method: 'DELETE',
    });
  },
};
