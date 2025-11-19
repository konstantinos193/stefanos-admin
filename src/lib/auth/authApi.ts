const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class AuthApi {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  async login(username: string, password: string) {
    // Convert username to email format for backend compatibility
    // If username doesn't contain @, treat it as username and find by username
    // Otherwise use as email
    const email = username.includes('@') ? username : `${username}@stefanos.com`
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Invalid credentials'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `Server error (${response.status})`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Handle different response formats from backend
      if (data.success) {
        if (data.data) {
          // Format: { success: true, data: { token, user } }
          return {
            token: data.data.token,
            user: data.data.user,
          }
        } else if (data.token) {
          // Format: { success: true, token, user }
          return {
            token: data.token,
            user: data.user,
          }
        }
      }

      throw new Error(data.message || 'Invalid response format')
    } catch (error: any) {
      // Handle network errors (Failed to fetch, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Cannot connect to server. Please ensure the backend is running at ${API_BASE_URL}`
        )
      }
      // Re-throw other errors as-is
      throw error
    }
  }

  async getCurrentUser() {
    if (!this.token) {
      throw new Error('Not authenticated')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get user')
      }

      return response.json()
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Cannot connect to server. Please ensure the backend is running at ${API_BASE_URL}`
        )
      }
      throw error
    }
  }
}

export const authApi = new AuthApi()

