import { TokenStorage, TokenPayload } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export class TokenStorageManager {
  private static instance: TokenStorageManager;
  private storage: Storage;

  private constructor() {
    // Use localStorage as primary, sessionStorage as fallback
    this.storage = this.getAvailableStorage();
  }

  public static getInstance(): TokenStorageManager {
    if (!TokenStorageManager.instance) {
      TokenStorageManager.instance = new TokenStorageManager();
    }
    return TokenStorageManager.instance;
  }

  private getAvailableStorage(): Storage {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return localStorage;
    } catch {
      try {
        const testKey = '__storage_test__';
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        return sessionStorage;
      } catch {
        // Fallback to in-memory storage for environments where storage is disabled
        return this.createMemoryStorage();
      }
    }
  }

  private createMemoryStorage(): Storage {
    const store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(key => delete store[key]); },
      key: (index: number) => Object.keys(store)[index] || null,
      length: Object.keys(store).length
    };
  }

  public setToken(tokenData: TokenStorage): void {
    try {
      const serializedData = JSON.stringify(tokenData);
      this.storage.setItem(TOKEN_KEY, serializedData);
    } catch (error) {
      console.error('Failed to store token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  public getToken(): TokenStorage | null {
    try {
      const serializedData = this.storage.getItem(TOKEN_KEY);
      if (!serializedData) return null;

      const tokenData: TokenStorage = JSON.parse(serializedData);
      
      // Check if token is expired
      if (this.isTokenExpired(tokenData)) {
        this.clearToken();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      this.clearToken(); // Clear corrupted data
      return null;
    }
  }

  public getAccessToken(): string | null {
    const tokenData = this.getToken();
    return tokenData?.token || null;
  }

  public setRefreshToken(refreshToken: string): void {
    try {
      this.storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  public getRefreshToken(): string | null {
    try {
      return this.storage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  public clearToken(): void {
    try {
      this.storage.removeItem(TOKEN_KEY);
      this.storage.removeItem(REFRESH_TOKEN_KEY);
      this.storage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  public isTokenExpired(tokenData?: TokenStorage): boolean {
    const token = tokenData || this.getToken();
    if (!token) return true;

    const currentTime = Date.now();
    const expirationTime = token.expiresAt;
    
    // Add 5-minute buffer before expiration
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return currentTime + bufferTime >= expirationTime;
  }

  public shouldRefreshToken(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) return false;

    const currentTime = Date.now();
    const expirationTime = tokenData.expiresAt;
    
    // Refresh if token expires within 10 minutes
    const refreshThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    return currentTime + refreshThreshold >= expirationTime;
  }

  public parseTokenPayload(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = parts[1];
      const decodedPayload = this.base64UrlDecode(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to parse token payload:', error);
      return null;
    }
  }

  private base64UrlDecode(str: string): string {
    // Replace URL-safe characters and add padding
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    try {
      return atob(base64);
    } catch (error) {
      throw new Error('Invalid base64 encoding');
    }
  }

  public createTokenStorage(token: string, expiresIn?: number): TokenStorage {
    const payload = this.parseTokenPayload(token);
    let expiresAt: number;

    if (payload?.exp) {
      // Token has expiration claim (Unix timestamp in seconds)
      expiresAt = payload.exp * 1000; // Convert to milliseconds
    } else if (expiresIn) {
      // Use provided expiration time (in seconds)
      expiresAt = Date.now() + (expiresIn * 1000);
    } else {
      // Default to 1 hour if no expiration info available
      expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour
    }

    return {
      token,
      expiresAt
    };
  }

  public setUser(user: any): void {
    try {
      const serializedUser = JSON.stringify(user);
      this.storage.setItem(USER_KEY, serializedUser);
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  public getUser(): any | null {
    try {
      const serializedUser = this.storage.getItem(USER_KEY);
      return serializedUser ? JSON.parse(serializedUser) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  public isStorageAvailable(): boolean {
    try {
      const testKey = '__test_key__';
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const tokenStorage = TokenStorageManager.getInstance();

// Utility functions for easier access
export const setAuthToken = (token: string, expiresIn?: number): void => {
  const tokenData = tokenStorage.createTokenStorage(token, expiresIn);
  tokenStorage.setToken(tokenData);
};

export const getAuthToken = (): string | null => tokenStorage.getAccessToken();

export const clearAuthData = (): void => tokenStorage.clearToken();

export const isAuthenticated = (): boolean => {
  const token = tokenStorage.getToken();
  return token !== null && !tokenStorage.isTokenExpired(token);
};

export const shouldRefreshAuthToken = (): boolean => tokenStorage.shouldRefreshToken();

export const parseJWTPayload = (token: string): TokenPayload | null => 
  tokenStorage.parseTokenPayload(token);