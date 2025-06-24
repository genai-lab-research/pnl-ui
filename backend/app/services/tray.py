from typing import Optional
from datetime import date
from sqlalchemy.orm import Session

from app.repositories.tray import TrayRepository
from app.repositories.crop import CropRepository
from app.schemas.tray import TrayCreate, TrayResponse, NurseryStationResponse


class TrayService:
    def __init__(self, db: Session):
        self.db = db
        self.tray_repo = TrayRepository(db)
        self.crop_repo = CropRepository(db)

    def get_nursery_station(
        self, container_id: str, date_filter: Optional[date] = None
    ) -> NurseryStationResponse:
        upper_shelf_trays = self.tray_repo.get_trays_by_shelf(container_id, "upper")
        lower_shelf_trays = self.tray_repo.get_trays_by_shelf(container_id, "lower")
        off_shelf_trays = self.tray_repo.get_off_shelf_trays(container_id)

        all_trays = upper_shelf_trays + lower_shelf_trays + off_shelf_trays
        total_utilization = (
            sum(tray.utilization_percentage for tray in all_trays) // len(all_trays)
            if all_trays
            else 0
        )

        def convert_tray(tray):
            location_data = None
            if tray.location:
                location_data = {
                    'shelf': tray.location.shelf,
                    'slot_number': tray.location.slot_number
                }
            return TrayResponse(
                id=tray.id,
                rfid_tag=tray.rfid_tag,
                utilization_percentage=tray.utilization_percentage,
                crop_count=tray.crop_count,
                is_empty=tray.is_empty,
                provisioned_at=tray.provisioned_at,
                location=location_data,
                crops=[]
            )

        return NurseryStationResponse(
            utilization_percentage=total_utilization,
            upper_shelf=[convert_tray(tray) for tray in upper_shelf_trays],
            lower_shelf=[convert_tray(tray) for tray in lower_shelf_trays],
            off_shelf_trays=[convert_tray(tray) for tray in off_shelf_trays],
        )

    def create_tray(self, container_id: str, tray_data: TrayCreate) -> TrayResponse:
        tray = self.tray_repo.create_tray(tray_data, container_id)

        # Manually construct the response to handle relationships
        location_data = None
        if tray.location:
            location_data = {
                'shelf': tray.location.shelf,
                'slot_number': tray.location.slot_number
            }

        return TrayResponse(
            id=tray.id,
            rfid_tag=tray.rfid_tag,
            utilization_percentage=tray.utilization_percentage,
            crop_count=tray.crop_count,
            is_empty=tray.is_empty,
            provisioned_at=tray.provisioned_at,
            location=location_data,
            crops=[]
        )

    def get_tray_by_id(self, tray_id: str) -> Optional[TrayResponse]:
        tray = self.tray_repo.get_tray_by_id(tray_id)
        if tray:
            location_data = None
            if tray.location:
                location_data = {
                    'shelf': tray.location.shelf,
                    'slot_number': tray.location.slot_number
                }

            return TrayResponse(
                id=tray.id,
                rfid_tag=tray.rfid_tag,
                utilization_percentage=tray.utilization_percentage,
                crop_count=tray.crop_count,
                is_empty=tray.is_empty,
                provisioned_at=tray.provisioned_at,
                location=location_data,
                crops=[]
            )
        return None

    def delete_tray(self, tray_id: str) -> bool:
        return self.tray_repo.delete_tray(tray_id)
