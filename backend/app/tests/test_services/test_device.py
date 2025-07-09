"""Tests for DeviceService business logic."""

import pytest
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.device import DeviceService
from app.schemas.device import (
    DeviceRegistration, DeviceStatusUpdate, DeviceUpdate, DeviceRestartRequest,
    BulkStatusUpdate
)
from app.schemas.alert import DeviceAlertCreate
from app.models.device import Device, DeviceHealthHistory
from app.models.container import Container
from app.models.tenant import Tenant
from app.models.alert import Alert
from app.core.exceptions import DeviceNotFoundError, AlertNotFoundError


@pytest.mark.services
@pytest.mark.database
class TestDeviceService:
    """Test DeviceService functionality."""

    @pytest.mark.asyncio
    async def test_service_initialization(self, async_session: AsyncSession):
        """Test service initialization."""
        service = DeviceService(async_session)
        
        assert service.db == async_session
        assert service.device_repository is not None
        assert service.health_repository is not None
        assert service.alert_repository is not None

    @pytest.mark.asyncio
    async def test_get_container_devices(self, async_session: AsyncSession):
        """Test getting container devices with status overview."""
        # Create tenant and container
        tenant = Tenant(name="Container Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Container Test",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices with different statuses
        devices = [
            Device(container_id=container.id, name="Device 1", model="M1", serial_number="SN001", status="running"),
            Device(container_id=container.id, name="Device 2", model="M2", serial_number="SN002", status="running"),
            Device(container_id=container.id, name="Device 3", model="M3", serial_number="SN003", status="idle"),
            Device(container_id=container.id, name="Device 4", model="M4", serial_number="SN004", status="issue"),
            Device(container_id=container.id, name="Device 5", model="M5", serial_number="SN005", status="offline"),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Get container devices
        container_devices = await service.get_container_devices(container.id)
        
        assert container_devices.device_status_overview.running == 2
        assert container_devices.device_status_overview.idle == 1
        assert container_devices.device_status_overview.issue == 1
        assert container_devices.device_status_overview.offline == 1
        assert len(container_devices.devices) == 5

    @pytest.mark.asyncio
    async def test_get_device_details(self, async_session: AsyncSession):
        """Test getting detailed device information."""
        # Create tenant and container
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
        
        # Create device with detailed information
        device = Device(
            container_id=container.id,
            name="Details Device",
            model="DetailsModel",
            serial_number="DET001",
            firmware_version="1.0.0",
            port="USB-A",
            status="running",
            configuration_settings={"mode": "auto", "sensitivity": 75},
            configuration_parameters={"threshold": 25.0, "interval": 30},
            diagnostics_uptime=24.5,
            diagnostics_error_count=1,
            diagnostics_last_error="Minor timeout",
            diagnostics_performance_metrics={"cpu": 85.0, "memory": 70.0},
            connectivity_connection_type="ethernet",
            connectivity_signal_strength=98.5,
            connectivity_last_heartbeat=datetime.utcnow()
        )
        async_session.add(device)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Get device details
        device_details = await service.get_device_details(device.id)
        
        assert device_details.id == device.id
        assert device_details.name == "Details Device"
        assert device_details.configuration.settings == {"mode": "auto", "sensitivity": 75}
        assert device_details.configuration.parameters == {"threshold": 25.0, "interval": 30}
        assert device_details.diagnostics.uptime == 24.5
        assert device_details.diagnostics.error_count == 1
        assert device_details.diagnostics.last_error == "Minor timeout"
        assert device_details.diagnostics.performance_metrics == {"cpu": 85.0, "memory": 70.0}
        assert device_details.connectivity.connection_type == "ethernet"
        assert device_details.connectivity.signal_strength == 98.5

    @pytest.mark.asyncio
    async def test_get_device_details_not_found(self, async_session: AsyncSession):
        """Test getting details for non-existent device."""
        service = DeviceService(async_session)
        
        with pytest.raises(DeviceNotFoundError):
            await service.get_device_details(99999)

    @pytest.mark.asyncio
    async def test_register_device(self, async_session: AsyncSession):
        """Test registering a new device."""
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
        
        service = DeviceService(async_session)
        
        # Register device
        device_data = DeviceRegistration(
            container_id=container.id,
            name="New Device",
            model="NewModel",
            serial_number="NEW001",
            firmware_version="1.0.0",
            port="USB-B"
        )
        
        device = await service.register_device(device_data)
        
        assert device.id is not None
        assert device.name == "New Device"
        assert device.model == "NewModel"
        assert device.serial_number == "NEW001"
        assert device.status == "offline"  # Default status
        
        # Verify health history entry was created
        health_entries = await service.health_repository.get_device_health_history(device.id)
        assert len(health_entries) == 1
        assert health_entries[0].status == "offline"
        assert health_entries[0].notes == "Device registered"

    @pytest.mark.asyncio
    async def test_register_device_duplicate_serial(self, async_session: AsyncSession):
        """Test registering device with duplicate serial number."""
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
        
        service = DeviceService(async_session)
        
        # Try to register device with same serial number
        device_data = DeviceRegistration(
            container_id=container.id,
            name="New Device",
            model="NewModel",
            serial_number="DUP001"  # Duplicate serial
        )
        
        with pytest.raises(ValueError, match="already exists"):
            await service.register_device(device_data)

    @pytest.mark.asyncio
    async def test_update_device_status(self, async_session: AsyncSession):
        """Test updating device status."""
        # Create tenant, container, and device
        tenant = Tenant(name="Update Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Update Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Update Device",
            model="UpdateModel",
            serial_number="UPD001",
            status="offline"
        )
        async_session.add(device)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Update device status
        status_update = DeviceStatusUpdate(
            status="running",
            reason="Maintenance completed"
        )
        
        response = await service.update_device_status(device.id, status_update)
        
        assert response.success is True
        assert response.updated_status == "running"
        assert "updated to running" in response.message
        
        # Verify device was updated
        updated_device = await service.device_repository.get(device.id)
        assert updated_device.status == "running"

    @pytest.mark.asyncio
    async def test_update_device_status_not_found(self, async_session: AsyncSession):
        """Test updating status of non-existent device."""
        service = DeviceService(async_session)
        
        status_update = DeviceStatusUpdate(status="running")
        
        with pytest.raises(DeviceNotFoundError):
            await service.update_device_status(99999, status_update)

    @pytest.mark.asyncio
    async def test_update_device_information(self, async_session: AsyncSession):
        """Test updating device information."""
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
        
        service = DeviceService(async_session)
        
        # Update device information
        device_update = DeviceUpdate(
            name="Updated Device",
            firmware_version="2.0.0",
            port="USB-C",
            status="idle"
        )
        
        updated_device = await service.update_device_information(device.id, device_update)
        
        assert updated_device.name == "Updated Device"
        assert updated_device.firmware_version == "2.0.0"
        assert updated_device.port == "USB-C"
        assert updated_device.status == "idle"

    @pytest.mark.asyncio
    async def test_update_device_information_not_found(self, async_session: AsyncSession):
        """Test updating information of non-existent device."""
        service = DeviceService(async_session)
        
        device_update = DeviceUpdate(name="Updated Device")
        
        with pytest.raises(DeviceNotFoundError):
            await service.update_device_information(99999, device_update)

    @pytest.mark.asyncio
    async def test_get_device_health_history(self, async_session: AsyncSession):
        """Test getting device health history."""
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
        
        service = DeviceService(async_session)
        
        # Get health history
        health_history = await service.get_device_health_history(device.id)
        
        assert len(health_history.health_history) == 3
        assert health_history.summary.average_uptime == 22.0  # (24+23+22)/3
        assert health_history.summary.reliability_score >= 0.0

    @pytest.mark.asyncio
    async def test_get_device_health_history_not_found(self, async_session: AsyncSession):
        """Test getting health history for non-existent device."""
        service = DeviceService(async_session)
        
        with pytest.raises(DeviceNotFoundError):
            await service.get_device_health_history(99999)

    @pytest.mark.asyncio
    async def test_restart_device(self, async_session: AsyncSession):
        """Test restarting a device."""
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
        
        service = DeviceService(async_session)
        
        # Restart device
        restart_request = DeviceRestartRequest(
            reason="Firmware update required",
            scheduled_time=datetime.utcnow() + timedelta(minutes=5)
        )
        
        response = await service.restart_device(device.id, restart_request)
        
        assert response.success is True
        assert response.restart_initiated is True
        assert response.estimated_downtime_minutes == 5
        assert "initiated successfully" in response.message
        
        # Verify device status was updated to offline
        updated_device = await service.device_repository.get(device.id)
        assert updated_device.status == "offline"
        
        # Verify restart alert was created
        alerts = await service.alert_repository.get_device_alerts(container.id, device.id)
        restart_alerts = [alert for alert in alerts if alert.alert_type == "restart"]
        assert len(restart_alerts) == 1

    @pytest.mark.asyncio
    async def test_restart_device_not_found(self, async_session: AsyncSession):
        """Test restarting non-existent device."""
        service = DeviceService(async_session)
        
        restart_request = DeviceRestartRequest(reason="Test restart")
        
        with pytest.raises(DeviceNotFoundError):
            await service.restart_device(99999, restart_request)

    @pytest.mark.asyncio
    async def test_get_device_alerts(self, async_session: AsyncSession):
        """Test getting device alerts for a container."""
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
        
        service = DeviceService(async_session)
        
        # Get device alerts
        device_alerts = await service.get_device_alerts(container.id)
        
        assert len(device_alerts.alerts) == 2
        assert device_alerts.alert_summary.total_alerts == 2
        assert device_alerts.alert_summary.critical == 1
        assert device_alerts.alert_summary.high == 1

    @pytest.mark.asyncio
    async def test_create_device_alert(self, async_session: AsyncSession):
        """Test creating a device alert."""
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
        
        service = DeviceService(async_session)
        
        # Create alert
        alert_data = DeviceAlertCreate(
            alert_type="temperature",
            severity="high",
            description="Device temperature exceeds threshold",
            related_object={"temperature": 85.0, "threshold": 80.0}
        )
        
        alert = await service.create_device_alert(device.id, alert_data)
        
        assert alert.id is not None
        assert alert.device_id == device.id
        assert alert.container_id == container.id
        assert alert.alert_type == "temperature"
        assert alert.severity == "high"
        assert alert.description == "Device temperature exceeds threshold"
        assert alert.related_object == {"temperature": 85.0, "threshold": 80.0}

    @pytest.mark.asyncio
    async def test_create_device_alert_device_not_found(self, async_session: AsyncSession):
        """Test creating alert for non-existent device."""
        service = DeviceService(async_session)
        
        alert_data = DeviceAlertCreate(
            alert_type="temperature",
            severity="high",
            description="Test alert"
        )
        
        with pytest.raises(DeviceNotFoundError):
            await service.create_device_alert(99999, alert_data)

    @pytest.mark.asyncio
    async def test_acknowledge_alert(self, async_session: AsyncSession):
        """Test acknowledging a device alert."""
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
        
        service = DeviceService(async_session)
        
        # Acknowledge alert
        acknowledged_alert = await service.acknowledge_alert(
            alert.id, "test_user", "Acknowledged for testing"
        )
        
        assert acknowledged_alert.acknowledged is True
        assert acknowledged_alert.acknowledged_by == "test_user"

    @pytest.mark.asyncio
    async def test_acknowledge_alert_not_found(self, async_session: AsyncSession):
        """Test acknowledging non-existent alert."""
        service = DeviceService(async_session)
        
        with pytest.raises(AlertNotFoundError):
            await service.acknowledge_alert(99999, "test_user")

    @pytest.mark.asyncio
    async def test_resolve_alert(self, async_session: AsyncSession):
        """Test resolving a device alert."""
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
        
        service = DeviceService(async_session)
        
        # Resolve alert
        resolved_alert = await service.resolve_alert(
            alert.id, "test_user", "Issue resolved by replacing component"
        )
        
        assert resolved_alert.resolved is True
        assert resolved_alert.resolved_by == "test_user"
        assert resolved_alert.resolution_notes == "Issue resolved by replacing component"
        assert resolved_alert.active is False

    @pytest.mark.asyncio
    async def test_resolve_alert_not_found(self, async_session: AsyncSession):
        """Test resolving non-existent alert."""
        service = DeviceService(async_session)
        
        with pytest.raises(AlertNotFoundError):
            await service.resolve_alert(99999, "test_user")

    @pytest.mark.asyncio
    async def test_delete_device(self, async_session: AsyncSession):
        """Test deleting a device."""
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
        
        service = DeviceService(async_session)
        
        # Delete device
        success = await service.delete_device(device.id)
        
        assert success is True
        
        # Verify device was deleted
        deleted_device = await service.device_repository.get(device.id)
        assert deleted_device is None

    @pytest.mark.asyncio
    async def test_delete_device_with_active_alerts(self, async_session: AsyncSession):
        """Test deleting device with active alerts."""
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
        
        service = DeviceService(async_session)
        
        # Try to delete device with active alerts
        with pytest.raises(ValueError, match="active alerts"):
            await service.delete_device(device.id)

    @pytest.mark.asyncio
    async def test_delete_device_not_found(self, async_session: AsyncSession):
        """Test deleting non-existent device."""
        service = DeviceService(async_session)
        
        with pytest.raises(DeviceNotFoundError):
            await service.delete_device(99999)

    @pytest.mark.asyncio
    async def test_get_device_management_summary(self, async_session: AsyncSession):
        """Test getting device management summary."""
        # Create tenant and container
        tenant = Tenant(name="Management Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Management Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices
        devices = [
            Device(container_id=container.id, name="Device 1", model="M1", serial_number="MNG001", status="running"),
            Device(container_id=container.id, name="Device 2", model="M2", serial_number="MNG002", status="idle"),
            Device(container_id=container.id, name="Device 3", model="M3", serial_number="MNG003", status="offline"),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Get management summary
        summary = await service.get_device_management_summary(container.id)
        
        assert summary.device_count == 3
        assert summary.online_devices == 2  # running + idle
        assert summary.offline_devices == 1
        assert summary.management_status in ["healthy", "degraded", "critical"]

    @pytest.mark.asyncio
    async def test_bulk_update_device_status(self, async_session: AsyncSession):
        """Test bulk updating device status."""
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
        
        service = DeviceService(async_session)
        
        # Bulk update status
        bulk_update = BulkStatusUpdate(
            device_ids=[device.id for device in devices],
            status="running",
            reason="Maintenance completed"
        )
        
        response = await service.bulk_update_device_status(bulk_update)
        
        assert response.success is True
        assert len(response.updated_devices) == 3
        assert len(response.failed_updates) == 0
        assert "Successfully updated 3 devices" in response.message

    @pytest.mark.asyncio
    async def test_bulk_update_device_status_partial_failure(self, async_session: AsyncSession):
        """Test bulk update with partial failures."""
        # Create tenant and container
        tenant = Tenant(name="Partial Bulk Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Partial Bulk Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create one device
        device = Device(
            container_id=container.id,
            name="Partial Device",
            model="PartialModel",
            serial_number="PRT001",
            status="offline"
        )
        async_session.add(device)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Bulk update with valid and invalid IDs
        bulk_update = BulkStatusUpdate(
            device_ids=[device.id, 99999],  # One valid, one invalid
            status="running"
        )
        
        response = await service.bulk_update_device_status(bulk_update)
        
        assert response.success is False  # Has failures
        assert len(response.updated_devices) == 1
        assert len(response.failed_updates) == 1
        assert "with 1 failures" in response.message

    @pytest.mark.asyncio
    async def test_simulate_device_heartbeat(self, async_session: AsyncSession):
        """Test simulating device heartbeat."""
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
        
        service = DeviceService(async_session)
        
        # Simulate heartbeat
        await service.simulate_device_heartbeat(device.id)
        
        # Verify device was updated
        updated_device = await service.device_repository.get(device.id)
        assert updated_device.connectivity_last_heartbeat is not None
        assert updated_device.diagnostics_uptime == 24.1  # Incremented

    @pytest.mark.asyncio
    async def test_simulate_device_heartbeat_not_found(self, async_session: AsyncSession):
        """Test simulating heartbeat for non-existent device."""
        service = DeviceService(async_session)
        
        # Should not raise error for non-existent device
        await service.simulate_device_heartbeat(99999)

    @pytest.mark.asyncio
    async def test_get_device_configuration(self, async_session: AsyncSession):
        """Test getting device configuration."""
        # Create tenant, container, and device
        tenant = Tenant(name="Config Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Config Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Config Device",
            model="ConfigModel",
            serial_number="CFG001",
            configuration_settings={"mode": "auto", "sensitivity": 75},
            configuration_parameters={"threshold": 25.0, "interval": 30}
        )
        async_session.add(device)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Get device configuration
        config = await service.get_device_configuration(device.id)
        
        assert config.settings == {"mode": "auto", "sensitivity": 75}
        assert config.parameters == {"threshold": 25.0, "interval": 30}

    @pytest.mark.asyncio
    async def test_get_device_configuration_not_found(self, async_session: AsyncSession):
        """Test getting configuration for non-existent device."""
        service = DeviceService(async_session)
        
        with pytest.raises(DeviceNotFoundError):
            await service.get_device_configuration(99999)

    @pytest.mark.asyncio
    async def test_update_device_configuration(self, async_session: AsyncSession):
        """Test updating device configuration."""
        # Create tenant, container, and device
        tenant = Tenant(name="Update Config Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Update Config Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Update Config Device",
            model="UpdateConfigModel",
            serial_number="UCF001",
            configuration_settings={"mode": "manual"},
            configuration_parameters={"threshold": 20.0}
        )
        async_session.add(device)
        await async_session.commit()
        
        service = DeviceService(async_session)
        
        # Update device configuration
        from app.schemas.device import DeviceConfiguration
        new_config = DeviceConfiguration(
            settings={"mode": "auto", "sensitivity": 85},
            parameters={"threshold": 30.0, "interval": 60}
        )
        
        updated_config = await service.update_device_configuration(device.id, new_config)
        
        assert updated_config.settings == {"mode": "auto", "sensitivity": 85}
        assert updated_config.parameters == {"threshold": 30.0, "interval": 60}
        
        # Verify device was updated
        updated_device = await service.device_repository.get(device.id)
        assert updated_device.configuration_settings == {"mode": "auto", "sensitivity": 85}
        assert updated_device.configuration_parameters == {"threshold": 30.0, "interval": 60}

    @pytest.mark.asyncio
    async def test_update_device_configuration_not_found(self, async_session: AsyncSession):
        """Test updating configuration for non-existent device."""
        service = DeviceService(async_session)
        
        from app.schemas.device import DeviceConfiguration
        config = DeviceConfiguration()
        
        with pytest.raises(DeviceNotFoundError):
            await service.update_device_configuration(99999, config)