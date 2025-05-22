from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.enums import ShelfPosition, WallPosition, InventoryStatus
from app.schemas.inventory import (
    Tray, TrayCreate, TrayUpdate, TrayList,
    Panel, PanelCreate, PanelUpdate, PanelList
)

from app.models.models import Tray as TrayModel
from app.models.models import Panel as PanelModel
from app.models.models import Container as ContainerModel

router = APIRouter()

# --------------------- TRAY ENDPOINTS ---------------------

@router.get("/trays", response_model=TrayList)
def list_trays(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    container_id: Optional[str] = None,
    shelf: Optional[ShelfPosition] = None,
    status: Optional[InventoryStatus] = None
) -> Any:
    """
    List trays with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **container_id**: Filter by container ID
    - **shelf**: Filter by shelf position (Upper or Lower)
    - **status**: Filter by inventory status
    """
    query = db.query(TrayModel)
    
    # Apply filters
    if container_id:
        query = query.filter(TrayModel.container_id == container_id)
    if shelf:
        query = query.filter(TrayModel.shelf == shelf)
    if status:
        query = query.filter(TrayModel.status == status)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    trays = query.offset(skip).limit(limit).all()
    
    return TrayList(total=total, results=trays)


@router.post("/trays", response_model=Tray, status_code=status.HTTP_201_CREATED)
def create_tray(
    *,
    db: Session = Depends(get_db),
    tray_in: TrayCreate
) -> Any:
    """
    Create a new tray.
    
    - Requires a valid container ID
    - RFID tag must be unique
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == tray_in.container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Check if RFID tag is already in use
    tray_exists = db.query(TrayModel).filter(TrayModel.rfid_tag == tray_in.rfid_tag).first()
    if tray_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tray with this RFID tag already exists"
        )
    
    # Create new tray
    db_tray = TrayModel(
        container_id=tray_in.container_id,
        rfid_tag=tray_in.rfid_tag,
        shelf=tray_in.shelf,
        slot_number=tray_in.slot_number,
        status=tray_in.status or InventoryStatus.AVAILABLE,
        capacity=tray_in.capacity,
        tray_type=tray_in.tray_type
    )
    
    db.add(db_tray)
    db.commit()
    db.refresh(db_tray)
    
    return db_tray


@router.get("/trays/{tray_id}", response_model=Tray)
def get_tray(
    *,
    db: Session = Depends(get_db),
    tray_id: str
) -> Any:
    """
    Get tray details by ID.
    """
    tray = db.query(TrayModel).filter(TrayModel.id == tray_id).first()
    if not tray:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tray not found"
        )
    return tray


@router.put("/trays/{tray_id}", response_model=Tray)
def update_tray(
    *,
    db: Session = Depends(get_db),
    tray_id: str,
    tray_in: TrayUpdate
) -> Any:
    """
    Update a tray.
    
    - RFID tag must be unique if changed
    """
    tray = db.query(TrayModel).filter(TrayModel.id == tray_id).first()
    if not tray:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tray not found"
        )
    
    # Check if RFID tag is being changed and if the new tag is already in use
    if tray_in.rfid_tag and tray_in.rfid_tag != tray.rfid_tag:
        tray_with_tag = db.query(TrayModel).filter(TrayModel.rfid_tag == tray_in.rfid_tag).first()
        if tray_with_tag:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tray with this RFID tag already exists"
            )
    
    update_data = tray_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tray, field, value)
    
    db.commit()
    db.refresh(tray)
    
    return tray


@router.delete("/trays/{tray_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tray(
    *,
    db: Session = Depends(get_db),
    tray_id: str
) -> None:
    """
    Delete a tray.
    
    - This will fail if there are crops associated with the tray
    """
    tray = db.query(TrayModel).filter(TrayModel.id == tray_id).first()
    if not tray:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tray not found"
        )
    
    # Check if the tray has associated crops
    if tray.crops:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete tray with associated crops"
        )
    
    db.delete(tray)
    db.commit()
    


# --------------------- PANEL ENDPOINTS ---------------------

@router.get("/panels", response_model=PanelList)
def list_panels(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    container_id: Optional[str] = None,
    wall: Optional[WallPosition] = None,
    status: Optional[InventoryStatus] = None
) -> Any:
    """
    List panels with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **container_id**: Filter by container ID
    - **wall**: Filter by wall position (Wall 1, Wall 2, Wall 3, Wall 4)
    - **status**: Filter by inventory status
    """
    query = db.query(PanelModel)
    
    # Apply filters
    if container_id:
        query = query.filter(PanelModel.container_id == container_id)
    if wall:
        query = query.filter(PanelModel.wall == wall)
    if status:
        query = query.filter(PanelModel.status == status)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    panels = query.offset(skip).limit(limit).all()
    
    return PanelList(total=total, results=panels)


@router.post("/panels", response_model=Panel, status_code=status.HTTP_201_CREATED)
def create_panel(
    *,
    db: Session = Depends(get_db),
    panel_in: PanelCreate
) -> Any:
    """
    Create a new panel.
    
    - Requires a valid container ID
    - RFID tag must be unique
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == panel_in.container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Check if RFID tag is already in use
    panel_exists = db.query(PanelModel).filter(PanelModel.rfid_tag == panel_in.rfid_tag).first()
    if panel_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Panel with this RFID tag already exists"
        )
    
    # Create new panel
    db_panel = PanelModel(
        container_id=panel_in.container_id,
        rfid_tag=panel_in.rfid_tag,
        wall=panel_in.wall,
        slot_number=panel_in.slot_number,
        status=panel_in.status or InventoryStatus.AVAILABLE,
        capacity=panel_in.capacity,
        panel_type=panel_in.panel_type
    )
    
    db.add(db_panel)
    db.commit()
    db.refresh(db_panel)
    
    return db_panel


@router.get("/panels/{panel_id}", response_model=Panel)
def get_panel(
    *,
    db: Session = Depends(get_db),
    panel_id: str
) -> Any:
    """
    Get panel details by ID.
    """
    panel = db.query(PanelModel).filter(PanelModel.id == panel_id).first()
    if not panel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Panel not found"
        )
    return panel


@router.put("/panels/{panel_id}", response_model=Panel)
def update_panel(
    *,
    db: Session = Depends(get_db),
    panel_id: str,
    panel_in: PanelUpdate
) -> Any:
    """
    Update a panel.
    
    - RFID tag must be unique if changed
    """
    panel = db.query(PanelModel).filter(PanelModel.id == panel_id).first()
    if not panel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Panel not found"
        )
    
    # Check if RFID tag is being changed and if the new tag is already in use
    if panel_in.rfid_tag and panel_in.rfid_tag != panel.rfid_tag:
        panel_with_tag = db.query(PanelModel).filter(PanelModel.rfid_tag == panel_in.rfid_tag).first()
        if panel_with_tag:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Panel with this RFID tag already exists"
            )
    
    update_data = panel_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(panel, field, value)
    
    db.commit()
    db.refresh(panel)
    
    return panel


@router.delete("/panels/{panel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_panel(
    *,
    db: Session = Depends(get_db),
    panel_id: str
) -> None:
    """
    Delete a panel.
    
    - This will fail if there are crops associated with the panel
    """
    panel = db.query(PanelModel).filter(PanelModel.id == panel_id).first()
    if not panel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Panel not found"
        )
    
    # Check if the panel has associated crops
    if panel.crops:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete panel with associated crops"
        )
    
    db.delete(panel)
    db.commit()
    
