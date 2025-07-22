import { TenantOption } from '../types/container';
import { BaseApiService } from './baseService';
import { apiConfig } from './config';

class TenantApiService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  async getTenants(): Promise<TenantOption[]> {
    return this.get<TenantOption[]>('/tenants/');
  }
}

export const tenantApiService = new TenantApiService();