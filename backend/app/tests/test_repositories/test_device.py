"""Tests for Device repository operations."""

import pytest
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.device import DeviceRepository, DeviceHealthHistoryRepository, DeviceAlertRepository
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceRegistration
from app.models.device import Device, DeviceHealthHistory
from app.models.container import Container
from app.models.tenant import Tenant
from app.models.alert import Alert


@pytest.mark.repositories
@pytest.mark.database
class TestDeviceRepository:
    """Test DeviceRepository functionality."""

    @pytest.mark.asyncio
    async def test_repository_initialization(self, async_session: AsyncSession):
        """Test repository initialization."""
        repository = DeviceRepository(async_session)
        
        assert repository.db == async_session
        assert repository.model == Device

    @pytest.mark.asyncio
    async def test_get_by_container_id(self, async_session: AsyncSession):
        """Test getting devices by container ID."""
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
        
        # Create devices
        devices = [
            Device(
                container_id=container.id,
                name=f"Device {i}",
                model=f"Model{i}",
                serial_number=f"SN{i:03d}",
                status="running" if i % 2 == 0 else "idle"
            )
            for i in range(1, 4)
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get devices by container ID
        container_devices = await repository.get_by_container_id(container.id)
        
        assert len(container_devices) == 3
        for device in container_devices:
            assert device.container_id == container.id
            assert device.alerts is not None  # Relationship loaded

    @pytest.mark.asyncio
    async def test_get_by_container_id_empty(self, async_session: AsyncSession):
        """Test getting devices for container with no devices."""
        # Create tenant and container
        tenant = Tenant(name="Empty Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Empty Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get devices by container ID
        container_devices = await repository.get_by_container_id(container.id)
        
        assert len(container_devices) == 0

    @pytest.mark.asyncio
    async def test_get_device_status_counts(self, async_session: AsyncSession):
        """Test getting device status counts for a container."""
        # Create tenant and container
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
        
        # Create devices with different statuses
        devices = [
            Device(container_id=container.id, name="Device 1", model="M1", serial_number="SN001", status="running"),
            Device(container_id=container.id, name="Device 2", model="M2", serial_number="SN002", status="running"),
            Device(container_id=container.id, name="Device 3", model="M3", serial_number="SN003", status="idle"),
            Device(container_id=container.id, name="Device 4", model="M4", serial_number="SN004", status="issue"),
            Device(container_id=container.id, name="Device 5", model="M5", serial_number="SN005", status="offline"),
            Device(container_id=container.id, name="Device 6", model="M6", serial_number="SN006", status="offline"),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get status counts
        status_counts = await repository.get_device_status_counts(container.id)
        
        assert status_counts["running"] == 2
        assert status_counts["idle"] == 1
        assert status_counts["issue"] == 1
        assert status_counts["offline"] == 2

    @pytest.mark.asyncio
    async def test_get_device_status_counts_empty(self, async_session: AsyncSession):
        """Test getting device status counts for container with no devices."""
        # Create tenant and container
        tenant = Tenant(name="Empty Status Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Empty Status Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get status counts
        status_counts = await repository.get_device_status_counts(container.id)
        
        assert status_counts["running"] == 0
        assert status_counts["idle"] == 0
        assert status_counts["issue"] == 0
        assert status_counts["offline"] == 0

    @pytest.mark.asyncio
    async def test_get_device_with_details(self, async_session: AsyncSession):
        """Test getting device with all details and relationships."""
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
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Details Device",
            model="DetailsModel",
            serial_number="DET001",
            status="running"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create related entities
        alert = Alert(
            container_id=container.id,
            device_id=device.id,
            description="Test alert",
            severity="medium",
            active=True
        )
        
        health_entry = DeviceHealthHistory(
            device_id=device.id,
            timestamp=datetime.utcnow(),
            status="running",
            uptime_hours=24.0,
            error_count=0,
            performance_score=95.0
        )
        
        async_session.add_all([alert, health_entry])
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get device with details
        device_with_details = await repository.get_device_with_details(device.id)
        
        assert device_with_details is not None
        assert device_with_details.id == device.id
        assert device_with_details.container is not None
        assert device_with_details.alerts is not None
        assert device_with_details.health_history is not None
        assert len(device_with_details.alerts) == 1
        assert len(device_with_details.health_history) == 1

    @pytest.mark.asyncio
    async def test_get_device_with_details_not_found(self, async_session: AsyncSession):
        """Test getting non-existent device with details."""
        repository = DeviceRepository(async_session)
        
        device = await repository.get_device_with_details(99999)
        
        assert device is None

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
        
        repository = DeviceRepository(async_session)
        
        # Register device
        device_data = DeviceRegistration(
            container_id=container.id,
            name="Registered Device",
            model="RegisterModel",
            serial_number="REG001",
            firmware_version="1.0.0",
            port="USB-A"
        )
        
        device = await repository.register_device(device_data)
        
        assert device.id is not None
        assert device.container_id == container.id
        assert device.name == "Registered Device"
        assert device.model == "RegisterModel"
        assert device.serial_number == "REG001"
        assert device.firmware_version == "1.0.0"
        assert device.port == "USB-A"
        assert device.status == "offline"  # Default status
        assert device.last_active_at is not None

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
        
        repository = DeviceRepository(async_session)
        
        # Update device status
        updated_device = await repository.update_device_status(
            device.id, "running", "Device started successfully"
        )
        
        assert updated_device is not None
        assert updated_device.id == device.id
        assert updated_device.status == "running"
        assert updated_device.last_active_at is not None
        
        # Verify health history entry was created
        health_repository = DeviceHealthHistoryRepository(async_session)
        health_entries = await health_repository.get_device_health_history(device.id)
        
        assert len(health_entries) == 1
        assert health_entries[0].status == "running"
        assert health_entries[0].notes == "Device started successfully"

    @pytest.mark.asyncio
    async def test_update_device_status_not_found(self, async_session: AsyncSession):
        """Test updating status of non-existent device."""
        repository = DeviceRepository(async_session)
        
        updated_device = await repository.update_device_status(99999, "running")
        
        assert updated_device is None

    @pytest.mark.asyncio
    async def test_bulk_update_status(self, async_session: AsyncSession):
        """Test updating status for multiple devices."""
        # Create tenant and container
        tenant = Tenant(name="Bulk Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Bulk Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices
        devices = [
            Device(
                container_id=container.id,
                name=f"Bulk Device {i}",
                model=f"BulkModel{i}",
                serial_number=f"BLK{i:03d}",
                status="offline"
            )
            for i in range(1, 4)
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Bulk update status
        device_ids = [device.id for device in devices]
        result = await repository.bulk_update_status(
            device_ids, "running", "Bulk maintenance complete"
        )
        
        assert len(result["updated_devices"]) == 3
        assert len(result["failed_updates"]) == 0
        
        # Verify all devices were updated
        for device_id in device_ids:
            device = await repository.get(device_id)
            assert device.status == "running"

    @pytest.mark.asyncio
    async def test_bulk_update_status_partial_failure(self, async_session: AsyncSession):
        """Test bulk status update with some failures."""
        # Create tenant and container
        tenant = Tenant(name="Partial Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Partial Container",
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
            serial_number="PAR001",
            status="offline"
        )
        async_session.add(device)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Bulk update with valid and invalid IDs
        device_ids = [device.id, 99999]  # One valid, one invalid
        result = await repository.bulk_update_status(device_ids, "running")
        
        assert len(result["updated_devices"]) == 1
        assert len(result["failed_updates"]) == 1
        assert result["updated_devices"][0] == device.id
        assert result["failed_updates"][0]["device_id"] == 99999
        assert result["failed_updates"][0]["error"] == "Device not found"

    @pytest.mark.asyncio
    async def test_get_device_management_summary(self, async_session: AsyncSession):
        """Test getting device management summary for a container."""
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
        
        # Create devices with different statuses and uptime values
        devices = [
            Device(
                container_id=container.id,
                name="Device 1",
                model="M1",
                serial_number="SUM001",
                status="running",
                diagnostics_uptime=24.0
            ),
            Device(
                container_id=container.id,
                name="Device 2",
                model="M2",
                serial_number="SUM002",
                status="idle",
                diagnostics_uptime=20.0
            ),
            Device(
                container_id=container.id,
                name="Device 3",
                model="M3",
                serial_number="SUM003",
                status="issue",
                diagnostics_uptime=12.0
            ),
            Device(
                container_id=container.id,
                name="Device 4",
                model="M4",
                serial_number="SUM004",
                status="offline"
            ),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get management summary
        summary = await repository.get_device_management_summary(container.id)
        
        assert summary["device_count"] == 4
        assert summary["online_devices"] == 2  # running + idle
        assert summary["offline_devices"] == 1
        assert summary["devices_with_issues"] == 1
        assert summary["management_status"] in ["healthy", "degraded", "critical"]
        assert summary["firmware_updates_available"] == 0
        assert summary["average_uptime"] == 18.666666666666668  # (24+20+12)/3
        assert "last_sync" in summary

    @pytest.mark.asyncio
    async def test_get_device_management_summary_critical_status(self, async_session: AsyncSession):
        """Test management summary with critical status."""
        # Create tenant and container
        tenant = Tenant(name="Critical Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Critical Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create mostly offline devices (>30% offline = critical)
        devices = [
            Device(container_id=container.id, name="Device 1", model="M1", serial_number="CRT001", status="running"),
            Device(container_id=container.id, name="Device 2", model="M2", serial_number="CRT002", status="offline"),
            Device(container_id=container.id, name="Device 3", model="M3", serial_number="CRT003", status="offline"),
        ]
        
        async_session.add_all(devices)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get management summary
        summary = await repository.get_device_management_summary(container.id)
        
        assert summary["management_status"] == "critical"  # 2/3 = 66% offline > 30%

    @pytest.mark.asyncio
    async def test_get_by_serial_number(self, async_session: AsyncSession):
        """Test getting device by serial number."""
        # Create tenant and container
        tenant = Tenant(name="Serial Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Serial Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Serial Device",
            model="SerialModel",
            serial_number="SERIAL001",
            status="running"
        )
        async_session.add(device)
        await async_session.commit()
        
        repository = DeviceRepository(async_session)
        
        # Get device by serial number
        found_device = await repository.get_by_serial_number("SERIAL001")
        
        assert found_device is not None
        assert found_device.id == device.id
        assert found_device.serial_number == "SERIAL001"

    @pytest.mark.asyncio
    async def test_get_by_serial_number_not_found(self, async_session: AsyncSession):
        """Test getting device by non-existent serial number."""
        repository = DeviceRepository(async_session)
        
        device = await repository.get_by_serial_number("NONEXISTENT")
        
        assert device is None


@pytest.mark.repositories
@pytest.mark.database
class TestDeviceHealthHistoryRepository:
    """Test DeviceHealthHistoryRepository functionality."""

    @pytest.mark.asyncio
    async def test_repository_initialization(self, async_session: AsyncSession):
        """Test repository initialization."""
        repository = DeviceHealthHistoryRepository(async_session)
        
        assert repository.db == async_session
        assert repository.model == DeviceHealthHistory

    @pytest.mark.asyncio
    async def test_get_device_health_history(self, async_session: AsyncSession):
        """Test getting health history for a device."""
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
            for i in range(5)
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        repository = DeviceHealthHistoryRepository(async_session)
        
        # Get health history
        history = await repository.get_device_health_history(device.id)
        
        assert len(history) == 5
        # Should be ordered by timestamp desc (most recent first)
        for i in range(len(history) - 1):
            assert history[i].timestamp >= history[i + 1].timestamp

    @pytest.mark.asyncio
    async def test_get_device_health_history_with_date_range(self, async_session: AsyncSession):
        """Test getting health history with date range filter."""
        # Create tenant, container, and device
        tenant = Tenant(name="Range Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Range Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Range Device",
            model="RangeModel",
            serial_number="RNG001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entries across different dates
        base_time = datetime.utcnow()
        health_entries = [
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=base_time - timedelta(days=i),
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=95.0
            )
            for i in range(10)  # 10 days of history
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        repository = DeviceHealthHistoryRepository(async_session)
        
        # Get history for last 5 days
        start_date = base_time - timedelta(days=5)
        history = await repository.get_device_health_history(
            device.id, start_date=start_date
        )
        
        assert len(history) == 6  # Days 0-5 inclusive
        for entry in history:
            assert entry.timestamp >= start_date

    @pytest.mark.asyncio
    async def test_get_device_health_history_with_limit(self, async_session: AsyncSession):
        """Test getting health history with limit."""
        # Create tenant, container, and device
        tenant = Tenant(name="Limit Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Limit Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Limit Device",
            model="LimitModel",
            serial_number="LMT001"
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
            for i in range(50)  # 50 entries
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        repository = DeviceHealthHistoryRepository(async_session)
        
        # Get limited history
        history = await repository.get_device_health_history(device.id, limit=10)
        
        assert len(history) == 10

    @pytest.mark.asyncio
    async def test_get_health_summary(self, async_session: AsyncSession):
        """Test getting health summary for a device."""
        # Create tenant, container, and device
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
        
        device = Device(
            container_id=container.id,
            name="Summary Device",
            model="SummaryModel",
            serial_number="SUM001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entries with varying performance
        health_entries = [
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=datetime.utcnow(),
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=95.0,
                notes="Running normally"
            ),
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=datetime.utcnow(),
                status="issue",
                uptime_hours=20.0,
                error_count=1,
                performance_score=80.0,
                notes="Minor issue detected"
            ),
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=datetime.utcnow(),
                status="running",
                uptime_hours=22.0,
                error_count=0,
                performance_score=90.0,
                notes="Issue resolved"
            ),
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        repository = DeviceHealthHistoryRepository(async_session)
        
        # Get health summary
        summary = await repository.get_health_summary(device.id)
        
        assert summary["average_uptime"] == 22.0  # (24+20+22)/3
        assert summary["total_downtime_hours"] == 6.0  # (0+4+2)
        assert summary["reliability_score"] == 91.66666666666667  # (22/24)*100
        assert len(summary["common_issues"]) == 1  # One issue note
        assert "Minor issue detected" in summary["common_issues"]

    @pytest.mark.asyncio
    async def test_get_health_summary_no_data(self, async_session: AsyncSession):
        """Test getting health summary for device with no history."""
        # Create tenant, container, and device
        tenant = Tenant(name="No Data Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="No Data Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="No Data Device",
            model="NoDataModel",
            serial_number="NOD001"
        )
        async_session.add(device)
        await async_session.commit()
        
        repository = DeviceHealthHistoryRepository(async_session)
        
        # Get health summary
        summary = await repository.get_health_summary(device.id)
        
        assert summary["average_uptime"] == 0.0
        assert summary["total_downtime_hours"] == 0.0
        assert summary["reliability_score"] == 0.0
        assert summary["common_issues"] == []


@pytest.mark.repositories
@pytest.mark.database
class TestDeviceAlertRepository:
    """Test DeviceAlertRepository functionality."""

    @pytest.mark.asyncio
    async def test_repository_initialization(self, async_session: AsyncSession):
        """Test repository initialization."""
        repository = DeviceAlertRepository(async_session)
        
        assert repository.db == async_session

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
        
        # Create devices
        device1 = Device(
            container_id=container.id,
            name="Alert Device 1",
            model="AlertModel1",
            serial_number="ALT001"
        )
        device2 = Device(
            container_id=container.id,
            name="Alert Device 2",
            model="AlertModel2",
            serial_number="ALT002"
        )
        async_session.add_all([device1, device2])
        await async_session.flush()
        
        # Create alerts
        alerts = [
            Alert(
                container_id=container.id,
                device_id=device1.id,
                description="Device 1 overheating",
                severity="high",
                active=True
            ),
            Alert(
                container_id=container.id,
                device_id=device2.id,
                description="Device 2 low battery",
                severity="medium",
                active=True
            ),
            Alert(
                container_id=container.id,
                device_id=device1.id,
                description="Device 1 resolved issue",
                severity="low",
                active=False
            ),
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        repository = DeviceAlertRepository(async_session)
        
        # Get all active device alerts
        device_alerts = await repository.get_device_alerts(container.id)
        
        assert len(device_alerts) == 2  # Only active alerts
        for alert in device_alerts:
            assert alert.device_id is not None
            assert alert.active is True
            assert alert.device is not None  # Relationship loaded

    @pytest.mark.asyncio
    async def test_get_device_alerts_filtered(self, async_session: AsyncSession):
        """Test getting device alerts with filters."""
        # Create tenant and container
        tenant = Tenant(name="Filter Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Filter Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Filter Device",
            model="FilterModel",
            serial_number="FLT001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create alerts with different severities
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
            Alert(
                container_id=container.id,
                device_id=device.id,
                description="Medium alert",
                severity="medium",
                active=False
            ),
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        repository = DeviceAlertRepository(async_session)
        
        # Get alerts filtered by device
        device_alerts = await repository.get_device_alerts(
            container.id, device_id=device.id
        )
        assert len(device_alerts) == 2  # Only active alerts for this device
        
        # Get alerts filtered by severity
        critical_alerts = await repository.get_device_alerts(
            container.id, severity="critical"
        )
        assert len(critical_alerts) == 1
        assert critical_alerts[0].severity == "critical"
        
        # Get all alerts (including inactive)
        all_alerts = await repository.get_device_alerts(
            container.id, active_only=False
        )
        assert len(all_alerts) == 3

    @pytest.mark.asyncio
    async def test_create_device_alert(self, async_session: AsyncSession):
        """Test creating a device alert."""
        # Create tenant and container
        tenant = Tenant(name="Create Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Create Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Create Device",
            model="CreateModel",
            serial_number="CRT001"
        )
        async_session.add(device)
        await async_session.commit()
        
        repository = DeviceAlertRepository(async_session)
        
        # Create alert
        alert = await repository.create_device_alert(
            device_id=device.id,
            container_id=container.id,
            alert_type="temperature",
            severity="high",
            description="Device temperature too high",
            related_object={"temperature": 85.0, "threshold": 80.0}
        )
        
        assert alert.id is not None
        assert alert.device_id == device.id
        assert alert.container_id == container.id
        assert alert.alert_type == "temperature"
        assert alert.severity == "high"
        assert alert.description == "Device temperature too high"
        assert alert.related_object == {"temperature": 85.0, "threshold": 80.0}
        assert alert.active is True
        assert alert.acknowledged is False
        assert alert.resolved is False

    @pytest.mark.asyncio
    async def test_acknowledge_alert(self, async_session: AsyncSession):
        """Test acknowledging an alert."""
        # Create tenant, container, and device
        tenant = Tenant(name="Ack Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Ack Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Ack Device",
            model="AckModel",
            serial_number="ACK001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create alert
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
        
        repository = DeviceAlertRepository(async_session)
        
        # Acknowledge alert
        acknowledged_alert = await repository.acknowledge_alert(
            alert.id, "test_user", "Acknowledged for testing"
        )
        
        assert acknowledged_alert is not None
        assert acknowledged_alert.id == alert.id
        assert acknowledged_alert.acknowledged is True
        assert acknowledged_alert.acknowledged_by == "test_user"
        assert acknowledged_alert.acknowledged_at is not None
        assert acknowledged_alert.related_object is not None
        assert "acknowledgment_notes" in acknowledged_alert.related_object

    @pytest.mark.asyncio
    async def test_acknowledge_alert_not_found(self, async_session: AsyncSession):
        """Test acknowledging non-existent alert."""
        repository = DeviceAlertRepository(async_session)
        
        acknowledged_alert = await repository.acknowledge_alert(99999, "test_user")
        
        assert acknowledged_alert is None

    @pytest.mark.asyncio
    async def test_resolve_alert(self, async_session: AsyncSession):
        """Test resolving an alert."""
        # Create tenant, container, and device
        tenant = Tenant(name="Resolve Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Resolve Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Resolve Device",
            model="ResolveModel",
            serial_number="RES001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create alert
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
        
        repository = DeviceAlertRepository(async_session)
        
        # Resolve alert
        resolved_alert = await repository.resolve_alert(
            alert.id, "test_user", "Issue fixed by replacing sensor"
        )
        
        assert resolved_alert is not None
        assert resolved_alert.id == alert.id
        assert resolved_alert.resolved is True
        assert resolved_alert.resolved_by == "test_user"
        assert resolved_alert.resolved_at is not None
        assert resolved_alert.resolution_notes == "Issue fixed by replacing sensor"
        assert resolved_alert.active is False

    @pytest.mark.asyncio
    async def test_resolve_alert_not_found(self, async_session: AsyncSession):
        """Test resolving non-existent alert."""
        repository = DeviceAlertRepository(async_session)
        
        resolved_alert = await repository.resolve_alert(99999, "test_user")
        
        assert resolved_alert is None

    @pytest.mark.asyncio
    async def test_get_alert_summary(self, async_session: AsyncSession):
        """Test getting alert summary."""
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
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Summary Device",
            model="SummaryModel",
            serial_number="SUM001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create alerts with different severities
        alerts = [
            Alert(container_id=container.id, device_id=device.id, description="Critical 1", severity="critical", active=True),
            Alert(container_id=container.id, device_id=device.id, description="Critical 2", severity="critical", active=True),
            Alert(container_id=container.id, device_id=device.id, description="High 1", severity="high", active=True),
            Alert(container_id=container.id, device_id=device.id, description="Medium 1", severity="medium", active=True),
            Alert(container_id=container.id, device_id=device.id, description="Low 1", severity="low", active=True),
            Alert(container_id=container.id, device_id=device.id, description="Inactive", severity="high", active=False),
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        repository = DeviceAlertRepository(async_session)
        
        # Get alert summary
        summary = await repository.get_alert_summary(container.id)
        
        assert summary["total_alerts"] == 5  # Only active alerts
        assert summary["critical"] == 2
        assert summary["high"] == 1
        assert summary["medium"] == 1
        assert summary["low"] == 1

    @pytest.mark.asyncio
    async def test_get_alert_summary_no_alerts(self, async_session: AsyncSession):
        """Test getting alert summary for container with no device alerts."""
        # Create tenant and container
        tenant = Tenant(name="No Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="No Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.commit()
        
        repository = DeviceAlertRepository(async_session)
        
        # Get alert summary
        summary = await repository.get_alert_summary(container.id)
        
        assert summary["total_alerts"] == 0
        assert summary["critical"] == 0
        assert summary["high"] == 0
        assert summary["medium"] == 0
        assert summary["low"] == 0