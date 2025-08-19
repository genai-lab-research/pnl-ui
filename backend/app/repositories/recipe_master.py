"""Recipe Master repository for database operations."""

from typing import List, Optional, Dict, Any
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recipe import RecipeMaster, RecipeVersion
from app.repositories.base import BaseRepository
from app.schemas.recipe import RecipeMasterCreate, RecipeMasterUpdate, RecipeFilterCriteria


class RecipeMasterRepository(BaseRepository[RecipeMaster, RecipeMasterCreate, RecipeMasterUpdate]):
    """Repository for recipe master operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(RecipeMaster, db)
    
    async def get_with_versions(self, recipe_id: int) -> Optional[RecipeMaster]:
        """Get recipe master with all versions."""
        query = select(RecipeMaster).options(
            selectinload(RecipeMaster.recipe_versions)
        ).where(RecipeMaster.id == recipe_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_filtered(
        self,
        criteria: RecipeFilterCriteria,
        include_versions: bool = False
    ) -> List[RecipeMaster]:
        """Get filtered recipe masters with optional versions."""
        query = select(RecipeMaster)
        
        if include_versions:
            query = query.options(selectinload(RecipeMaster.recipe_versions))
        
        # Apply filters
        if criteria.search:
            search_filter = or_(
                RecipeMaster.name.ilike(f"%{criteria.search}%"),
                RecipeMaster.crop_type.ilike(f"%{criteria.search}%")
            )
            query = query.where(search_filter)
        
        if criteria.crop_type:
            query = query.where(RecipeMaster.crop_type == criteria.crop_type)
        
        if criteria.created_by:
            query = query.join(RecipeVersion).where(
                RecipeVersion.created_by == criteria.created_by
            )
        
        if criteria.active_only:
            from datetime import datetime
            current_time = datetime.utcnow()
            query = query.join(RecipeVersion).where(
                and_(
                    RecipeVersion.valid_from <= current_time,
                    or_(
                        RecipeVersion.valid_to.is_(None),
                        RecipeVersion.valid_to >= current_time
                    )
                )
            )
        
        # Apply sorting
        if criteria.sort == "name":
            if criteria.order == "desc":
                query = query.order_by(RecipeMaster.name.desc())
            else:
                query = query.order_by(RecipeMaster.name.asc())
        elif criteria.sort == "crop_type":
            if criteria.order == "desc":
                query = query.order_by(RecipeMaster.crop_type.desc())
            else:
                query = query.order_by(RecipeMaster.crop_type.asc())
        else:
            query = query.order_by(RecipeMaster.id)
        
        # Apply pagination
        offset = (criteria.page - 1) * criteria.limit
        query = query.offset(offset).limit(criteria.limit)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_count_filtered(self, criteria: RecipeFilterCriteria) -> int:
        """Get count of filtered recipe masters."""
        query = select(func.count(RecipeMaster.id))
        
        # Apply same filters as get_filtered
        if criteria.search:
            search_filter = or_(
                RecipeMaster.name.ilike(f"%{criteria.search}%"),
                RecipeMaster.crop_type.ilike(f"%{criteria.search}%")
            )
            query = query.where(search_filter)
        
        if criteria.crop_type:
            query = query.where(RecipeMaster.crop_type == criteria.crop_type)
        
        if criteria.created_by:
            query = query.join(RecipeVersion).where(
                RecipeVersion.created_by == criteria.created_by
            )
        
        if criteria.active_only:
            from datetime import datetime
            current_time = datetime.utcnow()
            query = query.join(RecipeVersion).where(
                and_(
                    RecipeVersion.valid_from <= current_time,
                    or_(
                        RecipeVersion.valid_to.is_(None),
                        RecipeVersion.valid_to >= current_time
                    )
                )
            )
        
        result = await self.db.execute(query)
        return result.scalar()
    
    async def get_by_crop_type(self, crop_type: str) -> List[RecipeMaster]:
        """Get all recipe masters by crop type."""
        query = select(RecipeMaster).where(RecipeMaster.crop_type == crop_type)
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def delete_with_versions(self, recipe_id: int) -> bool:
        """Delete recipe master and all its versions."""
        recipe = await self.get_with_versions(recipe_id)
        if not recipe:
            return False
        
        await self.db.delete(recipe)
        await self.db.commit()
        return True