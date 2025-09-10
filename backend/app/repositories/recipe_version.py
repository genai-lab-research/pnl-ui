"""Recipe Version repository for database operations."""

from typing import List, Optional
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recipe import RecipeVersion
from app.repositories.base import BaseRepository
from app.schemas.recipe import RecipeVersionCreate, RecipeVersionUpdate


class RecipeVersionRepository(BaseRepository[RecipeVersion, RecipeVersionCreate, RecipeVersionUpdate]):
    """Repository for recipe version operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(RecipeVersion, db)
    
    async def get_by_recipe_id(self, recipe_id: int) -> List[RecipeVersion]:
        """Get all versions for a specific recipe."""
        query = select(RecipeVersion).where(
            RecipeVersion.recipe_id == recipe_id
        ).order_by(RecipeVersion.valid_from.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_active_versions(self, recipe_id: Optional[int] = None) -> List[RecipeVersion]:
        """Get active versions (valid now) for a recipe or all recipes."""
        from datetime import datetime
        current_time = datetime.utcnow()
        
        query = select(RecipeVersion).where(
            and_(
                RecipeVersion.valid_from <= current_time,
                or_(
                    RecipeVersion.valid_to.is_(None),
                    RecipeVersion.valid_to >= current_time
                )
            )
        )
        
        if recipe_id:
            query = query.where(RecipeVersion.recipe_id == recipe_id)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_latest_version(self, recipe_id: int) -> Optional[RecipeVersion]:
        """Get the latest version for a recipe."""
        query = select(RecipeVersion).where(
            RecipeVersion.recipe_id == recipe_id
        ).order_by(RecipeVersion.valid_from.desc()).limit(1)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_created_by(self, created_by: str) -> List[RecipeVersion]:
        """Get all versions created by a specific user."""
        query = select(RecipeVersion).where(
            RecipeVersion.created_by == created_by
        ).order_by(RecipeVersion.valid_from.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def create_version(self, recipe_id: int, version_data: RecipeVersionCreate) -> RecipeVersion:
        """Create a new version for a recipe."""
        version_dict = version_data.model_dump()
        version_dict['recipe_id'] = recipe_id
        
        version = RecipeVersion(**version_dict)
        self.db.add(version)
        await self.db.commit()
        await self.db.refresh(version)
        
        return version
    
    async def is_version_unique(self, recipe_id: int, version: str, exclude_id: Optional[int] = None) -> bool:
        """Check if version string is unique for a recipe."""
        query = select(RecipeVersion).where(
            and_(
                RecipeVersion.recipe_id == recipe_id,
                RecipeVersion.version == version
            )
        )
        
        if exclude_id:
            query = query.where(RecipeVersion.id != exclude_id)
        
        result = await self.db.execute(query)
        existing = result.scalar_one_or_none()
        return existing is None
    
    async def get_available_versions(
        self, 
        crop_type: Optional[str] = None,
        active_only: bool = True
    ) -> List[RecipeVersion]:
        """Get available recipe versions with optional filtering."""
        from datetime import datetime
        
        query = select(RecipeVersion).options(selectinload(RecipeVersion.recipe_master))
        
        if active_only:
            current_time = datetime.utcnow()
            query = query.where(
                and_(
                    RecipeVersion.valid_from <= current_time,
                    or_(
                        RecipeVersion.valid_to.is_(None),
                        RecipeVersion.valid_to >= current_time
                    )
                )
            )
        
        if crop_type:
            # Join with recipe master to filter by crop type
            from app.models.recipe import RecipeMaster
            query = query.join(RecipeMaster).where(RecipeMaster.crop_type == crop_type)
        
        query = query.order_by(RecipeVersion.valid_from.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())