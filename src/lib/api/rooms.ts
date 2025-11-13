import { apiRequest } from './config';

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  nameGr: string | null;
  nameEn: string | null;
  type: 'BEDROOM' | 'LIVING_ROOM' | 'STUDIO' | 'KITCHEN' | 'BATHROOM' | 'BALCONY' | 'TERRACE' | 'GARDEN' | 'OTHER';
  capacity: number;
  basePrice: number;
  isBookable: boolean;
  amenities: string[];
  images: string[];
  descriptionGr: string | null;
  descriptionEn: string | null;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    titleGr: string;
    titleEn: string;
  };
}

export interface RoomsResponse {
  success: boolean;
  data: {
    rooms: Room[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface RoomQueryParams {
  propertyId?: string;
  type?: string;
  isBookable?: boolean;
}

export const roomsApi = {
  async getByProperty(propertyId: string): Promise<RoomsResponse> {
    return apiRequest<RoomsResponse>(`/rooms/property/${propertyId}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Room }> {
    return apiRequest<{ success: boolean; data: Room }>(`/rooms/${id}`);
  },

  async getAvailability(id: string, startDate: string, endDate: string): Promise<{ success: boolean; data: any }> {
    return apiRequest<{ success: boolean; data: any }>(`/rooms/${id}/availability?startDate=${startDate}&endDate=${endDate}`);
  },

  async create(data: Partial<Room>): Promise<{ success: boolean; data: Room }> {
    return apiRequest<{ success: boolean; data: Room }>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Room>): Promise<{ success: boolean; data: Room }> {
    return apiRequest<{ success: boolean; data: Room }>(`/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

