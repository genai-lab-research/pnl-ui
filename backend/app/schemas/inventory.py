from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.enums import ShelfPosition, WallPosition, InventoryStatus


class TrayBase(BaseModel):
    rfid_tag: str = Field(..., description="RFID tag ID")
    shelf: Optional[ShelfPosition] = None
    slot_number: Optional[int] = None
    capacity: Optional[int] = None
    tray_type: Optional[str] = None
    status: InventoryStatus = InventoryStatus.AVAILABLE


class TrayCreate(TrayBase):
    container_id: str = Field(..., description="Container ID")


class TrayUpdate(BaseModel):
    rfid_tag: Optional[str] = None
    shelf: Optional[ShelfPosition] = None
    slot_number: Optional[int] = None
    capacity: Optional[int] = None
    tray_type: Optional[str] = None
    status: Optional[InventoryStatus] = None


class TrayInDBBase(TrayBase):
    id: str
    container_id: str
    utilization_percentage: float
    provisioned_at: datetime

    class Config:
        from_attributes = True


class Tray(TrayInDBBase):
    pass


class PanelBase(BaseModel):
    rfid_tag: str = Field(..., description="RFID tag ID")
    wall: Optional[WallPosition] = None
    slot_number: Optional[int] = None
    capacity: Optional[int] = None
    panel_type: Optional[str] = None
    status: InventoryStatus = InventoryStatus.AVAILABLE


class PanelCreate(PanelBase):
    container_id: str = Field(..., description="Container ID")


class PanelUpdate(BaseModel):
    rfid_tag: Optional[str] = None
    wall: Optional[WallPosition] = None
    slot_number: Optional[int] = None
    capacity: Optional[int] = None
    panel_type: Optional[str] = None
    status: Optional[InventoryStatus] = None


class PanelInDBBase(PanelBase):
    id: str
    container_id: str
    utilization_percentage: float
    provisioned_at: datetime

    class Config:
        from_attributes = True


class Panel(PanelInDBBase):
    pass


class TrayList(BaseModel):
    total: int
    results: List[Tray]


class PanelList(BaseModel):
    total: int
    results: List[Panel]