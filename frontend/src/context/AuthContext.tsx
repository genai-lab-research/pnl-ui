import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  AuthState,
  AuthContextType,
  AuthAction,
  AuthActionTypes,
  LoginRequest,
  RegisterRequest,
} from '../types/auth';
import { authService, AuthError } from '../api/authService';
import { tokenStorage } from '../utils/tokenStorage';
import { getTestUserEmail, getDevTokenPrefix, getDefaultCredentials } from '../utils/env';

// Default user for development - using environment variables
const getDefaultUser = () => {
  const credentials = getDefaultCredentials();
  const testEmail = getTestUserEmail();
  
  return {
    id: 1,
    username: credentials.username || 'guest',
    email: testEmail || 'guest@example.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Default token for development - using environment variables
const getDefaultToken = () => getDevTokenPrefix() + Date.now();

// Initial auth state - unauthenticated by default, will be set during initialization
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
    case AuthActionTypes.REGISTER_REQUEST:
    case AuthActionTypes.REFRESH_TOKEN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.LOGIN_FAILURE:
    case AuthActionTypes.REGISTER_FAILURE:
    case AuthActionTypes.REFRESH_TOKEN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    default:
      return state;
  }
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = tokenStorage.getAccessToken();
        const storedUser = tokenStorage.getUser();

        const tokenPrefix = getDevTokenPrefix();
        if (storedToken && storedUser && !storedToken.startsWith(tokenPrefix)) {
          // Validate real backend token by fetching current user
          try {
            const currentUser = await authService.getCurrentUser();
            dispatch({
              type: AuthActionTypes.LOGIN_SUCCESS,
              payload: { user: currentUser, token: storedToken },
            });
            return;
          } catch (error) {
            console.warn('Stored token invalid, clearing auth:', error);
            tokenStorage.clearToken();
          }
        }

        // No valid token found, set as unauthenticated and let AutoLogin handle authentication
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: { isLoading: false },
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: { isLoading: false },
        });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token when needed
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.token) return;

    const checkAndRefreshToken = async () => {
      if (authService.shouldRefreshToken()) {
        try {
          dispatch({ type: AuthActionTypes.REFRESH_TOKEN_REQUEST });
          const newToken = await authService.refreshToken();
          dispatch({
            type: AuthActionTypes.REFRESH_TOKEN_SUCCESS,
            payload: { token: newToken },
          });
        } catch (error) {
          const errorMessage = error instanceof AuthError ? error.message : 'Token refresh failed';
          dispatch({
            type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
            payload: { error: errorMessage },
          });
        }
      }
    };

    // Check token refresh every 5 minutes
    const refreshInterval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // Check immediately
    checkAndRefreshToken();

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, authState.token]);

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_REQUEST });
      const response = await authService.login(credentials);
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { user: response.user, token: response.access_token },
      });
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : 'Login failed';
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: AuthActionTypes.REGISTER_REQUEST });
      const response = await authService.register(userData);
      
      dispatch({
        type: AuthActionTypes.REGISTER_SUCCESS,
        payload: { user: response.user },
      });

      // Auto-login after successful registration
      try {
        await login({ username: userData.username, password: userData.password });
      } catch (loginError) {
        console.warn('Auto-login after registration failed:', loginError);
      }
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : 'Registration failed';
      dispatch({
        type: AuthActionTypes.REGISTER_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      dispatch({ type: AuthActionTypes.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      dispatch({ type: AuthActionTypes.REFRESH_TOKEN_REQUEST });
      const newToken = await authService.refreshToken();
      dispatch({
        type: AuthActionTypes.REFRESH_TOKEN_SUCCESS,
        payload: { token: newToken },
      });
    } catch (error) {
      const errorMessage = error instanceof AuthError ? error.message : 'Token refresh failed';
      dispatch({
        type: AuthActionTypes.REFRESH_TOKEN_FAILURE,
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    authState,
    login,
    register,
    logout,
    clearError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook for auth state only
export const useAuthState = (): AuthState => {
  const { authState } = useAuth();
  return authState;
};

// Custom hook for auth actions only
export const useAuthActions = () => {
  const { login, register, logout, clearError, refreshToken } = useAuth();
  return { login, register, logout, clearError, refreshToken };
};

// Higher-order component for protected routes
interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  fallback = <div>Please log in to access this page</div> 
}) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component to automatically login for development
interface AutoLoginProps {
  username?: string;
  password?: string;
  enabled?: boolean;
}

export const AutoLogin: React.FC<AutoLoginProps> = ({ 
  username, 
  password,
  enabled = false 
}) => {
  const defaultCredentials = getDefaultCredentials();
  const finalUsername = username || defaultCredentials.username;
  const finalPassword = password || defaultCredentials.password;
  const { authState, login } = useAuth();

  useEffect(() => {
    if (enabled && !authState.isLoading && !authState.isAuthenticated) {
      const performAutoLogin = async () => {
        if (!finalUsername || !finalPassword) {
          console.warn('Auto-login disabled: no credentials configured');
          return;
        }
        
        try {
          await login({ username: finalUsername, password: finalPassword });
          console.log('Auto-login successful - connected to backend');
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      };

      // Add a small delay to ensure the auth context is fully initialized
      const timer = setTimeout(performAutoLogin, 100);
      return () => clearTimeout(timer);
    }
  }, [enabled, authState.isAuthenticated, authState.isLoading, login, finalUsername, finalPassword]);

  return null;
};