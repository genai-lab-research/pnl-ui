/**
 * Alert Service
 * Handles all alert-related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { Alert } from '../types/containers';
import { ApiError } from './index';

export interface CreateAlertRequest {
  container_id: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  related_object: Record<string, any>;
}

export interface UpdateAlertRequest {
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  active?: boolean;
  related_object?: Record<string, any>;
}

export interface AlertFilterCriteria {
  container_id?: number;
  active?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical' | string[];
  created_after?: string;
  created_before?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface AlertListResponse {
  alerts: Alert[];
  total: number;
  skip: number;
  limit: number;
  active_count: number;
  critical_count: number;
}

export interface AlertSummary {
  total_alerts: number;
  active_alerts: number;
  by_severity: Record<string, number>;
  by_container: Array<{
    container_id: number;
    container_name?: string;
    alert_count: number;
    critical_count: number;
  }>;
  recent_alerts: Alert[];
}

export class AlertService extends BaseApiService {
  private static instance: AlertService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService(baseURL);
    }
    return AlertService.instance;
  }

  /**
   * Get all alerts with optional filtering
   */
  public async getAllAlerts(filters?: AlertFilterCriteria): Promise<AlertListResponse> {
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

      const url = `/alerts/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<AlertListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch alerts');
    }
  }

  /**
   * Create a new alert
   */
  public async createAlert(alertData: CreateAlertRequest): Promise<Alert> {
    try {
      const response = await this.makeAuthenticatedRequest<Alert>('/alerts/', {
        method: 'POST',
        body: JSON.stringify(alertData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create alert');
    }
  }

  /**
   * Get alert by ID
   */
  public async getAlertById(id: number): Promise<Alert> {
    try {
      const response = await this.makeAuthenticatedRequest<Alert>(`/alerts/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch alert with ID ${id}`);
    }
  }

  /**
   * Update alert
   */
  public async updateAlert(id: number, alertData: UpdateAlertRequest): Promise<Alert> {
    try {
      const response = await this.makeAuthenticatedRequest<Alert>(`/alerts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(alertData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update alert with ID ${id}`);
    }
  }

  /**
   * Delete alert
   */
  public async deleteAlert(id: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/alerts/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete alert with ID ${id}`);
    }
  }

  /**
   * Mark alert as resolved
   */
  public async resolveAlert(id: number): Promise<Alert> {
    try {
      const response = await this.makeAuthenticatedRequest<Alert>(`/alerts/${id}/resolve`, {
        method: 'POST',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to resolve alert with ID ${id}`);
    }
  }

  /**
   * Mark alert as active
   */
  public async activateAlert(id: number): Promise<Alert> {
    try {
      const response = await this.makeAuthenticatedRequest<Alert>(`/alerts/${id}/activate`, {
        method: 'POST',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to activate alert with ID ${id}`);
    }
  }

  /**
   * Get alerts for a specific container
   */
  public async getAlertsForContainer(containerId: number, activeOnly?: boolean): Promise<Alert[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('container_id', containerId.toString());
      
      if (activeOnly !== undefined) {
        queryParams.append('active', activeOnly.toString());
      }

      const response = await this.makeAuthenticatedRequest<AlertListResponse>(`/alerts/?${queryParams.toString()}`, {
        method: 'GET',
      });

      return response.alerts;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch alerts for container ${containerId}`);
    }
  }

  /**
   * Get alert summary statistics
   */
  public async getAlertSummary(containerId?: number): Promise<AlertSummary> {
    try {
      const queryParams = new URLSearchParams();
      if (containerId) {
        queryParams.append('container_id', containerId.toString());
      }

      const url = `/alerts/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<AlertSummary>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch alert summary');
    }
  }

  /**
   * Bulk resolve alerts
   */
  public async bulkResolveAlerts(alertIds: number[]): Promise<{ resolved_count: number; failed_ids: number[] }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ resolved_count: number; failed_ids: number[] }>('/alerts/bulk-resolve', {
        method: 'POST',
        body: JSON.stringify({ alert_ids: alertIds }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to bulk resolve alerts');
    }
  }
}

// Create and export singleton instance
export const alertService = AlertService.getInstance();

// Export utility functions for easier usage
export const getAllAlerts = (filters?: AlertFilterCriteria): Promise<AlertListResponse> => 
  alertService.getAllAlerts(filters);

export const createNewAlert = (alertData: CreateAlertRequest): Promise<Alert> => 
  alertService.createAlert(alertData);

export const getAlertById = (id: number): Promise<Alert> => 
  alertService.getAlertById(id);

export const updateExistingAlert = (id: number, alertData: UpdateAlertRequest): Promise<Alert> => 
  alertService.updateAlert(id, alertData);

export const deleteAlertById = (id: number): Promise<{ message: string }> => 
  alertService.deleteAlert(id);

export const resolveAlertById = (id: number): Promise<Alert> => 
  alertService.resolveAlert(id);

export const activateAlertById = (id: number): Promise<Alert> => 
  alertService.activateAlert(id);

export const getAlertsForContainer = (containerId: number, activeOnly?: boolean): Promise<Alert[]> => 
  alertService.getAlertsForContainer(containerId, activeOnly);

export const getAlertSummary = (containerId?: number): Promise<AlertSummary> => 
  alertService.getAlertSummary(containerId);

export const bulkResolveAlerts = (alertIds: number[]): Promise<{ resolved_count: number; failed_ids: number[] }> => 
  alertService.bulkResolveAlerts(alertIds);
