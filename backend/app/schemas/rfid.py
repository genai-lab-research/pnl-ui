"""RFID validation and provisioning schemas."""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, validator


class RFIDValidationRequest(BaseModel):
    """Request structure for RFID tag validation."""
    rfid_tag: str = Field(..., description="RFID tag to validate")
    type: str = Field(..., description="Type of item being provisioned")

    @validator('type')
    def validate_type(cls, v):
        allowed_types = ["tray", "panel"]
        if v not in allowed_types:
            raise ValueError(f"Type must be one of {allowed_types}")
        return v


class RFIDValidationResponse(BaseModel):
    """Validation result for RFID tag input."""
    is_valid: bool = Field(..., description="Overall validation status")
    is_unique: bool = Field(..., description="Whether RFID tag is unique")
    format_valid: bool = Field(..., description="Whether format is correct")
    error_message: Optional[str] = Field(None, description="Validation error details")


class RFIDCurrentUsage(BaseModel):
    """Current usage information for an RFID tag."""
    type: str = Field(..., description="Type of current usage")
    id: int = Field(..., description="ID of the current item using this RFID")
    container_id: int = Field(..., description="Container ID where it's currently used")


class RFIDAvailabilityResponse(BaseModel):
    """Response for RFID availability check."""
    is_available: bool = Field(..., description="Whether RFID is available")
    current_usage: Optional[RFIDCurrentUsage] = Field(None, description="Current usage if unavailable")


class LocationOccupant(BaseModel):
    """Current occupant of a location."""
    id: int = Field(..., description="ID of the occupant")
    rfid_tag: str = Field(..., description="RFID tag of the occupant")
    type: str = Field(..., description="Type of occupant (tray/panel)")


class LocationSpecification(BaseModel):
    """Detailed location specification."""
    shelf: Optional[str] = Field(None, description="Shelf identifier for nursery stations")
    slot_number: int = Field(..., description="Slot number")
    wall: Optional[str] = Field(None, description="Wall identifier for cultivation areas")


class LocationDetails(BaseModel):
    """Information about a specific location for provisioning."""
    location_description: str = Field(..., description="Human-readable location")
    is_available: bool = Field(..., description="Whether location is available")
    current_occupant: Optional[LocationOccupant] = Field(None, description="Current tray/panel at location")
    location_details: LocationSpecification = Field(..., description="Detailed location data")


class TrayLocationSlot(BaseModel):
    """Available tray location slot."""
    shelf: str = Field(..., description="Shelf identifier")
    slot_number: int = Field(..., description="Slot number")


class PanelLocationSlot(BaseModel):
    """Available panel location slot."""
    wall: str = Field(..., description="Wall identifier")
    slot_number: int = Field(..., description="Slot number")


class ContainerLocationContext(BaseModel):
    """Container-specific location context for provisioning."""
    container_id: int = Field(..., description="Container identifier")
    nursery_available_slots: List[TrayLocationSlot] = Field(..., description="Available nursery slots")
    cultivation_available_slots: List[PanelLocationSlot] = Field(..., description="Available cultivation slots")
    total_trays: int = Field(..., description="Current tray count")
    total_panels: int = Field(..., description="Current panel count")
    max_tray_capacity: int = Field(..., description="Maximum tray capacity")
    max_panel_capacity: int = Field(..., description="Maximum panel capacity")


class RecentProvisionedTray(BaseModel):
    """Recently provisioned tray summary."""
    id: int = Field(..., description="Tray ID")
    rfid_tag: str = Field(..., description="RFID tag")
    provisioned_at: datetime = Field(..., description="Provisioning timestamp")
    location: Dict[str, Any] = Field(..., description="Location details")


class RecentProvisionedPanel(BaseModel):
    """Recently provisioned panel summary."""
    id: int = Field(..., description="Panel ID")
    rfid_tag: str = Field(..., description="RFID tag")
    provisioned_at: datetime = Field(..., description="Provisioning timestamp")
    location: Dict[str, Any] = Field(..., description="Location details")


class ProvisioningSummaryStats(BaseModel):
    """Provisioning summary statistics."""
    total_trays_provisioned: int = Field(..., description="Total trays provisioned in period")
    total_panels_provisioned: int = Field(..., description="Total panels provisioned in period")
    average_daily_provisioning: float = Field(..., description="Average daily provisioning rate")


class ProvisioningSummary(BaseModel):
    """Summary of recent provisioning activities."""
    recent_trays: List[RecentProvisionedTray] = Field(..., description="Recently provisioned trays")
    recent_panels: List[RecentProvisionedPanel] = Field(..., description="Recently provisioned panels")
    summary: ProvisioningSummaryStats = Field(..., description="Summary statistics")


class GeneratedIDResponse(BaseModel):
    """System-generated identifier for new tray or panel."""
    generated_id: int = Field(..., description="Unique system-generated ID")
    id_format: str = Field(..., description="ID format description")
    note: str = Field(..., description="Explanation about ID assignment")


class FormState(BaseModel):
    """Current state of the add tray/panel form."""
    type: str = Field(..., description="Form type")
    location_description: str = Field(..., description="Display location")
    generated_id: int = Field(..., description="System-generated ID")
    rfid_tag: Optional[str] = Field(None, description="User-entered RFID tag")
    is_valid_rfid: Optional[bool] = Field(None, description="RFID validation status")
    can_provision: bool = Field(..., description="Whether provisioning is allowed")

    @validator('type')
    def validate_form_type(cls, v):
        allowed_types = ["tray", "panel"]
        if v not in allowed_types:
            raise ValueError(f"Form type must be one of {allowed_types}")
        return v
