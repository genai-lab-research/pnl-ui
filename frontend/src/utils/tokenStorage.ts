import { TokenData } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export class TokenStorage {
  private static useSessionStorage = false;

  private static getStorage(): Storage {
    return this.useSessionStorage ? sessionStorage : localStorage;
  }

  static setToken(tokenData: TokenData): void {
    try {
      const storage = this.getStorage();
      storage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
      if (tokenData.refresh_token) {
        storage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
      }
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  static getToken(): TokenData | null {
    try {
      const storage = this.getStorage();
      const tokenStr = storage.getItem(TOKEN_KEY);
      if (!tokenStr) return null;
      
      const tokenData: TokenData = JSON.parse(tokenStr);
      
      // Check if token is expired
      if (tokenData.expires_at && Date.now() > tokenData.expires_at) {
        this.clearToken();
        return null;
      }
      
      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      this.clearToken();
      return null;
    }
  }

  static getAccessToken(): string | null {
    const tokenData = this.getToken();
    return tokenData?.access_token || null;
  }

  static getRefreshToken(): string | null {
    try {
      const storage = this.getStorage();
      return storage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  static clearToken(): void {
    try {
      const storage = this.getStorage();
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(REFRESH_TOKEN_KEY);
      storage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  static setUser(user: any): void {
    try {
      const storage = this.getStorage();
      storage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  static getUser(): any | null {
    try {
      const storage = this.getStorage();
      const userStr = storage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  static isTokenValid(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) return false;
    
    // Check if token exists and is not expired
    return Boolean(tokenData.access_token) && 
           (!tokenData.expires_at || Date.now() < tokenData.expires_at);
  }

  static getTokenExpiration(): number | null {
    const tokenData = this.getToken();
    return tokenData?.expires_at || null;
  }

  static setStorageType(useSession: boolean): void {
    this.useSessionStorage = Boolean(useSession);
  }
}