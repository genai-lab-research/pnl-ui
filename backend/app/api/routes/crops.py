"""Crop API routes for the Crop Timelapse View functionality."""

import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.services.crop import CropService
from app.schemas.crop import (
    CropResponse, CropTimelapse, CropSnapshot, CropSnapshotCreate,
    GrowthChartData, NotesUpdateRequest, NotesUpdateResponse,
    CropHistoryEntry, CropHistoryCreate, CropMeasurementResponse,
    CropMeasurementUpdate
)
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/crops", tags=["crops"])


@router.get("/{crop_id}/timelapse", response_model=CropTimelapse)
async def get_crop_timelapse_data(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve comprehensive timelapse data for a specific crop."""
    try:
        crop_service = CropService(db)
        timelapse_data = await crop_service.get_crop_timelapse_data(crop_id)
        return timelapse_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving crop timelapse data for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve crop timelapse data"
        ) from e


@router.get("/{crop_id}/snapshots", response_model=List[CropSnapshot])
async def get_crop_snapshots(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user),
    start_date: Optional[datetime] = Query(None, description="Timeline start date"),
    end_date: Optional[datetime] = Query(None, description="Timeline end date"),
    limit: int = Query(100, description="Maximum number of snapshots")
):
    """Retrieve crop snapshots for timelapse functionality."""
    try:
        crop_service = CropService(db)
        snapshots = await crop_service.get_crop_snapshots_filtered(
            crop_id, start_date, end_date, limit
        )
        return snapshots
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving crop snapshots for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve crop snapshots"
        ) from e


@router.post("/{crop_id}/snapshots", response_model=CropSnapshot)
async def create_crop_snapshot(
    crop_id: int,
    snapshot_data: CropSnapshotCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create a new crop snapshot for timelapse tracking."""
    try:
        crop_service = CropService(db)
        snapshot = await crop_service.create_crop_snapshot(crop_id, snapshot_data)
        return snapshot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating crop snapshot for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create crop snapshot"
        ) from e


@router.get("/{crop_id}/growth-metrics", response_model=GrowthChartData)
async def get_crop_growth_chart_data(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user),
    start_date: Optional[datetime] = Query(None, description="Chart start date"),
    end_date: Optional[datetime] = Query(None, description="Chart end date"),
    metrics: Optional[List[str]] = Query(None, description="Specific metrics")
):
    """Retrieve detailed growth metrics over time for chart visualization."""
    try:
        crop_service = CropService(db)
        chart_data = await crop_service.get_crop_growth_chart_data(
            crop_id, start_date, end_date, metrics
        )
        return chart_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving growth chart data for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve growth chart data"
        ) from e


@router.put("/{crop_id}/notes", response_model=NotesUpdateResponse)
async def update_crop_notes(
    crop_id: int,
    notes_data: NotesUpdateRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Add or update notes for a specific crop."""
    try:
        crop_service = CropService(db)
        result = await crop_service.update_crop_notes(crop_id, notes_data.notes)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating crop notes for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update crop notes"
        ) from e


@router.get("/{crop_id}/history", response_model=List[CropHistoryEntry])
async def get_crop_history(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user),
    limit: int = Query(50, description="Maximum number of records"),
    start_date: Optional[datetime] = Query(None, description="Filter from start date"),
    end_date: Optional[datetime] = Query(None, description="Filter to end date")
):
    """Retrieve the change log and history for a specific crop."""
    try:
        crop_service = CropService(db)
        history = await crop_service.get_crop_history_filtered(
            crop_id, limit, start_date, end_date
        )
        return history
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving crop history for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve crop history"
        ) from e


@router.post("/{crop_id}/history", response_model=CropHistoryEntry)
async def create_crop_history_entry(
    crop_id: int,
    history_data: CropHistoryCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create a new history entry for a crop."""
    try:
        crop_service = CropService(db)
        history_entry = await crop_service.add_crop_history(crop_id, history_data)
        return history_entry
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating crop history entry for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create crop history entry"
        ) from e


@router.get("/{crop_id}", response_model=CropResponse)
async def get_crop_by_id(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve detailed crop information."""
    try:
        crop_service = CropService(db)
        crop = await crop_service.get_crop_by_id(crop_id)
        return crop
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve crop"
        ) from e


@router.get("/{crop_id}/measurements", response_model=CropMeasurementResponse)
async def get_crop_measurements(
    crop_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve measurements for a crop."""
    try:
        crop_service = CropService(db)
        measurements = await crop_service.get_crop_measurements(crop_id)
        return measurements
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving crop measurements for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve crop measurements"
        ) from e


@router.put("/{crop_id}/measurements", response_model=CropMeasurementResponse)
async def update_crop_measurements(
    crop_id: int,
    measurement_data: CropMeasurementUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Update measurements for a crop."""
    try:
        crop_service = CropService(db)
        measurements = await crop_service.update_crop_measurements(
            crop_id, measurement_data
        )
        return measurements
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating crop measurements for crop {crop_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update crop measurements"
        ) from e
