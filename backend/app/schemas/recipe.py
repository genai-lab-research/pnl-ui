from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field


class RecipeMasterBase(BaseModel):
    name: str = Field(..., description="Recipe name")
    crop_type: str = Field(..., description="Crop type for this recipe")
    notes: Optional[str] = Field(None, description="Additional notes")


class RecipeMasterCreate(RecipeMasterBase):
    pass


class RecipeMasterUpdate(RecipeMasterBase):
    pass


class RecipeVersionBase(BaseModel):
    version: str = Field(..., description="Version identifier")
    valid_from: datetime = Field(..., description="Version validity start")
    valid_to: Optional[datetime] = Field(None, description="Version validity end")
    tray_density: Optional[float] = Field(None, description="Tray density setting")
    air_temperature: Optional[float] = Field(None, description="Air temperature setting")
    humidity: Optional[float] = Field(None, description="Humidity setting")
    co2: Optional[float] = Field(None, description="CO2 level setting")
    water_temperature: Optional[float] = Field(None, description="Water temperature setting")
    ec: Optional[float] = Field(None, description="Electrical conductivity setting")
    ph: Optional[float] = Field(None, description="pH level setting")
    water_hours: Optional[float] = Field(None, description="Water hours setting")
    light_hours: Optional[float] = Field(None, description="Light hours setting")
    created_by: str = Field(..., description="Version creator")


class RecipeVersionCreate(RecipeVersionBase):
    pass


class RecipeVersionUpdate(RecipeVersionBase):
    pass


class RecipeVersionInDB(RecipeVersionBase):
    id: int
    recipe_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class RecipeMasterInDB(RecipeMasterBase):
    id: int
    recipe_versions: Optional[List[RecipeVersionInDB]] = Field(default_factory=list)
    
    class Config:
        from_attributes = True


class CropMeasurementBase(BaseModel):
    radius: Optional[float] = Field(None, description="Crop radius")
    width: Optional[float] = Field(None, description="Crop width")
    height: Optional[float] = Field(None, description="Crop height")
    area: Optional[float] = Field(None, description="Crop area")
    area_estimated: Optional[float] = Field(None, description="Estimated crop area")
    weight: Optional[float] = Field(None, description="Crop weight")


class CropMeasurementCreate(CropMeasurementBase):
    pass


class CropMeasurementUpdate(CropMeasurementBase):
    pass


class CropMeasurementInDB(CropMeasurementBase):
    id: int
    
    class Config:
        from_attributes = True


class CropBase(BaseModel):
    seed_type_id: Optional[int] = Field(None, description="Related seed type")
    seed_date: Optional[date] = Field(None, description="Seeding date")
    transplanting_date_planned: Optional[date] = Field(None, description="Planned transplanting date")
    transplanting_date: Optional[date] = Field(None, description="Actual transplanting date")
    harvesting_date_planned: Optional[date] = Field(None, description="Planned harvesting date")
    harvesting_date: Optional[date] = Field(None, description="Actual harvesting date")
    lifecycle_status: Optional[str] = Field(None, description="Current lifecycle stage")
    health_check: Optional[str] = Field(None, description="Health assessment")
    current_location: Optional[dict] = Field(None, description="Current location data")
    recipe_version_id: Optional[int] = Field(None, description="Applied recipe version")
    notes: Optional[str] = Field(None, description="Additional notes")


class CropCreate(CropBase):
    pass


class CropUpdate(CropBase):
    pass


class CropInDB(CropBase):
    id: int
    last_location: Optional[dict] = None
    measurements_id: Optional[int] = None
    image_url: Optional[str] = None
    accumulated_light_hours: Optional[float] = None
    accumulated_water_hours: Optional[float] = None
    
    class Config:
        from_attributes = True


class CropHistoryBase(BaseModel):
    event: Optional[str] = Field(None, description="Event description")
    performed_by: Optional[str] = Field(None, description="Person who performed action")
    notes: Optional[str] = Field(None, description="Additional notes")


class CropHistoryCreate(CropHistoryBase):
    pass


class CropHistoryInDB(CropHistoryBase):
    crop_id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True


class CropSnapshotBase(BaseModel):
    lifecycle_status: Optional[str] = Field(None, description="Lifecycle status at time")
    health_status: Optional[str] = Field(None, description="Health status at time")
    recipe_version_id: Optional[int] = Field(None, description="Recipe version at time")
    location: Optional[dict] = Field(None, description="Location at time")
    measurements_id: Optional[int] = Field(None, description="Measurements at time")
    accumulated_light_hours: Optional[float] = Field(None, description="Light hours at time")
    accumulated_water_hours: Optional[float] = Field(None, description="Water hours at time")
    image_url: Optional[str] = Field(None, description="Image URL at time")


class CropSnapshotCreate(CropSnapshotBase):
    pass


class CropSnapshotInDB(CropSnapshotBase):
    id: int
    timestamp: Optional[datetime] = None
    crop_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class RecipeFilterCriteria(BaseModel):
    search: Optional[str] = Field(None, description="Search term for name/crop_type")
    crop_type: Optional[str] = Field(None, description="Filter by crop type")
    created_by: Optional[str] = Field(None, description="Filter by creator")
    active_only: Optional[bool] = Field(False, description="Filter for active versions only")
    page: Optional[int] = Field(1, description="Page number for pagination")
    limit: Optional[int] = Field(10, description="Items per page")
    sort: Optional[str] = Field("name", description="Sort field")
    order: Optional[str] = Field("asc", description="Sort order (asc/desc)")


class CropFilterCriteria(BaseModel):
    search: Optional[str] = Field(None, description="Search term")
    seed_type_id: Optional[int] = Field(None, description="Filter by seed type")
    lifecycle_status: Optional[str] = Field(None, description="Filter by lifecycle status")
    health_check: Optional[str] = Field(None, description="Filter by health status")
    recipe_version_id: Optional[int] = Field(None, description="Filter by recipe version")
    page: Optional[int] = Field(1, description="Page number for pagination")
    limit: Optional[int] = Field(10, description="Items per page")
    sort: Optional[str] = Field("seed_date", description="Sort field")
    order: Optional[str] = Field("desc", description="Sort order (asc/desc)")


class CropSnapshotFilterCriteria(BaseModel):
    start_date: Optional[datetime] = Field(None, description="Filter from start date")
    end_date: Optional[datetime] = Field(None, description="Filter to end date")