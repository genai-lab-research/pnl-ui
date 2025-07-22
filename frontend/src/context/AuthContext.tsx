import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  AuthContextType, 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthError 
} from '../types/auth';
import { authService } from '../api/authService';
import { TokenStorage } from '../utils/tokenStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token && TokenStorage.isTokenValid();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check for existing token
      const storedToken = TokenStorage.getAccessToken();
      const storedUser = TokenStorage.getUser();
      
      if (storedToken && storedUser && TokenStorage.isTokenValid()) {
        setToken(storedToken);
        setUser(storedUser);
        
        // Verify token with server
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.warn('Token verification failed:', error);
          await handleLogout();
        }
      } else {
        // Try auto-login if configured
        const authResponse = await authService.autoLogin();
        if (authResponse) {
          setToken(authResponse.access_token);
          setUser(authResponse.user);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      await handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authService.refreshToken();
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Token refresh failed:', error);
      await handleLogout();
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await handleLogout();
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;