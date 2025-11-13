import { apiRequest } from './config';

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string | null;
    avatar: string | null;
    email: string;
  };
  booking?: {
    id: string;
    propertyId: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
  };
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: Message[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MessageQueryParams {
  page?: number;
  limit?: number;
  bookingId?: string;
  isRead?: boolean;
}

export const messagesApi = {
  async getAll(params: MessageQueryParams = {}): Promise<MessagesResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.bookingId) queryParams.append('bookingId', params.bookingId);
    if (params.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());

    const queryString = queryParams.toString();
    return apiRequest<MessagesResponse>(`/messages${queryString ? `?${queryString}` : ''}`);
  },

  async getByBooking(bookingId: string): Promise<MessagesResponse> {
    return apiRequest<MessagesResponse>(`/messages/booking/${bookingId}`);
  },

  async send(bookingId: string, content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'): Promise<{ success: boolean; data: Message }> {
    return apiRequest<{ success: boolean; data: Message }>('/messages', {
      method: 'POST',
      body: JSON.stringify({ bookingId, content, type }),
    });
  },

  async markAsRead(id: string): Promise<{ success: boolean; data: Message }> {
    return apiRequest<{ success: boolean; data: Message }>(`/messages/${id}/read`, {
      method: 'PATCH',
    });
  },
};

