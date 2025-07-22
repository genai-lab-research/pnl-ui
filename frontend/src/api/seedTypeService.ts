import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  SeedType,
  SeedTypeCreateRequest
} from '../types/verticalFarm';

class SeedTypeService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get all seed types
   */
  async getSeedTypes(): Promise<SeedType[]> {
    return this.get<SeedType[]>('/seed-types/');
  }

  /**
   * Create a new seed type
   */
  async createSeedType(data: SeedTypeCreateRequest): Promise<SeedType> {
    return this.post<SeedType>('/seed-types/', data);
  }

  /**
   * Get seed type by ID
   */
  async getSeedTypeById(id: number): Promise<SeedType> {
    return this.get<SeedType>(`/seed-types/${id}`);
  }
}

export const seedTypeService = new SeedTypeService();
export default seedTypeService;