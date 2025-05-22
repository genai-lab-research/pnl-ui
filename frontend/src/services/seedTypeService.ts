import { apiRequest } from './api';

// Types that match backend schemas
export interface SeedType {
  id: string;
  name: string;
  variety: string;
  supplier: string;
}

// Service functions to interact with seed type endpoints
const seedTypeService = {
  // Get all seed types
  getSeedTypes: async (): Promise<SeedType[]> => {
    return apiRequest<SeedType[]>({
      method: 'GET',
      url: '/seed-types',
    });
  },

  // Get a specific seed type by ID
  getSeedTypeById: async (id: string): Promise<SeedType> => {
    return apiRequest<SeedType>({
      method: 'GET',
      url: `/seed-types/${id}`,
    });
  },
};

export default seedTypeService;