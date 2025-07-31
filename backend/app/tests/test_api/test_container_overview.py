"""Tests for Container Overview API endpoints."""

import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import datetime


@pytest.mark.api
@pytest.mark.auth
class TestContainerOverviewAPIEndpoints:
    """Test Container Overview API endpoints with authentication."""

    @pytest.mark.asyncio
    async def test_get_container_overview_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting container overview successfully."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/overview",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "container" in data
        assert "dashboard_metrics" in data
        assert "crops_summary" in data
        assert "recent_activity" in data
        
        # Check container info structure
        container_info = data["container"]
        assert "id" in container_info
        assert "name" in container_info
        assert "type" in container_info
        assert "tenant" in container_info
        assert "status" in container_info
        
        # Check dashboard metrics structure
        metrics = data["dashboard_metrics"]
        assert "air_temperature" in metrics
        assert "humidity" in metrics
        assert "co2" in metrics
        assert "yield_metrics" in metrics
        assert "space_utilization" in metrics

    @pytest.mark.asyncio
    async def test_get_container_overview_with_time_range(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting container overview with different time ranges."""
        container = test_containers_with_alerts[0]
        
        # Test different time ranges
        for time_range in ["week", "month", "quarter", "year"]:
            response = await client.get(
                f"/api/v1/containers/{container.id}/overview",
                params={"time_range": time_range},
                headers=auth_headers
            )
            
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert "dashboard_metrics" in data

    @pytest.mark.asyncio
    async def test_get_container_overview_not_found(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test getting overview for non-existent container."""
        response = await client.get(
            "/api/v1/containers/99999/overview",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio
    async def test_get_activity_logs_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting activity logs successfully."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/activity-logs",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "activities" in data
        assert "pagination" in data
        
        # Check pagination structure
        pagination = data["pagination"]
        assert "page" in pagination
        assert "limit" in pagination
        assert "total" in pagination
        assert "total_pages" in pagination

    @pytest.mark.asyncio
    async def test_get_activity_logs_with_pagination(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test activity logs with pagination parameters."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/activity-logs",
            params={"page": 1, "limit": 5},
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert len(data["activities"]) <= 5
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 5

    @pytest.mark.asyncio
    async def test_get_activity_logs_with_filters(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test activity logs with filtering parameters."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/activity-logs",
            params={
                "action_type": "seeding",
                "actor_type": "user",
                "start_date": "2025-07-01T00:00:00",
                "end_date": "2025-07-08T23:59:59"
            },
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio
    async def test_create_activity_log_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test creating activity log successfully."""
        container = test_containers_with_alerts[0]
        activity_data = {
            "action_type": "testing",
            "actor_type": "user",
            "actor_id": "test_user_001",
            "description": "Test activity log creation"
        }
        
        response = await client.post(
            f"/api/v1/containers/{container.id}/activity-logs",
            json=activity_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["action_type"] == "testing"
        assert data["actor_type"] == "user"
        assert data["actor_id"] == "test_user_001"
        assert data["description"] == "Test activity log creation"

    @pytest.mark.asyncio
    async def test_get_metric_snapshots_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting metric snapshots successfully."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/metric-snapshots",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert isinstance(data, list)
        
        # If there are snapshots, check structure
        if data:
            snapshot = data[0]
            assert "id" in snapshot
            assert "container_id" in snapshot
            assert "timestamp" in snapshot

    @pytest.mark.asyncio
    async def test_create_metric_snapshot_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test creating metric snapshot successfully."""
        container = test_containers_with_alerts[0]
        snapshot_data = {
            "air_temperature": 22.5,
            "humidity": 65.0,
            "co2": 400.0,
            "yield_kg": 1.5,
            "space_utilization_pct": 75.0
        }
        
        response = await client.post(
            f"/api/v1/containers/{container.id}/metric-snapshots",
            json=snapshot_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["air_temperature"] == 22.5
        assert data["humidity"] == 65.0
        assert data["co2"] == 400.0
        assert data["yield_kg"] == 1.5
        assert data["space_utilization_pct"] == 75.0

    @pytest.mark.asyncio
    async def test_get_container_snapshots_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting container snapshots successfully."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/snapshots",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_create_container_snapshot_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test creating container snapshot successfully."""
        container = test_containers_with_alerts[0]
        snapshot_data = {
            "type": "physical",
            "status": "active",
            "tenant_id": 1,
            "purpose": "testing",
            "location": {"city": "Test City", "country": "Test Country"},
            "shadow_service_enabled": True,
            "copied_environment_from": None,
            "robotics_simulation_enabled": False,
            "ecosystem_settings": {"test": "data"},
            "yield_kg": 2.0,
            "space_utilization_pct": 80.0,
            "tray_ids": [1, 2, 3],
            "panel_ids": [1, 2]
        }
        
        response = await client.post(
            f"/api/v1/containers/{container.id}/snapshots",
            json=snapshot_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio
    async def test_update_container_settings_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test updating container settings successfully."""
        container = test_containers_with_alerts[0]
        settings_data = {
            "tenant_id": 1,
            "purpose": "updated_purpose",
            "location": {"city": "Updated City", "country": "Updated Country"},
            "notes": "Updated notes",
            "shadow_service_enabled": False,
            "copied_environment_from": None,
            "robotics_simulation_enabled": True,
            "ecosystem_connected": True,
            "ecosystem_settings": {"updated": "settings"}
        }
        
        response = await client.put(
            f"/api/v1/containers/{container.id}/settings",
            json=settings_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "success" in data
        assert "message" in data
        assert "updated_at" in data

    @pytest.mark.asyncio
    async def test_get_environment_links_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting environment links successfully."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/environment-links",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "container_id" in data
        assert "fa" in data
        assert "pya" in data
        assert "aws" in data
        assert "mbai" in data
        assert "fh" in data

    @pytest.mark.asyncio
    async def test_update_environment_links_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test updating environment links successfully."""
        container = test_containers_with_alerts[0]
        links_data = {
            "fa": {"status": "connected", "version": "2.1.3"},
            "pya": {"status": "connected", "version": "1.8.2"},
            "aws": {"status": "connected", "region": "us-west-2"},
            "mbai": {"status": "disconnected"},
            "fh": {"status": "connected", "version": "3.2.1"}
        }
        
        response = await client.put(
            f"/api/v1/containers/{container.id}/environment-links",
            json=links_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "success" in data
        assert "message" in data
        assert "updated_at" in data

    @pytest.mark.asyncio
    async def test_get_dashboard_summary_success(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test getting dashboard summary successfully."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/dashboard-summary",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "current_metrics" in data
        assert "crop_counts" in data
        assert "activity_count" in data
        assert "last_updated" in data
        
        # Check current metrics structure
        current_metrics = data["current_metrics"]
        assert "air_temperature" in current_metrics
        assert "humidity" in current_metrics
        assert "co2" in current_metrics
        assert "yield_kg" in current_metrics
        assert "space_utilization_pct" in current_metrics
        
        # Check crop counts structure
        crop_counts = data["crop_counts"]
        assert "total_crops" in crop_counts
        assert "nursery_crops" in crop_counts
        assert "cultivation_crops" in crop_counts
        assert "overdue_crops" in crop_counts

    @pytest.mark.asyncio
    async def test_overview_endpoints_without_auth(
        self,
        client: AsyncClient,
        test_containers_with_alerts
    ):
        """Test that overview endpoints require authentication."""
        container = test_containers_with_alerts[0]
        
        endpoints = [
            f"/api/v1/containers/{container.id}/overview",
            f"/api/v1/containers/{container.id}/activity-logs",
            f"/api/v1/containers/{container.id}/metric-snapshots",
            f"/api/v1/containers/{container.id}/snapshots",
            f"/api/v1/containers/{container.id}/environment-links",
            f"/api/v1/containers/{container.id}/dashboard-summary",
        ]
        
        for endpoint in endpoints:
            response = await client.get(endpoint)
            assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_invalid_container_id_handling(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test handling of invalid container IDs."""
        invalid_id = 99999
        
        endpoints = [
            f"/api/v1/containers/{invalid_id}/overview",
            f"/api/v1/containers/{invalid_id}/activity-logs",
            f"/api/v1/containers/{invalid_id}/metric-snapshots",
            f"/api/v1/containers/{invalid_id}/snapshots",
            f"/api/v1/containers/{invalid_id}/environment-links",
            f"/api/v1/containers/{invalid_id}/dashboard-summary",
        ]
        
        for endpoint in endpoints:
            response = await client.get(endpoint, headers=auth_headers)
            # Most endpoints should return 404 or handle gracefully
            assert response.status_code in [
                status.HTTP_404_NOT_FOUND, 
                status.HTTP_200_OK  # Some might return empty data
            ]

    @pytest.mark.asyncio
    async def test_metric_snapshots_with_date_filters(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test metric snapshots with date filtering."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/metric-snapshots",
            params={
                "start_date": "2025-07-01T00:00:00",
                "end_date": "2025-07-08T23:59:59",
                "interval": "day"
            },
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio
    async def test_container_snapshots_with_limit(
        self,
        client: AsyncClient,
        auth_headers,
        test_containers_with_alerts
    ):
        """Test container snapshots with limit parameter."""
        container = test_containers_with_alerts[0]
        response = await client.get(
            f"/api/v1/containers/{container.id}/snapshots",
            params={"limit": 10},
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert len(data) <= 10