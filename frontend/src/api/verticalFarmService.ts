import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Container,
  ContainerCreateRequest,
  ContainerListFilters,
  ContainerNameValidation,
  ContainerNameValidationResponse,
  EnvironmentLinks,
  EnvironmentLinksUpdate,
  Tenant,
  TenantCreateRequest,
  SeedType,
  SeedTypeCreateRequest,
  Alert,
  AlertCreateRequest,
  AlertListFilters,
  Device,
  DeviceListFilters,
  Tray,
  TrayListFilters,
  Panel,
  PanelListFilters,
  Crop,
  CropListFilters,
  MetricSnapshot,
  MetricSnapshotListFilters,
  ActivityLog,
  ActivityLogListFilters,
  DeleteResponse
} from '../types/verticalFarm';

class VerticalFarmService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  // Container Management
  async createContainer(data: ContainerCreateRequest): Promise<Container> {
    return this.post<Container>('/containers/', data);
  }

  async getContainers(filters?: ContainerListFilters): Promise<Container[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Container[]>(`/containers/${queryString}`);
  }

  async getContainerById(id: number): Promise<Container> {
    return this.get<Container>(`/containers/${id}`);
  }

  async updateContainer(id: number, data: ContainerCreateRequest): Promise<Container> {
    return this.put<Container>(`/containers/${id}`, data);
  }

  async deleteContainer(id: number): Promise<DeleteResponse> {
    return this.delete<DeleteResponse>(`/containers/${id}`);
  }

  async validateContainerName(data: ContainerNameValidation): Promise<ContainerNameValidationResponse> {
    return this.post<ContainerNameValidationResponse>('/containers/validate-name', data);
  }

  // Environment Links
  async getEnvironmentLinks(containerId: number): Promise<EnvironmentLinks> {
    return this.get<EnvironmentLinks>(`/containers/${containerId}/environment-links`);
  }

  async updateEnvironmentLinks(containerId: number, data: EnvironmentLinksUpdate): Promise<EnvironmentLinks> {
    return this.put<EnvironmentLinks>(`/containers/${containerId}/environment-links`, data);
  }

  // Tenant Management
  async getTenants(): Promise<Tenant[]> {
    return this.get<Tenant[]>('/tenants/');
  }

  async createTenant(data: TenantCreateRequest): Promise<Tenant> {
    return this.post<Tenant>('/tenants/', data);
  }

  // Seed Type Management
  async getSeedTypes(): Promise<SeedType[]> {
    return this.get<SeedType[]>('/seed-types/');
  }

  async createSeedType(data: SeedTypeCreateRequest): Promise<SeedType> {
    return this.post<SeedType>('/seed-types/', data);
  }

  // Alert Management
  async getAlerts(filters?: AlertListFilters): Promise<Alert[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Alert[]>(`/alerts/${queryString}`);
  }

  async createAlert(data: AlertCreateRequest): Promise<Alert> {
    return this.post<Alert>('/alerts/', data);
  }

  // Device Management
  async getDevices(filters?: DeviceListFilters): Promise<Device[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Device[]>(`/devices/${queryString}`);
  }

  // Tray Management
  async getTrays(filters?: TrayListFilters): Promise<Tray[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Tray[]>(`/trays/${queryString}`);
  }

  // Panel Management
  async getPanels(filters?: PanelListFilters): Promise<Panel[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Panel[]>(`/panels/${queryString}`);
  }

  // Crop Management
  async getCrops(filters?: CropListFilters): Promise<Crop[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Crop[]>(`/crops/${queryString}`);
  }

  // Metrics and Monitoring
  async getMetricSnapshots(filters?: MetricSnapshotListFilters): Promise<MetricSnapshot[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<MetricSnapshot[]>(`/metrics/snapshots/${queryString}`);
  }

  async getActivityLogs(filters?: ActivityLogListFilters): Promise<ActivityLog[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<ActivityLog[]>(`/activity-logs/${queryString}`);
  }
}

export const verticalFarmService = new VerticalFarmService();
export default verticalFarmService;