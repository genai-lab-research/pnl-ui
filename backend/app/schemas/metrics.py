from datetime import date, datetime
from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field


class MetricSnapshotBase(BaseModel):
    air_temperature: Optional[float] = None
    humidity: Optional[float] = None
    co2: Optional[float] = None
    yield_kg: Optional[float] = None
    space_utilization_percentage: Optional[float] = None
    nursery_utilization_percentage: Optional[float] = None
    cultivation_utilization_percentage: Optional[float] = None


class MetricSnapshotCreate(MetricSnapshotBase):
    container_id: str = Field(..., description="Container ID")


class MetricSnapshot(MetricSnapshotBase):
    id: str
    container_id: str
    timestamp: datetime

    class Config:
        from_attributes = True


class DailyMetric(BaseModel):
    date: date
    value: float


class ContainerMetricsSummary(BaseModel):
    avg_yield_kg: float
    total_yield_kg: float
    avg_space_utilization: float
    yield_data: List[DailyMetric]
    utilization_data: List[DailyMetric]
    

class MetricsOverview(BaseModel):
    physical: ContainerMetricsSummary
    virtual: ContainerMetricsSummary


class MetricCreate(MetricSnapshotCreate):
    timestamp: Optional[datetime] = None


class MetricDataPoint(BaseModel):
    date: str
    value: float


class MetricResponse(BaseModel):
    yield_data: List[Dict[str, Union[str, float]]]
    space_utilization_data: List[Dict[str, Union[str, float]]]
    average_yield: float
    total_yield: float
    average_space_utilization: float
    current_temperature: float
    current_humidity: float
    current_co2: float
    crop_counts: Dict[str, int]
    is_daily: bool
    
    class Config:
        arbitrary_types_allowed = True


class SingleMetricData(BaseModel):
    current: float
    unit: str
    target: Optional[float] = None
    trend: Optional[float] = None


class ContainerMetricsDetail(BaseModel):
    temperature: SingleMetricData
    humidity: SingleMetricData
    co2: SingleMetricData
    yield_: SingleMetricData = Field(alias="yield")
    nursery_utilization: SingleMetricData
    cultivation_utilization: SingleMetricData
    
    class Config:
        allow_population_by_field_name = True


from enum import Enum


class MetricTimeRange(str, Enum):
    WEEK = "WEEK"
    MONTH = "MONTH"
    QUARTER = "QUARTER"
    YEAR = "YEAR"