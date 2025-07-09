// Use a function to get environment variables to support both browser and test environments
const getEnvVar = (key: string, fallback: string): string => {
  // In test environment, just return fallback
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return fallback;
  }
  
  // In browser environment
  try {
    if (typeof window !== 'undefined') {
      // Use any to bypass TypeScript checking in test environment
      const meta = (globalThis as any).import?.meta || {};
      return meta.env?.[key] || fallback;
    }
  } catch {
    // Fallback for any environment issues
  }
  
  // Node.js environment fallback
  return process?.env?.[key] || fallback;
};

export const apiConfig = {
  baseUrl: getEnvVar('VITE_API_BASE_URL', '/api/v1'),
  talk2dbUrl: getEnvVar('VITE_TALK_TO_DB_API_URL', 'https://pnl-talk2db-deployment-41.wittybeach-dd75971c.centralus.azurecontainerapps.io/v1/agent/chat'),
  timeout: 30000,
};