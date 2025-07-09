"""Crop repository for database operations."""

from typing import List, Optional
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.crop import Crop
from app.repositories.base import BaseRepository
from app.schemas.recipe import CropCreate, CropUpdate, CropFilterCriteria


class CropRepository(BaseRepository[Crop, CropCreate, CropUpdate]):
    """Repository for crop operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Crop, db)
    
    async def get_with_relationships(self, crop_id: int) -> Optional[Crop]:
        """Get crop with all related data."""
        query = select(Crop).options(
            selectinload(Crop.seed_type),
            selectinload(Crop.measurements),
            selectinload(Crop.recipe_version),
            selectinload(Crop.crop_history),
            selectinload(Crop.crop_snapshots)
        ).where(Crop.id == crop_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_filtered(self, criteria: CropFilterCriteria) -> List[Crop]:
        """Get filtered crops."""
        query = select(Crop).options(
            selectinload(Crop.seed_type),
            selectinload(Crop.measurements),
            selectinload(Crop.recipe_version)
        )
        
        # Apply filters
        if criteria.search:
            # Search in notes or lifecycle status
            search_filter = or_(
                Crop.notes.ilike(f"%{criteria.search}%"),
                Crop.lifecycle_status.ilike(f"%{criteria.search}%")
            )
            query = query.where(search_filter)
        
        if criteria.seed_type_id:
            query = query.where(Crop.seed_type_id == criteria.seed_type_id)
        
        if criteria.lifecycle_status:
            query = query.where(Crop.lifecycle_status == criteria.lifecycle_status)
        
        if criteria.health_check:
            query = query.where(Crop.health_check == criteria.health_check)
        
        if criteria.recipe_version_id:
            query = query.where(Crop.recipe_version_id == criteria.recipe_version_id)
        
        # Apply sorting
        if criteria.sort == "seed_date":
            if criteria.order == "desc":
                query = query.order_by(Crop.seed_date.desc())
            else:
                query = query.order_by(Crop.seed_date.asc())
        elif criteria.sort == "lifecycle_status":
            if criteria.order == "desc":
                query = query.order_by(Crop.lifecycle_status.desc())
            else:
                query = query.order_by(Crop.lifecycle_status.asc())
        else:
            query = query.order_by(Crop.id)
        
        # Apply pagination
        offset = (criteria.page - 1) * criteria.limit
        query = query.offset(offset).limit(criteria.limit)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_count_filtered(self, criteria: CropFilterCriteria) -> int:
        """Get count of filtered crops."""
        query = select(func.count(Crop.id))
        
        # Apply same filters as get_filtered
        if criteria.search:
            search_filter = or_(
                Crop.notes.ilike(f"%{criteria.search}%"),
                Crop.lifecycle_status.ilike(f"%{criteria.search}%")
            )
            query = query.where(search_filter)
        
        if criteria.seed_type_id:
            query = query.where(Crop.seed_type_id == criteria.seed_type_id)
        
        if criteria.lifecycle_status:
            query = query.where(Crop.lifecycle_status == criteria.lifecycle_status)
        
        if criteria.health_check:
            query = query.where(Crop.health_check == criteria.health_check)
        
        if criteria.recipe_version_id:
            query = query.where(Crop.recipe_version_id == criteria.recipe_version_id)
        
        result = await self.db.execute(query)
        return result.scalar()
    
    async def get_by_seed_type(self, seed_type_id: int) -> List[Crop]:
        """Get all crops by seed type."""
        query = select(Crop).where(Crop.seed_type_id == seed_type_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_recipe_version(self, recipe_version_id: int) -> List[Crop]:
        """Get all crops using a specific recipe version."""
        query = select(Crop).where(Crop.recipe_version_id == recipe_version_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_lifecycle_status(self, lifecycle_status: str) -> List[Crop]:
        """Get all crops by lifecycle status."""
        query = select(Crop).where(Crop.lifecycle_status == lifecycle_status)
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_health_status(self, health_check: str) -> List[Crop]:
        """Get all crops by health status."""
        query = select(Crop).where(Crop.health_check == health_check)
        result = await self.db.execute(query)
        return list(result.scalars().all())