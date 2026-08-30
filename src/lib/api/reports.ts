import { apiRequest, API_BASE_URL } from './config';

export interface ReportType {
  id: string;
  name: string;
  nameGr: string;
  description: string;
  descriptionGr: string;
  category: string;
}

export interface ReportParams {
  type: string;
  period: string;
  startDate: string;
  endDate: string;
}

export interface DownloadedReport {
  blob: Blob;
  fileName: string;
}

function authHeaders(): Record<string, string> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token') || localStorage.getItem('token')
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const reportsApi = {
  async getReportTypes(): Promise<{ success: boolean; data: ReportType[] }> {
    return apiRequest<{ success: boolean; data: ReportType[] }>('/reports/types');
  },

  /** Generates and returns the CSV in one request — there is no stored report history. */
  async downloadReport(params: ReportParams): Promise<DownloadedReport> {
    const query = new URLSearchParams({
      type: params.type,
      period: params.period,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    const response = await fetch(`${API_BASE_URL}/reports/download?${query.toString()}`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (!response.ok) {
      const message = await response
        .json()
        .then((body) => body?.message)
        .catch(() => null);
      throw new Error(message || 'Η δημιουργία της αναφοράς απέτυχε.');
    }

    const disposition = response.headers.get('Content-Disposition') || '';
    const match = /filename="?([^";]+)"?/.exec(disposition);

    return {
      blob: await response.blob(),
      fileName: match?.[1] || `${params.type}.csv`,
    };
  },
};
