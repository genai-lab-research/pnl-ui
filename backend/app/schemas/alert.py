from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.enums import AlertSeverity, AlertRelatedObjectType


class AlertBase(BaseModel):
    description: str = Field(..., description="Alert description")
    severity: AlertSeverity = Field(..., description="Alert severity level")
    active: bool = True
    related_object_type: Optional[AlertRelatedObjectType] = None
    related_object_id: Optional[str] = None


class AlertCreate(AlertBase):
    container_id: str = Field(..., description="Container ID")


class AlertUpdate(BaseModel):
    description: Optional[str] = None
    severity: Optional[AlertSeverity] = None
    active: Optional[bool] = None
    related_object_type: Optional[AlertRelatedObjectType] = None
    related_object_id: Optional[str] = None


class AlertInDBBase(AlertBase):
    id: str
    container_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Alert(AlertInDBBase):
    pass


class AlertSummary(BaseModel):
    id: str
    description: str
    severity: AlertSeverity
    active: bool

    class Config:
        from_attributes = True


class AlertList(BaseModel):
    total: int
    results: List[Alert]