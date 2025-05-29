import { 
  ContainerDetail, 
  ContainerCropsList, 
  ContainerActivityList,
  ContainerSummary,
  ContainerList,
  ContainerStats,
  ContainerFilterParams,
  ContainerCreate,
  ContainerUpdate,
  ContainerFormData,
  ContainerResponse
} from '../shared/types/containers';
import { ContainerMetrics, TimeRange } from '../shared/types/metrics';
import { 
  mockContainerDetail, 
  mockContainerMetrics, 
  mockContainerCrops, 
  mockContainerActivities 
} from './mockData';

import config from './config';

// MetricCard data structure for the MetricCards component
export interface MetricCardData {
  title: string;
  value: string;
  targetValue: string;
  icon: string;
}

// API request helper
interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  const { method, url, params, data, headers = {} } = options;
  
  // Build URL with query parameters
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const fullUrl = `${config.api.baseUrl}${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);
    
    const response = await fetch(fullUrl, {
      method,
      headers: defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData}`);
    }
    
    // Handle empty response for DELETE operations
    if (response.status === 204 || method === 'DELETE') {
      return {} as T;
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    // In development mode with mock fallback enabled, return mock data when API is unavailable
    if (config.api.enableMockFallback && config.api.isDevelopment && 
        (error instanceof TypeError && error.message.includes('fetch') || 
         error instanceof DOMException && error.name === 'AbortError')) {
      console.warn(`API request failed, falling back to mock data for: ${url}`);
      return getMockDataForUrl<T>(url, method);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API server. Please check if the backend is running.');
    }
    throw error;
  }
}

// Mock data for metric cards
const mockMetricCards: MetricCardData[] = [
  {
    title: "Air Temperature",
    value: "20°C",
    targetValue: "21°C",
    icon: "DeviceThermostat"
  },
  {
    title: "Rel. Humidity",
    value: "65%",
    targetValue: "68%",
    icon: "WaterDrop"
  },
  {
    title: "CO₂ Level",
    value: "860",
    targetValue: "800-900ppm",
    icon: "Co2"
  },
  {
    title: "Yield",
    value: "51KG",
    targetValue: "+1.5Kg",
    icon: "Agriculture"
  },
  {
    title: "Nursery Station Utilization",
    value: "75%",
    targetValue: "+5%",
    icon: "CalendarViewMonth"
  },
  {
    title: "Cultivation Area Utilization",
    value: "90%",
    targetValue: "+15%",
    icon: "ViewWeek"
  }
];

// Mock data fallback helper
function getMockDataForUrl<T>(url: string, method: string = 'GET'): T {
  if (url.includes('/containers/') && url.includes('/metric-cards')) {
    return mockMetricCards as T;
  }
  
  if (url.includes('/containers/') && url.includes('/metrics')) {
    return mockContainerMetrics as T;
  }
  
  if (url.includes('/containers/') && url.includes('/crops')) {
    return mockContainerCrops as T;
  }
  
  if (url.includes('/containers/') && url.includes('/activities')) {
    return mockContainerActivities as T;
  }

  if (url.includes('/containers/stats')) {
    return {
      physical_count: 12,
      virtual_count: 8
    } as T;
  }
  
  if (url.includes('/containers/') && !url.includes('/metrics') && !url.includes('/crops') && !url.includes('/activities') && !url.includes('/metric-cards') && !url.includes('/stats')) {
    // For single container by ID - convert detail to summary format
    const summary = {
      id: mockContainerDetail.id,
      name: mockContainerDetail.name,
      type: mockContainerDetail.type,
      tenant_name: mockContainerDetail.tenant,
      purpose: mockContainerDetail.purpose,
      location_city: mockContainerDetail.location.city,
      location_country: mockContainerDetail.location.country,
      status: mockContainerDetail.status,
      created_at: mockContainerDetail.created,
      updated_at: mockContainerDetail.modified,
      has_alerts: true
    };
    return summary as T;
  }
  
  // For POST to containers endpoint (container creation)
  if (url.includes('/containers') && method === 'POST') {
    return {
      id: 'container-123',
      name: 'farm-container-04',
      type: 'PHYSICAL',
      tenant_name: 'Skybridge Farms',
      purpose: 'Production',
      location_city: 'Lviv',
      location_country: 'Ukraine',
      status: 'CREATED',
      created_at: '2023-07-25T10:30:00Z',
      updated_at: '2023-07-25T10:30:00Z',
      has_alerts: false,
      shadow_service_enabled: true,
      ecosystem_connected: true
    } as T;
  }

  // For containers list endpoint
  if (url.includes('/containers')) {
    const containerSummary = {
      id: mockContainerDetail.id,
      name: mockContainerDetail.name,
      type: mockContainerDetail.type,
      tenant_name: mockContainerDetail.tenant,
      purpose: mockContainerDetail.purpose,
      location_city: mockContainerDetail.location.city,
      location_country: mockContainerDetail.location.country,
      status: mockContainerDetail.status,
      created_at: mockContainerDetail.created,
      updated_at: mockContainerDetail.modified,
      has_alerts: true
    };

    return {
      total: 3,
      results: [
        containerSummary,
        { ...containerSummary, id: '2', name: 'Virtual Container Alpha', type: 'VIRTUAL' as const },
        { ...containerSummary, id: '3', name: 'Physical Container Beta', type: 'PHYSICAL' as const, status: 'MAINTENANCE' as const }
      ]
    } as T;
  }
  
  throw new Error(`No mock data available for URL: ${url}`);
}

// Container service with all the API methods
const containerService = {
  /**
   * Get detailed information about a specific container
   */
  getContainerById: async (id: string): Promise<ContainerDetail> => {
    return apiRequest<ContainerDetail>({
      method: 'GET',
      url: config.endpoints.containerById(id),
    });
  },
  
  /**
   * Get metrics for a specific container
   */
  getContainerMetrics: async (
    containerId: string, 
    timeRange: TimeRange = 'WEEK'
  ): Promise<ContainerMetrics> => {
    return apiRequest<ContainerMetrics>({
      method: 'GET',
      url: config.endpoints.containerMetrics(containerId),
      params: { time_range: timeRange },
    });
  },

  /**
   * Get metric cards data formatted for the MetricCards component
   */
  getContainerMetricCards: async (containerId: string): Promise<MetricCardData[]> => {
    return apiRequest<MetricCardData[]>({
      method: 'GET',
      url: config.endpoints.containerMetricCards(containerId),
    });
  },
  
  /**
   * Get crops for a specific container with pagination
   */
  getContainerCrops: async (
    containerId: string,
    page: number = 0,
    pageSize: number = config.ui.defaultPageSize,
    seedType?: string
  ): Promise<ContainerCropsList> => {
    return apiRequest<ContainerCropsList>({
      method: 'GET',
      url: config.endpoints.containerCrops(containerId),
      params: { 
        page, 
        page_size: pageSize,
        seed_type: seedType 
      },
    });
  },
  
  /**
   * Get activity logs for a specific container
   */
  getContainerActivities: async (
    containerId: string,
    limit: number = 5
  ): Promise<ContainerActivityList> => {
    return apiRequest<ContainerActivityList>({
      method: 'GET',
      url: config.endpoints.containerActivities(containerId),
      params: { limit },
    });
  },
  
  /**
   * Get all containers with pagination
   */
  getContainers: async (
    skip: number = 0,
    limit: number = config.ui.maxItemsPerPage
  ): Promise<{ data: ContainerDetail[]; count: number }> => {
    return apiRequest<{ data: ContainerDetail[]; count: number }>({
      method: 'GET',
      url: config.endpoints.containers,
      params: { skip, limit },
    });
  },
  
  /**
   * Create a new container
   */
  createContainer: async (containerData: Omit<ContainerDetail, 'id' | 'created' | 'modified'>): Promise<ContainerDetail> => {
    return apiRequest<ContainerDetail>({
      method: 'POST',
      url: config.endpoints.containers,
      data: containerData,
    });
  },
  
  /**
   * Update an existing container
   */
  updateContainer: async (
    containerId: string, 
    containerData: Partial<Omit<ContainerDetail, 'id' | 'created' | 'modified'>>
  ): Promise<ContainerDetail> => {
    return apiRequest<ContainerDetail>({
      method: 'PUT',
      url: config.endpoints.containerById(containerId),
      data: containerData,
    });
  },
  
  /**
   * Delete a container
   */
  deleteContainer: async (containerId: string): Promise<void> => {
    await apiRequest<void>({
      method: 'DELETE',
      url: config.endpoints.containerById(containerId),
    });
  },

  // Dashboard specific methods from page1_routing.md

  /**
   * Get containers list with advanced filtering for dashboard
   */
  getContainersList: async (filterParams: ContainerFilterParams = {}): Promise<ContainerList> => {
    return apiRequest<ContainerList>({
      method: 'GET',
      url: config.endpoints.containers,
      params: filterParams,
    });
  },

  /**
   * Get container statistics (counts by type)
   */
  getContainerStats: async (): Promise<ContainerStats> => {
    return apiRequest<ContainerStats>({
      method: 'GET',
      url: config.endpoints.containerStats,
    });
  },

  /**
   * Create a new container (dashboard version)
   */
  createContainerDashboard: async (containerData: ContainerCreate): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'POST',
      url: config.endpoints.containers,
      data: containerData,
    });
  },

  /**
   * Update an existing container (dashboard version)
   */
  updateContainerDashboard: async (id: string, containerData: ContainerUpdate): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'PUT',
      url: config.endpoints.containerById(id),
      data: containerData,
    });
  },

  /**
   * Shutdown a container
   */
  shutdownContainer: async (id: string): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'POST',
      url: config.endpoints.containerShutdown(id),
    });
  },

  /**
   * Get container by ID (dashboard summary version)
   */
  getContainerSummaryById: async (id: string): Promise<ContainerSummary> => {
    return apiRequest<ContainerSummary>({
      method: 'GET',
      url: config.endpoints.containerById(id),
    });
  },

  // Page 2 specific methods - Create Container Form

  /**
   * Create a new container from form data (Page 2)
   */
  createContainerFromForm: async (containerData: ContainerFormData): Promise<ContainerResponse> => {
    return apiRequest<ContainerResponse>({
      method: 'POST',
      url: config.endpoints.containers,
      data: containerData,
    });
  },
};

export default containerService;