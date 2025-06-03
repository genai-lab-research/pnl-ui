from datetime import datetime

from fastapi import HTTPException

from app.models import (
    CropHistory,
    CultivationAreaData,
    NurseryStationData,
    PanelDataCreate,
    PanelProvisionRequest,
    PanelProvisionResponse,
    PanelResponse,
    ShelfType,
    TrayDataCreate,
    TrayProvisionRequest,
    TrayProvisionResponse,
    TrayResponse,
    WallType,
)
from app.repositories.container_repository import ContainerRepository
from app.repositories.inventory_repository import InventoryRepository


class InventoryService:
    def __init__(self):
        self.inventory_repository = InventoryRepository()
        self.container_repository = ContainerRepository()

    def get_nursery_station_data(
        self, container_id: str, date: datetime | None = None
    ) -> NurseryStationData:
        """Get nursery station layout and tray data for a specific date."""
        # First check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        return self.inventory_repository.get_nursery_station_data(container_id, date)

    def get_cultivation_area_data(
        self, container_id: str, date: datetime | None = None
    ) -> CultivationAreaData:
        """Get cultivation area layout and panel data for a specific date."""
        # First check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        return self.inventory_repository.get_cultivation_area_data(container_id, date)

    def provision_tray(
        self, container_id: str, tray_data: TrayDataCreate
    ) -> TrayResponse:
        """Provision a new tray in the container."""
        # First check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        # Validate location data
        location = tray_data.location
        if not location:
            raise HTTPException(status_code=400, detail="Location is required")

        shelf = location.get("shelf")
        slot_number = location.get("slot_number")

        if shelf and shelf not in ["upper", "lower"]:
            raise HTTPException(
                status_code=400, detail="Shelf must be 'upper' or 'lower'"
            )

        if slot_number and (slot_number < 1 or slot_number > 8):
            raise HTTPException(
                status_code=400, detail="Slot number must be between 1 and 8"
            )

        # Provision the tray
        tray = self.inventory_repository.provision_tray(container_id, tray_data)

        return TrayResponse(
            id=tray.id,
            rfid_tag=tray.rfid_tag,
            location={
                "shelf": tray.shelf.value if tray.shelf else None,
                "slot_number": tray.slot_number,
            },
            provisioned_at=tray.created,
            status="available",
        )

    def provision_panel(
        self, container_id: str, panel_data: PanelDataCreate
    ) -> PanelResponse:
        """Provision a new panel in the container."""
        # First check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        # Validate location data
        location = panel_data.location
        if not location:
            raise HTTPException(status_code=400, detail="Location is required")

        wall = location.get("wall")
        slot_number = location.get("slot_number")

        if wall and wall not in ["wall_1", "wall_2", "wall_3", "wall_4"]:
            raise HTTPException(
                status_code=400,
                detail="Wall must be one of: wall_1, wall_2, wall_3, wall_4",
            )

        if slot_number and (slot_number < 1 or slot_number > 22):
            raise HTTPException(
                status_code=400, detail="Slot number must be between 1 and 22"
            )

        # Provision the panel
        panel = self.inventory_repository.provision_panel(container_id, panel_data)

        return PanelResponse(
            id=panel.id,
            rfid_tag=panel.rfid_tag,
            location={
                "wall": panel.wall.value if panel.wall else None,
                "slot_number": panel.slot_number,
            },
            provisioned_at=panel.created,
            status="available",
        )

    def get_crop_history(
        self,
        container_id: str,
        crop_id: str,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> CropHistory:
        """Get crop history for time-lapse view."""
        # First check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        return self.inventory_repository.get_crop_history(
            container_id, crop_id, start_date, end_date
        )

    def provision_tray_with_location(
        self, container_id: str, shelf: str, slot: int, tray_data: TrayProvisionRequest
    ) -> TrayProvisionResponse:
        """Provision a new tray with specific location and RFID tag."""
        # Check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        # Validate shelf type
        try:
            shelf_type = ShelfType(shelf.lower())
        except ValueError:
            raise ValueError(f"Invalid shelf type: {shelf}. Must be 'upper' or 'lower'")

        # Validate slot number
        if slot < 1 or slot > 8:
            raise ValueError("Slot number must be between 1 and 8")

        # Generate system ID
        import uuid
        tray_id = f"tray-{uuid.uuid4().hex[:8]}"

        # Create location display
        location_display = f"Shelf {shelf.title()}, Slot {slot}"

        # Create tray (this would normally interact with database)
        from datetime import datetime, timezone
        created_time = datetime.now(timezone.utc)

        return TrayProvisionResponse(
            id=tray_id,
            rfid_tag=tray_data.rfid_tag,
            container_id=container_id,
            shelf=shelf_type,
            slot_number=slot,
            location_display=location_display,
            notes=tray_data.notes,
            created=created_time,
            message=f"Tray {tray_id} successfully provisioned at {location_display}"
        )

    def provision_panel_with_location(
        self, container_id: str, wall: str, slot: int, panel_data: PanelProvisionRequest
    ) -> PanelProvisionResponse:
        """Provision a new panel with specific location and RFID tag."""
        # Check if container exists
        container = self.container_repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        # Validate wall type
        try:
            wall_type = WallType(wall.lower())
        except ValueError:
            raise ValueError(f"Invalid wall type: {wall}. Must be 'wall_1' or 'wall_2'")

        # Validate slot number
        if slot < 1 or slot > 22:
            raise ValueError("Slot number must be between 1 and 22")

        # Generate system ID
        import uuid
        panel_id = f"panel-{uuid.uuid4().hex[:8]}"

        # Create location display
        wall_display = wall.replace('_', ' ').title()
        location_display = f"{wall_display}, Slot {slot}"

        # Create panel (this would normally interact with database)
        from datetime import datetime, timezone
        created_time = datetime.now(timezone.utc)

        return PanelProvisionResponse(
            id=panel_id,
            rfid_tag=panel_data.rfid_tag,
            container_id=container_id,
            wall=wall_type,
            slot_number=slot,
            location_display=location_display,
            notes=panel_data.notes,
            created=created_time,
            message=f"Panel {panel_id} successfully provisioned at {location_display}"
        )
