"""Integration tests for API endpoints."""

import json
import pytest
from fastapi import status


class TestLocationEndpoints:
    """Test cases for location API endpoints."""

    def test_create_location(self, client):
        """Test POST /api/locations/."""
        location_data = {
            "city": "Seattle",
            "country": "USA",
            "address": "123 Pine Street"
        }
        
        response = client.post("/api/locations/", json=location_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["city"] == "Seattle"
        assert data["country"] == "USA"
        assert data["address"] == "123 Pine Street"
        assert "id" in data

    def test_create_location_invalid_data(self, client):
        """Test creating location with invalid data."""
        location_data = {
            "city": "",  # Invalid: empty city
            "country": "USA"
        }
        
        response = client.post("/api/locations/", json=location_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_location(self, client, sample_location):
        """Test GET /api/locations/{location_id}."""
        response = client.get(f"/api/locations/{sample_location.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_location.id
        assert data["city"] == sample_location.city
        assert data["country"] == sample_location.country

    def test_get_location_not_found(self, client):
        """Test getting non-existent location."""
        response = client.get("/api/locations/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Location not found"

    def test_list_locations(self, client, db_session):
        """Test GET /api/locations/."""
        # Create multiple locations
        locations_data = [
            {"city": "Boston", "country": "USA"},
            {"city": "Miami", "country": "USA"},
            {"city": "Toronto", "country": "Canada"},
        ]
        
        for location_data in locations_data:
            client.post("/api/locations/", json=location_data)
        
        response = client.get("/api/locations/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) >= 3

    def test_list_locations_with_pagination(self, client, db_session):
        """Test GET /api/locations/ with pagination."""
        # Create multiple locations
        for i in range(5):
            location_data = {"city": f"City{i}", "country": "Country"}
            client.post("/api/locations/", json=location_data)
        
        # Test pagination
        response = client.get("/api/locations/?skip=0&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        
        response = client.get("/api/locations/?skip=2&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2

    def test_update_location(self, client, sample_location):
        """Test PUT /api/locations/{location_id}."""
        update_data = {
            "city": "Updated City",
            "address": "Updated Address"
        }
        
        response = client.put(f"/api/locations/{sample_location.id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["city"] == "Updated City"
        assert data["address"] == "Updated Address"
        assert data["country"] == sample_location.country  # Unchanged

    def test_update_location_not_found(self, client):
        """Test updating non-existent location."""
        update_data = {"city": "New City"}
        
        response = client.put("/api/locations/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_location(self, client, sample_location):
        """Test DELETE /api/locations/{location_id}."""
        response = client.delete(f"/api/locations/{sample_location.id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify it's deleted
        response = client.get(f"/api/locations/{sample_location.id}")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_location_not_found(self, client):
        """Test deleting non-existent location."""
        response = client.delete("/api/locations/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestContainerEndpoints:
    """Test cases for container API endpoints."""

    def test_create_container(self, client, sample_location):
        """Test POST /api/containers/."""
        container_data = {
            "type": "virtual",
            "name": "API Test Container",
            "tenant": "api-tenant",
            "purpose": "research",
            "location": f"{sample_location.city}, {sample_location.country}",
            "seed_types": ["api-seed-1", "api-seed-2"],
            "notes": "API integration test",
            "shadow_service_enabled": True,
            "connect_to_other_systems": False
        }
        
        response = client.post("/api/containers/", json=container_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["type"] == "virtual"
        assert data["name"] == "API Test Container"
        assert data["tenant"] == "api-tenant"
        assert data["purpose"] == "research"
        assert data["location"]["city"] == sample_location.city
        assert data["location"]["country"] == sample_location.country
        assert "created" in data
        assert "modified" in data
        assert "id" in data  # Auto-generated UUID

    def test_create_container_invalid_location(self, client):
        """Test creating container with empty location."""
        container_data = {
            "type": "physical",
            "name": "Invalid Location Container",
            "tenant": "test-tenant",
            "purpose": "development",
            "location": "",  # Empty location
            "shadow_service_enabled": False,
            "connect_to_other_systems": False
        }
        
        response = client.post("/api/containers/", json=container_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_container_duplicate_name(self, client, sample_container):
        """Test creating container with duplicate name and tenant."""
        container_data = {
            "type": "physical",
            "name": sample_container.name,  # Same name
            "tenant": sample_container.tenant,  # Same tenant
            "purpose": "development",
            "location": "Test City, Test Country",
            "shadow_service_enabled": False,
            "connect_to_other_systems": False
        }
        
        response = client.post("/api/containers/", json=container_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already exists" in response.json()["detail"]

    def test_create_container_invalid_enum(self, client, sample_location):
        """Test creating container with invalid enum values."""
        container_data = {
            "id": "invalid-enum-container",
            "type": "invalid_type",  # Invalid enum value
            "name": "Invalid Enum Container",
            "tenant": "test-tenant",
            "purpose": "development",
            "location_id": sample_location.id,
            "status": "active"
        }
        
        response = client.post("/api/containers/", json=container_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_container(self, client, sample_container):
        """Test GET /api/containers/{container_id}."""
        response = client.get(f"/api/containers/{sample_container.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_container.id
        assert data["name"] == sample_container.name
        assert data["type"] == sample_container.type
        assert data["location"]["id"] == sample_container.location_id

    def test_get_container_not_found(self, client):
        """Test getting non-existent container."""
        response = client.get("/api/containers/non-existent")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Container not found"

    def test_list_containers(self, client, multiple_containers):
        """Test GET /api/containers/."""
        response = client.get("/api/containers/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 5

    def test_list_containers_with_search(self, client, multiple_containers):
        """Test GET /api/containers/ with search filter."""
        response = client.get("/api/containers/?search=Container 1")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert "Container 1" in data[0]["name"]

    def test_list_containers_with_type_filter(self, client, multiple_containers):
        """Test GET /api/containers/ with type filter."""
        response = client.get("/api/containers/?type=physical")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3  # containers 0, 2, 4 are physical
        for container in data:
            assert container["type"] == "physical"

    def test_list_containers_with_tenant_filter(self, client, multiple_containers):
        """Test GET /api/containers/ with tenant filter."""
        response = client.get("/api/containers/?tenant=tenant-0")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3  # containers 0, 2, 4 have tenant-0
        for container in data:
            assert container["tenant"] == "tenant-0"

    def test_list_containers_with_status_filter(self, client, multiple_containers):
        """Test GET /api/containers/ with status filter."""
        response = client.get("/api/containers/?status=active")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 4  # containers 0, 1, 2, 3 are active
        for container in data:
            assert container["status"] == "active"

    def test_list_containers_with_alerts_filter(self, client, multiple_containers):
        """Test GET /api/containers/ with alerts filter."""
        response = client.get("/api/containers/?has_alerts=true")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2  # containers 0, 3 have alerts
        for container in data:
            assert container["has_alert"] is True

    def test_list_containers_with_purpose_filter(self, client, multiple_containers):
        """Test GET /api/containers/ with purpose filter."""
        response = client.get("/api/containers/?purpose=development")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3  # containers 0, 1, 2 are development
        for container in data:
            assert container["purpose"] == "development"

    def test_list_containers_with_pagination(self, client, multiple_containers):
        """Test GET /api/containers/ with pagination."""
        response = client.get("/api/containers/?skip=0&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        
        response = client.get("/api/containers/?skip=2&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2

    def test_list_containers_combined_filters(self, client, multiple_containers):
        """Test GET /api/containers/ with multiple filters."""
        response = client.get("/api/containers/?type=physical&status=active&tenant=tenant-0")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Should get containers 0, 2 (both physical, active, tenant-0)
        assert len(data) == 2
        for container in data:
            assert container["type"] == "physical"
            assert container["status"] == "active"
            assert container["tenant"] == "tenant-0"

    def test_update_container(self, client, sample_container):
        """Test PUT /api/containers/{container_id}."""
        update_data = {
            "name": "Updated API Container",
            "status": "maintenance",
            "has_alert": True,
            "notes": "Updated through API"
        }
        
        response = client.put(f"/api/containers/{sample_container.id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Updated API Container"
        assert data["status"] == "maintenance"
        assert data["has_alert"] is True
        assert data["notes"] == "Updated through API"
        # Unchanged fields
        assert data["type"] == sample_container.type
        assert data["tenant"] == sample_container.tenant

    def test_update_container_invalid_location(self, client, sample_container):
        """Test updating container with invalid location."""
        update_data = {"location_id": 999}
        
        response = client.put(f"/api/containers/{sample_container.id}", json=update_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Location with ID 999 does not exist" in response.json()["detail"]

    def test_update_container_not_found(self, client):
        """Test updating non-existent container."""
        update_data = {"name": "New Name"}
        
        response = client.put("/api/containers/non-existent", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_container(self, client, sample_container):
        """Test DELETE /api/containers/{container_id}."""
        response = client.delete(f"/api/containers/{sample_container.id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify it's deleted
        response = client.get(f"/api/containers/{sample_container.id}")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_container_not_found(self, client):
        """Test deleting non-existent container."""
        response = client.delete("/api/containers/non-existent")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestInventoryMetricsEndpoints:
    """Test cases for inventory metrics API endpoints."""

    def test_get_inventory_metrics_current_date(self, client, sample_container, sample_inventory_metrics):
        """Test GET /api/containers/{container_id}/inventory/metrics."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/metrics")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["container_id"] == sample_container.id
        assert data["nursery_station_utilization"] == 75
        assert data["cultivation_area_utilization"] == 80

    def test_get_inventory_metrics_specific_date(self, client, sample_container, db_session):
        """Test GET /api/containers/{container_id}/inventory/metrics with date parameter."""
        # First create metrics for a specific date using the test db session
        from datetime import date
        from app.models import InventoryMetrics
        
        metrics = InventoryMetrics(
            container_id=sample_container.id,
            date=date(2024, 1, 15),
            nursery_station_utilization=60,
            cultivation_area_utilization=70
        )
        db_session.add(metrics)
        db_session.commit()
        
        response = client.get(f"/api/containers/{sample_container.id}/inventory/metrics?date=2024-01-15")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["nursery_station_utilization"] == 60
        assert data["cultivation_area_utilization"] == 70

    def test_get_inventory_metrics_invalid_date_format(self, client, sample_container):
        """Test GET /api/containers/{container_id}/inventory/metrics with invalid date format."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/metrics?date=invalid-date")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid date format" in response.json()["detail"]

    def test_get_inventory_metrics_container_not_found(self, client):
        """Test getting inventory metrics for non-existent container."""
        response = client.get("/api/containers/non-existent/inventory/metrics")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Container with id non-existent not found" in response.json()["detail"]

    def test_get_inventory_metrics_no_data_returns_default(self, client, sample_container):
        """Test getting inventory metrics when no data exists returns default values."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/metrics")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["nursery_station_utilization"] == 0
        assert data["cultivation_area_utilization"] == 0


class TestCropsEndpoints:
    """Test cases for crops API endpoints."""

    def test_get_crops_by_container(self, client, sample_container, multiple_crops):
        """Test GET /api/containers/{container_id}/inventory/crops."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3
        for crop in data:
            assert "id" in crop
            assert "seed_type" in crop
            assert "location" in crop
            assert crop["location"]["type"] in ["tray"]

    def test_get_crops_by_container_with_seed_type_filter(self, client, sample_container, multiple_crops):
        """Test GET /api/containers/{container_id}/inventory/crops with seed_type filter."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops?seed_type=tomato")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["seed_type"] == "tomato"

    def test_get_crops_by_container_with_pagination(self, client, sample_container, multiple_crops):
        """Test GET /api/containers/{container_id}/inventory/crops with pagination."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops?skip=0&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops?skip=2&limit=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1

    def test_get_crops_container_not_found(self, client):
        """Test getting crops for non-existent container."""
        response = client.get("/api/containers/non-existent/inventory/crops")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Container with id non-existent not found" in response.json()["detail"]

    def test_get_crops_empty_container(self, client, sample_container):
        """Test getting crops for container with no crops."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 0


class TestApplicationEndpoints:
    """Test cases for application-level endpoints."""

    def test_root_endpoint(self, client):
        """Test GET /."""
        response = client.get("/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_health_endpoint(self, client):
        """Test GET /health."""
        response = client.get("/health")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"


class TestCORSConfiguration:
    """Test CORS configuration."""

    def test_cors_headers(self, client):
        """Test CORS headers are properly set."""
        headers = {"Origin": "http://localhost:3000"}
        response = client.get("/health", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
        assert response.headers.get("access-control-allow-credentials") == "true"

    def test_cors_preflight(self, client):
        """Test CORS preflight request."""
        headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
        response = client.options("/api/containers/", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        assert "access-control-allow-origin" in response.headers


class TestErrorHandling:
    """Test error handling scenarios."""

    def test_invalid_json(self, client):
        """Test handling of invalid JSON."""
        response = client.post(
            "/api/locations/",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_missing_required_fields(self, client):
        """Test handling of missing required fields."""
        container_data = {
            "id": "missing-fields-container",
            # Missing required fields like type, name, etc.
        }
        
        response = client.post("/api/containers/", json=container_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_invalid_query_parameters(self, client):
        """Test handling of invalid query parameters."""
        response = client.get("/api/containers/?skip=-1")  # Invalid skip value
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_non_existent_endpoint(self, client):
        """Test handling of non-existent endpoints."""
        response = client.get("/api/non-existent/")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestInventoryEndpoints:
    """Test cases for inventory API endpoints."""

    def test_get_nursery_station(self, client, sample_trays):
        """Test GET /api/containers/{container_id}/inventory/nursery."""
        response = client.get("/api/containers/container-1/inventory/nursery")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "utilization_percentage" in data
        assert "upper_shelf" in data
        assert "lower_shelf" in data
        assert "off_shelf_trays" in data
        assert isinstance(data["utilization_percentage"], int)
        assert isinstance(data["upper_shelf"], list)
        assert isinstance(data["lower_shelf"], list)
        assert isinstance(data["off_shelf_trays"], list)

    def test_get_nursery_station_with_date_filter(self, client, sample_trays):
        """Test GET /api/containers/{container_id}/inventory/nursery with date filter."""
        response = client.get("/api/containers/container-1/inventory/nursery?date=2024-01-01")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "utilization_percentage" in data

    def test_get_nursery_station_invalid_date(self, client):
        """Test GET /api/containers/{container_id}/inventory/nursery with invalid date."""
        response = client.get("/api/containers/container-1/inventory/nursery?date=invalid-date")
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_add_tray(self, client):
        """Test POST /api/containers/{container_id}/inventory/tray."""
        tray_data = {
            "rfid_tag": "NEW_TRAY_001",
            "shelf": "upper",
            "slot_number": 3
        }
        
        response = client.post("/api/containers/container-1/inventory/tray", json=tray_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == "tray_NEW_TRAY_001"
        assert data["rfid_tag"] == "NEW_TRAY_001"
        assert data["location"]["shelf"] == "upper"
        assert data["location"]["slot_number"] == 3
        assert data["is_empty"] is True
        assert data["utilization_percentage"] == 0
        assert data["crop_count"] == 0

    def test_add_tray_invalid_data(self, client):
        """Test POST /api/containers/{container_id}/inventory/tray with invalid data."""
        tray_data = {
            "rfid_tag": "",  # Invalid: empty rfid_tag
            "shelf": "upper",
            "slot_number": 1
        }
        
        response = client.post("/api/containers/container-1/inventory/tray", json=tray_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_add_tray_negative_slot_number(self, client):
        """Test POST /api/containers/{container_id}/inventory/tray with negative slot number."""
        tray_data = {
            "rfid_tag": "INVALID_TRAY",
            "shelf": "upper",
            "slot_number": -1  # Invalid: negative slot number
        }
        
        response = client.post("/api/containers/container-1/inventory/tray", json=tray_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_get_crops(self, client, multiple_crops):
        """Test GET /api/containers/{container_id}/inventory/crops."""
        response = client.get("/api/containers/test-container-001/inventory/crops")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3
        
        # Verify crop structure
        crop = data[0]
        assert "id" in crop
        assert "seed_type" in crop
        assert "seed_date" in crop
        assert "transplanting_date_planned" in crop
        assert "harvesting_date_planned" in crop
        assert "age" in crop
        assert "status" in crop
        assert "overdue_days" in crop
        assert "location" in crop
        
        # Verify location structure
        location = crop["location"]
        assert "type" in location
        assert "row" in location
        assert "column" in location
        assert "channel" in location
        assert "position" in location

    def test_get_crops_with_seed_type_filter(self, client, multiple_crops):
        """Test GET /api/containers/{container_id}/inventory/crops with seed type filter."""
        response = client.get("/api/containers/test-container-001/inventory/crops?seed_type=tomato")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["seed_type"] == "tomato"

    def test_get_crops_non_existent_container(self, client):
        """Test GET /api/containers/{container_id}/inventory/crops for non-existent container."""
        response = client.get("/api/containers/non-existent/inventory/crops")
        
        # Should return appropriate error for non-existent container
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]

    def test_get_cultivation_area(self, client, sample_panels):
        """Test GET /api/containers/{container_id}/inventory/cultivation."""
        response = client.get("/api/containers/container-1/inventory/cultivation")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "utilization_percentage" in data
        assert "wall_1" in data
        assert "wall_2" in data
        assert "wall_3" in data
        assert "wall_4" in data
        assert "off_wall_panels" in data
        assert isinstance(data["utilization_percentage"], int)
        assert isinstance(data["wall_1"], list)
        assert isinstance(data["wall_2"], list)
        assert isinstance(data["wall_3"], list)
        assert isinstance(data["wall_4"], list)
        assert isinstance(data["off_wall_panels"], list)

    def test_get_cultivation_area_with_date_filter(self, client, sample_panels):
        """Test GET /api/containers/{container_id}/inventory/cultivation with date filter."""
        response = client.get("/api/containers/container-1/inventory/cultivation?date=2024-01-01")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "utilization_percentage" in data

    def test_get_cultivation_area_invalid_date(self, client):
        """Test GET /api/containers/{container_id}/inventory/cultivation with invalid date."""
        response = client.get("/api/containers/container-1/inventory/cultivation?date=invalid-date")
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_inventory_endpoints_cors(self, client):
        """Test CORS headers on inventory endpoints."""
        headers = {"Origin": "http://localhost:3000"}
        
        response = client.get("/api/containers/container-1/inventory/nursery", headers=headers)
        
        assert response.status_code == status.HTTP_200_OK
        # CORS headers should be present
        assert "access-control-allow-origin" in response.headers

    def test_inventory_api_content_type(self, client, sample_trays):
        """Test that inventory API returns proper content type."""
        response = client.get("/api/containers/container-1/inventory/nursery")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["content-type"] == "application/json"

    def test_inventory_api_1_1_mapping(self, client, sample_trays, sample_panels, multiple_crops):
        """Test 1-1 mapping between routes and response types as per specification."""
        # Test nursery station endpoint maps to NurseryStationResponse
        response = client.get("/api/containers/container-1/inventory/nursery")
        assert response.status_code == status.HTTP_200_OK
        nursery_data = response.json()
        required_fields = ["utilization_percentage", "upper_shelf", "lower_shelf", "off_shelf_trays"]
        for field in required_fields:
            assert field in nursery_data
        
        # Test tray creation maps to TrayResponse
        tray_data = {"rfid_tag": "TEST_TRAY", "shelf": "upper", "slot_number": 1}
        response = client.post("/api/containers/container-1/inventory/tray", json=tray_data)
        assert response.status_code == status.HTTP_200_OK
        tray_response = response.json()
        tray_required_fields = ["id", "rfid_tag", "utilization_percentage", "crop_count", "location", "crops", "is_empty", "provisioned_at"]
        for field in tray_required_fields:
            assert field in tray_response
        
        # Test crops endpoint maps to CropResponse list
        response = client.get("/api/containers/test-container-001/inventory/crops")
        assert response.status_code == status.HTTP_200_OK
        crops_data = response.json()
        assert isinstance(crops_data, list)
        if crops_data:
            crop_required_fields = ["id", "seed_type", "seed_date", "transplanting_date_planned", "harvesting_date_planned", "age", "status", "overdue_days", "location"]
            for field in crop_required_fields:
                assert field in crops_data[0]
        
        # Test cultivation area maps to CultivationAreaResponse
        response = client.get("/api/containers/container-1/inventory/cultivation")
        assert response.status_code == status.HTTP_200_OK
        cultivation_data = response.json()
        cultivation_required_fields = ["utilization_percentage", "wall_1", "wall_2", "wall_3", "wall_4", "off_wall_panels"]
        for field in cultivation_required_fields:
            assert field in cultivation_data


class TestCropEndpoint:
    """Test cases for the specific crop endpoint as per specification."""

    def test_get_crop_success(self, client, sample_crop_with_location):
        """Test GET /api/containers/{container_id}/inventory/crop/{crop_id} success case."""
        container_id, crop = sample_crop_with_location
        
        response = client.get(f"/api/containers/{container_id}/inventory/crop/{crop.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure matches specification exactly
        required_fields = [
            "id", "seed_type", "seed_date", "transplanting_date_planned", 
            "harvesting_date_planned", "transplanted_date", "harvesting_date",
            "age", "status", "overdue_days", "location"
        ]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
        
        # Verify field values
        assert data["id"] == crop.id
        assert data["seed_type"] == crop.seed_type
        assert data["age"] == crop.age
        assert data["status"] == crop.status
        
        # Verify location structure
        location = data["location"]
        location_required_fields = ["type", "tray_id", "panel_id", "row", "column", "channel", "position"]
        for field in location_required_fields:
            assert field in location, f"Missing location field: {field}"

    def test_get_crop_not_found(self, client, sample_container):
        """Test GET /api/containers/{container_id}/inventory/crop/{crop_id} when crop not found."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crop/non-existent-crop")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Crop not found"

    def test_get_crop_invalid_container(self, client):
        """Test GET /api/containers/{container_id}/inventory/crop/{crop_id} with invalid container."""
        response = client.get("/api/containers/non-existent-container/inventory/crop/some-crop")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_crop_response_format(self, client, sample_crop_with_location):
        """Test that the crop response exactly matches the specification format."""
        container_id, crop = sample_crop_with_location
        
        response = client.get(f"/api/containers/{container_id}/inventory/crop/{crop.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify data types match specification
        assert isinstance(data["id"], str)
        assert isinstance(data["seed_type"], str)
        assert isinstance(data["seed_date"], str)  # ISO 8601 format
        assert isinstance(data["age"], int)
        assert isinstance(data["status"], str)
        assert data["age"] >= 0  # Age constraint
        
        # Verify location data types
        location = data["location"]
        assert isinstance(location["type"], str)
        assert isinstance(location["row"], int)
        assert isinstance(location["column"], int)
        assert isinstance(location["position"], int)
        assert location["row"] >= 0
        assert location["column"] >= 0
        assert location["position"] >= 0

    def test_get_crop_status_values(self, client, sample_crop_with_location):
        """Test that crop status values match specification constraints."""
        container_id, crop = sample_crop_with_location
        
        response = client.get(f"/api/containers/{container_id}/inventory/crop/{crop.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify status is one of the allowed values
        allowed_statuses = ["seeded", "transplanted", "growing", "harvested", "overdue"]
        assert data["status"] in allowed_statuses

    def test_get_crop_location_types(self, client, sample_crop_with_location):
        """Test that crop location types match specification constraints."""
        container_id, crop = sample_crop_with_location
        
        response = client.get(f"/api/containers/{container_id}/inventory/crop/{crop.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify location type is one of the allowed values
        allowed_location_types = ["tray", "panel", "row", "custom"]
        assert data["location"]["type"] in allowed_location_types

    def test_get_crop_date_format(self, client, sample_crop_with_location):
        """Test that crop dates are in ISO 8601 format."""
        container_id, crop = sample_crop_with_location
        
        response = client.get(f"/api/containers/{container_id}/inventory/crop/{crop.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify date format (ISO 8601)
        import datetime
        try:
            datetime.datetime.fromisoformat(data["seed_date"].replace('Z', '+00:00'))
        except ValueError:
            pytest.fail("seed_date is not in ISO 8601 format")
        
        # Check optional dates if present
        if data["transplanting_date_planned"]:
            try:
                datetime.datetime.fromisoformat(data["transplanting_date_planned"].replace('Z', '+00:00'))
            except ValueError:
                pytest.fail("transplanting_date_planned is not in ISO 8601 format")

    def test_get_crop_overdue_days_constraint(self, client, sample_crop_with_location):
        """Test that overdue_days meets specification constraints."""
        container_id, crop = sample_crop_with_location
        
        response = client.get(f"/api/containers/{container_id}/inventory/crop/{crop.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify overdue_days constraint (>= 0 if present)
        if data["overdue_days"] is not None:
            assert data["overdue_days"] >= 0
