export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Check for both 'admin_token' (used by auth) and 'token' (legacy)
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('admin_token') || localStorage.getItem('token')
    : null;
  
  const headers: HeadersInit = {
    ...apiConfig.headers,
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Don't log 401 errors - they're expected when not authenticated
    if (response.status === 401) {
      const error = await response.json().catch(() => ({ message: 'Unauthorized' }));
      throw new Error(error.message || 'Unauthorized');
    }
    
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

