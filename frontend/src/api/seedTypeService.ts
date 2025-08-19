/**
 * Seed Type Service
 * Handles all seed type related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { SeedType } from '../types/containers';
import { ApiError } from './index';

export interface CreateSeedTypeRequest {
  name: string;
  variety: string;
  supplier: string;
  batch_id: string;
}

export interface UpdateSeedTypeRequest {
  name?: string;
  variety?: string;
  supplier?: string;
  batch_id?: string;
}

export interface SeedTypeFilterCriteria {
  name?: string;
  variety?: string;
  supplier?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SeedTypeListResponse {
  seed_types: SeedType[];
  total: number;
  skip: number;
  limit: number;
}

export class SeedTypeService extends BaseApiService {
  private static instance: SeedTypeService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): SeedTypeService {
    if (!SeedTypeService.instance) {
      SeedTypeService.instance = new SeedTypeService(baseURL);
    }
    return SeedTypeService.instance;
  }

  /**
   * Get all seed types with optional filtering
   */
  public async getAllSeedTypes(filters?: SeedTypeFilterCriteria): Promise<SeedType[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const url = `/seed-types/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<SeedType[]>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch seed types');
    }
  }

  /**
   * Create a new seed type
   */
  public async createSeedType(seedTypeData: CreateSeedTypeRequest): Promise<SeedType> {
    try {
      const response = await this.makeAuthenticatedRequest<SeedType>('/seed-types/', {
        method: 'POST',
        body: JSON.stringify(seedTypeData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create seed type');
    }
  }

  /**
   * Get seed type by ID
   */
  public async getSeedTypeById(id: number): Promise<SeedType> {
    try {
      const response = await this.makeAuthenticatedRequest<SeedType>(`/seed-types/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch seed type with ID ${id}`);
    }
  }

  /**
   * Update seed type
   */
  public async updateSeedType(id: number, seedTypeData: UpdateSeedTypeRequest): Promise<SeedType> {
    try {
      const response = await this.makeAuthenticatedRequest<SeedType>(`/seed-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(seedTypeData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update seed type with ID ${id}`);
    }
  }

  /**
   * Delete seed type
   */
  public async deleteSeedType(id: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/seed-types/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete seed type with ID ${id}`);
    }
  }

  /**
   * Get available seed types for a container
   */
  public async getAvailableSeedTypesForContainer(containerId: number): Promise<SeedType[]> {
    try {
      const response = await this.makeAuthenticatedRequest<SeedType[]>(`/seed-types/available/${containerId}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch available seed types for container ${containerId}`);
    }
  }

  /**
   * Check seed type compatibility with container
   */
  public async checkSeedTypeCompatibility(
    seedTypeId: number, 
    containerId: number
  ): Promise<{ compatible: boolean; reason?: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ compatible: boolean; reason?: string }>(
        `/seed-types/${seedTypeId}/compatibility/${containerId}`, 
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to check seed type compatibility`);
    }
  }
}

// Create and export singleton instance
export const seedTypeService = SeedTypeService.getInstance();

// Export utility functions for easier usage
export const getAllSeedTypes = (filters?: SeedTypeFilterCriteria): Promise<SeedType[]> => 
  seedTypeService.getAllSeedTypes(filters);

export const createNewSeedType = (seedTypeData: CreateSeedTypeRequest): Promise<SeedType> => 
  seedTypeService.createSeedType(seedTypeData);

export const getSeedTypeById = (id: number): Promise<SeedType> => 
  seedTypeService.getSeedTypeById(id);

export const updateExistingSeedType = (id: number, seedTypeData: UpdateSeedTypeRequest): Promise<SeedType> => 
  seedTypeService.updateSeedType(id, seedTypeData);

export const deleteSeedTypeById = (id: number): Promise<{ message: string }> => 
  seedTypeService.deleteSeedType(id);

export const getAvailableSeedTypesForContainer = (containerId: number): Promise<SeedType[]> => 
  seedTypeService.getAvailableSeedTypesForContainer(containerId);

export const checkSeedTypeCompatibility = (
  seedTypeId: number, 
  containerId: number
): Promise<{ compatible: boolean; reason?: string }> => 
  seedTypeService.checkSeedTypeCompatibility(seedTypeId, containerId);
