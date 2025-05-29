from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse

from app.models import (
    ContainerPublic,
    ContainersPublic,
    ContainerList,
    ContainerStats,
    ContainerSummary,
    ContainerCreate,
    ContainerCreateFromForm,
    ContainerResponse,
    ContainerUpdate,
    ContainerMetricsPublic,
    ContainerCropsPublic,
    ContainerActivitiesPublic,
    ContainerType,
    ContainerStatus,
    TimeRange,
    Message
)
from app.services.container_service import ContainerService

router = APIRouter()
container_service = ContainerService()


@router.get("/", response_model=ContainerList)
def get_containers(
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    name: Optional[str] = Query(default=None, description="Filter by container name"),
    tenant_id: Optional[str] = Query(default=None, description="Filter by tenant ID"),
    type: Optional[ContainerType] = Query(default=None, description="Filter by container type"),
    purpose: Optional[str] = Query(default=None, description="Filter by purpose"),
    status: Optional[ContainerStatus] = Query(default=None, description="Filter by status"),
    has_alerts: Optional[bool] = Query(default=None, description="Filter containers with alerts"),
    location: Optional[str] = Query(default=None, description="Filter by location"),
) -> Any:
    """
    List containers with optional filtering and pagination.
    """
    filters = {
        "name": name,
        "tenant_id": tenant_id,
        "type": type,
        "purpose": purpose,
        "status": status,
        "has_alerts": has_alerts,
        "location": location,
    }
    return container_service.get_containers_filtered(skip=skip, limit=limit, filters=filters)

@router.get("/stats", response_model=ContainerStats)
def get_container_stats() -> Any:
    """
    Get container statistics - counts by type.
    """
    return container_service.get_container_stats()


@router.post("/", response_model=ContainerPublic)
def create_container(
    *,
    container_in: ContainerCreate,
) -> Any:
    """
    Create new container.
    """
    return container_service.create_container(container_in)


@router.post("/create-from-form", response_model=ContainerResponse, status_code=status.HTTP_201_CREATED)
def create_container_from_form(
    *,
    form_data: ContainerCreateFromForm,
) -> Any:
    """
    Create new container from page2 form data.
    """
    return container_service.create_container_from_form(form_data)


@router.get("/{container_id}", response_model=ContainerPublic)
def get_container(
    container_id: str,
) -> Any:
    """
    Get detailed information about a specific container by ID.
    """
    return container_service.get_container_by_id(container_id)


@router.put("/{container_id}", response_model=ContainerPublic)
def update_container(
    *,
    container_id: str,
    container_in: ContainerUpdate,
) -> Any:
    """
    Update container.
    """
    return container_service.update_container(container_id, container_in)


@router.delete("/{container_id}")
def delete_container(
    container_id: str,
) -> Any:
    """
    Delete container.
    """
    container_service.delete_container(container_id)
    return Message(message="Container deleted successfully")

@router.post("/{container_id}/shutdown", response_model=ContainerPublic)
def shutdown_container(
    container_id: str,
) -> Any:
    """
    Shutdown a container.
    """
    return container_service.shutdown_container(container_id)


@router.get("/{container_id}/metrics")
def get_container_metrics(
    container_id: str,
    time_range: Optional[TimeRange] = Query(default=TimeRange.WEEK),
) -> Any:
    """
    Get metrics for a specific container.
    """
    return container_service.get_container_metrics(container_id, time_range)


@router.get("/{container_id}/metric-cards")
def get_container_metric_cards(container_id: str) -> Any:
    """
    Get metrics formatted for the MetricCards component.
    Returns data in the exact format expected by the frontend MetricCards.
    """
    return container_service.get_container_metric_cards(container_id)


@router.get("/{container_id}/crops", response_model=ContainerCropsPublic)
def get_container_crops(
    container_id: str,
    page: int = Query(default=0, ge=0),
    page_size: int = Query(default=10, ge=1, le=100),
    seed_type: Optional[str] = Query(default=None),
) -> Any:
    """
    Get crops for a specific container with pagination and optional filtering.
    """
    return container_service.get_container_crops(
        container_id=container_id,
        page=page,
        page_size=page_size,
        seed_type=seed_type
    )


@router.get("/{container_id}/activities", response_model=ContainerActivitiesPublic)
def get_container_activities(
    container_id: str,
    limit: int = Query(default=5, ge=1, le=50),
) -> Any:
    """
    Get activity logs for a specific container.
    """
    return container_service.get_container_activities(container_id, limit)