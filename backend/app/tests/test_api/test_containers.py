"""Tests for Container API endpoints."""

import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.api
@pytest.mark.auth
class TestContainerAPIEndpoints:
    """Test Container API endpoints with authentication."""

    @pytest.mark.asyncio
    async def test_list_containers_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test listing containers successfully."""
        response = await client.get("/api/v1/containers/", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "containers" in data
        assert "pagination" in data
        assert "performance_metrics" in data
        
        # Check pagination structure
        pagination = data["pagination"]
        assert "page" in pagination
        assert "limit" in pagination
        assert "total" in pagination
        assert "total_pages" in pagination
        
        # Check performance metrics structure
        metrics = data["performance_metrics"]
        assert "physical" in metrics
        assert "virtual" in metrics
        assert "time_range" in metrics
        assert "generated_at" in metrics

    @pytest.mark.asyncio

    async def test_list_containers_with_filters(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test listing containers with various filters."""
        # Test search filter
        response = await client.get(
            "/api/v1/containers/",
            params={"search": "Container 1"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        
        # Test type filter
        response = await client.get(
            "/api/v1/containers/",
            params={"type": "physical"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        
        # Test pagination
        response = await client.get(
            "/api/v1/containers/",
            params={"page": 1, "limit": 2},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 2

    @pytest.mark.asyncio

    async def test_list_containers_invalid_filters(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test listing containers with invalid filters."""
        # Test invalid page
        response = await client.get(
            "/api/v1/containers/",
            params={"page": 0},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Test invalid limit
        response = await client.get(
            "/api/v1/containers/",
            params={"limit": 101},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Test invalid type
        response = await client.get(
            "/api/v1/containers/",
            params={"type": "invalid_type"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio

    async def test_list_containers_unauthorized(self, client: AsyncClient):
        """Test listing containers without authentication."""
        response = await client.get("/api/v1/containers/")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_get_container_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test getting a specific container successfully."""
        response = await client.get(
            f"/api/v1/containers/{test_container.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["id"] == test_container.id
        assert data["name"] == test_container.name
        assert data["tenant_id"] == test_container.tenant_id
        assert data["type"] == test_container.type
        assert data["purpose"] == test_container.purpose
        assert data["status"] == test_container.status
        
        # Check relationships are included
        assert "seed_types" in data
        assert "settings" in data
        assert "environment" in data
        assert "inventory" in data
        assert "metrics" in data
        assert "alerts" in data

    @pytest.mark.asyncio

    async def test_get_container_not_found(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test getting a non-existent container."""
        response = await client.get(
            "/api/v1/containers/99999",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio

    async def test_get_container_unauthorized(
        self,
        client: AsyncClient,
        test_container
    ):
        """Test getting container without authentication."""
        response = await client.get(f"/api/v1/containers/{test_container.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_create_container_success(
        self,
        client: AsyncClient,
        auth_headers,
        container_create_data,
        test_seed_types,
        async_session
    ):
        """Test creating a container successfully."""
        # Create a tenant first
        from app.models.tenant import Tenant
        import uuid
        
        tenant = Tenant(name=f"Test Tenant {uuid.uuid4().hex[:8]}")
        async_session.add(tenant)
        await async_session.commit()
        await async_session.refresh(tenant)
        
        # Update container data with actual tenant and seed type IDs
        container_data = container_create_data.copy()
        container_data["tenant_id"] = tenant.id
        container_data["seed_type_ids"] = [test_seed_types[0].id, test_seed_types[1].id]
        
        response = await client.post(
            "/api/v1/containers/",
            json=container_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        
        data = response.json()
        assert data["name"] == container_data["name"]
        assert data["tenant_id"] == container_data["tenant_id"]
        assert data["type"] == container_data["type"]
        assert data["purpose"] == container_data["purpose"]
        assert data["status"] == container_data["status"]
        
        # Check that ID was assigned
        assert "id" in data
        assert data["id"] is not None

    @pytest.mark.asyncio

    async def test_create_container_invalid_data(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test creating container with invalid data."""
        # Missing required fields
        invalid_data = {
            "name": "Invalid Container"
            # Missing other required fields
        }
        
        response = await client.post(
            "/api/v1/containers/",
            json=invalid_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio

    async def test_create_container_invalid_type(
        self,
        client: AsyncClient,
        auth_headers,
        container_create_data
    ):
        """Test creating container with invalid type."""
        invalid_data = {**container_create_data, "type": "invalid_type"}
        
        response = await client.post(
            "/api/v1/containers/",
            json=invalid_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio

    async def test_create_container_unauthorized(
        self,
        client: AsyncClient,
        container_create_data
    ):
        """Test creating container without authentication."""
        response = await client.post(
            "/api/v1/containers/",
            json=container_create_data
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_update_container_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_container,
        container_update_data
    ):
        """Test updating a container successfully."""
        response = await client.put(
            f"/api/v1/containers/{test_container.id}",
            json=container_update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["id"] == test_container.id
        assert data["name"] == container_update_data["name"]
        assert data["status"] == container_update_data["status"]
        assert data["notes"] == container_update_data["notes"]

    @pytest.mark.asyncio

    async def test_update_container_partial(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test partially updating a container."""
        partial_update = {
            "name": "Partially Updated Container",
            "status": "maintenance"
        }
        
        response = await client.put(
            f"/api/v1/containers/{test_container.id}",
            json=partial_update,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["name"] == "Partially Updated Container"
        assert data["status"] == "maintenance"

    @pytest.mark.asyncio

    async def test_update_container_not_found(
        self,
        client: AsyncClient,
        auth_headers,
        container_update_data
    ):
        """Test updating a non-existent container."""
        response = await client.put(
            "/api/v1/containers/99999",
            json=container_update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio

    async def test_update_container_unauthorized(
        self,
        client: AsyncClient,
        test_container,
        container_update_data
    ):
        """Test updating container without authentication."""
        response = await client.put(
            f"/api/v1/containers/{test_container.id}",
            json=container_update_data
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_delete_container_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test deleting a container successfully."""
        response = await client.delete(
            f"/api/v1/containers/{test_container.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT

    @pytest.mark.asyncio

    async def test_delete_container_not_found(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test deleting a non-existent container."""
        response = await client.delete(
            "/api/v1/containers/99999",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio

    async def test_delete_container_unauthorized(
        self,
        client: AsyncClient,
        test_container
    ):
        """Test deleting container without authentication."""
        response = await client.delete(f"/api/v1/containers/{test_container.id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_shutdown_container_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_container,
        shutdown_request_data
    ):
        """Test shutting down a container successfully."""
        response = await client.post(
            f"/api/v1/containers/{test_container.id}/shutdown",
            json=shutdown_request_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "success" in data
        assert "message" in data
        assert "container_id" in data
        assert data["container_id"] == test_container.id

    @pytest.mark.asyncio

    async def test_shutdown_container_no_body(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test shutting down container without request body."""
        response = await client.post(
            f"/api/v1/containers/{test_container.id}/shutdown",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio

    async def test_shutdown_container_not_found(
        self,
        client: AsyncClient,
        auth_headers,
        shutdown_request_data
    ):
        """Test shutting down a non-existent container."""
        response = await client.post(
            "/api/v1/containers/99999/shutdown",
            json=shutdown_request_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio

    async def test_shutdown_container_unauthorized(
        self,
        client: AsyncClient,
        test_container,
        shutdown_request_data
    ):
        """Test shutting down container without authentication."""
        response = await client.post(
            f"/api/v1/containers/{test_container.id}/shutdown",
            json=shutdown_request_data
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_get_performance_metrics_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting performance metrics successfully."""
        response = await client.get(
            "/api/v1/containers/metrics",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "physical" in data
        assert "virtual" in data
        assert "time_range" in data
        assert "generated_at" in data
        
        # Check physical metrics structure
        physical = data["physical"]
        assert "container_count" in physical
        assert "yield" in physical
        assert "space_utilization" in physical
        
        # Check virtual metrics structure
        virtual = data["virtual"]
        assert "container_count" in virtual
        assert "yield" in virtual
        assert "space_utilization" in virtual

    @pytest.mark.asyncio

    async def test_get_performance_metrics_with_filters(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting performance metrics with filters."""
        # Test time range filter
        response = await client.get(
            "/api/v1/containers/metrics",
            params={"timeRange": "month"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["time_range"]["type"] == "month"
        
        # Test type filter
        response = await client.get(
            "/api/v1/containers/metrics",
            params={"type": "physical"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        
        # Test container IDs filter
        container_ids = f"{test_containers_with_alerts[0].id},{test_containers_with_alerts[1].id}"
        response = await client.get(
            "/api/v1/containers/metrics",
            params={"containerIds": container_ids},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio

    async def test_get_performance_metrics_unauthorized(self, client: AsyncClient):
        """Test getting performance metrics without authentication."""
        response = await client.get("/api/v1/containers/metrics")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_get_filter_options_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting filter options successfully."""
        response = await client.get(
            "/api/v1/containers/filter-options",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "tenants" in data
        assert "purposes" in data
        assert "statuses" in data
        assert "container_types" in data
        
        # Check structure
        assert isinstance(data["tenants"], list)
        assert isinstance(data["purposes"], list)
        assert isinstance(data["statuses"], list)
        assert isinstance(data["container_types"], list)

    @pytest.mark.asyncio

    async def test_get_filter_options_unauthorized(self, client: AsyncClient):
        """Test getting filter options without authentication."""
        response = await client.get("/api/v1/containers/filter-options")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_get_containers_by_tenant(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting containers by tenant."""
        tenant_id = test_containers_with_alerts[0].tenant_id
        
        response = await client.get(
            f"/api/v1/containers/tenant/{tenant_id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert isinstance(data, list)
        
        # All containers should belong to the specified tenant
        for container in data:
            assert container["tenant_id"] == tenant_id

    @pytest.mark.asyncio

    async def test_get_containers_by_tenant_with_pagination(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting containers by tenant with pagination."""
        tenant_id = test_containers_with_alerts[0].tenant_id
        
        response = await client.get(
            f"/api/v1/containers/tenant/{tenant_id}",
            params={"page": 1, "limit": 1},
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio

    async def test_get_containers_by_tenant_unauthorized(
        self,
        client: AsyncClient,
        test_containers_with_alerts
    ):
        """Test getting containers by tenant without authentication."""
        tenant_id = test_containers_with_alerts[0].tenant_id
        
        response = await client.get(f"/api/v1/containers/tenant/{tenant_id}")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_get_containers_with_alerts(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting containers with active alerts."""
        response = await client.get(
            "/api/v1/containers/alerts/active",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert isinstance(data, list)
        
        # Each container should have alerts
        for container in data:
            assert "alerts" in container
            assert len(container["alerts"]) > 0

    @pytest.mark.asyncio

    async def test_get_containers_with_alerts_unauthorized(self, client: AsyncClient):
        """Test getting containers with alerts without authentication."""
        response = await client.get("/api/v1/containers/alerts/active")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_get_container_metrics(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test getting metrics for a specific container."""
        response = await client.get(
            f"/api/v1/containers/{test_container.id}/metrics",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "container_id" in data
        assert "container_name" in data
        assert "trend_data" in data
        
        assert data["container_id"] == test_container.id
        assert data["container_name"] == test_container.name
        assert isinstance(data["trend_data"], list)

    @pytest.mark.asyncio

    async def test_get_container_metrics_with_days(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test getting container metrics with custom days parameter."""
        response = await client.get(
            f"/api/v1/containers/{test_container.id}/metrics",
            params={"days": 60},
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert len(data["trend_data"]) == 60

    @pytest.mark.asyncio

    async def test_get_container_metrics_invalid_days(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test getting container metrics with invalid days parameter."""
        # Test days below minimum
        response = await client.get(
            f"/api/v1/containers/{test_container.id}/metrics",
            params={"days": 0},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        # Test days above maximum
        response = await client.get(
            f"/api/v1/containers/{test_container.id}/metrics",
            params={"days": 400},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio

    async def test_get_container_metrics_not_found(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test getting metrics for non-existent container."""
        response = await client.get(
            "/api/v1/containers/99999/metrics",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio

    async def test_get_container_metrics_unauthorized(
        self,
        client: AsyncClient,
        test_container
    ):
        """Test getting container metrics without authentication."""
        response = await client.get(f"/api/v1/containers/{test_container.id}/metrics")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio

    async def test_api_response_format_consistency(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test that API responses have consistent format."""
        # Test list endpoint
        response = await client.get("/api/v1/containers/", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        
        list_data = response.json()
        assert "containers" in list_data
        
        if list_data["containers"]:
            # Test individual container endpoint
            container_id = list_data["containers"][0]["id"]
            response = await client.get(f"/api/v1/containers/{container_id}", headers=auth_headers)
            assert response.status_code == status.HTTP_200_OK
            
            individual_data = response.json()
            
            # Compare structure consistency
            list_container = list_data["containers"][0]
            
            # Both should have same basic fields
            for field in ["id", "name", "tenant_id", "type", "purpose", "status"]:
                assert field in list_container
                assert field in individual_data
                assert list_container[field] == individual_data[field]

    @pytest.mark.asyncio

    async def test_api_pagination_edge_cases(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test API pagination edge cases."""
        # Test page beyond available data
        response = await client.get(
            "/api/v1/containers/",
            params={"page": 1000, "limit": 10},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["containers"] == []
        assert data["pagination"]["page"] == 1000

    @pytest.mark.asyncio

    async def test_api_error_response_format(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test that API error responses have consistent format."""
        # Test 404 error
        response = await client.get("/api/v1/containers/99999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
        error_data = response.json()
        assert "detail" in error_data
        
        # Test 422 validation error
        response = await client.get(
            "/api/v1/containers/",
            params={"page": -1},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        
        validation_error = response.json()
        assert "detail" in validation_error

    @pytest.mark.asyncio

    async def test_api_content_type_headers(
        self,
        client: AsyncClient,
        auth_headers,
        test_container
    ):
        """Test that API responses have correct content type headers."""
        response = await client.get(f"/api/v1/containers/{test_container.id}", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.headers["content-type"] == "application/json"