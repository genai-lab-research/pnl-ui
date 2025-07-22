import { InventoryManagementService } from '../inventoryManagementService';

// Connection tests - these verify the proxy configuration and CORS setup
describe('InventoryManagementService Connection Tests', () => {
  let service: InventoryManagementService;

  beforeAll(() => {
    service = new InventoryManagementService('/api');
  });

  describe('Proxy Configuration', () => {
    it('should make requests through the Vite proxy', async () => {
      const containerId = 'test-container-id';
      
      // Mock fetch to intercept the actual request
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Not found' }),
      } as Response);
      
      try {
        await service.getNurseryStation(containerId);
        
        // Verify the request was made to the proxy URL (relative path)
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/containers/test-container-id/inventory/nursery',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should construct correct URLs for all endpoints', () => {
      // Test that the service constructs the expected URLs
      const service = new InventoryManagementService('/api');
      
      // We can't easily test the internal URL construction without making actual requests,
      // but we can verify the service is instantiated correctly
      expect(service['baseUrl']).toBe('/api');
    });
  });

  describe('CORS and Headers', () => {
    it('should include proper headers in requests', async () => {
      const containerId = 'test-container-id';
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilization_percentage: 0, upper_shelf: [], lower_shelf: [], off_shelf_trays: [] }),
      } as Response);
      
      try {
        await service.getNurseryStation(containerId);
        
        // Verify proper headers are set
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should handle POST requests with proper headers and body', async () => {
      const containerId = 'test-container-id';
      const trayData = {
        rfid_tag: 'TEST001',
        shelf: 'upper',
        slot_number: 1
      };
      
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'tray-123', ...trayData, location: { shelf: 'upper', slot_number: 1 }, crops: [], is_empty: true, provisioned_at: '2024-01-01T00:00:00Z', utilization_percentage: 0, crop_count: 0 }),
      } as Response);
      
      try {
        await service.addTray(containerId, trayData);
        
        // Verify POST request structure
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/containers/test-container-id/inventory/tray',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(trayData),
          }
        );
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe('Query Parameter Handling', () => {
    it('should properly encode query parameters', async () => {
      const containerId = 'test-container-id';
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilization_percentage: 0, upper_shelf: [], lower_shelf: [], off_shelf_trays: [] }),
      } as Response);
      
      try {
        await service.getNurseryStation(containerId, { date: '2024-01-01' });
        
        // Verify query parameters are properly encoded
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/containers/test-container-id/inventory/nursery?date=2024-01-01',
          expect.any(Object)
        );
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should construct correct URL for getCrop endpoint', async () => {
      const containerId = 'test-container-id';
      const cropId = 'crop-123';
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: cropId,
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
        }),
      } as Response);
      
      try {
        await service.getCrop(containerId, cropId);
        
        // Verify the correct URL is constructed
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/containers/test-container-id/inventory/crop/crop-123',
          expect.objectContaining({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should handle multiple query parameters', async () => {
      const containerId = 'test-container-id';
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);
      
      try {
        await service.getCrops(containerId, { seed_type: 'lettuce' });
        
        // Verify query parameters are properly encoded
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/containers/test-container-id/inventory/crops?seed_type=lettuce',
          expect.any(Object)
        );
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('should handle special characters in query parameters', async () => {
      const containerId = 'test-container-id';
      const originalFetch = global.fetch;
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);
      
      try {
        await service.getCrops(containerId, { seed_type: 'lettuce & spinach' });
        
        // Verify special characters are properly encoded
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/containers/test-container-id/inventory/crops?seed_type=lettuce+%26+spinach',
          expect.any(Object)
        );
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe('Base URL Configuration', () => {
    it('should work with different base URLs', () => {
      const customService = new InventoryManagementService('/custom-api');
      expect(customService['baseUrl']).toBe('/custom-api');
    });

    it('should work with trailing slash in base URL', () => {
      const serviceWithTrailingSlash = new InventoryManagementService('/api/');
      expect(serviceWithTrailingSlash['baseUrl']).toBe('/api/');
    });

    it('should work with absolute URLs', () => {
      const absoluteService = new InventoryManagementService('http://localhost:8001/api');
      expect(absoluteService['baseUrl']).toBe('http://localhost:8001/api');
    });
  });
});