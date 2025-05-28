import { apiRequest } from './api';

// Types that match backend schemas
export interface Tenant {
  id: string;
  name: string;
}

export interface TenantList {
  total: number;
  results: Tenant[];
}

// Service functions to interact with tenant endpoints
const tenantService = {
  // Get all tenants
  getTenants: async (skip: number = 0, limit: number = 100, name?: string): Promise<TenantList> => {
    return apiRequest<TenantList>({
      method: 'GET',
      url: '/tenants/',
      params: {
        skip,
        limit,
        name,
      },
    });
  },

  // Get a specific tenant by ID
  getTenantById: async (id: string): Promise<Tenant> => {
    return apiRequest<Tenant>({
      method: 'GET',
      url: `/tenants/${id}/`,
    });
  },

  // Create a new tenant
  createTenant: async (name: string): Promise<Tenant> => {
    return apiRequest<Tenant>({
      method: 'POST',
      url: '/tenants/',
      data: { name },
    });
  },

  // Update an existing tenant
  updateTenant: async (id: string, name: string): Promise<Tenant> => {
    return apiRequest<Tenant>({
      method: 'PUT',
      url: `/tenants/${id}/`,
      data: { name },
    });
  },

  // Delete a tenant
  deleteTenant: async (id: string): Promise<void> => {
    return apiRequest<void>({
      method: 'DELETE',
      url: `/tenants/${id}/`,
    });
  },
};

export default tenantService;
