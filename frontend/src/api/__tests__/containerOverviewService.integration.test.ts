import { containerOverviewService } from '../containerOverviewService';
import { authService } from '../authService';
import { TokenStorage } from '../../utils/tokenStorage';

describe('ContainerOverviewService Integration Tests', () => {
  const testContainerId = 1;
  let authToken: string;

  beforeAll(async () => {
    // Setup authentication for integration tests
    try {
      const response = await authService.login({
        username: 'testuser',
        password: 'testpassword'
      });
      authToken = response.access_token;
    } catch (error) {
      console.warn('Authentication failed in integration tests:', error);
      // Skip tests if authentication fails
      return;
    }
  });

  afterAll(() => {
    // Clean up authentication
    TokenStorage.clearToken();
  });

  describe('Full API Integration', () => {
    it('should perform complete container overview workflow', async () => {
      // Skip if no auth token
      if (!authToken) {
        console.warn('Skipping integration test - no auth token');
        return;
      }

      try {
        // 1. Get container overview
        const overview = await containerOverviewService.getContainerOverview(testContainerId, {
          time_range: 'week',
          metric_interval: 'day'
        });

        expect(overview).toBeDefined();
        expect(overview.container).toBeDefined();
        expect(overview.container.id).toBe(testContainerId);
        expect(overview.dashboard_metrics).toBeDefined();
        expect(overview.crops_summary).toBeDefined();
        expect(overview.recent_activity).toBeDefined();

        // 2. Get activity logs
        const activityLogs = await containerOverviewService.getActivityLogs(testContainerId, {
          page: 1,
          limit: 10
        });

        expect(activityLogs).toBeDefined();
        expect(activityLogs.activities).toBeDefined();
        expect(activityLogs.pagination).toBeDefined();
        expect(Array.isArray(activityLogs.activities)).toBe(true);

        // 3. Get metric snapshots
        const metricSnapshots = await containerOverviewService.getMetricSnapshots(testContainerId, {
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          interval: 'day'
        });

        expect(Array.isArray(metricSnapshots)).toBe(true);

        // 4. Get dashboard summary
        const dashboardSummary = await containerOverviewService.getDashboardSummary(testContainerId);

        expect(dashboardSummary).toBeDefined();
        expect(dashboardSummary.current_metrics).toBeDefined();
        expect(dashboardSummary.crop_counts).toBeDefined();
        expect(typeof dashboardSummary.activity_count).toBe('number');

        // 5. Test utility methods
        const recentActivity = await containerOverviewService.getRecentActivity(testContainerId, 5);
        expect(Array.isArray(recentActivity)).toBe(true);
        expect(recentActivity.length).toBeLessThanOrEqual(5);

        const latestMetrics = await containerOverviewService.getLatestMetrics(testContainerId);
        // latestMetrics can be null if no metrics exist
        if (latestMetrics) {
          expect(latestMetrics.container_id).toBe(testContainerId);
          expect(typeof latestMetrics.air_temperature).toBe('number');
        }

        console.log('Container overview integration test completed successfully');
      } catch (error) {
        console.error('Integration test failed:', error);
        throw error;
      }
    });

    it('should handle create operations', async () => {
      // Skip if no auth token
      if (!authToken) {
        console.warn('Skipping integration test - no auth token');
        return;
      }

      try {
        // Create activity log
        const activityLogData = {
          action_type: 'Test Action',
          actor_type: 'Integration Test',
          actor_id: 'test-user',
          description: 'Integration test activity log'
        };

        const createdActivity = await containerOverviewService.createActivityLog(testContainerId, activityLogData);

        expect(createdActivity).toBeDefined();
        expect(createdActivity.container_id).toBe(testContainerId);
        expect(createdActivity.action_type).toBe(activityLogData.action_type);
        expect(createdActivity.description).toBe(activityLogData.description);

        // Create metric snapshot
        const metricData = {
          air_temperature: 23.5,
          humidity: 68.0,
          co2: 420,
          yield_kg: 16.5,
          space_utilization_pct: 82.3
        };

        const createdMetric = await containerOverviewService.createMetricSnapshot(testContainerId, metricData);

        expect(createdMetric).toBeDefined();
        expect(createdMetric.container_id).toBe(testContainerId);
        expect(createdMetric.air_temperature).toBe(metricData.air_temperature);
        expect(createdMetric.humidity).toBe(metricData.humidity);
        expect(createdMetric.co2).toBe(metricData.co2);

        console.log('Create operations integration test completed successfully');
      } catch (error) {
        console.error('Create operations integration test failed:', error);
        throw error;
      }
    });

    it('should handle environment links operations', async () => {
      // Skip if no auth token
      if (!authToken) {
        console.warn('Skipping integration test - no auth token');
        return;
      }

      try {
        // Get environment links
        const envLinks = await containerOverviewService.getEnvironmentLinks(testContainerId);

        expect(envLinks).toBeDefined();
        expect(envLinks.container_id).toBe(testContainerId);
        expect(envLinks.fa).toBeDefined();
        expect(envLinks.pya).toBeDefined();
        expect(envLinks.aws).toBeDefined();
        expect(envLinks.mbai).toBeDefined();
        expect(envLinks.fh).toBeDefined();

        // Update environment links
        const updatedLinks = {
          fa: { endpoint: 'test-fa.example.com', enabled: true },
          pya: { endpoint: 'test-pya.example.com', enabled: false },
          aws: { region: 'us-west-2', enabled: true },
          mbai: { api_key: 'test-key', enabled: true },
          fh: { connection_string: 'test-connection', enabled: false }
        };

        const updateResponse = await containerOverviewService.updateEnvironmentLinks(testContainerId, updatedLinks);

        expect(updateResponse).toBeDefined();
        expect(updateResponse.success).toBe(true);
        expect(updateResponse.message).toBeDefined();

        console.log('Environment links integration test completed successfully');
      } catch (error) {
        console.error('Environment links integration test failed:', error);
        throw error;
      }
    });

    it('should handle search and filter operations', async () => {
      // Skip if no auth token
      if (!authToken) {
        console.warn('Skipping integration test - no auth token');
        return;
      }

      try {
        // Search activity logs with filters
        const searchResults = await containerOverviewService.searchActivityLogs(testContainerId, {
          actionType: 'Test Action',
          actorType: 'Integration Test',
          page: 1,
          limit: 5
        });

        expect(searchResults).toBeDefined();
        expect(searchResults.activities).toBeDefined();
        expect(Array.isArray(searchResults.activities)).toBe(true);
        expect(searchResults.pagination).toBeDefined();
        expect(searchResults.pagination.limit).toBe(5);

        // Get metrics for time range
        const timeRangeMetrics = await containerOverviewService.getMetricsForTimeRange(
          testContainerId,
          '2023-01-01T00:00:00Z',
          '2023-12-31T23:59:59Z',
          'week'
        );

        expect(Array.isArray(timeRangeMetrics)).toBe(true);
        timeRangeMetrics.forEach(metric => {
          expect(metric.container_id).toBe(testContainerId);
          expect(typeof metric.air_temperature).toBe('number');
        });

        console.log('Search and filter integration test completed successfully');
      } catch (error) {
        console.error('Search and filter integration test failed:', error);
        throw error;
      }
    });

    it('should handle error scenarios gracefully', async () => {
      // Skip if no auth token
      if (!authToken) {
        console.warn('Skipping integration test - no auth token');
        return;
      }

      try {
        // Test with invalid container ID
        const invalidContainerId = 999999;
        
        await expect(
          containerOverviewService.getContainerOverview(invalidContainerId)
        ).rejects.toThrow();

        // Test with invalid parameters
        await expect(
          containerOverviewService.getActivityLogs(testContainerId, {
            page: -1,
            limit: 0
          })
        ).rejects.toThrow();

        console.log('Error handling integration test completed successfully');
      } catch (error) {
        console.error('Error handling integration test failed:', error);
        throw error;
      }
    });
  });

  describe('Authentication Integration', () => {
    it('should handle authentication errors properly', async () => {
      // Clear token to simulate unauthenticated state
      TokenStorage.clearToken();

      await expect(
        containerOverviewService.getContainerOverview(testContainerId)
      ).rejects.toThrow('Authentication required');
    });

    it('should work with valid authentication', async () => {
      // Re-authenticate
      if (authToken) {
        const tokenData = {
          access_token: authToken,
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Date.now() + 3600000
        };
        TokenStorage.setToken(tokenData);

        const overview = await containerOverviewService.getContainerOverview(testContainerId);
        expect(overview).toBeDefined();
      }
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests efficiently', async () => {
      // Skip if no auth token
      if (!authToken) {
        console.warn('Skipping performance test - no auth token');
        return;
      }

      const startTime = Date.now();

      // Make multiple concurrent requests
      const promises = [
        containerOverviewService.getContainerOverview(testContainerId),
        containerOverviewService.getActivityLogs(testContainerId, { limit: 10 }),
        containerOverviewService.getMetricSnapshots(testContainerId, { interval: 'day' }),
        containerOverviewService.getDashboardSummary(testContainerId)
      ];

      const results = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(result).toBeDefined();
      });

      console.log(`Concurrent requests completed in ${duration}ms`);
      
      // Reasonable performance expectation (adjust based on your requirements)
      expect(duration).toBeLessThan(10000); // 10 seconds
    });
  });
});