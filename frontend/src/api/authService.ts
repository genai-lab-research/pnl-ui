import { apiConfig } from './config';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  TokenData, 
  AuthError 
} from '../types/auth';
import { TokenStorage } from '../utils/tokenStorage';
import { env } from '../utils/env';

class AuthService {
  private baseUrl: string;

  constructor(baseUrl: string = apiConfig.baseUrl) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: AuthError = {
        message: errorData.detail || errorData.message || `HTTP ${response.status}`,
        code: errorData.code || response.status.toString(),
        details: errorData
      };
      throw error;
    }
    return response.json();
  }

  private getAuthHeaders(): HeadersInit {
    const token = TokenStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    const authResponse = await this.handleResponse<AuthResponse>(response);
    
    // Store token and user data
    const tokenData: TokenData = {
      access_token: authResponse.access_token,
      token_type: authResponse.token_type,
      expires_in: authResponse.expires_in,
      refresh_token: authResponse.refresh_token,
      expires_at: Date.now() + (authResponse.expires_in * 1000)
    };

    TokenStorage.setToken(tokenData);
    TokenStorage.setUser(authResponse.user);

    return authResponse;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const authResponse = await this.handleResponse<AuthResponse>(response);
    
    // Auto-login after registration
    const tokenData: TokenData = {
      access_token: authResponse.access_token,
      token_type: authResponse.token_type,
      expires_in: authResponse.expires_in,
      refresh_token: authResponse.refresh_token,
      expires_at: Date.now() + (authResponse.expires_in * 1000)
    };

    TokenStorage.setToken(tokenData);
    TokenStorage.setUser(authResponse.user);

    return authResponse;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    const authResponse = await this.handleResponse<AuthResponse>(response);
    
    // Update stored token
    const tokenData: TokenData = {
      access_token: authResponse.access_token,
      token_type: authResponse.token_type,
      expires_in: authResponse.expires_in,
      refresh_token: authResponse.refresh_token,
      expires_at: Date.now() + (authResponse.expires_in * 1000)
    };

    TokenStorage.setToken(tokenData);
    TokenStorage.setUser(authResponse.user);

    return authResponse;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: this.getAuthHeaders()
    });

    const user = await this.handleResponse<User>(response);
    TokenStorage.setUser(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        console.warn('Logout endpoint failed, clearing local storage anyway');
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local storage
      TokenStorage.clearToken();
    }
  }

  async autoLogin(): Promise<AuthResponse | null> {
    if (!env.AUTO_LOGIN) return null;

    try {
      const response = await this.login({
        username: env.DEFAULT_USERNAME,
        password: env.DEFAULT_PASSWORD
      });
      return response;
    } catch (error) {
      console.warn('Auto-login failed:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return TokenStorage.isTokenValid();
  }

  getStoredUser(): User | null {
    return TokenStorage.getUser();
  }

  getStoredToken(): string | null {
    return TokenStorage.getAccessToken();
  }
}

export const authService = new AuthService();
export default authService;