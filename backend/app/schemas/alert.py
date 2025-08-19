from typing import Optional, Any, Dict, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.base import BaseSchema, BaseCreateSchema, BaseUpdateSchema


class AlertBase(BaseModel):
    """Base Alert schema - matches Azure DB schema"""
    container_id: int
    description: str = Field(..., min_length=1, max_length=500)
    severity: str = Field(..., pattern="^(low|medium|high|critical)$")
    active: bool = True
    related_object: Optional[Any] = None


class AlertCreate(BaseCreateSchema, AlertBase):
    """Schema for creating a new alert"""
    pass


class AlertUpdate(BaseUpdateSchema):
    """Schema for updating an alert"""
    container_id: Optional[int] = None
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    severity: Optional[str] = Field(None, pattern="^(low|medium|high|critical)$")
    active: Optional[bool] = None
    related_object: Optional[Any] = None


class DeviceAlertCreate(BaseModel):
    """Schema for creating device-specific alerts"""
    alert_type: str = Field(..., min_length=1, max_length=100)
    severity: str = Field(..., pattern="^(low|medium|high|critical)$")
    description: str = Field(..., min_length=1, max_length=500)
    related_object: Optional[Any] = None
    
    model_config = ConfigDict(from_attributes=True)


class AlertAcknowledge(BaseModel):
    """Schema for acknowledging an alert"""
    acknowledged_by: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = Field(None, max_length=1000)
    
    model_config = ConfigDict(from_attributes=True)


class AlertResolve(BaseModel):
    """Schema for resolving an alert"""
    resolved_by: str = Field(..., min_length=1, max_length=100)
    resolution_notes: Optional[str] = Field(None, max_length=1000)
    
    model_config = ConfigDict(from_attributes=True)


class AlertAcknowledgeResponse(BaseModel):
    """Response after acknowledging an alert"""
    success: bool
    message: str
    acknowledged_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class AlertResolveResponse(BaseModel):
    """Response after resolving an alert"""
    success: bool
    message: str
    resolved_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class AlertSummary(BaseModel):
    """Summary count of alerts by severity"""
    total_alerts: int
    critical: int
    high: int
    medium: int
    low: int
    
    model_config = ConfigDict(from_attributes=True)


class DeviceAlert(BaseSchema, AlertBase):
    """Device alert with additional device information"""
    device_name: Optional[str] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None


class DeviceAlerts(BaseModel):
    """Container for device alerts with summary"""
    alerts: List[DeviceAlert]
    alert_summary: AlertSummary
    
    model_config = ConfigDict(from_attributes=True)


class Alert(BaseSchema, AlertBase):
    """Full Alert schema with all fields - matches Azure DB schema"""
    pass


class AlertInDB(Alert):
    """Alert schema as stored in database"""
    pass


# Alias for API responses
AlertResponse = Alert