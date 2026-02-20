import { apiRequest } from './config';

export interface ReportType {
  id: string;
  name: string;
  nameGr: string;
  description: string;
  descriptionGr: string;
  category: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  size: string;
  status: 'Ready' | 'Generating' | 'Failed';
  filePath?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateReportParams {
  type: string;
  period: string;
  startDate: string;
  endDate: string;
}

export const reportsApi = {
  // Get all reports for the current user
  getReports: async (): Promise<{ success: boolean; data: Report[] }> => {
    return apiRequest<{ success: boolean; data: Report[] }>('/reports');
  },

  // Generate a new report
  generateReport: async (params: GenerateReportParams): Promise<{ success: boolean; data: { message: string; reportId: string } }> => {
    const queryParams = new URLSearchParams();
    queryParams.append('type', params.type);
    queryParams.append('period', params.period);
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);

    return apiRequest<{ success: boolean; data: { message: string; reportId: string } }>(`/reports/generate?${queryParams.toString()}`, {
      method: 'POST',
    });
  },

  // Download a report
  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/download/${reportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    
    return response.blob();
  },

  // Get available report types
  getReportTypes: async (): Promise<{ success: boolean; data: ReportType[] }> => {
    return apiRequest<{ success: boolean; data: ReportType[] }>('/reports/types');
  },
};
