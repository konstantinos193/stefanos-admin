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
    period: AnalyticsPeriod
  ): Promise<PropertyAnalytics> {
    const params = new URLSearchParams({
      period: period.period,
      startDate: period.startDate,
      endDate: period.endDate,
    });
    
    return apiRequest<PropertyAnalytics>(`/analytics/property/${propertyId}?${params}`);
  },

  async getFinancialAnalytics(period: AnalyticsPeriod): Promise<FinancialAnalytics> {
    const params = new URLSearchParams({
      period: period.period,
    });
    
    return apiRequest<FinancialAnalytics>(`/analytics/financial?${params}`);
  },

  async getDashboardMetrics(period: AnalyticsPeriod): Promise<AnalyticsMetrics> {
    // For now, we'll calculate metrics from financial analytics
    // In a real implementation, you might have a dedicated endpoint
    const financialData = await this.getFinancialAnalytics(period);
    
    // Mock data for page views and active users since they're not in the backend yet
    // These would typically come from a tracking service like Google Analytics
    const pageViews = Math.floor(Math.random() * 50000) + 30000;
    const activeUsers = Math.floor(Math.random() * 3000) + 1500;
    
    return {
      pageViews,
      activeUsers,
      revenue: financialData.totalRevenue,
      bookings: financialData.totalBookings,
      pageViewsChange: Math.floor(Math.random() * 20) - 5, // Random change between -5% and +15%
      activeUsersChange: Math.floor(Math.random() * 15) - 2, // Random change between -2% and +13%
      revenueChange: Math.floor(Math.random() * 25) - 5, // Random change between -5% and +20%
      bookingsChange: Math.floor(Math.random() * 10) - 5, // Random change between -5% and +5%
    };
  },

  async getRevenueChartData(period: AnalyticsPeriod): Promise<RevenueChartData[]> {
    // Generate mock data based on period
    const dataPoints = this.generateDataPoints(period);
    
    return dataPoints.map((date, index) => ({
      date,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      profit: Math.floor(Math.random() * 3000) + 1000,
      costs: Math.floor(Math.random() * 2000) + 500,
    }));
  },

  async getBookingTrendsData(period: AnalyticsPeriod): Promise<BookingTrendData[]> {
    const dataPoints = this.generateDataPoints(period);
    
    return dataPoints.map((date, index) => ({
      date,
      bookings: Math.floor(Math.random() * 50) + 10,
      cancelled: Math.floor(Math.random() * 10) + 1,
    }));
  },

  async getUserDistributionData(): Promise<UserDistributionData[]> {
    return [
      { category: 'Νέοι Χρήστες', count: 1250, percentage: 35 },
      { category: 'Επιστρέφοντες', count: 980, percentage: 27 },
      { category: 'VIP Χρήστες', count: 450, percentage: 13 },
      { category: 'Αδρανείς', count: 890, percentage: 25 },
    ];
  },

  async getActivityData(period: AnalyticsPeriod): Promise<ActivityData[]> {
    const dataPoints = this.generateDataPoints(period);
    
    return dataPoints.map((date, index) => ({
      time: date,
      bookings: Math.floor(Math.random() * 30) + 5,
      users: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    }));
  },

  // Helper function to generate date points based on period
  generateDataPoints(period: AnalyticsPeriod): string[] {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    const points: string[] = [];
    
    const current = new Date(start);
    
    if (period.period === 'DAILY') {
      while (current <= end) {
        points.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    } else if (period.period === 'WEEKLY') {
      while (current <= end) {
        points.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 7);
      }
    } else if (period.period === 'MONTHLY') {
      while (current <= end) {
        points.push(current.toISOString().split('T')[0]);
        current.setMonth(current.getMonth() + 1);
      }
    } else {
      // YEARLY
      while (current <= end) {
        points.push(current.toISOString().split('T')[0]);
        current.setFullYear(current.getFullYear() + 1);
      }
    }
    
    return points;
  },
};
