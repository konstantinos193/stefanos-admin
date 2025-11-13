import { apiRequest } from './config';

export interface Payment {
  id: string;
  bookingId: string;
  propertyId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'PAYPAL' | 'BANK_TRANSFER' | 'STRIPE_LINK';
  transactionId: string | null;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  payoutId: string | null;
  payoutStatus: string | null;
  payoutScheduledFor: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
  };
  property?: {
    id: string;
    titleGr: string;
    titleEn: string;
  };
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    payments: Payment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  bookingId?: string;
  propertyId?: string;
}

export const paymentsApi = {
  async getAll(params: PaymentQueryParams = {}): Promise<PaymentsResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.method) queryParams.append('method', params.method);
    if (params.bookingId) queryParams.append('bookingId', params.bookingId);
    if (params.propertyId) queryParams.append('propertyId', params.propertyId);

    const queryString = queryParams.toString();
    return apiRequest<PaymentsResponse>(`/payments${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Payment }> {
    return apiRequest<{ success: boolean; data: Payment }>(`/payments/${id}`);
  },

  async refund(id: string, amount: number, reason: string): Promise<{ success: boolean; data: Payment }> {
    return apiRequest<{ success: boolean; data: Payment }>(`/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  },
};

