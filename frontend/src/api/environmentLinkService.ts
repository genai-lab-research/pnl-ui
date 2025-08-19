/**
 * Environment Link Service
 * Handles all environment link related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { 
  EnvironmentLink,
  EnvironmentLinksResponse,
  UpdateEnvironmentLinksRequest,
  EnvironmentSyncStatus,
  EnvironmentConnectionTest,
  BulkEnvironmentConnectionTest
} from '../types/environmentLinks';
import { ApiError } from './index';

export class EnvironmentLinkService extends BaseApiService {
  private static instance: EnvironmentLinkService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): EnvironmentLinkService {
    if (!EnvironmentLinkService.instance) {
      EnvironmentLinkService.instance = new EnvironmentLinkService(baseURL);
    }
    return EnvironmentLinkService.instance;
  }

  /**
   * Get environment links for a container
   */
  public async getEnvironmentLinks(containerId: number): Promise<EnvironmentLinksResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<EnvironmentLinksResponse>(`/containers/${containerId}/environment-links`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch environment links for container ${containerId}`);
    }
  }

  /**
   * Update environment links for a container
   */
  public async updateEnvironmentLinks(
    containerId: number, 
    environmentData: UpdateEnvironmentLinksRequest
  ): Promise<EnvironmentLinksResponse> {
    try {
      const response = await this.makeAuthenticatedRequest<EnvironmentLinksResponse>(`/containers/${containerId}/environment-links`, {
        method: 'PUT',
        body: JSON.stringify(environmentData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update environment links for container ${containerId}`);
    }
  }

  /**
   * Test connection to a specific environment
   */
  public async testEnvironmentConnection(
    containerId: number,
    environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
  ): Promise<EnvironmentConnectionTest> {
    try {
      const response = await this.makeAuthenticatedRequest<EnvironmentConnectionTest>(
        `/containers/${containerId}/environment-links/${environmentType}/test`, 
        {
          method: 'POST',
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to test ${environmentType} connection for container ${containerId}`);
    }
  }

  /**
   * Test all environment connections for a container
   */
  public async testAllEnvironmentConnections(containerId: number): Promise<BulkEnvironmentConnectionTest> {
    try {
      const response = await this.makeAuthenticatedRequest<BulkEnvironmentConnectionTest>(
        `/containers/${containerId}/environment-links/test-all`, 
        {
          method: 'POST',
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to test all environment connections for container ${containerId}`);
    }
  }

  /**
   * Get environment sync status
   */
  public async getEnvironmentSyncStatus(containerId: number): Promise<EnvironmentSyncStatus> {
    try {
      const response = await this.makeAuthenticatedRequest<EnvironmentSyncStatus>(
        `/containers/${containerId}/environment-links/sync-status`, 
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch environment sync status for container ${containerId}`);
    }
  }

  /**
   * Trigger manual sync for a specific environment
   */
  public async syncEnvironment(
    containerId: number,
    environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
  ): Promise<{ message: string; sync_initiated: boolean; estimated_duration_minutes: number }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ 
        message: string; 
        sync_initiated: boolean; 
        estimated_duration_minutes: number 
      }>(`/containers/${containerId}/environment-links/${environmentType}/sync`, {
        method: 'POST',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to sync ${environmentType} for container ${containerId}`);
    }
  }

  /**
   * Trigger manual sync for all environments
   */
  public async syncAllEnvironments(containerId: number): Promise<{ 
    message: string; 
    sync_initiated: boolean; 
    environments_queued: string[];
    estimated_duration_minutes: number;
  }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ 
        message: string; 
        sync_initiated: boolean; 
        environments_queued: string[];
        estimated_duration_minutes: number;
      }>(`/containers/${containerId}/environment-links/sync-all`, {
        method: 'POST',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to sync all environments for container ${containerId}`);
    }
  }

  /**
   * Disconnect from a specific environment
   */
  public async disconnectEnvironment(
    containerId: number,
    environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
  ): Promise<{ message: string; disconnected: boolean }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string; disconnected: boolean }>(
        `/containers/${containerId}/environment-links/${environmentType}/disconnect`, 
        {
          method: 'POST',
        }
      );

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to disconnect from ${environmentType} for container ${containerId}`);
    }
  }

  /**
   * Get environment configuration templates
   */
  public async getEnvironmentTemplates(
    environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
  ): Promise<{ template: Record<string, any>; required_fields: string[]; optional_fields: string[] }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ 
        template: Record<string, any>; 
        required_fields: string[]; 
        optional_fields: string[] 
      }>(`/environment-links/templates/${environmentType}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch environment template for ${environmentType}`);
    }
  }

  /**
   * Validate environment configuration before saving
   */
  public async validateEnvironmentConfig(
    environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh',
    config: Record<string, any>
  ): Promise<{ 
    is_valid: boolean; 
    errors: string[]; 
    warnings: string[];
    can_connect: boolean;
  }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ 
        is_valid: boolean; 
        errors: string[]; 
        warnings: string[];
        can_connect: boolean;
      }>(`/environment-links/validate/${environmentType}`, {
        method: 'POST',
        body: JSON.stringify({ config }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to validate ${environmentType} configuration`);
    }
  }

  /**
   * Get environment integration logs
   */
  public async getEnvironmentLogs(
    containerId: number,
    environmentType?: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh',
    startDate?: string,
    endDate?: string,
    logLevel?: 'debug' | 'info' | 'warning' | 'error'
  ): Promise<Array<{
    timestamp: string;
    environment_type: string;
    level: string;
    message: string;
    details?: Record<string, any>;
  }>> {
    try {
      const queryParams = new URLSearchParams();
      if (environmentType) queryParams.append('environment_type', environmentType);
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);
      if (logLevel) queryParams.append('log_level', logLevel);

      const url = `/containers/${containerId}/environment-links/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<Array<{
        timestamp: string;
        environment_type: string;
        level: string;
        message: string;
        details?: Record<string, any>;
      }>>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch environment logs for container ${containerId}`);
    }
  }

  /**
   * Get data export from environment
   */
  public async exportEnvironmentData(
    containerId: number,
    environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh',
    dataTypes: string[],
    startDate: string,
    endDate: string,
    format: 'json' | 'csv' | 'xlsx' = 'json'
  ): Promise<{ download_url: string; expires_at: string; file_size_bytes: number }> {
    try {
      const requestBody = {
        data_types: dataTypes,
        start_date: startDate,
        end_date: endDate,
        format
      };

      const response = await this.makeAuthenticatedRequest<{ 
        download_url: string; 
        expires_at: string; 
        file_size_bytes: number 
      }>(`/containers/${containerId}/environment-links/${environmentType}/export`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to export data from ${environmentType} for container ${containerId}`);
    }
  }
}

// Create and export singleton instance
export const environmentLinkService = EnvironmentLinkService.getInstance();

// Export utility functions for easier usage
export const getEnvironmentLinks = (containerId: number): Promise<EnvironmentLinksResponse> => 
  environmentLinkService.getEnvironmentLinks(containerId);

export const updateEnvironmentLinks = (
  containerId: number, 
  environmentData: UpdateEnvironmentLinksRequest
): Promise<EnvironmentLinksResponse> => 
  environmentLinkService.updateEnvironmentLinks(containerId, environmentData);

export const testEnvironmentConnection = (
  containerId: number,
  environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
): Promise<EnvironmentConnectionTest> => 
  environmentLinkService.testEnvironmentConnection(containerId, environmentType);

export const testAllEnvironmentConnections = (containerId: number): Promise<BulkEnvironmentConnectionTest> => 
  environmentLinkService.testAllEnvironmentConnections(containerId);

export const getEnvironmentSyncStatus = (containerId: number): Promise<EnvironmentSyncStatus> => 
  environmentLinkService.getEnvironmentSyncStatus(containerId);

export const syncEnvironment = (
  containerId: number,
  environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
): Promise<{ message: string; sync_initiated: boolean; estimated_duration_minutes: number }> => 
  environmentLinkService.syncEnvironment(containerId, environmentType);

export const syncAllEnvironments = (containerId: number): Promise<{ 
  message: string; 
  sync_initiated: boolean; 
  environments_queued: string[];
  estimated_duration_minutes: number;
}> => 
  environmentLinkService.syncAllEnvironments(containerId);

export const disconnectEnvironment = (
  containerId: number,
  environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
): Promise<{ message: string; disconnected: boolean }> => 
  environmentLinkService.disconnectEnvironment(containerId, environmentType);

export const getEnvironmentTemplates = (
  environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh'
): Promise<{ template: Record<string, any>; required_fields: string[]; optional_fields: string[] }> => 
  environmentLinkService.getEnvironmentTemplates(environmentType);

export const validateEnvironmentConfig = (
  environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh',
  config: Record<string, any>
): Promise<{ 
  is_valid: boolean; 
  errors: string[]; 
  warnings: string[];
  can_connect: boolean;
}> => 
  environmentLinkService.validateEnvironmentConfig(environmentType, config);

export const getEnvironmentLogs = (
  containerId: number,
  environmentType?: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh',
  startDate?: string,
  endDate?: string,
  logLevel?: 'debug' | 'info' | 'warning' | 'error'
): Promise<Array<{
  timestamp: string;
  environment_type: string;
  level: string;
  message: string;
  details?: Record<string, any>;
}>> => 
  environmentLinkService.getEnvironmentLogs(containerId, environmentType, startDate, endDate, logLevel);

export const exportEnvironmentData = (
  containerId: number,
  environmentType: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh',
  dataTypes: string[],
  startDate: string,
  endDate: string,
  format: 'json' | 'csv' | 'xlsx' = 'json'
): Promise<{ download_url: string; expires_at: string; file_size_bytes: number }> => 
  environmentLinkService.exportEnvironmentData(containerId, environmentType, dataTypes, startDate, endDate, format);
