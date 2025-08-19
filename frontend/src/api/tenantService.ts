/**
 * Tenant Service
 * Handles all tenant-related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { Tenant } from '../types/containers';
import { ApiError } from './index';

export interface CreateTenantRequest {
  name: string;
}

export interface TenantListResponse {
  tenants: Tenant[];
  total: number;
}

export class TenantService extends BaseApiService {
  private static instance: TenantService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): TenantService {
    if (!TenantService.instance) {
      TenantService.instance = new TenantService(baseURL);
    }
    return TenantService.instance;
  }

  /**
   * Get all tenants
   */
  public async getAllTenants(): Promise<Tenant[]> {
    try {
      const response = await this.get<Tenant[]>('/tenants/');

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch tenants');
    }
  }

  /**
   * Create a new tenant
   */
  public async createTenant(tenantData: CreateTenantRequest): Promise<Tenant> {
    try {
      const response = await this.post<Tenant>('/tenants/', tenantData);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create tenant');
    }
  }

  /**
   * Get tenant by ID
   */
  public async getTenantById(id: number): Promise<Tenant> {
    try {
      const response = await this.get<Tenant>(`/tenants/${id}`);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch tenant with ID ${id}`);
    }
  }

  /**
   * Update tenant
   */
  public async updateTenant(id: number, tenantData: Partial<CreateTenantRequest>): Promise<Tenant> {
    try {
      const response = await this.put<Tenant>(`/tenants/${id}`, tenantData);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update tenant with ID ${id}`);
    }
  }

  /**
   * Delete tenant
   */
  public async deleteTenant(id: number): Promise<{ message: string }> {
    try {
      const response = await this.delete<{ message: string }>(`/tenants/${id}`);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete tenant with ID ${id}`);
    }
  }
}

// Create and export singleton instance
export const tenantService = TenantService.getInstance();

// Export utility functions for easier usage
export const getAllTenants = (): Promise<Tenant[]> => tenantService.getAllTenants();

export const createNewTenant = (tenantData: CreateTenantRequest): Promise<Tenant> => 
  tenantService.createTenant(tenantData);

export const getTenantById = (id: number): Promise<Tenant> => 
  tenantService.getTenantById(id);

export const updateExistingTenant = (id: number, tenantData: Partial<CreateTenantRequest>): Promise<Tenant> => 
  tenantService.updateTenant(id, tenantData);

export const deleteTenantById = (id: number): Promise<{ message: string }> => 
  tenantService.deleteTenant(id);
