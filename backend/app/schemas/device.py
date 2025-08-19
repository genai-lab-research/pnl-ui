"""Device schemas for API requests and responses."""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.base import BaseSchema, BaseCreateSchema, BaseUpdateSchema


class DeviceConfiguration(BaseModel):
    """Device configuration settings and parameters."""
    settings: Dict[str, Any] = Field(default_factory=dict)
    parameters: Dict[str, Any] = Field(default_factory=dict)
    
    model_config = ConfigDict(from_attributes=True)


class DeviceDiagnostics(BaseModel):
    """Device health diagnostics."""
    uptime: Optional[float] = None
    error_count: int = 0
    last_error: Optional[str] = None
    performance_metrics: Dict[str, Any] = Field(default_factory=dict)
    
    model_config = ConfigDict(from_attributes=True)


class DeviceConnectivity(BaseModel):
    """Device connectivity information."""
    connection_type: Optional[str] = None
    signal_strength: Optional[float] = None
    last_heartbeat: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class DeviceStatusOverview(BaseModel):
    """Summary of device statuses."""
    running: int = 0
    idle: int = 0
    issue: int = 0
    offline: int = 0
    
    model_config = ConfigDict(from_attributes=True)


class HealthHistoryEntry(BaseModel):
    """Individual health record entry."""
    timestamp: datetime
    status: str
    uptime_hours: float
    error_count: int
    performance_score: float = Field(..., ge=0, le=100)
    notes: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class HealthSummary(BaseModel):
    """Aggregated health metrics over time."""
    average_uptime: float = Field(..., ge=0, le=100)
    total_downtime_hours: float
    reliability_score: float = Field(..., ge=0, le=100)
    common_issues: List[str] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)


class DeviceHealthHistory(BaseModel):
    """Device health history with summary."""
    health_history: List[HealthHistoryEntry]
    summary: HealthSummary
    
    model_config = ConfigDict(from_attributes=True)


class DeviceBase(BaseModel):
    """Base Device schema."""
    container_id: Optional[int] = None
    name: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    firmware_version: Optional[str] = None
    port: Optional[str] = None
    status: Optional[str] = None
    last_active_at: Optional[datetime] = None


class DeviceCreate(BaseCreateSchema, DeviceBase):
    """Schema for creating a new device."""
    container_id: int
    name: str
    model: str
    serial_number: str


class DeviceUpdate(BaseUpdateSchema):
    """Schema for updating device information."""
    name: Optional[str] = None
    model: Optional[str] = None
    firmware_version: Optional[str] = None
    port: Optional[str] = None
    status: Optional[str] = None


class DeviceRegistration(BaseModel):
    """Schema for device registration."""
    container_id: int
    name: str
    model: str
    serial_number: str
    firmware_version: Optional[str] = None
    port: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class DeviceStatusUpdate(BaseModel):
    """Schema for updating device status."""
    status: str = Field(..., pattern="^(running|idle|issue|offline)$")
    reason: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class DeviceStatusUpdateResponse(BaseModel):
    """Response after updating device status."""
    success: bool
    message: str
    updated_status: str
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class DeviceRestartRequest(BaseModel):
    """Request structure for restarting a device."""
    reason: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class DeviceRestartResponse(BaseModel):
    """Response after initiating device restart."""
    success: bool
    message: str
    restart_initiated: bool
    estimated_downtime_minutes: int
    
    model_config = ConfigDict(from_attributes=True)


class DeviceManagementSummary(BaseModel):
    """Overall device management status for a container."""
    device_count: int
    online_devices: int
    offline_devices: int
    devices_with_issues: int
    last_sync: datetime
    management_status: str = Field(..., pattern="^(healthy|degraded|critical)$")
    firmware_updates_available: int
    average_uptime: float
    
    model_config = ConfigDict(from_attributes=True)


class BulkStatusUpdate(BaseModel):
    """Schema for bulk device status updates."""
    device_ids: List[int]
    status: str = Field(..., pattern="^(running|idle|issue|offline)$")
    reason: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class BulkStatusUpdateResponse(BaseModel):
    """Response after bulk status update."""
    success: bool
    message: str
    updated_devices: List[int]
    failed_updates: List[Dict[str, Any]] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)


class Device(BaseSchema, DeviceBase):
    """Basic device schema for API responses."""


class DeviceDetails(BaseSchema, DeviceBase):
    """Comprehensive device information including configuration and diagnostics."""
    configuration: DeviceConfiguration
    diagnostics: DeviceDiagnostics
    connectivity: DeviceConnectivity


class ContainerDevices(BaseModel):
    """Complete device information for a container's IoT ecosystem."""
    device_status_overview: DeviceStatusOverview
    devices: List[Device]
    
    model_config = ConfigDict(from_attributes=True)


# Response aliases
DeviceResponse = Device
DeviceDetailResponse = DeviceDetails
