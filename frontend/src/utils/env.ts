// Helper function to get environment variables safely in all environments
const getEnvVar = (key: string, fallback: string | boolean = ''): string | boolean => {
  // In test environment, return fallbacks
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    switch (key) {
      case 'VITE_API_BASE_URL': return '/api/v1';
      case 'VITE_DEFAULT_USERNAME': return 'testuser';
      case 'VITE_DEFAULT_PASSWORD': return 'testpassword';
      case 'VITE_AUTO_LOGIN': return true;
      case 'NODE_ENV': return 'test';
      case 'DEV': return false;
      case 'PROD': return false;
      default: return fallback;
    }
  }
  
  // Try browser environment
  try {
    if (typeof window !== 'undefined') {
      const meta = (globalThis as any).import?.meta || {};
      const value = meta.env?.[key];
      if (value !== undefined) {
        return key === 'VITE_AUTO_LOGIN' ? value === 'true' : value;
      }
    }
  } catch {
    // Fallback for any environment issues
  }
  
  // Node.js environment fallback
  if (typeof process !== 'undefined' && process.env) {
    const processValue = process.env[key];
    if (processValue !== undefined) {
      return key === 'VITE_AUTO_LOGIN' ? processValue === 'true' : processValue;
    }
  }
  
  return fallback;
};

export const env = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', '/api/v1') as string,
  DEFAULT_USERNAME: getEnvVar('VITE_DEFAULT_USERNAME', 'testuser') as string,
  DEFAULT_PASSWORD: getEnvVar('VITE_DEFAULT_PASSWORD', 'testpassword') as string,
  AUTO_LOGIN: getEnvVar('VITE_AUTO_LOGIN', true) as boolean,
  NODE_ENV: getEnvVar('NODE_ENV', 'development') as string,
  DEV: getEnvVar('DEV', false) as boolean,
  PROD: getEnvVar('PROD', false) as boolean,
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';

export function validateEnv(): void {
  const requiredVars = ['API_BASE_URL'] as const;
  const missing = requiredVars.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}