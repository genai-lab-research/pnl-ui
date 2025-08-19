# Environment Variables Configuration

This document explains how to configure environment variables for the demo frontend application.

## Overview

All hardcoded credentials and configuration values have been moved to environment variables for better security and flexibility. The application now uses Vite's environment variable system with `VITE_` prefixed variables.

## Environment Files

### 1. `.env.example` / `env.example`
Template file showing all available environment variables with their default values. This file is committed to the repository.

### 2. `.env.local` (Not committed)
Your local development environment variables. Copy from `env.example` and customize as needed.

### 3. `.env.production` (Not committed)
Production environment variables. Should be configured on your production server.

## Available Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_BASE_URL` | Base URL for API calls | `/api/v1` | `/api/v1` |
| `VITE_BACKEND_URL` | Backend server URL | `http://localhost:8000` | `http://localhost:8000` |
| `VITE_DEFAULT_USERNAME` | Default username for development | `""` | `testuser` |
| `VITE_DEFAULT_PASSWORD` | Default password for development | `""` | `testpassword` |
| `VITE_AUTO_LOGIN` | Enable auto-login in development | `false` | `true` |
| `VITE_DEV_PORT` | Development server port | `5173` | `5173` |
| `VITE_TEST_USER_EMAIL` | Test user email | `""` | `testuser@example.com` |
| `VITE_DEV_TOKEN_PREFIX` | Development token prefix | `dev-token-` | `dev-token-` |
| `VITE_SKIP_INTEGRATION_TESTS` | Skip integration tests | `false` | `true` |

## Security Considerations

### ⚠️ Important Security Notes

1. **Never commit sensitive credentials** to version control
2. **Use empty strings for production credentials** - set them via deployment environment
3. **Default credentials are only for development** - they should not work in production
4. **Environment files with real credentials** should be in `.gitignore`

### Development vs Production

- **Development**: Can use default credentials for convenience
- **Production**: Must use proper authentication, no default credentials

## Setup Instructions

### 1. Initial Setup
```bash
# Copy the example file
cp env.example .env.local

# Edit with your local configuration
nano .env.local
```

### 2. For Development
```env
# .env.local
VITE_API_BASE_URL=/api/v1
VITE_BACKEND_URL=http://localhost:8000
VITE_DEFAULT_USERNAME=testuser
VITE_DEFAULT_PASSWORD=testpassword
VITE_AUTO_LOGIN=true
VITE_DEV_PORT=5173
VITE_TEST_USER_EMAIL=testuser@example.com
```

### 3. For Production
```env
# Set these in your production environment (not in a file)
VITE_API_BASE_URL=/api/v1
VITE_BACKEND_URL=https://your-production-api.com
VITE_DEFAULT_USERNAME=
VITE_DEFAULT_PASSWORD=
VITE_AUTO_LOGIN=false
VITE_SKIP_INTEGRATION_TESTS=true
```

## Usage in Code

The application provides utility functions to access environment variables:

```typescript
import { 
  getApiBaseUrl, 
  getDefaultCredentials, 
  getBackendUrl,
  shouldAutoLogin 
} from '../utils/env';

// Get API base URL
const apiUrl = getApiBaseUrl();

// Get default credentials (returns empty strings if not set)
const { username, password } = getDefaultCredentials();

// Get backend URL for proxy configuration
const backendUrl = getBackendUrl();

// Check if auto-login is enabled
const autoLogin = shouldAutoLogin();
```

## Environment Variable Validation

The application validates environment variables at startup:

```typescript
import { validateEnvironment } from '../utils/env';

const { isValid, errors } = validateEnvironment();
if (!isValid) {
  console.error('Environment configuration errors:', errors);
}
```

## Migration from Hardcoded Values

### What Was Changed

1. **AuthContext.tsx**: Removed hardcoded user data and credentials
2. **utils/env.ts**: Added comprehensive environment variable support
3. **test/setup.ts**: Updated to use environment variables
4. **vite.config.ts**: Backend URL now configurable
5. **Integration tests**: Use environment-based credentials

### Before (Hardcoded)
```typescript
// ❌ Old hardcoded approach
const defaultUser = {
  username: 'testuser',
  email: 'testuser@example.com'
};
const defaultCredentials = {
  username: 'testuser',
  password: 'testpassword'
};
```

### After (Environment Variables)
```typescript
// ✅ New environment-based approach
const defaultUser = getDefaultUser();
const defaultCredentials = getDefaultCredentials();
```

## Troubleshooting

### Common Issues

1. **Environment variables not loaded**
   - Ensure file is named correctly (`.env.local`)
   - Restart the development server after changes
   - Variables must start with `VITE_`

2. **Auto-login not working**
   - Check `VITE_DEFAULT_USERNAME` and `VITE_DEFAULT_PASSWORD` are set
   - Ensure `VITE_AUTO_LOGIN=true`
   - Check browser console for authentication errors

3. **API calls failing**
   - Verify `VITE_BACKEND_URL` points to running backend
   - Check `VITE_API_BASE_URL` matches backend API path

### Debug Environment
```typescript
import { logEnvironmentConfig } from '../utils/env';

// In development, this logs all environment configuration
logEnvironmentConfig();
```

## Best Practices

1. **Use `.env.local` for local development**
2. **Never commit files with real credentials**
3. **Use empty credentials in production**
4. **Validate environment variables on startup**
5. **Document all environment variables**
6. **Use TypeScript interfaces for type safety**

## Files Modified

- `src/utils/env.ts` - Enhanced environment variable management
- `src/context/AuthContext.tsx` - Removed hardcoded credentials
- `src/test/setup.ts` - Updated test configuration
- `src/api/__tests__/deviceService.integration.test.ts` - Environment-based test config
- `vite.config.ts` - Configurable backend URL
- `env.example` - Environment variable template

All hardcoded credentials have been successfully removed and replaced with configurable environment variables.
