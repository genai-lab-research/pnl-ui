"""Nursery station schemas for API requests and responses."""

from typing import Optional, Dict, Any, List
from datetime import datetime, date
from pydantic import BaseModel, Field, validator


class NurseryCrop(BaseModel):
    """Individual crop in nursery station with position and growth data."""
    id: int
    seed_type_id: Optional[int] = None
    row: int = Field(..., ge=1, le=20, description="Grid row position")
    column: int = Field(..., ge=1, le=10, description="Grid column position")
    seed_type: str = Field(..., description="Seed type name")
    age_days: int = Field(..., description="Age in days since seeding")
    health_check: Optional[str] = None
    seed_date: Optional[date] = None
    transplanting_date_planned: Optional[date] = None
    overdue_days: Optional[int] = None
    current_location: Optional[Dict[str, Any]] = None
    lifecycle_status: Optional[str] = None

    class Config:
        from_attributes = True


class NurseryTray(BaseModel):
    """Tray with its crops and utilization data for nursery station."""
    id: int
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    utilization_pct: Optional[float] = None
    provisioned_at: Optional[datetime] = None
    status: Optional[str] = None
    capacity: Optional[int] = None
    tray_type: Optional[str] = None
    crops: List[NurseryCrop] = Field(default_factory=list, description="Crops in the tray")

    class Config:
        from_attributes = True


class TraySlot(BaseModel):
    """Individual slot that can contain a tray."""
    slot_number: int = Field(..., ge=1, le=8, description="Slot position number")
    tray: Optional[NurseryTray] = None

    class Config:
        from_attributes = True


class NurseryLayout(BaseModel):
    """Physical arrangement of shelves and slots in the nursery station."""
    upper_shelf: List[TraySlot] = Field(..., description="Upper shelf tray slots (8 slots)")
    lower_shelf: List[TraySlot] = Field(..., description="Lower shelf tray slots (8 slots)")

    class Config:
        from_attributes = True


class UtilizationSummary(BaseModel):
    """Overall utilization metrics for the nursery station."""
    total_utilization_percentage: float = Field(..., ge=0, le=100, description="Total nursery station utilization")

    class Config:
        from_attributes = True


class OffShelfTray(BaseModel):
    """Tray that is not currently placed in the nursery station."""
    id: int
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    utilization_pct: Optional[float] = None
    status: Optional[str] = None
    last_location: Optional[Dict[str, Any]] = None
    capacity: Optional[int] = None
    tray_type: Optional[str] = None

    class Config:
        from_attributes = True


class NurseryStationLayout(BaseModel):
    """Represents the current layout and utilization of the nursery station."""
    utilization_summary: UtilizationSummary
    layout: NurseryLayout
    off_shelf_trays: List[OffShelfTray] = Field(default_factory=list, description="Trays not currently placed")

    class Config:
        from_attributes = True


class TraySnapshot(BaseModel):
    """Daily snapshot of tray state."""
    id: int
    timestamp: Optional[datetime] = None
    container_id: Optional[int] = None
    rfid_tag: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    crop_count: Optional[int] = None
    utilization_percentage: Optional[float] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class TraySnapshotCreate(BaseModel):
    """Create a new tray snapshot."""
    rfid_tag: str = Field(..., description="RFID tag identifier")
    location: Dict[str, Any] = Field(..., description="Location data")
    crop_count: int = Field(..., ge=0, description="Number of crops")
    utilization_percentage: float = Field(..., ge=0, le=100, description="Utilization percentage")
    status: str = Field(..., description="Tray status")

    class Config:
        from_attributes = True


class AvailableSlot(BaseModel):
    """Empty slot available for tray placement."""
    shelf: str = Field(..., description="Shelf identifier")
    slot_number: int = Field(..., ge=1, le=8, description="Available slot number")
    location_description: str = Field(..., description="Human-readable location")

    @validator('shelf')
    def validate_shelf(cls, v):
        allowed_shelves = ["upper", "lower"]
        if v not in allowed_shelves:
            raise ValueError(f"Shelf must be one of {allowed_shelves}")
        return v

    class Config:
        from_attributes = True


class AvailableSlotsResponse(BaseModel):
    """Response containing available slots for tray placement."""
    available_slots: List[AvailableSlot] = Field(default_factory=list, description="Available slots")

    class Config:
        from_attributes = True


class TrayLocationUpdate(BaseModel):
    """Data structure for updating tray location."""
    location: Dict[str, Any] = Field(..., description="New location data")
    moved_by: str = Field(..., description="User performing the move")

    class Config:
        from_attributes = True


class TrayLocationUpdateResponse(BaseModel):
    """Response for tray location update."""
    success: bool = Field(..., description="Update success status")
    message: str = Field(..., description="Success or error message")
    tray: NurseryTray = Field(..., description="Updated tray details")

    class Config:
        from_attributes = True


class TrayUpdate(BaseModel):
    """Data structure for updating tray information."""
    location: Optional[Dict[str, Any]] = None
    utilization_pct: Optional[float] = Field(None, ge=0, le=100)
    status: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=0)
    tray_type: Optional[str] = None

    class Config:
        from_attributes = True


class NurseryStationSummary(BaseModel):
    """Aggregated summary for nursery station dashboard."""
    total_slots: int = Field(..., ge=0, description="Total number of slots")
    occupied_slots: int = Field(..., ge=0, description="Number of occupied slots")
    utilization_percentage: float = Field(..., ge=0, le=100, description="Overall utilization percentage")
    total_trays: int = Field(..., ge=0, description="Total number of trays")
    off_shelf_trays: int = Field(..., ge=0, description="Number of off-shelf trays")
    total_crops: int = Field(..., ge=0, description="Total number of crops")
    overdue_crops: int = Field(..., ge=0, description="Number of overdue crops")
    last_updated: datetime = Field(..., description="Last update timestamp")

    class Config:
        from_attributes = True


class DateRange(BaseModel):
    """Date boundaries for timeline data."""
    start_date: datetime = Field(..., description="Timeline start date")
    end_date: datetime = Field(..., description="Timeline end date")
    current_date: datetime = Field(..., description="Current date marker")

    class Config:
        from_attributes = True


class TimelineEvent(BaseModel):
    """Event that occurred on a specific date."""
    type: str = Field(..., description="Event type")
    description: str = Field(..., description="Human-readable event description")
    tray_id: Optional[int] = None
    timestamp: datetime = Field(..., description="When event occurred")

    @validator('type')
    def validate_event_type(cls, v):
        allowed_types = ["tray_added", "tray_removed", "tray_moved", "crop_transplanted"]
        if v not in allowed_types:
            raise ValueError(f"Event type must be one of {allowed_types}")
        return v

    class Config:
        from_attributes = True


class TimelineData(BaseModel):
    """Historical and future states for time-lapse functionality."""
    timeline: List[TraySnapshot] = Field(default_factory=list, description="Daily snapshots")
    date_range: DateRange = Field(..., description="Timeline date boundaries")

    class Config:
        from_attributes = True


class TrayMovementRequest(BaseModel):
    """Data structure for moving trays between slots."""
    tray_id: int = Field(..., description="Tray to move")
    target_shelf: str = Field(..., description="Target shelf")
    target_slot: int = Field(..., ge=1, le=8, description="Target slot number")
    moved_by: str = Field(..., description="User performing move")

    @validator('target_shelf')
    def validate_target_shelf(cls, v):
        allowed_shelves = ["upper", "lower"]
        if v not in allowed_shelves:
            raise ValueError(f"Target shelf must be one of {allowed_shelves}")
        return v

    class Config:
        from_attributes = True