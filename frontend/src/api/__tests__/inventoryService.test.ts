import { InventoryService } from '../inventoryService';
import { InventoryMetrics, Crop } from '../../shared/types/metrics';

// Mock fetch globally
global.fetch = jest.fn();

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService('/api');
    jest.clearAllMocks();
  });

  describe('getInventoryMetrics', () => {
    const mockMetrics: InventoryMetrics = {
      nursery_station_utilization: 75,
      cultivation_area_utilization: 60
    };

    it('should fetch inventory metrics successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMetrics)
      });

      const result = await service.getInventoryMetrics('container-123');

      expect(fetch).toHaveBeenCalledWith('/api/containers/container-123/inventory/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockMetrics);
      expect(result.error).toBeUndefined();
    });

    it('should fetch inventory metrics with date parameter', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMetrics)
      });

      const result = await service.getInventoryMetrics('container-123', { date: '2023-12-01' });

      expect(fetch).toHaveBeenCalledWith('/api/containers/container-123/inventory/metrics?date=2023-12-01', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockMetrics);
    });

    it('should handle API error response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValueOnce({ detail: 'Container not found' })
      });

      const result = await service.getInventoryMetrics('invalid-id');

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Container not found',
        status_code: 404
      });
    });

    it('should handle network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getInventoryMetrics('container-123');

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Network error',
        status_code: 0
      });
    });

    it('should handle invalid JSON response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      });

      const result = await service.getInventoryMetrics('container-123');

      expect(result.error).toEqual({
        detail: 'Unknown error',
        status_code: 500
      });
    });
  });

  describe('getCrops', () => {
    const mockCrops: Crop[] = [
      {
        id: 'crop-1',
        seed_type: 'tomato',
        seed_date: '2023-11-01T00:00:00Z',
        transplanting_date_planned: '2023-11-15T00:00:00Z',
        harvesting_date_planned: '2023-12-15T00:00:00Z',
        age: 30,
        status: 'growing',
        overdue_days: 0,
        location: {
          type: 'tray',
          tray_id: 'tray-1',
          row: 1,
          column: 2
        }
      },
      {
        id: 'crop-2',
        seed_type: 'lettuce',
        seed_date: '2023-11-05T00:00:00Z',
        age: 25,
        status: 'ready',
        overdue_days: 2,
        location: {
          type: 'panel',
          panel_id: 'panel-a',
          position: 5
        }
      }
    ];

    it('should fetch crops successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCrops)
      });

      const result = await service.getCrops('container-123');

      expect(fetch).toHaveBeenCalledWith('/api/containers/container-123/inventory/crops', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(mockCrops);
      expect(result.error).toBeUndefined();
    });

    it('should fetch crops with seed_type filter', async () => {
      const filteredCrops = [mockCrops[0]];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(filteredCrops)
      });

      const result = await service.getCrops('container-123', { seed_type: 'tomato' });

      expect(fetch).toHaveBeenCalledWith('/api/containers/container-123/inventory/crops?seed_type=tomato', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result.data).toEqual(filteredCrops);
    });

    it('should handle empty crops response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([])
      });

      const result = await service.getCrops('container-123');

      expect(result.data).toEqual([]);
      expect(result.error).toBeUndefined();
    });

    it('should handle API error response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: jest.fn().mockResolvedValueOnce({ detail: 'Access denied' })
      });

      const result = await service.getCrops('container-123');

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Access denied',
        status_code: 403
      });
    });

    it('should handle network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Connection timeout'));

      const result = await service.getCrops('container-123');

      expect(result.data).toBeUndefined();
      expect(result.error).toEqual({
        detail: 'Connection timeout',
        status_code: 0
      });
    });
  });

  describe('service instance configuration', () => {
    it('should use custom base URL', () => {
      const customService = new InventoryService('/custom-api');
      expect(customService['baseUrl']).toBe('/custom-api');
    });

    it('should use default base URL', () => {
      const defaultService = new InventoryService();
      expect(defaultService['baseUrl']).toBe('/api');
    });
  });
});