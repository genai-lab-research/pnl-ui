# Vertical Farming Control Panel Backend

This is the backend API for the Vertical Farming Control Panel application, built with FastAPI and SQLAlchemy.

## Features

- Complete REST API for managing vertical farming containers and related resources
- Database models for containers, tenants, crops, inventory, devices, metrics, and more
- Automatic sample data generation for development
- Comprehensive API documentation via Swagger UI

## Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   ```
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

Start the application with:
```
uvicorn app.main:app --reload
```

The API will be available at: http://localhost:8000

API documentation is available at: http://localhost:8000/docs

## API Endpoints

The API provides the following main endpoint groups:

- `/api/v1/containers`: Container management endpoints
- `/api/v1/tenants`: Tenant management endpoints
- `/api/v1/inventory`: Inventory (trays and panels) management endpoints
- `/api/v1/devices`: Device management endpoints
- `/api/v1/metrics`: Metrics and analytics endpoints
- `/api/v1/crops`: Crop and seed type management endpoints
- `/api/v1/activity`: Activity logging endpoints
- `/api/v1/alerts`: Alert management endpoints

## Development

The application uses SQLite for simplicity in development.