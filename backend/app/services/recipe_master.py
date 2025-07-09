"""Recipe Master service for business logic."""

from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.recipe_master import RecipeMasterRepository
from app.repositories.recipe_version import RecipeVersionRepository
from app.schemas.recipe import (
    RecipeMasterCreate, 
    RecipeMasterUpdate, 
    RecipeFilterCriteria
)
from app.models.recipe import RecipeMaster


class RecipeMasterService:
    """Service for recipe master business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.recipe_repo = RecipeMasterRepository(db)
        self.version_repo = RecipeVersionRepository(db)
    
    async def get_all_recipes(
        self, 
        criteria: RecipeFilterCriteria,
        include_versions: bool = False
    ) -> Dict[str, Any]:
        """Get all recipes with filtering and pagination."""
        recipes = await self.recipe_repo.get_filtered(criteria, include_versions)
        total_count = await self.recipe_repo.get_count_filtered(criteria)
        
        return {
            "recipes": recipes,
            "total_count": total_count,
            "page": criteria.page,
            "limit": criteria.limit,
            "total_pages": (total_count + criteria.limit - 1) // criteria.limit
        }
    
    async def get_recipe_by_id(self, recipe_id: int) -> Optional[RecipeMaster]:
        """Get recipe by ID with all versions."""
        recipe = await self.recipe_repo.get_with_versions(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found"
            )
        return recipe
    
    async def create_recipe(self, recipe_data: RecipeMasterCreate) -> RecipeMaster:
        """Create a new recipe master."""
        # Validate recipe data
        await self._validate_recipe_data(recipe_data)
        
        # Create recipe
        recipe = await self.recipe_repo.create(recipe_data)
        
        # Load with relationships for proper serialization
        return await self.recipe_repo.get_with_versions(recipe.id)
    
    async def update_recipe(self, recipe_id: int, recipe_data: RecipeMasterUpdate) -> Optional[RecipeMaster]:
        """Update an existing recipe master."""
        # Check if recipe exists
        existing_recipe = await self.recipe_repo.get(recipe_id)
        if not existing_recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found"
            )
        
        # Validate recipe data
        await self._validate_recipe_data(recipe_data)
        
        # Update recipe
        updated_recipe = await self.recipe_repo.update(recipe_id, recipe_data)
        
        # Load with relationships for proper serialization
        return await self.recipe_repo.get_with_versions(recipe_id)
    
    async def delete_recipe(self, recipe_id: int) -> bool:
        """Delete a recipe master and all its versions."""
        # Check if recipe exists
        recipe = await self.recipe_repo.get(recipe_id)
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with ID {recipe_id} not found"
            )
        
        # Check if recipe has active versions being used by crops
        active_versions = await self.version_repo.get_active_versions(recipe_id)
        if active_versions:
            # Check if any crops are using these versions
            from app.repositories.crop import CropRepository  # pylint: disable=import-outside-toplevel
            crop_repo = CropRepository(self.db)
            
            for version in active_versions:
                crops_using_version = await crop_repo.get_by_recipe_version(version.id)
                if crops_using_version:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Cannot delete recipe. Version {version.version} is being used by {len(crops_using_version)} crop(s)"
                    )
        
        # Delete recipe and all versions
        success = await self.recipe_repo.delete_with_versions(recipe_id)
        
        return success
    
    async def get_recipes_by_crop_type(self, crop_type: str) -> List[RecipeMaster]:
        """Get all recipes for a specific crop type."""
        recipes = await self.recipe_repo.get_by_crop_type(crop_type)
        return recipes
    
    async def _validate_recipe_data(self, recipe_data: RecipeMasterCreate) -> None:
        """Validate recipe data."""
        if not recipe_data.name or not recipe_data.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recipe name is required"
            )
        
        if not recipe_data.crop_type or not recipe_data.crop_type.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Crop type is required"
            )
        
        # Check for duplicate recipe names within the same crop type
        existing_recipes = await self.recipe_repo.get_by_crop_type(recipe_data.crop_type)
        
        for recipe in existing_recipes:
            if recipe.name.lower() == recipe_data.name.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Recipe with name '{recipe_data.name}' already exists for crop type '{recipe_data.crop_type}'"
                )
