from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.panel import Panel, PanelLocation
from app.models.crop import Crop, CropLocation
from app.core.pagination import PaginationParams, PaginationMeta, paginate_query


class PanelRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_panels_by_container(self, container_id: str) -> List[Panel]:
        return (
            self.db.query(Panel)
            .options(joinedload(Panel.location))
            .filter(Panel.container_id == container_id)
            .all()
        )
    
    def get_panels_by_container_paginated(
        self, container_id: str, pagination: PaginationParams
    ) -> Tuple[List[Panel], PaginationMeta]:
        """Get panels by container with pagination."""
        query = (
            self.db.query(Panel)
            .options(joinedload(Panel.location))
            .filter(Panel.container_id == container_id)
        )
        return paginate_query(query, pagination)
    
    def get_all_panels(self, skip: int = 0, limit: int = 100) -> List[Panel]:
        """Get all panels with offset/limit pagination."""
        return (
            self.db.query(Panel)
            .options(joinedload(Panel.location))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_all_panels_paginated(self, pagination: PaginationParams) -> Tuple[List[Panel], PaginationMeta]:
        """Get all panels with pagination metadata."""
        query = self.db.query(Panel).options(joinedload(Panel.location))
        return paginate_query(query, pagination)

    def get_panels_by_wall(self, container_id: str, wall: str) -> List[Panel]:
        return (
            self.db.query(Panel)
            .join(PanelLocation)
            .options(joinedload(Panel.location))
            .filter(Panel.container_id == container_id)
            .filter(PanelLocation.wall == wall)
            .all()
        )

    def get_off_wall_panels(self, container_id: str) -> List[Panel]:
        return (
            self.db.query(Panel)
            .outerjoin(PanelLocation)
            .options(joinedload(Panel.location))
            .filter(Panel.container_id == container_id)
            .filter(PanelLocation.id.is_(None))
            .all()
        )

    def get_panel_by_id(self, panel_id: str) -> Optional[Panel]:
        return (
            self.db.query(Panel)
            .options(joinedload(Panel.location))
            .filter(Panel.id == panel_id)
            .first()
        )

    def create_panel(
        self, panel_id: str, rfid_tag: str, container_id: str, wall: str, slot_number: int
    ) -> Panel:
        panel = Panel(
            id=panel_id,
            rfid_tag=rfid_tag,
            container_id=container_id,
        )
        
        location = PanelLocation(
            wall=wall,
            slot_number=slot_number,
        )
        
        self.db.add(panel)
        self.db.flush()
        
        location.panel_id = panel.id
        self.db.add(location)
        self.db.flush()
        
        return panel

    def delete_panel(self, panel_id: str) -> bool:
        panel = self.db.query(Panel).filter(Panel.id == panel_id).first()
        if panel:
            self.db.delete(panel)
            self.db.flush()
            return True
        return False