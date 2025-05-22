import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.enums import MetricTimeRange


def test_get_container_detail(client: TestClient, db_session: Session):
    """Test retrieving container details."""
    # Test successful retrieval
    response = client.get("/api/v1/containers/container-123")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "container-123"
    assert data["name"] == "Test Container"
    assert data["tenant"] == "Test Tenant"
    assert data["location"]["city"] == "Test City"
    assert data["location"]["country"] == "Test Country"
    assert len(data["seed_types"]) == 2
    assert data["system_integrations"]["fa_integration"]["name"] == "Alpha"
    assert data["system_integrations"]["aws_environment"]["enabled"] is True
    assert data["system_integrations"]["mbai_environment"]["enabled"] is False
    
    # Test with non-existent container
    response = client.get("/api/v1/containers/non-existent")
    assert response.status_code == 404


def test_get_container_metrics(client: TestClient, db_session: Session):
    """Test retrieving container metrics."""
    # Test default params
    response = client.get("/api/v1/containers/container-123/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "temperature" in data
    assert data["temperature"]["current"] == 20.5
    assert data["temperature"]["unit"] == "°C"
    assert "humidity" in data
    assert data["humidity"]["current"] == 65.2
    assert data["humidity"]["unit"] == "%"
    assert "co2" in data
    assert data["co2"]["current"] == 850
    assert data["co2"]["unit"] == "ppm"
    assert "yield" in data
    assert data["yield"]["current"] == 51.3
    assert data["yield"]["unit"] == "KG"
    assert data["yield"].get("trend") is not None  # Check that trend is present
    assert "nursery_utilization" in data
    assert data["nursery_utilization"]["current"] == 75
    assert data["nursery_utilization"]["unit"] == "%"
    assert "cultivation_utilization" in data
    assert data["cultivation_utilization"]["current"] == 90
    assert data["cultivation_utilization"]["unit"] == "%"
    
    # Test with specific time_range to ensure "yield" field is correctly included for all time ranges
    for time_range in ["WEEK", "MONTH", "QUARTER", "YEAR"]:
        response = client.get(f"/api/v1/containers/container-123/metrics?time_range={time_range}")
        assert response.status_code == 200
        data = response.json()
        assert "temperature" in data
        assert "yield" in data  # Verify "yield" field is included
        assert data["yield"]["current"] is not None
        assert data["yield"]["unit"] == "KG"
    
    # Test with invalid time_range
    response = client.get("/api/v1/containers/container-123/metrics?time_range=INVALID")
    assert response.status_code == 422  # Validation error
    
    # Test with non-existent container
    response = client.get("/api/v1/containers/non-existent/metrics")
    assert response.status_code == 404
    
    # Test with container that has no metrics - should return default values
    # First, create a new container without metrics
    from app.models.models import Container
    from app.models.enums import ContainerType, ContainerPurpose, ContainerStatus
    
    new_container = Container(
        id="container-no-metrics",
        name="Container Without Metrics",
        type=ContainerType.VIRTUAL,
        tenant_id="tenant-123",
        purpose=ContainerPurpose.DEVELOPMENT,
        status=ContainerStatus.ACTIVE
    )
    db_session.add(new_container)
    db_session.commit()
    
    # Test the endpoint
    response = client.get("/api/v1/containers/container-no-metrics/metrics")
    assert response.status_code == 200
    data = response.json()
    
    # Verify all required fields are present with default values
    assert "yield" in data
    assert data["yield"]["current"] == 51.0  # Default value
    assert data["yield"]["unit"] == "KG"
    assert data["yield"]["trend"] == 1.5  # Default trend


def test_get_container_crops(client: TestClient, db_session: Session):
    """Test retrieving container crops."""
    # Test default parameters
    response = client.get("/api/v1/containers/container-123/crops")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert data["total"] > 0
    assert "results" in data
    assert len(data["results"]) > 0
    assert "id" in data["results"][0]
    assert "seed_type" in data["results"][0]
    
    # Test with pagination
    response = client.get("/api/v1/containers/container-123/crops?page=0&page_size=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 1
    
    # Test with seed_type filter
    seed_type = db_session.query("Salanova Cousteau").first()
    if seed_type:
        response = client.get(f"/api/v1/containers/container-123/crops?seed_type={seed_type}")
        assert response.status_code == 200
    
    # Test with non-existent container
    response = client.get("/api/v1/containers/non-existent/crops")
    assert response.status_code == 404


def test_get_container_activities(client: TestClient, db_session: Session):
    """Test retrieving container activities."""
    # Test default parameters
    response = client.get("/api/v1/containers/container-123/activities")
    assert response.status_code == 200
    data = response.json()
    assert "activities" in data
    assert len(data["activities"]) > 0
    assert "id" in data["activities"][0]
    assert "type" in data["activities"][0]
    assert "timestamp" in data["activities"][0]
    assert "user" in data["activities"][0]
    assert "name" in data["activities"][0]["user"]
    assert "role" in data["activities"][0]["user"]
    
    # Test with limit
    response = client.get("/api/v1/containers/container-123/activities?limit=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data["activities"]) == 1
    
    # Test with non-existent container
    response = client.get("/api/v1/containers/non-existent/activities")
    assert response.status_code == 404