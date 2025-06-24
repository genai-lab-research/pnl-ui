import { InventoryManagementService } from '../inventoryManagementService';
import { CreateTrayRequest } from '../../types/inventory';

// Integration tests - these test against the actual backend
describe('InventoryManagementService Integration Tests', () => {
  let service: InventoryManagementService;
  const containerId = '123e4567-e89b-12d3-a456-426614174000'; // Use a UUID format that the backend expects

  beforeAll(() => {
    // For integration tests, connect directly to the backend since Jest doesn't use Vite proxy
    service = new InventoryManagementService('http://localhost:8001/api');
  });

  describe('API Connectivity', () => {
    it('should be able to reach the backend API', async () => {
      // Test basic connectivity by trying to fetch nursery station data
      const result = await service.getNurseryStation(containerId);
      
      // We expect either success or a structured error response (not a network error)
      if (result.error) {
        // Should be a proper API error response, not a network error
        expect(result.error.status_code).toBeGreaterThan(0);
        expect(typeof result.error.detail).toBe('string');
      } else {
        // If successful, should have the expected structure
        expect(result.data).toBeDefined();
        expect(typeof result.data!.utilization_percentage).toBe('number');
        expect(Array.isArray(result.data!.upper_shelf)).toBe(true);
        expect(Array.isArray(result.data!.lower_shelf)).toBe(true);
        expect(Array.isArray(result.data!.off_shelf_trays)).toBe(true);
      }
    }, 10000); // 10 second timeout for integration tests

    it('should handle non-existent container gracefully', async () => {
      const nonExistentId = 'non-existent-container-id';
      const result = await service.getNurseryStation(nonExistentId);
      
      // Should return a proper error response
      expect(result.error).toBeDefined();
      expect(result.error!.status_code).toBeGreaterThan(0);
      expect(result.data).toBeUndefined();
    }, 10000);
  });

  describe('Nursery Station Endpoint', () => {
    it('should fetch nursery station data with proper response format', async () => {
      const result = await service.getNurseryStation(containerId);
      
      if (result.data) {
        // Verify response structure matches our TypeScript interface
        expect(typeof result.data.utilization_percentage).toBe('number');
        expect(result.data.utilization_percentage).toBeGreaterThanOrEqual(0);
        expect(result.data.utilization_percentage).toBeLessThanOrEqual(100);
        
        expect(Array.isArray(result.data.upper_shelf)).toBe(true);
        expect(Array.isArray(result.data.lower_shelf)).toBe(true);
        expect(Array.isArray(result.data.off_shelf_trays)).toBe(true);
        
        // If there are trays, verify their structure
        const allTrays = [
          ...result.data.upper_shelf,
          ...result.data.lower_shelf,
          ...result.data.off_shelf_trays
        ];
        
        allTrays.forEach(tray => {
          expect(typeof tray.id).toBe('string');
          expect(typeof tray.rfid_tag).toBe('string');
          expect(typeof tray.utilization_percentage).toBe('number');
          expect(typeof tray.crop_count).toBe('number');
          expect(typeof tray.is_empty).toBe('boolean');
          expect(typeof tray.provisioned_at).toBe('string');
          expect(tray.location).toBeDefined();
          expect(Array.isArray(tray.crops)).toBe(true);
        });
      }
    }, 10000);

    it('should handle date filter parameter', async () => {
      const testDate = '2024-01-01';
      const result = await service.getNurseryStation(containerId, { date: testDate });
      
      // Should not throw network errors regardless of data availability
      if (result.error) {
        expect(result.error.status_code).toBeGreaterThan(0);
      } else {
        expect(result.data).toBeDefined();
      }
    }, 10000);
  });

  describe('Crops Endpoint', () => {
    it('should fetch crops data with proper response format', async () => {
      const result = await service.getCrops(containerId);
      
      if (result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        
        // If there are crops, verify their structure
        result.data.forEach(crop => {
          expect(typeof crop.id).toBe('string');
          expect(typeof crop.seed_type).toBe('string');
          expect(typeof crop.seed_date).toBe('string');
          expect(typeof crop.age).toBe('number');
          expect(typeof crop.status).toBe('string');
          expect(typeof crop.overdue_days).toBe('number');
          expect(crop.location).toBeDefined();
          expect(['tray', 'panel']).toContain(crop.location.type);
        });
      }
    }, 10000);

    it('should handle seed type filter parameter', async () => {
      const result = await service.getCrops(containerId, { seed_type: 'lettuce' });
      
      // Should not throw network errors regardless of data availability
      if (result.error) {
        expect(result.error.status_code).toBeGreaterThan(0);
      } else {
        expect(Array.isArray(result.data)).toBe(true);
      }
    }, 10000);
  });

  describe('Cultivation Area Endpoint', () => {
    it('should fetch cultivation area data with proper response format', async () => {
      const result = await service.getCultivationArea(containerId);
      
      if (result.data) {
        // Verify response structure
        expect(typeof result.data.utilization_percentage).toBe('number');
        expect(result.data.utilization_percentage).toBeGreaterThanOrEqual(0);
        expect(result.data.utilization_percentage).toBeLessThanOrEqual(100);
        
        expect(Array.isArray(result.data.wall_1)).toBe(true);
        expect(Array.isArray(result.data.wall_2)).toBe(true);
        expect(Array.isArray(result.data.wall_3)).toBe(true);
        expect(Array.isArray(result.data.wall_4)).toBe(true);
        expect(Array.isArray(result.data.off_wall_panels)).toBe(true);
        
        // If there are panels, verify their structure
        const allPanels = [
          ...result.data.wall_1,
          ...result.data.wall_2,
          ...result.data.wall_3,
          ...result.data.wall_4,
          ...result.data.off_wall_panels
        ];
        
        allPanels.forEach(panel => {
          expect(typeof panel.id).toBe('string');
          expect(typeof panel.rfid_tag).toBe('string');
          expect(typeof panel.utilization_percentage).toBe('number');
          expect(typeof panel.crop_count).toBe('number');
          expect(typeof panel.is_empty).toBe('boolean');
          expect(typeof panel.provisioned_at).toBe('string');
          expect(panel.location).toBeDefined();
          expect(Array.isArray(panel.crops)).toBe(true);
        });
      }
    }, 10000);
  });

  describe('Get Crop Endpoint', () => {
    it('should fetch specific crop data with proper response format', async () => {
      // First, we need to get some crops to get a valid ID
      const cropsResult = await service.getCrops(containerId);
      
      if (cropsResult.data && cropsResult.data.length > 0) {
        const cropId = cropsResult.data[0].id;
        const result = await service.getCrop(containerId, cropId);
        
        if (result.data) {
          // Verify response structure matches our TypeScript interface
          expect(typeof result.data.id).toBe('string');
          expect(result.data.id).toBe(cropId);
          expect(typeof result.data.seed_type).toBe('string');
          expect(typeof result.data.seed_date).toBe('string');
          expect(typeof result.data.transplanting_date_planned).toBe('string');
          expect(typeof result.data.harvesting_date_planned).toBe('string');
          expect(typeof result.data.age).toBe('number');
          expect(typeof result.data.status).toBe('string');
          expect(typeof result.data.overdue_days).toBe('number');
          
          // Verify location structure
          expect(result.data.location).toBeDefined();
          expect(['tray', 'panel']).toContain(result.data.location.type);
          expect(typeof result.data.location.row).toBe('number');
          expect(typeof result.data.location.column).toBe('number');
          expect(typeof result.data.location.channel).toBe('number');
          expect(typeof result.data.location.position).toBe('number');
          
          // Conditional fields based on location type
          if (result.data.location.type === 'tray') {
            expect(typeof result.data.location.tray_id).toBe('string');
          } else if (result.data.location.type === 'panel') {
            expect(typeof result.data.location.panel_id).toBe('string');
          }
          
          // Optional date fields
          if (result.data.transplanted_date) {
            expect(typeof result.data.transplanted_date).toBe('string');
          }
          if (result.data.harvesting_date) {
            expect(typeof result.data.harvesting_date).toBe('string');
          }
        }
      } else {
        // If no crops exist, at least test with a non-existent ID
        const result = await service.getCrop(containerId, 'non-existent-crop-id');
        expect(result.error).toBeDefined();
        expect(result.error!.status_code).toBe(404);
      }
    }, 10000);

    it('should handle non-existent crop gracefully', async () => {
      const nonExistentCropId = 'non-existent-crop-id-12345';
      const result = await service.getCrop(containerId, nonExistentCropId);
      
      // Should return a proper error response
      expect(result.error).toBeDefined();
      expect(result.error!.status_code).toBeGreaterThan(0);
      expect(result.data).toBeUndefined();
    }, 10000);
  });

  describe('Add Tray Endpoint', () => {
    it('should attempt to create a tray and handle response appropriately', async () => {
      const trayRequest: CreateTrayRequest = {
        rfid_tag: `TEST_RFID_${Date.now()}`,
        shelf: 'upper',
        slot_number: 1
      };
      
      const result = await service.addTray(containerId, trayRequest);
      
      // Should either succeed or fail with a proper API response
      if (result.error) {
        // Common error scenarios
        expect(result.error.status_code).toBeGreaterThan(0);
        expect(typeof result.error.detail).toBe('string');
        
        // Likely scenarios: container not found, slot occupied, validation error
        expect([400, 404, 409, 422]).toContain(result.error.status_code);
      } else {
        // If successful, verify response structure
        expect(result.data).toBeDefined();
        expect(typeof result.data!.id).toBe('string');
        expect(result.data!.rfid_tag).toBe(trayRequest.rfid_tag);
        expect(result.data!.location.shelf).toBe(trayRequest.shelf);
        expect(result.data!.location.slot_number).toBe(trayRequest.slot_number);
      }
    }, 10000);
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      const malformedRequest = {
        rfid_tag: '', // Invalid empty string
        shelf: 'invalid_shelf', // Invalid shelf type
        slot_number: -1 // Invalid negative number
      } as CreateTrayRequest;
      
      const result = await service.addTray(containerId, malformedRequest);
      
      // Should return a validation error
      expect(result.error).toBeDefined();
      expect(result.error!.status_code).toBeGreaterThan(0);
      expect(result.data).toBeUndefined();
    }, 10000);
  });
});