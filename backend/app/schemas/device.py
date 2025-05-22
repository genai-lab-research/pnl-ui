from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from app.models.enums import DeviceStatus


class DeviceBase(BaseModel):
    name: str = Field(..., description="Device name")
    model: str = Field(..., description="Device model")
    serial_number: str = Field(..., description="Device serial number")
    firmware_version: Optional[str] = None
    port: Optional[str] = None
    status: DeviceStatus


class DeviceCreate(DeviceBase):
    container_id: str = Field(..., description="Container ID")


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    firmware_version: Optional[str] = None
    port: Optional[str] = None
    status: Optional[DeviceStatus] = None


class DeviceInDBBase(DeviceBase):
    id: str
    container_id: str
    last_active_at: datetime

    class Config:
        from_attributes = True


class Device(DeviceInDBBase):
    pass


class DeviceStatusSummary(BaseModel):
    running: int
    idle: int
    issue: int
    offline: int


class DeviceList(BaseModel):
    total: int
    results: list[Device]


class DeviceStats(BaseModel):
    running_count: int
    idle_count: int
    issue_count: int
    offline_count: int