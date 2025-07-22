"""Device service layer for business logic."""

from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.device import Device, DeviceHealthHistory
from app.models.alert import Alert
from app.repositories.device import DeviceRepository, DeviceHealthHistoryRepository, DeviceAlertRepository
from app.schemas.device import (
    DeviceRegistration, DeviceStatusUpdate, DeviceUpdate, DeviceRestartRequest,
    DeviceConfiguration, DeviceDiagnostics, DeviceConnectivity, DeviceDetails,
    ContainerDevices, DeviceStatusOverview, DeviceHealthHistory as DeviceHealthHistorySchema,
    HealthHistoryEntry, HealthSummary, DeviceManagementSummary, BulkStatusUpdate,
    DeviceStatusUpdateResponse, DeviceRestartResponse, BulkStatusUpdateResponse
)
from app.schemas.alert import DeviceAlertCreate, DeviceAlerts, DeviceAlert, AlertSummary
from app.core.exceptions import DeviceNotFoundError, ContainerNotFoundError, AlertNotFoundError


class DeviceService:
    """Service for device operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.device_repository = DeviceRepository(db)
        self.health_repository = DeviceHealthHistoryRepository(db)
        self.alert_repository = DeviceAlertRepository(db)
    
    async def get_container_devices(self, container_id: int) -> ContainerDevices:
        """Get all devices for a container with status overview."""
        devices = await self.device_repository.get_by_container_id(container_id)
        status_counts = await self.device_repository.get_device_status_counts(container_id)
        
        return ContainerDevices(
            device_status_overview=DeviceStatusOverview(**status_counts),
            devices=devices
        )
    
    async def get_device_details(self, device_id: int) -> DeviceDetails:
        """Get detailed information about a specific device."""
        device = await self.device_repository.get_device_with_details(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        # Build configuration object
        configuration = DeviceConfiguration(
            settings=device.configuration_settings or {},
            parameters=device.configuration_parameters or {}
        )
        
        # Build diagnostics object
        diagnostics = DeviceDiagnostics(
            uptime=device.diagnostics_uptime,
            error_count=device.diagnostics_error_count or 0,
            last_error=device.diagnostics_last_error,
            performance_metrics=device.diagnostics_performance_metrics or {}
        )
        
        # Build connectivity object
        connectivity = DeviceConnectivity(
            connection_type=device.connectivity_connection_type,
            signal_strength=device.connectivity_signal_strength,
            last_heartbeat=device.connectivity_last_heartbeat
        )
        
        return DeviceDetails(
            id=device.id,
            container_id=device.container_id,
            name=device.name,
            model=device.model,
            serial_number=device.serial_number,
            firmware_version=device.firmware_version,
            port=device.port,
            status=device.status,
            last_active_at=device.last_active_at,
            created_at=device.created_at,
            updated_at=device.updated_at,
            configuration=configuration,
            diagnostics=diagnostics,
            connectivity=connectivity
        )
    
    async def register_device(self, device_data: DeviceRegistration) -> Device:
        """Register a new device."""
        # Check if device with same serial number already exists
        existing = await self.device_repository.get_by_serial_number(device_data.serial_number)
        if existing:
            raise ValueError(f"Device with serial number {device_data.serial_number} already exists")
        
        device = await self.device_repository.register_device(device_data)
        
        # Create initial health history entry
        health_entry = DeviceHealthHistory(
            device_id=device.id,
            timestamp=datetime.utcnow(),
            status="offline",
            uptime_hours=0.0,
            error_count=0,
            performance_score=100.0,
            notes="Device registered"
        )
        
        self.db.add(health_entry)
        await self.db.commit()
        
        return device
    
    async def update_device_status(self, device_id: int, status_update: DeviceStatusUpdate) -> DeviceStatusUpdateResponse:
        """Update device status."""
        device = await self.device_repository.update_device_status(
            device_id, status_update.status, status_update.reason
        )
        
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        return DeviceStatusUpdateResponse(
            success=True,
            message=f"Device status updated to {status_update.status}",
            updated_status=status_update.status,
            updated_at=device.updated_at
        )
    
    async def update_device_information(self, device_id: int, device_update: DeviceUpdate) -> Device:
        """Update device information."""
        device = await self.device_repository.update(device_id, device_update)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        return device
    
    async def get_device_health_history(
        self, 
        device_id: int, 
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> DeviceHealthHistorySchema:
        """Get device health history."""
        device = await self.device_repository.get(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        history_entries = await self.health_repository.get_device_health_history(
            device_id, start_date, end_date, limit
        )
        
        health_summary = await self.health_repository.get_health_summary(device_id)
        
        return DeviceHealthHistorySchema(
            health_history=[
                HealthHistoryEntry(
                    timestamp=entry.timestamp,
                    status=entry.status,
                    uptime_hours=entry.uptime_hours,
                    error_count=entry.error_count,
                    performance_score=entry.performance_score,
                    notes=entry.notes
                )
                for entry in history_entries
            ],
            summary=HealthSummary(**health_summary)
        )
    
    async def restart_device(self, device_id: int, restart_request: DeviceRestartRequest) -> DeviceRestartResponse:
        """Restart a device."""
        device = await self.device_repository.get(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        # Simulate restart process
        # In a real implementation, this would trigger actual device restart
        
        # Update device status to indicate restart
        await self.device_repository.update_device_status(
            device_id, "offline", f"Restart requested: {restart_request.reason or 'Manual restart'}"
        )
        
        # Create restart alert
        await self.alert_repository.create_device_alert(
            device_id=device_id,
            container_id=device.container_id,
            alert_type="restart",
            severity="medium",
            description=f"Device restart initiated: {restart_request.reason or 'Manual restart'}",
            related_object={
                "restart_time": datetime.utcnow().isoformat(),
                "scheduled_time": restart_request.scheduled_time.isoformat() if restart_request.scheduled_time else None
            }
        )
        
        return DeviceRestartResponse(
            success=True,
            message="Device restart initiated successfully",
            restart_initiated=True,
            estimated_downtime_minutes=5  # Estimated downtime
        )
    
    async def get_device_alerts(
        self, 
        container_id: int, 
        device_id: Optional[int] = None,
        severity: Optional[str] = None,
        active_only: bool = True
    ) -> DeviceAlerts:
        """Get device alerts for a container."""
        alerts = await self.alert_repository.get_device_alerts(
            container_id, device_id, severity, active_only
        )
        
        alert_summary = await self.alert_repository.get_alert_summary(container_id)
        
        device_alerts = [
            DeviceAlert(
                id=alert.id,
                container_id=alert.container_id,
                device_id=alert.device_id,
                device_name=alert.device.name if alert.device else "Unknown",
                alert_type=alert.alert_type,
                severity=alert.severity,
                description=alert.description,
                created_at=alert.created_at,
                active=alert.active,
                acknowledged=alert.acknowledged,
                resolved=alert.resolved,
                related_object=alert.related_object,
                acknowledged_by=alert.acknowledged_by,
                acknowledged_at=alert.acknowledged_at,
                resolved_by=alert.resolved_by,
                resolved_at=alert.resolved_at,
                resolution_notes=alert.resolution_notes
            )
            for alert in alerts
        ]
        
        return DeviceAlerts(
            alerts=device_alerts,
            alert_summary=AlertSummary(**alert_summary)
        )
    
    async def create_device_alert(self, device_id: int, alert_data: DeviceAlertCreate) -> Alert:
        """Create a new device alert."""
        device = await self.device_repository.get(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        alert = await self.alert_repository.create_device_alert(
            device_id=device_id,
            container_id=device.container_id,
            alert_type=alert_data.alert_type,
            severity=alert_data.severity,
            description=alert_data.description,
            related_object=alert_data.related_object
        )
        
        return alert
    
    async def acknowledge_alert(self, alert_id: int, acknowledged_by: str, notes: Optional[str] = None) -> Alert:
        """Acknowledge a device alert."""
        alert = await self.alert_repository.acknowledge_alert(alert_id, acknowledged_by, notes)
        if not alert:
            raise AlertNotFoundError(f"Alert with ID {alert_id} not found")
        
        return alert
    
    async def resolve_alert(self, alert_id: int, resolved_by: str, resolution_notes: Optional[str] = None) -> Alert:
        """Resolve a device alert."""
        alert = await self.alert_repository.resolve_alert(alert_id, resolved_by, resolution_notes)
        if not alert:
            raise AlertNotFoundError(f"Alert with ID {alert_id} not found")
        
        return alert
    
    async def delete_device(self, device_id: int) -> bool:
        """Delete a device."""
        device = await self.device_repository.get(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        # Check if device has active alerts
        active_alerts = await self.alert_repository.get_device_alerts(
            device.container_id, device_id, active_only=True
        )
        
        if active_alerts:
            raise ValueError("Cannot delete device with active alerts. Please resolve all alerts first.")
        
        success = await self.device_repository.delete(device_id)
        return success
    
    async def get_device_management_summary(self, container_id: int) -> DeviceManagementSummary:
        """Get device management summary for a container."""
        summary_data = await self.device_repository.get_device_management_summary(container_id)
        
        return DeviceManagementSummary(**summary_data)
    
    async def bulk_update_device_status(self, bulk_update: BulkStatusUpdate) -> BulkStatusUpdateResponse:
        """Update status for multiple devices."""
        result = await self.device_repository.bulk_update_status(
            bulk_update.device_ids, bulk_update.status, bulk_update.reason
        )
        
        success = len(result["failed_updates"]) == 0
        message = (
            f"Successfully updated {len(result['updated_devices'])} devices"
            if success
            else f"Updated {len(result['updated_devices'])} devices with {len(result['failed_updates'])} failures"
        )
        
        return BulkStatusUpdateResponse(
            success=success,
            message=message,
            updated_devices=result["updated_devices"],
            failed_updates=result["failed_updates"]
        )
    
    async def simulate_device_heartbeat(self, device_id: int) -> None:
        """Simulate device heartbeat update."""
        device = await self.device_repository.get(device_id)
        if not device:
            return
        
        # Update last heartbeat
        device.connectivity_last_heartbeat = datetime.utcnow()
        
        # Update diagnostics
        if device.diagnostics_uptime is not None:
            device.diagnostics_uptime += 0.1  # Increment uptime
        
        await self.db.commit()
    
    async def get_device_configuration(self, device_id: int) -> DeviceConfiguration:
        """Get device configuration."""
        device = await self.device_repository.get(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        return DeviceConfiguration(
            settings=device.configuration_settings or {},
            parameters=device.configuration_parameters or {}
        )
    
    async def update_device_configuration(
        self, 
        device_id: int, 
        configuration: DeviceConfiguration
    ) -> DeviceConfiguration:
        """Update device configuration."""
        device = await self.device_repository.get(device_id)
        if not device:
            raise DeviceNotFoundError(f"Device with ID {device_id} not found")
        
        device.configuration_settings = configuration.settings
        device.configuration_parameters = configuration.parameters
        
        await self.db.commit()
        
        return configuration
