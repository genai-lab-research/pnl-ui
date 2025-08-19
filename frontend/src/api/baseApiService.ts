import { tokenStorage } from '../utils/tokenStorage';

/**
 * Base API Service implementing unified authentication pattern
 * All API services MUST extend this class for consistent authentication handling
 * as per p4_description.md requirements
 */
export abstract class BaseApiService {
  protected baseURL: string;

  constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication headers with JWT token
   * Authentication handled automatically via tokenStorage
   */
  protected getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = tokenStorage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle response and automatic token refresh
   * Implements automatic authentication flow as per p4_description.md
   */
  protected async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized with automatic token refresh
    if (response.status === 401) {
      try {
        // Attempt token refresh
        const { authService } = await import('./authService');
        await authService.refreshToken();
        
        // If refresh succeeds, throw error to indicate retry is needed
        throw new Error('TOKEN_REFRESH_SUCCESS');
      } catch (refreshError) {
        // If refresh fails, clear credentials and redirect to login
        tokenStorage.clearToken();
        throw new Error('Authentication required. Please log in again.');
      }
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }

    // Handle other error responses
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // For non-JSON responses, return as text
    const text = await response.text();
    return text as unknown as T;
  }

  /**
   * Handle error responses with proper error messages
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        
        // Handle FastAPI validation errors
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
              .join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        }
      }
    } catch {
      // Use default error message if JSON parsing fails
    }

    throw new Error(errorMessage);
  }

  /**
   * Make authenticated request with automatic retry on token refresh
   */
  protected async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_REFRESH_SUCCESS') {
        // Retry the request with new token
        const retryConfig: RequestInit = {
          ...options,
          headers: {
            ...this.getHeaders(),
            ...options?.headers,
          },
        };
        
        const retryResponse = await fetch(url, retryConfig);
        return await this.handleResponse<T>(retryResponse);
      }
      
      throw error;
    }
  }

  /**
   * HTTP GET method with authentication
   */
  protected async get<T>(endpoint: string): Promise<T> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * HTTP POST method with authentication
   */
  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * HTTP PUT method with authentication
   */
  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * HTTP DELETE method with authentication
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * HTTP PATCH method with authentication
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeAuthenticatedRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}