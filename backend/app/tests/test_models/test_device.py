"""Tests for Device model functionality."""

import pytest
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.device import Device, DeviceHealthHistory
from app.models.container import Container
from app.models.alert import Alert
from app.models.tenant import Tenant


@pytest.mark.models
@pytest.mark.database
class TestDeviceModel:
    """Test Device model functionality."""

    @pytest.mark.asyncio
    async def test_device_creation(self, async_session: AsyncSession):
        """Test creating a device with all fields."""
        # Create tenant and container first
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
        
        # Create device with all fields
        device = Device(
            container_id=container.id,
            name="Test Device",
            model="TestModel-100",
            serial_number="TM100-001",
            firmware_version="1.0.0",
            port="USB-A",
            status="running",
            last_active_at=datetime.utcnow(),
            configuration_settings={"setting1": "value1", "setting2": "value2"},
            configuration_parameters={"param1": 10, "param2": 20},
            diagnostics_uptime=24.5,
            diagnostics_error_count=0,
            diagnostics_last_error=None,
            diagnostics_performance_metrics={"cpu": 85, "memory": 70},
            connectivity_connection_type="ethernet",
            connectivity_signal_strength=98.5,
            connectivity_last_heartbeat=datetime.utcnow()
        )
        
        async_session.add(device)
        await async_session.commit()
        
        # Verify device creation
        assert device.id is not None
        assert device.container_id == container.id
        assert device.name == "Test Device"
        assert device.model == "TestModel-100"
        assert device.serial_number == "TM100-001"
        assert device.firmware_version == "1.0.0"
        assert device.port == "USB-A"
        assert device.status == "running"
        assert device.last_active_at is not None
        assert device.configuration_settings == {"setting1": "value1", "setting2": "value2"}
        assert device.configuration_parameters == {"param1": 10, "param2": 20}
        assert device.diagnostics_uptime == 24.5
        assert device.diagnostics_error_count == 0
        assert device.diagnostics_last_error is None
        assert device.diagnostics_performance_metrics == {"cpu": 85, "memory": 70}
        assert device.connectivity_connection_type == "ethernet"
        assert device.connectivity_signal_strength == 98.5
        assert device.connectivity_last_heartbeat is not None
        assert isinstance(device.created_at, datetime)
        assert isinstance(device.updated_at, datetime)

    @pytest.mark.asyncio
    async def test_device_minimal_creation(self, async_session: AsyncSession):
        """Test creating a device with minimal fields."""
        # Create tenant and container first
        tenant = Tenant(name="Minimal Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Minimal Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create minimal device
        device = Device(
            container_id=container.id,
            name="Minimal Device",
            model="MinimalModel",
            serial_number="MIN001"
        )
        
        async_session.add(device)
        await async_session.commit()
        
        # Verify defaults
        assert device.id is not None
        assert device.container_id == container.id
        assert device.name == "Minimal Device"
        assert device.model == "MinimalModel"
        assert device.serial_number == "MIN001"
        assert device.firmware_version is None
        assert device.port is None
        assert device.status is None
        assert device.last_active_at is None
        assert device.configuration_settings is None
        assert device.configuration_parameters is None
        assert device.diagnostics_uptime is None
        assert device.diagnostics_error_count == 0  # Default value
        assert device.diagnostics_last_error is None
        assert device.diagnostics_performance_metrics is None
        assert device.connectivity_connection_type is None
        assert device.connectivity_signal_strength is None
        assert device.connectivity_last_heartbeat is None

    @pytest.mark.asyncio
    async def test_device_container_relationship(self, async_session: AsyncSession):
        """Test device relationship with container."""
        # Create tenant and container
        tenant = Tenant(name="Relationship Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Relationship Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Relationship Device",
            model="RelModel",
            serial_number="REL001"
        )
        
        async_session.add(device)
        await async_session.commit()
        
        # Test relationship loading
        device_with_container = await async_session.get(
            Device, device.id, options=[selectinload(Device.container)]
        )
        
        assert device_with_container.container is not None
        assert device_with_container.container.name == "Relationship Container"
        assert device_with_container.container.id == container.id

    @pytest.mark.asyncio
    async def test_device_alerts_relationship(self, async_session: AsyncSession):
        """Test device relationship with alerts."""
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
                description="Device overheating",
                severity="high",
                active=True
            ),
            Alert(
                container_id=container.id,
                device_id=device.id,
                description="Low battery",
                severity="medium",
                active=False
            )
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        # Test relationship loading
        device_with_alerts = await async_session.get(
            Device, device.id, options=[selectinload(Device.alerts)]
        )
        
        assert len(device_with_alerts.alerts) == 2
        alert_descriptions = [alert.description for alert in device_with_alerts.alerts]
        assert "Device overheating" in alert_descriptions
        assert "Low battery" in alert_descriptions

    @pytest.mark.asyncio
    async def test_device_health_history_relationship(self, async_session: AsyncSession):
        """Test device relationship with health history."""
        # Create tenant and container
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
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Health Device",
            model="HealthModel",
            serial_number="HLT001"
        )
        
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entries
        health_entries = [
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=datetime.utcnow(),
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=95.0,
                notes="Device running normally"
            ),
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=datetime.utcnow(),
                status="issue",
                uptime_hours=12.0,
                error_count=1,
                performance_score=75.0,
                notes="Minor performance issue"
            )
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        # Test relationship loading
        device_with_history = await async_session.get(
            Device, device.id, options=[selectinload(Device.health_history)]
        )
        
        assert len(device_with_history.health_history) == 2
        statuses = [entry.status for entry in device_with_history.health_history]
        assert "running" in statuses
        assert "issue" in statuses

    @pytest.mark.asyncio
    async def test_device_serial_number_uniqueness(self, async_session: AsyncSession):
        """Test that device serial numbers should be unique."""
        # Create tenant and container
        tenant = Tenant(name="Unique Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Unique Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create first device
        device1 = Device(
            container_id=container.id,
            name="Device 1",
            model="UniqueModel",
            serial_number="UNIQUE001"
        )
        
        async_session.add(device1)
        await async_session.commit()
        
        # Try to create second device with same serial number
        device2 = Device(
            container_id=container.id,
            name="Device 2",
            model="UniqueModel",
            serial_number="UNIQUE001"  # Same serial number
        )
        
        async_session.add(device2)
        with pytest.raises(Exception):  # Should raise integrity constraint error
            await async_session.commit()

    @pytest.mark.asyncio
    async def test_device_json_fields(self, async_session: AsyncSession):
        """Test device JSON fields functionality."""
        # Create tenant and container
        tenant = Tenant(name="JSON Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="JSON Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device with complex JSON data
        complex_settings = {
            "network": {
                "ip": "192.168.1.100",
                "subnet": "255.255.255.0",
                "gateway": "192.168.1.1"
            },
            "sensors": [
                {"type": "temperature", "threshold": 25.0},
                {"type": "humidity", "threshold": 80.0}
            ],
            "enabled": True
        }
        
        complex_parameters = {
            "calibration": {
                "temperature": {"offset": 0.5, "scale": 1.0},
                "humidity": {"offset": -0.2, "scale": 1.1}
            },
            "polling_interval": 30,
            "batch_size": 100
        }
        
        complex_metrics = {
            "cpu_usage": [85.2, 87.1, 82.9],
            "memory_usage": [70.5, 72.1, 68.9],
            "disk_usage": 45.2,
            "network_stats": {
                "bytes_sent": 1024000,
                "bytes_received": 2048000,
                "packets_sent": 1500,
                "packets_received": 2000
            }
        }
        
        device = Device(
            container_id=container.id,
            name="JSON Device",
            model="JSONModel",
            serial_number="JSON001",
            configuration_settings=complex_settings,
            configuration_parameters=complex_parameters,
            diagnostics_performance_metrics=complex_metrics
        )
        
        async_session.add(device)
        await async_session.commit()
        
        # Verify JSON data is stored and retrieved correctly
        retrieved_device = await async_session.get(Device, device.id)
        
        assert retrieved_device.configuration_settings == complex_settings
        assert retrieved_device.configuration_parameters == complex_parameters
        assert retrieved_device.diagnostics_performance_metrics == complex_metrics
        
        # Test accessing nested JSON data
        assert retrieved_device.configuration_settings["network"]["ip"] == "192.168.1.100"
        assert retrieved_device.configuration_parameters["calibration"]["temperature"]["offset"] == 0.5
        assert retrieved_device.diagnostics_performance_metrics["network_stats"]["bytes_sent"] == 1024000

    @pytest.mark.asyncio
    async def test_device_cascade_delete(self, async_session: AsyncSession):
        """Test that device deletion cascades to related entities."""
        # Create tenant and container
        tenant = Tenant(name="Cascade Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cascade Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create device
        device = Device(
            container_id=container.id,
            name="Cascade Device",
            model="CascadeModel",
            serial_number="CAS001"
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
            performance_score=90.0
        )
        
        async_session.add_all([alert, health_entry])
        await async_session.commit()
        
        # Verify related entities exist
        alerts_query = select(Alert).where(Alert.device_id == device.id)
        health_query = select(DeviceHealthHistory).where(DeviceHealthHistory.device_id == device.id)
        
        alerts_result = await async_session.execute(alerts_query)
        health_result = await async_session.execute(health_query)
        
        assert len(alerts_result.scalars().all()) == 1
        assert len(health_result.scalars().all()) == 1
        
        # Delete device
        await async_session.delete(device)
        await async_session.commit()
        
        # Verify related entities are deleted (cascade)
        alerts_result = await async_session.execute(alerts_query)
        health_result = await async_session.execute(health_query)
        
        assert len(alerts_result.scalars().all()) == 0
        assert len(health_result.scalars().all()) == 0

    @pytest.mark.asyncio
    async def test_device_foreign_key_constraint(self, async_session: AsyncSession):
        """Test that device cannot be created without valid container."""
        # Try to create device with non-existent container
        device = Device(
            container_id=99999,  # Non-existent container
            name="Invalid Device",
            model="InvalidModel",
            serial_number="INV001"
        )
        
        async_session.add(device)
        with pytest.raises(Exception):  # Should raise foreign key constraint error
            await async_session.commit()


@pytest.mark.models
@pytest.mark.database
class TestDeviceHealthHistoryModel:
    """Test DeviceHealthHistory model functionality."""

    @pytest.mark.asyncio
    async def test_health_history_creation(self, async_session: AsyncSession):
        """Test creating a health history entry."""
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
        
        # Create health history entry
        timestamp = datetime.utcnow()
        health_entry = DeviceHealthHistory(
            device_id=device.id,
            timestamp=timestamp,
            status="running",
            uptime_hours=48.5,
            error_count=2,
            performance_score=87.5,
            notes="Device running with minor issues"
        )
        
        async_session.add(health_entry)
        await async_session.commit()
        
        # Verify creation
        assert health_entry.id is not None
        assert health_entry.device_id == device.id
        assert health_entry.timestamp == timestamp
        assert health_entry.status == "running"
        assert health_entry.uptime_hours == 48.5
        assert health_entry.error_count == 2
        assert health_entry.performance_score == 87.5
        assert health_entry.notes == "Device running with minor issues"

    @pytest.mark.asyncio
    async def test_health_history_device_relationship(self, async_session: AsyncSession):
        """Test health history relationship with device."""
        # Create tenant, container, and device
        tenant = Tenant(name="Relationship Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Relationship Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Relationship Device",
            model="RelModel",
            serial_number="REL001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entry
        health_entry = DeviceHealthHistory(
            device_id=device.id,
            timestamp=datetime.utcnow(),
            status="running",
            uptime_hours=24.0,
            error_count=0,
            performance_score=95.0
        )
        
        async_session.add(health_entry)
        await async_session.commit()
        
        # Test relationship loading
        health_with_device = await async_session.get(
            DeviceHealthHistory, health_entry.id, options=[selectinload(DeviceHealthHistory.device)]
        )
        
        assert health_with_device.device is not None
        assert health_with_device.device.name == "Relationship Device"
        assert health_with_device.device.id == device.id

    @pytest.mark.asyncio
    async def test_health_history_cascade_delete(self, async_session: AsyncSession):
        """Test that health history is deleted when device is deleted."""
        # Create tenant, container, and device
        tenant = Tenant(name="Cascade Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cascade Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Cascade Device",
            model="CascadeModel",
            serial_number="CAS001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entry
        health_entry = DeviceHealthHistory(
            device_id=device.id,
            timestamp=datetime.utcnow(),
            status="running",
            uptime_hours=24.0,
            error_count=0,
            performance_score=90.0
        )
        
        async_session.add(health_entry)
        await async_session.commit()
        
        # Verify health entry exists
        health_query = select(DeviceHealthHistory).where(DeviceHealthHistory.device_id == device.id)
        health_result = await async_session.execute(health_query)
        assert len(health_result.scalars().all()) == 1
        
        # Delete device
        await async_session.delete(device)
        await async_session.commit()
        
        # Verify health entry is deleted (cascade)
        health_result = await async_session.execute(health_query)
        assert len(health_result.scalars().all()) == 0

    @pytest.mark.asyncio
    async def test_health_history_foreign_key_constraint(self, async_session: AsyncSession):
        """Test that health history cannot be created without valid device."""
        # Try to create health history with non-existent device
        health_entry = DeviceHealthHistory(
            device_id=99999,  # Non-existent device
            timestamp=datetime.utcnow(),
            status="running",
            uptime_hours=24.0,
            error_count=0,
            performance_score=90.0
        )
        
        async_session.add(health_entry)
        with pytest.raises(Exception):  # Should raise foreign key constraint error
            await async_session.commit()

    @pytest.mark.asyncio
    async def test_health_history_performance_score_validation(self, async_session: AsyncSession):
        """Test health history performance score validation."""
        # Create tenant, container, and device
        tenant = Tenant(name="Score Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Score Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Score Device",
            model="ScoreModel",
            serial_number="SCR001"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Test valid performance scores
        valid_scores = [0.0, 50.0, 100.0, 87.5]
        
        for score in valid_scores:
            health_entry = DeviceHealthHistory(
                device_id=device.id,
                timestamp=datetime.utcnow(),
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=score
            )
            
            async_session.add(health_entry)
            await async_session.commit()
            
            # Verify score is stored correctly
            retrieved_entry = await async_session.get(DeviceHealthHistory, health_entry.id)
            assert retrieved_entry.performance_score == score
            
            # Clean up for next iteration
            await async_session.delete(health_entry)
            await async_session.commit()