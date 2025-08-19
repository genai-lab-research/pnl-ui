"""Crop schemas for API requests and responses."""

from typing import Optional, Dict, Any, List
from datetime import date, datetime
from pydantic import BaseModel


class CropLocation(BaseModel):
    """Physical location of the crop within the container."""
    type: str  # "tray" or "panel"
    tray_id: Optional[int] = None
    panel_id: Optional[int] = None
    row: Optional[int] = None
    column: Optional[int] = None
    channel: Optional[int] = None
    position: Optional[int] = None


class CropMetadata(BaseModel):
    """Basic crop information and location."""
    id: int
    seed_type_id: Optional[int] = None
    seed_type: str
    variety: Optional[str] = None
    supplier: Optional[str] = None
    batch_id: Optional[str] = None
    location: CropLocation


class LifecycleMilestones(BaseModel):
    """Key dates in crop lifecycle."""
    seed_date: Optional[date] = None
    transplanting_date_planned: Optional[date] = None
    transplanting_date: Optional[date] = None
    harvesting_date_planned: Optional[date] = None
    harvesting_date: Optional[date] = None


class GrowthMetrics(BaseModel):
    """Daily growth measurements for the crop."""
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    area_estimated: Optional[float] = None
    weight: Optional[float] = None
    accumulated_light_hours: Optional[float] = None
    accumulated_water_hours: Optional[float] = None


class EnvironmentalMetrics(BaseModel):
    """Environmental conditions from recipe versions and container metrics."""
    air_temperature: Optional[float] = None
    humidity: Optional[float] = None
    co2: Optional[float] = None
    water_temperature: Optional[float] = None
    ph: Optional[float] = None
    ec: Optional[float] = None


class TimelapseFrame(BaseModel):
    """Individual daily frame in the crop timelapse."""
    timestamp: datetime
    crop_age_days: int
    image_url: Optional[str] = None
    lifecycle_status: Optional[str] = None
    health_status: Optional[str] = None
    growth_metrics: GrowthMetrics
    environmental_metrics: EnvironmentalMetrics


class CropHistoryEntry(BaseModel):
    """Individual entry in the crop's change log."""
    crop_id: int
    timestamp: datetime
    event: Optional[str] = None
    performed_by: Optional[str] = None
    notes: Optional[str] = None


class CropTimelapse(BaseModel):
    """Complete timelapse data for a specific crop."""
    crop_metadata: CropMetadata
    lifecycle_milestones: LifecycleMilestones
    timelapse_frames: List[TimelapseFrame]
    notes: Optional[str] = None
    history: List[CropHistoryEntry]


class CropSnapshot(BaseModel):
    """Daily snapshot of crop state."""
    id: int
    timestamp: Optional[datetime] = None
    crop_id: int
    lifecycle_status: Optional[str] = None
    health_status: Optional[str] = None
    recipe_version_id: Optional[int] = None
    location: Optional[Dict[str, Any]] = None
    measurements_id: Optional[int] = None
    accumulated_light_hours: Optional[float] = None
    accumulated_water_hours: Optional[float] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class CropSnapshotCreate(BaseModel):
    """Schema for creating crop snapshots."""
    lifecycle_status: Optional[str] = None
    health_status: Optional[str] = None
    recipe_version_id: Optional[int] = None
    location: Optional[Dict[str, Any]] = None
    measurements_id: Optional[int] = None
    accumulated_light_hours: Optional[float] = None
    accumulated_water_hours: Optional[float] = None
    image_url: Optional[str] = None


class MetricDefinition(BaseModel):
    """Definition for a specific metric."""
    unit: str
    description: str


class MetricDefinitions(BaseModel):
    """Definitions and units for growth metrics."""
    area: MetricDefinition
    area_estimated: MetricDefinition
    weight: MetricDefinition
    accumulated_light_hours: MetricDefinition
    accumulated_water_hours: MetricDefinition


class GrowthDataPoint(BaseModel):
    """Individual data point for growth chart visualization."""
    timestamp: datetime
    crop_age_days: int
    area: Optional[float] = None
    area_estimated: Optional[float] = None
    weight: Optional[float] = None
    accumulated_light_hours: Optional[float] = None
    accumulated_water_hours: Optional[float] = None
    air_temperature: Optional[float] = None
    humidity: Optional[float] = None
    co2: Optional[float] = None
    water_temperature: Optional[float] = None
    ph: Optional[float] = None
    ec: Optional[float] = None


class GrowthChartData(BaseModel):
    """Structured data for growth metrics visualization."""
    chart_data: List[GrowthDataPoint]
    metric_definitions: MetricDefinitions


class NotesUpdateRequest(BaseModel):
    """Request structure for updating crop notes."""
    notes: str


class NotesUpdateResponse(BaseModel):
    """Response for notes update operation."""
    success: bool
    message: str
    updated_at: datetime


class CropHistoryCreate(BaseModel):
    """Schema for creating crop history entries."""
    event: Optional[str] = None
    performed_by: Optional[str] = None
    notes: Optional[str] = None


class CropMeasurementUpdate(BaseModel):
    """Schema for updating crop measurements."""
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    area_estimated: Optional[float] = None
    weight: Optional[float] = None


class CropMeasurementResponse(BaseModel):
    """Schema for crop measurement responses."""
    id: int
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    area_estimated: Optional[float] = None
    weight: Optional[float] = None

    class Config:
        from_attributes = True


class CropResponse(BaseModel):
    """Schema for crop API responses."""
    id: int
    seed_type_id: Optional[int] = None
    seed_date: Optional[date] = None
    transplanting_date_planned: Optional[date] = None
    transplanting_date: Optional[date] = None
    harvesting_date_planned: Optional[date] = None
    harvesting_date: Optional[date] = None
    lifecycle_status: Optional[str] = None
    health_check: Optional[str] = None
    current_location: Optional[Dict[str, Any]] = None
    last_location: Optional[Dict[str, Any]] = None
    measurements_id: Optional[int] = None
    image_url: Optional[str] = None
    recipe_version_id: Optional[int] = None
    accumulated_light_hours: Optional[float] = None
    accumulated_water_hours: Optional[float] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True