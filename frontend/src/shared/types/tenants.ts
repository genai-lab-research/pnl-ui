export interface Tenant {
  id: string;
  name: string;
}

export interface TenantResponse {
  id: string;
  name: string;
}

export interface TenantList {
  total: number;
  results: Tenant[];
}