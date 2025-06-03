from fastapi.testclient import TestClient

from app.main import app
from app.models import ContainerPurpose, ContainerStatus, ContainerType

client = TestClient(app)


class TestContainerListAPI:
    """Test the container list API with filtering and pagination."""

    def test_get_containers_basic(self):
        """Test basic container list retrieval."""
        response = client.get("/api/v1/containers/")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "results" in data
        assert isinstance(data["results"], list)

    def test_get_containers_pagination(self):
        """Test container list pagination."""
        response = client.get("/api/v1/containers/?skip=0&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data["results"]) <= 2

    def test_get_containers_filter_by_name(self):
        """Test filtering containers by name."""
        response = client.get("/api/v1/containers/?name=farm")
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            assert "farm" in container["name"].lower()

    def test_get_containers_filter_by_type(self):
        """Test filtering containers by type."""
        response = client.get(f"/api/v1/containers/?type={ContainerType.PHYSICAL}")
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            assert container["type"] == ContainerType.PHYSICAL

    def test_get_containers_filter_by_status(self):
        """Test filtering containers by status."""
        response = client.get(f"/api/v1/containers/?status={ContainerStatus.ACTIVE}")
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            assert container["status"] == ContainerStatus.ACTIVE

    def test_get_containers_filter_by_purpose(self):
        """Test filtering containers by purpose."""
        response = client.get(
            f"/api/v1/containers/?purpose={ContainerPurpose.DEVELOPMENT}"
        )
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            assert container["purpose"] == ContainerPurpose.DEVELOPMENT

    def test_get_containers_filter_by_location(self):
        """Test filtering containers by location."""
        response = client.get("/api/v1/containers/?location=USA")
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            location_match = (
                container.get("location_country", "").lower() == "usa"
                or "usa" in container.get("location_city", "").lower()
            )
            assert location_match

    def test_get_containers_filter_by_tenant(self):
        """Test filtering containers by tenant."""
        response = client.get("/api/v1/containers/?tenant_id=AeroFarms")
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            assert container["tenant_name"] == "AeroFarms"

    def test_get_containers_filter_by_alerts(self):
        """Test filtering containers by alerts."""
        response = client.get("/api/v1/containers/?has_alerts=true")
        assert response.status_code == 200
        data = response.json()
        # Should return subset with alerts (mocked)
        assert isinstance(data["results"], list)

    def test_get_containers_multiple_filters(self):
        """Test filtering containers with multiple filters."""
        response = client.get(
            f"/api/v1/containers/?type={ContainerType.PHYSICAL}&status={ContainerStatus.ACTIVE}"
        )
        assert response.status_code == 200
        data = response.json()
        for container in data["results"]:
            assert container["type"] == ContainerType.PHYSICAL
            assert container["status"] == ContainerStatus.ACTIVE

    def test_get_containers_response_format(self):
        """Test that container list response has correct format."""
        response = client.get("/api/v1/containers/")
        assert response.status_code == 200
        data = response.json()

        # Check required fields in response
        assert "total" in data
        assert "results" in data

        if data["results"]:
            container = data["results"][0]
            required_fields = [
                "id",
                "name",
                "type",
                "tenant_name",
                "purpose",
                "status",
                "created_at",
                "updated_at",
                "has_alerts",
            ]
            for field in required_fields:
                assert field in container


class TestContainerStatsAPI:
    """Test the container statistics API."""

    def test_get_container_stats(self):
        """Test getting container statistics."""
        response = client.get("/api/v1/containers/stats")
        assert response.status_code == 200
        data = response.json()

        # Check required fields
        assert "physical_count" in data
        assert "virtual_count" in data

        # Check that counts are non-negative integers
        assert isinstance(data["physical_count"], int)
        assert isinstance(data["virtual_count"], int)
        assert data["physical_count"] >= 0
        assert data["virtual_count"] >= 0


class TestContainerCRUDAPI:
    """Test container CRUD operations."""

    def test_get_container_by_id(self):
        """Test getting a specific container by ID."""
        # First get a container ID from the list
        response = client.get("/api/v1/containers/")
        assert response.status_code == 200
        containers = response.json()["results"]

        if containers:
            container_id = containers[0]["id"]

            # Get specific container
            response = client.get(f"/api/v1/containers/{container_id}")
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == container_id

    def test_get_nonexistent_container(self):
        """Test getting a non-existent container."""
        response = client.get("/api/v1/containers/nonexistent-id")
        assert response.status_code == 404

    def test_create_container(self):
        """Test creating a new container."""
        container_data = {
            "name": "test-container",
            "type": ContainerType.VIRTUAL,
            "tenant": "Test Tenant",
            "purpose": ContainerPurpose.DEVELOPMENT,
            "location": {
                "city": "Test City",
                "country": "Test Country",
                "address": "123 Test St",
            },
            "status": ContainerStatus.CREATED,
            "creator": "Test User",
            "seed_types": ["test-seed"],
            "notes": "Test container",
            "shadow_service_enabled": False,
            "ecosystem_connected": False,
            "system_integrations": {
                "fa_integration": {"name": "Test", "enabled": False},
                "aws_environment": {"name": "Test", "enabled": False},
                "mbai_environment": {"name": "Test", "enabled": False},
            },
        }

        response = client.post("/api/v1/containers/", json=container_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == container_data["name"]
        assert data["type"] == container_data["type"]

    def test_update_container(self):
        """Test updating a container."""
        # First create a container
        container_data = {
            "name": "test-update-container",
            "type": ContainerType.VIRTUAL,
            "tenant": "Test Tenant",
            "purpose": ContainerPurpose.DEVELOPMENT,
            "location": {
                "city": "Test City",
                "country": "Test Country",
                "address": "123 Test St",
            },
            "status": ContainerStatus.CREATED,
            "creator": "Test User",
            "seed_types": ["test-seed"],
            "notes": "Test container",
            "shadow_service_enabled": False,
            "ecosystem_connected": False,
            "system_integrations": {
                "fa_integration": {"name": "Test", "enabled": False},
                "aws_environment": {"name": "Test", "enabled": False},
                "mbai_environment": {"name": "Test", "enabled": False},
            },
        }

        create_response = client.post("/api/v1/containers/", json=container_data)
        assert create_response.status_code == 200
        container_id = create_response.json()["id"]

        # Update the container
        update_data = {
            "name": "updated-test-container",
            "status": ContainerStatus.ACTIVE,
        }

        response = client.put(f"/api/v1/containers/{container_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["status"] == update_data["status"]

    def test_shutdown_container(self):
        """Test shutting down a container."""
        # Get an existing container
        response = client.get("/api/v1/containers/")
        assert response.status_code == 200
        containers = response.json()["results"]

        if containers:
            container_id = containers[0]["id"]

            # Shutdown the container
            response = client.post(f"/api/v1/containers/{container_id}/shutdown")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == ContainerStatus.INACTIVE

    def test_delete_container(self):
        """Test deleting a container."""
        # First create a container to delete
        container_data = {
            "name": "test-delete-container",
            "type": ContainerType.VIRTUAL,
            "tenant": "Test Tenant",
            "purpose": ContainerPurpose.DEVELOPMENT,
            "location": {
                "city": "Test City",
                "country": "Test Country",
                "address": "123 Test St",
            },
            "status": ContainerStatus.CREATED,
            "creator": "Test User",
            "seed_types": ["test-seed"],
            "notes": "Test container for deletion",
            "shadow_service_enabled": False,
            "ecosystem_connected": False,
            "system_integrations": {
                "fa_integration": {"name": "Test", "enabled": False},
                "aws_environment": {"name": "Test", "enabled": False},
                "mbai_environment": {"name": "Test", "enabled": False},
            },
        }

        create_response = client.post("/api/v1/containers/", json=container_data)
        assert create_response.status_code == 200
        container_id = create_response.json()["id"]

        # Delete the container
        response = client.delete(f"/api/v1/containers/{container_id}")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data

        # Verify container is deleted
        get_response = client.get(f"/api/v1/containers/{container_id}")
        assert get_response.status_code == 404
