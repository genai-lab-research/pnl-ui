from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.enums import CropLifecycleStatus, CropHealthCheck, CropLocationType
from app.schemas.seed_type import SeedType, SeedTypeCreate, SeedTypeUpdate


class CropHistoryEntryBase(BaseModel):
    event: str = Field(..., description="Event description")
    performed_by: str = Field(..., description="User ID or system identifier")
    notes: Optional[str] = None


class CropHistoryEntryCreate(CropHistoryEntryBase):
    crop_id: str = Field(..., description="Crop ID")
    timestamp: Optional[datetime] = None


class CropHistoryCreate(CropHistoryEntryBase):
    crop_id: str = Field(..., description="Crop ID")
    timestamp: Optional[datetime] = None


class CropHistoryEntry(CropHistoryEntryBase):
    id: str
    timestamp: datetime
    crop_id: str

    class Config:
        from_attributes = True


class CropBase(BaseModel):
    seed_type_id: str = Field(..., description="Seed type ID")
    seed_date: datetime = Field(..., description="Date when the crop was seeded")
    transplanting_date_planned: Optional[datetime] = None
    harvesting_date_planned: Optional[datetime] = None
    transplanted_date: Optional[datetime] = None
    harvesting_date: Optional[datetime] = None
    lifecycle_status: CropLifecycleStatus
    health_check: CropHealthCheck = CropHealthCheck.HEALTHY


class CropCreate(CropBase):
    current_location_type: CropLocationType
    tray_id: Optional[str] = None
    panel_id: Optional[str] = None
    tray_row: Optional[int] = None
    tray_column: Optional[int] = None
    panel_channel: Optional[int] = None
    panel_position: Optional[float] = None
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    weight: Optional[float] = None


class CropUpdate(BaseModel):
    current_location_type: Optional[CropLocationType] = None
    tray_id: Optional[str] = None
    panel_id: Optional[str] = None
    tray_row: Optional[int] = None
    tray_column: Optional[int] = None
    panel_channel: Optional[int] = None
    panel_position: Optional[float] = None
    transplanting_date_planned: Optional[datetime] = None
    harvesting_date_planned: Optional[datetime] = None
    transplanted_date: Optional[datetime] = None
    harvesting_date: Optional[datetime] = None
    lifecycle_status: Optional[CropLifecycleStatus] = None
    health_check: Optional[CropHealthCheck] = None
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    weight: Optional[float] = None


class CropInDBBase(CropBase):
    id: str
    current_location_type: Optional[CropLocationType] = None
    tray_id: Optional[str] = None
    panel_id: Optional[str] = None
    tray_row: Optional[int] = None
    tray_column: Optional[int] = None
    panel_channel: Optional[int] = None
    panel_position: Optional[float] = None
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    weight: Optional[float] = None

    class Config:
        from_attributes = True


class Crop(CropInDBBase):
    history: List[CropHistoryEntry] = []


class CropSummary(BaseModel):
    id: str
    seed_type_name: str
    age_days: int
    lifecycle_status: CropLifecycleStatus
    health_check: CropHealthCheck
    is_overdue: bool
    
    class Config:
        from_attributes = True


class ContainerCrop(BaseModel):
    id: str
    seed_type: str
    cultivation_area: Optional[float] = None
    nursery_table: Optional[int] = None
    last_sd: Optional[str] = None  # Last seed date
    last_td: Optional[str] = None  # Last transplanting date
    last_hd: Optional[str] = None  # Last harvesting date
    avg_age: Optional[int] = None  # Average age in days
    overdue: Optional[int] = None  # Number of overdue days
    
    class Config:
        from_attributes = True


class ContainerCropsList(BaseModel):
    total: int
    results: List[ContainerCrop]


class CropList(BaseModel):
    total: int
    results: List[Crop]


class SeedTypeList(BaseModel):
    total: int
    results: List[SeedType]