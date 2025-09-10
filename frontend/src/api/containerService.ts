import {
  Container,
  ContainerListResponse,
  CreateContainerRequest,
  UpdateContainerRequest,
  ContainerFilterCriteria,
  FilterOptions,
  ShutdownRequest,
  ShutdownResponse,
  ContainerTrendData,
} from '../types/containers';
import {
  PerformanceMetrics,
  MetricsFilterCriteria,
} from '../types/metrics';
import {
  EnvironmentStatus,
  EnvironmentLinks,
  IframeConfiguration,
  ExternalUrlConfiguration,
  EnvironmentConnectionRequest,
  EnvironmentConnectionResponse,
  EnvironmentSystemHealth,
  SessionRefreshResponse,
  UpdateEnvironmentLinksRequest,
  UpdateEnvironmentLinksResponse,
} from '../types/environment';
import {
  ActiveRecipe,
  RecipeApplication,
  RecipeVersion,
  ApplyRecipeRequest,
  ApplyRecipeResponse,
  RecipeHistoryQueryParams,
  AvailableRecipesQueryParams,
} from '../types/recipes';
import { tokenStorage } from '../utils/tokenStorage';
import { getApiBaseUrl } from '../utils/env';

export class ContainerService {
  private baseURL: string;
  private static instance: ContainerService;

  private constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
  }

  public static getInstance(baseURL?: string): ContainerService {
    if (!ContainerService.instance) {
      ContainerService.instance = new ContainerService(baseURL);
    }
    return ContainerService.instance;
  }

  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get the current token
    const token = tokenStorage.getAccessToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response statuses
      if (response.status === 401) {
        // Token expired or invalid, clear auth data
        tokenStorage.clearToken();
        throw new Error('Authentication required. Please log in again.');
      }

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // For non-JSON responses, return the text
      const text = await response.text();
      return text as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        
        // Handle FastAPI validation errors
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
              .join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        }
      }
    } catch {
      // Use default error message if JSON parsing fails
    }

    throw new Error(errorMessage);
  }

  private buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => [key, String(value)]);
    
    if (filtered.length === 0) return '';
    
    const searchParams = new URLSearchParams(filtered);
    return `?${searchParams.toString()}`;
  }

  // Container CRUD Operations

  /**
   * Get a list of containers with optional filtering and pagination
   */
  public async getContainers(filters: ContainerFilterCriteria = {}): Promise<ContainerListResponse> {
    const queryString = this.buildQueryString(filters);
    return this.makeAuthenticatedRequest<ContainerListResponse>(`/containers/${queryString}`);
  }

  /**
   * Get a specific container by ID
   */
  public async getContainer(id: number): Promise<Container> {
    return this.makeAuthenticatedRequest<Container>(`/containers/${id}`);
  }

  /**
   * Create a new container
   */
  public async createContainer(containerData: CreateContainerRequest): Promise<Container> {
    return this.makeAuthenticatedRequest<Container>('/containers/', {
      method: 'POST',
      body: JSON.stringify(containerData),
    });
  }

  /**
   * Update an existing container
   */
  public async updateContainer(id: number, containerData: UpdateContainerRequest): Promise<Container> {
    return this.makeAuthenticatedRequest<Container>(`/containers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(containerData),
    });
  }

  /**
   * Delete a container
   */
  public async deleteContainer(id: number): Promise<void> {
    return this.makeAuthenticatedRequest<void>(`/containers/${id}`, {
      method: 'DELETE',
    });
  }

  // Performance Metrics

  /**
   * Get performance metrics with optional filtering
   */
  public async getPerformanceMetrics(filters: MetricsFilterCriteria = {}): Promise<PerformanceMetrics> {
    const queryString = this.buildQueryString(filters);
    return this.makeAuthenticatedRequest<PerformanceMetrics>(`/containers/metrics${queryString}`);
  }

  /**
   * Get performance trend data for a specific container
   */
  public async getContainerMetrics(id: number, days: number = 30): Promise<ContainerTrendData> {
    const queryString = this.buildQueryString({ days });
    return this.makeAuthenticatedRequest<ContainerTrendData>(`/containers/${id}/metrics${queryString}`);
  }

  // Filter Options

  /**
   * Get available filter options for the dashboard
   */
  public async getFilterOptions(): Promise<FilterOptions> {
    return this.makeAuthenticatedRequest<FilterOptions>('/containers/filter-options');
  }

  // Container Operations

  /**
   * Shutdown a container
   */
  public async shutdownContainer(id: number, shutdownData: ShutdownRequest = {}): Promise<ShutdownResponse> {
    return this.makeAuthenticatedRequest<ShutdownResponse>(`/containers/${id}/shutdown`, {
      method: 'POST',
      body: JSON.stringify(shutdownData),
    });
  }

  // Tenant-specific operations

  /**
   * Get containers for a specific tenant
   */
  public async getContainersByTenant(
    tenantId: number, 
    page: number = 1, 
    limit: number = 10
  ): Promise<Container[]> {
    const queryString = this.buildQueryString({ page, limit });
    return this.makeAuthenticatedRequest<Container[]>(`/containers/tenant/${tenantId}${queryString}`);
  }

  /**
   * Get containers with active alerts
   */
  public async getContainersWithActiveAlerts(): Promise<Container[]> {
    return this.makeAuthenticatedRequest<Container[]>('/containers/alerts/active');
  }

  // Utility methods

  /**
   * Check if the service is authenticated
   */
  public isAuthenticated(): boolean {
    const token = tokenStorage.getToken();
    return token !== null && !tokenStorage.isTokenExpired(token);
  }

  /**
   * Refresh authentication token if needed
   */
  public async ensureAuthenticated(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (tokenStorage.shouldRefreshToken()) {
      try {
        // Import authService to avoid circular dependency
        const { authService } = await import('./authService');
        await authService.refreshToken();
      } catch (error) {
        throw new Error('Authentication refresh failed. Please log in again.');
      }
    }
  }

  /**
   * Batch operations for multiple containers
   */
  public async batchUpdateContainers(
    updates: Array<{ id: number; data: UpdateContainerRequest }>
  ): Promise<Container[]> {
    const promises = updates.map(({ id, data }) => this.updateContainer(id, data));
    return Promise.all(promises);
  }

  /**
   * Search containers by name or description
   */
  public async searchContainers(
    query: string, 
    filters: Omit<ContainerFilterCriteria, 'search'> = {}
  ): Promise<ContainerListResponse> {
    return this.getContainers({ ...filters, search: query });
  }

  /**
   * Get containers summary statistics
   */
  public async getContainerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byPurpose: Record<string, number>;
    withAlerts: number;
  }> {
    const response = await this.getContainers({ limit: 1 }); // Get minimal data for stats
    const { pagination } = response;
    
    // For detailed stats, you might want to make additional API calls
    // or have a dedicated stats endpoint in the backend
    return {
      total: pagination.total,
      active: 0, // This would need to be calculated from the actual data
      inactive: 0,
      byType: {},
      byPurpose: {},
      withAlerts: 0,
    };
  }

  // Container Overview API methods

  /**
   * Get comprehensive overview data for a specific container
   */
  public async getContainerOverview(
    id: number,
    timeRange: string = 'week',
    metricInterval: string = 'day'
  ): Promise<any> {
    const queryString = this.buildQueryString({ time_range: timeRange, metric_interval: metricInterval });
    return this.makeAuthenticatedRequest<any>(`/containers/${id}/overview${queryString}`);
  }

  /**
   * Get metric snapshots for dashboard charts
   */
  public async getMetricSnapshots(
    id: number,
    startDate?: string,
    endDate?: string,
    interval: string = 'day'
  ): Promise<any[]> {
    const queryParams: Record<string, any> = { interval };
    if (startDate) queryParams.start_date = startDate;
    if (endDate) queryParams.end_date = endDate;
    
    const queryString = this.buildQueryString(queryParams);
    return this.makeAuthenticatedRequest<any[]>(`/containers/${id}/metric-snapshots${queryString}`);
  }

  /**
   * Get activity logs for the container
   */
  public async getActivityLogs(
    id: number,
    page: number = 1,
    limit: number = 20,
    startDate?: string,
    endDate?: string,
    actionType?: string,
    actorType?: string
  ): Promise<any> {
    const queryParams: Record<string, any> = { page, limit };
    if (startDate) queryParams.start_date = startDate;
    if (endDate) queryParams.end_date = endDate;
    if (actionType) queryParams.action_type = actionType;
    if (actorType) queryParams.actor_type = actorType;
    
    const queryString = this.buildQueryString(queryParams);
    return this.makeAuthenticatedRequest<any>(`/containers/${id}/activity-logs${queryString}`);
  }


  /**
   * Update container settings from the overview tab
   */
  public async updateContainerSettings(id: number, settings: any): Promise<any> {
    return this.makeAuthenticatedRequest<any>(`/containers/${id}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  /**
   * Get dashboard summary for quick loading
   */
  public async getDashboardSummary(id: number): Promise<any> {
    return this.makeAuthenticatedRequest<any>(`/containers/${id}/dashboard-summary`);
  }

  /**
   * Create activity log entry
   */
  public async createActivityLog(id: number, activity: any): Promise<any> {
    return this.makeAuthenticatedRequest<any>(`/containers/${id}/activity-logs`, {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  // ==================== Environment Management Endpoints ====================

  /**
   * Get container environment status
   */
  public async getEnvironmentStatus(id: number): Promise<EnvironmentStatus> {
    return this.makeAuthenticatedRequest<EnvironmentStatus>(`/containers/${id}/environment/status`);
  }

  /**
   * Get environment links for a container
   */
  public async getEnvironmentLinks(id: number): Promise<EnvironmentLinks> {
    return this.makeAuthenticatedRequest<EnvironmentLinks>(`/containers/${id}/environment-links`);
  }

  /**
   * Update environment links for a container
   */
  public async updateEnvironmentLinks(
    id: number, 
    links: UpdateEnvironmentLinksRequest
  ): Promise<UpdateEnvironmentLinksResponse> {
    return this.makeAuthenticatedRequest<UpdateEnvironmentLinksResponse>(`/containers/${id}/environment-links`, {
      method: 'PUT',
      body: JSON.stringify(links),
    });
  }

  /**
   * Get FarmHand iframe URL for embedding
   */
  public async getIframeUrl(
    id: number, 
    tab?: string, 
    refresh?: boolean
  ): Promise<IframeConfiguration> {
    const params = new URLSearchParams();
    if (tab) params.append('tab', tab);
    if (refresh !== undefined) params.append('refresh', refresh.toString());
    
    const queryString = params.toString();
    const url = `/containers/${id}/environment/iframe-url${queryString ? `?${queryString}` : ''}`;
    
    return this.makeAuthenticatedRequest<IframeConfiguration>(url);
  }

  /**
   * Get FarmHand external URL for opening in new tab
   */
  public async getExternalUrl(
    id: number, 
    tab?: string
  ): Promise<ExternalUrlConfiguration> {
    const params = new URLSearchParams();
    if (tab) params.append('tab', tab);
    
    const queryString = params.toString();
    const url = `/containers/${id}/environment/external-url${queryString ? `?${queryString}` : ''}`;
    
    return this.makeAuthenticatedRequest<ExternalUrlConfiguration>(url);
  }

  /**
   * Initialize environment connection for a container
   */
  public async connectEnvironment(
    id: number, 
    connectionData: EnvironmentConnectionRequest
  ): Promise<EnvironmentConnectionResponse> {
    return this.makeAuthenticatedRequest<EnvironmentConnectionResponse>(`/containers/${id}/environment/connect`, {
      method: 'POST',
      body: JSON.stringify(connectionData),
    });
  }

  /**
   * Get environment system health status
   */
  public async getEnvironmentHealth(id: number): Promise<EnvironmentSystemHealth> {
    return this.makeAuthenticatedRequest<EnvironmentSystemHealth>(`/containers/${id}/environment/health`);
  }

  /**
   * Refresh environment session
   */
  public async refreshEnvironmentSession(id: number): Promise<SessionRefreshResponse> {
    return this.makeAuthenticatedRequest<SessionRefreshResponse>(`/containers/${id}/environment/refresh-session`, {
      method: 'POST',
    });
  }

  // ==================== Recipe Management Endpoints ====================

  /**
   * Get active recipes for a container
   */
  public async getActiveRecipes(id: number): Promise<ActiveRecipe[]> {
    return this.makeAuthenticatedRequest<ActiveRecipe[]>(`/containers/${id}/recipes/active`);
  }

  /**
   * Apply a recipe version to a container
   */
  public async applyRecipe(
    id: number, 
    recipeData: ApplyRecipeRequest
  ): Promise<ApplyRecipeResponse> {
    return this.makeAuthenticatedRequest<ApplyRecipeResponse>(`/containers/${id}/recipes/apply`, {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  /**
   * Get recipe application history for a container
   */
  public async getRecipeHistory(
    id: number, 
    params?: RecipeHistoryQueryParams
  ): Promise<RecipeApplication[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    
    const queryString = queryParams.toString();
    const url = `/containers/${id}/recipes/history${queryString ? `?${queryString}` : ''}`;
    
    return this.makeAuthenticatedRequest<RecipeApplication[]>(url);
  }

  /**
   * Get available recipe versions for a container
   */
  public async getAvailableRecipes(
    id: number, 
    params?: AvailableRecipesQueryParams
  ): Promise<RecipeVersion[]> {
    const queryParams = new URLSearchParams();
    if (params?.crop_type) queryParams.append('crop_type', params.crop_type);
    if (params?.active_only !== undefined) queryParams.append('active_only', params.active_only.toString());
    
    const queryString = queryParams.toString();
    const url = `/containers/${id}/recipes/available${queryString ? `?${queryString}` : ''}`;
    
    return this.makeAuthenticatedRequest<RecipeVersion[]>(url);
  }
}

// Create and export singleton instance
export const containerService = ContainerService.getInstance(getApiBaseUrl());

// Export utility functions for common operations
export const getAllContainers = async (filters?: ContainerFilterCriteria): Promise<ContainerListResponse> => {
  return containerService.getContainers(filters);
};

export const getContainerById = async (id: number): Promise<Container> => {
  return containerService.getContainer(id);
};

export const createNewContainer = async (data: CreateContainerRequest): Promise<Container> => {
  return containerService.createContainer(data);
};

export const updateExistingContainer = async (id: number, data: UpdateContainerRequest): Promise<Container> => {
  return containerService.updateContainer(id, data);
};

export const deleteContainerById = async (id: number): Promise<void> => {
  return containerService.deleteContainer(id);
};

export const getMetrics = async (filters?: MetricsFilterCriteria): Promise<PerformanceMetrics> => {
  return containerService.getPerformanceMetrics(filters);
};

export const shutdownContainerById = async (id: number, data?: ShutdownRequest): Promise<ShutdownResponse> => {
  return containerService.shutdownContainer(id, data);
};