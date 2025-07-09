import { User, JWTPayload } from '../types/auth';
import { TokenStorage } from './tokenStorage';

/**
 * Decode JWT token payload without verification
 * Note: This is for client-side use only, server should always verify tokens
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  return payload?.exp ? payload.exp * 1000 : null;
}

/**
 * Check if user has specific role or permission
 */
export function hasRole(user: User | null, _role: string): boolean {
  // Implementation depends on your user role structure
  // This is a placeholder implementation
  return user?.is_active === true;
}

/**
 * Check if user can access resource
 */
export function canAccessResource(user: User | null, _resource: string): boolean {
  // Implementation depends on your permission structure
  // This is a placeholder implementation
  return user?.is_active === true;
}

/**
 * Format user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return user.full_name || user.username || user.email || 'User';
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User | null): string {
  if (!user) return 'G';
  
  const name = user.full_name || user.username || user.email;
  if (!name) return 'U';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

/**
 * Check authentication status
 */
export function isAuthenticated(): boolean {
  return TokenStorage.isTokenValid();
}

/**
 * Get stored user data
 */
export function getStoredUser(): User | null {
  return TokenStorage.getUser();
}

/**
 * Check if authentication is required for route
 */
export function requiresAuth(path: string): boolean {
  const publicPaths = ['/login', '/register', '/forgot-password', '/'];
  return !publicPaths.includes(path);
}

/**
 * Redirect to login if not authenticated
 */
export function redirectToLoginIfNeeded(currentPath: string): boolean {
  if (requiresAuth(currentPath) && !isAuthenticated()) {
    window.location.href = '/login';
    return true;
  }
  return false;
}

/**
 * Format authentication error for display
 */
export function formatAuthError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.detail) return error.detail;
  return 'Authentication failed';
}

/**
 * Check if token needs refresh (within 5 minutes of expiry)
 */
export function shouldRefreshToken(): boolean {
  const tokenData = TokenStorage.getToken();
  if (!tokenData) return false;
  
  const refreshThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
  const expirationTime = tokenData.expires_at;
  
  if (!expirationTime) return false;
  
  return Date.now() > (expirationTime - refreshThreshold);
}

/**
 * Get time until token expires (in milliseconds)
 */
export function getTimeUntilExpiry(): number | null {
  const tokenData = TokenStorage.getToken();
  if (!tokenData?.expires_at) return null;
  
  return Math.max(0, tokenData.expires_at - Date.now());
}

/**
 * Format time remaining until token expires
 */
export function formatTimeUntilExpiry(): string | null {
  const timeRemaining = getTimeUntilExpiry();
  if (!timeRemaining) return null;
  
  const minutes = Math.floor(timeRemaining / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  return 'Less than a minute';
}