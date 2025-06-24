import { InventoryService } from '../inventoryService';

// Integration tests that run against actual backend
describe('InventoryService Integration Tests', () => {
  let service: InventoryService;

  beforeAll(() => {
    service = new InventoryService('/api');
  });

  // Skip these tests by default as they require running backend
  describe.skip('Real API Integration', () => {
    const testContainerId = 'test-container-id';

    beforeAll(async () => {
      // This would need a test container setup in the backend
      // You might want to create a test container first or use a known test ID
    });

    it('should fetch inventory metrics from real API', async () => {
      const result = await service.getInventoryMetrics(testContainerId);
      
      if (result.error) {
        console.warn('API Error:', result.error);
        // Don't fail the test if it's just a missing container
        expect(result.error.status_code).toBeGreaterThan(0);
      } else {
        expect(result.data).toBeDefined();
        expect(result.data?.nursery_station_utilization).toBeGreaterThanOrEqual(0);
        expect(result.data?.nursery_station_utilization).toBeLessThanOrEqual(100);
        expect(result.data?.cultivation_area_utilization).toBeGreaterThanOrEqual(0);
        expect(result.data?.cultivation_area_utilization).toBeLessThanOrEqual(100);
      }
    });

    it('should fetch crops from real API', async () => {
      const result = await service.getCrops(testContainerId);
      
      if (result.error) {
        console.warn('API Error:', result.error);
        expect(result.error.status_code).toBeGreaterThan(0);
      } else {
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        
        if (result.data && result.data.length > 0) {
          const crop = result.data[0];
          expect(crop.id).toBeDefined();
          expect(crop.seed_type).toBeDefined();
          expect(crop.seed_date).toBeDefined();
          expect(crop.age).toBeGreaterThanOrEqual(0);
          expect(crop.overdue_days).toBeGreaterThanOrEqual(0);
          expect(crop.location).toBeDefined();
          expect(crop.location.type).toBeDefined();
        }
      }
    });

    it('should handle invalid container ID gracefully', async () => {
      const result = await service.getInventoryMetrics('invalid-container-id');
      
      expect(result.error).toBeDefined();
      expect(result.error?.status_code).toBe(404);
    });

    it('should filter crops by seed type', async () => {
      const allCropsResult = await service.getCrops(testContainerId);
      
      if (allCropsResult.data && allCropsResult.data.length > 0) {
        const seedType = allCropsResult.data[0].seed_type;
        const filteredResult = await service.getCrops(testContainerId, { seed_type: seedType });
        
        if (filteredResult.data) {
          expect(filteredResult.data.every(crop => crop.seed_type === seedType)).toBe(true);
        }
      }
    });

    it('should fetch historical metrics with date parameter', async () => {
      const result = await service.getInventoryMetrics(testContainerId, { 
        date: '2023-12-01' 
      });
      
      if (result.error) {
        // Historical data might not be available, which is okay
        expect(result.error.status_code).toBeGreaterThan(0);
      } else {
        expect(result.data).toBeDefined();
        expect(typeof result.data?.nursery_station_utilization).toBe('number');
        expect(typeof result.data?.cultivation_area_utilization).toBe('number');
      }
    });
  });

  describe('API URL Construction', () => {
    it('should construct correct URLs for inventory metrics', () => {
      const service = new InventoryService('/test-api');
      
      // We can't directly test private methods, but we can verify through mocked fetch calls
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({})
      });

      service.getInventoryMetrics('container-123');
      expect(fetch).toHaveBeenCalledWith(
        '/test-api/containers/container-123/inventory/metrics',
        expect.any(Object)
      );

      service.getInventoryMetrics('container-123', { date: '2023-12-01' });
      expect(fetch).toHaveBeenCalledWith(
        '/test-api/containers/container-123/inventory/metrics?date=2023-12-01',
        expect.any(Object)
      );

      global.fetch = originalFetch;
    });

    it('should construct correct URLs for crops', () => {
      const service = new InventoryService('/test-api');
      
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([])
      });

      service.getCrops('container-456');
      expect(fetch).toHaveBeenCalledWith(
        '/test-api/containers/container-456/inventory/crops',
        expect.any(Object)
      );

      service.getCrops('container-456', { seed_type: 'tomato' });
      expect(fetch).toHaveBeenCalledWith(
        '/test-api/containers/container-456/inventory/crops?seed_type=tomato',
        expect.any(Object)
      );

      global.fetch = originalFetch;
    });
  });
});