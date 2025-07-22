import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Crop,
  CropCreateRequest,
  CropFilterCriteria,
  CropHistory,
  CropHistoryCreateRequest,
  CropSnapshot,
  CropSnapshotCreateRequest,
  CropSnapshotFilterCriteria,
  RecipeDeleteResponse
} from '../types/recipe';
// Keep compatibility with existing types
import {
  Crop as ExistingCrop,
  CropListFilters
} from '../types/verticalFarm';

export class CropService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  // New comprehensive API methods based on specifications
  async getAllCrops(filters?: CropFilterCriteria): Promise<Crop[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<Crop[]>(`/crops/${queryString}`);
  }

  async getCropById(id: number): Promise<Crop> {
    return this.get<Crop>(`/crops/${id}`);
  }

  async createCrop(cropData: CropCreateRequest): Promise<Crop> {
    return this.post<Crop>('/crops/', cropData);
  }

  async updateCrop(id: number, cropData: CropCreateRequest): Promise<Crop> {
    return this.put<Crop>(`/crops/${id}`, cropData);
  }

  async deleteCrop(id: number): Promise<RecipeDeleteResponse> {
    return this.delete<RecipeDeleteResponse>(`/crops/${id}`);
  }

  // Crop History Management
  async getCropHistory(cropId: number): Promise<CropHistory[]> {
    return this.get<CropHistory[]>(`/crops/${cropId}/history`);
  }

  async addCropHistoryEvent(
    cropId: number, 
    eventData: CropHistoryCreateRequest
  ): Promise<CropHistory> {
    return this.post<CropHistory>(`/crops/${cropId}/history`, eventData);
  }

  // Crop Snapshots Management
  async getCropSnapshots(
    cropId: number, 
    filters?: CropSnapshotFilterCriteria
  ): Promise<CropSnapshot[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<CropSnapshot[]>(`/crops/${cropId}/snapshots${queryString}`);
  }

  async createCropSnapshot(
    cropId: number, 
    snapshotData: CropSnapshotCreateRequest
  ): Promise<CropSnapshot> {
    return this.post<CropSnapshot>(`/crops/${cropId}/snapshots`, snapshotData);
  }

  // Backward compatibility methods (existing API)
  async getCrops(filters?: CropListFilters): Promise<ExistingCrop[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<ExistingCrop[]>(`/crops/${queryString}`);
  }

  async getCropsBySeedType(seedTypeId: number): Promise<ExistingCrop[]> {
    return this.getCrops({ seed_type_id: seedTypeId });
  }

  async getCropsByLifecycleStatus(lifecycleStatus: string): Promise<ExistingCrop[]> {
    return this.getCrops({ lifecycle_status: lifecycleStatus });
  }

  async getCropsReadyForHarvest(): Promise<ExistingCrop[]> {
    return this.getCrops({ lifecycle_status: 'ready_for_harvest' });
  }

  async getCropsInSeeding(): Promise<ExistingCrop[]> {
    return this.getCrops({ lifecycle_status: 'seeding' });
  }

  async getCropsInGrowing(): Promise<ExistingCrop[]> {
    return this.getCrops({ lifecycle_status: 'growing' });
  }

  // New convenience methods
  async searchCrops(searchTerm: string): Promise<Crop[]> {
    return this.getAllCrops({ search: searchTerm });
  }

  async getCropsByRecipeVersion(recipeVersionId: number): Promise<Crop[]> {
    return this.getAllCrops({ recipe_version_id: recipeVersionId });
  }

  async getPaginatedCrops(
    page: number = 1, 
    limit: number = 10, 
    filters?: Partial<CropFilterCriteria>
  ): Promise<Crop[]> {
    return this.getAllCrops({ page, limit, ...filters });
  }

  async getCropSnapshotsInDateRange(
    cropId: number,
    startDate: string,
    endDate: string
  ): Promise<CropSnapshot[]> {
    return this.getCropSnapshots(cropId, {
      start_date: startDate,
      end_date: endDate
    });
  }

  // Lifecycle management convenience methods
  async transplantCrop(
    cropId: number, 
    transplantingDate: string, 
    performedBy: string, 
    notes?: string
  ): Promise<CropHistory> {
    // Update the crop
    const crop = await this.getCropById(cropId);
    await this.updateCrop(cropId, {
      seed_type_id: crop.seed_type_id,
      seed_date: crop.seed_date,
      transplanting_date_planned: crop.transplanting_date_planned,
      harvesting_date_planned: crop.harvesting_date_planned,
      lifecycle_status: 'transplanted',
      health_check: crop.health_check,
      current_location: crop.current_location,
      recipe_version_id: crop.recipe_version_id,
      notes: crop.notes
    });

    // Add history event
    return this.addCropHistoryEvent(cropId, {
      event: 'transplanted',
      performed_by: performedBy,
      notes: notes || `Crop transplanted on ${transplantingDate}`
    });
  }

  async harvestCrop(
    cropId: number, 
    harvestingDate: string, 
    performedBy: string, 
    notes?: string
  ): Promise<CropHistory> {
    // Update the crop
    const crop = await this.getCropById(cropId);
    await this.updateCrop(cropId, {
      seed_type_id: crop.seed_type_id,
      seed_date: crop.seed_date,
      transplanting_date_planned: crop.transplanting_date_planned,
      harvesting_date_planned: crop.harvesting_date_planned,
      lifecycle_status: 'harvested',
      health_check: crop.health_check,
      current_location: crop.current_location,
      recipe_version_id: crop.recipe_version_id,
      notes: crop.notes
    });

    // Add history event
    return this.addCropHistoryEvent(cropId, {
      event: 'harvested',
      performed_by: performedBy,
      notes: notes || `Crop harvested on ${harvestingDate}`
    });
  }

  async updateCropHealth(
    cropId: number, 
    healthStatus: string, 
    performedBy: string, 
    notes?: string
  ): Promise<CropHistory> {
    // Update the crop
    const crop = await this.getCropById(cropId);
    await this.updateCrop(cropId, {
      seed_type_id: crop.seed_type_id,
      seed_date: crop.seed_date,
      transplanting_date_planned: crop.transplanting_date_planned,
      harvesting_date_planned: crop.harvesting_date_planned,
      lifecycle_status: crop.lifecycle_status,
      health_check: healthStatus,
      current_location: crop.current_location,
      recipe_version_id: crop.recipe_version_id,
      notes: crop.notes
    });

    // Add history event
    return this.addCropHistoryEvent(cropId, {
      event: 'health_check_updated',
      performed_by: performedBy,
      notes: notes || `Health status updated to: ${healthStatus}`
    });
  }
}

export const cropService = new CropService();
export default cropService;