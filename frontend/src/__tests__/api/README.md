# API Tests

These tests verify that the frontend services can communicate correctly with the backend API endpoints. They make real HTTP requests to the API server, so the backend must be running while executing these tests.

## Running the Tests

Make sure the backend server is running before executing these tests:

```bash
# Start the backend server
cd /path/to/backend
python -m uvicorn app.main:app --reload

# In another terminal, run the API tests
cd /path/to/frontend
npm run test:api
```

## During Build

These tests are automatically run during the build process. If any of these tests fail, the build will fail, which helps prevent deploying a frontend that isn't compatible with the backend API.

## Test Coverage

Current API tests cover:

- Container creation

  - Creating containers with valid data
  - Validating that container creation fails with invalid data
  - Checking for duplicate container name errors

- Container retrieval

  - Getting container lists
  - Filtering containers by type

- Container statistics
  - Retrieving container statistics
