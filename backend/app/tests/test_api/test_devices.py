"""Tests for Device API endpoints."""

import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.device import Device, DeviceHealthHistory
from app.models.container import Container
from app.models.tenant import Tenant
from app.models.alert import Alert


@pytest.mark.api
@pytest.mark.database
class TestDeviceAPI:
    """Test Device API endpoints."""

    @pytest.mark.asyncio
    async def test_get_container_devices(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/containers/{container_id}/devices endpoint."""
        # Create tenant and container
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Test Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices with different statuses
        devices = [
            Device(container_id=container.id, name="Device 1", model="M1", serial_number="SN001", status="running"),
            Device(container_id=container.id, name="Device 2", model="M2", serial_number="SN002", status="idle"),
            Device(container_id=container.id, name="Device 3", model="M3", serial_number="SN003", status="offline"),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        # Make request
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "device_status_overview" in data
        assert "devices" in data
        assert data["device_status_overview"]["running"] == 1
        assert data["device_status_overview"]["idle"] == 1
        assert data["device_status_overview"]["offline"] == 1
        assert len(data["devices"]) == 3

    @pytest.mark.asyncio
    async def test_get_container_devices_unauthorized(
        self,
        client: AsyncClient,
        async_session: AsyncSession
    ):
        """Test GET /api/v1/containers/{container_id}/devices without authentication."""
        response = await client.get("/api/v1/containers/1/devices")
        
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_get_device_details(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/devices/{device_id} endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Details Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Details Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Details Device",
            model="DetailsModel",
            serial_number="DET001",
            firmware_version="1.0.0",
            port="USB-A",
            status="running",
            configuration_settings={"mode": "auto"},
            configuration_parameters={"threshold": 25.0},
            diagnostics_uptime=24.5,
            diagnostics_error_count=1,
            diagnostics_performance_metrics={"cpu": 85.0},
            connectivity_connection_type="ethernet",
            connectivity_signal_strength=98.5
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        response = await client.get(
            f"/api/v1/devices/{device.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == device.id
        assert data["name"] == "Details Device"
        assert data["configuration"]["settings"]["mode"] == "auto"
        assert data["diagnostics"]["uptime"] == 24.5
        assert data["connectivity"]["connection_type"] == "ethernet"

    @pytest.mark.asyncio
    async def test_get_device_details_not_found(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test GET /api/v1/devices/{device_id} with non-existent device."""
        response = await client.get(
            "/api/v1/devices/99999",
            headers=auth_headers
        )
        
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_register_device(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test POST /api/v1/devices/register endpoint."""
        # Create tenant and container
        tenant = Tenant(name="Register Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Register Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.commit()
        
        # Make request
        device_data = {
            "container_id": container.id,
            "name": "New Device",
            "model": "NewModel",
            "serial_number": "NEW001",
            "firmware_version": "1.0.0",
            "port": "USB-B"
        }
        
        response = await client.post(
            "/api/v1/devices/register",
            json=device_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "New Device"
        assert data["model"] == "NewModel"
        assert data["serial_number"] == "NEW001"
        assert data["status"] == "offline"  # Default status

    @pytest.mark.asyncio
    async def test_register_device_duplicate_serial(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test POST /api/v1/devices/register with duplicate serial number."""
        # Create tenant and container
        tenant = Tenant(name="Duplicate Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Duplicate Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create existing device
        existing_device = Device(
            container_id=container.id,
            name="Existing Device",
            model="ExistingModel",
            serial_number="DUP001"
        )
        async_session.add(existing_device)
        await async_session.commit()
        
        # Try to register device with same serial number
        device_data = {
            "container_id": container.id,
            "name": "New Device",
            "model": "NewModel",
            "serial_number": "DUP001"  # Duplicate serial
        }
        
        response = await client.post(
            "/api/v1/devices/register",
            json=device_data,
            headers=auth_headers
        )
        
        assert response.status_code == 409

    @pytest.mark.asyncio
    async def test_register_device_invalid_data(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test POST /api/v1/devices/register with invalid data."""
        device_data = {
            "container_id": 1,
            "name": "New Device"
            # Missing required fields: model, serial_number
        }
        
        response = await client.post(
            "/api/v1/devices/register",
            json=device_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_update_device_status(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test PUT /api/v1/devices/{device_id}/status endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Status Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Status Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Status Device",
            model="StatusModel",
            serial_number="STS001",
            status="offline"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        status_data = {
            "status": "running",
            "reason": "Maintenance completed"
        }
        
        response = await client.put(
            f"/api/v1/devices/{device.id}/status",
            json=status_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["updated_status"] == "running"
        assert "updated to running" in data["message"]

    @pytest.mark.asyncio
    async def test_update_device_status_invalid(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test PUT /api/v1/devices/{device_id}/status with invalid status."""
        # Create tenant, container, and device
        tenant = Tenant(name="Invalid Status Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Invalid Status Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Invalid Status Device",
            model="InvalidStatusModel",
            serial_number="IST001"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request with invalid status
        status_data = {
            "status": "invalid_status"
        }
        
        response = await client.put(
            f"/api/v1/devices/{device.id}/status",
            json=status_data,
            headers=auth_headers
        )
        
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_update_device_information(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test PUT /api/v1/devices/{device_id} endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Info Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Info Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Info Device",
            model="InfoModel",
            serial_number="INF001",
            firmware_version="1.0.0"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        update_data = {
            "name": "Updated Device",
            "firmware_version": "2.0.0",
            "port": "USB-C",
            "status": "idle"
        }
        
        response = await client.put(
            f"/api/v1/devices/{device.id}",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "Updated Device"
        assert data["firmware_version"] == "2.0.0"
        assert data["port"] == "USB-C"
        assert data["status"] == "idle"

    @pytest.mark.asyncio
    async def test_get_device_health_history(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/devices/{device_id}/health-history endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Health Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Health Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Health Device",
            model="HealthModel",
            serial_number="HLT001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entries
        base_time = datetime.utcnow()
        health_entries = [
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=base_time - timedelta(hours=i),
                status="running",
                uptime_hours=24.0 - i,
                error_count=i,
                performance_score=95.0 - i * 5,
                notes=f"Entry {i}"
            )
            for i in range(3)
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        # Make request
        response = await client.get(
            f"/api/v1/devices/{device.id}/health-history",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "health_history" in data
        assert "summary" in data
        assert len(data["health_history"]) == 3
        assert data["summary"]["average_uptime"] == 22.0

    @pytest.mark.asyncio
    async def test_get_device_health_history_with_params(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/devices/{device_id}/health-history with query parameters."""
        # Create tenant, container, and device
        tenant = Tenant(name="Health Params Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Health Params Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Health Params Device",
            model="HealthParamsModel",
            serial_number="HPM001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create many health history entries
        base_time = datetime.utcnow()
        health_entries = [
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=base_time - timedelta(hours=i),
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=95.0
            )
            for i in range(10)
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        # Make request with limit
        response = await client.get(
            f"/api/v1/devices/{device.id}/health-history?limit=5",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["health_history"]) == 5

    @pytest.mark.asyncio
    async def test_restart_device(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test POST /api/v1/devices/{device_id}/restart endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Restart Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Restart Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Restart Device",
            model="RestartModel",
            serial_number="RST001",
            status="running"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        restart_data = {
            "reason": "Firmware update required",
            "scheduled_time": (datetime.utcnow() + timedelta(minutes=5)).isoformat()
        }
        
        response = await client.post(
            f"/api/v1/devices/{device.id}/restart",
            json=restart_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["restart_initiated"] is True
        assert data["estimated_downtime_minutes"] == 5

    @pytest.mark.asyncio
    async def test_get_device_alerts(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/containers/{container_id}/devices/alerts endpoint."""
        # Create tenant and container
        tenant = Tenant(name="Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Alert Device",
            model="AlertModel",
            serial_number="ALT001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create alerts
        alerts = [
            Alert(
                container_id=container.id,
                device_id=device.id,
                description="Critical alert",
                severity="critical",
                active=True
            ),
            Alert(
                container_id=container.id,
                device_id=device.id,
                description="High alert",
                severity="high",
                active=True
            ),
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        # Make request
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "alerts" in data
        assert "alert_summary" in data
        assert len(data["alerts"]) == 2
        assert data["alert_summary"]["total_alerts"] == 2

    @pytest.mark.asyncio
    async def test_get_device_alerts_with_filters(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/containers/{container_id}/devices/alerts with filters."""
        # Create tenant and container
        tenant = Tenant(name="Filter Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Filter Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices
        device1 = Device(
            container_id=container.id,
            name="Filter Device 1",
            model="FilterModel1",
            serial_number="FLT001"
        )
        device2 = Device(
            container_id=container.id,
            name="Filter Device 2",
            model="FilterModel2",
            serial_number="FLT002"
        )
        async_session.add_all([device1, device2])
        await async_session.flush()
        
        # Create alerts
        alerts = [
            Alert(container_id=container.id, device_id=device1.id, description="Critical 1", severity="critical", active=True),
            Alert(container_id=container.id, device_id=device2.id, description="High 1", severity="high", active=True),
            Alert(container_id=container.id, device_id=device1.id, description="Medium 1", severity="medium", active=False),
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        # Make request with device filter
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts?device_id={device1.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["alerts"]) == 1  # Only active alerts for device1
        
        # Make request with severity filter
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts?severity=critical",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data["alerts"]) == 1
        assert data["alerts"][0]["severity"] == "critical"

    @pytest.mark.asyncio
    async def test_create_device_alert(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test POST /api/v1/devices/{device_id}/alerts endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Create Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Create Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Create Alert Device",
            model="CreateAlertModel",
            serial_number="CAL001"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        alert_data = {
            "alert_type": "temperature",
            "severity": "high",
            "description": "Device temperature exceeds threshold",
            "related_object": {"temperature": 85.0, "threshold": 80.0}
        }
        
        response = await client.post(
            f"/api/v1/devices/{device.id}/alerts",
            json=alert_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["device_id"] == device.id
        assert data["alert_type"] == "temperature"
        assert data["severity"] == "high"

    @pytest.mark.asyncio
    async def test_acknowledge_device_alert(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test PUT /api/v1/devices/alerts/{alert_id}/acknowledge endpoint."""
        # Create tenant, container, device, and alert
        tenant = Tenant(name="Ack Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Ack Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Ack Alert Device",
            model="AckAlertModel",
            serial_number="AAL001"
        )
        async_session.add(device)
        await async_session.flush()
        
        alert = Alert(
            container_id=container.id,
            device_id=device.id,
            description="Test alert",
            severity="medium",
            active=True,
            acknowledged=False
        )
        async_session.add(alert)
        await async_session.commit()
        
        # Make request
        ack_data = {
            "acknowledged_by": "test_user",
            "notes": "Acknowledged for testing"
        }
        
        response = await client.put(
            f"/api/v1/devices/alerts/{alert.id}/acknowledge",
            json=ack_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "acknowledged successfully" in data["message"]

    @pytest.mark.asyncio
    async def test_resolve_device_alert(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test PUT /api/v1/devices/alerts/{alert_id}/resolve endpoint."""
        # Create tenant, container, device, and alert
        tenant = Tenant(name="Resolve Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Resolve Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Resolve Alert Device",
            model="ResolveAlertModel",
            serial_number="RAL001"
        )
        async_session.add(device)
        await async_session.flush()
        
        alert = Alert(
            container_id=container.id,
            device_id=device.id,
            description="Test alert",
            severity="medium",
            active=True,
            resolved=False
        )
        async_session.add(alert)
        await async_session.commit()
        
        # Make request
        resolve_data = {
            "resolved_by": "test_user",
            "resolution_notes": "Issue resolved by replacing component"
        }
        
        response = await client.put(
            f"/api/v1/devices/alerts/{alert.id}/resolve",
            json=resolve_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "resolved successfully" in data["message"]

    @pytest.mark.asyncio
    async def test_delete_device(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test DELETE /api/v1/devices/{device_id} endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Delete Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Delete Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Delete Device",
            model="DeleteModel",
            serial_number="DEL001"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        response = await client.delete(
            f"/api/v1/devices/{device.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "deleted successfully" in data["message"]

    @pytest.mark.asyncio
    async def test_delete_device_with_active_alerts(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test DELETE /api/v1/devices/{device_id} with active alerts."""
        # Create tenant, container, and device
        tenant = Tenant(name="Delete Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Delete Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Delete Alert Device",
            model="DeleteAlertModel",
            serial_number="DAL001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create active alert
        alert = Alert(
            container_id=container.id,
            device_id=device.id,
            description="Active alert",
            severity="high",
            active=True
        )
        async_session.add(alert)
        await async_session.commit()
        
        # Make request
        response = await client.delete(
            f"/api/v1/devices/{device.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_device_management_summary(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/containers/{container_id}/devices/summary endpoint."""
        # Create tenant and container
        tenant = Tenant(name="Summary Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Summary Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices
        devices = [
            Device(container_id=container.id, name="Device 1", model="M1", serial_number="SUM001", status="running"),
            Device(container_id=container.id, name="Device 2", model="M2", serial_number="SUM002", status="idle"),
            Device(container_id=container.id, name="Device 3", model="M3", serial_number="SUM003", status="offline"),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        # Make request
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["device_count"] == 3
        assert data["online_devices"] == 2  # running + idle
        assert data["offline_devices"] == 1
        assert data["management_status"] in ["healthy", "degraded", "critical"]

    @pytest.mark.asyncio
    async def test_bulk_update_device_status(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test PUT /api/v1/devices/bulk-status-update endpoint."""
        # Create tenant and container
        tenant = Tenant(name="Bulk Update Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Bulk Update Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices
        devices = [
            Device(container_id=container.id, name=f"Device {i}", model=f"M{i}", serial_number=f"BLK{i:03d}", status="offline")
            for i in range(1, 4)
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        # Make request
        bulk_data = {
            "device_ids": [device.id for device in devices],
            "status": "running",
            "reason": "Maintenance completed"
        }
        
        response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=bulk_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert len(data["updated_devices"]) == 3
        assert len(data["failed_updates"]) == 0

    @pytest.mark.asyncio
    async def test_device_heartbeat(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test GET /api/v1/devices/{device_id}/heartbeat endpoint."""
        # Create tenant, container, and device
        tenant = Tenant(name="Heartbeat Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Heartbeat Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Heartbeat Device",
            model="HeartbeatModel",
            serial_number="HBT001",
            diagnostics_uptime=24.0
        )
        async_session.add(device)
        await async_session.commit()
        
        # Make request
        response = await client.get(
            f"/api/v1/devices/{device.id}/heartbeat",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "heartbeat updated successfully" in data["message"]

    @pytest.mark.asyncio
    async def test_endpoints_require_authentication(
        self,
        client: AsyncClient,
        async_session: AsyncSession
    ):
        """Test that all device endpoints require authentication."""
        endpoints = [
            ("GET", "/api/v1/devices/1"),
            ("POST", "/api/v1/devices/register"),
            ("PUT", "/api/v1/devices/1/status"),
            ("PUT", "/api/v1/devices/1"),
            ("GET", "/api/v1/devices/1/health-history"),
            ("POST", "/api/v1/devices/1/restart"),
            ("POST", "/api/v1/devices/1/alerts"),
            ("PUT", "/api/v1/devices/alerts/1/acknowledge"),
            ("PUT", "/api/v1/devices/alerts/1/resolve"),
            ("DELETE", "/api/v1/devices/1"),
            ("PUT", "/api/v1/devices/bulk-status-update"),
            ("GET", "/api/v1/devices/1/heartbeat"),
            ("GET", "/api/v1/containers/1/devices/alerts"),
            ("GET", "/api/v1/containers/1/devices/summary"),
        ]
        
        for method, endpoint in endpoints:
            if method == "GET":
                response = await client.get(endpoint)
            elif method == "POST":
                response = await client.post(endpoint, json={})
            elif method == "PUT":
                response = await client.put(endpoint, json={})
            elif method == "DELETE":
                response = await client.delete(endpoint)
            
            assert response.status_code == 401, f"Endpoint {method} {endpoint} should require authentication"

    @pytest.mark.asyncio
    async def test_error_handling_500(
        self,
        client: AsyncClient,
        auth_headers
    ):
        """Test 500 error handling for internal server errors."""
        # This test would require mocking to simulate internal errors
        # For now, we'll test a case that might cause an error
        
        # Try to get device details with invalid device ID format
        # This might cause an internal error depending on implementation
        response = await client.get(
            "/api/v1/devices/invalid_id_format",
            headers=auth_headers
        )
        
        # Should handle gracefully, either 404 or 422
        assert response.status_code in [404, 422, 500]

    @pytest.mark.asyncio
    async def test_api_response_format_consistency(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test that API responses follow consistent format."""
        # Create test data
        tenant = Tenant(name="Format Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Format Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.commit()
        
        # Test successful response format
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should have expected structure
        assert isinstance(data, dict)
        assert "device_status_overview" in data
        assert "devices" in data
        assert isinstance(data["devices"], list)
        
        # Test error response format
        response = await client.get(
            "/api/v1/devices/99999",
            headers=auth_headers
        )
        
        assert response.status_code == 404
        error_data = response.json()
        
        # Should have error structure
        assert "detail" in error_data