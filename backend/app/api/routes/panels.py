"""Panel API routes for the Vertical Farm Management System."""

import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.models import Panel
from app.schemas.panel import (
    PanelResponse, PanelProvisionRequest, PanelProvisionResponse,
    BulkPanelProvisionRequest, BulkPanelProvisionResponse, PrintLabelResponse
)
from app.services.panel import PanelService
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/panels", tags=["panels"])


@router.get("/", response_model=List[PanelResponse])
async def get_panels(
    container_id: Optional[int] = Query(None, description="Filter by container ID"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by panel status"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve list of panels with optional filters."""
    from sqlalchemy import select
    
    try:
        query = select(Panel)
        
        if container_id is not None:
            query = query.where(Panel.container_id == container_id)
        if status_filter is not None:
            query = query.where(Panel.status == status_filter)
            
        result = await db.execute(query)
        panels = result.scalars().all()
        
        return [
            PanelResponse(
                id=panel.id,
                container_id=panel.container_id,
                rfid_tag=panel.rfid_tag,
                location=panel.location,
                utilization_pct=panel.utilization_pct,
                provisioned_at=panel.provisioned_at,
                status=panel.status,
                capacity=panel.capacity,
                panel_type=panel.panel_type
            ) for panel in panels
        ]
    except Exception as e:
        logger.error(f"Error retrieving panels: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve panels"
        ) from e


@router.post("/provision", response_model=PanelProvisionResponse)
async def provision_new_panel(
    request: PanelProvisionRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create and provision a new panel with RFID tag assignment."""
    try:
        panel_service = PanelService(db)
        provision_result = await panel_service.provision_panel(request)
        return provision_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error provisioning panel: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to provision panel"
        ) from e


@router.get("/{panel_id}/print-label", response_model=PrintLabelResponse)
async def print_panel_label(
    panel_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Generate a printable label for the provisioned panel."""
    try:
        panel_service = PanelService(db)
        label_result = await panel_service.generate_print_label(panel_id)
        return label_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating panel label for panel {panel_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate panel label"
        ) from e


@router.post("/bulk-provision", response_model=BulkPanelProvisionResponse)
async def bulk_provision_panels(
    request: BulkPanelProvisionRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Provision multiple panels in a single operation."""
    try:
        panel_service = PanelService(db)
        bulk_result = await panel_service.bulk_provision_panels(request)
        return bulk_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error bulk provisioning panels: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to bulk provision panels"
        ) from e


@router.get("/{panel_id}", response_model=dict)
async def get_panel_by_id(
    panel_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Get a specific panel by ID."""
    try:
        from sqlalchemy import select
        result = await db.execute(select(Panel).where(Panel.id == panel_id))
        panel = result.scalar_one_or_none()
        
        if not panel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Panel not found"
            )
        
        return {
            "id": panel.id,
            "container_id": panel.container_id,
            "rfid_tag": panel.rfid_tag,
            "location": panel.location,
            "utilization_pct": panel.utilization_pct,
            "provisioned_at": panel.provisioned_at,
            "status": panel.status,
            "capacity": panel.capacity,
            "panel_type": panel.panel_type
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting panel {panel_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve panel"
        ) from e


@router.put("/{panel_id}", response_model=dict)
async def update_panel(
    panel_id: int,
    update_data: dict,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Update a panel."""
    try:
        from sqlalchemy import select
        result = await db.execute(select(Panel).where(Panel.id == panel_id))
        panel = result.scalar_one_or_none()
        
        if not panel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Panel not found"
            )
        
        # Update panel fields
        if "location" in update_data:
            panel.location = update_data["location"]
        if "utilization_pct" in update_data:
            panel.utilization_pct = update_data["utilization_pct"]
        if "status" in update_data:
            panel.status = update_data["status"]
        if "capacity" in update_data:
            panel.capacity = update_data["capacity"]
        if "panel_type" in update_data:
            panel.panel_type = update_data["panel_type"]
        
        await db.commit()
        await db.refresh(panel)
        
        return {
            "id": panel.id,
            "container_id": panel.container_id,
            "rfid_tag": panel.rfid_tag,
            "location": panel.location,
            "utilization_pct": panel.utilization_pct,
            "provisioned_at": panel.provisioned_at,
            "status": panel.status,
            "capacity": panel.capacity,
            "panel_type": panel.panel_type
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating panel {panel_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update panel"
        ) from e


@router.put("/{panel_id}/location", response_model=dict)
async def update_panel_location(
    panel_id: int,
    location_data: dict,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Update panel location."""
    try:
        from sqlalchemy import select
        result = await db.execute(select(Panel).where(Panel.id == panel_id))
        panel = result.scalar_one_or_none()
        
        if not panel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Panel not found"
            )
        
        # Update panel location
        panel.location = location_data.get("location", panel.location)
        
        await db.commit()
        await db.refresh(panel)
        
        return {
            "success": True,
            "message": "Panel location updated successfully",
            "panel": {
                "id": panel.id,
                "container_id": panel.container_id,
                "rfid_tag": panel.rfid_tag,
                "location": panel.location,
                "utilization_pct": panel.utilization_pct,
                "provisioned_at": panel.provisioned_at,
                "status": panel.status,
                "capacity": panel.capacity,
                "panel_type": panel.panel_type
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating panel location {panel_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update panel location"
        ) from e