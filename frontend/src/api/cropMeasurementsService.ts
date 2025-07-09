import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  CropMeasurements,
  CropMeasurementsCreateRequest
} from '../types/recipe';

export class CropMeasurementsService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  // Crop Measurements Management
  async createCropMeasurements(measurementsData: CropMeasurementsCreateRequest): Promise<CropMeasurements> {
    return this.post<CropMeasurements>('/crop-measurements/', measurementsData);
  }

  async getCropMeasurementsById(id: number): Promise<CropMeasurements> {
    return this.get<CropMeasurements>(`/crop-measurements/${id}`);
  }

  async updateCropMeasurements(
    id: number, 
    measurementsData: CropMeasurementsCreateRequest
  ): Promise<CropMeasurements> {
    return this.put<CropMeasurements>(`/crop-measurements/${id}`, measurementsData);
  }

  // Convenience methods for specific measurement operations
  async recordPhysicalMeasurements(
    radius?: number,
    width?: number,
    height?: number,
    weight?: number
  ): Promise<CropMeasurements> {
    return this.createCropMeasurements({
      radius,
      width,
      height,
      weight
    });
  }

  async recordAreaMeasurements(
    area: number,
    areaEstimated?: number
  ): Promise<CropMeasurements> {
    return this.createCropMeasurements({
      area,
      area_estimated: areaEstimated
    });
  }

  async updateWeight(id: number, weight: number): Promise<CropMeasurements> {
    const existing = await this.getCropMeasurementsById(id);
    return this.updateCropMeasurements(id, {
      ...existing,
      weight
    });
  }

  async updateDimensions(
    id: number,
    dimensions: {
      radius?: number;
      width?: number;
      height?: number;
    }
  ): Promise<CropMeasurements> {
    const existing = await this.getCropMeasurementsById(id);
    return this.updateCropMeasurements(id, {
      ...existing,
      ...dimensions
    });
  }
}

export const cropMeasurementsService = new CropMeasurementsService();
export default cropMeasurementsService;