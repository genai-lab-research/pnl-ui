import { SeedType } from '../shared/types/seedTypes';
import config from './config';

// API request helper (reused from containerService)
interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
}

async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  const { method, url, params, data, headers = {} } = options;
  
  // Build URL with query parameters
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const fullUrl = `${config.api.baseUrl}${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);
    
    const response = await fetch(fullUrl, {
      method,
      headers: defaultHeaders,
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData}`);
    }
    
    // Handle empty response for DELETE operations
    if (response.status === 204 || method === 'DELETE') {
      return {} as T;
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    // In development mode with mock fallback enabled, return mock data when API is unavailable
    if (config.api.enableMockFallback && config.api.isDevelopment && 
        (error instanceof TypeError && error.message.includes('fetch') || 
         error instanceof DOMException && error.name === 'AbortError')) {
      console.warn(`API request failed, falling back to mock data for: ${url}`);
      return getMockDataForUrl<T>(url);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API server. Please check if the backend is running.');
    }
    throw error;
  }
}

// Mock data fallback helper
function getMockDataForUrl<T>(url: string): T {
  if (url.includes('/seed-types')) {
    return [
      { id: 'seed-001', name: 'Someroots', variety: 'Standard', supplier: 'BioCrop' },
      { id: 'seed-002', name: 'Sunflower', variety: 'Giant', supplier: 'SeedPro' },
      { id: 'seed-003', name: 'Basil', variety: 'Sweet', supplier: 'HerbGarden' },
      { id: 'seed-004', name: 'Lettuce', variety: 'Romaine', supplier: 'GreenLeaf' },
      { id: 'seed-005', name: 'Kale', variety: 'Curly', supplier: 'Nutrifoods' },
      { id: 'seed-006', name: 'Spinach', variety: 'Baby', supplier: 'GreenLeaf' },
      { id: 'seed-007', name: 'Arugula', variety: 'Wild', supplier: 'HerbGarden' },
      { id: 'seed-008', name: 'Microgreens', variety: 'Mixed', supplier: 'SproutLife' }
    ] as T;
  }
  
  throw new Error(`No mock data available for URL: ${url}`);
}

// Seed type service implementation
const seedTypeService = {
  /**
   * Get all seed types for multi-select dropdown
   */
  getSeedTypes: async (): Promise<SeedType[]> => {
    return apiRequest<SeedType[]>({
      method: 'GET',
      url: '/seed-types',
    });
  },
};

export default seedTypeService;