import { apiRequest } from './config';

export type RoomType = 'BEDROOM' | 'LIVING_ROOM' | 'STUDIO' | 'KITCHEN' | 'BATHROOM' | 'BALCONY' | 'TERRACE' | 'GARDEN' | 'OTHER';

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  nameGr: string | null;
  nameEn: string | null;
  type: RoomType;
  capacity: number;
  maxAdults: number | null;
  maxChildren: number | null;
  maxInfants: number | null;
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

export interface DashboardRoom extends Room {
  upcomingBookingsCount: number;
  nextBooking: {
    id: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guests: number;
  } | null;
  isOccupied: boolean;
  lastCleaned: string | null;
  nextCleaning: string | null;
  cleaningFrequency: string | null;
  totalRevenue: number;
}

export interface RoomDashboardStats {
  totalRooms: number;
  bookableRooms: number;
  unavailableRooms: number;
  averagePrice: number;
  totalUpcomingBookings: number;
  occupancyRate: number;
  totalRevenue: number;
}

export interface RoomDashboardResponse {
  success: boolean;
  data: {
    stats: RoomDashboardStats;
    rooms: DashboardRoom[];
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

export interface TaxSettings {
  id: string;
  vatRate: number; // ΦΠΑ (%)
  municipalFee: number; // Δημοτικά τέλη (€ ανά διανυκτέρευση)
  environmentalTax: number; // Περιβαλλοντικός φόρος (€ ανά διανυκτέρευση)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomPricing {
  id: string;
  roomId: string;
  basePrice: number;
  vatRate: number;
  municipalFee: number;
  environmentalTax: number;
  totalPrice: number; // basePrice + taxes
  isActive: boolean;
  validFrom: string;
  validTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  priceOverride: number | null;
  isAvailable: boolean;
  reason: string | null;
  minStayOverride: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRulesResponse {
  success: boolean;
  data: PricingRule[];
}

export const roomsApi = {
  async getDashboardStats(): Promise<RoomDashboardResponse> {
    return apiRequest<RoomDashboardResponse>('/rooms/dashboard-stats');
  },

  async getBookable(): Promise<RoomsResponse> {
    return apiRequest<RoomsResponse>('/rooms/bookable');
  },

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

  async getPricingRules(roomId: string): Promise<PricingRulesResponse> {
    return apiRequest<PricingRulesResponse>(`/rooms/${roomId}/pricing-rules`);
  },

  async createPricingRule(roomId: string, data: {
    startDate: string;
    endDate: string;
    priceOverride?: number | null;
    isAvailable?: boolean;
    reason?: string;
    minStayOverride?: number | null;
  }): Promise<{ success: boolean; data: PricingRule }> {
    return apiRequest<{ success: boolean; data: PricingRule }>(`/rooms/${roomId}/pricing-rules`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePricingRule(roomId: string, ruleId: string, data: Partial<{
    startDate: string;
    endDate: string;
    priceOverride: number | null;
    isAvailable: boolean;
    reason: string;
    minStayOverride: number | null;
  }>): Promise<{ success: boolean; data: PricingRule }> {
    return apiRequest<{ success: boolean; data: PricingRule }>(`/rooms/${roomId}/pricing-rules/${ruleId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deletePricingRule(roomId: string, ruleId: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/rooms/${roomId}/pricing-rules/${ruleId}`, {
      method: 'DELETE',
    });
  },

  // Tax Settings API
  async getTaxSettings(): Promise<{ success: boolean; data: TaxSettings }> {
    return apiRequest<{ success: boolean; data: TaxSettings }>('/settings/taxes');
  },

  async updateTaxSettings(data: Partial<TaxSettings>): Promise<{ success: boolean; data: TaxSettings }> {
    return apiRequest<{ success: boolean; data: TaxSettings }>('/settings/taxes', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Room Pricing API
  async getRoomPricing(roomId: string): Promise<{ success: boolean; data: RoomPricing[] }> {
    return apiRequest<{ success: boolean; data: RoomPricing[] }>(`/rooms/${roomId}/pricing`);
  },

  async updateRoomPricing(roomId: string, data: {
    basePrice: number;
    vatRate?: number;
    municipalFee?: number;
    environmentalTax?: number;
  }): Promise<{ success: boolean; data: RoomPricing }> {
    return apiRequest<{ success: boolean; data: RoomPricing }>(`/rooms/${roomId}/pricing`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Availability Management API
  async updateRoomAvailability(roomId: string, data: {
    isAvailable: boolean;
    reason?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/rooms/${roomId}/availability`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getRoomAvailabilityCalendar(roomId: string, year: number, month: number): Promise<{ success: boolean; data: any[] }> {
    return apiRequest<{ success: boolean; data: any[] }>(`/rooms/${roomId}/availability-calendar?year=${year}&month=${month}`);
  },
};

