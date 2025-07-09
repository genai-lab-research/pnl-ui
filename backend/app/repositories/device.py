"""Device repository for database operations."""

from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.device import Device, DeviceHealthHistory
from app.models.alert import Alert
from app.repositories.base import BaseRepository
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceRegistration


class DeviceRepository(BaseRepository[Device, DeviceCreate, DeviceUpdate]):
    """Repository for device operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Device, db)
    
    async def get_by_container_id(self, container_id: int) -> List[Device]:
        """Get all devices for a specific container."""
        query = select(Device).where(Device.container_id == container_id)
        query = query.options(selectinload(Device.alerts))
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_device_status_counts(self, container_id: int) -> Dict[str, int]:
        """Get device status counts for a container."""
        query = select(
            Device.status,
            func.count(Device.id).label("count")
        ).where(Device.container_id == container_id).group_by(Device.status)
        
        result = await self.db.execute(query)
        status_counts = {row.status: row.count for row in result.fetchall()}
        
        # Ensure all status types are present
        return {
            "running": status_counts.get("running", 0),
            "idle": status_counts.get("idle", 0),
            "issue": status_counts.get("issue", 0),
            "offline": status_counts.get("offline", 0)
        }
    
    async def get_device_with_details(self, device_id: int) -> Optional[Device]:
        """Get device with all details including relationships."""
        query = select(Device).where(Device.id == device_id)
        query = query.options(
            selectinload(Device.container),
            selectinload(Device.alerts),
            selectinload(Device.health_history)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def register_device(self, device_data: DeviceRegistration) -> Device:
        """Register a new device."""
        device = Device(
            container_id=device_data.container_id,
            name=device_data.name,
            model=device_data.model,
            serial_number=device_data.serial_number,
            firmware_version=device_data.firmware_version,
            port=device_data.port,
            status="offline",  # Default status for new devices
            last_active_at=datetime.utcnow()
        )
        
        self.db.add(device)
        await self.db.commit()
        await self.db.refresh(device)
        return device
    
    async def update_device_status(self, device_id: int, status: str, reason: Optional[str] = None) -> Optional[Device]:
        """Update device status."""
        device = await self.get(device_id)
        if not device:
            return None
        
        device.status = status
        device.last_active_at = datetime.utcnow()
        
        # Record health history entry
        health_entry = DeviceHealthHistory(
            device_id=device_id,
            timestamp=datetime.utcnow(),
            status=status,
            uptime_hours=device.diagnostics_uptime or 0.0,
            error_count=device.diagnostics_error_count or 0,
            performance_score=85.0,  # Default score
            notes=reason
        )
        
        self.db.add(health_entry)
        await self.db.commit()
        await self.db.refresh(device)
        return device
    
    async def bulk_update_status(self, device_ids: List[int], status: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """Update status for multiple devices."""
        updated_devices = []
        failed_updates = []
        
        for device_id in device_ids:
            try:
                device = await self.update_device_status(device_id, status, reason)
                if device:
                    updated_devices.append(device_id)
                else:
                    failed_updates.append({
                        "device_id": device_id,
                        "error": "Device not found"
                    })
            except Exception as e:
                failed_updates.append({
                    "device_id": device_id,
                    "error": str(e)
                })
        
        return {
            "updated_devices": updated_devices,
            "failed_updates": failed_updates
        }
    
    async def get_device_management_summary(self, container_id: int) -> Dict[str, Any]:
        """Get device management summary for a container."""
        # Get device counts
        total_devices_query = select(func.count(Device.id)).where(Device.container_id == container_id)
        total_devices = await self.db.execute(total_devices_query)
        device_count = total_devices.scalar()
        
        # Get status counts
        status_counts = await self.get_device_status_counts(container_id)
        
        # Calculate average uptime
        uptime_query = select(func.avg(Device.diagnostics_uptime)).where(
            and_(Device.container_id == container_id, Device.diagnostics_uptime.is_not(None))
        )
        uptime_result = await self.db.execute(uptime_query)
        average_uptime = uptime_result.scalar() or 0.0
        
        # Determine management status
        if status_counts["offline"] > device_count * 0.3:
            management_status = "critical"
        elif status_counts["issue"] > device_count * 0.2:
            management_status = "degraded"
        else:
            management_status = "healthy"
        
        return {
            "device_count": device_count,
            "online_devices": status_counts["running"] + status_counts["idle"],
            "offline_devices": status_counts["offline"],
            "devices_with_issues": status_counts["issue"],
            "last_sync": datetime.utcnow(),
            "management_status": management_status,
            "firmware_updates_available": 0,  # Placeholder
            "average_uptime": average_uptime
        }
    
    async def get_by_serial_number(self, serial_number: str) -> Optional[Device]:
        """Get device by serial number."""
        query = select(Device).where(Device.serial_number == serial_number)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()


class DeviceHealthHistoryRepository(BaseRepository[DeviceHealthHistory, dict, dict]):
    """Repository for device health history operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(DeviceHealthHistory, db)
    
    async def get_device_health_history(
        self, 
        device_id: int, 
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[DeviceHealthHistory]:
        """Get health history for a device."""
        query = select(DeviceHealthHistory).where(DeviceHealthHistory.device_id == device_id)
        
        if start_date:
            query = query.where(DeviceHealthHistory.timestamp >= start_date)
        if end_date:
            query = query.where(DeviceHealthHistory.timestamp <= end_date)
        
        query = query.order_by(DeviceHealthHistory.timestamp.desc()).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_health_summary(self, device_id: int) -> Dict[str, Any]:
        """Get health summary for a device."""
        # Get all health history entries
        query = select(DeviceHealthHistory).where(DeviceHealthHistory.device_id == device_id)
        result = await self.db.execute(query)
        entries = result.scalars().all()
        
        if not entries:
            return {
                "average_uptime": 0.0,
                "total_downtime_hours": 0.0,
                "reliability_score": 0.0,
                "common_issues": []
            }
        
        # Calculate metrics
        total_uptime = sum(entry.uptime_hours for entry in entries)
        average_uptime = total_uptime / len(entries) if entries else 0.0
        
        # Calculate downtime (simplified)
        total_downtime_hours = sum(
            24 - entry.uptime_hours for entry in entries 
            if entry.uptime_hours < 24
        )
        
        # Calculate reliability score
        reliability_score = (average_uptime / 24) * 100 if average_uptime > 0 else 0.0
        
        # Get common issues from notes
        common_issues = []
        issue_notes = [entry.notes for entry in entries if entry.notes and "issue" in entry.notes.lower()]
        if issue_notes:
            common_issues = list(set(issue_notes))[:5]  # Top 5 unique issues
        
        return {
            "average_uptime": min(average_uptime, 100.0),
            "total_downtime_hours": total_downtime_hours,
            "reliability_score": min(reliability_score, 100.0),
            "common_issues": common_issues
        }


class DeviceAlertRepository:
    """Repository for device-related alert operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_device_alerts(
        self, 
        container_id: int, 
        device_id: Optional[int] = None,
        severity: Optional[str] = None,
        active_only: bool = True
    ) -> List[Alert]:
        """Get alerts for devices in a container."""
        query = select(Alert).where(Alert.container_id == container_id)
        
        if device_id:
            query = query.where(Alert.device_id == device_id)
        else:
            query = query.where(Alert.device_id.is_not(None))
        
        if severity:
            query = query.where(Alert.severity == severity)
        
        if active_only:
            query = query.where(Alert.active.is_(True))
        
        query = query.options(selectinload(Alert.device))
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create_device_alert(
        self, 
        device_id: int, 
        container_id: int,
        alert_type: str,
        severity: str,
        description: str,
        related_object: Optional[Dict[str, Any]] = None
    ) -> Alert:
        """Create a new device alert."""
        alert = Alert(
            container_id=container_id,
            device_id=device_id,
            alert_type=alert_type,
            severity=severity,
            description=description,
            related_object=related_object or {},
            active=True,
            acknowledged=False,
            resolved=False
        )
        
        self.db.add(alert)
        await self.db.commit()
        await self.db.refresh(alert)
        return alert
    
    async def acknowledge_alert(self, alert_id: int, acknowledged_by: str, notes: Optional[str] = None) -> Optional[Alert]:
        """Acknowledge an alert."""
        query = select(Alert).where(Alert.id == alert_id)
        result = await self.db.execute(query)
        alert = result.scalar_one_or_none()
        
        if not alert:
            return None
        
        alert.acknowledged = True
        alert.acknowledged_by = acknowledged_by
        alert.acknowledged_at = datetime.utcnow()
        
        if notes:
            # Add notes to related_object or create new structure
            if not alert.related_object:
                alert.related_object = {}
            alert.related_object["acknowledgment_notes"] = notes
        
        await self.db.commit()
        await self.db.refresh(alert)
        return alert
    
    async def resolve_alert(self, alert_id: int, resolved_by: str, resolution_notes: Optional[str] = None) -> Optional[Alert]:
        """Resolve an alert."""
        query = select(Alert).where(Alert.id == alert_id)
        result = await self.db.execute(query)
        alert = result.scalar_one_or_none()
        
        if not alert:
            return None
        
        alert.resolved = True
        alert.resolved_by = resolved_by
        alert.resolved_at = datetime.utcnow()
        alert.resolution_notes = resolution_notes
        alert.active = False
        
        await self.db.commit()
        await self.db.refresh(alert)
        return alert
    
    async def get_alert_summary(self, container_id: int) -> Dict[str, int]:
        """Get alert summary by severity."""
        query = select(
            Alert.severity,
            func.count(Alert.id).label("count")
        ).where(
            and_(
                Alert.container_id == container_id,
                Alert.device_id.is_not(None),
                Alert.active.is_(True)
            )
        ).group_by(Alert.severity)
        
        result = await self.db.execute(query)
        severity_counts = {row.severity: row.count for row in result.fetchall()}
        
        total_alerts = sum(severity_counts.values())
        
        return {
            "total_alerts": total_alerts,
            "critical": severity_counts.get("critical", 0),
            "high": severity_counts.get("high", 0),
            "medium": severity_counts.get("medium", 0),
            "low": severity_counts.get("low", 0)
        }
