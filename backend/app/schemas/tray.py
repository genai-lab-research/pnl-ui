"""Tray schemas for API requests and responses."""

from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, validator


class TrayLocation(BaseModel):
    """Location specification for tray placement."""
    shelf: str = Field(..., description="Shelf identifier")
    slot_number: int = Field(..., ge=1, le=8, description="Slot number on shelf")

    @validator('shelf')
    def validate_shelf(cls, v):
        allowed_shelves = ["upper", "lower"]
        if v not in allowed_shelves:
            raise ValueError(f"Shelf must be one of {allowed_shelves}")
        return v


class TrayProvisionRequest(BaseModel):
    """Data structure for provisioning a new tray."""
    container_id: int = Field(..., description="Container identifier")
    location: TrayLocation = Field(..., description="Target location for tray")
    rfid_tag: str = Field(..., description="RFID tag identifier")
    capacity: Optional[int] = Field(None, description="Tray capacity")
    tray_type: Optional[str] = Field(None, description="Tray type")


class ProvisionedTray(BaseModel):
    """Successfully provisioned tray with all details."""
    id: int
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    utilization_pct: Optional[float] = None
    provisioned_at: Optional[datetime] = None
    status: Optional[str] = None
    capacity: Optional[int] = None
    tray_type: Optional[str] = None
    print_label_url: str = Field(..., description="URL for printing label")

    class Config:
        from_attributes = True


class TrayProvisionResponse(BaseModel):
    """Response structure for successful tray provisioning."""
    success: bool = Field(..., description="Provisioning success status")
    message: str = Field(..., description="Success or error message")
    tray: ProvisionedTray = Field(..., description="Provisioned tray details")


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


class TrayProvisionItem(BaseModel):
    """Individual tray item for bulk provisioning."""
    location: TrayLocation = Field(..., description="Target location")
    rfid_tag: str = Field(..., description="RFID tag identifier")
    capacity: Optional[int] = Field(None, description="Tray capacity")
    tray_type: Optional[str] = Field(None, description="Tray type")


class BulkTrayProvisionRequest(BaseModel):
    """Request for bulk tray provisioning."""
    container_id: int = Field(..., description="Container identifier")
    trays: List[TrayProvisionItem] = Field(..., description="List of trays to provision")


class BulkTrayProvisionResponse(BaseModel):
    """Response for bulk tray provisioning."""
    success: bool = Field(..., description="Overall operation success")
    message: str = Field(..., description="Success or error message")
    provisioned_trays: List[ProvisionedTray] = Field(..., description="Successfully provisioned trays")
    failed_provisions: List["ProvisionFailure"] = Field(..., description="Failed provisions")


class ProvisionFailure(BaseModel):
    """Failed provision details."""
    rfid_tag: str = Field(..., description="RFID tag that failed")
    error: str = Field(..., description="Error message")


class TrayResponse(BaseModel):
    """Schema for tray API responses."""
    id: int
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    utilization_pct: Optional[float] = None
    provisioned_at: Optional[datetime] = None
    status: Optional[str] = None
    capacity: Optional[int] = None
    tray_type: Optional[str] = None

    class Config:
        from_attributes = True