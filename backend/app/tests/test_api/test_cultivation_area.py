"""Tests for Cultivation Area API endpoints."""

import pytest
from datetime import datetime, timezone
from httpx import AsyncClient
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.container import Container
from app.models.tenant import Tenant
from app.models.panel import Panel
from app.models.snapshots import PanelSnapshot


@pytest.mark.api
class TestCultivationAreaEndpoints:
    """Test cultivation area related API endpoints."""

    @pytest.fixture
    async def test_data(self, async_session: AsyncSession):
        """Create test data for cultivation area tests."""
        # Create tenant and container
        tenant = Tenant(name="Cultivation Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="cultivation"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create panels in different walls
        panels = [
            Panel(
                container_id=container.id,
                rfid_tag="PANEL001",
                location={"wall": "wall_1", "slot_number": 1},
                utilization_pct=75.0,
                status="active",
                capacity=15,
                panel_type="cultivation"
            ),
            Panel(
                container_id=container.id,
                rfid_tag="PANEL002",
                location={"wall": "wall_1", "slot_number": 2},
                utilization_pct=50.0,
                status="active",
                capacity=15,
                panel_type="cultivation"
            ),
            Panel(
                container_id=container.id,
                rfid_tag="PANEL003",
                location={"wall": "wall_2", "slot_number": 5},
                utilization_pct=100.0,
                status="active",
                capacity=15,
                panel_type="cultivation"
            ),
            Panel(
                container_id=container.id,
                rfid_tag="PANEL004",
                location=None,  # Off-wall panel
                utilization_pct=0.0,
                status="storage",
                capacity=15,
                panel_type="cultivation"
            )
        ]
        
        async_session.add_all(panels)
        await async_session.flush()
        
        # Create panel snapshots for time-lapse functionality
        snapshots = [
            PanelSnapshot(
                timestamp=datetime(2024, 1, 1, tzinfo=timezone.utc),
                container_id=container.id,
                panel_id=panels[0].id,
                rfid_tag="PANEL001",
                location={"wall": "wall_1", "slot_number": 1},
                crop_count=5,
                utilization_percentage=33.3,
                status="active"
            ),
            PanelSnapshot(
                timestamp=datetime(2024, 1, 2, tzinfo=timezone.utc),
                container_id=container.id,
                panel_id=panels[0].id,
                rfid_tag="PANEL001",
                location={"wall": "wall_1", "slot_number": 1},
                crop_count=10,
                utilization_percentage=66.7,
                status="active"
            )
        ]
        
        async_session.add_all(snapshots)
        await async_session.commit()
        
        return {
            "tenant": tenant,
            "container": container,
            "panels": panels,
            "snapshots": snapshots
        }

    @pytest.mark.asyncio
    async def test_get_cultivation_area_layout(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/containers/{id}/inventory/cultivation-area endpoint."""
        data = await test_data
        container = data["container"]
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/inventory/cultivation-area",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "utilization_summary" in data
        assert "layout" in data
        assert "off_wall_panels" in data
        
        # Verify utilization summary
        assert "total_utilization_percentage" in data["utilization_summary"]
        
        # Verify layout structure
        layout = data["layout"]
        assert "wall_1" in layout
        assert "wall_2" in layout
        assert "wall_3" in layout
        assert "wall_4" in layout
        
        # Verify wall_1 has panels
        assert len(layout["wall_1"]) > 0
        
        # Verify panel structure in wall_1
        panel_slot = layout["wall_1"][0]
        assert "slot_number" in panel_slot
        assert "panel" in panel_slot
        
        if panel_slot["panel"]:
            panel = panel_slot["panel"]
            assert "id" in panel
            assert "rfid_tag" in panel
            assert "location" in panel
            assert "utilization_pct" in panel
            assert "capacity" in panel
        
        # Verify off-wall panels
        assert len(data["off_wall_panels"]) > 0
        off_wall_panel = data["off_wall_panels"][0]
        assert "id" in off_wall_panel
        assert "rfid_tag" in off_wall_panel
        assert "status" in off_wall_panel

    @pytest.mark.asyncio
    async def test_get_panels_for_container(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/containers/{id}/panels endpoint."""
        data = await test_data
        container = data["container"]
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/panels",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Should return list of panels
        assert isinstance(data, list)
        assert len(data) == 4  # Based on test_data
        
        # Verify panel structure
        for panel in data:
            assert "id" in panel
            assert "container_id" in panel
            assert "rfid_tag" in panel
            assert "location" in panel
            assert "utilization_pct" in panel
            assert "status" in panel
            assert "capacity" in panel
            assert "panel_type" in panel

    @pytest.mark.asyncio
    async def test_get_panels_with_status_filter(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/containers/{id}/panels with status filter."""
        data = await test_data
        container = data["container"]
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/panels?status=active",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Should only return active panels
        assert isinstance(data, list)
        assert len(data) == 3  # 3 active panels in test_data
        
        for panel in data:
            assert panel["status"] == "active"

    @pytest.mark.asyncio
    async def test_get_panel_snapshots(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/containers/{id}/panel-snapshots endpoint."""
        data = await test_data
        container = data["container"]
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/panel-snapshots",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Should return list of snapshots
        assert isinstance(data, list)
        assert len(data) == 2  # Based on test_data
        
        # Verify snapshot structure
        for snapshot in data:
            assert "id" in snapshot
            assert "timestamp" in snapshot
            assert "container_id" in snapshot
            assert "rfid_tag" in snapshot
            assert "location" in snapshot
            assert "crop_count" in snapshot
            assert "utilization_percentage" in snapshot
            assert "status" in snapshot

    @pytest.mark.asyncio
    async def test_create_panel_snapshot(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test POST /api/v1/containers/{id}/panel-snapshots endpoint."""
        data = await test_data
        container = data["container"]
        
        snapshot_data = {
            "rfid_tag": "PANEL005",
            "location": {"wall": "wall_3", "slot_number": 10},
            "crop_count": 8,
            "utilization_percentage": 53.3,
            "status": "active"
        }
        
        response = await client.post(
            f"/api/v1/containers/{container.id}/panel-snapshots",
            json=snapshot_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        
        # Verify created snapshot
        assert "id" in data
        assert "timestamp" in data
        assert data["container_id"] == container.id
        assert data["rfid_tag"] == "PANEL005"
        assert data["crop_count"] == 8
        assert data["utilization_percentage"] == 53.3
        assert data["status"] == "active"

    @pytest.mark.asyncio
    async def test_get_available_panel_slots(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/containers/{id}/cultivation-area/available-slots endpoint."""
        data = await test_data
        container = data["container"]
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/cultivation-area/available-slots",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "available_slots" in data
        assert isinstance(data["available_slots"], list)
        
        # Should have many available slots (88 total - 3 occupied = 85 available)
        assert len(data["available_slots"]) > 80
        
        # Verify slot structure
        if data["available_slots"]:
            slot = data["available_slots"][0]
            assert "wall" in slot
            assert "slot_number" in slot
            assert "location_description" in slot
            assert slot["wall"] in ["wall_1", "wall_2", "wall_3", "wall_4"]
            assert 1 <= slot["slot_number"] <= 22

    @pytest.mark.asyncio
    async def test_update_panel_location(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test PUT /api/v1/panels/{panel_id}/location endpoint."""
        data = await test_data
        panel = data["panels"][0]  # First panel
        
        update_data = {
            "location": {
                "wall": "wall_2",
                "slot_number": 15
            },
            "moved_by": "test_user"
        }
        
        response = await client.put(
            f"/api/v1/panels/{panel.id}/location",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "success" in data
        assert "message" in data
        assert "panel" in data
        assert data["success"] is True
        
        # Verify updated panel
        updated_panel = data["panel"]
        assert updated_panel["id"] == panel.id
        assert updated_panel["location"]["wall"] == "wall_2"
        assert updated_panel["location"]["slot_number"] == 15

    @pytest.mark.asyncio
    async def test_get_panel_by_id(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/panels/{panel_id} endpoint."""
        data = await test_data
        panel = data["panels"][0]
        
        response = await client.get(
            f"/api/v1/panels/{panel.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify panel details
        assert data["id"] == panel.id
        assert data["container_id"] == panel.container_id
        assert data["rfid_tag"] == panel.rfid_tag
        assert data["location"]["wall"] == "wall_1"
        assert data["location"]["slot_number"] == 1
        assert data["utilization_pct"] == 75.0
        assert data["status"] == "active"
        assert data["capacity"] == 15
        assert data["panel_type"] == "cultivation"

    @pytest.mark.asyncio
    async def test_update_panel(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test PUT /api/v1/panels/{panel_id} endpoint."""
        data = await test_data
        panel = data["panels"][0]
        
        update_data = {
            "location": {"wall": "wall_3", "slot_number": 8},
            "utilization_pct": 90.0,
            "status": "maintenance",
            "capacity": 20,
            "panel_type": "advanced_cultivation"
        }
        
        response = await client.put(
            f"/api/v1/panels/{panel.id}",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify updated panel
        assert data["id"] == panel.id
        assert data["location"]["wall"] == "wall_3"
        assert data["location"]["slot_number"] == 8
        assert data["utilization_pct"] == 90.0
        assert data["status"] == "maintenance"
        assert data["capacity"] == 20
        assert data["panel_type"] == "advanced_cultivation"

    @pytest.mark.asyncio
    async def test_get_cultivation_area_summary(
        self, client: AsyncClient, test_data: dict, auth_headers: dict
    ):
        """Test GET /api/v1/containers/{id}/cultivation-area/summary endpoint."""
        data = await test_data
        container = data["container"]
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/cultivation-area/summary",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify summary structure
        assert "total_slots" in data
        assert "occupied_slots" in data
        assert "utilization_percentage" in data
        assert "total_panels" in data
        assert "off_wall_panels" in data
        assert "total_crops" in data
        assert "overdue_crops" in data
        assert "last_updated" in data
        
        # Verify calculated values
        assert data["total_slots"] == 88  # 4 walls * 22 slots each
        assert data["occupied_slots"] == 3  # 3 panels on walls
        assert data["total_panels"] == 4  # Total panels in container
        assert data["off_wall_panels"] == 1  # 1 panel off wall

    @pytest.mark.asyncio
    async def test_authentication_required(
        self, client: AsyncClient, test_data: dict
    ):
        """Test that authentication is required for all endpoints."""
        data = await test_data
        container = data["container"]
        panel = data["panels"][0]
        
        endpoints = [
            f"/api/v1/containers/{container.id}/inventory/cultivation-area",
            f"/api/v1/containers/{container.id}/panels",
            f"/api/v1/containers/{container.id}/panel-snapshots",
            f"/api/v1/containers/{container.id}/cultivation-area/available-slots",
            f"/api/v1/containers/{container.id}/cultivation-area/summary",
            f"/api/v1/panels/{panel.id}",
        ]
        
        for endpoint in endpoints:
            response = await client.get(endpoint)
            assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_invalid_container_id(
        self, client: AsyncClient, auth_headers: dict
    ):
        """Test handling of invalid container IDs."""
        invalid_container_id = 99999
        
        response = await client.get(
            f"/api/v1/containers/{invalid_container_id}/inventory/cultivation-area",
            headers=auth_headers
        )
        
        # Should handle gracefully (either 404 or empty response)
        assert response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_200_OK]

    @pytest.mark.asyncio
    async def test_invalid_panel_id(
        self, client: AsyncClient, auth_headers: dict
    ):
        """Test handling of invalid panel IDs."""
        invalid_panel_id = 99999
        
        response = await client.get(
            f"/api/v1/panels/{invalid_panel_id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND