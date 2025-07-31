// API Services Index
// Centralized exports for all API services

// Authentication service
export {
  authService,
  isUserAuthenticated,
  getCurrentUser,
  performLogin,
  performLogout,
  performRegistration,
} from './authService';

export type { AuthError } from './authService';

// Container service
export {
  containerService,
  getAllContainers,
  getContainerById,
  createNewContainer,
  updateExistingContainer,
  deleteContainerById,
  getMetrics,
  shutdownContainerById,
} from './containerService';

// Service instances for direct access
export { AuthService } from './authService';
export { ContainerService } from './containerService';

// Common API utilities
export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// API configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export const defaultApiConfig: ApiConfig = {
  baseURL: '/api/v1',
  timeout: 30000, // 30 seconds
  retries: 3,
};

// Request interceptor type
export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

// Response interceptor type
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

// Global API utilities
export class ApiClient {
  private static requestInterceptors: RequestInterceptor[] = [];
  private static responseInterceptors: ResponseInterceptor[] = [];

  public static addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public static addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  public static async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    
    return modifiedConfig;
  }

  public static async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    
    return modifiedResponse;
  }
}

// Common HTTP methods with authentication
export const httpClient = {
  async get<T>(url: string, config: RequestInit = {}): Promise<T> {
    const finalConfig = await ApiClient.applyRequestInterceptors({
      method: 'GET',
      ...config,
    });
    
    const response = await fetch(url, finalConfig);
    const finalResponse = await ApiClient.applyResponseInterceptors(response);
    
    if (!finalResponse.ok) {
      throw new ApiError(`HTTP ${finalResponse.status}: ${finalResponse.statusText}`, finalResponse.status);
    }
    
    return finalResponse.json();
  },

  async post<T>(url: string, data?: any, config: RequestInit = {}): Promise<T> {
    const finalConfig = await ApiClient.applyRequestInterceptors({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
    
    const response = await fetch(url, finalConfig);
    const finalResponse = await ApiClient.applyResponseInterceptors(response);
    
    if (!finalResponse.ok) {
      throw new ApiError(`HTTP ${finalResponse.status}: ${finalResponse.statusText}`, finalResponse.status);
    }
    
    if (finalResponse.status === 204) {
      return {} as T;
    }
    
    return finalResponse.json();
  },

  async put<T>(url: string, data?: any, config: RequestInit = {}): Promise<T> {
    const finalConfig = await ApiClient.applyRequestInterceptors({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
    
    const response = await fetch(url, finalConfig);
    const finalResponse = await ApiClient.applyResponseInterceptors(response);
    
    if (!finalResponse.ok) {
      throw new ApiError(`HTTP ${finalResponse.status}: ${finalResponse.statusText}`, finalResponse.status);
    }
    
    return finalResponse.json();
  },

  async delete<T>(url: string, config: RequestInit = {}): Promise<T> {
    const finalConfig = await ApiClient.applyRequestInterceptors({
      method: 'DELETE',
      ...config,
    });
    
    const response = await fetch(url, finalConfig);
    const finalResponse = await ApiClient.applyResponseInterceptors(response);
    
    if (!finalResponse.ok) {
      throw new ApiError(`HTTP ${finalResponse.status}: ${finalResponse.statusText}`, finalResponse.status);
    }
    
    if (finalResponse.status === 204) {
      return {} as T;
    }
    
    return finalResponse.json();
  },
};

// Initialize global request interceptor for authentication
ApiClient.addRequestInterceptor(async (config) => {
  const { tokenStorage } = await import('../utils/tokenStorage');
  const token = tokenStorage.getAccessToken();
  
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  
  return config;
});

// Initialize global response interceptor for error handling
ApiClient.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    const { clearAuthData } = await import('../utils/tokenStorage');
    clearAuthData();
    
    // You might want to redirect to login page here
    // or dispatch a logout action
    console.warn('Authentication expired. Please log in again.');
  }
  
  return response;
});