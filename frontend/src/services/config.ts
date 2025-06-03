/**
 * Configuration service for API and environment settings
 */

export interface ApiConfig {
  baseUrl: string;
  enableMockFallback: boolean;
  isDevelopment: boolean;
  timeout: number;
}

export const getApiConfig = (): ApiConfig => {
  return {
    baseUrl: import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
    enableMockFallback: (import.meta.env.VITE_ENABLE_MOCK_FALLBACK || import.meta.env.REACT_APP_ENABLE_MOCK_FALLBACK) === 'true',
    isDevelopment: import.meta.env.DEV || import.meta.env.NODE_ENV === 'development',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || import.meta.env.REACT_APP_API_TIMEOUT || '10000', 10),
  };
};

export const config = {
  api: getApiConfig(),
  
  // Feature flags
  features: {
    enableMockData: (import.meta.env.VITE_ENABLE_MOCK_FALLBACK || import.meta.env.REACT_APP_ENABLE_MOCK_FALLBACK) === 'true',
    enableDevTools: import.meta.env.DEV || import.meta.env.NODE_ENV === 'development',
    enableErrorReporting: import.meta.env.PROD || import.meta.env.NODE_ENV === 'production',
  },
  
  // UI Configuration
  ui: {
    defaultPageSize: 10,
    maxItemsPerPage: 100,
    debounceDelay: 300,
  },
  
  // API Endpoints
  endpoints: {
    containers: '/containers',
    containerById: (id: string) => `/containers/${id}`,
    containerMetrics: (id: string) => `/containers/${id}/metrics`,
    containerMetricCards: (id: string) => `/containers/${id}/metric-cards`,
    containerCrops: (id: string) => `/containers/${id}/crops`,
    containerActivities: (id: string) => `/containers/${id}/activities`,
    containerStats: '/containers/stats',
    containerShutdown: (id: string) => `/containers/${id}/shutdown`,
    metrics: '/metrics',
    metricsContainer: (id: string) => `/metrics/container/${id}`,
    tenants: '/tenants',
    performance: '/metrics/performance',
    seedTypes: '/seed-types',
    // Inventory endpoints
    inventoryNursery: (containerId: string) => `/containers/${containerId}/inventory/nursery`,
    inventoryCultivation: (containerId: string) => `/containers/${containerId}/inventory/cultivation`,
    inventoryTrays: (containerId: string) => `/containers/${containerId}/inventory/trays`,
    inventoryPanels: (containerId: string) => `/containers/${containerId}/inventory/panels`,
    inventoryTrayProvision: (containerId: string) => `/containers/${containerId}/inventory/trays/provision`,
    inventoryPanelProvision: (containerId: string) => `/containers/${containerId}/inventory/panels/provision`,
    cropHistory: (containerId: string, cropId: string) => `/containers/${containerId}/crops/${cropId}/history`,
  },
};

export default config;