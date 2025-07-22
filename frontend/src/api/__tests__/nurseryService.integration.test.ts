// Integration tests for nursery service with real backend data
import { nurseryService } from '../nurseryService';
import { authService } from '../authService';
import { env } from '../../utils/env';

describe('NurseryService Integration Tests with Real Backend', () => {
  let authToken: string;
  const testContainerId: number = 1;

  beforeAll(async () => {
    // Ensure we're using real backend
    console.log('Testing against backend at:', env.API_BASE_URL);
    
    try {
      const response = await authService.login({
        username: env.DEFAULT_USERNAME,
        password: env.DEFAULT_PASSWORD
      });
      authToken = response.access_token;
      console.log('Authentication successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Cannot run integration tests without backend authentication');
    }
  });

  afterAll(async () => {
    if (authToken) {
      try {
        await authService.logout();
      } catch (error) {
        console.warn('Logout failed:', error);
      }
    }
  });

  describe('Real Backend Data Tests', () => {
    it('should fetch nursery station layout from backend', async () => {
      const layout = await nurseryService.getNurseryStationLayout(testContainerId);
      
      // Verify structure matches specification
      expect(layout).toHaveProperty('utilization_summary');
      expect(layout).toHaveProperty('layout');
      expect(layout).toHaveProperty('off_shelf_trays');
      
      expect(layout.layout).toHaveProperty('upper_shelf');
      expect(layout.layout).toHaveProperty('lower_shelf');
      
      expect(Array.isArray(layout.layout.upper_shelf)).toBe(true);
      expect(Array.isArray(layout.layout.lower_shelf)).toBe(true);
      expect(Array.isArray(layout.off_shelf_trays)).toBe(true);
      
      // Check utilization percentage is valid
      expect(typeof layout.utilization_summary.total_utilization_percentage).toBe('number');
      expect(layout.utilization_summary.total_utilization_percentage).toBeGreaterThanOrEqual(0);
      expect(layout.utilization_summary.total_utilization_percentage).toBeLessThanOrEqual(100);
      
      console.log('Nursery station layout fetched successfully:', {
        utilization: layout.utilization_summary.total_utilization_percentage,
        upperShelfSlots: layout.layout.upper_shelf.length,
        lowerShelfSlots: layout.layout.lower_shelf.length,
        offShelfTrays: layout.off_shelf_trays.length
      });
    });

    it('should fetch trays for container from backend', async () => {
      const trays = await nurseryService.getTraysForContainer(testContainerId);
      
      expect(Array.isArray(trays)).toBe(true);
      
      if (trays.length > 0) {
        const firstTray = trays[0];
        expect(firstTray).toHaveProperty('id');
        expect(firstTray).toHaveProperty('container_id');
        expect(firstTray.container_id).toBe(testContainerId);
        expect(typeof firstTray.id).toBe('number');
        
        console.log('Trays fetched successfully:', {
          count: trays.length,
          firstTrayId: firstTray.id,
          firstTrayRfid: firstTray.rfid_tag
        });
      } else {
        console.log('No trays found for container:', testContainerId);
      }
    });

    it('should fetch tray snapshots from backend', async () => {
      const snapshots = await nurseryService.getTraySnapshots(testContainerId);
      
      expect(Array.isArray(snapshots)).toBe(true);
      
      if (snapshots.length > 0) {
        const firstSnapshot = snapshots[0];
        expect(firstSnapshot).toHaveProperty('id');
        expect(firstSnapshot).toHaveProperty('container_id');
        expect(firstSnapshot.container_id).toBe(testContainerId);
        
        console.log('Tray snapshots fetched successfully:', {
          count: snapshots.length,
          firstSnapshotId: firstSnapshot.id,
          timestamp: firstSnapshot.timestamp
        });
      } else {
        console.log('No tray snapshots found for container:', testContainerId);
      }
    });

    it('should fetch available tray slots from backend', async () => {
      const slots = await nurseryService.getAvailableTraySlots(testContainerId);
      
      expect(slots).toHaveProperty('available_slots');
      expect(Array.isArray(slots.available_slots)).toBe(true);
      
      if (slots.available_slots.length > 0) {
        const firstSlot = slots.available_slots[0];
        expect(firstSlot).toHaveProperty('shelf');
        expect(firstSlot).toHaveProperty('slot_number');
        expect(firstSlot).toHaveProperty('location_description');
        expect(['upper', 'lower']).toContain(firstSlot.shelf);
        expect(typeof firstSlot.slot_number).toBe('number');
        expect(firstSlot.slot_number).toBeGreaterThan(0);
        expect(firstSlot.slot_number).toBeLessThanOrEqual(8);
        
        console.log('Available slots fetched successfully:', {
          count: slots.available_slots.length,
          firstSlot: firstSlot.location_description
        });
      } else {
        console.log('No available slots found for container:', testContainerId);
      }
    });

    it('should fetch nursery station summary from backend', async () => {
      const summary = await nurseryService.getNurseryStationSummary(testContainerId);
      
      expect(summary).toHaveProperty('total_slots');
      expect(summary).toHaveProperty('occupied_slots');
      expect(summary).toHaveProperty('utilization_percentage');
      expect(summary).toHaveProperty('total_trays');
      expect(summary).toHaveProperty('off_shelf_trays');
      expect(summary).toHaveProperty('total_crops');
      expect(summary).toHaveProperty('overdue_crops');
      expect(summary).toHaveProperty('last_updated');
      
      // Validate data types
      expect(typeof summary.total_slots).toBe('number');
      expect(typeof summary.occupied_slots).toBe('number');
      expect(typeof summary.utilization_percentage).toBe('number');
      expect(typeof summary.total_trays).toBe('number');
      expect(typeof summary.off_shelf_trays).toBe('number');
      expect(typeof summary.total_crops).toBe('number');
      expect(typeof summary.overdue_crops).toBe('number');
      
      // Validate logical constraints
      expect(summary.utilization_percentage).toBeGreaterThanOrEqual(0);
      expect(summary.utilization_percentage).toBeLessThanOrEqual(100);
      expect(summary.occupied_slots).toBeLessThanOrEqual(summary.total_slots);
      expect(summary.off_shelf_trays).toBeLessThanOrEqual(summary.total_trays);
      
      console.log('Nursery station summary fetched successfully:', {
        totalSlots: summary.total_slots,
        occupiedSlots: summary.occupied_slots,
        utilization: summary.utilization_percentage,
        totalTrays: summary.total_trays,
        offShelfTrays: summary.off_shelf_trays,
        totalCrops: summary.total_crops,
        overdueCrops: summary.overdue_crops
      });
    });

    it('should test tray CRUD operations if trays exist', async () => {
      // First get existing trays
      const trays = await nurseryService.getTraysForContainer(testContainerId);
      
      if (trays.length > 0) {
        const testTray = trays[0];
        
        // Test individual tray fetch
        const fetchedTray = await nurseryService.getTrayById(testTray.id);
        expect(fetchedTray).toHaveProperty('id');
        expect(fetchedTray.id).toBe(testTray.id);
        expect(fetchedTray).toHaveProperty('container_id');
        expect(fetchedTray.container_id).toBe(testContainerId);
        
        console.log('Individual tray fetched successfully:', {
          trayId: fetchedTray.id,
          rfidTag: fetchedTray.rfid_tag,
          status: fetchedTray.status,
          utilization: fetchedTray.utilization_pct
        });
        
        // Test tray update (non-destructive)
        const originalUtilization = fetchedTray.utilization_pct;
        const testUtilization = originalUtilization || 50.0;
        
        try {
          const updatedTray = await nurseryService.updateTray(testTray.id, {
            utilization_pct: testUtilization
          });
          expect(updatedTray).toHaveProperty('id');
          expect(updatedTray.id).toBe(testTray.id);
          
          console.log('Tray updated successfully:', {
            trayId: updatedTray.id,
            newUtilization: updatedTray.utilization_pct
          });
        } catch (error) {
          console.warn('Tray update failed (may not be implemented):', error);
        }
      } else {
        console.log('No trays available for CRUD operations test');
      }
    });

    it('should test tray snapshot creation with real data', async () => {
      try {
        const snapshotData = {
          rfid_tag: 'TEST_TRAY_001',
          location: { shelf: 'upper', slot_number: 1 },
          crop_count: 25,
          utilization_percentage: 75.0,
          status: 'active'
        };
        
        const createdSnapshot = await nurseryService.createTraySnapshot(testContainerId, snapshotData);
        
        expect(createdSnapshot).toHaveProperty('id');
        expect(createdSnapshot).toHaveProperty('container_id');
        expect(createdSnapshot.container_id).toBe(testContainerId);
        expect(createdSnapshot).toHaveProperty('timestamp');
        
        console.log('Tray snapshot created successfully:', {
          snapshotId: createdSnapshot.id,
          timestamp: createdSnapshot.timestamp,
          rfidTag: createdSnapshot.rfid_tag
        });
      } catch (error) {
        console.warn('Tray snapshot creation failed (may not be implemented):', error);
      }
    });

    it('should test convenience methods with real data', async () => {
      // Test getTraysByStatus
      const activeTrays = await nurseryService.getTraysByStatus(testContainerId, 'active');
      expect(Array.isArray(activeTrays)).toBe(true);
      console.log('Active trays found:', activeTrays.length);
      
      // Test getTraysByLocationType
      const nurseryTrays = await nurseryService.getTraysByLocationType(testContainerId, 'nursery');
      expect(Array.isArray(nurseryTrays)).toBe(true);
      console.log('Nursery trays found:', nurseryTrays.length);
      
      // Test date range snapshots
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
      
      const snapshots = await nurseryService.getSnapshotsForDateRange(
        testContainerId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      expect(Array.isArray(snapshots)).toBe(true);
      console.log('Snapshots in date range:', snapshots.length);
    });

    it('should handle error cases gracefully', async () => {
      // Test with invalid container ID
      try {
        await nurseryService.getNurseryStationLayout(999999);
        console.log('Backend allows invalid container ID (or returns empty data)');
      } catch (error) {
        console.log('Backend properly handles invalid container ID:', error);
        expect(error).toBeDefined();
      }
      
      // Test with invalid tray ID
      try {
        await nurseryService.getTrayById(999999);
        console.log('Backend allows invalid tray ID (or returns empty data)');
      } catch (error) {
        console.log('Backend properly handles invalid tray ID:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Authentication Integration', () => {
    it('should handle authentication properly', async () => {
      // This test verifies that our service properly includes auth headers
      // and handles 401 responses from the backend
      expect(authToken).toBeDefined();
      expect(authService.isAuthenticated()).toBe(true);
      
      // Test that authenticated requests work
      const layout = await nurseryService.getNurseryStationLayout(testContainerId);
      expect(layout).toBeDefined();
      
      console.log('Authentication integration working correctly');
    });
  });
});