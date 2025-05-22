from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.enums import DeviceStatus
from app.schemas.device import Device, DeviceCreate, DeviceUpdate, DeviceList, DeviceStats

from app.models.models import Device as DeviceModel
from app.models.models import Container as ContainerModel
from sqlalchemy import func

router = APIRouter()


@router.get("/", response_model=DeviceList)
def list_devices(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    container_id: Optional[str] = None,
    status: Optional[DeviceStatus] = None,
    name: Optional[str] = None
) -> Any:
    """
    List devices with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **container_id**: Filter by container ID
    - **status**: Filter by device status
    - **name**: Filter by device name (partial match)
    """
    query = db.query(DeviceModel)
    
    # Apply filters
    if container_id:
        query = query.filter(DeviceModel.container_id == container_id)
    if status:
        query = query.filter(DeviceModel.status == status)
    if name:
        query = query.filter(DeviceModel.name.ilike(f"%{name}%"))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    devices = query.offset(skip).limit(limit).all()
    
    return DeviceList(total=total, results=devices)


@router.post("/", response_model=Device, status_code=status.HTTP_201_CREATED)
def create_device(
    *,
    db: Session = Depends(get_db),
    device_in: DeviceCreate
) -> Any:
    """
    Create a new device.
    
    - Requires a valid container ID
    - Serial number + model must be unique together
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == device_in.container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Check if device with same serial number and model already exists
    device_exists = db.query(DeviceModel).filter(
        DeviceModel.serial_number == device_in.serial_number,
        DeviceModel.model == device_in.model
    ).first()
    
    if device_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Device with this serial number and model already exists"
        )
    
    # Create new device
    db_device = DeviceModel(
        container_id=device_in.container_id,
        name=device_in.name,
        model=device_in.model,
        serial_number=device_in.serial_number,
        firmware_version=device_in.firmware_version,
        port=device_in.port,
        status=device_in.status or DeviceStatus.OFFLINE
    )
    
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    
    return db_device


@router.get("/stats/{container_id}", response_model=DeviceStats)
def get_device_stats(
    *,
    db: Session = Depends(get_db),
    container_id: str
) -> Any:
    """
    Get device statistics for a specific container.
    
    Returns counts by status (Running, Idle, Issue, Offline).
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Get counts by status
    running_count = db.query(func.count(DeviceModel.id)).filter(
        DeviceModel.container_id == container_id,
        DeviceModel.status == DeviceStatus.RUNNING
    ).scalar()
    
    idle_count = db.query(func.count(DeviceModel.id)).filter(
        DeviceModel.container_id == container_id,
        DeviceModel.status == DeviceStatus.IDLE
    ).scalar()
    
    issue_count = db.query(func.count(DeviceModel.id)).filter(
        DeviceModel.container_id == container_id,
        DeviceModel.status == DeviceStatus.ISSUE
    ).scalar()
    
    offline_count = db.query(func.count(DeviceModel.id)).filter(
        DeviceModel.container_id == container_id,
        DeviceModel.status == DeviceStatus.OFFLINE
    ).scalar()
    
    return DeviceStats(
        running_count=running_count,
        idle_count=idle_count,
        issue_count=issue_count,
        offline_count=offline_count
    )


@router.get("/{device_id}", response_model=Device)
def get_device(
    *,
    db: Session = Depends(get_db),
    device_id: str
) -> Any:
    """
    Get device details by ID.
    """
    device = db.query(DeviceModel).filter(DeviceModel.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    return device


@router.put("/{device_id}", response_model=Device)
def update_device(
    *,
    db: Session = Depends(get_db),
    device_id: str,
    device_in: DeviceUpdate
) -> Any:
    """
    Update a device.
    
    - Serial number + model combination must be unique if changed
    """
    device = db.query(DeviceModel).filter(DeviceModel.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    # Check if serial number or model is being changed
    update_data = device_in.dict(exclude_unset=True)
    new_serial = update_data.get("serial_number", device.serial_number)
    new_model = update_data.get("model", device.model)
    
    # Check for uniqueness if either is being changed
    if new_serial != device.serial_number or new_model != device.model:
        device_with_same_data = db.query(DeviceModel).filter(
            DeviceModel.serial_number == new_serial,
            DeviceModel.model == new_model,
            DeviceModel.id != device_id
        ).first()
        
        if device_with_same_data:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Device with this serial number and model already exists"
            )
    
    # Update device
    for field, value in update_data.items():
        setattr(device, field, value)
    
    db.commit()
    db.refresh(device)
    
    return device


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device(
    *,
    db: Session = Depends(get_db),
    device_id: str
) -> None:
    """
    Delete a device.
    """
    device = db.query(DeviceModel).filter(DeviceModel.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found"
        )
    
    db.delete(device)
    db.commit()
    
    
