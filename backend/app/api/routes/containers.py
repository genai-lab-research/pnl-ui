"""Container API routes for the Container Management Dashboard."""

import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.services.container import ContainerService
from app.services.metrics import MetricsService
from app.services.event_tracker import EventTracker
from app.schemas.container import (
    Container,
    ContainerCreate,
    ContainerUpdate,
    ContainerFilterCriteria,
    ContainerListResponse,
    PerformanceMetrics,
    FilterOptions,
    ShutdownRequest,
    ShutdownResponse,
    # Container Overview Tab Schemas
    ContainerOverview,
    ActivityLogResponse,
    MetricSnapshotEntry,
    MetricSnapshotCreate,
    ContainerSnapshotEntry,
    ContainerSnapshotCreate,
    ContainerSettingsUpdate,
    ContainerSettingsUpdateResponse,
    EnvironmentLinks,
    EnvironmentLinksUpdate,
    EnvironmentLinksUpdateResponse,
    ActivityLogCreate,
    ActivityLogEntry,
    DashboardSummary
)
from app.api.dependencies import (
    get_container_filters,
    get_metrics_filters,
    validate_container_id
)
from app.auth.dependencies import get_current_active_user
from app.core.constants import ErrorMessages, StatusMessages

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/containers", tags=["containers"])


@router.get("/", response_model=ContainerListResponse)
async def list_containers(
    filters: ContainerFilterCriteria = Depends(get_container_filters),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    List containers with filtering, pagination, and performance metrics.
    
    - **search**: Search across name/tenant/purpose/location/status
    - **type**: Filter by container type (physical/virtual)
    - **tenant**: Filter by tenant ID
    - **purpose**: Filter by purpose (development/research/production)
    - **status**: Filter by status (created/active/maintenance/inactive)
    - **alerts**: Filter for containers with alerts
    - **page**: Page number for pagination (default: 1)
    - **limit**: Items per page (default: 10, options: 10/25/50/100)
    - **sort**: Sort field (default: name)
    - **order**: Sort order (default: asc, options: asc/desc)
    """
    try:
        service = ContainerService(db)
        result = await service.get_containers(filters)
        
        logger.info(f"Retrieved {len(result.containers)} containers for user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing containers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/metrics", response_model=PerformanceMetrics)
async def get_performance_metrics(
    metrics_filters: dict = Depends(get_metrics_filters),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get performance metrics with time range filtering.
    
    - **timeRange**: Time range (week/month/quarter/year, default: week)
    - **type**: Container type filter (physical/virtual/all, default: all)
    - **containerIds**: Comma-separated container IDs to include
    """
    try:
        service = MetricsService(db)
        result = await service.get_performance_metrics(
            time_range=metrics_filters["time_range"],
            container_type=metrics_filters["container_type"],
            container_ids=metrics_filters["container_ids"]
        )
        
        logger.info(f"Retrieved performance metrics for user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting performance metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/filter-options", response_model=FilterOptions)
async def get_filter_options(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get available filter options for the dashboard.
    
    Returns:
    - Available tenants
    - Available purposes
    - Available statuses
    - Available container types
    """
    try:
        service = ContainerService(db)
        result = await service.get_filter_options()
        
        logger.info(f"Retrieved filter options for user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting filter options: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.post("/{container_id}/shutdown", response_model=ShutdownResponse)
async def shutdown_container(
    container_id: int = Path(..., description="Container identifier"),
    shutdown_request: ShutdownRequest = ShutdownRequest(),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Shutdown a container by setting its status to inactive.
    
    - **container_id**: Container identifier
    - **reason**: Optional reason for shutdown
    - **force**: Force shutdown even if container is in use
    """
    try:
        service = ContainerService(db)
        event_tracker = EventTracker(db)
        
        # Get container info before shutdown
        container = await service.get_container(container_id)
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Container not found"
            )
        
        result = await service.shutdown_container(container_id, shutdown_request)
        
        # Track the shutdown event
        await event_tracker.track_container_shutdown(
            container_id=container_id,
            container_name=container.name,
            reason=shutdown_request.reason,
            force=shutdown_request.force,
            user_info={"username": current_user.get("username", "unknown")},
            request=None
        )
        
        logger.info(f"Container {container_id} shutdown by user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        from app.core.exceptions import BaseCustomException
        if isinstance(e, BaseCustomException):
            raise HTTPException(
                status_code=e.status_code,
                detail=e.message
            )
        logger.error(f"Error shutting down container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}", response_model=Container)
async def get_container(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get a specific container by ID.
    
    - **container_id**: Container identifier
    """
    try:
        service = ContainerService(db)
        container = await service.get_container(container_id)
        
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ErrorMessages.CONTAINER_NOT_FOUND
            )
        
        logger.info(f"Retrieved container {container_id} for user: {current_user['username']}")
        return container
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.post("/", response_model=Container, status_code=status.HTTP_201_CREATED)
async def create_container(
    container_data: ContainerCreate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Create a new container.
    
    - **container_data**: Container creation data including all settings
    """
    try:
        service = ContainerService(db)
        event_tracker = EventTracker(db)
        
        # Validate container data
        await service.validate_container_data(container_data)
        
        # Create container
        container = await service.create_container(container_data)
        
        # Track the creation event
        await event_tracker.track_container_creation(
            container_id=container.id,
            container_name=container.name,
            user_info={"username": current_user.get("username", "unknown")},
            request=None
        )
        
        logger.info(f"Created container {container.id} by user: {current_user['username']}")
        return container
    
    except HTTPException:
        raise
    except Exception as e:
        from app.core.exceptions import BaseCustomException
        if isinstance(e, BaseCustomException):
            raise HTTPException(
                status_code=e.status_code,
                detail=e.message
            )
        logger.error(f"Error creating container: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.put("/{container_id}", response_model=Container)
async def update_container(
    container_id: int = Path(..., description="Container identifier"),
    container_data: ContainerUpdate = ContainerUpdate(),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update an existing container.
    
    - **container_id**: Container identifier
    - **container_data**: Container update data
    """
    try:
        service = ContainerService(db)
        event_tracker = EventTracker(db)
        
        # Get current container state for comparison
        current_container = await service.get_container(container_id)
        if not current_container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ErrorMessages.CONTAINER_NOT_FOUND
            )
        
        container = await service.update_container(container_id, container_data)
        
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ErrorMessages.CONTAINER_NOT_FOUND
            )
        
        # Track the update event with actual changes only
        changes = container_data.model_dump(exclude_unset=True)
        
        if changes:
            await event_tracker.track_container_update(
                container_id=container_id,
                container_name=container.name,
                old_container=current_container,
                new_changes=changes,
                user_info={"username": current_user.get("username", "unknown")},
                request=None
            )
        
        logger.info(f"Updated container {container_id} by user: {current_user['username']}")
        return container
    
    except HTTPException:
        raise
    except Exception as e:
        from app.core.exceptions import BaseCustomException
        if isinstance(e, BaseCustomException):
            raise HTTPException(
                status_code=e.status_code,
                detail=e.message
            )
        logger.error(f"Error updating container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.delete("/{container_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_container(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Delete a container.
    
    - **container_id**: Container identifier
    """
    try:
        service = ContainerService(db)
        event_tracker = EventTracker(db)
        
        # Get container info before deletion
        container = await service.get_container(container_id)
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ErrorMessages.CONTAINER_NOT_FOUND
            )
        
        # Track the deletion event before actual deletion
        await event_tracker.track_container_deletion(
            container_id=container_id,
            container_name=container.name,
            user_info={"username": current_user.get("username", "unknown")},
            request=None
        )
        
        deleted = await service.delete_container(container_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ErrorMessages.CONTAINER_NOT_FOUND
            )
        
        logger.info(f"Deleted container {container_id} by user: {current_user['username']}")
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        from app.core.exceptions import BaseCustomException
        if isinstance(e, BaseCustomException):
            raise HTTPException(
                status_code=e.status_code,
                detail=e.message
            )
        logger.error(f"Error deleting container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/metrics", response_model=dict)
async def get_container_metrics(
    container_id: int = Path(..., description="Container identifier"),
    days: int = Query(30, ge=1, le=365, description="Number of days for trend data"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get performance trend for a specific container.
    
    - **container_id**: Container identifier
    - **days**: Number of days for trend data (default: 30)
    """
    try:
        service = MetricsService(db)
        result = await service.get_container_performance_trend(container_id, days)
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=ErrorMessages.CONTAINER_NOT_FOUND
            )
        
        logger.info(f"Retrieved metrics for container {container_id} by user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting container metrics for {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/tenant/{tenant_id}", response_model=List[Container])
async def get_containers_by_tenant(
    tenant_id: int = Path(..., description="Tenant identifier"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get containers for a specific tenant.
    
    - **tenant_id**: Tenant identifier
    - **page**: Page number for pagination
    - **limit**: Items per page
    """
    try:
        service = ContainerService(db)
        containers, total = await service.get_containers_by_tenant(tenant_id, page, limit)
        
        logger.info(f"Retrieved {len(containers)} containers for tenant {tenant_id} by user: {current_user['username']}")
        return containers
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting containers for tenant {tenant_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/alerts/active", response_model=List[Container])
async def get_containers_with_alerts(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get containers that have active alerts.
    """
    try:
        service = ContainerService(db)
        containers = await service.get_containers_with_alerts()
        
        logger.info(f"Retrieved {len(containers)} containers with alerts for user: {current_user['username']}")
        return containers
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting containers with alerts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


# Container Overview Tab API Routes
@router.get("/{container_id}/overview", response_model=ContainerOverview)
async def get_container_overview(
    container_id: int = Path(..., description="Container identifier"),
    time_range: str = Query("week", pattern="^(week|month|quarter|year)$", description="Time range for metrics"),
    metric_interval: str = Query("day", pattern="^(hour|day|week)$", description="Metric aggregation interval"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves comprehensive overview data for a specific container (Overview Tab 2.1).
    
    - **container_id**: Container identifier
    - **time_range**: Time range for metrics (week/month/quarter/year, default: week)
    - **metric_interval**: Metric aggregation interval (hour/day/week, default: day)
    """
    try:
        service = ContainerService(db)
        overview = await service.get_container_overview(container_id, time_range, metric_interval)
        
        if not overview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Container {container_id} not found"
            )
        
        logger.info(f"Retrieved overview for container {container_id} by user: {current_user['username']}")
        return overview
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting overview for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/activity-logs", response_model=ActivityLogResponse)
async def get_activity_logs(
    container_id: int = Path(..., description="Container identifier"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Number of activities per page"),
    start_date: Optional[str] = Query(None, description="Filter from start date (ISO format)"),
    end_date: Optional[str] = Query(None, description="Filter to end date (ISO format)"),
    action_type: Optional[str] = Query(None, description="Filter by action type"),
    actor_type: Optional[str] = Query(None, description="Filter by actor type"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves paginated activity logs for the container.
    """
    try:
        service = ContainerService(db)
        activities, total = await service.get_activity_logs(
            container_id=container_id,
            page=page,
            limit=limit,
            start_date=start_date,
            end_date=end_date,
            action_type=action_type,
            actor_type=actor_type
        )
        
        total_pages = (total + limit - 1) // limit
        
        response = ActivityLogResponse(
            activities=activities,
            pagination={
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": total_pages
            }
        )
        
        logger.info(f"Retrieved {len(activities)} activity logs for container {container_id} by user: {current_user['username']}")
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting activity logs for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.post("/{container_id}/activity-logs", response_model=ActivityLogEntry)
async def create_activity_log(
    container_id: int = Path(..., description="Container identifier"),
    activity_data: ActivityLogCreate = ...,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Creates a new activity log entry.
    """
    try:
        service = ContainerService(db)
        activity = await service.create_activity_log(container_id, activity_data)
        
        logger.info(f"Created activity log for container {container_id} by user: {current_user['username']}")
        return activity
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating activity log for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/metric-snapshots", response_model=List[MetricSnapshotEntry])
async def get_metric_snapshots(
    container_id: int = Path(..., description="Container identifier"),
    start_date: Optional[str] = Query(None, description="Filter from start date (ISO format)"),
    end_date: Optional[str] = Query(None, description="Filter to end date (ISO format)"),
    interval: str = Query("day", pattern="^(hour|day|week)$", description="Aggregation interval"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves metric snapshots for dashboard charts.
    """
    try:
        service = ContainerService(db)
        snapshots = await service.get_metric_snapshots(container_id, start_date, end_date, interval)
        
        logger.info(f"Retrieved {len(snapshots)} metric snapshots for container {container_id} by user: {current_user['username']}")
        return snapshots
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting metric snapshots for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.post("/{container_id}/metric-snapshots", response_model=MetricSnapshotEntry)
async def create_metric_snapshot(
    container_id: int = Path(..., description="Container identifier"),
    snapshot_data: MetricSnapshotCreate = ...,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Creates a new metric snapshot.
    """
    try:
        service = ContainerService(db)
        snapshot = await service.create_metric_snapshot(container_id, snapshot_data)
        
        logger.info(f"Created metric snapshot for container {container_id} by user: {current_user['username']}")
        return snapshot
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating metric snapshot for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/snapshots", response_model=List[ContainerSnapshotEntry])
async def get_container_snapshots(
    container_id: int = Path(..., description="Container identifier"),
    start_date: Optional[str] = Query(None, description="Filter from start date (ISO format)"),
    end_date: Optional[str] = Query(None, description="Filter to end date (ISO format)"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of snapshots"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves container snapshots for historical state tracking.
    """
    try:
        service = ContainerService(db)
        snapshots = await service.get_container_snapshots(container_id, start_date, end_date, limit)
        
        logger.info(f"Retrieved {len(snapshots)} container snapshots for container {container_id} by user: {current_user['username']}")
        return snapshots
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting container snapshots for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.post("/{container_id}/snapshots", response_model=ContainerSnapshotEntry)
async def create_container_snapshot(
    container_id: int = Path(..., description="Container identifier"),
    snapshot_data: ContainerSnapshotCreate = ...,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Creates a new container snapshot for historical tracking.
    """
    try:
        service = ContainerService(db)
        snapshot = await service.create_container_snapshot(container_id, snapshot_data)
        
        logger.info(f"Created container snapshot for container {container_id} by user: {current_user['username']}")
        return snapshot
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating container snapshot for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.put("/{container_id}/settings", response_model=ContainerSettingsUpdateResponse)
async def update_container_settings(
    container_id: int = Path(..., description="Container identifier"),
    settings_data: ContainerSettingsUpdate = ...,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Updates container configuration from the overview tab settings section.
    """
    try:
        service = ContainerService(db)
        event_tracker = EventTracker(db)
        
        # Get current container state
        container = await service.get_container(container_id)
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Container not found"
            )
        
        result = await service.update_container_settings(container_id, settings_data)
        
        # Track settings changes
        settings_changes = settings_data.model_dump(exclude_unset=True)
        if settings_changes:
            await event_tracker.track_settings_change(
                container_id=container_id,
                container_name=container.name,
                settings_changed=settings_changes,
                user_info={"username": current_user.get("username", "unknown")},
                request=None
            )
        
        logger.info(f"Updated settings for container {container_id} by user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating settings for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/environment-links", response_model=EnvironmentLinks)
async def get_environment_links(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves environment links for ecosystem connectivity.
    """
    try:
        service = ContainerService(db)
        links = await service.get_environment_links(container_id)
        
        logger.info(f"Retrieved environment links for container {container_id} by user: {current_user['username']}")
        return links
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting environment links for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.put("/{container_id}/environment-links", response_model=EnvironmentLinksUpdateResponse)
async def update_environment_links(
    container_id: int = Path(..., description="Container identifier"),
    links_data: EnvironmentLinksUpdate = ...,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Updates environment links for ecosystem connectivity.
    """
    try:
        service = ContainerService(db)
        event_tracker = EventTracker(db)
        
        # Get current container state
        container = await service.get_container(container_id)
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Container not found"
            )
        
        result = await service.update_environment_links(container_id, links_data)
        
        # Track environment link changes
        link_changes = links_data.model_dump(exclude_unset=True)
        if link_changes:
            await event_tracker.track_environment_link_change(
                container_id=container_id,
                container_name=container.name,
                link_changes=link_changes,
                user_info={"username": current_user.get("username", "unknown")},
                request=None
            )
        
        logger.info(f"Updated environment links for container {container_id} by user: {current_user['username']}")
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating environment links for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/dashboard-summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves aggregated summary data for the overview dashboard.
    """
    try:
        service = ContainerService(db)
        summary = await service.get_dashboard_summary(container_id)
        
        logger.info(f"Retrieved dashboard summary for container {container_id} by user: {current_user['username']}")
        return summary
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dashboard summary for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorMessages.INTERNAL_SERVER_ERROR
        )


@router.get("/{container_id}/provisioning-context")
async def get_container_provisioning_context(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get available locations and current inventory for provisioning context."""
    try:
        service = ContainerService(db)
        context = await service.get_provisioning_context(container_id)
        
        logger.info(f"Retrieved provisioning context for container {container_id} by user: {current_user['username']}")
        return context
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting provisioning context for container {container_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve provisioning context"
        ) from e


@router.get("/{container_id}/locations/{location_type}/{location}")
async def get_location_details(
    container_id: int = Path(..., description="Container identifier"),
    location_type: str = Path(..., description="Location type (nursery-station/cultivation-area)"),
    location: str = Path(..., description="Specific location (shelf-slot/wall-slot)"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Retrieve details about a specific location for provisioning."""
    try:
        service = ContainerService(db)
        location_details = await service.get_location_details(
            container_id, location_type, location
        )
        
        logger.info(f"Retrieved location details for {location_type}/{location} in container {container_id}")
        return location_details
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting location details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve location details"
        ) from e


@router.get("/{container_id}/provisioning-summary")
async def get_provisioning_summary(
    container_id: int = Path(..., description="Container identifier"),
    days: int = Query(7, description="Number of days to look back"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Retrieve summary of recent provisioning activities."""
    try:
        service = ContainerService(db)
        summary = await service.get_provisioning_summary(container_id, days)
        
        logger.info(f"Retrieved provisioning summary for container {container_id} (last {days} days)")
        return summary
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting provisioning summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve provisioning summary"
        ) from e


# Cultivation Area endpoints
@router.get("/{container_id}/inventory/cultivation-area", response_model=dict)
async def get_cultivation_area_layout(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get cultivation area layout and utilization."""
    try:
        service = ContainerService(db)
        layout = await service.get_cultivation_area_layout(container_id)
        
        logger.info(f"Retrieved cultivation area layout for container {container_id}")
        return layout
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting cultivation area layout: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cultivation area layout"
        ) from e


@router.get("/{container_id}/panels", response_model=List[dict])
async def get_panels_for_container(
    container_id: int = Path(..., description="Container identifier"),
    status: Optional[str] = Query(None, description="Filter by panel status"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get all panels for a container."""
    try:
        service = ContainerService(db)
        panels = await service.get_panels_for_container(container_id, status)
        
        logger.info(f"Retrieved {len(panels)} panels for container {container_id}")
        return panels
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting panels for container: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve panels"
        ) from e


@router.get("/{container_id}/panel-snapshots", response_model=List[dict])
async def get_panel_snapshots(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get panel snapshots for a container."""
    try:
        service = ContainerService(db)
        snapshots = await service.get_panel_snapshots(container_id)
        
        logger.info(f"Retrieved {len(snapshots)} panel snapshots for container {container_id}")
        return snapshots
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting panel snapshots: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve panel snapshots"
        ) from e


@router.post("/{container_id}/panel-snapshots", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_panel_snapshot(
    container_id: int = Path(..., description="Container identifier"),
    snapshot_data: dict = ...,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Create a new panel snapshot."""
    try:
        service = ContainerService(db)
        snapshot = await service.create_panel_snapshot(container_id, snapshot_data)
        
        logger.info(f"Created panel snapshot for container {container_id}")
        return snapshot
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating panel snapshot: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create panel snapshot"
        ) from e


@router.get("/{container_id}/cultivation-area/available-slots", response_model=dict)
async def get_available_panel_slots(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get available panel slots in cultivation area."""
    try:
        service = ContainerService(db)
        slots = await service.get_available_panel_slots(container_id)
        
        logger.info(f"Retrieved available slots for container {container_id}")
        return slots
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting available slots: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve available slots"
        ) from e


@router.get("/{container_id}/cultivation-area/summary", response_model=dict)
async def get_cultivation_area_summary(
    container_id: int = Path(..., description="Container identifier"),
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get cultivation area summary."""
    try:
        service = ContainerService(db)
        summary = await service.get_cultivation_area_summary(container_id)
        
        logger.info(f"Retrieved cultivation area summary for container {container_id}")
        return summary
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting cultivation area summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cultivation area summary"
        ) from e