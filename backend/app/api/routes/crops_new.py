"""Crop management routes following API specification."""

from typing import List, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.auth.dependencies import get_current_user
from app.services.crop import CropService
from app.schemas.recipe import (
    CropCreate,
    CropUpdate,
    CropInDB,
    CropFilterCriteria,
    CropHistoryCreate,
    CropHistoryInDB,
    CropSnapshotCreate,
    CropSnapshotInDB,
    CropSnapshotFilterCriteria,
    CropMeasurementCreate,
    CropMeasurementInDB
)

router = APIRouter()


@router.get("/", response_model=List[CropInDB])
async def get_all_crops(
    search: str = Query(None, description="Search term"),
    seed_type_id: int = Query(None, description="Filter by seed type"),
    lifecycle_status: str = Query(None, description="Filter by lifecycle status"),
    health_check: str = Query(None, description="Filter by health status"),
    recipe_version_id: int = Query(None, description="Filter by recipe version"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    sort: str = Query("seed_date", description="Sort field"),
    order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get all crops with optional filtering and pagination.
    
    - **search**: Search term
    - **seed_type_id**: Filter by seed type
    - **lifecycle_status**: Filter by lifecycle status
    - **health_check**: Filter by health status
    - **recipe_version_id**: Filter by recipe version
    - **page**: Page number for pagination
    - **limit**: Items per page
    - **sort**: Sort field
    - **order**: Sort order (asc/desc)
    """
    criteria = CropFilterCriteria(
        search=search,
        seed_type_id=seed_type_id,
        lifecycle_status=lifecycle_status,
        health_check=health_check,
        recipe_version_id=recipe_version_id,
        page=page,
        limit=limit,
        sort=sort,
        order=order
    )
    
    crop_service = CropService(db)
    result = await crop_service.get_all_crops(criteria)
    
    return result["crops"]


@router.post("/", response_model=CropInDB)
async def create_crop(
    crop: CropCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create a new crop.
    
    - **seed_type_id**: Related seed type (optional)
    - **seed_date**: Seeding date (optional)
    - **transplanting_date_planned**: Planned transplanting date (optional)
    - **harvesting_date_planned**: Planned harvesting date (optional)
    - **lifecycle_status**: Current lifecycle stage (optional)
    - **health_check**: Health assessment (optional)
    - **current_location**: Current location data (optional)
    - **recipe_version_id**: Applied recipe version (optional)
    - **notes**: Additional notes (optional)
    """
    crop_service = CropService(db)
    new_crop = await crop_service.create_crop(crop)
    
    return new_crop


@router.get("/{id}", response_model=CropInDB)
async def get_crop_by_id(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get a specific crop with full details.
    
    - **id**: Crop identifier
    """
    crop_service = CropService(db)
    crop = await crop_service.get_crop_by_id(id)
    
    return crop


@router.put("/{id}", response_model=CropInDB)
async def update_crop(
    id: int,
    crop: CropUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Update an existing crop.
    
    - **id**: Crop identifier
    - Plus all crop fields that can be updated
    """
    crop_service = CropService(db)
    updated_crop = await crop_service.update_crop(id, crop)
    
    return updated_crop


@router.delete("/{id}")
async def delete_crop(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Delete a crop.
    
    - **id**: Crop identifier
    """
    crop_service = CropService(db)
    success = await crop_service.delete_crop(id)
    
    if success:
        return {"message": "Crop deleted successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete crop"
        )


@router.get("/{crop_id}/history", response_model=List[CropHistoryInDB])
async def get_crop_history(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get history for a specific crop.
    
    - **crop_id**: Crop identifier
    """
    crop_service = CropService(db)
    history = await crop_service.get_crop_history(crop_id)
    
    return history


@router.post("/{crop_id}/history", response_model=CropHistoryInDB)
async def add_crop_history(
    crop_id: int,
    history: CropHistoryCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Add a new event to crop history.
    
    - **crop_id**: Crop identifier
    - **event**: Event description
    - **performed_by**: Person who performed action
    - **notes**: Additional notes
    """
    crop_service = CropService(db)
    new_history = await crop_service.add_crop_history(crop_id, history)
    
    return new_history


@router.get("/{crop_id}/snapshots", response_model=List[CropSnapshotInDB])
async def get_crop_snapshots(
    crop_id: int,
    start_date: datetime = Query(None, description="Filter from start date"),
    end_date: datetime = Query(None, description="Filter to end date"),
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get snapshots for a specific crop.
    
    - **crop_id**: Crop identifier
    - **start_date**: Filter from start date (optional)
    - **end_date**: Filter to end date (optional)
    """
    criteria = CropSnapshotFilterCriteria(
        start_date=start_date,
        end_date=end_date
    )
    
    crop_service = CropService(db)
    snapshots = await crop_service.get_crop_snapshots(crop_id, criteria)
    
    return snapshots


@router.post("/{crop_id}/snapshots", response_model=CropSnapshotInDB)
async def create_crop_snapshot(
    crop_id: int,
    snapshot: CropSnapshotCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create a new crop snapshot.
    
    - **crop_id**: Crop identifier
    - **lifecycle_status**: Lifecycle status at time
    - **health_status**: Health status at time
    - **recipe_version_id**: Recipe version at time
    - **location**: Location at time
    - **measurements_id**: Measurements at time
    - **accumulated_light_hours**: Light hours at time
    - **accumulated_water_hours**: Water hours at time
    - **image_url**: Image URL at time
    """
    crop_service = CropService(db)
    new_snapshot = await crop_service.create_crop_snapshot(crop_id, snapshot)
    
    return new_snapshot


@router.post("/crop-measurements/", response_model=CropMeasurementInDB)
async def create_crop_measurements(
    measurement: CropMeasurementCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Create a new crop measurement record.
    
    - **radius**: Crop radius (optional)
    - **width**: Crop width (optional)
    - **height**: Crop height (optional)
    - **area**: Crop area (optional)
    - **area_estimated**: Estimated crop area (optional)
    - **weight**: Crop weight (optional)
    """
    crop_service = CropService(db)
    new_measurement = await crop_service.create_crop_measurement(measurement)
    
    return new_measurement


@router.get("/crop-measurements/{id}", response_model=CropMeasurementInDB)
async def get_crop_measurements(
    id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: dict = Depends(get_current_user)
) -> Any:
    """
    Get crop measurements by ID.
    
    - **id**: Measurements identifier
    """
    crop_service = CropService(db)
    measurement = await crop_service.get_crop_measurement(id)
    
    return measurement