import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService, AuthError } from '../authService';
import { tokenStorage } from '../../utils/tokenStorage';
import { LoginRequest, RegisterRequest } from '../../types/auth';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock tokenStorage
vi.mock('../../utils/tokenStorage', () => ({
  tokenStorage: {
    getAccessToken: vi.fn(),
    setToken: vi.fn(),
    setUser: vi.fn(),
    clearToken: vi.fn(),
    getRefreshToken: vi.fn(),
    getUser: vi.fn(),
    createTokenStorage: vi.fn(),
  },
  setAuthToken: vi.fn(),
  clearAuthData: vi.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = AuthService.getInstance('/api/v1');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    const loginCredentials: LoginRequest = {
      username: 'testuser',
      password: 'testpassword',
    };

    const mockLoginResponse = {
      access_token: 'mock-token',
      token_type: 'bearer',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      expires_in: 3600,
    };

    it('should login successfully with valid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockLoginResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await authService.login(loginCredentials);

      expect(result.access_token).toBe(mockLoginResponse.access_token);
      expect(result.token_type).toBe(mockLoginResponse.token_type);
      expect(result.user.username).toBe(mockLoginResponse.user.username);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );
    });

    it('should throw AuthError on failed login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Invalid credentials' }),
      });

      await expect(authService.login(loginCredentials)).rejects.toThrow(AuthError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.login(loginCredentials)).rejects.toThrow('Network error');
    });

    it('should store token and user data on successful login', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockLoginResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      vi.mocked(tokenStorage.createTokenStorage).mockReturnValue({
        token: 'mock-token',
        expiresAt: Date.now() + 3600000,
      });

      await authService.login(loginCredentials);

      expect(tokenStorage.setToken).toHaveBeenCalled();
      expect(tokenStorage.setUser).toHaveBeenCalledWith(mockLoginResponse.user);
    });
  });

  describe('register', () => {
    const registerData: RegisterRequest = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'newpassword',
    };

    const mockRegisterResponse = {
      user: {
        id: 2,
        username: 'newuser',
        email: 'newuser@example.com',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      message: 'User registered successfully',
    };

    it('should register successfully with valid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockRegisterResponse,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await authService.register(registerData);

      expect(result).toEqual(mockRegisterResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(registerData),
        })
      );
    });

    it('should throw AuthError on registration failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Username already exists' }),
      });

      await expect(authService.register(registerData)).rejects.toThrow(AuthError);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await authService.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/logout',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(tokenStorage.clearToken).toHaveBeenCalled();
    });

    it('should clear local data even if server logout fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await authService.logout();

      expect(tokenStorage.clearToken).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      vi.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token');
      vi.mocked(tokenStorage.createTokenStorage).mockReturnValue({
        token: 'new-token',
        expiresAt: Date.now() + 3600000,
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ access_token: 'new-token', expires_in: 3600 }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await authService.refreshToken();

      expect(result).toBe('new-token');
      expect(tokenStorage.setToken).toHaveBeenCalled();
    });

    it('should throw error if no refresh token available', async () => {
      vi.mocked(tokenStorage.getRefreshToken).mockReturnValue(null);

      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
    });

    it('should clear auth data on refresh failure', async () => {
      vi.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Invalid refresh token' }),
      });

      await expect(authService.refreshToken()).rejects.toThrow(AuthError);
      expect(tokenStorage.clearToken).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should get current user successfully', async () => {
      vi.mocked(tokenStorage.getAccessToken).mockReturnValue('valid-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUser,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(tokenStorage.setUser).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error if not authenticated', async () => {
      vi.mocked(tokenStorage.getAccessToken).mockReturnValue(null);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Not authenticated' }),
      });

      await expect(authService.getCurrentUser()).rejects.toThrow(AuthError);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if valid token exists', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue({
        token: 'valid-token',
        expiresAt: Date.now() + 3600000,
      });
      vi.mocked(tokenStorage.isTokenExpired).mockReturnValue(false);

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if no token exists', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false if token is expired', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue({
        token: 'expired-token',
        expiresAt: Date.now() - 1000,
      });
      vi.mocked(tokenStorage.isTokenExpired).mockReturnValue(true);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', async () => {
      vi.mocked(tokenStorage.getAccessToken).mockReturnValue('valid-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 1, username: 'testuser', email: 'test@example.com' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await authService.validateToken();

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      vi.mocked(tokenStorage.getAccessToken).mockReturnValue('invalid-token');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Invalid token' }),
      });

      const result = await authService.validateToken();

      expect(result).toBe(false);
    });
  });
});