"""Crop History repository for database operations."""

from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.crop_history import CropHistory
from app.schemas.recipe import CropHistoryCreate


class CropHistoryRepository:
    """Repository for crop history operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_crop_id(self, crop_id: int) -> List[CropHistory]:
        """Get all history entries for a specific crop."""
        query = select(CropHistory).where(
            CropHistory.crop_id == crop_id
        ).order_by(CropHistory.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_crop_id_and_date_range(
        self, 
        crop_id: int, 
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[CropHistory]:
        """Get history entries for a crop within a date range."""
        query = select(CropHistory).where(CropHistory.crop_id == crop_id)
        
        if start_date:
            query = query.where(CropHistory.timestamp >= start_date)
        
        if end_date:
            query = query.where(CropHistory.timestamp <= end_date)
        
        query = query.order_by(CropHistory.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def create_history_entry(self, crop_id: int, history_data: CropHistoryCreate) -> CropHistory:
        """Create a new history entry for a crop."""
        history_dict = history_data.model_dump()
        history_dict['crop_id'] = crop_id
        history_dict['timestamp'] = datetime.utcnow()
        
        history = CropHistory(**history_dict)
        self.db.add(history)
        await self.db.commit()
        await self.db.refresh(history)
        
        return history
    
    async def get_latest_event(self, crop_id: int) -> Optional[CropHistory]:
        """Get the latest history entry for a crop."""
        query = select(CropHistory).where(
            CropHistory.crop_id == crop_id
        ).order_by(CropHistory.timestamp.desc()).limit(1)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_event_type(self, crop_id: int, event: str) -> List[CropHistory]:
        """Get history entries by event type for a crop."""
        query = select(CropHistory).where(
            and_(
                CropHistory.crop_id == crop_id,
                CropHistory.event == event
            )
        ).order_by(CropHistory.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_performer(self, crop_id: int, performed_by: str) -> List[CropHistory]:
        """Get history entries by performer for a crop."""
        query = select(CropHistory).where(
            and_(
                CropHistory.crop_id == crop_id,
                CropHistory.performed_by == performed_by
            )
        ).order_by(CropHistory.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_filtered(
        self, crop_id: int, limit: int, start_date: Optional[datetime], 
        end_date: Optional[datetime]
    ) -> List[CropHistory]:
        """Get filtered history entries with limit."""
        query = select(CropHistory).where(CropHistory.crop_id == crop_id)
        
        if start_date:
            query = query.where(CropHistory.timestamp >= start_date)
        if end_date:
            query = query.where(CropHistory.timestamp <= end_date)
        
        query = query.order_by(CropHistory.timestamp.desc()).limit(limit)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def delete_by_crop_id(self, crop_id: int) -> bool:
        """Delete all history entries for a crop."""
        query = select(CropHistory).where(CropHistory.crop_id == crop_id)
        result = await self.db.execute(query)
        histories = result.scalars().all()
        
        for history in histories:
            await self.db.delete(history)
        
        await self.db.commit()
        return True