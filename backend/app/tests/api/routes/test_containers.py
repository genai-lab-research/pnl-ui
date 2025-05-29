import pytest
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.models import TimeRange


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app)


class TestContainerEndpoints:
    """Test cases for container API endpoints."""
    
    def test_get_container_by_id_success(self, client: TestClient):
        """Test getting a container by ID - success case."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify container data structure
        assert data["id"] == container_id
        assert data["name"] == "farm-container-04"
        assert data["type"] == "PHYSICAL"
        assert data["tenant"] == "tenant-123"
        assert data["purpose"] == "Development"
        assert data["status"] == "ACTIVE"
        assert data["creator"] == "Mia Adams"
        assert data["seed_types"] == ["Someroots", "sunflower", "Someroots", "Someroots"]
        assert data["notes"] == "Primary production container for Farm A."
        assert data["shadow_service_enabled"] is False
        assert data["ecosystem_connected"] is True
        
        # Verify location structure
        assert "location" in data
        assert data["location"]["city"] == "Lviv"
        assert data["location"]["country"] == "Ukraine"
        assert data["location"]["address"] == "123 Innovation Park"
        
        # Verify system integrations
        assert "system_integrations" in data
        integrations = data["system_integrations"]
        assert integrations["fa_integration"]["name"] == "Alpha"
        assert integrations["fa_integration"]["enabled"] is True
        assert integrations["aws_environment"]["name"] == "Dev"
        assert integrations["aws_environment"]["enabled"] is True
        assert integrations["mbai_environment"]["name"] == "Disabled"
        assert integrations["mbai_environment"]["enabled"] is False

    def test_get_container_by_id_not_found(self, client: TestClient):
        """Test getting a container by ID - not found case."""
        response = client.get("/api/v1/containers/non-existent-id")
        
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]

    def test_get_containers_list(self, client: TestClient):
        """Test getting list of containers."""
        response = client.get("/api/v1/containers/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "data" in data
        assert "count" in data
        assert isinstance(data["data"], list)
        assert data["count"] >= 1
        
        # Verify first container
        first_container = data["data"][0]
        assert "id" in first_container
        assert "name" in first_container
        assert "type" in first_container

    def test_get_containers_with_pagination(self, client: TestClient):
        """Test getting containers with pagination parameters."""
        response = client.get("/api/v1/containers/?skip=0&limit=1")
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["data"]) <= 1

    def test_get_container_metrics_success(self, client: TestClient):
        """Test getting container metrics - success case."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/metrics")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify metrics structure
        required_metrics = ["temperature", "humidity", "co2", "yield", "nursery_utilization", "cultivation_utilization"]
        for metric in required_metrics:
            assert metric in data
            metric_data = data[metric]
            assert "current" in metric_data
            assert "unit" in metric_data
            assert isinstance(metric_data["current"], (int, float))
            assert isinstance(metric_data["unit"], str)
        
        # Verify specific values from mock data
        assert data["temperature"]["current"] == 20
        assert data["temperature"]["unit"] == "°C"
        assert data["temperature"]["target"] == 21
        
        assert data["humidity"]["current"] == 65
        assert data["humidity"]["unit"] == "%"
        assert data["humidity"]["target"] == 68
        
        assert data["co2"]["current"] == 860
        assert data["co2"]["unit"] == "ppm"
        assert data["co2"]["target"] == 800

    def test_get_container_metrics_with_time_range(self, client: TestClient):
        """Test getting container metrics with time range parameter."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/metrics?time_range=WEEK")
        
        assert response.status_code == 200
        data = response.json()
        assert "temperature" in data

    def test_get_container_metrics_not_found(self, client: TestClient):
        """Test getting metrics for non-existent container."""
        response = client.get("/api/v1/containers/non-existent-id/metrics")
        
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]

    def test_get_container_crops_success(self, client: TestClient):
        """Test getting container crops - success case."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/crops")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify crops structure
        assert "total" in data
        assert "results" in data
        assert isinstance(data["results"], list)
        assert data["total"] == 4
        
        # Verify first crop
        first_crop = data["results"][0]
        required_fields = ["id", "seed_type", "cultivation_area", "nursery_table", "last_sd", "last_td", "last_hd", "avg_age", "overdue"]
        for field in required_fields:
            assert field in first_crop
        
        # Verify specific values from mock data
        assert first_crop["seed_type"] == "Salanova Cousteau"
        assert first_crop["cultivation_area"] == 40
        assert first_crop["nursery_table"] == 30

    def test_get_container_crops_with_pagination(self, client: TestClient):
        """Test getting container crops with pagination."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/crops?page=0&page_size=2")
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["results"]) <= 2
        assert data["total"] == 4

    def test_get_container_crops_with_seed_type_filter(self, client: TestClient):
        """Test getting container crops with seed type filter."""
        container_id = "container-04"
        seed_type = "Kiribati"
        response = client.get(f"/api/v1/containers/{container_id}/crops?seed_type={seed_type}")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should only return crops with the specified seed type
        for crop in data["results"]:
            assert crop["seed_type"] == seed_type

    def test_get_container_crops_not_found(self, client: TestClient):
        """Test getting crops for non-existent container."""
        response = client.get("/api/v1/containers/non-existent-id/crops")
        
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]

    def test_get_container_activities_success(self, client: TestClient):
        """Test getting container activities - success case."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/activities")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify activities structure
        assert "activities" in data
        assert isinstance(data["activities"], list)
        assert len(data["activities"]) <= 5  # Default limit
        
        # Verify first activity
        first_activity = data["activities"][0]
        required_fields = ["id", "type", "timestamp", "description", "user", "details"]
        for field in required_fields:
            assert field in first_activity
        
        # Verify user structure
        user = first_activity["user"]
        assert "name" in user
        assert "role" in user
        
        # Verify specific values from mock data (activities are sorted by timestamp desc)
        assert first_activity["type"] in ["SEEDED", "SYNCED", "ENVIRONMENT_CHANGED", "CREATED", "MAINTENANCE"]

    def test_get_container_activities_with_limit(self, client: TestClient):
        """Test getting container activities with custom limit."""
        container_id = "container-04"
        limit = 3
        response = client.get(f"/api/v1/containers/{container_id}/activities?limit={limit}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["activities"]) <= limit

    def test_get_container_activities_not_found(self, client: TestClient):
        """Test getting activities for non-existent container."""
        response = client.get("/api/v1/containers/non-existent-id/activities")
        
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]

    def test_create_container_success(self, client: TestClient):
        """Test creating a new container - success case."""
        container_data = {
            "name": "test-container-01",
            "type": "VIRTUAL",
            "tenant": "test-tenant",
            "purpose": "Research",
            "location": {
                "city": "Kyiv",
                "country": "Ukraine",
                "address": "456 Research Ave"
            },
            "status": "CREATED",
            "creator": "Test User",
            "seed_types": ["Lettuce", "Spinach"],
            "notes": "Test container for research purposes",
            "shadow_service_enabled": True,
            "ecosystem_connected": False,
            "system_integrations": {
                "fa_integration": {
                    "name": "Dev",
                    "enabled": False
                },
                "aws_environment": {
                    "name": "Test",
                    "enabled": True
                },
                "mbai_environment": {
                    "name": "Disabled",
                    "enabled": False
                }
            }
        }
        
        response = client.post("/api/v1/containers/", json=container_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify created container
        assert data["name"] == container_data["name"]
        assert data["type"] == container_data["type"]
        assert data["tenant"] == container_data["tenant"]
        assert "id" in data
        assert "created" in data
        assert "modified" in data

    def test_update_container_success(self, client: TestClient):
        """Test updating an existing container - success case."""
        container_id = "container-04"
        update_data = {
            "notes": "Updated notes for this container",
            "status": "MAINTENANCE"
        }
        
        response = client.put(f"/api/v1/containers/{container_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["notes"] == update_data["notes"]
        assert data["status"] == update_data["status"]

    def test_update_container_not_found(self, client: TestClient):
        """Test updating a non-existent container."""
        update_data = {
            "notes": "Updated notes"
        }
        
        response = client.put("/api/v1/containers/non-existent-id", json=update_data)
        
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]

    def test_delete_container_success(self, client: TestClient):
        """Test deleting a container - success case."""
        # First create a container to delete
        container_data = {
            "name": "to-be-deleted",
            "type": "VIRTUAL",
            "tenant": "test-tenant",
            "purpose": "Development",
            "location": {
                "city": "Test City",
                "country": "Test Country",
                "address": "Test Address"
            },
            "status": "CREATED",
            "creator": "Test User",
            "seed_types": [],
            "notes": "Container to be deleted",
            "shadow_service_enabled": False,
            "ecosystem_connected": False,
            "system_integrations": {
                "fa_integration": {"name": "Dev", "enabled": False},
                "aws_environment": {"name": "Dev", "enabled": False},
                "mbai_environment": {"name": "Disabled", "enabled": False}
            }
        }
        
        create_response = client.post("/api/v1/containers/", json=container_data)
        assert create_response.status_code == 200
        created_container = create_response.json()
        container_id = created_container["id"]
        
        # Now delete the container
        delete_response = client.delete(f"/api/v1/containers/{container_id}")
        
        assert delete_response.status_code == 200
        assert "deleted successfully" in delete_response.json()["message"]
        
        # Verify container is deleted
        get_response = client.get(f"/api/v1/containers/{container_id}")
        assert get_response.status_code == 404

    def test_delete_container_not_found(self, client: TestClient):
        """Test deleting a non-existent container."""
        response = client.delete("/api/v1/containers/non-existent-id")
        
        assert response.status_code == 404
        assert "Container not found" in response.json()["detail"]


class TestContainerValidation:
    """Test cases for container data validation."""
    
    def test_create_container_invalid_data(self, client: TestClient):
        """Test creating container with invalid data."""
        invalid_data = {
            "name": "",  # Empty name should be invalid
            "type": "INVALID_TYPE",  # Invalid enum value
            "tenant": "test-tenant"
            # Missing required fields
        }
        
        response = client.post("/api/v1/containers/", json=invalid_data)
        
        assert response.status_code == 422  # Validation error

    def test_get_container_metrics_invalid_time_range(self, client: TestClient):
        """Test getting metrics with invalid time range."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/metrics?time_range=INVALID")
        
        assert response.status_code == 422  # Validation error

    def test_get_container_crops_invalid_pagination(self, client: TestClient):
        """Test getting crops with invalid pagination parameters."""
        container_id = "container-04"
        
        # Test negative page
        response = client.get(f"/api/v1/containers/{container_id}/crops?page=-1")
        assert response.status_code == 422
        
        # Test page_size exceeding limit
        response = client.get(f"/api/v1/containers/{container_id}/crops?page_size=1000")
        assert response.status_code == 422

    def test_get_container_activities_invalid_limit(self, client: TestClient):
        """Test getting activities with invalid limit."""
        container_id = "container-04"
        
        # Test limit exceeding maximum
        response = client.get(f"/api/v1/containers/{container_id}/activities?limit=100")
        assert response.status_code == 422
        
        # Test zero limit
        response = client.get(f"/api/v1/containers/{container_id}/activities?limit=0")
        assert response.status_code == 422