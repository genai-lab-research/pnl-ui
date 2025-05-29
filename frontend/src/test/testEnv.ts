// Test environment configuration and utilities
import { expect } from 'vitest';
export const TEST_CONFIG = {
  // Backend configuration
  BACKEND_URL: 'http://localhost:8000',
  API_BASE_URL: 'http://localhost:8000/api/v1',
  
  // Test timeouts
  UNIT_TEST_TIMEOUT: 5000,      // 5 seconds for unit tests
  INTEGRATION_TEST_TIMEOUT: 30000, // 30 seconds for integration tests
  
  // Test data
  DEFAULT_CONTAINER_ID: 'container-04', // Backend uses 'container-04' as ID, 'farm-container-04' as name
  
  // Feature flags for tests
  RUN_INTEGRATION_TESTS: process.env.NODE_ENV !== 'ci', // Skip in CI unless backend is available
  SKIP_BACKEND_TESTS: process.env.SKIP_BACKEND_TESTS === 'true',
  
  // Test environment detection
  IS_CI: process.env.CI === 'true',
  IS_LOCAL: !process.env.CI,
};

// Helper function to check if backend is available
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${TEST_CONFIG.BACKEND_URL}/docs`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Helper function to skip test if backend is not available
export function skipIfBackendUnavailable(backendAvailable: boolean) {
  if (!backendAvailable) {
    console.warn('⚠️  Backend server not available at http://localhost:8000');
    console.warn('📝 To run integration tests, start the backend server:');
    console.warn('   cd backend');
    console.warn('   python -m uvicorn app.main:app --reload');
    console.warn('');
  }
  return backendAvailable;
}

// Test data generators
export const generateTestContainer = (overrides: Partial<any> = {}) => ({
  name: `test-container-${Date.now()}`,
  type: 'PHYSICAL',
  tenant: 'test-tenant',
  purpose: 'Development',
  location: {
    city: 'Test City',
    country: 'Test Country',
    address: 'Test Address'
  },
  status: 'ACTIVE',
  creator: 'Test User',
  seed_types: ['test-seed'],
  notes: 'Test container for integration tests',
  shadow_service_enabled: false,
  ecosystem_connected: false,
  system_integrations: {
    fa_integration: { name: 'Test', enabled: false },
    aws_environment: { name: 'Test', enabled: false },
    mbai_environment: { name: 'Test', enabled: false }
  },
  ...overrides,
});

// Validation helpers
export const validateContainerStructure = (container: any) => {
  const requiredFields = [
    'id', 'name', 'type', 'tenant', 'purpose', 'location', 'status',
    'created', 'modified', 'creator', 'seed_types', 'notes',
    'shadow_service_enabled', 'ecosystem_connected', 'system_integrations'
  ];
  
  requiredFields.forEach(field => {
    expect(container).toHaveProperty(field);
  });
  
  // Validate enums
  expect(['PHYSICAL', 'VIRTUAL']).toContain(container.type);
  expect(['CREATED', 'ACTIVE', 'MAINTENANCE', 'INACTIVE']).toContain(container.status);
  expect(['Development', 'Research', 'Production']).toContain(container.purpose);
  
  // Validate nested objects
  expect(container.location).toHaveProperty('city');
  expect(container.location).toHaveProperty('country');
  expect(container.location).toHaveProperty('address');
  
  expect(container.system_integrations).toHaveProperty('fa_integration');
  expect(container.system_integrations).toHaveProperty('aws_environment');
  expect(container.system_integrations).toHaveProperty('mbai_environment');
};

export const validateMetricsStructure = (metrics: any) => {
  const requiredMetrics = [
    'temperature', 'humidity', 'co2', 'yield',
    'nursery_utilization', 'cultivation_utilization'
  ];
  
  requiredMetrics.forEach(metric => {
    expect(metrics).toHaveProperty(metric);
    expect(metrics[metric]).toHaveProperty('current');
    expect(metrics[metric]).toHaveProperty('unit');
    expect(typeof metrics[metric].current).toBe('number');
    expect(typeof metrics[metric].unit).toBe('string');
  });
};

export const validateCropStructure = (crop: any) => {
  const requiredFields = [
    'id', 'seed_type', 'cultivation_area', 'nursery_table',
    'last_sd', 'last_td', 'last_hd', 'avg_age', 'overdue'
  ];
  
  requiredFields.forEach(field => {
    expect(crop).toHaveProperty(field);
  });
  
  expect(typeof crop.cultivation_area).toBe('number');
  expect(typeof crop.nursery_table).toBe('number');
  expect(typeof crop.avg_age).toBe('number');
  expect(typeof crop.overdue).toBe('number');
};

export const validateActivityStructure = (activity: any) => {
  const requiredFields = [
    'id', 'type', 'timestamp', 'description', 'user', 'details'
  ];
  
  requiredFields.forEach(field => {
    expect(activity).toHaveProperty(field);
  });
  
  expect(['SEEDED', 'SYNCED', 'ENVIRONMENT_CHANGED', 'CREATED', 'MAINTENANCE'])
    .toContain(activity.type);
  
  expect(activity.user).toHaveProperty('name');
  expect(activity.user).toHaveProperty('role');
};