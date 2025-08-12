/**
 * Tests for ContainerDetailViewModel
 */

import { ContainerDetailViewModel } from '../viewmodels/ContainerDetailViewModel';
import { containerDetailService } from '../services/containerDetailService';
import type { ContainerDetailData, ContainerSettings } from '../types/container-detail';

// Mock the service
jest.mock('../services/containerDetailService');

describe('ContainerDetailViewModel', () => {
  let viewModel: ContainerDetailViewModel;
  const mockContainerId = 123;

  // Mock data
  const mockContainerData: ContainerDetailData = {
    container: {
      id: mockContainerId,
      name: 'Test Container',
      type: 'physical',
      tenant: { id: 1, name: 'Test Tenant' },
      location: { city: 'San Francisco', country: 'USA', address: '123 Test St' },
      status: 'active',
    },
    dashboardMetrics: {
      airTemperature: 23.5,
      humidity: 55,
      co2: 800,
      yield: {
        average: 2.5,
        total: 150,
        chartData: [],
      },
      spaceUtilization: {
        nurseryStation: 75,
        cultivationArea: 80,
        chartData: [],
      },
    },
    cropsSummary: [
      {
        id: 'crop-1',
        seedType: 'Lettuce',
        nurseryStationCount: 100,
        cultivationAreaCount: 200,
        lastSeedingDate: new Date('2024-01-01'),
        lastTransplantingDate: new Date('2024-01-15'),
        lastHarvestingDate: new Date('2024-02-01'),
        averageAge: 30,
        overdueCount: 5,
      },
    ],
    recentActivity: [
      {
        id: 1,
        containerId: mockContainerId,
        timestamp: new Date(),
        actionType: 'container_updated',
        actorType: 'user',
        actorId: 'user-1',
        description: 'Container settings updated',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    viewModel = new ContainerDetailViewModel(mockContainerId);
  });

  afterEach(() => {
    viewModel.dispose();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      expect(viewModel.containerData).toBeNull();
      expect(viewModel.pageState.activeTab).toBe('overview');
      expect(viewModel.pageState.selectedTimePeriod).toBe('week');
      expect(viewModel.loadingState.container).toBe(false);
      expect(viewModel.error).toBeNull();
    });

    it('should load all required data on initialize', async () => {
      const mockGetOverview = jest.fn().mockResolvedValue(mockContainerData);
      const mockGetSummary = jest.fn().mockResolvedValue({
        currentMetrics: {
          airTemperature: 23.5,
          humidity: 55,
          co2: 800,
          yieldKg: 2.5,
          spaceUtilizationPct: 77.5,
        },
        cropCounts: {
          totalCrops: 300,
          nurseryCrops: 100,
          cultivationCrops: 200,
          overdueCrops: 5,
        },
        activityCount: 10,
        lastUpdated: new Date(),
      });
      const mockGetSnapshots = jest.fn().mockResolvedValue([]);
      const mockGetLinks = jest.fn().mockResolvedValue({});

      (containerDetailService.getContainerOverview as jest.Mock) = mockGetOverview;
      (containerDetailService.getDashboardSummary as jest.Mock) = mockGetSummary;
      (containerDetailService.getMetricSnapshots as jest.Mock) = mockGetSnapshots;
      (containerDetailService.getEnvironmentLinks as jest.Mock) = mockGetLinks;

      await viewModel.initialize();

      expect(mockGetOverview).toHaveBeenCalledWith(mockContainerId, 'week', 'day');
      expect(mockGetSummary).toHaveBeenCalledWith(mockContainerId);
      expect(mockGetSnapshots).toHaveBeenCalled();
      expect(mockGetLinks).toHaveBeenCalledWith(mockContainerId);
    });
  });

  describe('Data Loading', () => {
    it('should load container data successfully', async () => {
      const mockGetOverview = jest.fn().mockResolvedValue(mockContainerData);
      (containerDetailService.getContainerOverview as jest.Mock) = mockGetOverview;

      await viewModel.loadContainerData();

      expect(viewModel.containerData).toEqual(mockContainerData);
      expect(viewModel.loadingState.container).toBe(false);
      expect(viewModel.error).toBeNull();
    });

    it('should handle errors when loading container data', async () => {
      const mockError = new Error('Failed to load');
      const mockGetOverview = jest.fn().mockRejectedValue(mockError);
      (containerDetailService.getContainerOverview as jest.Mock) = mockGetOverview;

      await viewModel.loadContainerData();

      expect(viewModel.containerData).toBeNull();
      expect(viewModel.loadingState.container).toBe(false);
      expect(viewModel.error).toEqual({
        code: 'LOAD_ERROR',
        message: 'Failed to load container data',
      });
    });
  });

  describe('Settings Management', () => {
    it('should update container settings successfully', async () => {
      const mockSettings: Partial<ContainerSettings> = {
        notes: 'Updated notes',
        shadowServiceEnabled: true,
      };

      const mockUpdate = jest.fn().mockResolvedValue({
        success: true,
        message: 'Settings updated',
        updatedAt: new Date(),
      });
      const mockCreateLog = jest.fn().mockResolvedValue({});
      const mockGetOverview = jest.fn().mockResolvedValue(mockContainerData);

      (containerDetailService.updateContainerSettings as jest.Mock) = mockUpdate;
      (containerDetailService.createActivityLog as jest.Mock) = mockCreateLog;
      (containerDetailService.getContainerOverview as jest.Mock) = mockGetOverview;

      viewModel.pageState.isSettingsEditMode = true;
      await viewModel.updateContainerSettings(mockSettings);

      expect(mockUpdate).toHaveBeenCalledWith(mockContainerId, mockSettings);
      expect(mockCreateLog).toHaveBeenCalledWith(
        mockContainerId,
        'settings_changed',
        'Container settings updated'
      );
      expect(viewModel.pageState.isSettingsEditMode).toBe(false);
    });
  });

  describe('Activity Management', () => {
    it('should load more activities with pagination', async () => {
      const mockActivities = [
        {
          id: 2,
          containerId: mockContainerId,
          timestamp: new Date(),
          actionType: 'metric_recorded',
          actorType: 'system',
          actorId: 'system',
          description: 'Metrics recorded',
        },
      ];

      const mockGetLogs = jest.fn().mockResolvedValue({
        activities: mockActivities,
        hasMore: true,
        total: 50,
      });

      (containerDetailService.getActivityLogs as jest.Mock) = mockGetLogs;

      await viewModel.loadMoreActivities();

      expect(mockGetLogs).toHaveBeenCalledWith(mockContainerId, 1, 20);
      expect(viewModel.activities).toEqual(mockActivities);
      expect(viewModel.pageState.hasMoreActivities).toBe(true);
      expect(viewModel.pageState.activityPage).toBe(2);
    });
  });

  describe('UI State Management', () => {
    it('should change active tab', () => {
      viewModel.setActiveTab('environment');
      expect(viewModel.pageState.activeTab).toBe('environment');
    });

    it('should change time period and reload data', async () => {
      const mockGetOverview = jest.fn().mockResolvedValue(mockContainerData);
      const mockGetSnapshots = jest.fn().mockResolvedValue([]);

      (containerDetailService.getContainerOverview as jest.Mock) = mockGetOverview;
      (containerDetailService.getMetricSnapshots as jest.Mock) = mockGetSnapshots;

      viewModel.setTimePeriod('month');

      expect(viewModel.pageState.selectedTimePeriod).toBe('month');
      expect(mockGetOverview).toHaveBeenCalledWith(mockContainerId, 'month', 'day');
    });

    it('should toggle settings edit mode', () => {
      expect(viewModel.pageState.isSettingsEditMode).toBe(false);
      viewModel.toggleSettingsEditMode();
      expect(viewModel.pageState.isSettingsEditMode).toBe(true);
      viewModel.toggleSettingsEditMode();
      expect(viewModel.pageState.isSettingsEditMode).toBe(false);
    });
  });

  describe('Computed Values', () => {
    it('should calculate isLoading correctly', () => {
      expect(viewModel.isLoading).toBe(false);
      
      viewModel.loadingState.container = true;
      expect(viewModel.isLoading).toBe(true);
      
      viewModel.loadingState.container = false;
      viewModel.loadingState.metrics = true;
      expect(viewModel.isLoading).toBe(true);
    });

    it('should combine recent and paginated activities', async () => {
      // Set up initial data with recent activities
      const mockGetOverview = jest.fn().mockResolvedValue(mockContainerData);
      (containerDetailService.getContainerOverview as jest.Mock) = mockGetOverview;
      await viewModel.loadContainerData();

      // Add paginated activities
      const paginatedActivity = {
        id: 2,
        containerId: mockContainerId,
        timestamp: new Date(),
        actionType: 'metric_recorded' as const,
        actorType: 'system' as const,
        actorId: 'system',
        description: 'Metrics recorded',
      };

      viewModel.activities = [paginatedActivity];

      const allActivities = viewModel.allActivities;
      expect(allActivities).toHaveLength(2);
      expect(allActivities[0]).toEqual(mockContainerData.recentActivity[0]);
      expect(allActivities[1]).toEqual(paginatedActivity);
    });
  });

  describe('Polling Management', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start and stop metrics polling', () => {
      const mockGetSummary = jest.fn().mockResolvedValue({});
      const mockGetSnapshots = jest.fn().mockResolvedValue([]);

      (containerDetailService.getDashboardSummary as jest.Mock) = mockGetSummary;
      (containerDetailService.getMetricSnapshots as jest.Mock) = mockGetSnapshots;

      viewModel.startMetricsPolling();
      expect(mockGetSummary).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(30000);
      expect(mockGetSummary).toHaveBeenCalledTimes(2);

      viewModel.stopMetricsPolling();
      jest.advanceTimersByTime(30000);
      expect(mockGetSummary).toHaveBeenCalledTimes(2); // No additional calls
    });
  });
});