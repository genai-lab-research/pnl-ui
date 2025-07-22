import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  NurseryStationLayout,
  Tray,
  TraySnapshot,
  TraySnapshotCreateRequest,
  AvailableSlotsResponse,
  TrayLocationUpdateRequest,
  TrayLocationUpdateResponse,
  TrayUpdateRequest,
  NurseryStationSummary
} from '../types/nursery';

export class NurseryService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  // Get Nursery Station Layout
  async getNurseryStationLayout(
    containerId: number,
    date?: string
  ): Promise<NurseryStationLayout> {
    const params = date ? { date } : {};
    const queryString = this.buildQueryString(params);
    return this.get<NurseryStationLayout>(
      `/containers/${containerId}/inventory/nursery-station${queryString}`
    );
  }

  // Get Trays for Container
  async getTraysForContainer(
    containerId: number,
    filters?: {
      status?: string;
      location_type?: string;
    }
  ): Promise<Tray[]> {
    const queryString = this.buildQueryString(filters || {});
    return this.get<Tray[]>(`/containers/${containerId}/trays${queryString}`);
  }

  // Get Tray Snapshots
  async getTraySnapshots(
    containerId: number,
    filters?: {
      start_date?: string;
      end_date?: string;
      tray_id?: number;
    }
  ): Promise<TraySnapshot[]> {
    const queryString = this.buildQueryString(filters || {});
    return this.get<TraySnapshot[]>(
      `/containers/${containerId}/tray-snapshots${queryString}`
    );
  }

  // Create Tray Snapshot
  async createTraySnapshot(
    containerId: number,
    snapshotData: TraySnapshotCreateRequest
  ): Promise<TraySnapshot> {
    return this.post<TraySnapshot>(
      `/containers/${containerId}/tray-snapshots`,
      snapshotData
    );
  }

  // Get Available Tray Slots
  async getAvailableTraySlots(containerId: number): Promise<AvailableSlotsResponse> {
    return this.get<AvailableSlotsResponse>(
      `/containers/${containerId}/nursery-station/available-slots`
    );
  }

  // Update Tray Location
  async updateTrayLocation(
    trayId: number,
    locationData: TrayLocationUpdateRequest
  ): Promise<TrayLocationUpdateResponse> {
    return this.put<TrayLocationUpdateResponse>(
      `/trays/${trayId}/location`,
      locationData
    );
  }

  // Get Tray by ID
  async getTrayById(trayId: number): Promise<Tray> {
    return this.get<Tray>(`/trays/${trayId}`);
  }

  // Update Tray
  async updateTray(trayId: number, trayData: TrayUpdateRequest): Promise<Tray> {
    return this.put<Tray>(`/trays/${trayId}`, trayData);
  }

  // Get Nursery Station Summary
  async getNurseryStationSummary(containerId: number): Promise<NurseryStationSummary> {
    return this.get<NurseryStationSummary>(
      `/containers/${containerId}/nursery-station/summary`
    );
  }

  // Convenience methods for common operations

  // Move tray to specific slot
  async moveTrayToSlot(
    trayId: number,
    shelf: 'upper' | 'lower',
    slotNumber: number,
    movedBy: string
  ): Promise<TrayLocationUpdateResponse> {
    return this.updateTrayLocation(trayId, {
      location: {
        shelf,
        slot_number: slotNumber,
      },
      moved_by: movedBy,
    });
  }

  // Get trays by status
  async getTraysByStatus(
    containerId: number,
    status: string
  ): Promise<Tray[]> {
    return this.getTraysForContainer(containerId, { status });
  }

  // Get trays by location type
  async getTraysByLocationType(
    containerId: number,
    locationType: string
  ): Promise<Tray[]> {
    return this.getTraysForContainer(containerId, { location_type: locationType });
  }

  // Get snapshots for specific tray
  async getSnapshotsForTray(
    containerId: number,
    trayId: number,
    dateRange?: {
      start_date?: string;
      end_date?: string;
    }
  ): Promise<TraySnapshot[]> {
    return this.getTraySnapshots(containerId, {
      tray_id: trayId,
      ...dateRange,
    });
  }

  // Get snapshots for date range
  async getSnapshotsForDateRange(
    containerId: number,
    startDate: string,
    endDate: string
  ): Promise<TraySnapshot[]> {
    return this.getTraySnapshots(containerId, {
      start_date: startDate,
      end_date: endDate,
    });
  }
}

export const nurseryService = new NurseryService();
export default nurseryService;