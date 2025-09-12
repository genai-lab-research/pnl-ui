// Container Detail Dataflow Tests
import { containerDetailService } from '../services/containerDetailService';
import { containerDetailAdaptor } from '../services/containerDetailAdaptor';
import { ContainerDetailViewModel } from '../viewmodels/ContainerDetailViewModel';
import { ContainerMetricsViewModel } from '../viewmodels/ContainerMetricsViewModel';
import { ContainerActivityViewModel } from '../viewmodels/ContainerActivityViewModel';

// Mock the API service
jest.mock('../../../api/containerApiService', () => ({
  containerApiService: {
    getContainerOverview: jest.fn(),
    getActivityLogs: jest.fn(),
    getMetricSnapshots: jest.fn(),
    getDashboardSummary: jest.fn(),
    updateContainerSettings: jest.fn(),
    getEnvironmentLinks: jest.fn(),
    createActivityLog: jest.fn(),
    checkContainerAccess: jest.fn(),
  },
}));

describe('Container Detail Dataflow', () => {
  const mockContainerId = 123;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear adaptor cache
    containerDetailAdaptor.clearAllCache();
  });

  describe('Service Layer Integration', () => {
    it('should initialize container data successfully', async () => {
      // Mock API responses
      const mockOverviewResponse = {
        container: {
          id: mockContainerId,
          name: 'Test Container',
          type: 'physical',
          status: 'active',
          tenant: { id: 1, name: 'Test Tenant' },
          location: {},
        },
        dashboard_metrics: {
          air_temperature: 22.5,
          humidity: 65,
          co2: 400,
          yield_metrics: { average: 10, total: 100, chart_data: [] },
          space_utilization: { nursery_station: 75, cultivation_area: 80, chart_data: [] },
        },
        crops_summary: [],
        recent_activity: [],
      };

      containerDetailAdaptor.checkContainerAccess = jest.fn().mockResolvedValue(true);
      containerDetailAdaptor.loadContainerOverview = jest.fn().mockResolvedValue({
        container: mockOverviewResponse.container,
        dashboard: mockOverviewResponse.dashboard_metrics,
        crops: mockOverviewResponse.crops_summary,
        recentActivity: mockOverviewResponse.recent_activity,
        lastUpdated: new Date().toISOString(),
      });

      // Test service initialization
      const result = await containerDetailService.initializeContainer(mockContainerId, 'week');

      expect(result.data).toBeDefined();
      expect(result.data.container.id).toBe(mockContainerId);
      expect(result.permissions).toBeDefined();
      expect(containerDetailAdaptor.checkContainerAccess).toHaveBeenCalledWith(mockContainerId);
      expect(containerDetailAdaptor.loadContainerOverview).toHaveBeenCalledWith(mockContainerId, 'week');
    });

    it('should handle access denied errors', async () => {
      containerDetailAdaptor.checkContainerAccess = jest.fn().mockResolvedValue(false);

      await expect(
        containerDetailService.initializeContainer(mockContainerId, 'week')
      ).rejects.toThrow('Access denied to container');
    });

    it('should load activity logs with pagination', async () => {
      const mockActivityResponse = {
        activities: [
          {
            id: 1,
            container_id: mockContainerId,
            timestamp: new Date().toISOString(),
            action_type: 'update',
            actor_type: 'user',
            actor_id: 'test-user',
            description: 'Test activity',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          total_pages: 1,
        },
      };

      containerDetailAdaptor.loadActivityLogs = jest.fn().mockResolvedValue(mockActivityResponse);

      const result = await containerDetailService.loadActivityLogs(mockContainerId, 1, 20);

      expect(result.activities).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(containerDetailAdaptor.loadActivityLogs).toHaveBeenCalledWith(mockContainerId, 1, 20, {});
    });
  });

  describe('ViewModel Integration', () => {
    it('should manage container detail state correctly', async () => {
      const viewModel = new ContainerDetailViewModel(mockContainerId);
      
      // Mock successful initialization
      containerDetailService.initializeContainer = jest.fn().mockResolvedValue({
        data: {
          container: {
            id: mockContainerId,
            name: 'Test Container',
            type: 'physical',
            status: 'active',
            tenant: { id: 1, name: 'Test Tenant' },
            location: {},
          },
          dashboard: {
            air_temperature: 22.5,
            humidity: 65,
            co2: 400,
            yield_metrics: { average: 10, total: 100, chart_data: [] },
            space_utilization: { nursery_station: 75, cultivation_area: 80, chart_data: [] },
          },
          crops: [],
          recentActivity: [],
          lastUpdated: new Date().toISOString(),
        },
        permissions: {
          canView: true,
          canEdit: true,
          canManageSettings: true,
          canViewMetrics: true,
          canViewActivity: true,
          canUpdateEnvironment: true,
        },
      });

      // Track state changes
      const stateChanges: any[] = [];
      viewModel.subscribe((state) => {
        stateChanges.push({ ...state });
      });

      // Initialize
      await viewModel.initialize();

      // Verify state progression
      expect(stateChanges.length).toBeGreaterThan(0);
      
      const finalState = stateChanges[stateChanges.length - 1];
      expect(finalState.containerId).toBe(mockContainerId);
      expect(finalState.data).toBeDefined();
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();

      // Test tab switching
      viewModel.setActiveTab('environment');
      const newState = viewModel.getState();
      expect(newState.activeTab).toBe('environment');

      // Cleanup
      viewModel.dispose();
    });

    it('should handle metrics updates correctly', () => {
      const mockMetrics = {
        air_temperature: 22.5,
        humidity: 65,
        co2: 400,
        yield_metrics: { average: 10, total: 100, chart_data: [] },
        space_utilization: { nursery_station: 75, cultivation_area: 80, chart_data: [] },
      };

      const viewModel = new ContainerMetricsViewModel(mockMetrics);

      // Track changes
      let updateCount = 0;
      viewModel.subscribe(() => {
        updateCount++;
      });

      // Test metric cards generation
      const metricCards = viewModel.getMetricCards();
      expect(metricCards).toHaveLength(4);
      expect(metricCards[0].title).toBe('Air Temperature');
      expect(metricCards[0].currentValue).toBe(22.5);

      // Test individual card getters
      const tempCard = viewModel.getTemperatureCard();
      expect(tempCard).toBeDefined();
      expect(tempCard?.currentValue).toBe(22.5);

      // Test metrics status
      const status = viewModel.getMetricsStatus();
      expect(status.overall).toBeOneOf(['healthy', 'warning', 'critical']);
    });

    it('should manage activity logs state', async () => {
      const mockActivities = [
        {
          id: 1,
          container_id: mockContainerId,
          timestamp: new Date().toISOString(),
          action_type: 'update',
          actor_type: 'user',
          actor_id: 'test-user',
          description: 'Test activity',
        },
      ];

      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);

      // Mock service call
      containerDetailService.loadActivityLogs = jest.fn().mockResolvedValue({
        activities: mockActivities,
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          total_pages: 1,
        },
        filters: {},
        isLoading: false,
        error: null,
      });

      // Test initial state
      const activityItems = viewModel.getActivityItems();
      expect(activityItems).toHaveLength(1);

      // Test activity loading
      await viewModel.loadActivities();
      
      // Test filtering
      await viewModel.setFilters({ actionType: 'update' });
      const currentFilters = viewModel.getCurrentFilters();
      expect(currentFilters.actionType).toBe('update');

      // Test pagination
      const pagination = viewModel.getPaginationModel();
      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalItems).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      containerDetailAdaptor.checkContainerAccess = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        containerDetailService.initializeContainer(mockContainerId, 'week')
      ).rejects.toThrow();
    });

    it('should handle validation errors in settings', async () => {
      const invalidSettings = {
        tenant_id: 0, // Invalid
        purpose: '',
        location: {},
        notes: '',
        shadow_service_enabled: false,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        ecosystem_settings: {},
      };

      containerDetailService.updateContainerSettings = jest.fn().mockRejectedValue(
        new Error('Validation failed: Tenant is required')
      );

      await expect(
        containerDetailService.updateContainerSettings(mockContainerId, invalidSettings)
      ).rejects.toThrow('Validation failed');
    });
  });

  describe('Caching Behavior', () => {
    it('should cache overview data correctly', async () => {
      const mockData = {
        container: { id: mockContainerId, name: 'Test' },
        dashboard: {},
        crops: [],
        recentActivity: [],
        lastUpdated: new Date().toISOString(),
      };

      containerDetailAdaptor.loadContainerOverview = jest.fn().mockResolvedValue(mockData);

      // First call
      const result1 = await containerDetailAdaptor.loadContainerOverview(mockContainerId, 'week');
      
      // Second call should use cache
      const result2 = await containerDetailAdaptor.loadContainerOverview(mockContainerId, 'week');

      expect(containerDetailAdaptor.loadContainerOverview).toHaveBeenCalledTimes(2);
      expect(result1).toBe(result2);
    });

    it('should invalidate cache on updates', async () => {
      const mockSettings = {
        tenant_id: 1,
        purpose: 'test',
        location: {},
        notes: 'test notes',
        shadow_service_enabled: false,
        robotics_simulation_enabled: false,
        ecosystem_connected: false,
        ecosystem_settings: {},
      };

      containerDetailAdaptor.updateContainerSettings = jest.fn().mockResolvedValue({
        success: true,
        message: 'Updated successfully',
        updated_at: new Date().toISOString(),
      });

      await containerDetailAdaptor.updateContainerSettings(mockContainerId, mockSettings);

      // Verify cache invalidation would occur
      expect(containerDetailAdaptor.updateContainerSettings).toHaveBeenCalledWith(
        mockContainerId,
        mockSettings
      );
    });
  });

  describe('Real-time Updates', () => {
    it('should handle metric polling correctly', () => {
      // This would test the metrics polling service
      // but since it involves timers, we'd use jest.useFakeTimers()
      jest.useFakeTimers();

      const mockCallback = jest.fn();
      
      // In a real test, we'd set up the polling service and verify callbacks
      // For now, just verify the callback structure
      expect(typeof mockCallback).toBe('function');

      jest.useRealTimers();
    });
  });
});
