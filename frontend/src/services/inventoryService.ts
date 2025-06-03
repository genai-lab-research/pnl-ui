import {
  NurseryStationData,
  CultivationAreaData,
  TrayCreate,
  TrayResponse,
  PanelCreate,
  PanelResponse,
  TrayProvisionRequest,
  TrayProvisionResponse,
  PanelProvisionRequest,
  PanelProvisionResponse,
  CropHistory,
} from '../shared/types/inventory';
import config from './config';

// API request helper (reused from containerService pattern)
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

// Helper function to generate crop data for a tray
const generateCropsForTray = (utilizationPercentage: number, gridRows: number = 20, gridCols: number = 10): CropData[] => {
  const totalPositions = gridRows * gridCols;
  const occupiedPositions = Math.floor((utilizationPercentage / 100) * totalPositions);
  const crops: CropData[] = [];
  
  // Generate random occupied positions
  const occupiedSet = new Set<string>();
  while (occupiedSet.size < occupiedPositions) {
    const row = Math.floor(Math.random() * gridRows) + 1;
    const col = Math.floor(Math.random() * gridCols) + 1;
    occupiedSet.add(`${row}-${col}`);
  }
  
  // Create crop data for each occupied position
  occupiedSet.forEach(position => {
    const [row, col] = position.split('-').map(Number);
    crops.push({
      id: `crop-${Math.random().toString(36).substr(2, 9)}`,
      seed_type: ["Tomato", "Lettuce", "Basil", "Spinach", "Kale"][Math.floor(Math.random() * 5)],
      row,
      column: col,
      age_days: Math.floor(Math.random() * 45) + 5,
      seeded_date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      planned_transplanting_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      overdue_days: Math.random() < 0.1 ? Math.floor(Math.random() * 5) : 0,
      health_status: Math.random() < 0.05 ? "treatment_required" : "healthy" as "healthy" | "treatment_required",
      size: ["small", "medium", "large"][Math.floor(Math.random() * 3)] as "small" | "medium" | "large"
    });
  });
  
  return crops;
};

// Mock data fallback for development
function getMockDataForUrl<T>(url: string, method: string): T {
  const mockNurseryData: NurseryStationData = {
    utilization_percentage: 75,
    upper_shelf: {
      slots: [
        {
          slot_number: 1,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "A1B2C3D4",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 2,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "A1B2C3D5",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 3,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "A1B2C3D6",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 4,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "A1B2C3D7",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 5,
          occupied: false,
          tray: null
        },
        {
          slot_number: 6,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "A1B2C3D8",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 7,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "A1B2C3D9",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 8,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 55,
            crop_count: 120,
            utilization_level: "medium",
            rfid_tag: "A1B2C3DA",
            crops: generateCropsForTray(55, 20, 10)
          }
        }
      ]
    },
    lower_shelf: {
      slots: [
        {
          slot_number: 1,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "B1B2C3D4",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 2,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "B1B2C3D5",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 3,
          occupied: false,
          tray: null
        },
        {
          slot_number: 4,
          occupied: false,
          tray: null
        },
        {
          slot_number: 5,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 25,
            crop_count: 40,
            utilization_level: "low",
            rfid_tag: "B1B2C3D8",
            crops: generateCropsForTray(25, 20, 10)
          }
        },
        {
          slot_number: 6,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "B1B2C3D9",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 7,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "B1B2C3DA",
            crops: generateCropsForTray(75, 20, 10)
          }
        },
        {
          slot_number: 8,
          occupied: true,
          tray: {
            id: "TR-15199256",
            utilization_percentage: 75,
            crop_count: 170,
            utilization_level: "high",
            rfid_tag: "B1B2C3DB",
            crops: generateCropsForTray(75, 20, 10)
          }
        }
      ]
    },
    off_shelf_trays: [
      {
        id: "TR-15199256",
        utilization_percentage: 75,
        crop_count: 170,
        utilization_level: "high",
        rfid_tag: "C1B2C3D4",
        crops: generateCropsForTray(75, 20, 10)
      },
      {
        id: "TR-15199256",
        utilization_percentage: 55,
        crop_count: 120,
        utilization_level: "medium",
        rfid_tag: "C1B2C3D5",
        crops: generateCropsForTray(55, 20, 10)
      }
    ]
  };

  const mockCultivationData: CultivationAreaData = {
    utilization_percentage: 90,
    walls: [
      {
        wall_number: 1,
        name: "Wall 1",
        slots: [
          {
            slot_number: 1,
            occupied: true,
            panel: {
              id: "PN-10-662850-5223",
              utilization_percentage: 75,
              crop_count: 45,
              utilization_level: "high",
              rfid_tag: "J9K0L1M2",
              channels: [
                {
                  channel_number: 1,
                  crops: [
                    {
                      id: "crop-101",
                      seed_type: "Basil",
                      channel: 1,
                      position: 25,
                      age_days: 28,
                      seeded_date: "2025-01-01",
                      transplanted_date: "2025-01-15",
                      planned_harvesting_date: "2025-03-01",
                      overdue_days: 0,
                      health_status: "healthy",
                      size: "large"
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    overflow_panels: []
  };

  const mockCropHistory: CropHistory = {
    crop_id: "crop-001",
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
        notes: "Initial seeding"
      }
    ]
  };

  if (url.includes('/inventory/nursery')) {
    return mockNurseryData as T;
  }
  if (url.includes('/inventory/cultivation')) {
    return mockCultivationData as T;
  }
  if (url.includes('/crops/') && url.includes('/history')) {
    return mockCropHistory as T;
  }
  if (method === 'POST' && url.includes('/inventory/trays/provision')) {
    return {
      id: "tray-abc12345",
      rfid_tag: "A1B2C3D4",
      container_id: "container-123",
      shelf: "upper",
      slot_number: 5,
      location_display: "Shelf Upper, Slot 5",
      notes: "Mock provisioned tray",
      created: new Date().toISOString(),
      message: "Tray tray-abc12345 successfully provisioned at Shelf Upper, Slot 5"
    } as T;
  }
  if (method === 'POST' && url.includes('/inventory/panels/provision')) {
    return {
      id: "panel-def67890",
      rfid_tag: "J9K0L1M2",
      container_id: "container-123",
      wall: "wall_1",
      slot_number: 15,
      location_display: "Wall 1, Slot 15",
      notes: "Mock provisioned panel",
      created: new Date().toISOString(),
      message: "Panel panel-def67890 successfully provisioned at Wall 1, Slot 15"
    } as T;
  }
  if (method === 'POST' && url.includes('/inventory/trays')) {
    return {
      id: "TR-10-595383-3133",
      rfid_tag: "A1B2C3D4",
      location: { shelf: "upper", slot_number: 5 },
      provisioned_at: new Date().toISOString(),
      status: "available"
    } as T;
  }
  if (method === 'POST' && url.includes('/inventory/panels')) {
    return {
      id: "PN-10-662850-5225",
      rfid_tag: "J9K0L1M2",
      location: { wall: "wall_1", slot_number: 15 },
      provisioned_at: new Date().toISOString(),
      status: "available"
    } as T;
  }

  throw new Error(`No mock data available for URL: ${url}`);
}

/**
 * Inventory Service for Container Inventory Tab
 * Provides methods to interact with nursery station and cultivation area data
 */
class InventoryService {
  /**
   * Get nursery station layout and tray data for a specific date
   * @param containerId - The ID of the container
   * @param date - Date for time-lapse view (ISO format, optional)
   * @returns Promise<NurseryStationData>
   */
  async getNurseryStationData(containerId: string, date?: string): Promise<NurseryStationData> {
    return apiRequest<NurseryStationData>({
      method: 'GET',
      url: config.endpoints.inventoryNursery(containerId),
      params: { date },
    });
  }

  /**
   * Get cultivation area layout and panel data for a specific date
   * @param containerId - The ID of the container
   * @param date - Date for time-lapse view (ISO format, optional)
   * @returns Promise<CultivationAreaData>
   */
  async getCultivationAreaData(containerId: string, date?: string): Promise<CultivationAreaData> {
    return apiRequest<CultivationAreaData>({
      method: 'GET',
      url: config.endpoints.inventoryCultivation(containerId),
      params: { date },
    });
  }

  /**
   * Provision a new tray in the container
   * @param containerId - The ID of the container
   * @param trayData - Tray creation data including RFID tag and location
   * @returns Promise<TrayResponse>
   */
  async provisionTray(containerId: string, trayData: TrayCreate): Promise<TrayResponse> {
    return apiRequest<TrayResponse>({
      method: 'POST',
      url: config.endpoints.inventoryTrays(containerId),
      data: trayData,
    });
  }

  /**
   * Provision a new panel in the container
   * @param containerId - The ID of the container
   * @param panelData - Panel creation data including RFID tag and location
   * @returns Promise<PanelResponse>
   */
  async provisionPanel(containerId: string, panelData: PanelCreate): Promise<PanelResponse> {
    return apiRequest<PanelResponse>({
      method: 'POST',
      url: config.endpoints.inventoryPanels(containerId),
      data: panelData,
    });
  }

  /**
   * Provision a new tray with specific location and RFID tag
   * @param containerId - The ID of the container
   * @param shelf - Shelf type (upper/lower)
   * @param slot - Slot number
   * @param trayData - Tray provisioning data including RFID tag and notes
   * @returns Promise<TrayProvisionResponse>
   */
  async provisionTrayWithLocation(
    containerId: string,
    shelf: string,
    slot: number,
    trayData: TrayProvisionRequest
  ): Promise<TrayProvisionResponse> {
    return apiRequest<TrayProvisionResponse>({
      method: 'POST',
      url: config.endpoints.inventoryTrayProvision(containerId),
      params: { shelf, slot },
      data: trayData,
    });
  }

  /**
   * Provision a new panel with specific location and RFID tag
   * @param containerId - The ID of the container
   * @param wall - Wall type (wall_1/wall_2)
   * @param slot - Slot number
   * @param panelData - Panel provisioning data including RFID tag and notes
   * @returns Promise<PanelProvisionResponse>
   */
  async provisionPanelWithLocation(
    containerId: string,
    wall: string,
    slot: number,
    panelData: PanelProvisionRequest
  ): Promise<PanelProvisionResponse> {
    return apiRequest<PanelProvisionResponse>({
      method: 'POST',
      url: config.endpoints.inventoryPanelProvision(containerId),
      params: { wall, slot },
      data: panelData,
    });
  }

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
}

// Export singleton instance
export const inventoryService = new InventoryService();
export default inventoryService;