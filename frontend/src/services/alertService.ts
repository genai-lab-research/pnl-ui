import { apiRequest } from './api';

// Types that match backend schemas
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertRelatedObjectType = 'DEVICE' | 'CROP' | 'TRAY' | 'PANEL' | 'CONTAINER' | 'ENVIRONMENT';

export interface Alert {
  id: string;
  container_id: string;
  description: string;
  created_at: string;
  severity: AlertSeverity;
  active: boolean;
  related_object_type?: AlertRelatedObjectType;
  related_object_id?: string;
}

export interface AlertList {
  total: number;
  results: Alert[];
}

export interface AlertFilterParams {
  skip?: number;
  limit?: number;
  container_id?: string;
  active?: boolean;
  severity?: AlertSeverity;
  related_object_type?: AlertRelatedObjectType;
}

// Service functions to interact with alert endpoints
const alertService = {
  // Get alerts with optional filtering
  getAlerts: async (filterParams: AlertFilterParams = {}): Promise<AlertList> => {
    return apiRequest<AlertList>({
      method: 'GET',
      url: '/alerts/',
      params: filterParams,
    });
  },

  // Get alerts for a specific container
  getContainerAlerts: async (
    containerId: string, 
    active?: boolean,
    limit: number = 100
  ): Promise<AlertList> => {
    return apiRequest<AlertList>({
      method: 'GET',
      url: '/alerts/',
      params: {
        container_id: containerId,
        active,
        limit,
      },
    });
  },

  // Get a specific alert by ID
  getAlertById: async (id: string): Promise<Alert> => {
    return apiRequest<Alert>({
      method: 'GET',
      url: `/alerts/${id}/`,
    });
  },

  // Resolve an alert
  resolveAlert: async (id: string): Promise<Alert> => {
    return apiRequest<Alert>({
      method: 'POST',
      url: `/alerts/${id}/resolve/`,
    });
  },
};

export default alertService;