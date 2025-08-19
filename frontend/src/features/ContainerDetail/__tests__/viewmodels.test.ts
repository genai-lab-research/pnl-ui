// Container Detail ViewModels Unit Tests
import { ContainerDetailViewModel } from '../viewmodels/ContainerDetailViewModel';
import { ContainerMetricsViewModel } from '../viewmodels/ContainerMetricsViewModel';
import { ContainerActivityViewModel } from '../viewmodels/ContainerActivityViewModel';
import { ContainerSettingsViewModel } from '../viewmodels/ContainerSettingsViewModel';
import { ContainerHeaderViewModel } from '../viewmodels/ContainerHeaderViewModel';

// Mock services
jest.mock('../services/containerDetailService');

describe('Container Detail ViewModels', () => {
  describe('ContainerDetailViewModel', () => {
    const mockContainerId = 123;

    it('should initialize with correct default state', () => {
      const viewModel = new ContainerDetailViewModel(mockContainerId);
      const state = viewModel.getState();

      expect(state.containerId).toBe(mockContainerId);
      expect(state.activeTab).toBe('overview');
      expect(state.timeRange).toBe('week');
      expect(state.data).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should update active tab correctly', () => {
      const viewModel = new ContainerDetailViewModel(mockContainerId);
      
      viewModel.setActiveTab('environment');
      const state = viewModel.getState();
      
      expect(state.activeTab).toBe('environment');
    });

    it('should validate tab values', () => {
      const viewModel = new ContainerDetailViewModel(mockContainerId);
      
      // Invalid tab should be ignored
      viewModel.setActiveTab('invalid-tab');
      const state = viewModel.getState();
      
      expect(state.activeTab).toBe('overview'); // Should remain unchanged
    });

    it('should notify subscribers of state changes', () => {
      const viewModel = new ContainerDetailViewModel(mockContainerId);
      const mockListener = jest.fn();
      
      const unsubscribe = viewModel.subscribe(mockListener);
      
      viewModel.setActiveTab('environment');
      
      expect(mockListener).toHaveBeenCalled();
      
      unsubscribe();
    });

    it('should cleanup resources on dispose', () => {
      const viewModel = new ContainerDetailViewModel(mockContainerId);
      const mockListener = jest.fn();
      
      viewModel.subscribe(mockListener);
      viewModel.dispose();
      
      // After dispose, listener should not be called
      viewModel.setActiveTab('environment');
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('ContainerMetricsViewModel', () => {
    const mockMetrics = {
      air_temperature: 22.5,
      humidity: 65,
      co2: 400,
      yield_metrics: {
        average: 10,
        total: 100,
        chart_data: [
          { date: '2024-01-01', value: 95, is_current_period: false, is_future: false },
          { date: '2024-01-02', value: 105, is_current_period: true, is_future: false },
        ],
      },
      space_utilization: {
        nursery_station: 75,
        cultivation_area: 80,
        chart_data: [
          { 
            date: '2024-01-01', 
            nursery_value: 70, 
            cultivation_value: 75,
            is_current_period: false, 
            is_future: false 
          },
          { 
            date: '2024-01-02', 
            nursery_value: 75, 
            cultivation_value: 80,
            is_current_period: true, 
            is_future: false 
          },
        ],
      },
    };

    it('should initialize with metrics data', () => {
      const viewModel = new ContainerMetricsViewModel(mockMetrics);
      const metricCards = viewModel.getMetricCards();

      expect(metricCards).toHaveLength(4);
      expect(metricCards[0].title).toBe('Air Temperature');
      expect(metricCards[0].currentValue).toBe(22.5);
    });

    it('should provide individual metric card data', () => {
      const viewModel = new ContainerMetricsViewModel(mockMetrics);

      const tempCard = viewModel.getTemperatureCard();
      expect(tempCard).toBeDefined();
      expect(tempCard?.currentValue).toBe(22.5);
      expect(tempCard?.unit).toBe('°C');

      const humidityCard = viewModel.getHumidityCard();
      expect(humidityCard?.currentValue).toBe(65);
      expect(humidityCard?.unit).toBe('%');

      const co2Card = viewModel.getCO2Card();
      expect(co2Card?.currentValue).toBe(400);
      expect(co2Card?.unit).toBe('ppm');

      const yieldCard = viewModel.getYieldCard();
      expect(yieldCard?.currentValue).toBe(100);
      expect(yieldCard?.unit).toBe('kg');
    });

    it('should transform chart data correctly', () => {
      const viewModel = new ContainerMetricsViewModel(mockMetrics);

      const yieldChartData = viewModel.getYieldChartData();
      expect(yieldChartData).toHaveLength(2);
      expect(yieldChartData[0].value).toBe(95);
      expect(yieldChartData[1].isCurrentPeriod).toBe(true);

      const utilizationChartData = viewModel.getUtilizationChartData();
      expect(utilizationChartData).toHaveLength(2);
      expect(utilizationChartData[0].nursery).toBe(70);
      expect(utilizationChartData[1].cultivation).toBe(80);
    });

    it('should calculate metrics status correctly', () => {
      const viewModel = new ContainerMetricsViewModel(mockMetrics);
      const status = viewModel.getMetricsStatus();

      expect(status.overall).toBeOneOf(['healthy', 'warning', 'critical']);
      expect(Array.isArray(status.issues)).toBe(true);
      expect(Array.isArray(status.recommendations)).toBe(true);
    });

    it('should provide utilization summary', () => {
      const viewModel = new ContainerMetricsViewModel(mockMetrics);
      const summary = viewModel.getUtilizationSummary();

      expect(summary).toBeDefined();
      expect(summary?.nurseryStation.value).toBe(75);
      expect(summary?.cultivationArea.value).toBe(80);
      expect(summary?.total.value).toBe(77.5); // Average of 75 and 80
    });

    it('should handle time range changes', () => {
      const viewModel = new ContainerMetricsViewModel(mockMetrics);
      let notificationCount = 0;
      
      viewModel.subscribe(() => {
        notificationCount++;
      });

      viewModel.setTimeRange('month');
      
      expect(notificationCount).toBe(1);
      
      const options = viewModel.getTimeRangeOptions();
      const monthOption = options.find(opt => opt.value === 'month');
      expect(monthOption?.active).toBe(true);
    });
  });

  describe('ContainerActivityViewModel', () => {
    const mockContainerId = 123;
    const mockActivities = [
      {
        id: 1,
        container_id: mockContainerId,
        timestamp: '2024-01-01T10:00:00Z',
        action_type: 'update',
        actor_type: 'user',
        actor_id: 'test-user',
        description: 'Updated container settings',
      },
      {
        id: 2,
        container_id: mockContainerId,
        timestamp: '2024-01-01T09:00:00Z',
        action_type: 'create',
        actor_type: 'system',
        actor_id: 'system',
        description: 'Container created',
      },
    ];

    it('should initialize with activity data', () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      const activityItems = viewModel.getActivityItems();

      expect(activityItems).toHaveLength(2);
      expect(activityItems[0].title).toBe('Updated container settings');
    });

    it('should group activities by date', () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      const groupedActivities = viewModel.getGroupedActivities();

      expect(groupedActivities).toHaveLength(1); // Same date
      expect(groupedActivities[0].activities).toHaveLength(2);
    });

    it('should filter recent activities', () => {
      // Create activities with recent timestamps
      const recentActivities = [
        {
          ...mockActivities[0],
          timestamp: new Date().toISOString(), // Now
        },
        {
          ...mockActivities[1],
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
      ];

      const viewModel = new ContainerActivityViewModel(mockContainerId, recentActivities);
      const recent = viewModel.getRecentActivities();

      expect(recent).toHaveLength(1); // Only activities from last 24 hours
    });

    it('should provide activity summary by type', () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      const summary = viewModel.getActivitySummary();

      expect(summary).toHaveLength(2); // Two different action types
      expect(summary[0].count).toBe(1);
      expect(summary[0].percentage).toBe(50);
    });

    it('should handle pagination correctly', () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      const pagination = viewModel.getPaginationModel();

      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalItems).toBe(2);
      expect(typeof pagination.onPageChange).toBe('function');
    });

    it('should manage filter state', async () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      
      // Mock the loadActivities method since it calls the service
      viewModel.loadActivities = jest.fn().mockResolvedValue(undefined);

      await viewModel.setFilters({ actionType: 'update' });
      
      const currentFilters = viewModel.getCurrentFilters();
      expect(currentFilters.actionType).toBe('update');
      expect(viewModel.hasActiveFilters()).toBe(true);
    });

    it('should provide filter options from data', () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      const filterOptions = viewModel.getFilterOptions();

      expect(filterOptions.actionTypes).toContain('update');
      expect(filterOptions.actionTypes).toContain('create');
      expect(filterOptions.actorTypes).toContain('user');
      expect(filterOptions.actorTypes).toContain('system');
      expect(filterOptions.dateRanges).toHaveLength(3);
    });

    it('should calculate activity statistics', () => {
      const viewModel = new ContainerActivityViewModel(mockContainerId, mockActivities);
      const stats = viewModel.getActivityStats();

      expect(stats.total).toBe(2);
      expect(stats.today).toBe(0); // Mock activities are from 2024-01-01
      expect(typeof stats.averagePerDay).toBe('number');
    });
  });

  describe('ContainerSettingsViewModel', () => {
    const mockContainerId = 123;
    const mockContainerInfo = {
      id: mockContainerId,
      name: 'Test Container',
      type: 'physical',
      status: 'active',
      tenant: { id: 1, name: 'Test Tenant' },
      location: { city: 'Test City', country: 'Test Country' },
    };

    it('should initialize with container info', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);
      const settings = viewModel.getSettings();

      expect(settings.tenant_id).toBe(1);
      expect(settings.location).toEqual(mockContainerInfo.location);
    });

    it('should manage edit mode state', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);

      expect(viewModel.isEditing()).toBe(false);

      viewModel.startEditing();
      expect(viewModel.isEditing()).toBe(true);

      viewModel.cancelEditing();
      expect(viewModel.isEditing()).toBe(false);
    });

    it('should track unsaved changes', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);

      expect(viewModel.hasUnsavedChanges()).toBe(false);

      viewModel.startEditing();
      viewModel.updateSetting('notes', 'Test notes');
      
      expect(viewModel.hasUnsavedChanges()).toBe(true);
    });

    it('should provide field props for form binding', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);
      const fieldProps = viewModel.getFieldProps('notes');

      expect(fieldProps).toHaveProperty('value');
      expect(fieldProps).toHaveProperty('onChange');
      expect(fieldProps).toHaveProperty('error');
      expect(fieldProps).toHaveProperty('disabled');
      expect(typeof fieldProps.onChange).toBe('function');
    });

    it('should validate settings on update', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);

      viewModel.startEditing();
      viewModel.updateSetting('tenant_id', 0); // Invalid

      const errors = viewModel.getValidationErrors();
      expect(errors).toHaveProperty('tenant_id');
    });

    it('should provide container info model', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);
      const infoModel = viewModel.getContainerInfoModel();

      expect(infoModel).toBeDefined();
      expect(infoModel?.basicInfo).toHaveLength(6);
      expect(infoModel?.isEditMode).toBe(false);
      expect(typeof infoModel?.onToggleEdit).toBe('function');
    });

    it('should provide form actions', () => {
      const viewModel = new ContainerSettingsViewModel(mockContainerId, mockContainerInfo);
      const actions = viewModel.getFormActions();

      expect(actions).toHaveProperty('canSave');
      expect(actions).toHaveProperty('canCancel');
      expect(actions).toHaveProperty('canEdit');
      expect(typeof actions.onSave).toBe('function');
      expect(typeof actions.onCancel).toBe('function');
      expect(typeof actions.onEdit).toBe('function');
    });
  });

  describe('ContainerHeaderViewModel', () => {
    const mockContainerInfo = {
      id: 123,
      name: 'Test Container',
      type: 'physical',
      status: 'active',
      tenant: { id: 1, name: 'Test Tenant' },
      location: { city: 'Test City', country: 'Test Country' },
    };

    it('should initialize with container info', () => {
      const viewModel = new ContainerHeaderViewModel(mockContainerInfo);

      expect(viewModel.hasContainerData()).toBe(true);
      expect(viewModel.getContainerTitle()).toBe('Test Container');
    });

    it('should provide navigation model', () => {
      const viewModel = new ContainerHeaderViewModel(mockContainerInfo);
      const navigationModel = viewModel.getNavigationModel();

      expect(navigationModel).toBeDefined();
      expect(navigationModel?.containerId).toBe(123);
      expect(navigationModel?.containerName).toBe('Test Container');
      expect(typeof navigationModel?.onNavigateBack).toBe('function');
    });

    it('should provide header model', () => {
      const viewModel = new ContainerHeaderViewModel(mockContainerInfo);
      const headerModel = viewModel.getHeaderModel();

      expect(headerModel).toBeDefined();
      expect(headerModel?.containerInfo.name).toBe('Test Container');
      expect(headerModel?.containerInfo.type).toBe('physical');
      expect(headerModel?.statusVariant).toBe('active');
    });

    it('should format container subtitle correctly', () => {
      const viewModel = new ContainerHeaderViewModel(mockContainerInfo);
      const subtitle = viewModel.getContainerSubtitle();

      expect(subtitle).toContain('Physical Container');
      expect(subtitle).toContain('Test Tenant');
      expect(subtitle).toContain('Test City, Test Country');
    });

    it('should provide status badge', () => {
      const viewModel = new ContainerHeaderViewModel(mockContainerInfo);
      const statusBadge = viewModel.getStatusBadge();

      expect(statusBadge).toBeDefined();
      expect(statusBadge?.text).toBe('Active');
      expect(statusBadge?.variant).toBe('active');
    });

    it('should provide container metadata', () => {
      const viewModel = new ContainerHeaderViewModel(mockContainerInfo);
      const metadata = viewModel.getContainerMetadata();

      expect(metadata).toHaveLength(4); // ID, Type, Tenant, Location
      expect(metadata[0].label).toBe('Container ID');
      expect(metadata[0].value).toBe('123');
    });

    it('should handle empty container info', () => {
      const viewModel = new ContainerHeaderViewModel();

      expect(viewModel.hasContainerData()).toBe(false);
      expect(viewModel.isLoading()).toBe(true);
      expect(viewModel.getNavigationModel()).toBeNull();
    });

    it('should notify listeners on updates', () => {
      const viewModel = new ContainerHeaderViewModel();
      const mockListener = jest.fn();

      viewModel.subscribe(mockListener);
      viewModel.updateContainerInfo(mockContainerInfo);

      expect(mockListener).toHaveBeenCalled();
    });
  });
});
