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

// Container API service (unified authentication)
export { containerApiService } from './containerApiService';
export type {
  ContainerOverviewResponse,
  DashboardMetrics,
  CropsSummary,
  ActivityLogsResponse,
  DashboardSummaryResponse,
} from './containerApiService';

// Environment types
export type {
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
  ConnectionDetails,
  ContainerContext,
  MaintenanceWindow,
  PlaceholderState,
} from '../types/environment';

// Recipe types
export type {
  ActiveRecipe,
  RecipeApplication,
  RecipeVersion,
  ApplyRecipeRequest,
  ApplyRecipeResponse,
  RecipeHistoryQueryParams,
  AvailableRecipesQueryParams,
  EnvironmentParameters,
  RecipeManagementIntegration,
} from '../types/recipes';

// Tenant service
export {
  tenantService,
  getAllTenants,
  createNewTenant,
  getTenantById,
  updateExistingTenant,
  deleteTenantById,
} from './tenantService';

// Seed Type service
export {
  seedTypeService,
  getAllSeedTypes,
  createNewSeedType,
  getSeedTypeById,
  updateExistingSeedType,
  deleteSeedTypeById,
  getAvailableSeedTypesForContainer,
  checkSeedTypeCompatibility,
} from './seedTypeService';

// Seed Type API service (dedicated for seed type variants)
export { seedTypeApiService } from './seedTypeApiService';
export { SeedTypeApiService } from './seedTypeApiService';

// Alert service
export {
  alertService,
  getAllAlerts,
  createNewAlert,
  getAlertById,
  updateExistingAlert,
  deleteAlertById,
  resolveAlertById,
  activateAlertById,
  getAlertsForContainer,
  getAlertSummary,
  bulkResolveAlerts,
} from './alertService';

// Device service
export {
  deviceService,
  getAllDevices,
  createNewDevice,
  getDeviceById,
  updateExistingDevice,
  deleteDeviceById,
  getDevicesForContainer,
  getDeviceStatus,
  restartDevice,
  calibrateDevice,
  getDeviceCalibrationHistory,
  updateDeviceFirmware,
  getDeviceLogs,
} from './deviceService';

// Crop service
export {
  cropService,
  getAllCrops,
  createNewCrop,
  getCropById,
  updateExistingCrop,
  deleteCropById,
  getCropsBySeedType,
  getCropSummary,
  getCropGrowthData,
  getCropCareSchedule,
  completeCropTask,
  addCropMeasurement,
  updateCropLocation,
  harvestCrop,
  getCropsReadyForHarvest,
  getOverdueCrops,
} from './cropService';

// Tray service
export {
  trayService,
  getAllTrays,
  createNewTray,
  getTrayById,
  updateExistingTray,
  deleteTrayById,
  getTraysForContainer,
  provisionTray,
  clearTray,
  moveTray,
  getTrayByRFID,
  getTrayUtilizationHistory,
  getAvailableTrays,
} from './trayService';

// Panel service
export {
  panelService,
  getAllPanels,
  createNewPanel,
  getPanelById,
  updateExistingPanel,
  deletePanelById,
  getPanelsForContainer,
  provisionPanel,
  clearPanel,
  movePanel,
  getPanelByRFID,
  getPanelUtilizationHistory,
  getAvailablePanels,
  adjustPanelLighting,
} from './panelService';

// Inventory service
export {
  inventoryService,
  getContainerInventory,
  getContainerTrays,
  getContainerPanels,
  InventoryService,
} from './inventoryService';
export type { InventoryData, TraySlotData } from './inventoryService';

// Metric Snapshot service
export {
  metricSnapshotService,
  getMetricSnapshots,
  getMetricStatistics,
  getLatestMetrics,
  getMetricTrends,
  createMetricThreshold,
  getMetricThresholds,
  updateMetricThreshold,
  deleteMetricThreshold,
  compareMetrics,
  exportMetrics,
  subscribeToMetrics,
  unsubscribeFromMetrics,
  getMetricDashboard,
} from './metricSnapshotService';

// Activity Log service
export {
  activityLogService,
  getActivityLogs,
  createActivityLog,
  getActivityLogById,
  getActivityLogsForContainer,
  getActivitySummary,
  getActivityTrends,
  getAuditTrail,
  getActivityFeed,
  markActivityFeedAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  searchActivityLogs,
  exportActivityLogs,
  deleteOldActivityLogs,
} from './activityLogService';

// Environment Link service
export {
  environmentLinkService,
  getEnvironmentLinks,
  updateEnvironmentLinks,
  testEnvironmentConnection,
  testAllEnvironmentConnections,
  getEnvironmentSyncStatus,
  syncEnvironment,
  syncAllEnvironments,
  disconnectEnvironment,
  getEnvironmentTemplates,
  validateEnvironmentConfig,
  getEnvironmentLogs,
  exportEnvironmentData,
} from './environmentLinkService';

// Validation service
export {
  validationService,
  validateContainerName,
  validateContainerData,
  validateTenantName,
  validateSeedTypeData,
  validateDeviceConfig,
  validateRFIDTag,
  validateCropData,
  validateLocation,
  bulkValidate,
  validateField,
  getValidationRules,
  validateDataConsistency,
  generateNameSuggestions,
} from './validationService';

// Service instances for direct access
export { AuthService } from './authService';
export { ContainerService } from './containerService';
export { BaseApiService } from './baseApiService';
export { ContainerApiService } from './containerApiService';
export { TenantService } from './tenantService';
export { SeedTypeService } from './seedTypeService';
export { AlertService } from './alertService';
export { DeviceService } from './deviceService';
export { CropService } from './cropService';
export { TrayService } from './trayService';
export { PanelService } from './panelService';
export { MetricSnapshotService } from './metricSnapshotService';
export { ActivityLogService } from './activityLogService';
export { EnvironmentLinkService } from './environmentLinkService';
export { ValidationService } from './validationService';

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