"""Recipe Version service for business logic."""

from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.recipe_version import RecipeVersionRepository
from app.repositories.recipe_master import RecipeMasterRepository
from app.schemas.recipe import RecipeVersionCreate, RecipeVersionUpdate
from app.models.recipe import RecipeVersion


class RecipeVersionService:
    """Service for recipe version business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.version_repo = RecipeVersionRepository(db)
        self.recipe_repo = RecipeMasterRepository(db)
    
    async def get_version_by_id(self, version_id: int) -> Optional[RecipeVersion]:
        """Get recipe version by ID."""
        version = await self.version_repo.get(version_id)
        if not version:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe version with ID {version_id} not found"
            )
        return version
    
    async def create_version(self, recipe_id: int, version_data: RecipeVersionCreate) -> RecipeVersion:
        """Create a new recipe version."""
        # Check if recipe exists
        recipe = await self.recipe_repo.get(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found"
            )
        
        # Validate version data
        await self._validate_version_data(recipe_id, version_data)
        
        # Create version
        version = await self.version_repo.create_version(recipe_id, version_data)
        
        return version
    
    async def update_version(self, version_id: int, version_data: RecipeVersionUpdate) -> Optional[RecipeVersion]:
        """Update an existing recipe version."""
        # Check if version exists
        existing_version = await self.version_repo.get(version_id)
        if not existing_version:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe version with ID {version_id} not found"
            )
        
        # Validate version data
        await self._validate_version_data(
            existing_version.recipe_id, 
            version_data, 
            exclude_id=version_id
        )
        
        # Update version
        updated_version = await self.version_repo.update(version_id, version_data)
        
        return updated_version
    
    async def delete_version(self, version_id: int) -> bool:
        """Delete a recipe version."""
        # Check if version exists
        version = await self.version_repo.get(version_id)
        if not version:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe version with ID {version_id} not found"
            )
        
        # Check if any crops are using this version
        from app.repositories.crop import CropRepository
        crop_repo = CropRepository(self.db)
        crops_using_version = await crop_repo.get_by_recipe_version(version_id)
        
        if crops_using_version:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete version. It is being used by {len(crops_using_version)} crop(s)"
            )
        
        # Delete version
        success = await self.version_repo.delete(version_id)
        
        return success
    
    async def get_versions_by_recipe_id(self, recipe_id: int) -> List[RecipeVersion]:
        """Get all versions for a specific recipe."""
        # Check if recipe exists
        recipe = await self.recipe_repo.get(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found"
            )
        
        versions = await self.version_repo.get_by_recipe_id(recipe_id)
        return versions
    
    async def get_active_versions(self, recipe_id: Optional[int] = None) -> List[RecipeVersion]:
        """Get active versions for a recipe or all recipes."""
        versions = await self.version_repo.get_active_versions(recipe_id)
        return versions
    
    async def get_latest_version(self, recipe_id: int) -> Optional[RecipeVersion]:
        """Get the latest version for a recipe."""
        # Check if recipe exists
        recipe = await self.recipe_repo.get(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found"
            )
        
        version = await self.version_repo.get_latest_version(recipe_id)
        return version
    
    async def _validate_version_data(
        self, 
        recipe_id: int, 
        version_data: RecipeVersionCreate, 
        exclude_id: Optional[int] = None
    ) -> None:
        """Validate version data."""
        if not version_data.version or not version_data.version.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Version identifier is required"
            )
        
        if not version_data.created_by or not version_data.created_by.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Created by is required"
            )
        
        # Check if version string is unique for this recipe
        is_unique = await self.version_repo.is_version_unique(
            recipe_id, 
            version_data.version, 
            exclude_id
        )
        
        if not is_unique:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Version '{version_data.version}' already exists for this recipe"
            )
        
        # Validate date ranges
        if version_data.valid_to and version_data.valid_from >= version_data.valid_to:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valid from date must be before valid to date"
            )
        
        # Validate numeric values
        numeric_fields = [
            'tray_density', 'air_temperature', 'humidity', 'co2',
            'water_temperature', 'ec', 'ph', 'water_hours', 'light_hours'
        ]
        
        for field in numeric_fields:
            value = getattr(version_data, field)
            if value is not None and value < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{field} must be a positive number"
                )
        
        # Validate specific ranges
        if version_data.ph is not None and (version_data.ph < 0 or version_data.ph > 14):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="pH must be between 0 and 14"
            )
        
        if version_data.humidity is not None and (version_data.humidity < 0 or version_data.humidity > 100):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Humidity must be between 0 and 100"
            )