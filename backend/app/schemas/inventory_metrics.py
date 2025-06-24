from typing import Optional
from datetime import date
from pydantic import BaseModel, Field


class InventoryMetricsBase(BaseModel):
    nursery_station_utilization: int = Field(ge=0, le=100)
    cultivation_area_utilization: int = Field(ge=0, le=100)
    air_temperature: Optional[float] = Field(None, description="Temperature in Celsius")
    humidity: Optional[int] = Field(None, ge=0, le=100, description="Humidity percentage")
    co2_level: Optional[int] = Field(None, ge=0, description="CO2 level in ppm")
    yield_kg: Optional[float] = Field(None, ge=0, description="Yield in kg")


class InventoryMetricsCreate(InventoryMetricsBase):
    container_id: str
    date: date


class InventoryMetricsResponse(InventoryMetricsBase):
    id: int
    container_id: str
    date: date

    class Config:
        from_attributes = True


class InventoryMetricsQuery(BaseModel):
    date: Optional[str] = Field(None, description="Date for historical data (YYYY-MM-DD)")