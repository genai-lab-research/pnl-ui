/**
 * Environment configuration utilities for Vite
 * Handles environment variables and provides type-safe access
 */

export interface AppConfig {
  apiBaseUrl: string;
  defaultUsername: string;
  defaultPassword: string;
  autoLogin: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  backendUrl: string;
  devPort: number;
  testUserEmail: string;
  devTokenPrefix: string;
}

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private loadConfig(): AppConfig {
    // Get environment variables with Vite prefix
    const env = import.meta.env;
    
    return {
      apiBaseUrl: env.VITE_API_BASE_URL || '/api/v1',
      defaultUsername: env.VITE_DEFAULT_USERNAME || '',
      defaultPassword: env.VITE_DEFAULT_PASSWORD || '',
      autoLogin: env.VITE_AUTO_LOGIN === 'true',
      isDevelopment: env.MODE === 'development',
      isProduction: env.MODE === 'production',
      isTest: env.MODE === 'test',
      backendUrl: env.VITE_BACKEND_URL || 'http://localhost:8000',
      devPort: parseInt(env.VITE_DEV_PORT || '5173'),
      testUserEmail: env.VITE_TEST_USER_EMAIL || '',
      devTokenPrefix: env.VITE_DEV_TOKEN_PREFIX || 'dev-token-',
    };
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  public get defaultCredentials(): { username: string; password: string } {
    return {
      username: this.config.defaultUsername,
      password: this.config.defaultPassword,
    };
  }

  public get autoLogin(): boolean {
    return this.config.autoLogin;
  }

  public get isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  public get isProduction(): boolean {
    return this.config.isProduction;
  }

  public get isTest(): boolean {
    return this.config.isTest;
  }

  public get backendUrl(): string {
    return this.config.backendUrl;
  }

  public get devPort(): number {
    return this.config.devPort;
  }

  public get testUserEmail(): string {
    return this.config.testUserEmail;
  }

  public get devTokenPrefix(): string {
    return this.config.devTokenPrefix;
  }

  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate API base URL
    if (!this.config.apiBaseUrl) {
      errors.push('API base URL is required');
    } else {
      try {
        // Check if it's a valid URL pattern
        if (!this.config.apiBaseUrl.startsWith('/') && !this.config.apiBaseUrl.startsWith('http')) {
          errors.push('API base URL must start with / or http(s)://');
        }
      } catch {
        errors.push('Invalid API base URL format');
      }
    }

    // Validate default credentials (only in development)
    if (this.config.isDevelopment) {
      if (!this.config.defaultUsername) {
        errors.push('Default username is required for development');
      }
      if (!this.config.defaultPassword) {
        errors.push('Default password is required for development');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public logConfig(): void {
    if (this.config.isDevelopment) {
      console.group('🔧 Environment Configuration');
      console.log('Mode:', import.meta.env.MODE);
      console.log('API Base URL:', this.config.apiBaseUrl);
      console.log('Auto Login:', this.config.autoLogin);
      console.log('Default Username:', this.config.defaultUsername);
      console.log('Environment Variables:', {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_AUTO_LOGIN: import.meta.env.VITE_AUTO_LOGIN,
        VITE_DEFAULT_USERNAME: import.meta.env.VITE_DEFAULT_USERNAME,
      });
      console.groupEnd();

      const validation = this.validateConfig();
      if (!validation.isValid) {
        console.warn('⚠️ Configuration Issues:', validation.errors);
      }
    }
  }
}

// Singleton instance
const envManager = EnvironmentManager.getInstance();

// Export the configuration for easy access
export const appConfig = envManager.getConfig();

// Export utility functions
export const getApiBaseUrl = (): string => envManager.apiBaseUrl;

export const getDefaultCredentials = (): { username: string; password: string } => 
  envManager.defaultCredentials;

export const shouldAutoLogin = (): boolean => envManager.autoLogin;

export const isDevelopment = (): boolean => envManager.isDevelopment;

export const isProduction = (): boolean => envManager.isProduction;

export const isTest = (): boolean => envManager.isTest;

export const validateEnvironment = (): { isValid: boolean; errors: string[] } => 
  envManager.validateConfig();

export const logEnvironmentConfig = (): void => envManager.logConfig();

export const getBackendUrl = (): string => envManager.backendUrl;

export const getDevPort = (): number => envManager.devPort;

export const getTestUserEmail = (): string => envManager.testUserEmail;

export const getDevTokenPrefix = (): string => envManager.devTokenPrefix;

// Initialize and log configuration in development
if (envManager.isDevelopment) {
  envManager.logConfig();
}

// Type declarations for Vite environment variables
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_DEFAULT_USERNAME: string;
    readonly VITE_DEFAULT_PASSWORD: string;
    readonly VITE_AUTO_LOGIN: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_DEV_PORT: string;
    readonly VITE_TEST_USER_EMAIL: string;
    readonly VITE_DEV_TOKEN_PREFIX: string;
    readonly VITE_SKIP_INTEGRATION_TESTS: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}