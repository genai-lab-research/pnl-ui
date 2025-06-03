from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from pydantic import ValidationError

from app.models import (
    CropHistory,
    CultivationAreaData,
    NurseryStationData,
    PanelDataCreate,
    PanelResponse,
    PanelProvisionRequest,
    PanelProvisionResponse,
    TrayDataCreate,
    TrayProvisionRequest,
    TrayProvisionResponse,
    TrayResponse,
)
from app.services.inventory_service import InventoryService

router = APIRouter()
inventory_service = InventoryService()


@router.get(
    "/containers/{container_id}/inventory/nursery", response_model=NurseryStationData
)
def get_nursery_station_data(
    container_id: str,
    date: str | None = Query(None, description="Date for time-lapse view (ISO format)"),
) -> NurseryStationData:
    """Get nursery station layout and tray data for a specific date."""
    parsed_date = None
    if date:
        try:
            parsed_date = datetime.fromisoformat(date.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use ISO format (e.g., 2025-01-30T10:30:00Z)",
            )

    return inventory_service.get_nursery_station_data(container_id, parsed_date)


@router.get(
    "/containers/{container_id}/inventory/cultivation",
    response_model=CultivationAreaData,
)
def get_cultivation_area_data(
    container_id: str,
    date: str | None = Query(None, description="Date for time-lapse view (ISO format)"),
) -> CultivationAreaData:
    """Get cultivation area layout and panel data for a specific date."""
    parsed_date = None
    if date:
        try:
            parsed_date = datetime.fromisoformat(date.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid date format. Use ISO format (e.g., 2025-01-30T10:30:00Z)",
            )

    return inventory_service.get_cultivation_area_data(container_id, parsed_date)


@router.post("/containers/{container_id}/inventory/trays", response_model=TrayResponse)
def provision_tray(container_id: str, tray_data: TrayDataCreate) -> TrayResponse:
    """Provision a new tray in the container."""
    try:
        return inventory_service.provision_tray(container_id, tray_data)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/containers/{container_id}/inventory/panels", response_model=PanelResponse
)
def provision_panel(container_id: str, panel_data: PanelDataCreate) -> PanelResponse:
    """Provision a new panel in the container."""
    try:
        return inventory_service.provision_panel(container_id, panel_data)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/containers/{container_id}/inventory/trays/provision",
    response_model=TrayProvisionResponse
)
def provision_tray_with_location(
    container_id: str,
    shelf: str = Query(..., description="Shelf type (upper/lower)"),
    slot: int = Query(..., description="Slot number"),
    tray_data: TrayProvisionRequest = ...
) -> TrayProvisionResponse:
    """Provision a new tray with specific location and RFID tag."""
    try:
        return inventory_service.provision_tray_with_location(
            container_id, shelf, slot, tray_data
        )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post(
    "/containers/{container_id}/inventory/panels/provision",
    response_model=PanelProvisionResponse
)
def provision_panel_with_location(
    container_id: str,
    wall: str = Query(..., description="Wall type (wall_1/wall_2)"),
    slot: int = Query(..., description="Slot number"),
    panel_data: PanelProvisionRequest = ...
) -> PanelProvisionResponse:
    """Provision a new panel with specific location and RFID tag."""
    try:
        return inventory_service.provision_panel_with_location(
            container_id, wall, slot, panel_data
        )
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/containers/{container_id}/crops/{crop_id}/history", response_model=CropHistory
)
def get_crop_history(
    container_id: str,
    crop_id: str,
    start_date: str | None = Query(
        None, description="Start date for history (ISO format)"
    ),
    end_date: str | None = Query(None, description="End date for history (ISO format)"),
) -> CropHistory:
    """Get crop history for time-lapse view."""
    parsed_start_date = None
    parsed_end_date = None

    if start_date:
        try:
            parsed_start_date = datetime.fromisoformat(
                start_date.replace("Z", "+00:00")
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid start_date format. Use ISO format (e.g., 2025-01-30T10:30:00Z)",
            )

    if end_date:
        try:
            parsed_end_date = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid end_date format. Use ISO format (e.g., 2025-01-30T10:30:00Z)",
            )

    return inventory_service.get_crop_history(
        container_id, crop_id, parsed_start_date, parsed_end_date
    )
