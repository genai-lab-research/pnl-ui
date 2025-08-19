"""Metrics schemas for API requests and responses."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class MetricSnapshotResponse(BaseModel):
    """Schema for metric snapshot API responses."""
    id: int
    container_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    air_temperature: Optional[float] = None
    humidity: Optional[float] = None
    co2: Optional[float] = None
    yield_kg: Optional[float] = None
    space_utilization_pct: Optional[float] = None

    class Config:
        from_attributes = True


class ActivityLogResponse(BaseModel):
    """Schema for activity log API responses."""
    id: int
    container_id: Optional[int] = None
    timestamp: Optional[datetime] = None
    action_type: Optional[str] = None
    actor_type: Optional[str] = None
    actor_id: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True