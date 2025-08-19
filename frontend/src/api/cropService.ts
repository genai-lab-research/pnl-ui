/**
 * Crop Service
 * Handles all crop-related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { 
  Crop, 
  CreateCropRequest, 
  UpdateCropRequest, 
  CropFilterCriteria, 
  CropListResponse,
  CropSummaryStats,
  CropGrowthData,
  CropCareSchedule,
  CropTask
} from '../types/crops';
import { ApiError } from './index';

export class CropService extends BaseApiService {
  private static instance: CropService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): CropService {
    if (!CropService.instance) {
      CropService.instance = new CropService(baseURL);
    }
    return CropService.instance;
  }

  /**
   * Get all crops with optional filtering
   */
  public async getAllCrops(filters?: CropFilterCriteria): Promise<CropListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `/crops/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<CropListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch crops');
    }
  }

  /**
   * Create a new crop
   */
  public async createCrop(cropData: CreateCropRequest): Promise<Crop> {
    try {
      const response = await this.makeAuthenticatedRequest<Crop>('/crops/', {
        method: 'POST',
        body: JSON.stringify(cropData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create crop');
    }
  }

  /**
   * Get crop by ID
   */
  public async getCropById(id: number): Promise<Crop> {
    try {
      const response = await this.makeAuthenticatedRequest<Crop>(`/crops/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch crop with ID ${id}`);
    }
  }

  /**
   * Update crop
   */
  public async updateCrop(id: number, cropData: UpdateCropRequest): Promise<Crop> {
    try {
      const response = await this.makeAuthenticatedRequest<Crop>(`/crops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cropData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update crop with ID ${id}`);
    }
  }

  /**
   * Delete crop
   */
  public async deleteCrop(id: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/crops/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete crop with ID ${id}`);
    }
  }

  /**
   * Get crops by seed type
   */
  public async getCropsBySeedType(seedTypeId: number): Promise<Crop[]> {
    try {
      const response = await this.makeAuthenticatedRequest<CropListResponse>(`/crops/?seed_type_id=${seedTypeId}`, {
        method: 'GET',
      });

      return response.crops;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch crops for seed type ${seedTypeId}`);
    }
  }

  /**
   * Get crop summary statistics
   */
  public async getCropSummary(containerId?: number): Promise<CropSummaryStats> {
    try {
      const queryParams = containerId ? `?container_id=${containerId}` : '';
      const response = await this.makeAuthenticatedRequest<CropSummaryStats>(`/crops/summary${queryParams}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch crop summary');
    }
  }

  /**
   * Get crop growth data and analytics
   */
  public async getCropGrowthData(id: number): Promise<CropGrowthData> {
    try {
      const response = await this.makeAuthenticatedRequest<CropGrowthData>(`/crops/${id}/growth`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch growth data for crop ${id}`);
    }
  }

  /**
   * Get crop care schedule
   */
  public async getCropCareSchedule(id: number): Promise<CropCareSchedule> {
    try {
      const response = await this.makeAuthenticatedRequest<CropCareSchedule>(`/crops/${id}/care-schedule`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch care schedule for crop ${id}`);
    }
  }

  /**
   * Complete a crop task
   */
  public async completeCropTask(cropId: number, taskId: number, notes?: string): Promise<CropTask> {
    try {
      const response = await this.makeAuthenticatedRequest<CropTask>(`/crops/${cropId}/tasks/${taskId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to complete task ${taskId} for crop ${cropId}`);
    }
  }

  /**
   * Add crop measurement
   */
  public async addCropMeasurement(
    cropId: number, 
    measurementData: {
      height_cm: number;
      leaf_count: number;
      stem_diameter_mm: number;
      health_score: number;
      notes?: string;
      image_url?: string;
    }
  ): Promise<{ id: number; message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ id: number; message: string }>(`/crops/${cropId}/measurements`, {
        method: 'POST',
        body: JSON.stringify(measurementData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to add measurement for crop ${cropId}`);
    }
  }

  /**
   * Update crop location
   */
  public async updateCropLocation(
    cropId: number, 
    newLocation: Record<string, any>
  ): Promise<Crop> {
    try {
      const response = await this.makeAuthenticatedRequest<Crop>(`/crops/${cropId}/location`, {
        method: 'PUT',
        body: JSON.stringify({ location: newLocation }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update location for crop ${cropId}`);
    }
  }

  /**
   * Harvest crop
   */
  public async harvestCrop(
    cropId: number, 
    harvestData: {
      actual_yield_kg: number;
      quality_grade: 'A' | 'B' | 'C';
      notes?: string;
    }
  ): Promise<Crop> {
    try {
      const response = await this.makeAuthenticatedRequest<Crop>(`/crops/${cropId}/harvest`, {
        method: 'POST',
        body: JSON.stringify(harvestData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to harvest crop ${cropId}`);
    }
  }

  /**
   * Get crops ready for harvest
   */
  public async getCropsReadyForHarvest(containerId?: number): Promise<Crop[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('lifecycle_status', 'ready_for_harvest');
      if (containerId) {
        queryParams.append('container_id', containerId.toString());
      }

      const response = await this.makeAuthenticatedRequest<CropListResponse>(`/crops/?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.crops;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch crops ready for harvest');
    }
  }

  /**
   * Get overdue crops (past planned harvest date)
   */
  public async getOverdueCrops(containerId?: number): Promise<Crop[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('overdue', 'true');
      if (containerId) {
        queryParams.append('container_id', containerId.toString());
      }

      const response = await this.makeAuthenticatedRequest<CropListResponse>(`/crops/?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.crops;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch overdue crops');
    }
  }
}

// Create and export singleton instance
export const cropService = CropService.getInstance();

// Export utility functions for easier usage
export const getAllCrops = (filters?: CropFilterCriteria): Promise<CropListResponse> => 
  cropService.getAllCrops(filters);

export const createNewCrop = (cropData: CreateCropRequest): Promise<Crop> => 
  cropService.createCrop(cropData);

export const getCropById = (id: number): Promise<Crop> => 
  cropService.getCropById(id);

export const updateExistingCrop = (id: number, cropData: UpdateCropRequest): Promise<Crop> => 
  cropService.updateCrop(id, cropData);

export const deleteCropById = (id: number): Promise<{ message: string }> => 
  cropService.deleteCrop(id);

export const getCropsBySeedType = (seedTypeId: number): Promise<Crop[]> => 
  cropService.getCropsBySeedType(seedTypeId);

export const getCropSummary = (containerId?: number): Promise<CropSummaryStats> => 
  cropService.getCropSummary(containerId);

export const getCropGrowthData = (id: number): Promise<CropGrowthData> => 
  cropService.getCropGrowthData(id);

export const getCropCareSchedule = (id: number): Promise<CropCareSchedule> => 
  cropService.getCropCareSchedule(id);

export const completeCropTask = (cropId: number, taskId: number, notes?: string): Promise<CropTask> => 
  cropService.completeCropTask(cropId, taskId, notes);

export const addCropMeasurement = (
  cropId: number, 
  measurementData: {
    height_cm: number;
    leaf_count: number;
    stem_diameter_mm: number;
    health_score: number;
    notes?: string;
    image_url?: string;
  }
): Promise<{ id: number; message: string }> => 
  cropService.addCropMeasurement(cropId, measurementData);

export const updateCropLocation = (cropId: number, newLocation: Record<string, any>): Promise<Crop> => 
  cropService.updateCropLocation(cropId, newLocation);

export const harvestCrop = (
  cropId: number, 
  harvestData: {
    actual_yield_kg: number;
    quality_grade: 'A' | 'B' | 'C';
    notes?: string;
  }
): Promise<Crop> => 
  cropService.harvestCrop(cropId, harvestData);

export const getCropsReadyForHarvest = (containerId?: number): Promise<Crop[]> => 
  cropService.getCropsReadyForHarvest(containerId);

export const getOverdueCrops = (containerId?: number): Promise<Crop[]> => 
  cropService.getOverdueCrops(containerId);
