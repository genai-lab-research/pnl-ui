"""Alert API routes for the Vertical Farm Management System."""

import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.models import Alert
from app.schemas.alert import AlertCreate, AlertResponse
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/", response_model=List[AlertResponse])
async def get_alerts(
    container_id: Optional[int] = Query(None, description="Filter by container ID"),
    active: Optional[bool] = Query(None, description="Filter by active status"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve list of alerts with optional filters."""
    from sqlalchemy import select
    
    try:
        query = select(Alert)
        
        if container_id is not None:
            query = query.where(Alert.container_id == container_id)
        if active is not None:
            query = query.where(Alert.active == active)
        if severity is not None:
            query = query.where(Alert.severity == severity)
            
        result = await db.execute(query)
        alerts = result.scalars().all()
        
        return [
            AlertResponse(
                id=alert.id,
                container_id=alert.container_id,
                description=alert.description,
                created_at=alert.created_at,
                severity=alert.severity,
                active=alert.active,
                related_object=alert.related_object
            ) for alert in alerts
        ]
    except Exception as e:
        logger.error(f"Error retrieving alerts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve alerts"
        )


@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_data: AlertCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create a new alert."""
    try:
        alert = Alert(
            container_id=alert_data.container_id,
            description=alert_data.description,
            severity=alert_data.severity,
            active=alert_data.active,
            related_object=alert_data.related_object
        )
        db.add(alert)
        await db.commit()
        await db.refresh(alert)
        
        return AlertResponse(
            id=alert.id,
            container_id=alert.container_id,
            description=alert.description,
            created_at=alert.created_at,
            severity=alert.severity,
            active=alert.active,
            related_object=alert.related_object
        )
    except Exception as e:
        logger.error(f"Error creating alert: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create alert"
        )