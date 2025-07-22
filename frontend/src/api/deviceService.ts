import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Device,
  DeviceListFilters
} from '../types/verticalFarm';

class DeviceService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get all devices with optional filtering
   */
  async getDevices(filters?: DeviceListFilters): Promise<Device[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Device[]>(`/devices/${queryString}`);
  }

  /**
   * Get device by ID
   */
  async getDeviceById(id: number): Promise<Device> {
    return this.get<Device>(`/devices/${id}`);
  }

  /**
   * Get devices by container ID
   */
  async getDevicesByContainer(containerId: number): Promise<Device[]> {
    return this.getDevices({ container_id: containerId });
  }

  /**
   * Get devices by status
   */
  async getDevicesByStatus(status: string): Promise<Device[]> {
    return this.getDevices({ status });
  }

  /**
   * Get active devices
   */
  async getActiveDevices(): Promise<Device[]> {
    return this.getDevices({ status: 'active' });
  }
}

export const deviceService = new DeviceService();
export default deviceService;