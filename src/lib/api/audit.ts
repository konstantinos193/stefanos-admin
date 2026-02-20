import { apiRequest } from './config';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
}

export interface AuditLogsQuery {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface AuditStats {
  totalLogs: number;
  logsToday: number;
  logsThisWeek: number;
  topActions: Array<{ action: string; count: number }>;
  topEntities: Array<{ entityType: string; count: number }>;
  topUsers: Array<{ user: { name: string; email: string }; count: number }>;
  recentActivity: AuditLog[];
}

export interface AuditExportResponse {
  filename: string;
  data: string;
}

export const auditApi = {
  getAuditLogs: (query: AuditLogsQuery = {}): Promise<AuditLogsResponse> => 
    apiRequest('/audit-logs?' + new URLSearchParams(query as any).toString()),

  getAuditStats: (): Promise<AuditStats> => 
    apiRequest('/audit-logs/stats'),

  exportAuditLogs: (query: AuditLogsQuery = {}): Promise<AuditExportResponse> => 
    apiRequest('/audit-logs/export?' + new URLSearchParams(query as any).toString()),
};
