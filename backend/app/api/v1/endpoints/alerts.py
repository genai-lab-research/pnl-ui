from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.enums import AlertSeverity, AlertRelatedObjectType
from app.schemas.alert import Alert, AlertCreate, AlertUpdate, AlertList

from app.models.models import Alert as AlertModel
from app.models.models import Container as ContainerModel

router = APIRouter()


@router.get("/", response_model=AlertList)
def list_alerts(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    container_id: Optional[str] = None,
    active: Optional[bool] = None,
    severity: Optional[AlertSeverity] = None,
    related_object_type: Optional[AlertRelatedObjectType] = None
) -> Any:
    """
    List alerts with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **container_id**: Filter by container ID
    - **active**: Filter by active status (true/false)
    - **severity**: Filter by severity level
    - **related_object_type**: Filter by related object type
    """
    query = db.query(AlertModel)
    
    # Apply filters
    if container_id:
        query = query.filter(AlertModel.container_id == container_id)
    if active is not None:
        query = query.filter(AlertModel.active == active)
    if severity:
        query = query.filter(AlertModel.severity == severity)
    if related_object_type:
        query = query.filter(AlertModel.related_object_type == related_object_type)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination and sort by most recent first
    alerts = query.order_by(AlertModel.created_at.desc()).offset(skip).limit(limit).all()
    
    return AlertList(total=total, results=alerts)


@router.post("/", response_model=Alert, status_code=status.HTTP_201_CREATED)
def create_alert(
    *,
    db: Session = Depends(get_db),
    alert_in: AlertCreate
) -> Any:
    """
    Create a new alert.
    
    - Requires a valid container ID
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == alert_in.container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Create new alert
    db_alert = AlertModel(
        container_id=alert_in.container_id,
        description=alert_in.description,
        severity=alert_in.severity,
        active=alert_in.active if alert_in.active is not None else True,
        related_object_type=alert_in.related_object_type,
        related_object_id=alert_in.related_object_id
    )
    
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    return db_alert


@router.get("/{alert_id}", response_model=Alert)
def get_alert(
    *,
    db: Session = Depends(get_db),
    alert_id: str
) -> Any:
    """
    Get alert details by ID.
    """
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    return alert


@router.put("/{alert_id}", response_model=Alert)
def update_alert(
    *,
    db: Session = Depends(get_db),
    alert_id: str,
    alert_in: AlertUpdate
) -> Any:
    """
    Update an alert.
    
    - Commonly used to resolve alerts by setting active = false
    """
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    update_data = alert_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)
    
    db.commit()
    db.refresh(alert)
    
    return alert


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(
    *,
    db: Session = Depends(get_db),
    alert_id: str
) -> None:
    """
    Delete an alert.
    """
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    db.delete(alert)
    db.commit()
    


@router.post("/{alert_id}/resolve", response_model=Alert)
def resolve_alert(
    *,
    db: Session = Depends(get_db),
    alert_id: str
) -> Any:
    """
    Resolve an alert by setting active status to false.
    """
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    alert.active = False
    db.commit()
    db.refresh(alert)
    
    return alert
