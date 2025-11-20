export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Global logout handler - will be set by AuthProvider
let globalLogoutHandler: (() => void) | null = null;

export function setGlobalLogoutHandler(handler: () => void) {
  globalLogoutHandler = handler;
}

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
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          localStorage.removeItem('token')
        }
        
        // Call global logout handler if available
        if (globalLogoutHandler) {
          globalLogoutHandler()
        } else if (typeof window !== 'undefined') {
          // Fallback: redirect to login if handler not set
          window.location.href = '/login'
        }
        
        let errorMessage = 'Invalid or expired token'
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

