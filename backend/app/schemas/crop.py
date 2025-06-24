from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class CropLocationBase(BaseModel):
    type: str = Field(..., description="Type of inventory")
    tray_id: Optional[str] = Field(None, description="Associated tray ID")
    panel_id: Optional[str] = Field(None, description="Associated panel ID")
    row: int = Field(..., ge=0, description="Row position")
    column: int = Field(..., ge=0, description="Column position")
    channel: Optional[int] = Field(None, ge=0, description="Channel number")
    position: int = Field(..., ge=0, description="Position identifier")


class CropLocationCreate(CropLocationBase):
    pass


class CropLocationResponse(CropLocationBase):
    id: int

    class Config:
        from_attributes = True


class CropMetricsBase(BaseModel):
    recorded_at: datetime = Field(..., description="When the metrics were recorded")
    
    # Growth metrics
    height_cm: Optional[float] = Field(None, ge=0, description="Plant height in centimeters")
    leaf_count: Optional[int] = Field(None, ge=0, description="Number of leaves")
    stem_diameter_mm: Optional[float] = Field(None, ge=0, description="Stem diameter in millimeters")
    leaf_area_cm2: Optional[float] = Field(None, ge=0, description="Total leaf area in cm²")
    biomass_g: Optional[float] = Field(None, ge=0, description="Total biomass in grams")
    
    # Health indicators
    health_score: Optional[float] = Field(None, ge=0, le=100, description="Overall health score (0-100)")
    disease_detected: Optional[bool] = Field(False, description="Whether disease is detected")
    pest_detected: Optional[bool] = Field(False, description="Whether pests are detected")
    stress_level: Optional[float] = Field(None, ge=0, le=100, description="Plant stress level (0-100)")
    
    # Environmental metrics
    temperature_c: Optional[float] = Field(None, description="Temperature in Celsius")
    humidity_percent: Optional[float] = Field(None, ge=0, le=100, description="Humidity percentage")
    light_intensity_umol: Optional[float] = Field(None, ge=0, description="Light intensity in µmol/m²/s")
    ph_level: Optional[float] = Field(None, ge=0, le=14, description="pH level")
    ec_level: Optional[float] = Field(None, ge=0, description="Electrical conductivity")
    
    # Nutritional metrics
    nitrogen_ppm: Optional[float] = Field(None, ge=0, description="Nitrogen in ppm")
    phosphorus_ppm: Optional[float] = Field(None, ge=0, description="Phosphorus in ppm")
    potassium_ppm: Optional[float] = Field(None, ge=0, description="Potassium in ppm")
    calcium_ppm: Optional[float] = Field(None, ge=0, description="Calcium in ppm")
    magnesium_ppm: Optional[float] = Field(None, ge=0, description="Magnesium in ppm")


class CropMetricsCreate(CropMetricsBase):
    crop_id: str = Field(..., description="ID of the crop these metrics belong to")


class CropMetricsResponse(CropMetricsBase):
    id: int = Field(..., description="Unique identifier for the metrics record")
    crop_id: str = Field(..., description="ID of the crop these metrics belong to")

    class Config:
        from_attributes = True


class CropStatisticsBase(BaseModel):
    # Growth statistics
    avg_daily_growth_rate: Optional[float] = Field(None, ge=0, description="Average daily growth rate in cm/day")
    max_recorded_height: Optional[float] = Field(None, ge=0, description="Maximum recorded height in cm")
    total_leaf_count: Optional[int] = Field(None, ge=0, description="Total leaf count")
    growth_stage: Optional[str] = Field(None, description="Current growth stage")
    
    # Yield predictions
    predicted_yield_g: Optional[float] = Field(None, ge=0, description="Predicted yield in grams")
    predicted_harvest_date: Optional[datetime] = Field(None, description="Predicted harvest date")
    yield_quality_score: Optional[float] = Field(None, ge=0, le=100, description="Yield quality score (0-100)")
    
    # Performance metrics
    survival_rate: Optional[float] = Field(None, ge=0, le=100, description="Survival rate percentage")
    resource_efficiency: Optional[float] = Field(None, ge=0, le=100, description="Resource efficiency score")
    time_to_harvest_days: Optional[int] = Field(None, ge=0, description="Expected time to harvest in days")
    
    # Environmental adaptation
    temperature_tolerance: Optional[float] = Field(None, ge=0, le=100, description="Temperature tolerance score")
    humidity_tolerance: Optional[float] = Field(None, ge=0, le=100, description="Humidity tolerance score")
    light_efficiency: Optional[float] = Field(None, ge=0, le=100, description="Light efficiency score")
    
    # Health history
    disease_resistance: Optional[float] = Field(None, ge=0, le=100, description="Disease resistance score")
    pest_resistance: Optional[float] = Field(None, ge=0, le=100, description="Pest resistance score")
    overall_health_trend: Optional[str] = Field(None, description="Overall health trend")
    
    # Cultivation details
    variety: Optional[str] = Field(None, description="Crop variety")
    genetic_traits: Optional[Dict[str, Any]] = Field(None, description="Genetic traits information")
    cultivation_method: Optional[str] = Field(None, description="Cultivation method used")
    fertilizer_program: Optional[str] = Field(None, description="Fertilizer program details")
    irrigation_schedule: Optional[str] = Field(None, description="Irrigation schedule")
    
    # Quality metrics
    nutritional_content: Optional[Dict[str, Any]] = Field(None, description="Nutritional content analysis")
    taste_profile: Optional[Dict[str, Any]] = Field(None, description="Taste profile information")
    appearance_score: Optional[float] = Field(None, ge=0, le=100, description="Appearance quality score")
    shelf_life_days: Optional[int] = Field(None, ge=0, description="Expected shelf life in days")
    
    # Notes and observations
    cultivation_notes: Optional[str] = Field(None, description="Cultivation notes")
    harvest_notes: Optional[str] = Field(None, description="Harvest notes")
    special_observations: Optional[str] = Field(None, description="Special observations")


class CropStatisticsCreate(CropStatisticsBase):
    crop_id: str = Field(..., description="ID of the crop these statistics belong to")


class CropStatisticsResponse(CropStatisticsBase):
    id: int = Field(..., description="Unique identifier for the statistics record")
    crop_id: str = Field(..., description="ID of the crop these statistics belong to")

    class Config:
        from_attributes = True


class CropBase(BaseModel):
    seed_type: str = Field(..., description="Type of seed planted")
    seed_date: datetime = Field(..., description="Seed planting date")
    transplanting_date_planned: Optional[datetime] = Field(None, description="Planned transplanting date")
    harvesting_date_planned: Optional[datetime] = Field(None, description="Planned harvesting date")
    transplanted_date: Optional[datetime] = Field(None, description="Actual transplanting date")
    harvesting_date: Optional[datetime] = Field(None, description="Actual harvesting date")
    age: int = Field(..., ge=0, description="Age of the crop in days")
    status: str = Field(..., description="Current growth stage/status")
    overdue_days: Optional[int] = Field(None, ge=0, description="Number of overdue days")


class CropCreate(CropBase):
    id: str
    container_id: str
    location: CropLocationCreate


class CropResponse(CropBase):
    id: str = Field(..., description="Unique identifier for the crop")
    location: CropLocationResponse = Field(..., description="Location of the crop")
    metrics: Optional[List[CropMetricsResponse]] = Field(None, description="Historical metrics data")
    statistics: Optional[CropStatisticsResponse] = Field(None, description="Crop statistics and analysis")

    class Config:
        from_attributes = True


class CropDetailedResponse(CropResponse):
    recent_metrics: Optional[CropMetricsResponse] = Field(None, description="Most recent metrics")
    metrics_history: Optional[List[CropMetricsResponse]] = Field(None, description="Full metrics history")

    class Config:
        from_attributes = True


class CropFilter(BaseModel):
    seed_type: Optional[str] = None
    growth_stage: Optional[str] = None
    health_status: Optional[str] = None
    min_health_score: Optional[float] = Field(None, ge=0, le=100)
    max_health_score: Optional[float] = Field(None, ge=0, le=100)