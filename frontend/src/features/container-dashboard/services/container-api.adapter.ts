// Container API Adapter
// Adapts backend container API responses to domain models

import { containerService } from '../../../api';
import { 
  ContainerDomainModel,
  FiltersDomainModel,
  PaginationDomainModel
} from '../models';
import {
  ContainerFilterCriteria,
  CreateContainerRequest,
  UpdateContainerRequest,
  ShutdownRequest
} from '../../../types/containers';

export interface ContainerListResult {
  containers: ContainerDomainModel[];
  pagination: PaginationDomainModel;
  error?: string;
}

export interface ContainerResult {
  container: ContainerDomainModel | null;
  error?: string;
}

export interface ContainerOperationResult {
  success: boolean;
  container?: ContainerDomainModel;
  message?: string;
  error?: string;
}

export class ContainerApiAdapter {
  private static instance: ContainerApiAdapter;

  private constructor() {}

  public static getInstance(): ContainerApiAdapter {
    if (!ContainerApiAdapter.instance) {
      ContainerApiAdapter.instance = new ContainerApiAdapter();
    }
    return ContainerApiAdapter.instance;
  }

  /**
   * Fetch containers with filtering and pagination
   */
  async getContainers(
    filters: FiltersDomainModel,
    pagination: PaginationDomainModel,
    sort: string = 'name',
    order: 'asc' | 'desc' = 'asc'
  ): Promise<ContainerListResult> {
    try {
      const apiFilters = filters.toApiFilters(
        pagination.state.currentPage,
        pagination.state.pageSize,
        sort,
        order
      );

      const response = await containerService.getContainers(apiFilters);
      
      const containers = response.containers.map(container => 
        ContainerDomainModel.fromApiResponse(container)
      );
      
      const paginationModel = PaginationDomainModel.fromApiResponse(response.pagination);

      return {
        containers,
        pagination: paginationModel
      };
    } catch (error) {
      return {
        containers: [],
        pagination: PaginationDomainModel.createDefault(),
        error: error instanceof Error ? error.message : 'Failed to fetch containers'
      };
    }
  }

  /**
   * Fetch a single container by ID
   */
  async getContainer(id: number): Promise<ContainerResult> {
    try {
      const response = await containerService.getContainer(id);
      const container = ContainerDomainModel.fromApiResponse(response);
      
      return { container };
    } catch (error) {
      return {
        container: null,
        error: error instanceof Error ? error.message : 'Failed to fetch container'
      };
    }
  }

  /**
   * Create a new container
   */
  async createContainer(data: CreateContainerRequest): Promise<ContainerOperationResult> {
    try {
      const response = await containerService.createContainer(data);
      const container = ContainerDomainModel.fromApiResponse(response);
      
      return {
        success: true,
        container,
        message: 'Container created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create container'
      };
    }
  }

  /**
   * Update an existing container
   */
  async updateContainer(id: number, data: UpdateContainerRequest): Promise<ContainerOperationResult> {
    try {
      const response = await containerService.updateContainer(id, data);
      const container = ContainerDomainModel.fromApiResponse(response);
      
      return {
        success: true,
        container,
        message: 'Container updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update container'
      };
    }
  }

  /**
   * Delete a container
   */
  async deleteContainer(id: number): Promise<ContainerOperationResult> {
    try {
      await containerService.deleteContainer(id);
      
      return {
        success: true,
        message: 'Container deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete container'
      };
    }
  }

  /**
   * Shutdown a container
   */
  async shutdownContainer(id: number, data: ShutdownRequest = {}): Promise<ContainerOperationResult> {
    try {
      const response = await containerService.shutdownContainer(id, data);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Container shutdown successfully'
        };
      } else {
        return {
          success: false,
          error: response.message || 'Failed to shutdown container'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to shutdown container'
      };
    }
  }

  /**
   * Batch update multiple containers
   */
  async batchUpdateContainers(
    updates: Array<{ id: number; data: UpdateContainerRequest }>
  ): Promise<{
    successes: ContainerDomainModel[];
    failures: Array<{ id: number; error: string }>;
  }> {
    const results = await Promise.allSettled(
      updates.map(async ({ id, data }) => {
        const result = await this.updateContainer(id, data);
        if (result.success && result.container) {
          return { success: true, id, container: result.container };
        } else {
          throw new Error(result.error || 'Update failed');
        }
      })
    );

    const successes: ContainerDomainModel[] = [];
    const failures: Array<{ id: number; error: string }> = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successes.push(result.value.container);
      } else {
        failures.push({
          id: updates[index].id,
          error: result.reason?.message || 'Unknown error'
        });
      }
    });

    return { successes, failures };
  }

  /**
   * Search containers with debounced query
   */
  async searchContainers(
    query: string,
    filters: FiltersDomainModel,
    pagination: PaginationDomainModel
  ): Promise<ContainerListResult> {
    const searchFilters = filters.withSearch(query);
    return this.getContainers(searchFilters, pagination);
  }

  /**
   * Get containers by tenant
   */
  async getContainersByTenant(
    tenantId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ContainerListResult> {
    try {
      const response = await containerService.getContainersByTenant(tenantId, page, limit);
      
      const containers = response.map(container => 
        ContainerDomainModel.fromApiResponse(container)
      );
      
      // Note: This endpoint doesn't return pagination info, so we create a basic one
      const paginationModel = new PaginationDomainModel({
        currentPage: page,
        pageSize: limit,
        totalItems: containers.length,
        totalPages: Math.ceil(containers.length / limit)
      });

      return {
        containers,
        pagination: paginationModel
      };
    } catch (error) {
      return {
        containers: [],
        pagination: PaginationDomainModel.createDefault(),
        error: error instanceof Error ? error.message : 'Failed to fetch containers by tenant'
      };
    }
  }

  /**
   * Get containers with active alerts
   */
  async getContainersWithActiveAlerts(): Promise<ContainerListResult> {
    try {
      const response = await containerService.getContainersWithActiveAlerts();
      
      const containers = response.map(container => 
        ContainerDomainModel.fromApiResponse(container)
      );
      
      const paginationModel = new PaginationDomainModel({
        currentPage: 1,
        pageSize: containers.length,
        totalItems: containers.length,
        totalPages: 1
      });

      return {
        containers,
        pagination: paginationModel
      };
    } catch (error) {
      return {
        containers: [],
        pagination: PaginationDomainModel.createDefault(),
        error: error instanceof Error ? error.message : 'Failed to fetch containers with alerts'
      };
    }
  }

  /**
   * Check if the service is authenticated
   */
  isAuthenticated(): boolean {
    return containerService.isAuthenticated();
  }

  /**
   * Ensure authentication is valid
   */
  async ensureAuthenticated(): Promise<void> {
    await containerService.ensureAuthenticated();
  }

  /**
   * Get container statistics
   */
  async getContainerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byPurpose: Record<string, number>;
    withAlerts: number;
    error?: string;
  }> {
    try {
      const stats = await containerService.getContainerStats();
      return stats;
    } catch (error) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        byType: {},
        byPurpose: {},
        withAlerts: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch container statistics'
      };
    }
  }
}

export const containerApiAdapter = ContainerApiAdapter.getInstance();
