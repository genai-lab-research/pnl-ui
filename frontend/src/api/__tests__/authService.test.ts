import { authService } from '../authService';
import { TokenStorage } from '../../utils/tokenStorage';
import { env } from '../../utils/env';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

// Mock env
jest.mock('../../utils/env', () => ({
  env: {
    API_BASE_URL: '/api/v1',
    DEFAULT_USERNAME: 'testuser',
    DEFAULT_PASSWORD: 'testpassword',
    AUTO_LOGIN: true
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockAuthResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      } as Response);

      const result = await authService.login({
        username: 'testuser',
        password: 'testpassword'
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/login', {
        method: 'POST',
        body: expect.any(FormData)
      });

      expect(result).toEqual(mockAuthResponse);
      expect(mockTokenStorage.setToken).toHaveBeenCalledWith({
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        expires_at: expect.any(Number)
      });
      expect(mockTokenStorage.setUser).toHaveBeenCalledWith(mockAuthResponse.user);
    });

    it('should handle login failure', async () => {
      const mockError = {
        detail: 'Invalid credentials'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(mockError)
      } as Response);

      await expect(authService.login({
        username: 'invalid',
        password: 'invalid'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockAuthResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 1,
          email: 'newuser@example.com',
          username: 'newuser',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      } as Response);

      const result = await authService.register({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'newpassword'
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'newpassword'
        })
      });

      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockTokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');

      const mockAuthResponse = {
        access_token: 'new-mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      } as Response);

      const result = await authService.refreshToken();

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: 'mock-refresh-token' })
      });

      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error when no refresh token available', async () => {
      mockTokenStorage.getRefreshToken.mockReturnValue(null);

      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      mockTokenStorage.getAccessToken.mockReturnValue('mock-token');

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      } as Response);

      const result = await authService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        }
      });

      expect(result).toEqual(mockUser);
      expect(mockTokenStorage.setUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockTokenStorage.getAccessToken.mockReturnValue('mock-token');

      mockFetch.mockResolvedValueOnce({
        ok: true
      } as Response);

      await authService.logout();

      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token'
        }
      });

      expect(mockTokenStorage.clearToken).toHaveBeenCalled();
    });

    it('should clear token even if logout endpoint fails', async () => {
      mockTokenStorage.getAccessToken.mockReturnValue('mock-token');

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      } as Response);

      await authService.logout();

      expect(mockTokenStorage.clearToken).toHaveBeenCalled();
    });
  });

  describe('autoLogin', () => {
    it('should auto-login when enabled', async () => {
      const mockAuthResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      } as Response);

      const result = await authService.autoLogin();

      expect(result).toEqual(mockAuthResponse);
    });

    it('should return null when auto-login is disabled', async () => {
      // Mock env to disable auto-login
      jest.doMock('../../utils/env', () => ({
        env: {
          ...env,
          AUTO_LOGIN: false
        }
      }));

      const result = await authService.autoLogin();
      expect(result).toBeNull();
    });
  });

  describe('utility methods', () => {
    it('should check authentication status', () => {
      mockTokenStorage.isTokenValid.mockReturnValue(true);
      expect(authService.isAuthenticated()).toBe(true);

      mockTokenStorage.isTokenValid.mockReturnValue(false);
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should get stored user', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      mockTokenStorage.getUser.mockReturnValue(mockUser);
      expect(authService.getStoredUser()).toEqual(mockUser);
    });

    it('should get stored token', () => {
      mockTokenStorage.getAccessToken.mockReturnValue('mock-token');
      expect(authService.getStoredToken()).toBe('mock-token');
    });
  });
});