import { InventoryManagementService } from '../inventoryManagementService';
import { 
  NurseryStation, 
  CultivationArea, 
  Crop,
  Tray,
  CreateTrayRequest,
  InventoryFilterCriteria,
  CropFilterCriteria
} from '../../types/inventory';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('InventoryManagementService', () => {
  let service: InventoryManagementService;
  const containerId = 'test-container-123';

  beforeEach(() => {
    service = new InventoryManagementService('/api');
    mockFetch.mockClear();
  });

  describe('getNurseryStation', () => {
    const mockNurseryStation: NurseryStation = {
      utilization_percentage: 75,
      upper_shelf: [
        {
          id: 'tray-1',
          rfid_tag: 'RFID001',
          utilization_percentage: 80,
          crop_count: 20,
          location: { shelf: 'upper', slot_number: 1 },
          crops: [],
          is_empty: false,
          provisioned_at: '2024-01-01T00:00:00Z'
        }
      ],
      lower_shelf: [],
      off_shelf_trays: []
    };

    it('should fetch nursery station data without query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNurseryStation,
      } as Response);

      const result = await service.getNurseryStation(containerId);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/nursery',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockNurseryStation);
      expect(result.error).toBeUndefined();
    });

    it('should fetch nursery station data with date filter', async () => {
      const criteria: InventoryFilterCriteria = { date: '2024-01-01' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNurseryStation,
      } as Response);

      const result = await service.getNurseryStation(containerId, criteria);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/nursery?date=2024-01-01',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockNurseryStation);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Container not found' }),
      } as Response);

      const result = await service.getNurseryStation(containerId);

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Container not found',
        status_code: 404
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getNurseryStation(containerId);

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Network error',
        status_code: 0
      });
    });
  });

  describe('addTray', () => {
    const trayRequest: CreateTrayRequest = {
      rfid_tag: 'RFID002',
      shelf: 'upper',
      slot_number: 2
    };

    const mockTray: Tray = {
      id: 'tray-2',
      rfid_tag: 'RFID002',
      utilization_percentage: 0,
      crop_count: 0,
      location: { shelf: 'upper', slot_number: 2 },
      crops: [],
      is_empty: true,
      provisioned_at: '2024-01-01T00:00:00Z'
    };

    it('should create a new tray', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTray,
      } as Response);

      const result = await service.addTray(containerId, trayRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/tray',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trayRequest),
        }
      );
      expect(result.data).toEqual(mockTray);
      expect(result.error).toBeUndefined();
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Invalid shelf type' }),
      } as Response);

      const result = await service.addTray(containerId, trayRequest);

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Invalid shelf type',
        status_code: 400
      });
    });
  });

  describe('getCrops', () => {
    const mockCrops: Crop[] = [
      {
        id: 'crop-1',
        seed_type: 'lettuce',
        seed_date: '2024-01-01T00:00:00Z',
        transplanting_date_planned: '2024-01-15T00:00:00Z',
        harvesting_date_planned: '2024-02-15T00:00:00Z',
        age: 10,
        status: 'growing',
        overdue_days: 0,
        location: {
          type: 'tray',
          tray_id: 'tray-1',
          row: 1,
          column: 1,
          channel: 1,
          position: 1
        }
      }
    ];

    it('should fetch crops without filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCrops,
      } as Response);

      const result = await service.getCrops(containerId);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/crops',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockCrops);
    });

    it('should fetch crops with seed type filter', async () => {
      const criteria: CropFilterCriteria = { seed_type: 'lettuce' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCrops,
      } as Response);

      const result = await service.getCrops(containerId, criteria);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/crops?seed_type=lettuce',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockCrops);
    });
  });

  describe('getCultivationArea', () => {
    const mockCultivationArea: CultivationArea = {
      utilization_percentage: 65,
      wall_1: [
        {
          id: 'panel-1',
          rfid_tag: 'PANEL001',
          utilization_percentage: 70,
          crop_count: 15,
          location: { wall: 'wall_1', slot_number: 1 },
          crops: [],
          is_empty: false,
          provisioned_at: '2024-01-01T00:00:00Z'
        }
      ],
      wall_2: [],
      wall_3: [],
      wall_4: [],
      off_wall_panels: []
    };

    it('should fetch cultivation area data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCultivationArea,
      } as Response);

      const result = await service.getCultivationArea(containerId);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/cultivation',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockCultivationArea);
    });

    it('should fetch cultivation area data with date filter', async () => {
      const criteria: InventoryFilterCriteria = { date: '2024-01-01' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCultivationArea,
      } as Response);

      const result = await service.getCultivationArea(containerId, criteria);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/cultivation?date=2024-01-01',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockCultivationArea);
    });
  });

  describe('getCrop', () => {
    const cropId = 'crop-1';
    const mockCrop: Crop = {
      id: 'crop-1',
      seed_type: 'lettuce',
      seed_date: '2024-01-01T00:00:00Z',
      transplanting_date_planned: '2024-01-15T00:00:00Z',
      harvesting_date_planned: '2024-02-15T00:00:00Z',
      transplanted_date: '2024-01-16T00:00:00Z',
      harvesting_date: '2024-02-14T00:00:00Z',
      age: 45,
      status: 'harvested',
      overdue_days: 0,
      location: {
        type: 'panel',
        panel_id: 'panel-1',
        row: 2,
        column: 3,
        channel: 1,
        position: 6
      }
    };

    it('should fetch a specific crop', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCrop,
      } as Response);

      const result = await service.getCrop(containerId, cropId);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/containers/test-container-123/inventory/crop/crop-1',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(result.data).toEqual(mockCrop);
      expect(result.error).toBeUndefined();
    });

    it('should handle crop not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Crop not found' }),
      } as Response);

      const result = await service.getCrop(containerId, cropId);

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Crop not found',
        status_code: 404
      });
    });

    it('should handle network errors when fetching crop', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getCrop(containerId, cropId);

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Network error',
        status_code: 0
      });
    });
  });

  describe('service instantiation', () => {
    it('should use default base URL', () => {
      const defaultService = new InventoryManagementService();
      expect(defaultService['baseUrl']).toBe('/api');
    });

    it('should use custom base URL', () => {
      const customService = new InventoryManagementService('/custom-api');
      expect(customService['baseUrl']).toBe('/custom-api');
    });
  });
});