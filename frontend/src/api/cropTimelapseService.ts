import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  CropTimelapse,
  CropSnapshot,
  CropSnapshotCreateRequest,
  CropSnapshotsQueryParams,
  GrowthChartData,
  CropGrowthMetricsQueryParams,
  CropNotesUpdateRequest,
  CropNotesUpdateResponse,
  CropHistoryEntry,
  CropHistoryQueryParams,
  CropHistoryCreateRequest,
  CropDetails,
  CropMeasurements,
  CropMeasurementUpdateRequest
} from '../types/cropTimelapse';

export class CropTimelapseService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  // Get Crop Timelapse Data
  async getCropTimelapse(cropId: number): Promise<CropTimelapse> {
    return this.get<CropTimelapse>(`/crops/${cropId}/timelapse`);
  }

  // Get Crop Snapshots
  async getCropSnapshots(
    cropId: number,
    params?: CropSnapshotsQueryParams
  ): Promise<CropSnapshot[]> {
    const queryString = this.buildQueryString(params || {});
    return this.get<CropSnapshot[]>(`/crops/${cropId}/snapshots${queryString}`);
  }

  // Create Crop Snapshot
  async createCropSnapshot(
    cropId: number,
    snapshotData: CropSnapshotCreateRequest
  ): Promise<CropSnapshot> {
    return this.post<CropSnapshot>(`/crops/${cropId}/snapshots`, snapshotData);
  }

  // Get Crop Growth Chart Data
  async getCropGrowthMetrics(
    cropId: number,
    params?: CropGrowthMetricsQueryParams
  ): Promise<GrowthChartData> {
    const queryString = this.buildQueryString(params || {});
    return this.get<GrowthChartData>(`/crops/${cropId}/growth-metrics${queryString}`);
  }

  // Update Crop Notes
  async updateCropNotes(
    cropId: number,
    notesData: CropNotesUpdateRequest
  ): Promise<CropNotesUpdateResponse> {
    return this.put<CropNotesUpdateResponse>(`/crops/${cropId}/notes`, notesData);
  }

  // Get Crop History
  async getCropHistory(
    cropId: number,
    params?: CropHistoryQueryParams
  ): Promise<CropHistoryEntry[]> {
    const queryString = this.buildQueryString(params || {});
    return this.get<CropHistoryEntry[]>(`/crops/${cropId}/history${queryString}`);
  }

  // Create Crop History Entry
  async createCropHistoryEntry(
    cropId: number,
    historyData: CropHistoryCreateRequest
  ): Promise<CropHistoryEntry> {
    return this.post<CropHistoryEntry>(`/crops/${cropId}/history`, historyData);
  }

  // Get Crop by ID
  async getCropById(cropId: number): Promise<CropDetails> {
    return this.get<CropDetails>(`/crops/${cropId}`);
  }

  // Get Crop Measurements
  async getCropMeasurements(cropId: number): Promise<CropMeasurements> {
    return this.get<CropMeasurements>(`/crops/${cropId}/measurements`);
  }

  // Update Crop Measurements
  async updateCropMeasurements(
    cropId: number,
    measurementsData: CropMeasurementUpdateRequest
  ): Promise<CropMeasurements> {
    return this.put<CropMeasurements>(`/crops/${cropId}/measurements`, measurementsData);
  }

  // Convenience methods for common operations

  // Get snapshots for date range
  async getSnapshotsForDateRange(
    cropId: number,
    startDate: string,
    endDate: string,
    limit?: number
  ): Promise<CropSnapshot[]> {
    return this.getCropSnapshots(cropId, {
      start_date: startDate,
      end_date: endDate,
      limit
    });
  }

  // Get growth metrics for specific metrics
  async getSpecificGrowthMetrics(
    cropId: number,
    metrics: string[],
    dateRange?: {
      start_date?: string;
      end_date?: string;
    }
  ): Promise<GrowthChartData> {
    return this.getCropGrowthMetrics(cropId, {
      metrics,
      ...dateRange
    });
  }

  // Get recent history entries
  async getRecentHistory(
    cropId: number,
    limit: number = 10
  ): Promise<CropHistoryEntry[]> {
    return this.getCropHistory(cropId, { limit });
  }

  // Get history for date range
  async getHistoryForDateRange(
    cropId: number,
    startDate: string,
    endDate: string,
    limit?: number
  ): Promise<CropHistoryEntry[]> {
    return this.getCropHistory(cropId, {
      start_date: startDate,
      end_date: endDate,
      limit
    });
  }

  // Add history entry with standard format
  async addHistoryEntry(
    cropId: number,
    event: string,
    performedBy: string,
    notes?: string
  ): Promise<CropHistoryEntry> {
    return this.createCropHistoryEntry(cropId, {
      event,
      performed_by: performedBy,
      notes
    });
  }

  // Get growth chart data for all metrics
  async getAllGrowthMetrics(
    cropId: number,
    dateRange?: {
      start_date?: string;
      end_date?: string;
    }
  ): Promise<GrowthChartData> {
    return this.getCropGrowthMetrics(cropId, {
      metrics: ['area', 'area_estimated', 'weight', 'accumulated_light_hours', 'accumulated_water_hours'],
      ...dateRange
    });
  }

  // Get environmental metrics for chart
  async getEnvironmentalMetrics(
    cropId: number,
    dateRange?: {
      start_date?: string;
      end_date?: string;
    }
  ): Promise<GrowthChartData> {
    return this.getCropGrowthMetrics(cropId, {
      metrics: ['air_temperature', 'humidity', 'co2', 'water_temperature', 'ph', 'ec'],
      ...dateRange
    });
  }

  // Update individual measurement
  async updateSingleMeasurement(
    cropId: number,
    measurementType: keyof CropMeasurementUpdateRequest,
    value: number
  ): Promise<CropMeasurements> {
    const updateData = { [measurementType]: value };
    return this.updateCropMeasurements(cropId, updateData);
  }

  // Get latest snapshot
  async getLatestSnapshot(cropId: number): Promise<CropSnapshot | null> {
    const snapshots = await this.getCropSnapshots(cropId, { limit: 1 });
    return snapshots.length > 0 ? snapshots[0] : null;
  }

  // Get snapshots for last N days
  async getSnapshotsForLastDays(
    cropId: number,
    days: number
  ): Promise<CropSnapshot[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.getSnapshotsForDateRange(
      cropId,
      startDate.toISOString(),
      endDate.toISOString()
    );
  }

  // Get growth metrics for last N days
  async getGrowthMetricsForLastDays(
    cropId: number,
    days: number
  ): Promise<GrowthChartData> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.getAllGrowthMetrics(cropId, {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });
  }

  // Create snapshot with current timestamp
  async createCurrentSnapshot(
    cropId: number,
    snapshotData: Omit<CropSnapshotCreateRequest, 'timestamp'>
  ): Promise<CropSnapshot> {
    return this.createCropSnapshot(cropId, snapshotData);
  }

  // Update notes with timestamp
  async updateNotesWithTimestamp(
    cropId: number,
    notes: string
  ): Promise<CropNotesUpdateResponse> {
    return this.updateCropNotes(cropId, { notes });
  }

  // Get comprehensive crop data
  async getComprehensiveCropData(cropId: number): Promise<{
    details: CropDetails;
    timelapse: CropTimelapse;
    measurements: CropMeasurements;
    recentHistory: CropHistoryEntry[];
  }> {
    const [details, timelapse, measurements, recentHistory] = await Promise.all([
      this.getCropById(cropId),
      this.getCropTimelapse(cropId),
      this.getCropMeasurements(cropId),
      this.getRecentHistory(cropId, 5)
    ]);

    return {
      details,
      timelapse,
      measurements,
      recentHistory
    };
  }
}

export const cropTimelapseService = new CropTimelapseService();
export default cropTimelapseService;