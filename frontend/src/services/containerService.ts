import { apiRequest } from './api';

import {
  ContainerType,
  ContainerStatus,
  ContainerPurpose,
  TimeRangeOption
} from '../shared/types/containers';

export interface ContainerFormData {
  name: string;
  tenant: string;
  type: 'physical' | 'virtual';
  purpose: string;
  seed_types: string[];
  location: string;
  notes?: string;
  shadow_service_enabled: boolean;
  connect_to_other_systems: boolean;
}

export interface ContainerResponse {
  id: string;
  name: string;
  type: ContainerType;
  tenant_name: string;
  purpose: ContainerPurpose;
  location_city?: string;
  location_country?: string;
  status: ContainerStatus;
  created_at: string;
  updated_at: string;
  has_alerts: boolean;
  shadow_service_enabled: boolean;
  ecosystem_connected: boolean;
}

export interface ContainerSummary {
  id: string;
  name: string;
  type: ContainerType;
  tenant_name: string;
  purpose: ContainerPurpose;
  location_city?: string;
  location_country?: string;
  status: ContainerStatus;
  created_at: string;
  updated_at: string;
  has_alerts: boolean;
}

export interface ContainerList {
  total: number;
  results: ContainerSummary[];
}

export interface ContainerStats {
  physical_count: number;
  virtual_count: number;
}

export interface ContainerFilterParams {
  skip?: number;
  limit?: number;
  name?: string;
  tenant_id?: string;
  type?: ContainerType;
  purpose?: string;
  status?: ContainerStatus;
  has_alerts?: boolean;
  location?: string;
}

export interface Location {
  city: string;
  country: string;
  address?: string;
}

export interface SystemIntegration {
  name: string;
  enabled: boolean;
}

export interface SystemIntegrations {
  fa_integration: SystemIntegration;
  aws_environment: SystemIntegration;
  mbai_environment: SystemIntegration;
}

export interface ContainerDetail {
  id: string;
  name: string;
  type: ContainerType;
  tenant: string;
  purpose: ContainerPurpose;
  location: Location;
  status: ContainerStatus;
  created: string;
  modified: string;
  creator: string;
  seed_types: string[];
  notes?: string;
  shadow_service_enabled: boolean;
  ecosystem_connected: boolean;
  system_integrations: SystemIntegrations;
}

export interface SingleMetricData {
  current: number;
  unit: string;
  target?: number;
  trend?: number;
}

export interface ContainerMetrics {
  temperature: SingleMetricData;
  humidity: SingleMetricData;
  co2: SingleMetricData;
  yield: SingleMetricData;
  nursery_utilization: SingleMetricData;
  cultivation_utilization: SingleMetricData;
}

export interface ContainerCrop {
  id: string;
  seed_type: string;
  cultivation_area?: number;
  nursery_table?: number;
  last_sd?: string;
  last_td?: string;
  last_hd?: string;
  avg_age?: number;
  overdue?: number;
}

export interface CropsList {
  total: number;
  results: ContainerCrop[];
}

export interface ActivityUser {
  name: string;
  role: string;
}

export interface ActivityDetails {
  additional_info?: string;
}

export interface ContainerActivity {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  user: ActivityUser;
  details: ActivityDetails;
}

export interface ActivityLogList {
  activities: ContainerActivity[];
}

// Service functions to interact with container endpoints
const containerService = {
  // Get containers with optional filtering
  getContainers: async (filterParams: ContainerFilterParams = {}): Promise<ContainerList> => {
    return apiRequest<ContainerList>({
      method: 'GET',
      url: '/containers',
      params: filterParams,
    });
  },

  // Get container statistics
  getContainerStats: async (): Promise<ContainerStats> => {
    return apiRequest<ContainerStats>({
      method: 'GET',
      url: '/containers/stats',
    });
  },

  // Get a specific container by ID (summary)
  getContainerById: async (id: string): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'GET',
      url: `/containers/${id}`,
    });
  },

  // Get detailed container information
  getContainerDetail: async (id: string): Promise<ContainerDetail> => {
    return apiRequest<ContainerDetail>({
      method: 'GET',
      url: `/containers/${id}`,
    });
  },

  // Get container metrics
  getContainerMetrics: async (
    containerId: string,
    timeRange: TimeRangeOption = 'WEEK',
  ): Promise<ContainerMetrics> => {
    return apiRequest<ContainerMetrics>({
      method: 'GET',
      url: `/containers/${containerId}/metrics`,
      params: { time_range: timeRange },
    });
  },

  // Get container crops
  getContainerCrops: async (
    containerId: string,
    page: number = 0,
    pageSize: number = 10,
    seedType?: string,
  ): Promise<CropsList> => {
    return apiRequest<CropsList>({
      method: 'GET',
      url: `/containers/${containerId}/crops`,
      params: {
        page,
        page_size: pageSize,
        seed_type: seedType,
      },
    });
  },

  // Get container activities
  getContainerActivities: async (
    containerId: string,
    limit: number = 5,
  ): Promise<ActivityLogList> => {
    return apiRequest<ActivityLogList>({
      method: 'GET',
      url: `/containers/${containerId}/activities`,
      params: { limit },
    });
  },

  // Create a new container
  createContainer: async (containerData: ContainerFormData): Promise<ContainerResponse> => {
    return apiRequest<ContainerResponse>({
      method: 'POST',
      url: '/containers/form',
      data: containerData,
    });
  },

  // Update an existing container
  updateContainer: async (id: string, containerData: any): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'PUT',
      url: `/containers/${id}`,
      data: containerData,
    });
  },

  // Shutdown a container
  shutdownContainer: async (id: string): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'POST',
      url: `/containers/${id}/shutdown`,
    });
  },

  // Delete a container
  deleteContainer: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/containers/${id}`,
    });
  },
};

export default containerService;
