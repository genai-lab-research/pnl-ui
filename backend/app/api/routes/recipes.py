"""Recipe management routes."""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.auth.dependencies import get_current_user
from app.services.recipe_master import RecipeMasterService
from app.services.recipe_version import RecipeVersionService
from app.schemas.recipe import (
    RecipeMasterCreate,
    RecipeMasterUpdate,
    RecipeMasterInDB,
    RecipeVersionCreate,
    RecipeVersionUpdate,
    RecipeVersionInDB,
    RecipeFilterCriteria
)

router = APIRouter()


@router.get("/", response_model=List[RecipeMasterInDB])
async def get_all_recipes(
    search: str = Query(None, description="Search term for name/crop_type"),
    crop_type: str = Query(None, description="Filter by crop type"),
    created_by: str = Query(None, description="Filter by creator"),
    active_only: bool = Query(False, description="Filter for active versions only"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    sort: str = Query("name", description="Sort field"),
    order: str = Query("asc", regex="^(asc|desc)$", description="Sort order"),
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get all recipes with optional filtering and pagination.
    
    - **search**: Search term for name/crop_type
    - **crop_type**: Filter by crop type
    - **created_by**: Filter by creator
    - **active_only**: Filter for active versions only
    - **page**: Page number for pagination
    - **limit**: Items per page
    - **sort**: Sort field
    - **order**: Sort order (asc/desc)
    """
    criteria = RecipeFilterCriteria(
        search=search,
        crop_type=crop_type,
        created_by=created_by,
        active_only=active_only,
        page=page,
        limit=limit,
        sort=sort,
        order=order
    )
    
    recipe_service = RecipeMasterService(db)
    result = await recipe_service.get_all_recipes(criteria, include_versions=True)
    
    return result["recipes"]


@router.post("/", response_model=RecipeMasterInDB)
async def create_recipe(
    recipe: RecipeMasterCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create a new recipe master.
    
    - **name**: Recipe name (required)
    - **crop_type**: Crop type for this recipe (required)
    - **notes**: Additional notes (optional)
    """
    recipe_service = RecipeMasterService(db)
    new_recipe = await recipe_service.create_recipe(recipe)
    
    return new_recipe


@router.get("/{id}", response_model=RecipeMasterInDB)
async def get_recipe_by_id(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get a specific recipe master with all versions.
    
    - **id**: Recipe master identifier
    """
    recipe_service = RecipeMasterService(db)
    recipe = await recipe_service.get_recipe_by_id(id)
    
    return recipe


@router.put("/{id}", response_model=RecipeMasterInDB)
async def update_recipe(
    id: int,
    recipe: RecipeMasterUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Update an existing recipe master.
    
    - **id**: Recipe master identifier
    - **name**: Recipe name
    - **crop_type**: Crop type for this recipe
    - **notes**: Additional notes
    """
    recipe_service = RecipeMasterService(db)
    updated_recipe = await recipe_service.update_recipe(id, recipe)
    
    return updated_recipe


@router.delete("/{id}")
async def delete_recipe(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Delete a recipe master and all its versions.
    
    - **id**: Recipe master identifier
    """
    recipe_service = RecipeMasterService(db)
    success = await recipe_service.delete_recipe(id)
    
    if success:
        return {"message": "Recipe deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete recipe"
        )


@router.post("/{recipe_id}/versions/", response_model=RecipeVersionInDB)
async def create_recipe_version(
    recipe_id: int,
    version: RecipeVersionCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create a new version for an existing recipe.
    
    - **recipe_id**: Recipe master identifier
    - **version**: Version identifier
    - **valid_from**: Version validity start
    - **valid_to**: Version validity end (optional)
    - **created_by**: Version creator
    - Plus all recipe parameters (tray_density, air_temperature, etc.)
    """
    version_service = RecipeVersionService(db)
    new_version = await version_service.create_version(recipe_id, version)
    
    return new_version


@router.get("/{recipe_id}/versions/", response_model=List[RecipeVersionInDB])
async def get_recipe_versions(
    recipe_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get all versions for a specific recipe.
    
    - **recipe_id**: Recipe master identifier
    """
    version_service = RecipeVersionService(db)
    versions = await version_service.get_versions_by_recipe_id(recipe_id)
    
    return versions


@router.get("/{recipe_id}/versions/latest", response_model=RecipeVersionInDB)
async def get_latest_recipe_version(
    recipe_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get the latest version for a specific recipe.
    
    - **recipe_id**: Recipe master identifier
    """
    version_service = RecipeVersionService(db)
    version = await version_service.get_latest_version(recipe_id)
    
    if not version:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No versions found for recipe {recipe_id}"
        )
    
    return version


@router.get("/{recipe_id}/versions/active", response_model=List[RecipeVersionInDB])
async def get_active_recipe_versions(
    recipe_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get active versions for a specific recipe.
    
    - **recipe_id**: Recipe master identifier
    """
    version_service = RecipeVersionService(db)
    versions = await version_service.get_active_versions(recipe_id)
    
    return versions