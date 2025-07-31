"""Metrics API routes for the Vertical Farm Management System."""

import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.models import MetricSnapshot, ActivityLog
from app.schemas.metrics import MetricSnapshotResponse, ActivityLogResponse
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/snapshots/", response_model=List[MetricSnapshotResponse])
async def get_metric_snapshots(
    container_id: Optional[int] = Query(None, description="Filter by container ID"),
    start_date: Optional[datetime] = Query(None, description="Filter from start date"),
    end_date: Optional[datetime] = Query(None, description="Filter to end date"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve metric snapshots for containers."""
    from sqlalchemy import select
    
    try:
        query = select(MetricSnapshot)
        
        if container_id is not None:
            query = query.where(MetricSnapshot.container_id == container_id)
        if start_date is not None:
            query = query.where(MetricSnapshot.timestamp >= start_date)
        if end_date is not None:
            query = query.where(MetricSnapshot.timestamp <= end_date)
            
        result = await db.execute(query)
        snapshots = result.scalars().all()
        
        return [
            MetricSnapshotResponse(
                id=snapshot.id,
                container_id=snapshot.container_id,
                timestamp=snapshot.timestamp,
                air_temperature=snapshot.air_temperature,
                humidity=snapshot.humidity,
                co2=snapshot.co2,
                yield_kg=snapshot.yield_kg,
                space_utilization_pct=snapshot.space_utilization_pct
            ) for snapshot in snapshots
        ]
    except Exception as e:
        logger.error(f"Error retrieving metric snapshots: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve metric snapshots"
        )


@router.get("/activity-logs/", response_model=List[ActivityLogResponse])
async def get_activity_logs(
    container_id: Optional[int] = Query(None, description="Filter by container ID"),
    action_type: Optional[str] = Query(None, description="Filter by action type"),
    actor_type: Optional[str] = Query(None, description="Filter by actor type"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve activity logs for containers."""
    from sqlalchemy import select
    
    try:
        query = select(ActivityLog)
        
        if container_id is not None:
            query = query.where(ActivityLog.container_id == container_id)
        if action_type is not None:
            query = query.where(ActivityLog.action_type == action_type)
        if actor_type is not None:
            query = query.where(ActivityLog.actor_type == actor_type)
            
        result = await db.execute(query)
        logs = result.scalars().all()
        
        return [
            ActivityLogResponse(
                id=log.id,
                container_id=log.container_id,
                timestamp=log.timestamp,
                action_type=log.action_type,
                actor_type=log.actor_type,
                actor_id=log.actor_id,
                description=log.description
            ) for log in logs
        ]
    except Exception as e:
        logger.error(f"Error retrieving activity logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve activity logs"
        )