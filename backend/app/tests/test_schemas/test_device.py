"""Tests for Device schemas."""

import pytest
from datetime import datetime
from typing import Dict, Any
from pydantic import ValidationError

from app.schemas.device import (
    DeviceConfiguration, DeviceDiagnostics, DeviceConnectivity,
    DeviceStatusOverview, HealthHistoryEntry, HealthSummary,
    DeviceHealthHistory, DeviceBase, DeviceCreate, DeviceUpdate,
    DeviceRegistration, DeviceStatusUpdate, DeviceStatusUpdateResponse,
    DeviceRestartRequest, DeviceRestartResponse, DeviceManagementSummary,
    BulkStatusUpdate, BulkStatusUpdateResponse, Device, DeviceDetails,
    ContainerDevices
)


@pytest.mark.schemas
class TestDeviceConfiguration:
    """Test DeviceConfiguration schema."""

    def test_device_configuration_default(self):
        """Test DeviceConfiguration with default values."""
        config = DeviceConfiguration()
        
        assert config.settings == {}
        assert config.parameters == {}

    def test_device_configuration_with_data(self):
        """Test DeviceConfiguration with data."""
        settings = {"mode": "auto", "sensitivity": 75}
        parameters = {"threshold": 25.0, "interval": 30}
        
        config = DeviceConfiguration(
            settings=settings,
            parameters=parameters
        )
        
        assert config.settings == settings
        assert config.parameters == parameters

    def test_device_configuration_from_dict(self):
        """Test DeviceConfiguration from dictionary."""
        data = {
            "settings": {"network": {"ip": "192.168.1.100"}},
            "parameters": {"calibration": {"offset": 0.5}}
        }
        
        config = DeviceConfiguration(**data)
        
        assert config.settings == data["settings"]
        assert config.parameters == data["parameters"]


@pytest.mark.schemas
class TestDeviceDiagnostics:
    """Test DeviceDiagnostics schema."""

    def test_device_diagnostics_default(self):
        """Test DeviceDiagnostics with default values."""
        diagnostics = DeviceDiagnostics()
        
        assert diagnostics.uptime is None
        assert diagnostics.error_count == 0
        assert diagnostics.last_error is None
        assert diagnostics.performance_metrics == {}

    def test_device_diagnostics_with_data(self):
        """Test DeviceDiagnostics with data."""
        diagnostics = DeviceDiagnostics(
            uptime=24.5,
            error_count=2,
            last_error="Connection timeout",
            performance_metrics={"cpu": 85.2, "memory": 70.1}
        )
        
        assert diagnostics.uptime == 24.5
        assert diagnostics.error_count == 2
        assert diagnostics.last_error == "Connection timeout"
        assert diagnostics.performance_metrics == {"cpu": 85.2, "memory": 70.1}

    def test_device_diagnostics_error_count_validation(self):
        """Test DeviceDiagnostics error count validation."""
        # Valid error count
        diagnostics = DeviceDiagnostics(error_count=5)
        assert diagnostics.error_count == 5
        
        # Negative error count should work (system allows it)
        diagnostics = DeviceDiagnostics(error_count=-1)
        assert diagnostics.error_count == -1


@pytest.mark.schemas
class TestDeviceConnectivity:
    """Test DeviceConnectivity schema."""

    def test_device_connectivity_default(self):
        """Test DeviceConnectivity with default values."""
        connectivity = DeviceConnectivity()
        
        assert connectivity.connection_type is None
        assert connectivity.signal_strength is None
        assert connectivity.last_heartbeat is None

    def test_device_connectivity_with_data(self):
        """Test DeviceConnectivity with data."""
        timestamp = datetime.utcnow()
        
        connectivity = DeviceConnectivity(
            connection_type="ethernet",
            signal_strength=98.5,
            last_heartbeat=timestamp
        )
        
        assert connectivity.connection_type == "ethernet"
        assert connectivity.signal_strength == 98.5
        assert connectivity.last_heartbeat == timestamp

    def test_device_connectivity_signal_strength_validation(self):
        """Test DeviceConnectivity signal strength validation."""
        # Valid signal strength
        connectivity = DeviceConnectivity(signal_strength=75.0)
        assert connectivity.signal_strength == 75.0
        
        # Edge cases
        connectivity = DeviceConnectivity(signal_strength=0.0)
        assert connectivity.signal_strength == 0.0
        
        connectivity = DeviceConnectivity(signal_strength=100.0)
        assert connectivity.signal_strength == 100.0


@pytest.mark.schemas
class TestDeviceStatusOverview:
    """Test DeviceStatusOverview schema."""

    def test_device_status_overview_default(self):
        """Test DeviceStatusOverview with default values."""
        overview = DeviceStatusOverview()
        
        assert overview.running == 0
        assert overview.idle == 0
        assert overview.issue == 0
        assert overview.offline == 0

    def test_device_status_overview_with_data(self):
        """Test DeviceStatusOverview with data."""
        overview = DeviceStatusOverview(
            running=5,
            idle=3,
            issue=1,
            offline=2
        )
        
        assert overview.running == 5
        assert overview.idle == 3
        assert overview.issue == 1
        assert overview.offline == 2

    def test_device_status_overview_validation(self):
        """Test DeviceStatusOverview validation."""
        # Non-negative values should work
        overview = DeviceStatusOverview(running=10, idle=5, issue=0, offline=1)
        assert overview.running == 10
        assert overview.idle == 5
        assert overview.issue == 0
        assert overview.offline == 1


@pytest.mark.schemas
class TestHealthHistoryEntry:
    """Test HealthHistoryEntry schema."""

    def test_health_history_entry_valid(self):
        """Test valid HealthHistoryEntry."""
        timestamp = datetime.utcnow()
        
        entry = HealthHistoryEntry(
            timestamp=timestamp,
            status="running",
            uptime_hours=24.5,
            error_count=0,
            performance_score=95.0,
            notes="Device running normally"
        )
        
        assert entry.timestamp == timestamp
        assert entry.status == "running"
        assert entry.uptime_hours == 24.5
        assert entry.error_count == 0
        assert entry.performance_score == 95.0
        assert entry.notes == "Device running normally"

    def test_health_history_entry_performance_score_validation(self):
        """Test HealthHistoryEntry performance score validation."""
        timestamp = datetime.utcnow()
        
        # Valid scores
        for score in [0.0, 50.0, 100.0]:
            entry = HealthHistoryEntry(
                timestamp=timestamp,
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=score
            )
            assert entry.performance_score == score
        
        # Invalid scores should raise validation error
        with pytest.raises(ValidationError):
            HealthHistoryEntry(
                timestamp=timestamp,
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=-1.0  # Below minimum
            )
        
        with pytest.raises(ValidationError):
            HealthHistoryEntry(
                timestamp=timestamp,
                status="running",
                uptime_hours=24.0,
                error_count=0,
                performance_score=101.0  # Above maximum
            )

    def test_health_history_entry_optional_notes(self):
        """Test HealthHistoryEntry with optional notes."""
        timestamp = datetime.utcnow()
        
        entry = HealthHistoryEntry(
            timestamp=timestamp,
            status="running",
            uptime_hours=24.0,
            error_count=0,
            performance_score=95.0
        )
        
        assert entry.notes is None


@pytest.mark.schemas
class TestHealthSummary:
    """Test HealthSummary schema."""

    def test_health_summary_valid(self):
        """Test valid HealthSummary."""
        summary = HealthSummary(
            average_uptime=85.5,
            total_downtime_hours=12.0,
            reliability_score=92.5,
            common_issues=["Network timeout", "Sensor calibration"]
        )
        
        assert summary.average_uptime == 85.5
        assert summary.total_downtime_hours == 12.0
        assert summary.reliability_score == 92.5
        assert summary.common_issues == ["Network timeout", "Sensor calibration"]

    def test_health_summary_validation(self):
        """Test HealthSummary validation."""
        # Valid values
        summary = HealthSummary(
            average_uptime=100.0,
            total_downtime_hours=0.0,
            reliability_score=100.0,
            common_issues=[]
        )
        
        assert summary.average_uptime == 100.0
        assert summary.total_downtime_hours == 0.0
        assert summary.reliability_score == 100.0
        assert summary.common_issues == []

    def test_health_summary_score_validation(self):
        """Test HealthSummary score validation."""
        # Invalid average_uptime
        with pytest.raises(ValidationError):
            HealthSummary(
                average_uptime=101.0,  # Above maximum
                total_downtime_hours=0.0,
                reliability_score=95.0
            )
        
        # Invalid reliability_score
        with pytest.raises(ValidationError):
            HealthSummary(
                average_uptime=95.0,
                total_downtime_hours=0.0,
                reliability_score=-1.0  # Below minimum
            )


@pytest.mark.schemas
class TestDeviceBase:
    """Test DeviceBase schema."""

    def test_device_base_optional_fields(self):
        """Test DeviceBase with optional fields."""
        device = DeviceBase()
        
        assert device.container_id is None
        assert device.name is None
        assert device.model is None
        assert device.serial_number is None
        assert device.firmware_version is None
        assert device.port is None
        assert device.status is None
        assert device.last_active_at is None

    def test_device_base_with_data(self):
        """Test DeviceBase with data."""
        timestamp = datetime.utcnow()
        
        device = DeviceBase(
            container_id=1,
            name="Test Device",
            model="TestModel",
            serial_number="TM001",
            firmware_version="1.0.0",
            port="USB-A",
            status="running",
            last_active_at=timestamp
        )
        
        assert device.container_id == 1
        assert device.name == "Test Device"
        assert device.model == "TestModel"
        assert device.serial_number == "TM001"
        assert device.firmware_version == "1.0.0"
        assert device.port == "USB-A"
        assert device.status == "running"
        assert device.last_active_at == timestamp


@pytest.mark.schemas
class TestDeviceCreate:
    """Test DeviceCreate schema."""

    def test_device_create_required_fields(self):
        """Test DeviceCreate with required fields."""
        device = DeviceCreate(
            container_id=1,
            name="New Device",
            model="NewModel",
            serial_number="NM001"
        )
        
        assert device.container_id == 1
        assert device.name == "New Device"
        assert device.model == "NewModel"
        assert device.serial_number == "NM001"

    def test_device_create_validation(self):
        """Test DeviceCreate validation."""
        # Missing required fields should raise validation error
        with pytest.raises(ValidationError):
            DeviceCreate(
                container_id=1,
                name="New Device"
                # Missing model and serial_number
            )
        
        with pytest.raises(ValidationError):
            DeviceCreate(
                name="New Device",
                model="NewModel",
                serial_number="NM001"
                # Missing container_id
            )

    def test_device_create_with_optional_fields(self):
        """Test DeviceCreate with optional fields."""
        device = DeviceCreate(
            container_id=1,
            name="New Device",
            model="NewModel",
            serial_number="NM001",
            firmware_version="1.0.0",
            port="USB-B",
            status="idle"
        )
        
        assert device.firmware_version == "1.0.0"
        assert device.port == "USB-B"
        assert device.status == "idle"


@pytest.mark.schemas
class TestDeviceUpdate:
    """Test DeviceUpdate schema."""

    def test_device_update_optional_fields(self):
        """Test DeviceUpdate with optional fields."""
        device = DeviceUpdate()
        
        assert device.name is None
        assert device.model is None
        assert device.firmware_version is None
        assert device.port is None
        assert device.status is None

    def test_device_update_partial(self):
        """Test DeviceUpdate with partial data."""
        device = DeviceUpdate(
            name="Updated Device",
            firmware_version="2.0.0"
        )
        
        assert device.name == "Updated Device"
        assert device.firmware_version == "2.0.0"
        assert device.model is None
        assert device.port is None
        assert device.status is None


@pytest.mark.schemas
class TestDeviceRegistration:
    """Test DeviceRegistration schema."""

    def test_device_registration_required_fields(self):
        """Test DeviceRegistration with required fields."""
        device = DeviceRegistration(
            container_id=1,
            name="Registration Device",
            model="RegModel",
            serial_number="REG001"
        )
        
        assert device.container_id == 1
        assert device.name == "Registration Device"
        assert device.model == "RegModel"
        assert device.serial_number == "REG001"
        assert device.firmware_version is None
        assert device.port is None

    def test_device_registration_with_optional_fields(self):
        """Test DeviceRegistration with optional fields."""
        device = DeviceRegistration(
            container_id=1,
            name="Registration Device",
            model="RegModel",
            serial_number="REG001",
            firmware_version="1.0.0",
            port="USB-C"
        )
        
        assert device.firmware_version == "1.0.0"
        assert device.port == "USB-C"


@pytest.mark.schemas
class TestDeviceStatusUpdate:
    """Test DeviceStatusUpdate schema."""

    def test_device_status_update_valid_statuses(self):
        """Test DeviceStatusUpdate with valid statuses."""
        valid_statuses = ["running", "idle", "issue", "offline"]
        
        for status in valid_statuses:
            update = DeviceStatusUpdate(status=status)
            assert update.status == status
            assert update.reason is None

    def test_device_status_update_invalid_status(self):
        """Test DeviceStatusUpdate with invalid status."""
        with pytest.raises(ValidationError):
            DeviceStatusUpdate(status="invalid_status")

    def test_device_status_update_with_reason(self):
        """Test DeviceStatusUpdate with reason."""
        update = DeviceStatusUpdate(
            status="offline",
            reason="Maintenance required"
        )
        
        assert update.status == "offline"
        assert update.reason == "Maintenance required"


@pytest.mark.schemas
class TestDeviceStatusUpdateResponse:
    """Test DeviceStatusUpdateResponse schema."""

    def test_device_status_update_response(self):
        """Test DeviceStatusUpdateResponse."""
        timestamp = datetime.utcnow()
        
        response = DeviceStatusUpdateResponse(
            success=True,
            message="Status updated successfully",
            updated_status="running",
            updated_at=timestamp
        )
        
        assert response.success is True
        assert response.message == "Status updated successfully"
        assert response.updated_status == "running"
        assert response.updated_at == timestamp


@pytest.mark.schemas
class TestDeviceRestartRequest:
    """Test DeviceRestartRequest schema."""

    def test_device_restart_request_optional_fields(self):
        """Test DeviceRestartRequest with optional fields."""
        request = DeviceRestartRequest()
        
        assert request.reason is None
        assert request.scheduled_time is None

    def test_device_restart_request_with_data(self):
        """Test DeviceRestartRequest with data."""
        timestamp = datetime.utcnow()
        
        request = DeviceRestartRequest(
            reason="Firmware update",
            scheduled_time=timestamp
        )
        
        assert request.reason == "Firmware update"
        assert request.scheduled_time == timestamp


@pytest.mark.schemas
class TestDeviceRestartResponse:
    """Test DeviceRestartResponse schema."""

    def test_device_restart_response(self):
        """Test DeviceRestartResponse."""
        response = DeviceRestartResponse(
            success=True,
            message="Restart initiated",
            restart_initiated=True,
            estimated_downtime_minutes=5
        )
        
        assert response.success is True
        assert response.message == "Restart initiated"
        assert response.restart_initiated is True
        assert response.estimated_downtime_minutes == 5


@pytest.mark.schemas
class TestDeviceManagementSummary:
    """Test DeviceManagementSummary schema."""

    def test_device_management_summary(self):
        """Test DeviceManagementSummary."""
        timestamp = datetime.utcnow()
        
        summary = DeviceManagementSummary(
            device_count=10,
            online_devices=8,
            offline_devices=2,
            devices_with_issues=1,
            last_sync=timestamp,
            management_status="healthy",
            firmware_updates_available=3,
            average_uptime=95.5
        )
        
        assert summary.device_count == 10
        assert summary.online_devices == 8
        assert summary.offline_devices == 2
        assert summary.devices_with_issues == 1
        assert summary.last_sync == timestamp
        assert summary.management_status == "healthy"
        assert summary.firmware_updates_available == 3
        assert summary.average_uptime == 95.5

    def test_device_management_summary_status_validation(self):
        """Test DeviceManagementSummary status validation."""
        timestamp = datetime.utcnow()
        
        valid_statuses = ["healthy", "degraded", "critical"]
        
        for status in valid_statuses:
            summary = DeviceManagementSummary(
                device_count=10,
                online_devices=8,
                offline_devices=2,
                devices_with_issues=1,
                last_sync=timestamp,
                management_status=status,
                firmware_updates_available=3,
                average_uptime=95.5
            )
            assert summary.management_status == status
        
        # Invalid status should raise validation error
        with pytest.raises(ValidationError):
            DeviceManagementSummary(
                device_count=10,
                online_devices=8,
                offline_devices=2,
                devices_with_issues=1,
                last_sync=timestamp,
                management_status="invalid_status",
                firmware_updates_available=3,
                average_uptime=95.5
            )


@pytest.mark.schemas
class TestBulkStatusUpdate:
    """Test BulkStatusUpdate schema."""

    def test_bulk_status_update(self):
        """Test BulkStatusUpdate."""
        update = BulkStatusUpdate(
            device_ids=[1, 2, 3],
            status="running",
            reason="Maintenance complete"
        )
        
        assert update.device_ids == [1, 2, 3]
        assert update.status == "running"
        assert update.reason == "Maintenance complete"

    def test_bulk_status_update_validation(self):
        """Test BulkStatusUpdate validation."""
        # Valid status
        update = BulkStatusUpdate(
            device_ids=[1, 2, 3],
            status="idle"
        )
        assert update.status == "idle"
        
        # Invalid status
        with pytest.raises(ValidationError):
            BulkStatusUpdate(
                device_ids=[1, 2, 3],
                status="invalid_status"
            )

    def test_bulk_status_update_empty_devices(self):
        """Test BulkStatusUpdate with empty device list."""
        update = BulkStatusUpdate(
            device_ids=[],
            status="running"
        )
        
        assert update.device_ids == []


@pytest.mark.schemas
class TestBulkStatusUpdateResponse:
    """Test BulkStatusUpdateResponse schema."""

    def test_bulk_status_update_response(self):
        """Test BulkStatusUpdateResponse."""
        response = BulkStatusUpdateResponse(
            success=True,
            message="Bulk update completed",
            updated_devices=[1, 2, 3],
            failed_updates=[
                {"device_id": 4, "error": "Device not found"}
            ]
        )
        
        assert response.success is True
        assert response.message == "Bulk update completed"
        assert response.updated_devices == [1, 2, 3]
        assert response.failed_updates == [{"device_id": 4, "error": "Device not found"}]

    def test_bulk_status_update_response_no_failures(self):
        """Test BulkStatusUpdateResponse with no failures."""
        response = BulkStatusUpdateResponse(
            success=True,
            message="All devices updated",
            updated_devices=[1, 2, 3]
        )
        
        assert response.success is True
        assert response.failed_updates == []


@pytest.mark.schemas
class TestDeviceDetails:
    """Test DeviceDetails schema."""

    def test_device_details_complete(self):
        """Test DeviceDetails with complete data."""
        timestamp = datetime.utcnow()
        
        configuration = DeviceConfiguration(
            settings={"mode": "auto"},
            parameters={"threshold": 25.0}
        )
        
        diagnostics = DeviceDiagnostics(
            uptime=24.5,
            error_count=0,
            performance_metrics={"cpu": 85.0}
        )
        
        connectivity = DeviceConnectivity(
            connection_type="ethernet",
            signal_strength=98.5,
            last_heartbeat=timestamp
        )
        
        device = DeviceDetails(
            id=1,
            container_id=1,
            name="Test Device",
            model="TestModel",
            serial_number="TM001",
            firmware_version="1.0.0",
            port="USB-A",
            status="running",
            last_active_at=timestamp,
            created_at=timestamp,
            updated_at=timestamp,
            configuration=configuration,
            diagnostics=diagnostics,
            connectivity=connectivity
        )
        
        assert device.id == 1
        assert device.container_id == 1
        assert device.name == "Test Device"
        assert device.configuration == configuration
        assert device.diagnostics == diagnostics
        assert device.connectivity == connectivity


@pytest.mark.schemas
class TestContainerDevices:
    """Test ContainerDevices schema."""

    def test_container_devices(self):
        """Test ContainerDevices."""
        timestamp = datetime.utcnow()
        
        status_overview = DeviceStatusOverview(
            running=5,
            idle=3,
            issue=1,
            offline=2
        )
        
        devices = [
            Device(
                id=1,
                container_id=1,
                name="Device 1",
                model="Model1",
                serial_number="M1001",
                status="running",
                created_at=timestamp,
                updated_at=timestamp
            ),
            Device(
                id=2,
                container_id=1,
                name="Device 2",
                model="Model2",
                serial_number="M2001",
                status="idle",
                created_at=timestamp,
                updated_at=timestamp
            )
        ]
        
        container_devices = ContainerDevices(
            device_status_overview=status_overview,
            devices=devices
        )
        
        assert container_devices.device_status_overview == status_overview
        assert container_devices.devices == devices
        assert len(container_devices.devices) == 2