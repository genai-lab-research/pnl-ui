import { describe, it, expect } from 'vitest';
import containerService from './containerService';
import metricsService from './metricsService';
import tenantService from './tenantService';
import { ContainerFilterParams, ContainerCreate, ContainerUpdate } from '../shared/types/containers';
import { MetricTimeRange } from '../shared/types/metrics';

// Integration tests that work with MSW mocks
describe('API Services Integration Tests', () => {
  
  describe('Container Service - Dashboard Methods', () => {
    it('should get containers list with default parameters', async () => {
      const result = await containerService.getContainersList();
      
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.results.length).toBeGreaterThan(0);
      
      // Check structure of first container
      const firstContainer = result.results[0];
      expect(firstContainer).toHaveProperty('id');
      expect(firstContainer).toHaveProperty('name');
      expect(firstContainer).toHaveProperty('type');
      expect(firstContainer).toHaveProperty('tenant_name');
      expect(firstContainer).toHaveProperty('status');
      expect(firstContainer).toHaveProperty('has_alerts');
    });

    it('should filter containers by type', async () => {
      const filterParams: ContainerFilterParams = {
        type: 'PHYSICAL'
      };
      
      const result = await containerService.getContainersList(filterParams);
      
      expect(result.results.every(c => c.type === 'PHYSICAL')).toBe(true);
    });

    it('should filter containers by alerts', async () => {
      const filterParams: ContainerFilterParams = {
        has_alerts: true
      };
      
      const result = await containerService.getContainersList(filterParams);
      
      expect(result.results.every(c => c.has_alerts === true)).toBe(true);
    });

    it('should paginate containers', async () => {
      const filterParams: ContainerFilterParams = {
        skip: 0,
        limit: 1
      };
      
      const result = await containerService.getContainersList(filterParams);
      
      expect(result.results.length).toBeLessThanOrEqual(1);
    });

    it('should get container statistics', async () => {
      const stats = await containerService.getContainerStats();
      
      expect(stats).toHaveProperty('physical_count');
      expect(stats).toHaveProperty('virtual_count');
      expect(typeof stats.physical_count).toBe('number');
      expect(typeof stats.virtual_count).toBe('number');
      expect(stats.physical_count).toBeGreaterThan(0);
      expect(stats.virtual_count).toBeGreaterThan(0);
    });

    it('should create a new container', async () => {
      const containerData: ContainerCreate = {
        name: 'Test Container',
        type: 'PHYSICAL',
        tenant_id: '1',
        purpose: 'Development',
        location_city: 'Boston',
        location_country: 'USA',
        notes: 'Test container for integration test'
      };
      
      const result = await containerService.createContainerDashboard(containerData);
      
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(containerData.name);
      expect(result.type).toBe(containerData.type);
      expect(result.purpose).toBe(containerData.purpose);
    });

    it('should update a container', async () => {
      const updateData: ContainerUpdate = {
        name: 'Updated Container Name',
        status: 'MAINTENANCE'
      };
      
      const result = await containerService.updateContainerDashboard('container-1', updateData);
      
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(updateData.name);
      expect(result.status).toBe(updateData.status);
    });

    it('should shutdown a container', async () => {
      const result = await containerService.shutdownContainer('container-1');
      
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('INACTIVE');
    });

    it('should get container summary by ID', async () => {
      const result = await containerService.getContainerSummaryById('container-1');
      
      expect(result).toHaveProperty('id');
      expect(result.id).toBe('container-1');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('tenant_name');
    });
  });

  describe('Metrics Service', () => {
    it('should get container metrics with default parameters', async () => {
      const result = await metricsService.getContainerMetrics('container-123');
      
      expect(result).toHaveProperty('yield_data');
      expect(result).toHaveProperty('space_utilization_data');
      expect(result).toHaveProperty('average_yield');
      expect(result).toHaveProperty('total_yield');
      expect(result).toHaveProperty('average_space_utilization');
      expect(result).toHaveProperty('current_temperature');
      expect(result).toHaveProperty('current_humidity');
      expect(result).toHaveProperty('current_co2');
      expect(result).toHaveProperty('crop_counts');
      expect(result).toHaveProperty('is_daily');
      
      expect(Array.isArray(result.yield_data)).toBe(true);
      expect(Array.isArray(result.space_utilization_data)).toBe(true);
      expect(typeof result.average_yield).toBe('number');
      expect(typeof result.total_yield).toBe('number');
      expect(typeof result.current_temperature).toBe('number');
      
      // Check yield data structure
      if (result.yield_data.length > 0) {
        const firstYieldPoint = result.yield_data[0];
        expect(firstYieldPoint).toHaveProperty('date');
        expect(firstYieldPoint).toHaveProperty('value');
        expect(typeof firstYieldPoint.value).toBe('number');
      }
      
      // Check space utilization data structure
      if (result.space_utilization_data.length > 0) {
        const firstUtilPoint = result.space_utilization_data[0];
        expect(firstUtilPoint).toHaveProperty('date');
        expect(firstUtilPoint).toHaveProperty('value');
        expect(typeof firstUtilPoint.value).toBe('number');
      }
      
      // Check crop counts structure
      expect(result.crop_counts).toHaveProperty('seeded');
      expect(result.crop_counts).toHaveProperty('transplanted');
      expect(result.crop_counts).toHaveProperty('harvested');
      expect(typeof result.crop_counts.seeded).toBe('number');
    });

    it('should get container metrics with custom time range', async () => {
      const timeRange: MetricTimeRange = 'MONTH';
      const result = await metricsService.getContainerMetrics('container-123', timeRange);
      
      expect(result).toHaveProperty('yield_data');
      expect(result).toHaveProperty('space_utilization_data');
      // For MONTH, we expect more data points (30 days in our mock)
      expect(result.yield_data.length).toBeGreaterThan(7);
      expect(result.space_utilization_data.length).toBeGreaterThan(7);
    });

    it('should get container metrics with start date', async () => {
      const result = await metricsService.getContainerMetrics(
        'container-123', 
        'WEEK', 
        '2024-01-01'
      );
      
      expect(result).toHaveProperty('yield_data');
      expect(result).toHaveProperty('space_utilization_data');
    });

    it('should get performance overview', async () => {
      const result = await metricsService.getPerformanceOverview();
      
      expect(result).toHaveProperty('physical');
      expect(result).toHaveProperty('virtual');
      
      // Check physical performance data
      expect(result.physical).toHaveProperty('count');
      expect(result.physical).toHaveProperty('yield');
      expect(result.physical).toHaveProperty('spaceUtilization');
      expect(typeof result.physical.count).toBe('number');
      
      expect(result.physical.yield).toHaveProperty('labels');
      expect(result.physical.yield).toHaveProperty('data');
      expect(result.physical.yield).toHaveProperty('avgYield');
      expect(result.physical.yield).toHaveProperty('totalYield');
      expect(Array.isArray(result.physical.yield.labels)).toBe(true);
      expect(Array.isArray(result.physical.yield.data)).toBe(true);
      
      expect(result.physical.spaceUtilization).toHaveProperty('labels');
      expect(result.physical.spaceUtilization).toHaveProperty('data');
      expect(result.physical.spaceUtilization).toHaveProperty('avgUtilization');
      
      // Check virtual performance data
      expect(result.virtual).toHaveProperty('count');
      expect(result.virtual).toHaveProperty('yield');
      expect(result.virtual).toHaveProperty('spaceUtilization');
      expect(typeof result.virtual.count).toBe('number');
    });

    it('should get performance overview with time range', async () => {
      const result = await metricsService.getPerformanceOverview('MONTH');
      
      expect(result).toHaveProperty('physical');
      expect(result).toHaveProperty('virtual');
      // Data structure should be the same regardless of time range
      expect(result.physical.yield.labels).toHaveLength(7); // 7 days in our mock
    });
  });

  describe('Tenant Service', () => {
    it('should get all tenants', async () => {
      const result = await tenantService.getTenants();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Check structure of first tenant
      const firstTenant = result[0];
      expect(firstTenant).toHaveProperty('id');
      expect(firstTenant).toHaveProperty('name');
      expect(typeof firstTenant.id).toBe('string');
      expect(typeof firstTenant.name).toBe('string');
      expect(firstTenant.id.length).toBeGreaterThan(0);
      expect(firstTenant.name.length).toBeGreaterThan(0);
    });

    it('should return expected tenant data', async () => {
      const result = await tenantService.getTenants();
      
      // Check that we have the expected tenant names from our mock
      const tenantNames = result.map(t => t.name);
      expect(tenantNames).toContain('Acme Corp');
      expect(tenantNames).toContain('TechStart Inc');
      expect(tenantNames).toContain('GreenGrow Ltd');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent container gracefully', async () => {
      // This should still return data from our mock, but in real API would be 404
      const result = await containerService.getContainerSummaryById('non-existent-id');
      expect(result).toHaveProperty('id');
    });

    it('should handle metrics for non-existent container', async () => {
      // This should still return data from our mock, but in real API would be 404
      const result = await metricsService.getContainerMetrics('non-existent-id');
      expect(result).toHaveProperty('yield_data');
    });
  });

  describe('Data Consistency', () => {
    it('should return consistent container data across different methods', async () => {
      // Get container from list
      const listResult = await containerService.getContainersList({ limit: 1 });
      expect(listResult.results.length).toBeGreaterThan(0);
      
      const containerFromList = listResult.results[0];
      
      // Get the same container by ID
      const containerById = await containerService.getContainerSummaryById(containerFromList.id);
      
      // Should have consistent data
      expect(containerById.id).toBe(containerFromList.id);
      expect(containerById.name).toBe(containerFromList.name);
      expect(containerById.type).toBe(containerFromList.type);
    });

    it('should return consistent tenant data for filtering', async () => {
      const tenants = await tenantService.getTenants();
      const firstTenant = tenants[0];
      
      // Use tenant ID to filter containers
      const filteredContainers = await containerService.getContainersList({
        tenant_id: firstTenant.id
      });
      
      // All returned containers should have the tenant name matching our tenant
      // Note: This tests the mock's tenant mapping logic
      expect(filteredContainers.results.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = [
        containerService.getContainersList(),
        containerService.getContainerStats(),
        tenantService.getTenants(),
        metricsService.getPerformanceOverview()
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(4);
      expect(results[0]).toHaveProperty('results'); // containers list
      expect(results[1]).toHaveProperty('physical_count'); // stats
      expect(Array.isArray(results[2])).toBe(true); // tenants
      expect(results[3]).toHaveProperty('physical'); // performance
    });

    it('should handle sequential requests efficiently', async () => {
      const start = Date.now();
      
      await containerService.getContainersList();
      await containerService.getContainerStats();
      await tenantService.getTenants();
      
      const duration = Date.now() - start;
      
      // Should complete reasonably quickly (under 1 second for mocked data)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed container data', async () => {
      const result = await containerService.getContainersList();
      
      // TypeScript should enforce these types at compile time,
      // but we can also test them at runtime
      expect(typeof result.total).toBe('number');
      expect(Array.isArray(result.results)).toBe(true);
      
      if (result.results.length > 0) {
        const container = result.results[0];
        expect(['PHYSICAL', 'VIRTUAL']).toContain(container.type);
        expect(['CREATED', 'ACTIVE', 'MAINTENANCE', 'INACTIVE']).toContain(container.status);
        expect(['Development', 'Research', 'Production']).toContain(container.purpose);
        expect(typeof container.has_alerts).toBe('boolean');
      }
    });

    it('should return properly typed metrics data', async () => {
      const result = await metricsService.getContainerMetrics('test-id');
      
      expect(typeof result.average_yield).toBe('number');
      expect(typeof result.total_yield).toBe('number');
      expect(typeof result.average_space_utilization).toBe('number');
      expect(typeof result.current_temperature).toBe('number');
      expect(typeof result.current_humidity).toBe('number');
      expect(typeof result.current_co2).toBe('number');
      expect(typeof result.is_daily).toBe('boolean');
    });

    it('should return properly typed tenant data', async () => {
      const result = await tenantService.getTenants();
      
      expect(Array.isArray(result)).toBe(true);
      
      result.forEach(tenant => {
        expect(typeof tenant.id).toBe('string');
        expect(typeof tenant.name).toBe('string');
        expect(tenant.id.length).toBeGreaterThan(0);
        expect(tenant.name.length).toBeGreaterThan(0);
      });
    });
  });
});