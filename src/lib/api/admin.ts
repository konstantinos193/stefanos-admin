import { apiRequest } from './config';
import { AdminDashboardResponse } from './types';

export const adminApi = {
  async getDashboardStats(): Promise<AdminDashboardResponse> {
    return apiRequest<AdminDashboardResponse>('/admin/dashboard');
  },
};
