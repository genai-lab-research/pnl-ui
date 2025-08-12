/**
 * Tests for ContainerDetailModel domain logic
 */

import { ContainerDetailModel } from '../models/ContainerDetailModel';
import type { 
  CropSummaryRow, 
  ActivityLogEntry, 
  DashboardMetrics,
  ContainerSettings,
  ContainerInfo
} from '../types/container-detail';
import type { MetricSnapshot } from '../types/metrics';

describe('ContainerDetailModel', () => {
  // Mock data
  const mockMetrics: DashboardMetrics = {
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
  };

  const mockCrops: CropSummaryRow[] = [
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
    {
      id: 'crop-2',
      seedType: 'Tomato',
      nurseryStationCount: 50,
      cultivationAreaCount: 150,
      lastSeedingDate: new Date('2024-01-05'),
      lastTransplantingDate: new Date('2024-01-20'),
      lastHarvestingDate: null,
      averageAge: 25,
      overdueCount: 0,
    },
  ];

  const mockActivities: ActivityLogEntry[] = [
    {
      id: 1,
      containerId: 123,
      timestamp: new Date('2024-01-15T10:00:00'),
      actionType: 'container_updated',
      actorType: 'user',
      actorId: 'user-1',
      description: 'Updated container settings',
    },
    {
      id: 2,
      containerId: 123,
      timestamp: new Date('2024-01-15T14:00:00'),
      actionType: 'metric_recorded',
      actorType: 'system',
      actorId: 'system',
      description: 'Recorded environmental metrics',
    },
    {
      id: 3,
      containerId: 123,
      timestamp: new Date('2024-01-16T09:00:00'),
      actionType: 'crop_seeded',
      actorType: 'user',
      actorId: 'user-2',
      description: 'Seeded new batch of lettuce',
    },
  ];

  describe('Metric Calculations', () => {
    it('should calculate metric trends correctly', () => {
      const previousMetrics: DashboardMetrics = {
        ...mockMetrics,
        airTemperature: 22.0,
        humidity: 60,
        co2: 750,
        yield: { ...mockMetrics.yield, total: 140 },
      };

      const trends = ContainerDetailModel.calculateMetricTrends(mockMetrics, previousMetrics);

      expect(trends.get('airTemperature')).toMatchObject({
        currentValue: 23.5,
        previousValue: 22.0,
        trend: 'up',
        changePercentage: 6.8, // (23.5 - 22.0) / 22.0 * 100
      });

      expect(trends.get('humidity')).toMatchObject({
        currentValue: 55,
        previousValue: 60,
        trend: 'down',
        changePercentage: -8.3,
      });

      expect(trends.get('yield')).toMatchObject({
        currentValue: 150,
        previousValue: 140,
        trend: 'up',
        changePercentage: 7.1,
      });
    });

    it('should check metric thresholds', () => {
      const results = ContainerDetailModel.checkMetricThresholds(mockMetrics);

      expect(results.get('airTemperature')).toBe(true); // 23.5 is within 18-28
      expect(results.get('humidity')).toBe(true); // 55 is within 40-70
      expect(results.get('co2')).toBe(true); // 800 is within 400-1200

      // Test out of range values
      const badMetrics: DashboardMetrics = {
        ...mockMetrics,
        airTemperature: 35, // Too high
        humidity: 20, // Too low
        co2: 1500, // Too high
      };

      const badResults = ContainerDetailModel.checkMetricThresholds(badMetrics);
      expect(badResults.get('airTemperature')).toBe(false);
      expect(badResults.get('humidity')).toBe(false);
      expect(badResults.get('co2')).toBe(false);
    });

    it('should calculate health score based on metrics', () => {
      // Good metrics
      const goodScore = ContainerDetailModel.calculateHealthScore(mockMetrics);
      expect(goodScore).toBe(100); // All metrics within range

      // Bad metrics
      const badMetrics: DashboardMetrics = {
        ...mockMetrics,
        airTemperature: 35, // -20 points
        humidity: 20, // -20 points
        spaceUtilization: {
          nurseryStation: 95, // Over-utilized -5 points
          cultivationArea: 95,
          chartData: [],
        },
      };
      const badScore = ContainerDetailModel.calculateHealthScore(badMetrics);
      expect(badScore).toBe(55); // 100 - 20 - 20 - 5
    });

    it('should calculate average metrics from snapshots', () => {
      const snapshots: MetricSnapshot[] = [
        {
          id: 1,
          containerId: 123,
          timestamp: new Date(),
          airTemperature: 22,
          humidity: 50,
          co2: 750,
          yieldKg: 2.0,
          spaceUtilizationPct: 70,
        },
        {
          id: 2,
          containerId: 123,
          timestamp: new Date(),
          airTemperature: 24,
          humidity: 60,
          co2: 850,
          yieldKg: 3.0,
          spaceUtilizationPct: 80,
        },
      ];

      const averages = ContainerDetailModel.calculateAverageMetrics(snapshots);
      
      expect(averages).toEqual({
        airTemperature: 23,
        humidity: 55,
        co2: 800,
        yieldKg: 2.5,
        spaceUtilizationPct: 75,
      });
    });
  });

  describe('Crop Calculations', () => {
    it('should calculate total crop count', () => {
      const total = ContainerDetailModel.calculateTotalCropCount(mockCrops);
      expect(total).toBe(500); // 100 + 200 + 50 + 150
    });

    it('should calculate total overdue crops', () => {
      const overdue = ContainerDetailModel.calculateTotalOverdueCrops(mockCrops);
      expect(overdue).toBe(5);
    });

    it('should get crops needing attention', () => {
      const needingAttention = ContainerDetailModel.getCropsNeedingAttention(mockCrops);
      expect(needingAttention).toHaveLength(1);
      expect(needingAttention[0].seedType).toBe('Lettuce');
    });
  });

  describe('Activity Management', () => {
    it('should group activities by date', () => {
      const grouped = ContainerDetailModel.groupActivitiesByDate(mockActivities);
      
      expect(grouped.size).toBe(2); // Two different dates
      expect(grouped.get('Sun Jan 15 2024')).toHaveLength(2);
      expect(grouped.get('Mon Jan 16 2024')).toHaveLength(1);
    });

    it('should filter activities by time range', () => {
      const startDate = new Date('2024-01-15T12:00:00');
      const endDate = new Date('2024-01-16T00:00:00');
      
      const filtered = ContainerDetailModel.filterActivitiesByTimeRange(
        mockActivities,
        startDate,
        endDate
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(2);
    });

    it('should calculate days since last activity', () => {
      const now = new Date();
      const recentActivity: ActivityLogEntry = {
        ...mockActivities[0],
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      };
      
      const days = ContainerDetailModel.daysSinceLastActivity([recentActivity]);
      expect(days).toBe(3);
    });

    it('should format activity description', () => {
      const formatted = ContainerDetailModel.formatActivityDescription(mockActivities[0]);
      expect(formatted).toBe('User user-1: Updated container settings');
      
      const systemFormatted = ContainerDetailModel.formatActivityDescription(mockActivities[1]);
      expect(systemFormatted).toBe('System: Recorded environmental metrics');
    });
  });

  describe('Validation', () => {
    it('should validate container settings', () => {
      const validSettings: Partial<ContainerSettings> = {
        tenantId: 1,
        purpose: 'production',
        location: { city: 'SF', country: 'USA', address: '123 Main' },
        notes: 'Valid notes',
      };
      
      const errors = ContainerDetailModel.validateContainerSettings(validSettings);
      expect(errors).toHaveLength(0);
    });

    it('should detect invalid container settings', () => {
      const invalidSettings: Partial<ContainerSettings> = {
        tenantId: -1,
        purpose: 'invalid' as ContainerPurpose,
        location: { city: '', country: 'USA', address: '' },
        notes: 'a'.repeat(1001),
      };
      
      const errors = ContainerDetailModel.validateContainerSettings(invalidSettings);
      expect(errors).toContain('Invalid tenant ID');
      expect(errors).toContain('Invalid container purpose');
      expect(errors).toContain('Location must include city and country');
      expect(errors).toContain('Notes cannot exceed 1000 characters');
    });
  });

  describe('Status Helpers', () => {
    it('should get container status color based on health', () => {
      const container: ContainerInfo = {
        id: 1,
        name: 'Test',
        type: 'physical',
        tenant: { id: 1, name: 'Test' },
        location: { city: 'SF', country: 'USA', address: '123' },
        status: 'active',
      };
      
      expect(ContainerDetailModel.getContainerStatusColor(container, 90)).toBe('green');
      expect(ContainerDetailModel.getContainerStatusColor(container, 70)).toBe('yellow');
      expect(ContainerDetailModel.getContainerStatusColor(container, 50)).toBe('red');
      
      container.status = 'inactive';
      expect(ContainerDetailModel.getContainerStatusColor(container, 90)).toBe('gray');
      
      container.status = 'maintenance';
      expect(ContainerDetailModel.getContainerStatusColor(container, 90)).toBe('orange');
    });
  });
});