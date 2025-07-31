import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  AuthError
} from '../types/auth';
import { tokenStorage, setAuthToken, clearAuthData } from '../utils/tokenStorage';
import { getApiBaseUrl } from '../utils/env';

export class AuthService {
  private baseURL: string;
  private static instance: AuthService;

  private constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
  }

  public static getInstance(baseURL?: string): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(baseURL);
    }
    return AuthService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = tokenStorage.getAccessToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // For non-JSON responses, return the text
      const text = await response.text();
      return text as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message);
      }
      throw new AuthError('Network request failed');
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData: any = null;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
        
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

    // Handle 401 Unauthorized - clear stored auth data
    if (response.status === 401) {
      clearAuthData();
      errorMessage = 'Authentication required. Please log in again.';
    }

    const authError = new AuthError(errorMessage);
    authError.status = response.status;
    throw authError;
  }

  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Create URL-encoded form data for OAuth2 login
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await this.makeRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      // Store the token
      if (response.access_token) {
        setAuthToken(response.access_token, response.expires_in);
        
        // Fetch user info separately
        try {
          const userInfo = await this.getCurrentUser();
          tokenStorage.setUser(userInfo);
          // Return the expected LoginResponse format
          return {
            access_token: response.access_token,
            token_type: response.token_type,
            expires_in: response.expires_in,
            user: userInfo
          };
        } catch (userError) {
          // If we can't get user info, still return the token data
          const defaultUser: User = { 
            username: credentials.username, 
            is_active: true, 
            id: 1,
            email: `${credentials.username}@example.com`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          tokenStorage.setUser(defaultUser);
          return {
            access_token: response.access_token,
            token_type: response.token_type,
            expires_in: response.expires_in,
            user: defaultUser
          };
        }
      }

      throw new AuthError('No access token received');
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Login failed. Please check your credentials.');
    }
  }

  public async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.makeRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Registration failed. Please try again.');
    }
  }

  public async logout(): Promise<void> {
    try {
      // Attempt to logout on server (if endpoint exists)
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local auth data
      clearAuthData();
    }
  }

  public async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new AuthError('No refresh token available');
    }

    try {
      const response = await this.makeRequest<{ access_token: string; expires_in?: number }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.access_token) {
        setAuthToken(response.access_token, response.expires_in);
        return response.access_token;
      }

      throw new AuthError('Invalid refresh token response');
    } catch (error) {
      // Clear auth data if refresh fails
      clearAuthData();
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Token refresh failed. Please log in again.');
    }
  }

  public async getCurrentUser(): Promise<User> {
    try {
      const response = await this.makeRequest<User>('/auth/me');
      
      // Update stored user data
      tokenStorage.setUser(response);
      
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Failed to get current user information');
    }
  }

  public async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.makeRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Failed to change password');
    }
  }

  public async resetPassword(email: string): Promise<void> {
    try {
      await this.makeRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Failed to send password reset email');
    }
  }

  public isAuthenticated(): boolean {
    const token = tokenStorage.getToken();
    return token !== null && !tokenStorage.isTokenExpired(token);
  }

  public shouldRefreshToken(): boolean {
    return tokenStorage.shouldRefreshToken();
  }

  public getCurrentUserFromStorage(): User | null {
    return tokenStorage.getUser();
  }
}

// Create and export singleton instance with environment API URL
export const authService = AuthService.getInstance(getApiBaseUrl());

// Export error class for external use
export { AuthError } from '../types/auth';

// Utility functions for common auth operations
export const isUserAuthenticated = (): boolean => authService.isAuthenticated();

export const getCurrentUser = (): User | null => authService.getCurrentUserFromStorage();

export const performLogin = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return authService.login(credentials);
};

export const performLogout = async (): Promise<void> => {
  return authService.logout();
};

export const performRegistration = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  return authService.register(userData);
};