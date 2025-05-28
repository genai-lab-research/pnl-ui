import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error codes here
    const errorResponse = {
      status: error.response?.status || 500,
      data: error.response?.data || { detail: 'Unknown error occurred' },
      message: error.message,
    };
    return Promise.reject(errorResponse);
  },
);

// Generic API request function
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export { apiClient, apiRequest };
