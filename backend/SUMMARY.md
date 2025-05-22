# FastAPI Backend for Container Details Page

This backend API has been implemented to support the Container Details Page as specified in the page3_routing.md document.

## Implemented Endpoints

1. **Container Details API**
   - `GET /api/v1/containers/{container_id}` - Get detailed information about a specific container
   - Response includes container details, system integrations, location, and other metadata

2. **Container Metrics API**
   - `GET /api/v1/containers/{container_id}/metrics` - Get metrics for a container
   - Supports time range filtering (WEEK, MONTH, QUARTER, YEAR)
   - Returns temperature, humidity, CO2, yield, and utilization metrics

3. **Container Crops API**
   - `GET /api/v1/containers/{container_id}/crops` - Get crops for a container
   - Supports pagination with page and page_size parameters
   - Supports filtering by seed type
   - Returns crop details including utilization metrics and dates

4. **Container Activities API**
   - `GET /api/v1/containers/{container_id}/activities` - Get activity logs for a container
   - Supports limiting the number of returned activities
   - Returns activities with user information and timestamps

## Code Structure

The implementation follows the existing project structure:

- **Schemas**
  - Added container detail schemas in app/schemas/container.py
  - Added container metrics schemas in app/schemas/metrics.py
  - Added container crops schemas in app/schemas/crop.py
  - Added container activities schemas in app/schemas/activity.py

- **API Endpoints**
  - All endpoints are implemented in app/api/v1/endpoints/containers.py
  - Each endpoint handles error cases like container not found

- **Sample Data**
  - Added sample data generation script in app/database/container_details_samples.py
  - Updated app/database/init_db.py to include container details sample data
  - Updated app/database/update_sample_data.py to include container details sample data

- **Testing**
  - Created test directory structure with __init__.py files
  - Added tests/conftest.py with test fixtures
  - Added tests/api/v1/test_containers.py for testing container APIs

## Running the API

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the API:
   ```bash
   uvicorn app.main:app --reload
   ```

3. Access the API documentation:
   http://localhost:8000/docs

## Sample Data

The API includes sample data for testing the Container Details page. The sample container has:

- ID: container-details-04
- Name: farm-container-04
- Tenant: Farm Technologies Corp
- Type: PHYSICAL
- Location: Lviv, Ukraine
- Status: ACTIVE
- System integrations configured
- Sample crops and metrics data
- Sample activity logs

## Testing

Tests are available for the API endpoints. Run them with:

```bash
pytest
```

## Documentation

The API endpoints are documented in:
- Swagger UI (http://localhost:8000/docs)
- README_CONTAINER_DETAILS.md file

## Next Steps

1. Verify that the API meets all requirements in the page3_routing.md document
2. Integrate the API with the frontend Container Details page
3. Write additional tests for edge cases
4. Add authentication and authorization if needed