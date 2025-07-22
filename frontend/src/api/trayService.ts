import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Tray,
  TrayListFilters
} from '../types/verticalFarm';

class TrayService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get all trays with optional filtering
   */
  async getTrays(filters?: TrayListFilters): Promise<Tray[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Tray[]>(`/trays/${queryString}`);
  }

  /**
   * Get tray by ID
   */
  async getTrayById(id: number): Promise<Tray> {
    return this.get<Tray>(`/trays/${id}`);
  }

  /**
   * Get trays by container ID
   */
  async getTraysByContainer(containerId: number): Promise<Tray[]> {
    return this.getTrays({ container_id: containerId });
  }

  /**
   * Get trays by status
   */
  async getTraysByStatus(status: string): Promise<Tray[]> {
    return this.getTrays({ status });
  }

  /**
   * Get available trays
   */
  async getAvailableTrays(): Promise<Tray[]> {
    return this.getTrays({ status: 'available' });
  }
}

export const trayService = new TrayService();
export default trayService;