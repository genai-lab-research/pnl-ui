import { MetricResponse, MetricTimeRange, PerformanceOverview } from '../shared/types/metrics';
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
  if (url.includes('/metrics/container/')) {
    return {
      yield_data: [
        { date: '2024-01-01', value: 25 },
        { date: '2024-01-02', value: 30 },
        { date: '2024-01-03', value: 22 },
        { date: '2024-01-04', value: 28 },
        { date: '2024-01-05', value: 35 },
        { date: '2024-01-06', value: 27 },
        { date: '2024-01-07', value: 32 }
      ],
      space_utilization_data: [
        { date: '2024-01-01', value: 75 },
        { date: '2024-01-02', value: 80 },
        { date: '2024-01-03', value: 72 },
        { date: '2024-01-04', value: 78 },
        { date: '2024-01-05', value: 85 },
        { date: '2024-01-06', value: 77 },
        { date: '2024-01-07', value: 82 }
      ],
      average_yield: 28.4,
      total_yield: 199,
      average_space_utilization: 78.4,
      current_temperature: 22.5,
      current_humidity: 65,
      current_co2: 850,
      crop_counts: {
        seeded: 150,
        transplanted: 120,
        harvested: 80
      },
      is_daily: true
    } as T;
  }

  if (url.includes('/performance')) {
    return {
      physical: {
        count: 12,
        yield: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [25, 20, 24, 18, 23, 19, 22],
          avgYield: 63,
          totalYield: 81
        },
        spaceUtilization: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [80, 75, 83, 76, 82, 70, 75],
          avgUtilization: 80
        }
      },
      virtual: {
        count: 8,
        yield: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [22, 19, 23, 18, 21, 17, 20],
          avgYield: 63,
          totalYield: 81
        },
        spaceUtilization: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [65, 60, 68, 62, 66, 59, 64],
          avgUtilization: 80
        }
      }
    } as T;
  }
  
  throw new Error(`No mock data available for URL: ${url}`);
}

// Metrics service implementation
const metricsService = {
  /**
   * Get metrics for a specific container over a time range
   */
  getContainerMetrics: async (
    containerId: string,
    timeRange: MetricTimeRange = 'WEEK',
    startDate?: string
  ): Promise<MetricResponse> => {
    return apiRequest<MetricResponse>({
      method: 'GET',
      url: config.endpoints.metricsContainer(containerId),
      params: {
        time_range: timeRange,
        start_date: startDate,
      },
    });
  },

  /**
   * Get performance overview for dashboard
   */
  getPerformanceOverview: async (timeRange?: MetricTimeRange): Promise<PerformanceOverview> => {
    return apiRequest<PerformanceOverview>({
      method: 'GET',
      url: config.endpoints.performance,
      params: timeRange ? { time_range: timeRange } : {},
    });
  },
};

export default metricsService;