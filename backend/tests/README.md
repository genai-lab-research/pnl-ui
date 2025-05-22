# Vertical Farming Control Panel API Tests

This directory contains tests for the Vertical Farming Control Panel API.

## Test Structure

- `tests/` - Main test directory
  - `conftest.py` - Pytest fixtures and test data setup
  - `api/` - API tests
    - `v1/` - Tests for API v1 endpoints
      - `test_containers.py` - Tests for container endpoints
      - (more test files will be added for other endpoints)

## Running Tests

To run the tests, execute the following command from the project root directory:

```bash
cd /Users/ihusar/Documents/Projects/pnl-artifacts-1page/demo/backend
pytest
```

To run tests with more detailed output:

```bash
pytest -v
```

To run specific test files:

```bash
pytest tests/api/v1/test_containers.py
```

## Test Coverage

The tests cover the following endpoints:

1. `GET /api/v1/containers/{container_id}` - Get container details
2. `GET /api/v1/containers/{container_id}/metrics` - Get container metrics
3. `GET /api/v1/containers/{container_id}/crops` - Get container crops
4. `GET /api/v1/containers/{container_id}/activities` - Get container activities

Each test checks:
- Success cases with valid container IDs
- Error cases with invalid container IDs
- Parameter validation where applicable (time_range, pagination, etc.)

## Test Dependencies

The tests use:
- pytest
- pytest-asyncio
- httpx (for FastAPI TestClient)
- SQLAlchemy in-memory database

These dependencies are listed in the main requirements.txt file.

## Test Data

Test data is automatically generated in the `conftest.py` file. It includes:
- Sample container
- Sample tenant
- Sample metrics
- Sample activities
- Sample crops
- Sample trays/panels

This data is created fresh for each test, ensuring test isolation.