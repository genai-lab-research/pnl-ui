"""Crop Snapshot repository for database operations."""

from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.snapshots import CropSnapshot
from app.schemas.recipe import CropSnapshotCreate, CropSnapshotFilterCriteria


class CropSnapshotRepository:
    """Repository for crop snapshot operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_crop_id(self, crop_id: int) -> List[CropSnapshot]:
        """Get all snapshots for a specific crop."""
        query = select(CropSnapshot).options(
            selectinload(CropSnapshot.crop),
            selectinload(CropSnapshot.recipe_version),
            selectinload(CropSnapshot.measurements)
        ).where(CropSnapshot.crop_id == crop_id).order_by(CropSnapshot.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_filtered(self, crop_id: int, criteria: CropSnapshotFilterCriteria) -> List[CropSnapshot]:
        """Get filtered snapshots for a crop."""
        query = select(CropSnapshot).options(
            selectinload(CropSnapshot.crop),
            selectinload(CropSnapshot.recipe_version),
            selectinload(CropSnapshot.measurements)
        ).where(CropSnapshot.crop_id == crop_id)
        
        # Apply date filters
        if criteria.start_date:
            query = query.where(CropSnapshot.timestamp >= criteria.start_date)
        
        if criteria.end_date:
            query = query.where(CropSnapshot.timestamp <= criteria.end_date)
        
        query = query.order_by(CropSnapshot.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def create_snapshot(self, crop_id: int, snapshot_data: CropSnapshotCreate) -> CropSnapshot:
        """Create a new snapshot for a crop."""
        snapshot_dict = snapshot_data.model_dump()
        snapshot_dict['crop_id'] = crop_id
        snapshot_dict['timestamp'] = datetime.utcnow()
        
        snapshot = CropSnapshot(**snapshot_dict)
        self.db.add(snapshot)
        await self.db.commit()
        await self.db.refresh(snapshot)
        
        return snapshot
    
    async def get_latest_snapshot(self, crop_id: int) -> Optional[CropSnapshot]:
        """Get the latest snapshot for a crop."""
        query = select(CropSnapshot).where(
            CropSnapshot.crop_id == crop_id
        ).order_by(CropSnapshot.timestamp.desc()).limit(1)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_date_range(
        self, 
        crop_id: int, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[CropSnapshot]:
        """Get snapshots for a crop within a date range."""
        query = select(CropSnapshot).where(
            and_(
                CropSnapshot.crop_id == crop_id,
                CropSnapshot.timestamp >= start_date,
                CropSnapshot.timestamp <= end_date
            )
        ).order_by(CropSnapshot.timestamp.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_id(self, snapshot_id: int) -> Optional[CropSnapshot]:
        """Get a specific snapshot by ID."""
        query = select(CropSnapshot).options(
            selectinload(CropSnapshot.crop),
            selectinload(CropSnapshot.recipe_version),
            selectinload(CropSnapshot.measurements)
        ).where(CropSnapshot.id == snapshot_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_crop_id_ordered(self, crop_id: int) -> List[CropSnapshot]:
        """Get all snapshots for a crop ordered by timestamp."""
        query = select(CropSnapshot).options(
            selectinload(CropSnapshot.crop),
            selectinload(CropSnapshot.recipe_version),
            selectinload(CropSnapshot.measurements)
        ).where(CropSnapshot.crop_id == crop_id).order_by(CropSnapshot.timestamp.asc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_filtered_by_dates(
        self, crop_id: int, start_date: Optional[datetime], 
        end_date: Optional[datetime], limit: int
    ) -> List[CropSnapshot]:
        """Get snapshots filtered by date range with limit."""
        query = select(CropSnapshot).where(CropSnapshot.crop_id == crop_id)
        
        if start_date:
            query = query.where(CropSnapshot.timestamp >= start_date)
        if end_date:
            query = query.where(CropSnapshot.timestamp <= end_date)
        
        query = query.order_by(CropSnapshot.timestamp.desc()).limit(limit)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_with_measurements(
        self, crop_id: int, start_date: Optional[datetime], 
        end_date: Optional[datetime]
    ) -> List[CropSnapshot]:
        """Get snapshots with measurements data for chart visualization."""
        query = select(CropSnapshot).options(
            selectinload(CropSnapshot.measurements)
        ).where(CropSnapshot.crop_id == crop_id)
        
        if start_date:
            query = query.where(CropSnapshot.timestamp >= start_date)
        if end_date:
            query = query.where(CropSnapshot.timestamp <= end_date)
        
        query = query.order_by(CropSnapshot.timestamp.asc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def delete_by_crop_id(self, crop_id: int) -> bool:
        """Delete all snapshots for a crop."""
        query = select(CropSnapshot).where(CropSnapshot.crop_id == crop_id)
        result = await self.db.execute(query)
        snapshots = result.scalars().all()
        
        for snapshot in snapshots:
            await self.db.delete(snapshot)
        
        await self.db.commit()
        return True