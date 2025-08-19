/**
 * Panel Service
 * Handles all panel-related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { Panel } from '../types/containers';
import { ApiError } from './index';

export interface CreatePanelRequest {
  container_id: number;
  rfid_tag: string;
  location: Record<string, any>;
  capacity: number;
  panel_type: string;
  status?: string;
}

export interface UpdatePanelRequest {
  rfid_tag?: string;
  location?: Record<string, any>;
  utilization_pct?: number;
  status?: string;
  capacity?: number;
  panel_type?: string;
}

export interface PanelFilterCriteria {
  container_id?: number;
  status?: string | string[];
  panel_type?: string;
  utilization_min?: number;
  utilization_max?: number;
  rfid_tag?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PanelListResponse {
  panels: Panel[];
  total: number;
  skip: number;
  limit: number;
  utilization_summary: {
    average_utilization: number;
    total_capacity: number;
    used_capacity: number;
  };
}

export interface PanelProvisioningRequest {
  panel_id: number;
  seed_type_id: number;
  plant_count: number;
  spacing_cm: number;
  notes?: string;
}

export interface PanelProvisioningResponse {
  panel_id: number;
  provisioning_id: string;
  status: 'provisioned' | 'failed';
  provisioned_plants: number;
  provisioned_at: string;
  notes?: string;
}

export class PanelService extends BaseApiService {
  private static instance: PanelService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): PanelService {
    if (!PanelService.instance) {
      PanelService.instance = new PanelService(baseURL);
    }
    return PanelService.instance;
  }

  /**
   * Get all panels with optional filtering
   */
  public async getAllPanels(filters?: PanelFilterCriteria): Promise<PanelListResponse> {
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

      const url = `/panels/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<PanelListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch panels');
    }
  }

  /**
   * Create a new panel
   */
  public async createPanel(panelData: CreatePanelRequest): Promise<Panel> {
    try {
      const response = await this.makeAuthenticatedRequest<Panel>('/panels/', {
        method: 'POST',
        body: JSON.stringify(panelData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create panel');
    }
  }

  /**
   * Get panel by ID
   */
  public async getPanelById(id: number): Promise<Panel> {
    try {
      const response = await this.makeAuthenticatedRequest<Panel>(`/panels/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch panel with ID ${id}`);
    }
  }

  /**
   * Update panel
   */
  public async updatePanel(id: number, panelData: UpdatePanelRequest): Promise<Panel> {
    try {
      const response = await this.makeAuthenticatedRequest<Panel>(`/panels/${id}`, {
        method: 'PUT',
        body: JSON.stringify(panelData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update panel with ID ${id}`);
    }
  }

  /**
   * Delete panel
   */
  public async deletePanel(id: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/panels/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete panel with ID ${id}`);
    }
  }

  /**
   * Get panels for a specific container
   */
  public async getPanelsForContainer(containerId: number): Promise<Panel[]> {
    try {
      const response = await this.makeAuthenticatedRequest<PanelListResponse>(`/panels/?container_id=${containerId}`, {
        method: 'GET',
      });

      return response.panels;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch panels for container ${containerId}`);
    }
  }

  /**
   * Provision panel with plants
   */
  public async provisionPanel(provisioningData: PanelProvisioningRequest): Promise<PanelProvisioningResponse> {
    try {
      const { panel_id, ...requestBody } = provisioningData;
      const response = await this.makeAuthenticatedRequest<PanelProvisioningResponse>(`/panels/${panel_id}/provision`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to provision panel`);
    }
  }

  /**
   * Clear panel (remove all plants)
   */
  public async clearPanel(id: number, notes?: string): Promise<{ message: string; cleared_at: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string; cleared_at: string }>(`/panels/${id}/clear`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to clear panel with ID ${id}`);
    }
  }

  /**
   * Move panel to new location
   */
  public async movePanel(id: number, newLocation: Record<string, any>): Promise<Panel> {
    try {
      const response = await this.makeAuthenticatedRequest<Panel>(`/panels/${id}/move`, {
        method: 'POST',
        body: JSON.stringify({ location: newLocation }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to move panel with ID ${id}`);
    }
  }

  /**
   * Get panel by RFID tag
   */
  public async getPanelByRFID(rfidTag: string): Promise<Panel> {
    try {
      const response = await this.makeAuthenticatedRequest<Panel>(`/panels/rfid/${encodeURIComponent(rfidTag)}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch panel with RFID tag ${rfidTag}`);
    }
  }

  /**
   * Get panel utilization history
   */
  public async getPanelUtilizationHistory(
    id: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<Array<{ timestamp: string; utilization_pct: number; plant_count: number }>> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const url = `/panels/${id}/utilization-history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<Array<{ timestamp: string; utilization_pct: number; plant_count: number }>>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch utilization history for panel ${id}`);
    }
  }

  /**
   * Get available panels (low utilization)
   */
  public async getAvailablePanels(containerId?: number, maxUtilization = 80): Promise<Panel[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('utilization_max', maxUtilization.toString());
      if (containerId) {
        queryParams.append('container_id', containerId.toString());
      }

      const response = await this.makeAuthenticatedRequest<PanelListResponse>(`/panels/?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.panels;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch available panels');
    }
  }

  /**
   * Adjust panel lighting
   */
  public async adjustPanelLighting(
    id: number, 
    settings: {
      intensity_percent: number;
      spectrum?: string;
      schedule?: string;
    }
  ): Promise<{ message: string; applied_at: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string; applied_at: string }>(`/panels/${id}/lighting`, {
        method: 'POST',
        body: JSON.stringify(settings),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to adjust lighting for panel ${id}`);
    }
  }
}

// Create and export singleton instance
export const panelService = PanelService.getInstance();

// Export utility functions for easier usage
export const getAllPanels = (filters?: PanelFilterCriteria): Promise<PanelListResponse> => 
  panelService.getAllPanels(filters);

export const createNewPanel = (panelData: CreatePanelRequest): Promise<Panel> => 
  panelService.createPanel(panelData);

export const getPanelById = (id: number): Promise<Panel> => 
  panelService.getPanelById(id);

export const updateExistingPanel = (id: number, panelData: UpdatePanelRequest): Promise<Panel> => 
  panelService.updatePanel(id, panelData);

export const deletePanelById = (id: number): Promise<{ message: string }> => 
  panelService.deletePanel(id);

export const getPanelsForContainer = (containerId: number): Promise<Panel[]> => 
  panelService.getPanelsForContainer(containerId);

export const provisionPanel = (provisioningData: PanelProvisioningRequest): Promise<PanelProvisioningResponse> => 
  panelService.provisionPanel(provisioningData);

export const clearPanel = (id: number, notes?: string): Promise<{ message: string; cleared_at: string }> => 
  panelService.clearPanel(id, notes);

export const movePanel = (id: number, newLocation: Record<string, any>): Promise<Panel> => 
  panelService.movePanel(id, newLocation);

export const getPanelByRFID = (rfidTag: string): Promise<Panel> => 
  panelService.getPanelByRFID(rfidTag);

export const getPanelUtilizationHistory = (
  id: number, 
  startDate?: string, 
  endDate?: string
): Promise<Array<{ timestamp: string; utilization_pct: number; plant_count: number }>> => 
  panelService.getPanelUtilizationHistory(id, startDate, endDate);

export const getAvailablePanels = (containerId?: number, maxUtilization = 80): Promise<Panel[]> => 
  panelService.getAvailablePanels(containerId, maxUtilization);

export const adjustPanelLighting = (
  id: number, 
  settings: {
    intensity_percent: number;
    spectrum?: string;
    schedule?: string;
  }
): Promise<{ message: string; applied_at: string }> => 
  panelService.adjustPanelLighting(id, settings);
