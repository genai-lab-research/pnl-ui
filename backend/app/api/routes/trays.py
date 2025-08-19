"""Tray API routes for the Vertical Farm Management System."""

import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.models import Tray
from app.schemas.tray import (
    TrayResponse, TrayProvisionRequest, TrayProvisionResponse,
    BulkTrayProvisionRequest, BulkTrayProvisionResponse, PrintLabelResponse
)
from app.services.tray import TrayService
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/trays", tags=["trays"])


@router.get("/", response_model=List[TrayResponse])
async def get_trays(
    container_id: Optional[int] = Query(None, description="Filter by container ID"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by tray status"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve list of trays with optional filters."""
    from sqlalchemy import select
    
    try:
        query = select(Tray)
        
        if container_id is not None:
            query = query.where(Tray.container_id == container_id)
        if status_filter is not None:
            query = query.where(Tray.status == status_filter)
            
        result = await db.execute(query)
        trays = result.scalars().all()
        
        return [
            TrayResponse(
                id=tray.id,
                container_id=tray.container_id,
                rfid_tag=tray.rfid_tag,
                location=tray.location,
                utilization_pct=tray.utilization_pct,
                provisioned_at=tray.provisioned_at,
                status=tray.status,
                capacity=tray.capacity,
                tray_type=tray.tray_type
            ) for tray in trays
        ]
    except Exception as e:
        logger.error(f"Error retrieving trays: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trays"
        ) from e


@router.post("/provision", response_model=TrayProvisionResponse)
async def provision_new_tray(
    request: TrayProvisionRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create and provision a new tray with RFID tag assignment."""
    try:
        tray_service = TrayService(db)
        provision_result = await tray_service.provision_tray(request)
        return provision_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error provisioning tray: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to provision tray"
        ) from e


@router.get("/{tray_id}/print-label", response_model=PrintLabelResponse)
async def print_tray_label(
    tray_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Generate a printable label for the provisioned tray."""
    try:
        tray_service = TrayService(db)
        label_result = await tray_service.generate_print_label(tray_id)
        return label_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating tray label for tray {tray_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate tray label"
        ) from e


@router.post("/bulk-provision", response_model=BulkTrayProvisionResponse)
async def bulk_provision_trays(
    request: BulkTrayProvisionRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Provision multiple trays in a single operation."""
    try:
        tray_service = TrayService(db)
        bulk_result = await tray_service.bulk_provision_trays(request)
        return bulk_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error bulk provisioning trays: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to bulk provision trays"
        ) from e