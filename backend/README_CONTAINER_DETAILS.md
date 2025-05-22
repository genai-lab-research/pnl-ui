# Container Details API Documentation

This document provides detailed information about the Container Details API endpoints implemented for the Container Details Page.

## Overview

These endpoints provide data for the Container Details page, including container information, metrics, crops, and activity logs. The API follows RESTful principles and returns JSON responses.

## Base URL

```
/api/v1/containers
```

## Endpoints

### 1. Get Container Details

Retrieves detailed information about a specific container.

**Endpoint:** `GET /api/v1/containers/{container_id}`

**Path Parameters:**
- `container_id` (string): The ID of the container

**Response Format:**
```json
{
  "id": "string",
  "name": "string",
  "type": "PHYSICAL|VIRTUAL",
  "tenant": "string",
  "purpose": "Development|Research|Production",
  "location": {
    "city": "string",
    "country": "string",
    "address": "string"
  },
  "status": "CREATED|ACTIVE|MAINTENANCE|INACTIVE",
  "created": "string",
  "modified": "string",
  "creator": "string",
  "seed_types": ["string"],
  "notes": "string",
  "shadow_service_enabled": "boolean",
  "ecosystem_connected": "boolean",
  "system_integrations": {
    "fa_integration": {
      "name": "Alpha|Dev",
      "enabled": "boolean" 
    },
    "aws_environment": {
      "name": "Dev",
      "enabled": "boolean"
    },
    "mbai_environment": {
      "name": "Disabled",
      "enabled": "boolean"
    }
  }
}
```

### 2. Get Container Metrics

Retrieves metrics for a specific container.

**Endpoint:** `GET /api/v1/containers/{container_id}/metrics`

**Path Parameters:**
- `container_id` (string): The ID of the container

**Query Parameters:**
- `time_range` (optional): Time range for metrics, one of: `WEEK`, `MONTH`, `QUARTER`, `YEAR`. Default: `WEEK`.

**Response Format:**
```json
{
  "temperature": {
    "current": 20,
    "unit": "°C",
    "target": 21
  },
  "humidity": {
    "current": 65,
    "unit": "%",
    "target": 68
  },
  "co2": {
    "current": 860,
    "unit": "ppm",
    "target": 800
  },
  "yield": {
    "current": 51,
    "unit": "KG",
    "trend": 1.5
  },
  "nursery_utilization": {
    "current": 75,
    "unit": "%",
    "trend": 5
  },
  "cultivation_utilization": {
    "current": 90,
    "unit": "%",
    "trend": 15
  }
}
```

### 3. Get Container Crops

Retrieves crops for a specific container with pagination support.

**Endpoint:** `GET /api/v1/containers/{container_id}/crops`

**Path Parameters:**
- `container_id` (string): The ID of the container

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 0)
- `page_size` (optional): Number of items per page (default: 10)
- `seed_type` (optional): Filter by seed type

**Response Format:**
```json
{
  "total": 4,
  "results": [
    {
      "id": "string",
      "seed_type": "string",
      "cultivation_area": "number",
      "nursery_table": "number",
      "last_sd": "string",
      "last_td": "string",
      "last_hd": "string",
      "avg_age": "number",
      "overdue": "number"
    }
  ]
}
```

### 4. Get Container Activities

Retrieves activity logs for a specific container.

**Endpoint:** `GET /api/v1/containers/{container_id}/activities`

**Path Parameters:**
- `container_id` (string): The ID of the container

**Query Parameters:**
- `limit` (optional): Maximum number of activities to return (default: 5)

**Response Format:**
```json
{
  "activities": [
    {
      "id": "string",
      "type": "SEEDED|SYNCED|ENVIRONMENT_CHANGED|CREATED|MAINTENANCE",
      "timestamp": "string",
      "description": "string",
      "user": {
        "name": "string",
        "role": "string"
      },
      "details": {
        "additional_info": "string"
      }
    }
  ]
}
```

## Error Handling

All endpoints use standard HTTP status codes:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Container not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

Error responses are returned in the following format:
```json
{
  "detail": "Error message"
}
```

## Testing the API

You can test these endpoints using curl or any API client:

```bash
# Get container details
curl -X GET "http://localhost:8000/api/v1/containers/container-123"

# Get container metrics
curl -X GET "http://localhost:8000/api/v1/containers/container-123/metrics?time_range=WEEK"

# Get container crops
curl -X GET "http://localhost:8000/api/v1/containers/container-123/crops?page=0&page_size=10"

# Get container activities
curl -X GET "http://localhost:8000/api/v1/containers/container-123/activities?limit=5"
```

## Integration

These endpoints are designed to be consumed by the Container Details Page frontend component, which displays the container information, metrics, crops, and activity logs.

The API is built using FastAPI and SQLAlchemy, with endpoints implemented in the `app/api/v1/endpoints/containers.py` file.