from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.database import get_db
from app.models.enums import CropLifecycleStatus, CropHealthCheck, CropLocationType
from app.schemas.crop import (
    Crop, CropCreate, CropUpdate, CropList, 
    CropHistoryEntry, CropHistoryCreate,
    SeedType, SeedTypeCreate, SeedTypeUpdate, SeedTypeList
)

from app.models.models import (
    Crop as CropModel,
    CropHistoryEntry as CropHistoryEntryModel,
    SeedType as SeedTypeModel,
    Tray as TrayModel,
    Panel as PanelModel
)

router = APIRouter()


# --------------------- SEED TYPE ENDPOINTS ---------------------

@router.get("/seed-types", response_model=SeedTypeList)
def list_seed_types(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None
) -> Any:
    """
    List seed types with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **name**: Filter by name (partial match)
    """
    query = db.query(SeedTypeModel)
    
    # Apply filters
    if name:
        query = query.filter(SeedTypeModel.name.ilike(f"%{name}%"))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    seed_types = query.offset(skip).limit(limit).all()
    
    return SeedTypeList(total=total, results=seed_types)


@router.post("/seed-types", response_model=SeedType, status_code=status.HTTP_201_CREATED)
def create_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_in: SeedTypeCreate
) -> Any:
    """
    Create a new seed type.
    """
    # Create new seed type
    db_seed_type = SeedTypeModel(
        name=seed_type_in.name,
        variety=seed_type_in.variety,
        supplier=seed_type_in.supplier,
        batch_id=seed_type_in.batch_id
    )
    
    db.add(db_seed_type)
    db.commit()
    db.refresh(db_seed_type)
    
    return db_seed_type


@router.get("/seed-types/{seed_type_id}", response_model=SeedType)
def get_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_id: str
) -> Any:
    """
    Get seed type details by ID.
    """
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    return seed_type


@router.put("/seed-types/{seed_type_id}", response_model=SeedType)
def update_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_id: str,
    seed_type_in: SeedTypeUpdate
) -> Any:
    """
    Update a seed type.
    """
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    
    update_data = seed_type_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(seed_type, field, value)
    
    db.commit()
    db.refresh(seed_type)
    
    return seed_type


@router.delete("/seed-types/{seed_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_id: str
) -> None:
    """
    Delete a seed type.
    
    - This will fail if there are crops or containers using this seed type
    """
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    
    # Check for associated crops
    if seed_type.crops:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete seed type with associated crops"
        )
    
    # Check for associated containers
    if seed_type.containers:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete seed type with associated containers"
        )
    
    db.delete(seed_type)
    db.commit()
    


# --------------------- CROP ENDPOINTS ---------------------

@router.get("/", response_model=CropList)
def list_crops(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    seed_type_id: Optional[str] = None,
    lifecycle_status: Optional[CropLifecycleStatus] = None,
    health_check: Optional[CropHealthCheck] = None,
    tray_id: Optional[str] = None,
    panel_id: Optional[str] = None
) -> Any:
    """
    List crops with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **seed_type_id**: Filter by seed type
    - **lifecycle_status**: Filter by lifecycle status
    - **health_check**: Filter by health check status
    - **tray_id**: Filter by tray ID
    - **panel_id**: Filter by panel ID
    """
    query = db.query(CropModel)
    
    # Apply filters
    if seed_type_id:
        query = query.filter(CropModel.seed_type_id == seed_type_id)
    if lifecycle_status:
        query = query.filter(CropModel.lifecycle_status == lifecycle_status)
    if health_check:
        query = query.filter(CropModel.health_check == health_check)
    if tray_id:
        query = query.filter(CropModel.tray_id == tray_id)
    if panel_id:
        query = query.filter(CropModel.panel_id == panel_id)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    crops = query.offset(skip).limit(limit).all()
    
    return CropList(total=total, results=crops)


@router.post("/", response_model=Crop, status_code=status.HTTP_201_CREATED)
def create_crop(
    *,
    db: Session = Depends(get_db),
    crop_in: CropCreate
) -> Any:
    """
    Create a new crop.
    
    - Requires a valid seed type ID
    - If location is provided, requires valid tray or panel ID
    """
    # Check if seed type exists
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == crop_in.seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    
    # Validate location if provided
    if crop_in.current_location_type == CropLocationType.TRAY_LOCATION and crop_in.tray_id:
        tray = db.query(TrayModel).filter(TrayModel.id == crop_in.tray_id).first()
        if not tray:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tray not found"
            )
    
    if crop_in.current_location_type == CropLocationType.PANEL_LOCATION and crop_in.panel_id:
        panel = db.query(PanelModel).filter(PanelModel.id == crop_in.panel_id).first()
        if not panel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Panel not found"
            )
    
    # Create new crop
    db_crop = CropModel(
        seed_type_id=crop_in.seed_type_id,
        seed_date=crop_in.seed_date or datetime.utcnow(),
        transplanting_date_planned=crop_in.transplanting_date_planned,
        harvesting_date_planned=crop_in.harvesting_date_planned,
        lifecycle_status=crop_in.lifecycle_status or CropLifecycleStatus.SEEDED,
        health_check=crop_in.health_check or CropHealthCheck.HEALTHY,
        current_location_type=crop_in.current_location_type,
        tray_id=crop_in.tray_id,
        panel_id=crop_in.panel_id,
        tray_row=crop_in.tray_row,
        tray_column=crop_in.tray_column,
        panel_channel=crop_in.panel_channel,
        panel_position=crop_in.panel_position,
        radius=crop_in.radius,
        width=crop_in.width,
        height=crop_in.height,
        area=crop_in.area,
        weight=crop_in.weight
    )
    
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    
    # Create initial history entry
    history_entry = CropHistoryEntryModel(
        crop_id=db_crop.id,
        event=f"Crop created with {db_crop.lifecycle_status.value} status",
        performed_by=crop_in.performed_by or "System",
        notes=crop_in.notes
    )
    
    db.add(history_entry)
    db.commit()
    
    return db_crop


@router.get("/{crop_id}", response_model=Crop)
def get_crop(
    *,
    db: Session = Depends(get_db),
    crop_id: str
) -> Any:
    """
    Get crop details by ID.
    """
    crop = db.query(CropModel).filter(CropModel.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    return crop


@router.put("/{crop_id}", response_model=Crop)
def update_crop(
    *,
    db: Session = Depends(get_db),
    crop_id: str,
    crop_in: CropUpdate
) -> Any:
    """
    Update a crop.
    
    - If location type is changed, appropriate location ID must be provided
    - Records changes in crop history
    """
    crop = db.query(CropModel).filter(CropModel.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    update_data = crop_in.dict(exclude_unset=True)
    
    # Track lifecycle status changes for history
    old_lifecycle = crop.lifecycle_status
    old_health = crop.health_check
    old_location_type = crop.current_location_type
    old_tray_id = crop.tray_id
    old_panel_id = crop.panel_id
    
    # Validate location changes
    new_location_type = update_data.get("current_location_type", old_location_type)
    new_tray_id = update_data.get("tray_id", old_tray_id)
    new_panel_id = update_data.get("panel_id", old_panel_id)
    
    # Check tray exists if being set
    if new_location_type == CropLocationType.TRAY_LOCATION and new_tray_id and new_tray_id != old_tray_id:
        tray = db.query(TrayModel).filter(TrayModel.id == new_tray_id).first()
        if not tray:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tray not found"
            )
    
    # Check panel exists if being set
    if new_location_type == CropLocationType.PANEL_LOCATION and new_panel_id and new_panel_id != old_panel_id:
        panel = db.query(PanelModel).filter(PanelModel.id == new_panel_id).first()
        if not panel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Panel not found"
            )
    
    # Update the crop fields
    for field, value in update_data.items():
        setattr(crop, field, value)
    
    # Special case handling for lifecycle transitions
    new_lifecycle = update_data.get("lifecycle_status", old_lifecycle)
    if new_lifecycle != old_lifecycle:
        # If transitioning to transplanted, record the date
        if new_lifecycle == CropLifecycleStatus.TRANSPLANTED and not crop.transplanted_date:
            crop.transplanted_date = datetime.utcnow()
        
        # If transitioning to harvested, record the date
        if new_lifecycle == CropLifecycleStatus.HARVESTED and not crop.harvesting_date:
            crop.harvesting_date = datetime.utcnow()
    
    db.commit()
    db.refresh(crop)
    
    # Record history for significant changes
    events = []
    
    # Lifecycle status change
    if new_lifecycle != old_lifecycle:
        events.append(f"Lifecycle status changed from {old_lifecycle.value} to {new_lifecycle.value}")
    
    # Health check change
    new_health = update_data.get("health_check", old_health)
    if new_health != old_health:
        events.append(f"Health status changed from {old_health.value} to {new_health.value}")
    
    # Location change
    if (new_location_type != old_location_type or 
        new_tray_id != old_tray_id or 
        new_panel_id != old_panel_id):
        events.append("Location changed")
    
    # Add history entries for significant changes
    performed_by = crop_in.performed_by or "System"
    for event in events:
        history_entry = CropHistoryEntryModel(
            crop_id=crop.id,
            event=event,
            performed_by=performed_by,
            notes=crop_in.notes
        )
        db.add(history_entry)
    
    if events:
        db.commit()
    
    return crop


@router.delete("/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_crop(
    *,
    db: Session = Depends(get_db),
    crop_id: str
) -> None:
    """
    Delete a crop and its history.
    """
    crop = db.query(CropModel).filter(CropModel.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    # Delete associated history entries first to avoid foreign key constraints
    db.query(CropHistoryEntryModel).filter(CropHistoryEntryModel.crop_id == crop_id).delete()
    
    # Now delete the crop
    db.delete(crop)
    db.commit()
    


@router.post("/{crop_id}/history", response_model=CropHistoryEntry)
def add_crop_history(
    *,
    db: Session = Depends(get_db),
    crop_id: str,
    history_in: CropHistoryCreate
) -> Any:
    """
    Add a new history entry for a crop.
    """
    # Check if crop exists
    crop = db.query(CropModel).filter(CropModel.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    # Create history entry
    db_history = CropHistoryEntryModel(
        crop_id=crop_id,
        event=history_in.event,
        performed_by=history_in.performed_by,
        notes=history_in.notes,
        timestamp=history_in.timestamp or datetime.utcnow()
    )
    
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    
    return db_history


@router.get("/{crop_id}/history", response_model=List[CropHistoryEntry])
def get_crop_history(
    *,
    db: Session = Depends(get_db),
    crop_id: str
) -> Any:
    """
    Get the complete history of a crop.
    """
    # Check if crop exists
    crop = db.query(CropModel).filter(CropModel.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    # Get history entries
    history = db.query(CropHistoryEntryModel).filter(
        CropHistoryEntryModel.crop_id == crop_id
    ).order_by(CropHistoryEntryModel.timestamp.desc()).all()
    
    return history
