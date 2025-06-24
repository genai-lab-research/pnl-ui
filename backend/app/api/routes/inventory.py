from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.services.tray import TrayService
from app.services.panel import PanelService
from app.services.crop import CropService
from app.schemas.tray import TrayCreate, TrayResponse, NurseryStationResponse
from app.schemas.panel import CultivationAreaResponse
from app.schemas.crop import CropResponse, CropFilter, CropDetailedResponse, CropMetricsCreate, CropMetricsResponse, CropStatisticsResponse

router = APIRouter()


@router.get("/containers/{container_id}/inventory/nursery", response_model=NurseryStationResponse)
async def get_nursery_station(
    container_id: str,
    date_filter: Optional[date] = Query(None, alias="date", description="Date for historical data"),
    db: Session = Depends(get_db),
):
    """Retrieves nursery station data for a specific container."""
    tray_service = TrayService(db)
    return tray_service.get_nursery_station(container_id, date_filter)


@router.post("/containers/{container_id}/inventory/tray", response_model=TrayResponse)
async def add_tray(
    container_id: str,
    tray_data: TrayCreate,
    db: Session = Depends(get_db),
):
    """Adds a new tray to a container's inventory."""
    tray_service = TrayService(db)
    try:
        return tray_service.create_tray(container_id, tray_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Note: crops endpoint moved to container.py to include pagination


@router.get("/containers/{container_id}/inventory/cultivation", response_model=CultivationAreaResponse)
async def get_cultivation_area(
    container_id: str,
    date_filter: Optional[date] = Query(None, alias="date", description="Date for historical data"),
    db: Session = Depends(get_db),
):
    """Retrieves cultivation area data for a specific container."""
    panel_service = PanelService(db)
    return panel_service.get_cultivation_area(container_id, date_filter)


@router.get("/containers/{container_id}/inventory/crop/{crop_id}", response_model=CropDetailedResponse)
async def get_crop(
    container_id: str,
    crop_id: str,
    db: Session = Depends(get_db),
):
    """Retrieves detailed information for a specific crop in a container."""
    crop_service = CropService(db)
    try:
        crop = crop_service.get_crop_by_container_and_id(container_id, crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        # Get detailed crop information
        detailed_crop = crop_service.get_crop_detailed(crop_id)
        if not detailed_crop:
            raise HTTPException(status_code=404, detail="Detailed crop information not found")
        return detailed_crop
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/containers/{container_id}/inventory/crop/{crop_id}/metrics", response_model=CropMetricsResponse)
async def add_crop_metrics(
    container_id: str,
    crop_id: str,
    metrics_data: CropMetricsCreate,
    db: Session = Depends(get_db),
):
    """Add new metrics data for a specific crop."""
    crop_service = CropService(db)
    try:
        # Validate crop exists and belongs to container
        crop = crop_service.get_crop_by_container_and_id(container_id, crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        # Set crop_id in metrics data
        metrics_data.crop_id = crop_id
        return crop_service.add_crop_metrics(metrics_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/containers/{container_id}/inventory/crop/{crop_id}/metrics", response_model=List[CropMetricsResponse])
async def get_crop_metrics_history(
    container_id: str,
    crop_id: str,
    limit: int = Query(100, ge=1, le=1000, description="Number of metrics records to return"),
    db: Session = Depends(get_db),
):
    """Get historical metrics data for a specific crop."""
    crop_service = CropService(db)
    try:
        # Validate crop exists and belongs to container
        crop = crop_service.get_crop_by_container_and_id(container_id, crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        return crop_service.get_crop_metrics_history(crop_id, limit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/containers/{container_id}/inventory/crop/{crop_id}/statistics", response_model=CropStatisticsResponse)
async def get_crop_statistics(
    container_id: str,
    crop_id: str,
    db: Session = Depends(get_db),
):
    """Get calculated statistics for a specific crop."""
    crop_service = CropService(db)
    try:
        # Validate crop exists and belongs to container
        crop = crop_service.get_crop_by_container_and_id(container_id, crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        stats = crop_service.get_crop_statistics(crop_id)
        if not stats:
            # Try to calculate statistics if they don't exist
            stats = crop_service.calculate_crop_statistics(crop_id)
            if not stats:
                raise HTTPException(status_code=404, detail="No statistics available for this crop")
        
        return stats
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))