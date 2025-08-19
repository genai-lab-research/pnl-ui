"""Panel schemas for API requests and responses."""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, validator


class PanelLocation(BaseModel):
    """Location specification for panel placement."""
    wall: str = Field(..., description="Wall identifier")
    slot_number: int = Field(..., ge=1, le=22, description="Slot number on wall")

    @validator('wall')
    def validate_wall(cls, v):
        allowed_walls = ["wall_1", "wall_2", "wall_3", "wall_4"]
        if v not in allowed_walls:
            raise ValueError(f"Wall must be one of {allowed_walls}")
        return v


class PanelProvisionRequest(BaseModel):
    """Data structure for provisioning a new panel."""
    container_id: int = Field(..., description="Container identifier")
    location: PanelLocation = Field(..., description="Target location for panel")
    rfid_tag: str = Field(..., description="RFID tag identifier")
    capacity: Optional[int] = Field(None, description="Panel capacity")
    panel_type: Optional[str] = Field(None, description="Panel type")


class ProvisionedPanel(BaseModel):
    """Successfully provisioned panel with all details."""
    id: int
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    utilization_pct: Optional[float] = None
    provisioned_at: Optional[datetime] = None
    status: Optional[str] = None
    capacity: Optional[int] = None
    panel_type: Optional[str] = None
    print_label_url: str = Field(..., description="URL for printing label")

    class Config:
        from_attributes = True


class PanelProvisionResponse(BaseModel):
    """Response structure for successful panel provisioning."""
    success: bool = Field(..., description="Provisioning success status")
    message: str = Field(..., description="Success or error message")
    panel: ProvisionedPanel = Field(..., description="Provisioned panel details")


class PrintLabelResponse(BaseModel):
    """Response for label printing request."""
    label_url: str = Field(..., description="URL to printable label")
    print_format: str = Field(..., description="Label format specification")
    expires_at: datetime = Field(..., description="URL expiration timestamp")

    @validator('print_format')
    def validate_print_format(cls, v):
        allowed_formats = ["PDF", "PNG"]
        if v not in allowed_formats:
            raise ValueError(f"Print format must be one of {allowed_formats}")
        return v


class PanelProvisionItem(BaseModel):
    """Individual panel item for bulk provisioning."""
    location: PanelLocation = Field(..., description="Target location")
    rfid_tag: str = Field(..., description="RFID tag identifier")
    capacity: Optional[int] = Field(None, description="Panel capacity")
    panel_type: Optional[str] = Field(None, description="Panel type")


class BulkPanelProvisionRequest(BaseModel):
    """Request for bulk panel provisioning."""
    container_id: int = Field(..., description="Container identifier")
    panels: List[PanelProvisionItem] = Field(..., description="List of panels to provision")


class BulkPanelProvisionResponse(BaseModel):
    """Response for bulk panel provisioning."""
    success: bool = Field(..., description="Overall operation success")
    message: str = Field(..., description="Success or error message")
    provisioned_panels: List[ProvisionedPanel] = Field(..., description="Successfully provisioned panels")
    failed_provisions: List["ProvisionFailure"] = Field(..., description="Failed provisions")


class ProvisionFailure(BaseModel):
    """Failed provision details."""
    rfid_tag: str = Field(..., description="RFID tag that failed")
    error: str = Field(..., description="Error message")


class PanelResponse(BaseModel):
    """Schema for panel API responses."""
    id: int
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    utilization_pct: Optional[float] = None
    provisioned_at: Optional[datetime] = None
    status: Optional[str] = None
    capacity: Optional[int] = None
    panel_type: Optional[str] = None

    class Config:
        from_attributes = True