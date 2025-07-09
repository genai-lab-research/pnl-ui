import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Alert,
  AlertCreateRequest,
  AlertListFilters
} from '../types/verticalFarm';

class AlertService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get all alerts with optional filtering
   */
  async getAlerts(filters?: AlertListFilters): Promise<Alert[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Alert[]>(`/alerts/${queryString}`);
  }

  /**
   * Create a new alert
   */
  async createAlert(data: AlertCreateRequest): Promise<Alert> {
    return this.post<Alert>('/alerts/', data);
  }

  /**
   * Get alert by ID
   */
  async getAlertById(id: number): Promise<Alert> {
    return this.get<Alert>(`/alerts/${id}`);
  }

  /**
   * Get alerts by container ID
   */
  async getAlertsByContainer(containerId: number): Promise<Alert[]> {
    return this.getAlerts({ container_id: containerId });
  }

  /**
   * Get active alerts
   */
  async getActiveAlerts(): Promise<Alert[]> {
    return this.getAlerts({ active: true });
  }

  /**
   * Get alerts by severity
   */
  async getAlertsBySeverity(severity: string): Promise<Alert[]> {
    return this.getAlerts({ severity });
  }
}

export const alertService = new AlertService();
export default alertService;