import { 
  Container, 
  ContainerFilterCriteria, 
  CreateContainerRequest, 
  UpdateContainerRequest,
  ApiResponse
} from '../shared/types/containers';
import { apiConfig } from './config';

export class ContainerService {
  private baseUrl: string;

  constructor(baseUrl: string = apiConfig.baseUrl) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        return {
          error: {
            detail: errorData.detail || `HTTP ${response.status}`,
            status_code: response.status
          }
        };
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  private buildQueryParams(filters: ContainerFilterCriteria): string {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.tenant) params.append('tenant', filters.tenant);
    if (filters.purpose) params.append('purpose', filters.purpose);
    if (filters.status) params.append('status', filters.status);
    if (filters.has_alerts !== undefined) params.append('has_alerts', filters.has_alerts.toString());
    
    return params.toString();
  }

  async listContainers(filters: ContainerFilterCriteria = {}): Promise<ApiResponse<Container[]>> {
    const queryParams = this.buildQueryParams(filters);
    const url = queryParams ? `${this.baseUrl}/containers?${queryParams}` : `${this.baseUrl}/containers`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<Container[]>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  async getContainer(id: string): Promise<ApiResponse<Container>> {
    try {
      const response = await fetch(`${this.baseUrl}/containers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return this.handleResponse<Container>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  async createContainer(container: CreateContainerRequest): Promise<ApiResponse<Container>> {
    try {
      const response = await fetch(`${this.baseUrl}/containers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(container),
      });

      return this.handleResponse<Container>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  async updateContainer(id: string, updates: UpdateContainerRequest): Promise<ApiResponse<Container>> {
    try {
      const response = await fetch(`${this.baseUrl}/containers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      return this.handleResponse<Container>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }

  async deleteContainer(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/containers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        return { data: undefined };
      }

      return this.handleResponse<void>(response);
    } catch (error) {
      return {
        error: {
          detail: error instanceof Error ? error.message : 'Network error',
          status_code: 0
        }
      };
    }
  }
}

// Default service instance
export const containerService = new ContainerService();