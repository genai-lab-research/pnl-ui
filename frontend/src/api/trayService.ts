/**
 * Tray Service
 * Handles all tray-related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { Tray } from '../types/containers';
import { ApiError } from './index';

export interface CreateTrayRequest {
  container_id: number;
  rfid_tag: string;
  location: Record<string, any>;
  capacity: number;
  tray_type: string;
  status?: string;
}

export interface UpdateTrayRequest {
  rfid_tag?: string;
  location?: Record<string, any>;
  utilization_pct?: number;
  status?: string;
  capacity?: number;
  tray_type?: string;
}

export interface TrayFilterCriteria {
  container_id?: number;
  status?: string | string[];
  tray_type?: string;
  utilization_min?: number;
  utilization_max?: number;
  rfid_tag?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TrayListResponse {
  trays: Tray[];
  total: number;
  skip: number;
  limit: number;
  utilization_summary: {
    average_utilization: number;
    total_capacity: number;
    used_capacity: number;
  };
}

export interface TrayProvisioningRequest {
  tray_id: number;
  seed_type_id: number;
  plant_count: number;
  spacing_cm: number;
  notes?: string;
}

export interface TrayProvisioningResponse {
  tray_id: number;
  provisioning_id: string;
  status: 'provisioned' | 'failed';
  provisioned_plants: number;
  provisioned_at: string;
  notes?: string;
}

export class TrayService extends BaseApiService {
  private static instance: TrayService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): TrayService {
    if (!TrayService.instance) {
      TrayService.instance = new TrayService(baseURL);
    }
    return TrayService.instance;
  }

  /**
   * Get all trays with optional filtering
   */
  public async getAllTrays(filters?: TrayFilterCriteria): Promise<TrayListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const url = `/trays/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<TrayListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch trays');
    }
  }

  /**
   * Create a new tray
   */
  public async createTray(trayData: CreateTrayRequest): Promise<Tray> {
    try {
      const response = await this.makeAuthenticatedRequest<Tray>('/trays/', {
        method: 'POST',
        body: JSON.stringify(trayData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create tray');
    }
  }

  /**
   * Get tray by ID
   */
  public async getTrayById(id: number): Promise<Tray> {
    try {
      const response = await this.makeAuthenticatedRequest<Tray>(`/trays/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch tray with ID ${id}`);
    }
  }

  /**
   * Update tray
   */
  public async updateTray(id: number, trayData: UpdateTrayRequest): Promise<Tray> {
    try {
      const response = await this.makeAuthenticatedRequest<Tray>(`/trays/${id}`, {
        method: 'PUT',
        body: JSON.stringify(trayData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update tray with ID ${id}`);
    }
  }

  /**
   * Delete tray
   */
  public async deleteTray(id: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/trays/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete tray with ID ${id}`);
    }
  }

  /**
   * Get trays for a specific container
   */
  public async getTraysForContainer(containerId: number): Promise<Tray[]> {
    try {
      const response = await this.makeAuthenticatedRequest<TrayListResponse>(`/trays/?container_id=${containerId}`, {
        method: 'GET',
      });

      return response.trays;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch trays for container ${containerId}`);
    }
  }

  /**
   * Provision tray with plants
   */
  public async provisionTray(provisioningData: TrayProvisioningRequest): Promise<TrayProvisioningResponse> {
    try {
      const { tray_id, ...requestBody } = provisioningData;
      const response = await this.makeAuthenticatedRequest<TrayProvisioningResponse>(`/trays/${tray_id}/provision`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to provision tray`);
    }
  }

  /**
   * Clear tray (remove all plants)
   */
  public async clearTray(id: number, notes?: string): Promise<{ message: string; cleared_at: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string; cleared_at: string }>(`/trays/${id}/clear`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to clear tray with ID ${id}`);
    }
  }

  /**
   * Move tray to new location
   */
  public async moveTray(id: number, newLocation: Record<string, any>): Promise<Tray> {
    try {
      const response = await this.makeAuthenticatedRequest<Tray>(`/trays/${id}/move`, {
        method: 'POST',
        body: JSON.stringify({ location: newLocation }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to move tray with ID ${id}`);
    }
  }

  /**
   * Get tray by RFID tag
   */
  public async getTrayByRFID(rfidTag: string): Promise<Tray> {
    try {
      const response = await this.makeAuthenticatedRequest<Tray>(`/trays/rfid/${encodeURIComponent(rfidTag)}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch tray with RFID tag ${rfidTag}`);
    }
  }

  /**
   * Get tray utilization history
   */
  public async getTrayUtilizationHistory(
    id: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<Array<{ timestamp: string; utilization_pct: number; plant_count: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const url = `/trays/${id}/utilization-history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<Array<{ timestamp: string; utilization_pct: number; plant_count: number }>>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch utilization history for tray ${id}`);
    }
  }

  /**
   * Get available trays (low utilization)
   */
  public async getAvailableTrays(containerId?: number, maxUtilization = 80): Promise<Tray[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('utilization_max', maxUtilization.toString());
      if (containerId) {
        queryParams.append('container_id', containerId.toString());
      }

      const response = await this.makeAuthenticatedRequest<TrayListResponse>(`/trays/?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.trays;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch available trays');
    }
  }
}

// Create and export singleton instance
export const trayService = TrayService.getInstance();

// Export utility functions for easier usage
export const getAllTrays = (filters?: TrayFilterCriteria): Promise<TrayListResponse> => 
  trayService.getAllTrays(filters);

export const createNewTray = (trayData: CreateTrayRequest): Promise<Tray> => 
  trayService.createTray(trayData);

export const getTrayById = (id: number): Promise<Tray> => 
  trayService.getTrayById(id);

export const updateExistingTray = (id: number, trayData: UpdateTrayRequest): Promise<Tray> => 
  trayService.updateTray(id, trayData);

export const deleteTrayById = (id: number): Promise<{ message: string }> => 
  trayService.deleteTray(id);

export const getTraysForContainer = (containerId: number): Promise<Tray[]> => 
  trayService.getTraysForContainer(containerId);

export const provisionTray = (provisioningData: TrayProvisioningRequest): Promise<TrayProvisioningResponse> => 
  trayService.provisionTray(provisioningData);

export const clearTray = (id: number, notes?: string): Promise<{ message: string; cleared_at: string }> => 
  trayService.clearTray(id, notes);

export const moveTray = (id: number, newLocation: Record<string, any>): Promise<Tray> => 
  trayService.moveTray(id, newLocation);

export const getTrayByRFID = (rfidTag: string): Promise<Tray> => 
  trayService.getTrayByRFID(rfidTag);

export const getTrayUtilizationHistory = (
  id: number, 
  startDate?: string, 
  endDate?: string
): Promise<Array<{ timestamp: string; utilization_pct: number; plant_count: number }>> => 
  trayService.getTrayUtilizationHistory(id, startDate, endDate);

export const getAvailableTrays = (containerId?: number, maxUtilization = 80): Promise<Tray[]> => 
  trayService.getAvailableTrays(containerId, maxUtilization);
