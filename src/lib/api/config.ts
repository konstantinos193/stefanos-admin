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

  try {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Don't log 401 errors - they're expected when not authenticated
      if (response.status === 401) {
        let errorMessage = 'Unauthorized'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }
      
      let errorMessage = 'An error occurred'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `Server error (${response.status})`
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error: any) {
    // Handle network errors (Failed to fetch, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to server. Please ensure the backend is running at ${apiConfig.baseURL}`
      )
    }
    // Re-throw other errors as-is
    throw error
  }
}

