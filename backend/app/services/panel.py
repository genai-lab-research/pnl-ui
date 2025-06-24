from typing import Optional
from datetime import date
from sqlalchemy.orm import Session

from app.repositories.panel import PanelRepository
from app.repositories.crop import CropRepository
from app.schemas.panel import PanelResponse, CultivationAreaResponse


class PanelService:
    def __init__(self, db: Session):
        self.db = db
        self.panel_repo = PanelRepository(db)
        self.crop_repo = CropRepository(db)

    def get_cultivation_area(
        self, container_id: str, date_filter: Optional[date] = None
    ) -> CultivationAreaResponse:
        wall_1_panels = self.panel_repo.get_panels_by_wall(container_id, "wall_1")
        wall_2_panels = self.panel_repo.get_panels_by_wall(container_id, "wall_2")
        wall_3_panels = self.panel_repo.get_panels_by_wall(container_id, "wall_3")
        wall_4_panels = self.panel_repo.get_panels_by_wall(container_id, "wall_4")
        off_wall_panels = self.panel_repo.get_off_wall_panels(container_id)

        all_panels = (
            wall_1_panels + wall_2_panels + wall_3_panels +
            wall_4_panels + off_wall_panels
        )
        total_utilization = (
            sum(panel.utilization_percentage for panel in all_panels) // len(all_panels)
            if all_panels
            else 0
        )

        def convert_panel(panel):
            location_data = None
            if panel.location:
                location_data = {
                    'wall': panel.location.wall,
                    'slot_number': panel.location.slot_number
                }
            return PanelResponse(
                id=panel.id,
                rfid_tag=panel.rfid_tag,
                utilization_percentage=panel.utilization_percentage,
                crop_count=panel.crop_count,
                is_empty=panel.is_empty,
                provisioned_at=panel.provisioned_at,
                location=location_data,
                crops=[]
            )

        return CultivationAreaResponse(
            utilization_percentage=total_utilization,
            wall_1=[convert_panel(panel) for panel in wall_1_panels],
            wall_2=[convert_panel(panel) for panel in wall_2_panels],
            wall_3=[convert_panel(panel) for panel in wall_3_panels],
            wall_4=[convert_panel(panel) for panel in wall_4_panels],
            off_wall_panels=[convert_panel(panel) for panel in off_wall_panels],
        )

    def get_panel_by_id(self, panel_id: str) -> Optional[PanelResponse]:
        panel = self.panel_repo.get_panel_by_id(panel_id)
        if panel:
            location_data = None
            if panel.location:
                location_data = {
                    'wall': panel.location.wall,
                    'slot_number': panel.location.slot_number
                }

            return PanelResponse(
                id=panel.id,
                rfid_tag=panel.rfid_tag,
                utilization_percentage=panel.utilization_percentage,
                crop_count=panel.crop_count,
                is_empty=panel.is_empty,
                provisioned_at=panel.provisioned_at,
                location=location_data,
                crops=[]
            )
        return None

    def create_panel(
        self,
        container_id: str,
        panel_id: str,
        rfid_tag: str,
        wall: str,
        slot_number: int,
    ) -> PanelResponse:
        panel = self.panel_repo.create_panel(
            panel_id, rfid_tag, container_id, wall, slot_number
        )

        location_data = None
        if panel.location:
            location_data = {
                'wall': panel.location.wall,
                'slot_number': panel.location.slot_number
            }

        return PanelResponse(
            id=panel.id,
            rfid_tag=panel.rfid_tag,
            utilization_percentage=panel.utilization_percentage,
            crop_count=panel.crop_count,
            is_empty=panel.is_empty,
            provisioned_at=panel.provisioned_at,
            location=location_data,
            crops=[]
        )

    def delete_panel(self, panel_id: str) -> bool:
        return self.panel_repo.delete_panel(panel_id)
