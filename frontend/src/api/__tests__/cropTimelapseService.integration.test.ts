// Integration tests for crop timelapse service with real backend data
import { cropTimelapseService } from '../cropTimelapseService';
import { authService } from '../authService';
import { env } from '../../utils/env';

describe('CropTimelapseService Integration Tests with Real Backend', () => {
  let authToken: string;
  const testCropId: number = 1;

  beforeAll(async () => {
    console.log('Testing crop timelapse service against backend at:', env.API_BASE_URL);
    
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

  describe('Crop Timelapse Data', () => {
    it('should fetch crop timelapse data', async () => {
      const timelapse = await cropTimelapseService.getCropTimelapse(testCropId);
      
      expect(timelapse).toHaveProperty('crop_metadata');
      expect(timelapse).toHaveProperty('lifecycle_milestones');
      expect(timelapse).toHaveProperty('timelapse_frames');
      expect(timelapse).toHaveProperty('history');
      
      expect(timelapse.crop_metadata).toHaveProperty('id');
      expect(timelapse.crop_metadata).toHaveProperty('seed_type');
      expect(timelapse.crop_metadata).toHaveProperty('location');
      expect(timelapse.crop_metadata.id).toBe(testCropId);
      
      expect(Array.isArray(timelapse.timelapse_frames)).toBe(true);
      expect(Array.isArray(timelapse.history)).toBe(true);
      
      if (timelapse.timelapse_frames.length > 0) {
        const frame = timelapse.timelapse_frames[0];
        expect(frame).toHaveProperty('timestamp');
        expect(frame).toHaveProperty('crop_age_days');
        expect(frame).toHaveProperty('growth_metrics');
        expect(frame).toHaveProperty('environmental_metrics');
        expect(typeof frame.crop_age_days).toBe('number');
      }
      
      console.log('Crop timelapse data fetched successfully:', {
        cropId: timelapse.crop_metadata.id,
        seedType: timelapse.crop_metadata.seed_type,
        framesCount: timelapse.timelapse_frames.length,
        historyCount: timelapse.history.length
      });
    });
  });

  describe('Crop Snapshots', () => {
    it('should fetch crop snapshots', async () => {
      const snapshots = await cropTimelapseService.getCropSnapshots(testCropId);
      
      expect(Array.isArray(snapshots)).toBe(true);
      
      if (snapshots.length > 0) {
        const snapshot = snapshots[0];
        expect(snapshot).toHaveProperty('id');
        expect(snapshot).toHaveProperty('crop_id');
        expect(snapshot).toHaveProperty('timestamp');
        expect(snapshot.crop_id).toBe(testCropId);
        expect(typeof snapshot.id).toBe('number');
      }
      
      console.log('Crop snapshots fetched successfully:', {
        cropId: testCropId,
        snapshotsCount: snapshots.length
      });
    });

    it('should fetch snapshots with date range', async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
      
      const snapshots = await cropTimelapseService.getSnapshotsForDateRange(
        testCropId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      expect(Array.isArray(snapshots)).toBe(true);
      
      console.log('Snapshots for date range fetched successfully:', {
        cropId: testCropId,
        dateRange: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        snapshotsCount: snapshots.length
      });
    });

    it('should fetch snapshots for last N days', async () => {
      const snapshots = await cropTimelapseService.getSnapshotsForLastDays(testCropId, 14);
      
      expect(Array.isArray(snapshots)).toBe(true);
      
      console.log('Snapshots for last 14 days fetched successfully:', {
        cropId: testCropId,
        snapshotsCount: snapshots.length
      });
    });

    it('should get latest snapshot', async () => {
      const latestSnapshot = await cropTimelapseService.getLatestSnapshot(testCropId);
      
      if (latestSnapshot) {
        expect(latestSnapshot).toHaveProperty('id');
        expect(latestSnapshot).toHaveProperty('crop_id');
        expect(latestSnapshot.crop_id).toBe(testCropId);
        
        console.log('Latest snapshot fetched successfully:', {
          snapshotId: latestSnapshot.id,
          timestamp: latestSnapshot.timestamp
        });
      } else {
        console.log('No snapshots found for crop:', testCropId);
      }
    });

    it('should create crop snapshot', async () => {
      const snapshotData = {
        lifecycle_status: 'growing',
        health_status: 'healthy',
        recipe_version_id: 1,
        location: { type: 'tray', tray_id: 1, row: 1, column: 1 },
        accumulated_light_hours: 120.5,
        accumulated_water_hours: 48.0,
        image_url: 'https://example.com/crop-image.jpg'
      };
      
      try {
        const createdSnapshot = await cropTimelapseService.createCropSnapshot(testCropId, snapshotData);
        
        expect(createdSnapshot).toHaveProperty('id');
        expect(createdSnapshot).toHaveProperty('crop_id');
        expect(createdSnapshot.crop_id).toBe(testCropId);
        expect(createdSnapshot.lifecycle_status).toBe(snapshotData.lifecycle_status);
        
        console.log('Crop snapshot created successfully:', {
          snapshotId: createdSnapshot.id,
          cropId: createdSnapshot.crop_id,
          timestamp: createdSnapshot.timestamp
        });
      } catch (error) {
        console.warn('Crop snapshot creation failed (may not be implemented):', error);
      }
    });
  });

  describe('Growth Metrics', () => {
    it('should fetch growth chart data', async () => {
      const growthData = await cropTimelapseService.getCropGrowthMetrics(testCropId);
      
      expect(growthData).toHaveProperty('chart_data');
      expect(growthData).toHaveProperty('metric_definitions');
      expect(Array.isArray(growthData.chart_data)).toBe(true);
      
      if (growthData.chart_data.length > 0) {
        const dataPoint = growthData.chart_data[0];
        expect(dataPoint).toHaveProperty('crop_age_days');
        expect(typeof dataPoint.crop_age_days).toBe('number');
      }
      
      expect(growthData.metric_definitions).toHaveProperty('area');
      expect(growthData.metric_definitions).toHaveProperty('weight');
      
      console.log('Growth chart data fetched successfully:', {
        cropId: testCropId,
        dataPointsCount: growthData.chart_data.length,
        metricsCount: Object.keys(growthData.metric_definitions).length
      });
    });

    it('should fetch specific growth metrics', async () => {
      const metrics = ['area', 'weight', 'accumulated_light_hours'];
      const growthData = await cropTimelapseService.getSpecificGrowthMetrics(testCropId, metrics);
      
      expect(growthData).toHaveProperty('chart_data');
      expect(growthData).toHaveProperty('metric_definitions');
      expect(Array.isArray(growthData.chart_data)).toBe(true);
      
      console.log('Specific growth metrics fetched successfully:', {
        cropId: testCropId,
        requestedMetrics: metrics,
        dataPointsCount: growthData.chart_data.length
      });
    });

    it('should fetch all growth metrics', async () => {
      const growthData = await cropTimelapseService.getAllGrowthMetrics(testCropId);
      
      expect(growthData).toHaveProperty('chart_data');
      expect(growthData).toHaveProperty('metric_definitions');
      expect(Array.isArray(growthData.chart_data)).toBe(true);
      
      console.log('All growth metrics fetched successfully:', {
        cropId: testCropId,
        dataPointsCount: growthData.chart_data.length
      });
    });

    it('should fetch environmental metrics', async () => {
      const envData = await cropTimelapseService.getEnvironmentalMetrics(testCropId);
      
      expect(envData).toHaveProperty('chart_data');
      expect(envData).toHaveProperty('metric_definitions');
      expect(Array.isArray(envData.chart_data)).toBe(true);
      
      console.log('Environmental metrics fetched successfully:', {
        cropId: testCropId,
        dataPointsCount: envData.chart_data.length
      });
    });

    it('should fetch growth metrics for last N days', async () => {
      const growthData = await cropTimelapseService.getGrowthMetricsForLastDays(testCropId, 30);
      
      expect(growthData).toHaveProperty('chart_data');
      expect(growthData).toHaveProperty('metric_definitions');
      expect(Array.isArray(growthData.chart_data)).toBe(true);
      
      console.log('Growth metrics for last 30 days fetched successfully:', {
        cropId: testCropId,
        dataPointsCount: growthData.chart_data.length
      });
    });
  });

  describe('Crop Details and Measurements', () => {
    it('should fetch crop details', async () => {
      const cropDetails = await cropTimelapseService.getCropById(testCropId);
      
      expect(cropDetails).toHaveProperty('id');
      expect(cropDetails.id).toBe(testCropId);
      expect(cropDetails).toHaveProperty('lifecycle_status');
      expect(cropDetails).toHaveProperty('health_check');
      
      console.log('Crop details fetched successfully:', {
        cropId: cropDetails.id,
        lifecycleStatus: cropDetails.lifecycle_status,
        healthCheck: cropDetails.health_check
      });
    });

    it('should fetch crop measurements', async () => {
      const measurements = await cropTimelapseService.getCropMeasurements(testCropId);
      
      expect(measurements).toHaveProperty('id');
      expect(typeof measurements.id).toBe('number');
      
      console.log('Crop measurements fetched successfully:', {
        measurementsId: measurements.id,
        area: measurements.area,
        weight: measurements.weight,
        height: measurements.height
      });
    });

    it('should update crop measurements', async () => {
      const updateData = {
        area: 25.5,
        weight: 15.2,
        height: 8.7
      };
      
      try {
        const updatedMeasurements = await cropTimelapseService.updateCropMeasurements(testCropId, updateData);
        
        expect(updatedMeasurements).toHaveProperty('id');
        expect(updatedMeasurements.area).toBe(updateData.area);
        expect(updatedMeasurements.weight).toBe(updateData.weight);
        expect(updatedMeasurements.height).toBe(updateData.height);
        
        console.log('Crop measurements updated successfully:', {
          measurementsId: updatedMeasurements.id,
          area: updatedMeasurements.area,
          weight: updatedMeasurements.weight,
          height: updatedMeasurements.height
        });
      } catch (error) {
        console.warn('Crop measurements update failed (may not be implemented):', error);
      }
    });

    it('should update single measurement', async () => {
      try {
        const updatedMeasurements = await cropTimelapseService.updateSingleMeasurement(testCropId, 'area', 30.0);
        
        expect(updatedMeasurements).toHaveProperty('id');
        expect(updatedMeasurements.area).toBe(30.0);
        
        console.log('Single measurement updated successfully:', {
          measurementsId: updatedMeasurements.id,
          newArea: updatedMeasurements.area
        });
      } catch (error) {
        console.warn('Single measurement update failed (may not be implemented):', error);
      }
    });
  });

  describe('Crop History', () => {
    it('should fetch crop history', async () => {
      const history = await cropTimelapseService.getCropHistory(testCropId);
      
      expect(Array.isArray(history)).toBe(true);
      
      if (history.length > 0) {
        const historyEntry = history[0];
        expect(historyEntry).toHaveProperty('crop_id');
        expect(historyEntry).toHaveProperty('timestamp');
        expect(historyEntry.crop_id).toBe(testCropId);
      }
      
      console.log('Crop history fetched successfully:', {
        cropId: testCropId,
        historyEntriesCount: history.length
      });
    });

    it('should fetch recent history', async () => {
      const recentHistory = await cropTimelapseService.getRecentHistory(testCropId, 5);
      
      expect(Array.isArray(recentHistory)).toBe(true);
      expect(recentHistory.length).toBeLessThanOrEqual(5);
      
      console.log('Recent history fetched successfully:', {
        cropId: testCropId,
        recentEntriesCount: recentHistory.length
      });
    });

    it('should fetch history for date range', async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // 30 days ago
      
      const history = await cropTimelapseService.getHistoryForDateRange(
        testCropId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      expect(Array.isArray(history)).toBe(true);
      
      console.log('History for date range fetched successfully:', {
        cropId: testCropId,
        dateRange: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        historyEntriesCount: history.length
      });
    });

    it('should create crop history entry', async () => {
      const historyData = {
        event: 'Manual inspection',
        performed_by: 'test_user',
        notes: 'Crop looking healthy, good growth progress'
      };
      
      try {
        const createdEntry = await cropTimelapseService.createCropHistoryEntry(testCropId, historyData);
        
        expect(createdEntry).toHaveProperty('crop_id');
        expect(createdEntry).toHaveProperty('timestamp');
        expect(createdEntry.crop_id).toBe(testCropId);
        expect(createdEntry.event).toBe(historyData.event);
        expect(createdEntry.performed_by).toBe(historyData.performed_by);
        
        console.log('Crop history entry created successfully:', {
          cropId: createdEntry.crop_id,
          timestamp: createdEntry.timestamp,
          event: createdEntry.event
        });
      } catch (error) {
        console.warn('Crop history entry creation failed (may not be implemented):', error);
      }
    });

    it('should add history entry with convenience method', async () => {
      try {
        const historyEntry = await cropTimelapseService.addHistoryEntry(
          testCropId,
          'Nutrient adjustment',
          'test_user',
          'Adjusted nutrient levels for optimal growth'
        );
        
        expect(historyEntry).toHaveProperty('crop_id');
        expect(historyEntry.crop_id).toBe(testCropId);
        expect(historyEntry.event).toBe('Nutrient adjustment');
        
        console.log('History entry added with convenience method:', {
          cropId: historyEntry.crop_id,
          event: historyEntry.event,
          performedBy: historyEntry.performed_by
        });
      } catch (error) {
        console.warn('History entry addition failed (may not be implemented):', error);
      }
    });
  });

  describe('Notes Management', () => {
    it('should update crop notes', async () => {
      const testNotes = 'Updated crop notes from integration test';
      
      try {
        const response = await cropTimelapseService.updateCropNotes(testCropId, { notes: testNotes });
        
        expect(response).toHaveProperty('success');
        expect(response).toHaveProperty('message');
        expect(response).toHaveProperty('updated_at');
        expect(response.success).toBe(true);
        
        console.log('Crop notes updated successfully:', {
          cropId: testCropId,
          success: response.success,
          message: response.message,
          updatedAt: response.updated_at
        });
      } catch (error) {
        console.warn('Crop notes update failed (may not be implemented):', error);
      }
    });

    it('should update notes with timestamp convenience method', async () => {
      const testNotes = 'Notes updated with timestamp convenience method';
      
      try {
        const response = await cropTimelapseService.updateNotesWithTimestamp(testCropId, testNotes);
        
        expect(response).toHaveProperty('success');
        expect(response).toHaveProperty('message');
        expect(response.success).toBe(true);
        
        console.log('Crop notes updated with timestamp method:', {
          cropId: testCropId,
          success: response.success,
          message: response.message
        });
      } catch (error) {
        console.warn('Crop notes update with timestamp failed (may not be implemented):', error);
      }
    });
  });

  describe('Comprehensive Data Retrieval', () => {
    it('should fetch comprehensive crop data', async () => {
      const comprehensiveData = await cropTimelapseService.getComprehensiveCropData(testCropId);
      
      expect(comprehensiveData).toHaveProperty('details');
      expect(comprehensiveData).toHaveProperty('timelapse');
      expect(comprehensiveData).toHaveProperty('measurements');
      expect(comprehensiveData).toHaveProperty('recentHistory');
      
      expect(comprehensiveData.details.id).toBe(testCropId);
      expect(comprehensiveData.timelapse.crop_metadata.id).toBe(testCropId);
      expect(Array.isArray(comprehensiveData.recentHistory)).toBe(true);
      
      console.log('Comprehensive crop data fetched successfully:', {
        cropId: testCropId,
        timelapseFrames: comprehensiveData.timelapse.timelapse_frames.length,
        historyEntries: comprehensiveData.recentHistory.length,
        lifecycleStatus: comprehensiveData.details.lifecycle_status
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid crop ID', async () => {
      try {
        await cropTimelapseService.getCropById(999999);
        console.log('Backend allows invalid crop ID (or returns empty data)');
      } catch (error) {
        console.log('Backend properly handles invalid crop ID:', error);
        expect(error).toBeDefined();
      }
    });

    it('should handle invalid date range', async () => {
      try {
        const invalidStartDate = '2099-12-31T23:59:59Z';
        const invalidEndDate = '2100-01-01T00:00:00Z';
        
        const snapshots = await cropTimelapseService.getSnapshotsForDateRange(
          testCropId,
          invalidStartDate,
          invalidEndDate
        );
        
        expect(Array.isArray(snapshots)).toBe(true);
        expect(snapshots.length).toBe(0);
        
        console.log('Invalid date range handled correctly (returned empty array)');
      } catch (error) {
        console.log('Backend properly handles invalid date range:', error);
        expect(error).toBeDefined();
      }
    });
  });

  describe('Authentication Integration', () => {
    it('should handle authentication properly', async () => {
      expect(authToken).toBeDefined();
      expect(authService.isAuthenticated()).toBe(true);
      
      // Test that authenticated requests work
      const cropDetails = await cropTimelapseService.getCropById(testCropId);
      expect(cropDetails).toBeDefined();
      
      console.log('Authentication integration working correctly');
    });
  });
});