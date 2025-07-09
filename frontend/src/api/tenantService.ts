import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  Tenant,
  TenantCreateRequest
} from '../types/verticalFarm';

class TenantService extends BaseApiService {
  constructor() {
    super(apiConfig.baseUrl);
  }

  /**
   * Get all tenants
   */
  async getTenants(): Promise<Tenant[]> {
    return this.get<Tenant[]>('/tenants/');
  }

  /**
   * Create a new tenant
   */
  async createTenant(data: TenantCreateRequest): Promise<Tenant> {
    return this.post<Tenant>('/tenants/', data);
  }

  /**
   * Get tenant by ID
   */
  async getTenantById(id: number): Promise<Tenant> {
    return this.get<Tenant>(`/tenants/${id}`);
  }
}

export const tenantService = new TenantService();
export default tenantService;