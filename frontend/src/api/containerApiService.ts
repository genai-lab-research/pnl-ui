import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Container,
  ContainerListResponse,
  ContainerFilterCriteria,
  ContainerCreateRequest,
  ContainerUpdateRequest,
  FilterOptions,
  ShutdownRequest,
  ShutdownResponse,
  PerformanceMetrics,
  ContainerMetricsRequest,
  ContainerTrendData
} from '../types/container';

export class ContainerApiService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  /**
   * List Containers
   * GET /api/v1/containers/
   */
  async listContainers(filters?: ContainerFilterCriteria): Promise<ContainerListResponse> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<ContainerListResponse>(`/containers/${queryString}`);
  }

  /**
   * Get Container by ID
   * GET /api/v1/containers/{id}
   */
  async getContainer(id: number): Promise<Container> {
    return this.get<Container>(`/containers/${id}`);
  }

  /**
   * Create Container
   * POST /api/v1/containers/
   */
  async createContainer(data: ContainerCreateRequest): Promise<Container> {
    return this.post<Container>('/containers/', data);
  }

  /**
   * Update Container
   * PUT /api/v1/containers/{id}
   */
  async updateContainer(id: number, data: ContainerUpdateRequest): Promise<Container> {
    return this.put<Container>(`/containers/${id}`, data);
  }

  /**
   * Delete Container
   * DELETE /api/v1/containers/{id}
   */
  async deleteContainer(id: number): Promise<void> {
    return this.delete<void>(`/containers/${id}`);
  }

  /**
   * Get Performance Metrics
   * GET /api/v1/containers/metrics
   */
  async getPerformanceMetrics(params?: ContainerMetricsRequest): Promise<PerformanceMetrics> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.get<PerformanceMetrics>(`/containers/metrics${queryString}`);
  }

  /**
   * Get Filter Options
   * GET /api/v1/containers/filter-options
   */
  async getFilterOptions(): Promise<FilterOptions> {
    return this.get<FilterOptions>('/containers/filter-options');
  }

  /**
   * Shutdown Container
   * POST /api/v1/containers/{id}/shutdown
   */
  async shutdownContainer(id: number, data?: ShutdownRequest): Promise<ShutdownResponse> {
    return this.post<ShutdownResponse>(`/containers/${id}/shutdown`, data);
  }

  /**
   * Get Container Metrics
   * GET /api/v1/containers/{id}/metrics
   */
  async getContainerMetrics(id: number, days?: number): Promise<ContainerTrendData> {
    const queryString = days ? this.buildQueryString({ days }) : '';
    return this.get<ContainerTrendData>(`/containers/${id}/metrics${queryString}`);
  }

  /**
   * Get Containers by Tenant
   * GET /api/v1/containers/tenant/{tenant_id}
   */
  async getContainersByTenant(
    tenantId: number, 
    page?: number, 
    limit?: number
  ): Promise<Container[]> {
    const queryString = this.buildQueryString({ page, limit });
    return this.get<Container[]>(`/containers/tenant/${tenantId}${queryString}`);
  }

  /**
   * Get Containers with Active Alerts
   * GET /api/v1/containers/alerts/active
   */
  async getContainersWithActiveAlerts(): Promise<Container[]> {
    return this.get<Container[]>('/containers/alerts/active');
  }

  // Convenience methods for common operations

  /**
   * Search containers by text
   */
  async searchContainers(
    searchTerm: string, 
    filters?: Omit<ContainerFilterCriteria, 'search'>
  ): Promise<ContainerListResponse> {
    return this.listContainers({
      ...filters,
      search: searchTerm
    });
  }

  /**
   * Get containers by type
   */
  async getContainersByType(
    type: 'physical' | 'virtual',
    filters?: Omit<ContainerFilterCriteria, 'type'>
  ): Promise<ContainerListResponse> {
    return this.listContainers({
      ...filters,
      type
    });
  }

  /**
   * Get containers by status
   */
  async getContainersByStatus(
    status: 'created' | 'active' | 'maintenance' | 'inactive',
    filters?: Omit<ContainerFilterCriteria, 'status'>
  ): Promise<ContainerListResponse> {
    return this.listContainers({
      ...filters,
      status
    });
  }

  /**
   * Get containers with alerts
   */
  async getContainersWithAlerts(
    filters?: Omit<ContainerFilterCriteria, 'alerts'>
  ): Promise<ContainerListResponse> {
    return this.listContainers({
      ...filters,
      alerts: true
    });
  }

  /**
   * Get paginated containers
   */
  async getPaginatedContainers(
    page: number = 1,
    limit: number = 10,
    filters?: Omit<ContainerFilterCriteria, 'page' | 'limit'>
  ): Promise<ContainerListResponse> {
    return this.listContainers({
      ...filters,
      page,
      limit
    });
  }

  /**
   * Get sorted containers
   */
  async getSortedContainers(
    sort: string = 'name',
    order: 'asc' | 'desc' = 'asc',
    filters?: Omit<ContainerFilterCriteria, 'sort' | 'order'>
  ): Promise<ContainerListResponse> {
    return this.listContainers({
      ...filters,
      sort,
      order
    });
  }

  /**
   * Activate container
   */
  async activateContainer(id: number): Promise<Container> {
    return this.updateContainer(id, { status: 'active' });
  }

  /**
   * Deactivate container
   */
  async deactivateContainer(id: number): Promise<Container> {
    return this.updateContainer(id, { status: 'inactive' });
  }

  /**
   * Set container maintenance mode
   */
  async setMaintenanceMode(id: number): Promise<Container> {
    return this.updateContainer(id, { status: 'maintenance' });
  }

  /**
   * Clone container environment
   */
  async cloneContainerEnvironment(
    sourceId: number, 
    targetData: ContainerCreateRequest
  ): Promise<Container> {
    return this.createContainer({
      ...targetData,
      copied_environment_from: sourceId
    });
  }

  /**
   * Toggle shadow service
   */
  async toggleShadowService(id: number, enabled: boolean): Promise<Container> {
    return this.updateContainer(id, { shadow_service_enabled: enabled });
  }

  /**
   * Toggle robotics simulation
   */
  async toggleRoboticsSimulation(id: number, enabled: boolean): Promise<Container> {
    return this.updateContainer(id, { robotics_simulation_enabled: enabled });
  }

  /**
   * Toggle ecosystem connection
   */
  async toggleEcosystemConnection(id: number, enabled: boolean): Promise<Container> {
    return this.updateContainer(id, { ecosystem_connected: enabled });
  }

  /**
   * Update container location
   */
  async updateContainerLocation(
    id: number, 
    location: { city: string; country: string; address: string }
  ): Promise<Container> {
    return this.updateContainer(id, { location });
  }

  /**
   * Add seed types to container
   */
  async addSeedTypes(id: number, seedTypeIds: number[]): Promise<Container> {
    return this.updateContainer(id, { seed_type_ids: seedTypeIds });
  }

  /**
   * Update container notes
   */
  async updateContainerNotes(id: number, notes: string): Promise<Container> {
    return this.updateContainer(id, { notes });
  }
}

// Create and export singleton instance
export const containerApiService = new ContainerApiService();
export default containerApiService;