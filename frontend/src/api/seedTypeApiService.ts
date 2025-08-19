import { BaseApiService } from './baseApiService';
import { SeedType } from '../types/containers';

/**
 * Seed Type API Service for managing seed type variants
 * Provides dedicated endpoints for seed type operations
 */
export class SeedTypeApiService extends BaseApiService {
  private static instance: SeedTypeApiService;

  private constructor() {
    super('/api/v1');
  }

  public static getInstance(): SeedTypeApiService {
    if (!SeedTypeApiService.instance) {
      SeedTypeApiService.instance = new SeedTypeApiService();
    }
    return SeedTypeApiService.instance;
  }

  /**
   * Get all available seed types with variants
   * Used for populating autocomplete dropdowns
   */
  public async getSeedTypes(): Promise<SeedType[]> {
    try {
      console.log('🌱 Fetching seed types from API...');
      // Note: FastAPI redirects /seed-types to /seed-types/ so we use trailing slash
      const seedTypes = await this.get<SeedType[]>('/seed-types/');
      console.log(`✅ Retrieved ${seedTypes.length} seed types:`, seedTypes);
      return seedTypes;
    } catch (error) {
      console.error('❌ Failed to fetch seed types:', error);
      throw new Error('Unable to fetch seed types');
    }
  }

  /**
   * Get a specific seed type by ID
   */
  public async getSeedType(id: number): Promise<SeedType> {
    try {
      return await this.get<SeedType>(`/seed-types/${id}`);
    } catch (error) {
      console.error(`❌ Failed to fetch seed type ${id}:`, error);
      throw new Error(`Unable to fetch seed type ${id}`);
    }
  }

  /**
   * Create a new seed type
   */
  public async createSeedType(seedTypeData: Omit<SeedType, 'id'>): Promise<SeedType> {
    try {
      console.log('🌱 Creating new seed type:', seedTypeData);
      const result = await this.post<SeedType>('/seed-types', seedTypeData);
      console.log('✅ Seed type created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to create seed type:', error);
      throw new Error('Unable to create seed type');
    }
  }

  /**
   * Search seed types by name or variety
   */
  public async searchSeedTypes(query: string): Promise<SeedType[]> {
    try {
      const params = new URLSearchParams({ q: query });
      return await this.get<SeedType[]>(`/seed-types/search?${params}`);
    } catch (error) {
      console.error('❌ Failed to search seed types:', error);
      // Fallback to client-side filtering if search endpoint doesn't exist
      const allSeedTypes = await this.getSeedTypes();
      const lowercaseQuery = query.toLowerCase();
      return allSeedTypes.filter(st => 
        st.name.toLowerCase().includes(lowercaseQuery) ||
        st.variety.toLowerCase().includes(lowercaseQuery) ||
        st.supplier.toLowerCase().includes(lowercaseQuery)
      );
    }
  }

  /**
   * Get seed types grouped by variety for better organization
   */
  public async getSeedTypesByVariety(): Promise<Map<string, SeedType[]>> {
    try {
      const seedTypes = await this.getSeedTypes();
      const groupedByVariety = new Map<string, SeedType[]>();
      
      seedTypes.forEach(st => {
        const variety = st.variety || 'Other';
        if (!groupedByVariety.has(variety)) {
          groupedByVariety.set(variety, []);
        }
        groupedByVariety.get(variety)!.push(st);
      });
      
      return groupedByVariety;
    } catch (error) {
      console.error('❌ Failed to group seed types by variety:', error);
      throw new Error('Unable to group seed types by variety');
    }
  }
}

// Create and export singleton instance
export const seedTypeApiService = SeedTypeApiService.getInstance();