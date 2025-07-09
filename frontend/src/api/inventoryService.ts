import { 
  InventoryMetrics, 
  InventoryMetricsQueryCriteria,
  Crop,
  CropFilterCriteria
} from '../shared/types/metrics';
import { ApiResponse } from '../shared/types/containers';
import { apiConfig } from './config';

export class InventoryService {
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

  private buildMetricsQueryParams(criteria: InventoryMetricsQueryCriteria): string {
    const params = new URLSearchParams();
    
    if (criteria.date) params.append('date', criteria.date);
    
    return params.toString();
  }

  private buildCropQueryParams(criteria: CropFilterCriteria): string {
    const params = new URLSearchParams();
    
    if (criteria.seed_type) params.append('seed_type', criteria.seed_type);
    
    return params.toString();
  }

  async getInventoryMetrics(
    containerId: string, 
    criteria: InventoryMetricsQueryCriteria = {}
  ): Promise<ApiResponse<InventoryMetrics>> {
    const queryParams = this.buildMetricsQueryParams(criteria);
    const url = queryParams 
      ? `${this.baseUrl}/containers/${containerId}/inventory/metrics?${queryParams}` 
      : `${this.baseUrl}/containers/${containerId}/inventory/metrics`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<InventoryMetrics>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

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
}

// Default service instance
export const inventoryService = new InventoryService();