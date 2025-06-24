from typing import List, Optional, Union
from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db, get_async_db
from app.core.exceptions import (
    ResourceNotFoundError,
    ResourceConflictError,
    CustomValidationError
)
from app.services.container import ContainerService
from app.services.crop import CropService
from app.services.inventory_metrics import InventoryMetricsService
from app.schemas.container import (
    ContainerCreateRequest,
    ContainerCreate,
    ContainerUpdate,
    ContainerResponse,
    ContainerFilter,
    ContainerType,
    ContainerPurpose,
    ContainerStatus,
)
from app.schemas.crop import CropResponse, CropFilter
from app.schemas.inventory_metrics import InventoryMetricsResponse, InventoryMetricsQuery
from app.core.pagination import PaginationParams, PaginatedResponse

router = APIRouter()


@router.get("/", response_model=Union[List[ContainerResponse], PaginatedResponse[ContainerResponse]])
async def list_containers(
    search: Optional[str] = Query(None, description="Search in name/tenant/purpose/status"),
    container_type: Optional[ContainerType] = Query(
        None, alias="type", description="Filter by container type"
    ),
    tenant: Optional[str] = Query(None, description="Filter by tenant ID"),
    purpose: Optional[ContainerPurpose] = Query(None, description="Filter by purpose"),
    status: Optional[ContainerStatus] = Query(None, description="Filter by status"),
    has_alerts: Optional[bool] = Query(None, description="Filter for containers with alerts"),
    skip: int = Query(None, ge=0, description="Number of containers to skip (legacy)"),
    limit: int = Query(None, ge=1, le=1000, description="Number of containers to return (legacy)"),
    page: int = Query(None, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(None, ge=1, le=1000, description="Number of items per page"),
    db: AsyncSession = Depends(get_async_db),
):
    service = ContainerService(db)
    filters = ContainerFilter(
        search=search,
        type=container_type,
        tenant=tenant,
        purpose=purpose,
        status=status,
        has_alerts=has_alerts,
    )
    
    # Check if new pagination parameters are provided
    if page is not None or page_size is not None:
        # Use new pagination
        pagination = PaginationParams(
            page=page or 1,
            page_size=page_size or 20
        )
        return await service.get_containers_paginated(pagination, filters)
    else:
        # Use legacy pagination for backward compatibility
        skip_val = skip or 0
        limit_val = limit or 100
        return await service.get_containers(skip=skip_val, limit=limit_val, filters=filters)


@router.post("/", response_model=ContainerResponse, status_code=201)
async def create_container(
    container: ContainerCreateRequest,
    db: AsyncSession = Depends(get_async_db),
):
    service = ContainerService(db)
    return await service.create_container(container)


@router.get("/{container_id}", response_model=ContainerResponse)
async def get_container(
    container_id: str,
    db: AsyncSession = Depends(get_async_db),
):
    service = ContainerService(db)
    container = await service.get_container(container_id)
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
    return container


@router.put("/{container_id}", response_model=ContainerResponse)
async def update_container(
    container_id: str,
    container: ContainerUpdate,
    db: AsyncSession = Depends(get_async_db),
):
    service = ContainerService(db)
    return await service.update_container(container_id, container)


@router.delete("/{container_id}", status_code=204)
async def delete_container(
    container_id: str,
    db: AsyncSession = Depends(get_async_db),
):
    service = ContainerService(db)
    await service.delete_container(container_id)


@router.get("/{container_id}/inventory/metrics", response_model=InventoryMetricsResponse)
def get_inventory_metrics(
    container_id: str,
    date: Optional[str] = Query(None, description="Date for historical data in format YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    service = InventoryMetricsService(db)
    query_params = InventoryMetricsQuery(date=date) if date else None
    metrics = service.get_metrics(container_id, query_params)
    if not metrics:
        raise HTTPException(status_code=404, detail="Metrics not found")
    return metrics


@router.get("/{container_id}/inventory/crops", response_model=Union[List[CropResponse], PaginatedResponse[CropResponse]])
def get_crops(
    container_id: str,
    seed_type: Optional[str] = Query(None, description="Filter crops by seed type"),
    growth_stage: Optional[str] = Query(None, description="Filter crops by growth stage"),
    health_status: Optional[str] = Query(None, description="Filter crops by health status"),
    min_health_score: Optional[float] = Query(None, ge=0, le=100, description="Minimum health score"),
    max_health_score: Optional[float] = Query(None, ge=0, le=100, description="Maximum health score"),
    skip: int = Query(None, ge=0, description="Number of crops to skip (legacy)"),
    limit: int = Query(None, ge=1, le=1000, description="Number of crops to return (legacy)"),
    page: int = Query(None, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(None, ge=1, le=1000, description="Number of items per page"),
    db: Session = Depends(get_db),
):
    service = CropService(db)
    filters = CropFilter(
        seed_type=seed_type,
        growth_stage=growth_stage,
        health_status=health_status,
        min_health_score=min_health_score,
        max_health_score=max_health_score
    ) if any([seed_type, growth_stage, health_status, min_health_score, max_health_score]) else None
    
    # Check if new pagination parameters are provided
    if page is not None or page_size is not None:
        # Use new pagination
        pagination = PaginationParams(
            page=page or 1,
            page_size=page_size or 20
        )
        return service.get_crops_by_container_paginated(container_id, pagination, filters)
    else:
        # Use legacy pagination for backward compatibility
        skip_val = skip or 0
        limit_val = limit or 100
        return service.get_crops_by_container(container_id, filters, skip_val, limit_val)