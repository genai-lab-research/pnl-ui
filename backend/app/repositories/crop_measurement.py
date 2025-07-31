"""Crop Measurement repository for database operations."""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.crop_measurement import CropMeasurement
from app.repositories.base import BaseRepository
from app.schemas.recipe import CropMeasurementCreate
from app.schemas.crop import CropMeasurementUpdate


class CropMeasurementRepository(BaseRepository[CropMeasurement, CropMeasurementCreate, CropMeasurementUpdate]):
    """Repository for crop measurement operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(CropMeasurement, db)
    
    async def get_by_id(self, measurement_id: int) -> Optional[CropMeasurement]:
        """Get crop measurement by ID."""
        query = select(CropMeasurement).where(CropMeasurement.id == measurement_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def create_measurement(self, measurement_data: CropMeasurementCreate) -> CropMeasurement:
        """Create a new crop measurement."""
        measurement_dict = measurement_data.model_dump()
        measurement = CropMeasurement(**measurement_dict)
        
        self.db.add(measurement)
        await self.db.commit()
        await self.db.refresh(measurement)
        
        return measurement
    
    async def update_measurement(self, measurement_id: int, measurement_data: CropMeasurementUpdate) -> Optional[CropMeasurement]:
        """Update an existing crop measurement."""
        measurement = await self.get_by_id(measurement_id)
        if not measurement:
            return None
        
        update_dict = measurement_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(measurement, field, value)
        
        await self.db.commit()
        await self.db.refresh(measurement)
        
        return measurement
    
    async def delete_measurement(self, measurement_id: int) -> bool:
        """Delete a crop measurement."""
        measurement = await self.get_by_id(measurement_id)
        if not measurement:
            return False
        
        await self.db.delete(measurement)
        await self.db.commit()
        return True