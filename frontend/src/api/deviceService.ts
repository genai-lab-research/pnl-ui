/**
 * Device Service
 * Handles all device-related API operations
 * Based on p2_routing.md specifications
 */

import { BaseApiService } from './baseApiService';
import { Device } from '../types/containers';
import { ApiError } from './index';

export interface CreateDeviceRequest {
  container_id: number;
  name: string;
  model: string;
  serial_number: string;
  firmware_version: string;
  port: string;
  status: string;
}

export interface UpdateDeviceRequest {
  name?: string;
  model?: string;
  serial_number?: string;
  firmware_version?: string;
  port?: string;
  status?: string;
}

export interface DeviceFilterCriteria {
  container_id?: number;
  status?: string | string[];
  model?: string;
  name?: string;
  active_since?: string;
  skip?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
  skip: number;
  limit: number;
  online_count: number;
  offline_count: number;
}

export interface DeviceStatus {
  device_id: number;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  last_heartbeat: string;
  uptime_seconds: number;
  firmware_version: string;
  battery_level?: number;
  temperature?: number;
  connectivity: {
    signal_strength?: number;
    connection_type: 'wifi' | 'ethernet' | 'cellular' | 'bluetooth';
    ip_address?: string;
  };
  diagnostics: {
    cpu_usage_percent?: number;
    memory_usage_percent?: number;
    disk_usage_percent?: number;
    error_count: number;
    last_error?: string;
  };
}

export interface DeviceCalibrationRequest {
  device_id: number;
  calibration_type: 'temperature' | 'humidity' | 'ph' | 'light' | 'full';
  reference_values?: Record<string, number>;
  notes?: string;
}

export interface DeviceCalibrationResponse {
  calibration_id: string;
  device_id: number;
  calibration_type: string;
  status: 'in_progress' | 'completed' | 'failed';
  results?: Record<string, any>;
  completed_at?: string;
  notes?: string;
}

export class DeviceService extends BaseApiService {
  private static instance: DeviceService;

  private constructor(baseURL: string = '/api/v1') {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService(baseURL);
    }
    return DeviceService.instance;
  }

  /**
   * Get all devices with optional filtering
   */
  public async getAllDevices(filters?: DeviceFilterCriteria): Promise<DeviceListResponse> {
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

      const url = `/devices/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<DeviceListResponse>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch devices');
    }
  }

  /**
   * Create a new device
   */
  public async createDevice(deviceData: CreateDeviceRequest): Promise<Device> {
    try {
      const response = await this.makeAuthenticatedRequest<Device>('/devices/', {
        method: 'POST',
        body: JSON.stringify(deviceData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create device');
    }
  }

  /**
   * Get device by ID
   */
  public async getDeviceById(id: number): Promise<Device> {
    try {
      const response = await this.makeAuthenticatedRequest<Device>(`/devices/${id}`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch device with ID ${id}`);
    }
  }

  /**
   * Update device
   */
  public async updateDevice(id: number, deviceData: UpdateDeviceRequest): Promise<Device> {
    try {
      const response = await this.makeAuthenticatedRequest<Device>(`/devices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(deviceData),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update device with ID ${id}`);
    }
  }

  /**
   * Delete device
   */
  public async deleteDevice(id: number): Promise<{ message: string }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string }>(`/devices/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete device with ID ${id}`);
    }
  }

  /**
   * Get devices for a specific container
   */
  public async getDevicesForContainer(containerId: number): Promise<Device[]> {
    try {
      const response = await this.makeAuthenticatedRequest<DeviceListResponse>(`/devices/?container_id=${containerId}`, {
        method: 'GET',
      });

      return response.devices;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch devices for container ${containerId}`);
    }
  }

  /**
   * Get device status and diagnostics
   */
  public async getDeviceStatus(id: number): Promise<DeviceStatus> {
    try {
      const response = await this.makeAuthenticatedRequest<DeviceStatus>(`/devices/${id}/status`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch device status for ID ${id}`);
    }
  }

  /**
   * Restart device
   */
  public async restartDevice(id: number): Promise<{ message: string; restart_initiated: boolean }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string; restart_initiated: boolean }>(`/devices/${id}/restart`, {
        method: 'POST',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to restart device with ID ${id}`);
    }
  }

  /**
   * Calibrate device
   */
  public async calibrateDevice(calibrationRequest: DeviceCalibrationRequest): Promise<DeviceCalibrationResponse> {
    try {
      const { device_id, ...requestBody } = calibrationRequest;
      const response = await this.makeAuthenticatedRequest<DeviceCalibrationResponse>(`/devices/${device_id}/calibrate`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to calibrate device`);
    }
  }

  /**
   * Get device calibration history
   */
  public async getDeviceCalibrationHistory(id: number): Promise<DeviceCalibrationResponse[]> {
    try {
      const response = await this.makeAuthenticatedRequest<DeviceCalibrationResponse[]>(`/devices/${id}/calibrations`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch calibration history for device ${id}`);
    }
  }

  /**
   * Update device firmware
   */
  public async updateDeviceFirmware(id: number, firmwareVersion: string): Promise<{ message: string; update_initiated: boolean }> {
    try {
      const response = await this.makeAuthenticatedRequest<{ message: string; update_initiated: boolean }>(`/devices/${id}/firmware`, {
        method: 'POST',
        body: JSON.stringify({ firmware_version: firmwareVersion }),
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to update firmware for device ${id}`);
    }
  }

  /**
   * Get device logs
   */
  public async getDeviceLogs(
    id: number, 
    startDate?: string, 
    endDate?: string, 
    logLevel?: 'debug' | 'info' | 'warning' | 'error'
  ): Promise<Array<{ timestamp: string; level: string; message: string }>> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);
      if (logLevel) queryParams.append('log_level', logLevel);

      const url = `/devices/${id}/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.makeAuthenticatedRequest<Array<{ timestamp: string; level: string; message: string }>>(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch logs for device ${id}`);
    }
  }
}

// Create and export singleton instance
export const deviceService = DeviceService.getInstance();

// Export utility functions for easier usage
export const getAllDevices = (filters?: DeviceFilterCriteria): Promise<DeviceListResponse> => 
  deviceService.getAllDevices(filters);

export const createNewDevice = (deviceData: CreateDeviceRequest): Promise<Device> => 
  deviceService.createDevice(deviceData);

export const getDeviceById = (id: number): Promise<Device> => 
  deviceService.getDeviceById(id);

export const updateExistingDevice = (id: number, deviceData: UpdateDeviceRequest): Promise<Device> => 
  deviceService.updateDevice(id, deviceData);

export const deleteDeviceById = (id: number): Promise<{ message: string }> => 
  deviceService.deleteDevice(id);

export const getDevicesForContainer = (containerId: number): Promise<Device[]> => 
  deviceService.getDevicesForContainer(containerId);

export const getDeviceStatus = (id: number): Promise<DeviceStatus> => 
  deviceService.getDeviceStatus(id);

export const restartDevice = (id: number): Promise<{ message: string; restart_initiated: boolean }> => 
  deviceService.restartDevice(id);

export const calibrateDevice = (calibrationRequest: DeviceCalibrationRequest): Promise<DeviceCalibrationResponse> => 
  deviceService.calibrateDevice(calibrationRequest);

export const getDeviceCalibrationHistory = (id: number): Promise<DeviceCalibrationResponse[]> => 
  deviceService.getDeviceCalibrationHistory(id);

export const updateDeviceFirmware = (id: number, firmwareVersion: string): Promise<{ message: string; update_initiated: boolean }> => 
  deviceService.updateDeviceFirmware(id, firmwareVersion);

export const getDeviceLogs = (
  id: number, 
  startDate?: string, 
  endDate?: string, 
  logLevel?: 'debug' | 'info' | 'warning' | 'error'
): Promise<Array<{ timestamp: string; level: string; message: string }>> => 
  deviceService.getDeviceLogs(id, startDate, endDate, logLevel);
