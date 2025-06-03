import { CropHistory } from '../shared/types/inventory';
import config from './config';

// Additional types specific to crop detail functionality
export interface CropDetailData {
  id: string;
  seedType: string;
  age: number;
  imageSrc?: string;
  environmentData?: {
    areaData?: Array<[number, number]>;
    lightData?: Array<[number, number]>;
    waterData?: Array<[number, number]>;
    airTempData?: Array<[number, number]>;
    humidityData?: Array<[number, number]>;
    co2Data?: Array<[number, number]>;
    waterTempData?: Array<[number, number]>;
    phData?: Array<[number, number]>;
    ecData?: Array<[number, number]>;
  };
  generalInfo?: Record<string, unknown>;
  notes?: string;
  history?: Array<{
    date: string;
    event: string;
    description: string;
  }>;
}

export interface CropProvisionRequest {
  cropId: string;
  notes?: string;
}

export interface CropProvisionResponse {
  id: string;
  cropId: string;
  provisionId: string;
  printJobId: string;
  status: 'success' | 'failed';
  message: string;
  printedAt: string;
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

// Mock data fallback for development
function getMockDataForUrl<T>(url: string, method: string): T {
  const mockCropHistory: CropHistory = {
    crop_id: "20250401-143548-A001",
    history: [
      {
        date: "2025-01-15",
        event: "seeded",
        location: {
          type: "tray",
          tray_id: "TR-10-595383-3131",
          row: 5,
          column: 10
        },
        health_status: "healthy",
        size: "small",
        notes: "Initial seeding completed"
      },
      {
        date: "2025-01-18",
        event: "growth_update",
        location: {
          type: "tray",
          tray_id: "TR-10-595383-3131",
          row: 5,
          column: 10
        },
        health_status: "healthy",
        size: "small",
        notes: "First signs of germination observed"
      },
      {
        date: "2025-01-22",
        event: "growth_update",
        location: {
          type: "tray",
          tray_id: "TR-10-595383-3131",
          row: 5,
          column: 10
        },
        health_status: "healthy",
        size: "medium",
        notes: "Healthy seedling development, normal growth rate"
      }
    ]
  };

  const mockCropDetailData: CropDetailData = {
    id: "20250401-143548-A001",
    seedType: "Lettuce",
    age: 4,
    imageSrc: "/images/sample-crop.jpg",
    environmentData: {
      areaData: [[0, 0], [50, 0.0002], [100, 0.0003], [150, 0.0004], [200, 0.0004], [250, 0.0012]],
      lightData: [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]],
      waterData: [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]],
      airTempData: [[0, 21.0], [50, 20.9], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]],
      humidityData: [[0, 65], [50, 64], [100, 66], [150, 65], [200, 67], [250, 69], [270, 70]],
      co2Data: [[0, 900], [50, 910], [100, 905], [150, 900], [200, 895], [250, 890], [270, 897]],
      waterTempData: [[0, 21.0], [50, 20.6], [100, 20.8], [150, 21.0], [200, 20.9], [250, 21.1], [270, 21.1]],
      phData: [[0, 6.5], [50, 6.1], [100, 6.3], [150, 6.2], [200, 6.4], [250, 6.3], [270, 6.3]],
      ecData: [[0, 1.8], [50, 1.7], [100, 1.9], [150, 1.8], [200, 1.9], [250, 1.8], [270, 1.9]],
    },
    generalInfo: {
      'Seed Type': 'Lettuce (Buttercrunch)',
      'Location': 'Tray 5, Row 10, Column 10',
      'Seeded Date': '2025-01-15',
      'Expected Harvest': '2025-02-15',
      'Growth Stage': 'Seedling',
    },
    notes: 'Crop is showing healthy growth patterns. Monitor closely for optimal transplanting timing.',
    history: [
      {
        date: '2025-01-15',
        event: 'Seeded',
        description: 'Initial seeding completed in nursery tray.',
      },
      {
        date: '2025-01-18',
        event: 'Germination',
        description: 'First signs of germination observed.',
      },
      {
        date: '2025-01-22',
        event: 'Growth Update',
        description: 'Healthy seedling development, normal growth rate.',
      },
    ],
  };

  const mockProvisionResponse: CropProvisionResponse = {
    id: "crop-provision-001",
    cropId: "20250401-143548-A001",
    provisionId: "PRV-001-2025",
    printJobId: "PRT-001-2025",
    status: "success",
    message: "Crop ID successfully provisioned and print job queued",
    printedAt: new Date().toISOString(),
  };

  if (url.includes('/crops/') && url.includes('/history')) {
    return mockCropHistory as T;
  }
  if (url.includes('/crops/') && url.includes('/detail')) {
    return mockCropDetailData as T;
  }
  if (method === 'POST' && url.includes('/crops/') && url.includes('/provision')) {
    return mockProvisionResponse as T;
  }

  throw new Error(`No mock data available for URL: ${url}`);
}

/**
 * Crop Detail Service
 * Provides methods to interact with crop detail data and functionality
 */
class CropDetailService {
  /**
   * Get crop history for time-lapse view
   * @param containerId - The ID of the container
   * @param cropId - The ID of the crop
   * @param startDate - Start date for history (ISO format, optional)
   * @param endDate - End date for history (ISO format, optional)
   * @returns Promise<CropHistory>
   */
  async getCropHistory(
    containerId: string,
    cropId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CropHistory> {
    return apiRequest<CropHistory>({
      method: 'GET',
      url: config.endpoints.cropHistory(containerId, cropId),
      params: { start_date: startDate, end_date: endDate },
    });
  }

  /**
   * Get detailed crop information including environmental data
   * @param containerId - The ID of the container
   * @param cropId - The ID of the crop
   * @returns Promise<CropDetailData>
   */
  async getCropDetail(containerId: string, cropId: string): Promise<CropDetailData> {
    return apiRequest<CropDetailData>({
      method: 'GET',
      url: `/containers/${containerId}/crops/${cropId}/detail`,
    });
  }

  /**
   * Provision and print ID for a crop
   * @param containerId - The ID of the container
   * @param cropId - The ID of the crop
   * @param notes - Optional notes for the provision request
   * @returns Promise<CropProvisionResponse>
   */
  async provisionAndPrintCropId(
    containerId: string,
    cropId: string,
    notes?: string
  ): Promise<CropProvisionResponse> {
    return apiRequest<CropProvisionResponse>({
      method: 'POST',
      url: `/containers/${containerId}/crops/${cropId}/provision`,
      data: { cropId, notes },
    });
  }

  /**
   * Get crop environmental metrics for a specific time period
   * @param containerId - The ID of the container
   * @param cropId - The ID of the crop
   * @param startDate - Start date for metrics (ISO format, optional)
   * @param endDate - End date for metrics (ISO format, optional)
   * @returns Promise with environmental data
   */
  async getCropEnvironmentData(
    containerId: string,
    cropId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    areaData: Array<[number, number]>;
    lightData: Array<[number, number]>;
    waterData: Array<[number, number]>;
    airTempData: Array<[number, number]>;
    humidityData: Array<[number, number]>;
    co2Data: Array<[number, number]>;
    waterTempData: Array<[number, number]>;
    phData: Array<[number, number]>;
    ecData: Array<[number, number]>;
  }> {
    return apiRequest({
      method: 'GET',
      url: `/containers/${containerId}/crops/${cropId}/environment`,
      params: { start_date: startDate, end_date: endDate },
    });
  }
}

// Export singleton instance
export const cropDetailService = new CropDetailService();
export default cropDetailService;