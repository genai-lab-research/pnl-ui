import { 
  NurseryStation,
  CultivationArea,
  Crop,
  Tray,
  CreateTrayRequest,
  InventoryFilterCriteria,
  CropFilterCriteria
} from '../types/inventory';
import { ApiResponse } from '../shared/types/containers';
import { apiConfig } from './config';

export class InventoryManagementService {
  private baseUrl: string;

  constructor(baseUrl: string = apiConfig.baseUrl) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        return {
          error: {
            detail: errorData.detail || `HTTP ${response.status}`,
            status_code: response.status
          }
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  private buildInventoryQueryParams(criteria: InventoryFilterCriteria): string {
    const params = new URLSearchParams();
    
    if (criteria.date) params.append('date', criteria.date);
    
    return params.toString();
  }

  private buildCropQueryParams(criteria: CropFilterCriteria): string {
    const params = new URLSearchParams();
    
    if (criteria.seed_type) params.append('seed_type', criteria.seed_type);
    
    return params.toString();
  }

  /**
   * Get Nursery Station
   * Retrieves nursery station data for a specific container.
   * 
   * @param containerId - The ID of the container
   * @param criteria - Optional filter criteria including date
   * @returns Promise<ApiResponse<NurseryStation>>
   */
  async getNurseryStation(
    containerId: string, 
    criteria: InventoryFilterCriteria = {}
  ): Promise<ApiResponse<NurseryStation>> {
    const queryParams = this.buildInventoryQueryParams(criteria);
    const url = queryParams 
      ? `${this.baseUrl}/containers/${containerId}/inventory/nursery?${queryParams}` 
      : `${this.baseUrl}/containers/${containerId}/inventory/nursery`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<NurseryStation>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  /**
   * Add Tray
   * Adds a new tray to a container's inventory.
   * 
   * @param containerId - The ID of the container
   * @param trayData - The tray data to create
   * @returns Promise<ApiResponse<Tray>>
   */
  async addTray(
    containerId: string,
    trayData: CreateTrayRequest
  ): Promise<ApiResponse<Tray>> {
    try {
      const response = await fetch(`${this.baseUrl}/containers/${containerId}/inventory/tray`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trayData),
      });

      return this.handleResponse<Tray>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  /**
   * Get Crops
   * Retrieves all crops for a specific container, with optional filtering by seed type.
   * 
   * @param containerId - The ID of the container
   * @param criteria - Optional filter criteria including seed_type
   * @returns Promise<ApiResponse<Crop[]>>
   */
  async getCrops(
    containerId: string, 
    criteria: CropFilterCriteria = {}
  ): Promise<ApiResponse<Crop[]>> {
    const queryParams = this.buildCropQueryParams(criteria);
    const url = queryParams 
      ? `${this.baseUrl}/containers/${containerId}/inventory/crops?${queryParams}` 
      : `${this.baseUrl}/containers/${containerId}/inventory/crops`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<Crop[]>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  /**
   * Get Cultivation Area
   * Retrieves cultivation area data for a specific container.
   * 
   * @param containerId - The ID of the container
   * @param criteria - Optional filter criteria including date
   * @returns Promise<ApiResponse<CultivationArea>>
   */
  async getCultivationArea(
    containerId: string, 
    criteria: InventoryFilterCriteria = {}
  ): Promise<ApiResponse<CultivationArea>> {
    const queryParams = this.buildInventoryQueryParams(criteria);
    const url = queryParams 
      ? `${this.baseUrl}/containers/${containerId}/inventory/cultivation?${queryParams}` 
      : `${this.baseUrl}/containers/${containerId}/inventory/cultivation`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<CultivationArea>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  /**
   * Get Crop
   * Retrieves details for a specific crop in a container.
   * 
   * @param containerId - The ID of the container containing the crop
   * @param cropId - The ID of the crop to retrieve
   * @returns Promise<ApiResponse<Crop>>
   */
  async getCrop(
    containerId: string,
    cropId: string
  ): Promise<ApiResponse<Crop>> {
    try {
      const response = await fetch(`${this.baseUrl}/containers/${containerId}/inventory/crop/${cropId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<Crop>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }
}

// Default service instance
export const inventoryManagementService = new InventoryManagementService();