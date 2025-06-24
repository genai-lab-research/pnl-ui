export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://pnl-api-gen-bqbjg6gaepgkcxau.centralus-01.azurewebsites.net/api',
  talk2dbUrl: import.meta.env.VITE_TALK_TO_DB_API_URL || 'https://pnl-talk2db-deployment-41.wittybeach-dd75971c.centralus.azurecontainerapps.io/v1/agent/chat',
  timeout: 30000,
};