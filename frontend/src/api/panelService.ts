import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Panel,
  PanelListFilters
} from '../types/verticalFarm';

class PanelService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get all panels with optional filtering
   */
  async getPanels(filters?: PanelListFilters): Promise<Panel[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Panel[]>(`/panels/${queryString}`);
  }

  /**
   * Get panel by ID
   */
  async getPanelById(id: number): Promise<Panel> {
    return this.get<Panel>(`/panels/${id}`);
  }

  /**
   * Get panels by container ID
   */
  async getPanelsByContainer(containerId: number): Promise<Panel[]> {
    return this.getPanels({ container_id: containerId });
  }

  /**
   * Get panels by status
   */
  async getPanelsByStatus(status: string): Promise<Panel[]> {
    return this.getPanels({ status });
  }

  /**
   * Get active panels
   */
  async getActivePanels(): Promise<Panel[]> {
    return this.getPanels({ status: 'active' });
  }
}

export const panelService = new PanelService();
export default panelService;