from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .crop import CropResponse


class TrayLocationBase(BaseModel):
    shelf: str = Field(..., description="Shelf identifier")
    slot_number: int = Field(..., ge=0, description="Slot number on the shelf")


class TrayLocationResponse(TrayLocationBase):
    pass


class TrayBase(BaseModel):
    rfid_tag: str = Field(..., description="RFID tag assigned to the tray")
    utilization_percentage: int = Field(..., ge=0, le=100, description="Utilization percentage")
    crop_count: int = Field(..., ge=0, description="Number of crops in the tray")
    is_empty: bool = Field(..., description="Whether the tray is empty")
    provisioned_at: datetime = Field(..., description="Provisioning timestamp")


class TrayCreate(BaseModel):
    rfid_tag: str = Field(..., min_length=1, description="RFID tag assigned to the tray")
    shelf: str = Field(..., description="Shelf identifier")
    slot_number: int = Field(..., ge=0, description="Slot number on the shelf")


class TrayResponse(TrayBase):
    id: str = Field(..., description="Unique identifier for the tray")
    location: Optional[TrayLocationResponse] = Field(None, description="Location of the tray")
    crops: List[CropResponse] = Field(default=[], description="List of crops in the tray")

    class Config:
        from_attributes = True



class NurseryStationResponse(BaseModel):
    utilization_percentage: int = Field(..., ge=0, le=100, description="Total utilization percentage")
    upper_shelf: List[TrayResponse] = Field(default=[], description="Trays on upper shelf")
    lower_shelf: List[TrayResponse] = Field(default=[], description="Trays on lower shelf")
    off_shelf_trays: List[TrayResponse] = Field(default=[], description="Trays off shelf")

    class Config:
        from_attributes = True