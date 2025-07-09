# Azure App Service Deployment Configuration

## Backend API URL
The application is configured to use the following backend API:
- **URL**: `https://pnl-api-gen-bqbjg6gaepgkcxau.centralus-01.azurewebsites.net`

## Configuration Steps

### 1. Set Environment Variable in Azure App Service
In your Azure App Service configuration, add the following Application Setting:

```
Name: BACKEND_URL
Value: https://pnl-api-gen-bqbjg6gaepgkcxau.centralus-01.azurewebsites.net
```

### 2. Deploy Using Docker
The Docker image will automatically pick up the environment variable at runtime and configure nginx accordingly.

### 3. Verify Configuration
After deployment, you can verify the API proxy is working by:
- Checking that `/api` requests are properly forwarded to the backend
- Monitoring the Application Insights or logs for any proxy errors

## Local Development
For local development, you can set the backend URL in a `.env` file:
```
VITE_API_URL=https://pnl-api-gen-bqbjg6gaepgkcxau.centralus-01.azurewebsites.net
```

## Troubleshooting
If you encounter issues:
1. Ensure the `BACKEND_URL` environment variable is set correctly in App Service
2. Check that the backend API is accessible from the App Service network
3. Review nginx logs for any proxy-related errors