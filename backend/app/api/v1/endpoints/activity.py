from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database.database import get_db
from app.models.enums import ActorType
from app.schemas.activity import ActivityLog, ActivityLogCreate, ActivityLogList

from app.models.models import ActivityLog as ActivityLogModel
from app.models.models import Container as ContainerModel

router = APIRouter()


@router.get("/logs/{container_id}", response_model=ActivityLogList)
def list_activity_logs(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    skip: int = 0,
    limit: int = 50,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    action_type: Optional[str] = None,
    actor_type: Optional[ActorType] = None
) -> Any:
    """
    List activity logs for a specific container with optional filtering.
    
    - **skip**: Number of records to skip for pagination
    - **limit**: Maximum number of records to return
    - **start_date**: Filter logs after this date
    - **end_date**: Filter logs before this date
    - **action_type**: Filter by action type
    - **actor_type**: Filter by actor type (User or System)
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    query = db.query(ActivityLogModel).filter(ActivityLogModel.container_id == container_id)
    
    # Apply filters
    if start_date:
        query = query.filter(ActivityLogModel.timestamp >= start_date)
    if end_date:
        query = query.filter(ActivityLogModel.timestamp <= end_date)
    if action_type:
        query = query.filter(ActivityLogModel.action_type == action_type)
    if actor_type:
        query = query.filter(ActivityLogModel.actor_type == actor_type)
    
    # Get total count before pagination
    total = query.count()
    
    # Order by timestamp descending (most recent first) and apply pagination
    logs = query.order_by(ActivityLogModel.timestamp.desc()).offset(skip).limit(limit).all()
    
    return ActivityLogList(total=total, results=logs)


@router.post("/logs", response_model=ActivityLog, status_code=status.HTTP_201_CREATED)
def create_activity_log(
    *,
    db: Session = Depends(get_db),
    log_in: ActivityLogCreate
) -> Any:
    """
    Create a new activity log entry.
    
    - Requires a valid container ID
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == log_in.container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Create new activity log
    db_log = ActivityLogModel(
        container_id=log_in.container_id,
        action_type=log_in.action_type,
        actor_type=log_in.actor_type,
        actor_id=log_in.actor_id,
        description=log_in.description,
        timestamp=log_in.timestamp or datetime.utcnow()
    )
    
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    
    return db_log


@router.get("/logs/{container_id}/recent", response_model=List[ActivityLog])
def get_recent_activity_logs(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    days: Optional[int] = 7,
    limit: int = 20
) -> Any:
    """
    Get recent activity logs for a specific container.
    
    - **days**: Number of days back to look for activity
    - **limit**: Maximum number of logs to return
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Calculate start date based on days parameter
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Query recent logs
    logs = db.query(ActivityLogModel).filter(
        ActivityLogModel.container_id == container_id,
        ActivityLogModel.timestamp >= start_date
    ).order_by(ActivityLogModel.timestamp.desc()).limit(limit).all()
    
    return logs
