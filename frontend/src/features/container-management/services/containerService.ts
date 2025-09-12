import { httpClient } from '../../../api';
import type {
  Container,
  ContainerListParams,
  CreateContainerRequest,
  UpdateContainerRequest,
  ShutdownContainerRequest,
  ShutdownContainerResponse,
  PaginatedResponse,
  FilterOptions,
  PerformanceMetrics,
  MetricsFilters,
  ContainerTrendData,
  ErrorResponse
} from '../types';

export class ContainerService {
  private readonly baseUrl = '/api/v1/containers';

  async getContainers(params?: Partial<ContainerListParams>): Promise<PaginatedResponse<Container> & { performance_metrics: PerformanceMetrics }> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.search) searchParams.set('search', params.search);
      if (params?.type && params.type !== 'all') searchParams.set('type', params.type);
      if (params?.tenant && params.tenant !== 'all') searchParams.set('tenant', params.tenant.toString());
      if (params?.purpose && params.purpose !== 'all') searchParams.set('purpose', params.purpose);
      if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
      if (params?.alerts !== undefined) searchParams.set('alerts', params.alerts.toString());
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.field) searchParams.set('sort', params.field);
      if (params?.order) searchParams.set('order', params.order);

      const url = `${this.baseUrl}/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await httpClient.get<{
        containers: Container[];
        pagination: { page: number; limit: number; total: number; total_pages: number };
        performance_metrics: PerformanceMetrics;
      }>(url);
      
      return {
        data: response.containers,
        pagination: response.pagination,
        performance_metrics: response.performance_metrics
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch containers');
    }
  }

  async getContainer(id: number): Promise<Container> {
    try {
      const response = await httpClient.get<Container>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch container ${id}`);
    }
  }

  async createContainer(data: CreateContainerRequest): Promise<Container> {
    try {
      const response = await httpClient.post<Container>(this.baseUrl, data);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to create container');
    }
  }

  async updateContainer(id: number, data: UpdateContainerRequest): Promise<Container> {
    try {
      const response = await httpClient.put<Container>(`${this.baseUrl}/${id}`, data);
      return response;
    } catch (error) {
      throw this.handleError(error, `Failed to update container ${id}`);
    }
  }

  async deleteContainer(id: number): Promise<void> {
    try {
      await httpClient.delete<void>(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete container ${id}`);
    }
  }

  async shutdownContainer(id: number, data: ShutdownContainerRequest): Promise<ShutdownContainerResponse> {
    try {
      const response = await httpClient.post<ShutdownContainerResponse>(`${this.baseUrl}/${id}/shutdown`, data);
      return response;
    } catch (error) {
      throw this.handleError(error, `Failed to shutdown container ${id}`);
    }
  }

  async getPerformanceMetrics(filters?: MetricsFilters): Promise<PerformanceMetrics> {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters?.timeRange) searchParams.set('timeRange', filters.timeRange);
      if (filters?.type && filters.type !== 'all') searchParams.set('type', filters.type);
      if (filters?.containerIds?.length) {
        searchParams.set('containerIds', filters.containerIds.join(','));
      }

      const url = `${this.baseUrl}/metrics${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await httpClient.get<PerformanceMetrics>(url);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch performance metrics');
    }
  }

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await httpClient.get<FilterOptions>(`${this.baseUrl}/filter-options`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch filter options');
    }
  }

  async getContainerMetrics(id: number, days = 30): Promise<ContainerTrendData> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('days', days.toString());
      
      const response = await httpClient.get<ContainerTrendData>(`${this.baseUrl}/${id}/metrics?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch metrics for container ${id}`);
    }
  }

  async getContainersByTenant(tenantId: number, page = 1, limit = 10): Promise<Container[]> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      
      const response = await httpClient.get<Container[]>(`${this.baseUrl}/tenant/${tenantId}?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch containers for tenant ${tenantId}`);
    }
  }

  async getContainersWithActiveAlerts(): Promise<Container[]> {
    try {
      const response = await httpClient.get<Container[]>(`${this.baseUrl}/alerts/active`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch containers with active alerts');
    }
  }

  private handleError(error: unknown, defaultMessage: string): Error {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      const errorData = error.response.data as ErrorResponse;
      
      if (typeof errorData.detail === 'string') {
        return new Error(errorData.detail);
      }
      
      if (Array.isArray(errorData.detail)) {
        const validationErrors = errorData.detail
          .map(err => `${err.loc.join('.')}: ${err.msg}`)
          .join(', ');
        return new Error(`Validation errors: ${validationErrors}`);
      }
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return new Error(error.message as string);
    }
    
    return new Error(defaultMessage);
  }
}

export const containerService = new ContainerService();