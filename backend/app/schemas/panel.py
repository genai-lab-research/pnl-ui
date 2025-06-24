from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .crop import CropResponse


class PanelLocationBase(BaseModel):
    wall: str = Field(..., description="Wall identifier")
    slot_number: int = Field(..., ge=0, description="Slot number on the wall")


class PanelLocationResponse(PanelLocationBase):
    pass


class PanelBase(BaseModel):
    rfid_tag: str = Field(..., description="RFID tag assigned to the panel")
    utilization_percentage: int = Field(..., ge=0, le=100, description="Utilization percentage")
    crop_count: int = Field(..., ge=0, description="Number of crops in the panel")
    is_empty: bool = Field(..., description="Whether the panel is empty")
    provisioned_at: datetime = Field(..., description="Provisioning timestamp")


class PanelResponse(PanelBase):
    id: str = Field(..., description="Unique identifier for the panel")
    location: Optional[PanelLocationResponse] = Field(None, description="Location of the panel")
    crops: List[CropResponse] = Field(default=[], description="List of crops in the panel")

    class Config:
        from_attributes = True


class CultivationAreaResponse(BaseModel):
    utilization_percentage: int = Field(..., ge=0, le=100, description="Total utilization percentage")
    wall_1: List[PanelResponse] = Field(default=[], description="Panels on wall 1")
    wall_2: List[PanelResponse] = Field(default=[], description="Panels on wall 2")
    wall_3: List[PanelResponse] = Field(default=[], description="Panels on wall 3")
    wall_4: List[PanelResponse] = Field(default=[], description="Panels on wall 4")
    off_wall_panels: List[PanelResponse] = Field(default=[], description="Panels off walls")

    class Config:
        from_attributes = True