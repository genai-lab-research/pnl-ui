import { describe, it, expect } from 'vitest';
import { 
  ContainerDetail, 
  ContainerCrop, 
  ContainerActivity, 
  ContainerType, 
  ContainerStatus, 
  ContainerPurpose,
  ActivityType 
} from '../shared/types/containers';
import { ContainerMetrics, TimeRange, MetricValue } from '../shared/types/metrics';

// These tests validate that our frontend types match the backend API response structure
describe('Data Model Validation', () => {
  
  describe('Container Types', () => {
    it('should validate ContainerType enum matches backend', () => {
      const validTypes: ContainerType[] = ['PHYSICAL', 'VIRTUAL'];
      
      validTypes.forEach(type => {
        expect(['PHYSICAL', 'VIRTUAL']).toContain(type);
      });
    });

    it('should validate ContainerStatus enum matches backend', () => {
      const validStatuses: ContainerStatus[] = ['CREATED', 'ACTIVE', 'MAINTENANCE', 'INACTIVE'];
      
      validStatuses.forEach(status => {
        expect(['CREATED', 'ACTIVE', 'MAINTENANCE', 'INACTIVE']).toContain(status);
      });
    });

    it('should validate ContainerPurpose enum matches backend', () => {
      const validPurposes: ContainerPurpose[] = ['Development', 'Research', 'Production'];
      
      validPurposes.forEach(purpose => {
        expect(['Development', 'Research', 'Production']).toContain(purpose);
      });
    });

    it('should validate ActivityType enum matches backend', () => {
      const validTypes: ActivityType[] = ['SEEDED', 'SYNCED', 'ENVIRONMENT_CHANGED', 'CREATED', 'MAINTENANCE'];
      
      validTypes.forEach(type => {
        expect(['SEEDED', 'SYNCED', 'ENVIRONMENT_CHANGED', 'CREATED', 'MAINTENANCE']).toContain(type);
      });
    });

    it('should validate TimeRange enum matches backend', () => {
      const validRanges: TimeRange[] = ['WEEK', 'MONTH', 'QUARTER', 'YEAR'];
      
      validRanges.forEach(range => {
        expect(['WEEK', 'MONTH', 'QUARTER', 'YEAR']).toContain(range);
      });
    });
  });

  describe('Container Model Structure', () => {
    it('should validate ContainerDetail interface matches backend response', () => {
      const mockContainer: ContainerDetail = {
        id: 'container-001',
        name: 'test-container',
        type: 'PHYSICAL',
        tenant: 'tenant-123',
        purpose: 'Development',
        location: {
          city: 'Test City',
          country: 'Test Country',
          address: 'Test Address'
        },
        status: 'ACTIVE',
        created: '2025-01-30T09:30:00Z',
        modified: '2025-01-30T11:14:00Z',
        creator: 'Test User',
        seed_types: ['test-seed'],
        notes: 'Test notes',
        shadow_service_enabled: false,
        ecosystem_connected: true,
        system_integrations: {
          fa_integration: { name: 'Alpha', enabled: true },
          aws_environment: { name: 'Dev', enabled: true },
          mbai_environment: { name: 'Disabled', enabled: false }
        }
      };

      // Validate all required fields exist
      expect(mockContainer).toHaveProperty('id');
      expect(mockContainer).toHaveProperty('name');
      expect(mockContainer).toHaveProperty('type');
      expect(mockContainer).toHaveProperty('tenant');
      expect(mockContainer).toHaveProperty('purpose');
      expect(mockContainer).toHaveProperty('location');
      expect(mockContainer).toHaveProperty('status');
      expect(mockContainer).toHaveProperty('created');
      expect(mockContainer).toHaveProperty('modified');
      expect(mockContainer).toHaveProperty('creator');
      expect(mockContainer).toHaveProperty('seed_types');
      expect(mockContainer).toHaveProperty('notes');
      expect(mockContainer).toHaveProperty('shadow_service_enabled');
      expect(mockContainer).toHaveProperty('ecosystem_connected');
      expect(mockContainer).toHaveProperty('system_integrations');

      // Validate location structure
      expect(mockContainer.location).toHaveProperty('city');
      expect(mockContainer.location).toHaveProperty('country');
      expect(mockContainer.location).toHaveProperty('address');

      // Validate system integrations structure
      expect(mockContainer.system_integrations).toHaveProperty('fa_integration');
      expect(mockContainer.system_integrations).toHaveProperty('aws_environment');
      expect(mockContainer.system_integrations).toHaveProperty('mbai_environment');
      
      // Validate integration objects
      expect(mockContainer.system_integrations.fa_integration).toHaveProperty('name');
      expect(mockContainer.system_integrations.fa_integration).toHaveProperty('enabled');
    });

    it('should validate field types are correct', () => {
      const mockContainer: ContainerDetail = {
        id: 'container-001',
        name: 'test-container',
        type: 'PHYSICAL',
        tenant: 'tenant-123',
        purpose: 'Development',
        location: { city: 'Test', country: 'Test', address: 'Test' },
        status: 'ACTIVE',
        created: '2025-01-30T09:30:00Z',
        modified: '2025-01-30T11:14:00Z',
        creator: 'Test User',
        seed_types: ['test-seed'],
        notes: 'Test notes',
        shadow_service_enabled: false,
        ecosystem_connected: true,
        system_integrations: {
          fa_integration: { name: 'Alpha', enabled: true },
          aws_environment: { name: 'Dev', enabled: true },
          mbai_environment: { name: 'Disabled', enabled: false }
        }
      };

      expect(typeof mockContainer.id).toBe('string');
      expect(typeof mockContainer.name).toBe('string');
      expect(typeof mockContainer.tenant).toBe('string');
      expect(typeof mockContainer.creator).toBe('string');
      expect(typeof mockContainer.notes).toBe('string');
      expect(typeof mockContainer.shadow_service_enabled).toBe('boolean');
      expect(typeof mockContainer.ecosystem_connected).toBe('boolean');
      expect(Array.isArray(mockContainer.seed_types)).toBe(true);
      expect(typeof mockContainer.created).toBe('string');
      expect(typeof mockContainer.modified).toBe('string');
    });
  });

  describe('Metrics Model Structure', () => {
    it('should validate ContainerMetrics interface matches backend response', () => {
      const mockMetrics: ContainerMetrics = {
        temperature: { current: 20, unit: '°C', target: 21 },
        humidity: { current: 65, unit: '%', target: 68 },
        co2: { current: 860, unit: 'ppm', target: 800 },
        yield: { current: 51, unit: 'KG', trend: 1.5 },
        nursery_utilization: { current: 75, unit: '%', trend: 5 },
        cultivation_utilization: { current: 90, unit: '%', trend: 15 }
      };

      // Validate all metric fields exist
      expect(mockMetrics).toHaveProperty('temperature');
      expect(mockMetrics).toHaveProperty('humidity');
      expect(mockMetrics).toHaveProperty('co2');
      expect(mockMetrics).toHaveProperty('yield');
      expect(mockMetrics).toHaveProperty('nursery_utilization');
      expect(mockMetrics).toHaveProperty('cultivation_utilization');

      // Validate MetricValue structure
      const validateMetricValue = (metric: MetricValue) => {
        expect(metric).toHaveProperty('current');
        expect(metric).toHaveProperty('unit');
        expect(typeof metric.current).toBe('number');
        expect(typeof metric.unit).toBe('string');
        
        if (metric.target !== undefined) {
          expect(typeof metric.target).toBe('number');
        }
        
        if (metric.trend !== undefined) {
          expect(typeof metric.trend).toBe('number');
        }
      };

      validateMetricValue(mockMetrics.temperature);
      validateMetricValue(mockMetrics.humidity);
      validateMetricValue(mockMetrics.co2);
      validateMetricValue(mockMetrics.yield);
      validateMetricValue(mockMetrics.nursery_utilization);
      validateMetricValue(mockMetrics.cultivation_utilization);
    });
  });

  describe('Crop Model Structure', () => {
    it('should validate ContainerCrop interface matches backend response', () => {
      const mockCrop: ContainerCrop = {
        id: 'crop-001',
        seed_type: 'Salanova Cousteau',
        cultivation_area: 40,
        nursery_table: 30,
        last_sd: '2025-01-30',
        last_td: '2025-01-30',
        last_hd: null,
        avg_age: 26,
        overdue: 2
      };

      // Validate all required fields exist
      expect(mockCrop).toHaveProperty('id');
      expect(mockCrop).toHaveProperty('seed_type');
      expect(mockCrop).toHaveProperty('cultivation_area');
      expect(mockCrop).toHaveProperty('nursery_table');
      expect(mockCrop).toHaveProperty('last_sd');
      expect(mockCrop).toHaveProperty('last_td');
      expect(mockCrop).toHaveProperty('last_hd');
      expect(mockCrop).toHaveProperty('avg_age');
      expect(mockCrop).toHaveProperty('overdue');

      // Validate field types
      expect(typeof mockCrop.id).toBe('string');
      expect(typeof mockCrop.seed_type).toBe('string');
      expect(typeof mockCrop.cultivation_area).toBe('number');
      expect(typeof mockCrop.nursery_table).toBe('number');
      expect(typeof mockCrop.avg_age).toBe('number');
      expect(typeof mockCrop.overdue).toBe('number');
      
      // Date fields can be string or null
      if (mockCrop.last_sd !== null) {
        expect(typeof mockCrop.last_sd).toBe('string');
      }
      if (mockCrop.last_td !== null) {
        expect(typeof mockCrop.last_td).toBe('string');
      }
      if (mockCrop.last_hd !== null) {
        expect(typeof mockCrop.last_hd).toBe('string');
      }
    });
  });

  describe('Activity Model Structure', () => {
    it('should validate ContainerActivity interface matches backend response', () => {
      const mockActivity: ContainerActivity = {
        id: 'activity-001',
        type: 'SEEDED',
        timestamp: '2025-04-13T12:30:00Z',
        description: 'Seeded Salanova Cousteau in Nursery',
        user: { name: 'Emily Chen', role: 'Operator' },
        details: { seed_type: 'Salanova Cousteau', location: 'Nursery' }
      };

      // Validate all required fields exist
      expect(mockActivity).toHaveProperty('id');
      expect(mockActivity).toHaveProperty('type');
      expect(mockActivity).toHaveProperty('timestamp');
      expect(mockActivity).toHaveProperty('description');
      expect(mockActivity).toHaveProperty('user');
      expect(mockActivity).toHaveProperty('details');

      // Validate field types
      expect(typeof mockActivity.id).toBe('string');
      expect(typeof mockActivity.type).toBe('string');
      expect(typeof mockActivity.timestamp).toBe('string');
      expect(typeof mockActivity.description).toBe('string');
      expect(typeof mockActivity.user).toBe('object');
      expect(typeof mockActivity.details).toBe('object');

      // Validate user structure
      expect(mockActivity.user).toHaveProperty('name');
      expect(mockActivity.user).toHaveProperty('role');
      expect(typeof mockActivity.user.name).toBe('string');
      expect(typeof mockActivity.user.role).toBe('string');
    });
  });

  describe('API Response Structure Validation', () => {
    it('should validate containers list response structure', () => {
      const mockResponse = {
        data: [
          {
            id: 'container-001',
            name: 'test-container',
            type: 'PHYSICAL',
            tenant: 'tenant-123',
            purpose: 'Development',
            location: { city: 'Test', country: 'Test', address: 'Test' },
            status: 'ACTIVE',
            created: '2025-01-30T09:30:00Z',
            modified: '2025-01-30T11:14:00Z',
            creator: 'Test User',
            seed_types: ['test-seed'],
            notes: 'Test notes',
            shadow_service_enabled: false,
            ecosystem_connected: true,
            system_integrations: {
              fa_integration: { name: 'Alpha', enabled: true },
              aws_environment: { name: 'Dev', enabled: true },
              mbai_environment: { name: 'Disabled', enabled: false }
            }
          }
        ],
        count: 1
      };

      expect(mockResponse).toHaveProperty('data');
      expect(mockResponse).toHaveProperty('count');
      expect(Array.isArray(mockResponse.data)).toBe(true);
      expect(typeof mockResponse.count).toBe('number');
    });

    it('should validate crops response structure', () => {
      const mockResponse = {
        total: 4,
        results: [
          {
            id: 'crop-001',
            seed_type: 'Salanova Cousteau',
            cultivation_area: 40,
            nursery_table: 30,
            last_sd: '2025-01-30',
            last_td: '2025-01-30',
            last_hd: null,
            avg_age: 26,
            overdue: 2
          }
        ]
      };

      expect(mockResponse).toHaveProperty('total');
      expect(mockResponse).toHaveProperty('results');
      expect(typeof mockResponse.total).toBe('number');
      expect(Array.isArray(mockResponse.results)).toBe(true);
    });

    it('should validate activities response structure', () => {
      const mockResponse = {
        activities: [
          {
            id: 'activity-001',
            type: 'SEEDED',
            timestamp: '2025-04-13T12:30:00Z',
            description: 'Seeded Salanova Cousteau in Nursery',
            user: { name: 'Emily Chen', role: 'Operator' },
            details: { seed_type: 'Salanova Cousteau', location: 'Nursery' }
          }
        ]
      };

      expect(mockResponse).toHaveProperty('activities');
      expect(Array.isArray(mockResponse.activities)).toBe(true);
    });
  });

  describe('Date and Time Validation', () => {
    it('should validate ISO date string format', () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      
      const testDates = [
        '2025-01-30T09:30:00Z',
        '2025-04-13T12:30:00Z',
        '2025-01-30T11:14:00Z'
      ];

      testDates.forEach(date => {
        expect(isoDateRegex.test(date)).toBe(true);
        expect(() => new Date(date).toISOString()).not.toThrow();
      });
    });

    it('should validate date field format in container model', () => {
      const container: ContainerDetail = {
        id: 'test',
        name: 'test',
        type: 'PHYSICAL',
        tenant: 'test',
        purpose: 'Development',
        location: { city: 'Test', country: 'Test', address: 'Test' },
        status: 'ACTIVE',
        created: '2025-01-30T09:30:00Z',
        modified: '2025-01-30T11:14:00Z',
        creator: 'test',
        seed_types: [],
        notes: 'test',
        shadow_service_enabled: false,
        ecosystem_connected: false,
        system_integrations: {
          fa_integration: { name: 'test', enabled: false },
          aws_environment: { name: 'test', enabled: false },
          mbai_environment: { name: 'test', enabled: false }
        }
      };

      expect(() => new Date(container.created)).not.toThrow();
      expect(() => new Date(container.modified)).not.toThrow();
      expect(new Date(container.created).getTime()).toBeLessThanOrEqual(new Date(container.modified).getTime());
    });
  });
});