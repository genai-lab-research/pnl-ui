from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.tray import Tray, TrayLocation
from app.models.crop import Crop, CropLocation
from app.schemas.tray import TrayCreate
from app.core.pagination import PaginationParams, PaginationMeta, paginate_query


class TrayRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_trays_by_container(self, container_id: str) -> List[Tray]:
        return (
            self.db.query(Tray)
            .options(joinedload(Tray.location))
            .filter(Tray.container_id == container_id)
            .all()
        )
    
    def get_trays_by_container_paginated(
        self, container_id: str, pagination: PaginationParams
    ) -> Tuple[List[Tray], PaginationMeta]:
        """Get trays by container with pagination."""
        query = (
            self.db.query(Tray)
            .options(joinedload(Tray.location))
            .filter(Tray.container_id == container_id)
        )
        return paginate_query(query, pagination)
    
    def get_all_trays(self, skip: int = 0, limit: int = 100) -> List[Tray]:
        """Get all trays with offset/limit pagination."""
        return (
            self.db.query(Tray)
            .options(joinedload(Tray.location))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_all_trays_paginated(self, pagination: PaginationParams) -> Tuple[List[Tray], PaginationMeta]:
        """Get all trays with pagination metadata."""
        query = self.db.query(Tray).options(joinedload(Tray.location))
        return paginate_query(query, pagination)

    def get_trays_by_shelf(self, container_id: str, shelf: str) -> List[Tray]:
        return (
            self.db.query(Tray)
            .join(TrayLocation)
            .options(joinedload(Tray.location))
            .filter(Tray.container_id == container_id)
            .filter(TrayLocation.shelf == shelf)
            .all()
        )

    def get_off_shelf_trays(self, container_id: str) -> List[Tray]:
        return (
            self.db.query(Tray)
            .outerjoin(TrayLocation)
            .options(joinedload(Tray.location))
            .filter(Tray.container_id == container_id)
            .filter(TrayLocation.id.is_(None))
            .all()
        )

    def create_tray(self, tray_data: TrayCreate, container_id: str) -> Tray:
        tray = Tray(
            id=f"tray_{tray_data.rfid_tag}",
            rfid_tag=tray_data.rfid_tag,
            container_id=container_id,
        )
        
        location = TrayLocation(
            shelf=tray_data.shelf,
            slot_number=tray_data.slot_number,
        )
        
        self.db.add(tray)
        self.db.flush()
        
        location.tray_id = tray.id
        self.db.add(location)
        self.db.flush()
        
        return tray

    def get_tray_by_id(self, tray_id: str) -> Optional[Tray]:
        return (
            self.db.query(Tray)
            .options(joinedload(Tray.location))
            .filter(Tray.id == tray_id)
            .first()
        )

    def delete_tray(self, tray_id: str) -> bool:
        tray = self.db.query(Tray).filter(Tray.id == tray_id).first()
        if tray:
            self.db.delete(tray)
            self.db.flush()
            return True
        return False