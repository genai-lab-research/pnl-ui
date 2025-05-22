/**
 * Tenant API Tests
 * 
 * These tests verify that the tenant API endpoints work as expected.
 * They interact with the real API, so ensure the backend server is running.
 */

import { describe, it, expect } from 'vitest';
import { fail } from '../setup';
import tenantService from '../../services/tenantService';

// Test configuration
const API_URL = 'http://localhost:8000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

describe('Tenant API', () => {
  describe('Tenant retrieval', () => {
    it('should retrieve tenant list', async () => {
      const response = await tenantService.getTenants();
      
      expect(response).toBeDefined();
      expect(typeof response.total).toBe('number');
      expect(Array.isArray(response.results)).toBe(true);
      
      // Check structure of tenants if any are returned
      if (response.results.length > 0) {
        const tenant = response.results[0];
        expect(tenant.id).toBeDefined();
        expect(typeof tenant.name).toBe('string');
      }
    }, TEST_TIMEOUT);

    it('should filter tenants by name', async () => {
      // First get any tenant to use for filtering
      const allTenants = await tenantService.getTenants();
      
      if (allTenants.results.length === 0) {
        console.log('No tenants available to test filtering');
        return;
      }
      
      const testTenant = allTenants.results[0];
      const nameSubstring = testTenant.name.substring(0, 3); // Use first 3 chars for filtering
      
      // Filter by the name fragment
      const filteredTenants = await tenantService.getTenants(0, 100, nameSubstring);
      
      expect(filteredTenants).toBeDefined();
      expect(Array.isArray(filteredTenants.results)).toBe(true);
      expect(filteredTenants.results.length).toBeGreaterThan(0);
      
      // Verify all returned tenants contain the name substring
      filteredTenants.results.forEach(tenant => {
        expect(tenant.name.toLowerCase()).toContain(nameSubstring.toLowerCase());
      });
    }, TEST_TIMEOUT);
  });

  describe('Tenant CRUD operations', () => {
    // Generate a unique tenant name for testing
    const testTenantName = `Test Tenant ${Date.now()}`;
    let createdTenantId: string;

    it('should create a new tenant', async () => {
      const newTenant = await tenantService.createTenant(testTenantName);
      
      expect(newTenant).toBeDefined();
      expect(newTenant.id).toBeDefined();
      expect(newTenant.name).toBe(testTenantName);
      
      // Save ID for later tests
      createdTenantId = newTenant.id;
    }, TEST_TIMEOUT);

    it('should retrieve a specific tenant by ID', async () => {
      // Skip if previous test didn't create a tenant
      if (!createdTenantId) {
        console.log('No tenant created to test retrieval');
        return;
      }
      
      const tenant = await tenantService.getTenantById(createdTenantId);
      
      expect(tenant).toBeDefined();
      expect(tenant.id).toBe(createdTenantId);
      expect(tenant.name).toBe(testTenantName);
    }, TEST_TIMEOUT);

    it('should update an existing tenant', async () => {
      // Skip if no tenant was created
      if (!createdTenantId) {
        console.log('No tenant created to test update');
        return;
      }
      
      const updatedName = `${testTenantName} Updated`;
      const updatedTenant = await tenantService.updateTenant(createdTenantId, updatedName);
      
      expect(updatedTenant).toBeDefined();
      expect(updatedTenant.id).toBe(createdTenantId);
      expect(updatedTenant.name).toBe(updatedName);
    }, TEST_TIMEOUT);

    it('should delete a tenant', async () => {
      // Skip if no tenant was created
      if (!createdTenantId) {
        console.log('No tenant created to test deletion');
        return;
      }
      
      // Delete the tenant
      await tenantService.deleteTenant(createdTenantId);
      
      try {
        // Try to retrieve the deleted tenant - should fail
        await tenantService.getTenantById(createdTenantId);
        fail('Expected tenant retrieval after deletion to fail');
      } catch (error) {
        // This is expected
        expect(error).toBeDefined();
      }
    }, TEST_TIMEOUT);
  });
});