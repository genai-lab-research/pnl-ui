export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
  expires_in?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

export interface TokenPayload {
  sub: string;
  username: string;
  exp: number;
  iat: number;
}

export class AuthError extends Error {
  public status?: number;
  public field?: string;

  constructor(message: string, status?: number, field?: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.field = field;
  }
}

export interface TokenStorage {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

export enum AuthActionTypes {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',
  CLEAR_ERROR = 'CLEAR_ERROR',
  REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST',
  REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILURE = 'REFRESH_TOKEN_FAILURE',
  SET_LOADING = 'SET_LOADING',
}

export type AuthAction =
  | { type: AuthActionTypes.LOGIN_REQUEST }
  | { type: AuthActionTypes.LOGIN_SUCCESS; payload: { user: User; token: string } }
  | { type: AuthActionTypes.LOGIN_FAILURE; payload: { error: string } }
  | { type: AuthActionTypes.REGISTER_REQUEST }
  | { type: AuthActionTypes.REGISTER_SUCCESS; payload: { user: User } }
  | { type: AuthActionTypes.REGISTER_FAILURE; payload: { error: string } }
  | { type: AuthActionTypes.LOGOUT }
  | { type: AuthActionTypes.CLEAR_ERROR }
  | { type: AuthActionTypes.REFRESH_TOKEN_REQUEST }
  | { type: AuthActionTypes.REFRESH_TOKEN_SUCCESS; payload: { token: string } }
  | { type: AuthActionTypes.REFRESH_TOKEN_FAILURE; payload: { error: string } }
  | { type: AuthActionTypes.SET_LOADING; payload: { isLoading: boolean } };

export interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  userKey: string;
  baseURL: string;
  loginEndpoint: string;
  registerEndpoint: string;
  refreshEndpoint: string;
  logoutEndpoint: string;
  tokenExpirationBuffer: number; // minutes before expiration to refresh
}