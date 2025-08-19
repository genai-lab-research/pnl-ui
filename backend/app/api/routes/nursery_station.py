"""
Nursery station API routes for container management system.
Handles nursery station layout, tray management, and time-lapse functionality.
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.auth.dependencies import get_current_user
from app.schemas.nursery_station import (
    NurseryStationLayout,
    NurseryStationSummary,
    TraySnapshot,
    TraySnapshotCreate,
    AvailableSlotsResponse,
    TrayLocationUpdate,
    TrayLocationUpdateResponse,
    TrayUpdate,
    NurseryTray,
    TimelineData
)
from app.schemas.tray import TrayResponse
from app.services.nursery_station import NurseryStationService
from app.models.tenant import Tenant

router = APIRouter()


@router.get("/containers/{container_id}/inventory/nursery-station",
           response_model=NurseryStationLayout,
           summary="Get nursery station layout",
           description="Retrieves the current nursery station layout with tray placement and utilization data")
async def get_nursery_station_layout(
    container_id: int,
    date: Optional[datetime] = Query(None, description="Specific date for historical view (ISO 8601 format)"),
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Get nursery station layout with trays and crops.
    
    - **container_id**: Container identifier
    - **date**: Optional specific date for historical view
    
    Returns the current nursery station layout with:
    - Utilization summary
    - Upper and lower shelf layouts
    - Off-shelf trays
    """
    try:
        service = NurseryStationService(db)
        layout = await service.get_nursery_station_layout(container_id, date)
        return layout
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve nursery station layout: {str(e)}"
        )


@router.get("/containers/{container_id}/trays",
           response_model=List[TrayResponse],
           summary="Get trays for container",
           description="Retrieves all trays for a specific container")
async def get_trays_for_container(
    container_id: int,
    status: Optional[str] = Query(None, description="Filter by tray status"),
    location_type: Optional[str] = Query(None, description="Filter by location (nursery/cultivation/none)"),
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Get all trays for a specific container.
    
    - **container_id**: Container identifier
    - **status**: Optional filter by tray status
    - **location_type**: Optional filter by location type
    
    Returns a list of trays with their details.
    """
    try:
        service = NurseryStationService(db)
        trays = await service.get_trays_for_container(container_id, status, location_type)
        return trays
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trays: {str(e)}"
        )


@router.get("/containers/{container_id}/tray-snapshots",
           response_model=List[TraySnapshot],
           summary="Get tray snapshots",
           description="Retrieves historical snapshots for time-lapse functionality")
async def get_tray_snapshots(
    container_id: int,
    start_date: Optional[datetime] = Query(None, description="Timeline start date (default: 2 weeks ago)"),
    end_date: Optional[datetime] = Query(None, description="Timeline end date (default: 2 weeks future)"),
    tray_id: Optional[int] = Query(None, description="Filter by specific tray"),
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Get tray snapshots for time-lapse functionality.
    
    - **container_id**: Container identifier
    - **start_date**: Timeline start date (default: 2 weeks ago)
    - **end_date**: Timeline end date (default: 2 weeks future)
    - **tray_id**: Optional filter by specific tray
    
    Returns a list of tray snapshots for the specified time range.
    """
    try:
        service = NurseryStationService(db)
        snapshots = await service.get_tray_snapshots(container_id, start_date, end_date, tray_id)
        return snapshots
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tray snapshots: {str(e)}"
        )


@router.post("/containers/{container_id}/tray-snapshots",
            response_model=TraySnapshot,
            status_code=status.HTTP_201_CREATED,
            summary="Create tray snapshot",
            description="Creates a new tray snapshot for tracking changes")
async def create_tray_snapshot(
    container_id: int,
    snapshot_data: TraySnapshotCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Create a new tray snapshot.
    
    - **container_id**: Container identifier
    - **snapshot_data**: Tray snapshot data
    
    Returns the created tray snapshot.
    """
    try:
        service = NurseryStationService(db)
        snapshot = await service.create_tray_snapshot(container_id, snapshot_data)
        return snapshot
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create tray snapshot: {str(e)}"
        )


@router.get("/containers/{container_id}/nursery-station/available-slots",
           response_model=AvailableSlotsResponse,
           summary="Get available tray slots",
           description="Retrieves empty slots available for new tray placement")
async def get_available_slots(
    container_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Get available slots for tray placement.
    
    - **container_id**: Container identifier
    
    Returns a list of available slots in the nursery station.
    """
    try:
        service = NurseryStationService(db)
        available_slots = await service.get_available_slots(container_id)
        return available_slots
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve available slots: {str(e)}"
        )


@router.put("/trays/{tray_id}/location",
           response_model=TrayLocationUpdateResponse,
           summary="Update tray location",
           description="Updates a tray's location in the nursery station")
async def update_tray_location(
    tray_id: int,
    location_data: TrayLocationUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Update tray location.
    
    - **tray_id**: Tray identifier
    - **location_data**: New location data and user information
    
    Returns the updated tray information.
    """
    try:
        service = NurseryStationService(db)
        result = await service.update_tray_location(tray_id, location_data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update tray location: {str(e)}"
        )


@router.get("/trays/{tray_id}",
           response_model=NurseryTray,
           summary="Get tray by ID",
           description="Retrieves a specific tray with full details including crops")
async def get_tray_by_id(
    tray_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Get tray by ID with full details.
    
    - **tray_id**: Tray identifier
    
    Returns the tray with all its crops and details.
    """
    try:
        service = NurseryStationService(db)
        tray = await service.get_tray_by_id(tray_id)
        if not tray:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tray with ID {tray_id} not found"
            )
        return tray
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tray: {str(e)}"
        )


@router.put("/trays/{tray_id}",
           response_model=NurseryTray,
           summary="Update tray",
           description="Updates tray information")
async def update_tray(
    tray_id: int,
    tray_data: TrayUpdate,
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Update tray information.
    
    - **tray_id**: Tray identifier
    - **tray_data**: Updated tray data
    
    Returns the updated tray information.
    """
    try:
        service = NurseryStationService(db)
        tray = await service.update_tray(tray_id, tray_data)
        if not tray:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tray with ID {tray_id} not found"
            )
        return tray
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update tray: {str(e)}"
        )


@router.get("/containers/{container_id}/nursery-station/summary",
           response_model=NurseryStationSummary,
           summary="Get nursery station summary",
           description="Retrieves aggregated summary for nursery station dashboard")
async def get_nursery_station_summary(
    container_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user: Tenant = Depends(get_current_user)
):
    """
    Get nursery station summary.
    
    - **container_id**: Container identifier
    
    Returns aggregated metrics for the nursery station dashboard.
    """
    try:
        service = NurseryStationService(db)
        summary = await service.get_nursery_station_summary(container_id)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve nursery station summary: {str(e)}"
        )