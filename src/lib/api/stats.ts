import { apiRequest } from './config';
import { StatsResponse, DashboardStats, UsersResponse, PropertiesResponse, BookingsResponse } from './types';

export const statsApi = {
  async getPlatformStats(): Promise<StatsResponse> {
    return apiRequest<StatsResponse>('/health/stats');
  },

  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    // This will need to be implemented in the backend or calculated from multiple endpoints
    // For now, we'll fetch individual stats and combine them
    try {
      // Check if authenticated before making authenticated requests
      const isAuth = typeof window !== 'undefined' && !!(localStorage.getItem('admin_token') || localStorage.getItem('token'));
      
      const [usersRes, propertiesRes, bookingsRes, platformStats] = await Promise.all([
        isAuth 
          ? apiRequest<UsersResponse>('/users?limit=1').catch(() => ({ success: true, data: { users: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } }))
          : Promise.resolve({ success: true, data: { users: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } }),
        isAuth
          ? apiRequest<PropertiesResponse>('/properties?limit=1').catch(() => ({ success: true, data: { properties: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } }))
          : Promise.resolve({ success: true, data: { properties: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } }),
        isAuth
          ? apiRequest<BookingsResponse>('/bookings?limit=1').catch(() => ({ success: true, data: { bookings: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } }))
          : Promise.resolve({ success: true, data: { bookings: [], pagination: { total: 0, totalPages: 0, page: 1, limit: 1, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null } } }),
        apiRequest<StatsResponse>('/health/stats').catch(() => ({ success: true, data: { properties: 0, happyGuests: 0, cities: 0 } })),
      ]);

      // Calculate totals from pagination if available, or use counts
      // This is a simplified version - you may need to adjust based on your backend response
      return {
        success: true,
        data: {
          totalUsers: usersRes.data?.pagination?.total || 0,
          totalProperties: platformStats.data.properties,
          totalBookings: bookingsRes.data?.pagination?.total || 0,
          totalRevenue: 0, // This would need a separate endpoint
          usersChange: 0, // This would need historical data
          propertiesChange: 0,
          bookingsChange: 0,
          revenueChange: 0,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

