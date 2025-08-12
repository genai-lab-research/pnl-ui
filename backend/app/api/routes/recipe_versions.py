"""Recipe version management routes."""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.auth.dependencies import get_current_user
from app.services.recipe_version import RecipeVersionService
from app.schemas.recipe import (
    RecipeVersionUpdate,
    RecipeVersionInDB
)

router = APIRouter()


@router.get("/{id}", response_model=RecipeVersionInDB)
async def get_recipe_version_by_id(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get a specific recipe version.
    
    - **id**: Recipe version identifier
    """
    version_service = RecipeVersionService(db)
    version = await version_service.get_version_by_id(id)
    
    return version


@router.put("/{id}", response_model=RecipeVersionInDB)
async def update_recipe_version(
    id: int,
    version: RecipeVersionUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Update an existing recipe version.
    
    - **id**: Recipe version identifier
    - **version**: Version identifier
    - **valid_from**: Version validity start
    - **valid_to**: Version validity end (optional)
    - **created_by**: Version creator
    - Plus all recipe parameters (tray_density, air_temperature, etc.)
    """
    version_service = RecipeVersionService(db)
    updated_version = await version_service.update_version(id, version)
    
    return updated_version


@router.delete("/{id}")
async def delete_recipe_version(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Delete a specific recipe version.
    
    - **id**: Recipe version identifier
    """
    version_service = RecipeVersionService(db)
    success = await version_service.delete_version(id)
    
    if success:
        return {"message": "Recipe version deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete recipe version"
        )