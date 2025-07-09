"""API dependencies for FastAPI routes."""

from typing import Optional
from fastapi import Depends, HTTPException, Query
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.core.constants import ErrorMessages, DefaultValues, ValidationConstraints
from app.schemas.container import ContainerFilterCriteria
from app.auth.dependencies import get_current_active_user


async def get_db_session() -> AsyncSession:
    """Get database session dependency."""
    async with get_async_db() as db:
        yield db


async def get_container_filters(
    search: Optional[str] = Query(None, description="Search across name/tenant/purpose/location/status"),
    type: Optional[str] = Query(None, description="Filter by container type (physical/virtual)"),
    tenant: Optional[int] = Query(None, description="Filter by tenant ID"),
    purpose: Optional[str] = Query(None, description="Filter by purpose (development/research/production)"),
    status: Optional[str] = Query(None, description="Filter by status (created/active/maintenance/inactive)"),
    alerts: Optional[bool] = Query(None, description="Filter for containers with alerts"),
    page: int = Query(DefaultValues.DEFAULT_PAGE, ge=1, description="Page number for pagination"),
    limit: int = Query(DefaultValues.DEFAULT_LIMIT, ge=1, le=ValidationConstraints.MAX_PAGE_SIZE, description="Items per page"),
    sort: str = Query(DefaultValues.DEFAULT_SORT_FIELD, description="Sort field"),
    order: str = Query(DefaultValues.DEFAULT_SORT_ORDER, pattern="^(asc|desc)$", description="Sort order")
) -> ContainerFilterCriteria:
    """Parse and validate container filter parameters."""
    
    # Validate container type
    if type and type not in ["physical", "virtual"]:
        raise HTTPException(
            status_code=422,
            detail="Invalid container type. Must be 'physical' or 'virtual'"
        )
    
    # Validate purpose
    if purpose and purpose not in ["development", "research", "production"]:
        raise HTTPException(
            status_code=422,
            detail="Invalid purpose. Must be 'development', 'research', or 'production'"
        )
    
    # Validate status
    if status and status not in ["created", "active", "maintenance", "inactive"]:
        raise HTTPException(
            status_code=422,
            detail="Invalid status. Must be 'created', 'active', 'maintenance', or 'inactive'"
        )
    
    # Validate limit (allow smaller values for testing)
    if limit <= 0 or limit > 100:
        raise HTTPException(
            status_code=422,
            detail="Invalid limit. Must be between 1 and 100"
        )
    
    return ContainerFilterCriteria(
        search=search,
        type=type,
        tenant=tenant,
        purpose=purpose,
        status=status,
        alerts=alerts,
        page=page,
        limit=limit,
        sort=sort,
        order=order
    )


async def get_metrics_filters(
    timeRange: str = Query(DefaultValues.DEFAULT_TIME_RANGE, description="Time range (week/month/quarter/year)"),
    type: str = Query(DefaultValues.DEFAULT_CONTAINER_TYPE_FILTER, description="Container type filter (physical/virtual/all)"),
    containerIds: Optional[str] = Query(None, description="Comma-separated container IDs")
) -> dict:
    """Parse and validate metrics filter parameters."""
    
    # Validate time range
    if timeRange not in ["week", "month", "quarter", "year"]:
        raise HTTPException(
            status_code=422,
            detail="Invalid time range. Must be 'week', 'month', 'quarter', or 'year'"
        )
    
    # Validate container type
    if type not in ["physical", "virtual", "all"]:
        raise HTTPException(
            status_code=422,
            detail="Invalid container type. Must be 'physical', 'virtual', or 'all'"
        )
    
    # Parse container IDs
    container_ids = None
    if containerIds:
        try:
            container_ids = [int(id.strip()) for id in containerIds.split(",") if id.strip()]
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Invalid container IDs. Must be comma-separated integers"
            )
    
    return {
        "time_range": timeRange,
        "container_type": type if type != "all" else None,
        "container_ids": container_ids
    }


async def validate_container_id(
    container_id: int,
    db: AsyncSession = Depends(get_db_session)
) -> int:
    """Validate that container ID exists."""
    from app.repositories.container import ContainerRepository
    
    repository = ContainerRepository(db)
    exists = await repository.exists(container_id)
    
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorMessages.CONTAINER_NOT_FOUND
        )
    
    return container_id


async def get_pagination_params(
    page: int = Query(DefaultValues.DEFAULT_PAGE, ge=1, description="Page number"),
    limit: int = Query(DefaultValues.DEFAULT_LIMIT, ge=1, le=ValidationConstraints.MAX_PAGE_SIZE, description="Items per page")
) -> dict:
    """Get pagination parameters."""
    
    # Validate limit (allow smaller values for testing)
    if limit <= 0 or limit > 100:
        raise HTTPException(
            status_code=422,
            detail="Invalid limit. Must be between 1 and 100"
        )
    
    return {"page": page, "limit": limit}


async def get_sorting_params(
    sort: str = Query(DefaultValues.DEFAULT_SORT_FIELD, description="Sort field"),
    order: str = Query(DefaultValues.DEFAULT_SORT_ORDER, pattern="^(asc|desc)$", description="Sort order")
) -> dict:
    """Get sorting parameters."""
    
    # Validate sort field (basic validation, specific validation should be done in service)
    allowed_sort_fields = ["name", "type", "purpose", "status", "tenant_id", "created_at", "updated_at"]
    if sort not in allowed_sort_fields:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid sort field. Must be one of: {', '.join(allowed_sort_fields)}"
        )
    
    return {"sort": sort, "order": order}


class CommonQueryParams:
    """Common query parameters for reuse."""
    
    def __init__(
        self,
        page: int = Query(DefaultValues.DEFAULT_PAGE, ge=1, description="Page number"),
        limit: int = Query(DefaultValues.DEFAULT_LIMIT, ge=1, le=ValidationConstraints.MAX_PAGE_SIZE, description="Items per page"),
        sort: str = Query(DefaultValues.DEFAULT_SORT_FIELD, description="Sort field"),
        order: str = Query(DefaultValues.DEFAULT_SORT_ORDER, pattern="^(asc|desc)$", description="Sort order")
    ):
        self.page = page
        self.limit = limit
        self.sort = sort
        self.order = order


# Dependency for authenticated routes
AuthenticatedRoute = Depends(get_current_active_user)

# Dependency for database session
DatabaseSession = Depends(get_db_session)