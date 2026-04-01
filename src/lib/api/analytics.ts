import { apiRequest } from './config';

export interface AnalyticsPeriod {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
}

export interface PropertyAnalytics {
  id: string;
  propertyId: string;
  period: string;
  periodStart: Date;
  periodEnd: Date;
  totalRevenue: number;
  totalCosts: number;
  cleaningCosts: number;
  maintenanceCosts: number;
  platformFees: number;
  netProfit: number;
  profitMargin: number;
  totalBookings: number;
  cancelledBookings: number;
  occupancyRate: number;
  averageDailyRate: number;
  averageRating: number;
  averageCleanlinessRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialAnalytics {
  totalRevenue: number;
  totalPlatformFees: number;
  totalBookings: number;
  properties: Array<{
    id: string;
    title: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface AnalyticsMetrics {
  pageViews: number;
  activeUsers: number;
  revenue: number;
  bookings: number;
  pageViewsChange: number;
  activeUsersChange: number;
  revenueChange: number;
  bookingsChange: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  profit: number;
  costs: number;
}

export interface BookingTrendData {
  date: string;
  bookings: number;
  cancelled: number;
}

export interface UserDistributionData {
  category: string;
  count: number;
  percentage: number;
}

export interface ActivityData {
  time: string;
  bookings: number;
  users: number;
  revenue: number;
}

export const analyticsApi = {
  async getPropertyAnalytics(
    propertyId: string,
    period: AnalyticsPeriod,
  ): Promise<PropertyAnalytics> {
    const params = new URLSearchParams({
      period: period.period,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    return apiRequest<PropertyAnalytics>(`/analytics/property/${propertyId}?${params}`);
  },

  async getFinancialAnalytics(period: AnalyticsPeriod): Promise<FinancialAnalytics> {
    const params = new URLSearchParams({ period: period.period });
    return apiRequest<FinancialAnalytics>(`/analytics/financial?${params}`);
  },

  async getDashboardMetrics(period: AnalyticsPeriod): Promise<AnalyticsMetrics> {
    const params = new URLSearchParams({
      period: period.period,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    const response = await apiRequest<{ success: boolean; data: AnalyticsMetrics }>(
      `/analytics/dashboard?${params}`,
    );
    return response.data;
  },

  async getRevenueChartData(period: AnalyticsPeriod): Promise<RevenueChartData[]> {
    const params = new URLSearchParams({
      period: period.period,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    const response = await apiRequest<{ success: boolean; data: RevenueChartData[] }>(
      `/analytics/revenue-chart?${params}`,
    );
    return response.data;
  },

  async getBookingTrendsData(period: AnalyticsPeriod): Promise<BookingTrendData[]> {
    const params = new URLSearchParams({
      period: period.period,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    const response = await apiRequest<{ success: boolean; data: BookingTrendData[] }>(
      `/analytics/booking-trends?${params}`,
    );
    return response.data;
  },

  async getUserDistributionData(): Promise<UserDistributionData[]> {
    const response = await apiRequest<{ success: boolean; data: UserDistributionData[] }>(
      '/analytics/user-distribution',
    );
    return response.data;
  },

  async getActivityData(period: AnalyticsPeriod): Promise<ActivityData[]> {
    const params = new URLSearchParams({
      period: period.period,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    const response = await apiRequest<{ success: boolean; data: ActivityData[] }>(
      `/analytics/activity?${params}`,
    );
    return response.data;
  },
};
