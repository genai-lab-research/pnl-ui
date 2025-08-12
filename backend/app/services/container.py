"""Container service layer for business logic."""

import logging
from typing import List, Optional, Tuple
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.container import ContainerRepository
from app.core.exceptions import (
    ContainerNotFoundException,
    ContainerValidationException,
    ContainerShutdownException,
    DatabaseException
)
from app.schemas.container import (
    Container,
    ContainerCreate,
    ContainerUpdate,
    ContainerFilterCriteria,
    FilterOptions,
    ShutdownRequest,
    ShutdownResponse,
    Pagination,
    ContainerListResponse,
    # Overview schemas
    ContainerOverview,
    ContainerInfo,
    TenantInfo,
    DashboardMetrics,
    OverviewYieldMetrics,
    OverviewYieldDataPoint,
    SpaceUtilizationMetrics,
    OverviewUtilizationDataPoint,
    CropSummary,
    ActivityLogEntry,
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
    DashboardSummary
)
from app.services.metrics import MetricsService
from app.core.constants import ErrorMessages

logger = logging.getLogger(__name__)


class ContainerService:
    """Container service for business logic operations."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = ContainerRepository(db)
        self.metrics_service = MetricsService(db)

    async def get_container(self, container_id: int) -> Optional[Container]:
        """Get a container by ID."""
        try:
            logger.debug(f"Retrieving container with ID: {container_id}")
            container_orm = await self.repository.get_with_relationships_detached(
                container_id
            )
            if not container_orm:
                logger.warning(f"Container {container_id} not found")
                return None
            
            logger.debug(f"Successfully retrieved container: {container_orm.name}")
            return Container.model_validate(container_orm, from_attributes=True)
        except Exception as e:
            logger.error(f"Database error retrieving container {container_id}: {e}")
            raise DatabaseException(
                message=f"Failed to retrieve container {container_id}",
                details={"container_id": container_id, "error": str(e)}
            ) from e

    async def get_containers(
        self,
        filters: ContainerFilterCriteria
    ) -> ContainerListResponse:
        """Get containers with filtering, pagination, and performance metrics."""
        try:
            # Calculate skip and limit from pagination
            skip = (filters.page - 1) * filters.limit
            
            # Get filtered containers
            containers_orm, total = await self.repository.get_filtered(
                filters, skip=skip, limit=filters.limit
            )
            
            # Convert ORM objects to schemas with computed fields
            containers = [
                Container.model_validate(c, from_attributes=True) 
                for c in containers_orm
            ]
            
            # Calculate pagination
            total_pages = (total + filters.limit - 1) // filters.limit
            pagination = Pagination(
                page=filters.page,
                limit=filters.limit,
                total=total,
                total_pages=total_pages
            )
            
            # Get performance metrics
            performance_metrics = await self.metrics_service.get_performance_metrics(
                time_range="week",
                container_type="all"
            )
            
            return ContainerListResponse(
                containers=containers,
                pagination=pagination,
                performance_metrics=performance_metrics
            )
        
        except Exception as e:
            logger.error(f"Database error getting containers: {e}")
            raise DatabaseException(
                message="Failed to retrieve containers",
                details={"filters": filters.model_dump(), "error": str(e)}
            ) from e

    async def create_container(self, container_data: ContainerCreate) -> Container:
        """Create a new container."""
        try:
            # Validate container name is unique
            logger.debug(f"Validating container name uniqueness: {container_data.name}")
            existing = await self.repository.get_by_field("name", container_data.name)
            if existing:
                logger.warning(f"Container name already exists: {container_data.name}")
                raise ContainerValidationException(
                    field="name",
                    value=container_data.name,
                    details={"existing_id": existing.id}
                )
            
            # Create container with relationships
            container_orm = await self.repository.create_with_relationships(
                container_data
            )
            
            logger.info(
                f"Created container: {container_orm.name} (ID: {container_orm.id})"
            )
            return Container.model_validate(container_orm, from_attributes=True)
        
        except ContainerValidationException:
            raise
        except Exception as e:
            logger.error(f"Database error creating container: {e}")
            raise DatabaseException(
                message="Failed to create container",
                details={"name": container_data.name, "error": str(e)}
            ) from e

    async def update_container(
        self,
        container_id: int,
        container_data: ContainerUpdate
    ) -> Optional[Container]:
        """Update a container."""
        try:
            # Check if container exists
            logger.debug(f"Checking if container {container_id} exists for update")
            existing = await self.repository.get(container_id)
            if not existing:
                logger.warning(f"Container {container_id} not found for update")
                raise ContainerNotFoundException(
                    container_id=container_id,
                    details={"operation": "update"}
                )
            
            # Validate name uniqueness if name is being updated
            if (
                container_data.name and container_data.name != existing.name
            ):
                name_exists = await self.repository.get_by_field(
                    "name", container_data.name
                )
                if name_exists:
                    logger.warning(
                        f"Name conflict during update: {container_data.name}"
                    )
                    raise ContainerValidationException(
                        field="name",
                        value=container_data.name,
                        details={
                            "existing_id": name_exists.id, 
                            "operation": "update"
                        }
                    )
            
            # Update container
            container_orm = await self.repository.update_with_relationships(
                container_id, container_data
            )
            if not container_orm:
                return None
            
            logger.info(
                f"Updated container: {container_orm.name} (ID: {container_orm.id})"
            )
            return Container.model_validate(container_orm, from_attributes=True)
        
        except (ContainerNotFoundException, ContainerValidationException):
            raise
        except Exception as e:
            logger.error(f"Database error updating container {container_id}: {e}")
            raise DatabaseException(
                message=f"Failed to update container {container_id}",
                details={"container_id": container_id, "error": str(e)}
            ) from e

    async def delete_container(self, container_id: int) -> bool:
        """Delete a container."""
        try:
            # Check if container exists
            logger.debug(f"Checking if container {container_id} exists for deletion")
            existing = await self.repository.get(container_id)
            if not existing:
                logger.warning(f"Container {container_id} not found for deletion")
                raise ContainerNotFoundException(
                    container_id=container_id,
                    details={"operation": "delete"}
                )
            
            # Delete container
            deleted = await self.repository.delete(container_id)
            
            if deleted:
                logger.info(
                    f"Deleted container: {existing.name} (ID: {container_id})"
                )
            
            return deleted
        
        except ContainerNotFoundException:
            raise
        except Exception as e:
            logger.error(f"Database error deleting container {container_id}: {e}")
            raise DatabaseException(
                message=f"Failed to delete container {container_id}",
                details={"container_id": container_id, "error": str(e)}
            ) from e

    async def shutdown_container(
        self,
        container_id: int,
        shutdown_request: ShutdownRequest
    ) -> ShutdownResponse:
        """Shutdown a container."""
        try:
            # Check if container exists
            logger.debug(f"Checking if container {container_id} exists for shutdown")
            container = await self.repository.get(container_id)
            if not container:
                logger.warning(f"Container {container_id} not found for shutdown")
                raise ContainerNotFoundException(
                    container_id=container_id,
                    details={"operation": "shutdown"}
                )
            
            # Check if container is already inactive
            if container.status == "inactive":
                return ShutdownResponse(
                    success=False,
                    message="Container is already inactive",
                    container_id=container_id
                )
            
            # Perform shutdown
            success = await self.repository.shutdown_container(container_id)
            
            if success:
                message = f"Container '{container.name}' has been shut down"
                if shutdown_request.reason:
                    message += f" - Reason: {shutdown_request.reason}"
                
                logger.info(
                    f"Shutdown container: {container.name} (ID: {container_id})"
                )
                
                return ShutdownResponse(
                    success=True,
                    message=message,
                    container_id=container_id
                )
            
            logger.error(f"Failed to shutdown container {container_id}")
            raise ContainerShutdownException(
                container_id=container_id,
                reason="Database operation failed",
                details={"force": shutdown_request.force}
            )
        
        except (ContainerNotFoundException, ContainerShutdownException):
            raise
        except Exception as e:
            logger.error(f"Database error shutting down container {container_id}: {e}")
            raise DatabaseException(
                message=f"Failed to shutdown container {container_id}",
                details={"container_id": container_id, "error": str(e)}
            ) from e

    async def get_filter_options(self) -> FilterOptions:
        """Get available filter options for the dashboard."""
        try:
            # Get distinct values for various fields
            purposes = await self.repository.get_distinct_values("purpose")
            statuses = await self.repository.get_distinct_values("status")
            container_types = await self.repository.get_distinct_values("type")
            
            # Get tenant options
            tenant_options = await self.repository.get_tenant_options()
            
            return FilterOptions(
                tenants=tenant_options,
                purposes=purposes,
                statuses=statuses,
                container_types=container_types
            )
        
        except Exception as e:
            logger.error(f"Database error getting filter options: {e}")
            raise DatabaseException(
                message="Failed to retrieve filter options",
                details={"error": str(e)}
            ) from e

    async def get_containers_by_tenant(
        self,
        tenant_id: int,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Container], int]:
        """Get containers for a specific tenant."""
        try:
            filters = ContainerFilterCriteria(
                tenant=tenant_id,
                page=page,
                limit=limit
            )
            
            # Calculate skip and limit from pagination
            skip = (page - 1) * limit
            
            containers_orm, total = await self.repository.get_filtered(
                filters, skip=skip, limit=limit
            )
            containers = [
                Container.model_validate(c, from_attributes=True) 
                for c in containers_orm
            ]
            return containers, total
        
        except Exception as e:
            logger.error(f"Error getting containers for tenant {tenant_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def get_containers_with_alerts(self) -> List[Container]:
        """Get containers that have active alerts."""
        try:
            containers_orm = await self.repository.get_containers_with_alerts()
            return [
                Container.model_validate(c, from_attributes=True) 
                for c in containers_orm
            ]
        
        except Exception as e:
            logger.error(f"Error getting containers with alerts: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def validate_container_data(self, container_data: ContainerCreate) -> bool:
        """Validate container data before creation."""
        try:
            # Check if physical containers have location
            if container_data.type == "physical" and not container_data.location:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Physical containers must have a location"
                )
            
            # Basic validation passed
            return True
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error validating container data: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.VALIDATION_ERROR
            ) from e

    # Container Overview Tab Service Methods
    async def get_container_overview(
        self,
        container_id: int,
        time_range: str = "week",
        metric_interval: str = "day"
    ) -> Optional[ContainerOverview]:
        """Get comprehensive overview data for a container."""
        try:
            # Get container with tenant info
            container_orm = await self.repository.get_container_with_tenant(
                container_id
            )
            if not container_orm:
                return None

            # Get dashboard metrics
            dashboard_metrics = await self._build_dashboard_metrics(
                container_id, time_range, metric_interval
            )
            
            # Get crops summary (placeholder - would need crop data)
            crops_summary = await self._build_crops_summary(container_id)
            
            # Get recent activity
            recent_activity = await self._build_recent_activity(container_id)

            # Build container info
            container_info = ContainerInfo(
                id=container_orm.id,
                name=container_orm.name,
                type=container_orm.type,
                tenant=TenantInfo(
                    id=container_orm.tenant.id,
                    name=container_orm.tenant.name
                ) if container_orm.tenant else TenantInfo(id=0, name="Unknown"),
                location=container_orm.location,
                status=container_orm.status
            )

            return ContainerOverview(
                container=container_info,
                dashboard_metrics=dashboard_metrics,
                crops_summary=crops_summary,
                recent_activity=recent_activity
            )

        except Exception as e:
            logger.error(f"Error getting container overview {container_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def _build_dashboard_metrics(
        self,
        container_id: int,
        time_range: str,
        metric_interval: str
    ) -> DashboardMetrics:
        """Build dashboard metrics from metric snapshots."""
        # Get latest metrics
        latest_metrics = await self.repository.get_latest_metrics(container_id)
        
        # Get metrics for time range
        metrics_data = await self.repository.get_metrics_for_time_range(
            container_id, time_range
        )
        
        # Build yield chart data
        yield_chart_data = []
        for metric in metrics_data:
            yield_chart_data.append(OverviewYieldDataPoint(
                date=(
                    metric.timestamp.isoformat() if metric.timestamp 
                    else datetime.now().isoformat()
                ),
                value=metric.yield_kg or 0.0,
                is_current_period=True,  # TODO: Implement proper logic
                is_future=False
            ))

        # Build space utilization chart data
        utilization_chart_data = []
        for metric in metrics_data:
            utilization_chart_data.append(OverviewUtilizationDataPoint(
                date=(
                    metric.timestamp.isoformat() if metric.timestamp 
                    else datetime.now().isoformat()
                ),
                nursery_value=(
                    metric.space_utilization_pct or 0.0
                ) * 0.5,  # Split between areas
                cultivation_value=metric.space_utilization_pct or 0.0 * 0.5,
                is_current_period=True,  # TODO: Implement proper logic
                is_future=False
            ))

        # Calculate averages
        total_yield = sum(m.yield_kg or 0.0 for m in metrics_data)
        avg_yield = total_yield / len(metrics_data) if metrics_data else 0.0
        avg_utilization = (
            sum(m.space_utilization_pct or 0.0 for m in metrics_data) / 
            len(metrics_data)
            if metrics_data else 0.0
        )

        return DashboardMetrics(
            air_temperature=latest_metrics.air_temperature if latest_metrics else 22.0,
            humidity=latest_metrics.humidity if latest_metrics else 65.0,
            co2=latest_metrics.co2 if latest_metrics else 400.0,
            yield_metrics=OverviewYieldMetrics(
                average=avg_yield,
                total=total_yield,
                chart_data=yield_chart_data
            ),
            space_utilization=SpaceUtilizationMetrics(
                nursery_station=avg_utilization * 0.6,  # Mock split
                cultivation_area=avg_utilization * 0.4,
                chart_data=utilization_chart_data
            )
        )

    async def _build_crops_summary(self, container_id: int) -> List[CropSummary]:
        """Build crops summary (placeholder implementation)."""
        # TODO: Implement with actual crop data
        return [
            CropSummary(
                seed_type="Lettuce",
                nursery_station_count=15,
                cultivation_area_count=8,
                last_seeding_date="2025-07-01",
                last_transplanting_date="2025-07-05",
                last_harvesting_date="2025-07-07",
                average_age=14,
                overdue_count=2
            )
        ]

    async def _build_recent_activity(self, container_id: int) -> List[ActivityLogEntry]:
        """Build recent activity logs."""
        activities = await self.repository.get_recent_activity_logs(
            container_id, limit=10
        )
        
        return [
            ActivityLogEntry(
                id=activity.id,
                container_id=activity.container_id,
                timestamp=(
                    activity.timestamp.isoformat() if activity.timestamp 
                    else datetime.now().isoformat()
                ),
                action_type=activity.action_type or "unknown",
                actor_type=activity.actor_type or "system",
                actor_id=activity.actor_id or "unknown",
                description=activity.description or "No description"
            )
            for activity in activities
        ]

    async def get_activity_logs(
        self,
        container_id: int,
        page: int = 1,
        limit: int = 20,
        *,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        action_type: Optional[str] = None,
        actor_type: Optional[str] = None
    ) -> Tuple[List[ActivityLogEntry], int]:
        """Get paginated activity logs."""
        try:
            activities, total = await self.repository.get_activity_logs(
                container_id, page, limit, start_date, end_date, 
                action_type, actor_type
            )
            
            activity_entries = [
                ActivityLogEntry(
                    id=activity.id,
                    container_id=activity.container_id,
                    timestamp=(
                        activity.timestamp.isoformat() if activity.timestamp 
                        else datetime.now().isoformat()
                    ),
                    action_type=activity.action_type or "unknown",
                    actor_type=activity.actor_type or "system",
                    actor_id=activity.actor_id or "unknown",
                    description=activity.description or "No description"
                )
                for activity in activities
            ]
            
            return activity_entries, total

        except Exception as e:
            logger.error(
                f"Error getting activity logs for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def create_activity_log(
        self, container_id: int, activity_data: ActivityLogCreate
    ) -> ActivityLogEntry:
        """Create a new activity log entry."""
        try:
            activity_orm = await self.repository.create_activity_log(
                container_id, activity_data.model_dump()
            )
            
            return ActivityLogEntry(
                id=activity_orm.id,
                container_id=activity_orm.container_id,
                timestamp=(
                    activity_orm.timestamp.isoformat() if activity_orm.timestamp 
                    else datetime.now().isoformat()
                ),
                action_type=activity_orm.action_type or "unknown",
                actor_type=activity_orm.actor_type or "system",
                actor_id=activity_orm.actor_id or "unknown",
                description=activity_orm.description or "No description"
            )

        except Exception as e:
            logger.error(
                f"Error creating activity log for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def get_metric_snapshots(
        self,
        container_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        interval: str = "day"
    ) -> List[MetricSnapshotEntry]:
        """Get metric snapshots."""
        try:
            snapshots = await self.repository.get_metric_snapshots(
                container_id, start_date, end_date, interval
            )
            
            return [
                MetricSnapshotEntry(
                    id=snapshot.id,
                    container_id=snapshot.container_id,
                    timestamp=(
                        snapshot.timestamp.isoformat() if snapshot.timestamp 
                        else datetime.now().isoformat()
                    ),
                    air_temperature=snapshot.air_temperature,
                    humidity=snapshot.humidity,
                    co2=snapshot.co2,
                    yield_kg=snapshot.yield_kg,
                    space_utilization_pct=snapshot.space_utilization_pct
                )
                for snapshot in snapshots
            ]

        except Exception as e:
            logger.error(
                f"Error getting metric snapshots for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def create_metric_snapshot(
        self, container_id: int, snapshot_data: MetricSnapshotCreate
    ) -> MetricSnapshotEntry:
        """Create a new metric snapshot."""
        try:
            snapshot_orm = await self.repository.create_metric_snapshot(
                container_id, snapshot_data.model_dump()
            )
            
            return MetricSnapshotEntry(
                id=snapshot_orm.id,
                container_id=snapshot_orm.container_id,
                timestamp=(
                    snapshot_orm.timestamp.isoformat() if snapshot_orm.timestamp 
                    else datetime.now().isoformat()
                ),
                air_temperature=snapshot_orm.air_temperature,
                humidity=snapshot_orm.humidity,
                co2=snapshot_orm.co2,
                yield_kg=snapshot_orm.yield_kg,
                space_utilization_pct=snapshot_orm.space_utilization_pct
            )

        except Exception as e:
            logger.error(
                f"Error creating metric snapshot for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def get_container_snapshots(
        self,
        container_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 100
    ) -> List[ContainerSnapshotEntry]:
        """Get container snapshots."""
        try:
            snapshots = await self.repository.get_container_snapshots(
                container_id, start_date, end_date, limit
            )
            
            return [
                ContainerSnapshotEntry(
                    id=snapshot.id,
                    container_id=snapshot.container_id,
                    timestamp=(
                        snapshot.timestamp.isoformat() if snapshot.timestamp 
                        else datetime.now().isoformat()
                    ),
                    type=snapshot.type,
                    status=snapshot.status,
                    tenant_id=snapshot.tenant_id,
                    purpose=snapshot.purpose,
                    location=snapshot.location,
                    shadow_service_enabled=snapshot.shadow_service_enabled,
                    copied_environment_from=snapshot.copied_environment_from,
                    robotics_simulation_enabled=snapshot.robotics_simulation_enabled,
                    ecosystem_settings=snapshot.ecosystem_settings,
                    yield_kg=snapshot.yield_kg,
                    space_utilization_pct=snapshot.space_utilization_pct,
                    tray_ids=snapshot.tray_ids,
                    panel_ids=snapshot.panel_ids
                )
                for snapshot in snapshots
            ]

        except Exception as e:
            logger.error(
                f"Error getting container snapshots for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def create_container_snapshot(
        self, container_id: int, snapshot_data: ContainerSnapshotCreate
    ) -> ContainerSnapshotEntry:
        """Create a new container snapshot."""
        try:
            snapshot_orm = await self.repository.create_container_snapshot(
                container_id, snapshot_data.model_dump()
            )
            
            return ContainerSnapshotEntry(
                id=snapshot_orm.id,
                container_id=snapshot_orm.container_id,
                timestamp=(
                    snapshot_orm.timestamp.isoformat() if snapshot_orm.timestamp 
                    else datetime.now().isoformat()
                ),
                type=snapshot_orm.type,
                status=snapshot_orm.status,
                tenant_id=snapshot_orm.tenant_id,
                purpose=snapshot_orm.purpose,
                location=snapshot_orm.location,
                shadow_service_enabled=snapshot_orm.shadow_service_enabled,
                copied_environment_from=snapshot_orm.copied_environment_from,
                robotics_simulation_enabled=snapshot_orm.robotics_simulation_enabled,
                ecosystem_settings=snapshot_orm.ecosystem_settings,
                yield_kg=snapshot_orm.yield_kg,
                space_utilization_pct=snapshot_orm.space_utilization_pct,
                tray_ids=snapshot_orm.tray_ids,
                panel_ids=snapshot_orm.panel_ids
            )

        except Exception as e:
            logger.error(
                f"Error creating container snapshot for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def update_container_settings(
        self, container_id: int, settings_data: ContainerSettingsUpdate
    ) -> ContainerSettingsUpdateResponse:
        """Update container settings."""
        try:
            success = await self.repository.update_container_settings(
                container_id, settings_data.model_dump()
            )
            
            return ContainerSettingsUpdateResponse(
                success=success,
                message=(
                    "Container settings updated successfully" if success 
                    else "Failed to update container settings"
                ),
                updated_at=datetime.now().isoformat()
            )

        except Exception as e:
            logger.error(
                f"Error updating container settings for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def get_environment_links(self, container_id: int) -> EnvironmentLinks:
        """Get environment links for a container."""
        try:
            links_orm = await self.repository.get_environment_links(container_id)
            
            if links_orm:
                return EnvironmentLinks(
                    container_id=links_orm.container_id,
                    fa=links_orm.fa,
                    pya=links_orm.pya,
                    aws=links_orm.aws,
                    mbai=links_orm.mbai,
                    fh=links_orm.fh
                )
            
            # Return empty links if none exist
            return EnvironmentLinks(
                container_id=container_id,
                fa=None,
                pya=None,
                aws=None,
                mbai=None,
                fh=None
            )

        except Exception as e:
            logger.error(
                f"Error getting environment links for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def update_environment_links(
        self, container_id: int, links_data: EnvironmentLinksUpdate
    ) -> EnvironmentLinksUpdateResponse:
        """Update environment links for a container."""
        try:
            await self.repository.update_environment_links(
                container_id, links_data.model_dump()
            )
            
            return EnvironmentLinksUpdateResponse(
                success=True,
                message="Environment links updated successfully",
                updated_at=datetime.now().isoformat()
            )

        except Exception as e:
            logger.error(
                f"Error updating environment links for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def get_dashboard_summary(self, container_id: int) -> DashboardSummary:
        """Get aggregated summary data for overview dashboard."""
        try:
            # Get latest metrics
            latest_metrics = await self.repository.get_latest_metrics(container_id)
            
            # Get activity count
            _, total_activities = await self.repository.get_activity_logs(
                container_id, page=1, limit=1
            )
            
            current_metrics = {
                "air_temperature": (
                    latest_metrics.air_temperature if latest_metrics else 22.0
                ),
                "humidity": latest_metrics.humidity if latest_metrics else 65.0,
                "co2": latest_metrics.co2 if latest_metrics else 400.0,
                "yield_kg": latest_metrics.yield_kg if latest_metrics else 0.0,
                "space_utilization_pct": (
                    latest_metrics.space_utilization_pct if latest_metrics else 0.0
                )
            }
            
            crop_counts = {
                "total_crops": 23,  # TODO: Get from actual crop data
                "nursery_crops": 15,
                "cultivation_crops": 8,
                "overdue_crops": 2
            }
            
            return DashboardSummary(
                current_metrics=current_metrics,
                crop_counts=crop_counts,
                activity_count=total_activities,
                last_updated=datetime.now().isoformat()
            )

        except Exception as e:
            logger.error(
                f"Error getting dashboard summary for container {container_id}: {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=ErrorMessages.INTERNAL_SERVER_ERROR
            ) from e

    async def get_cultivation_area_layout(self, container_id: int) -> dict:
        """Get cultivation area layout and utilization."""
        try:
            # Mock implementation - in real app, this would fetch from database
            return {
                "utilization_summary": {
                    "total_utilization_percentage": 65.0
                },
                "layout": {
                    "wall_1": [
                        {"slot_number": 1, "panel": {"id": 1, "rfid_tag": "PANEL001", "location": {"wall": "wall_1", "slot_number": 1}, "utilization_pct": 75.0, "capacity": 15}},
                        {"slot_number": 2, "panel": None}
                    ],
                    "wall_2": [],
                    "wall_3": [],
                    "wall_4": []
                },
                "off_wall_panels": [
                    {"id": 4, "rfid_tag": "PANEL004", "status": "storage"}
                ]
            }
        except Exception as e:
            logger.error(f"Error getting cultivation area layout: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get cultivation area layout"
            ) from e

    async def get_panels_for_container(self, container_id: int, status_filter: Optional[str] = None) -> List[dict]:
        """Get all panels for a container."""
        try:
            from sqlalchemy import select
            from app.models.panel import Panel
            
            query = select(Panel).where(Panel.container_id == container_id)
            if status_filter:
                query = query.where(Panel.status == status_filter)
            
            result = await self.db.execute(query)
            panels = result.scalars().all()
            
            return [
                {
                    "id": panel.id,
                    "container_id": panel.container_id,
                    "rfid_tag": panel.rfid_tag,
                    "location": panel.location,
                    "utilization_pct": panel.utilization_pct,
                    "status": panel.status,
                    "capacity": panel.capacity,
                    "panel_type": panel.panel_type
                }
                for panel in panels
            ]
        except Exception as e:
            logger.error(f"Error getting panels for container: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get panels"
            ) from e

    async def get_panel_snapshots(self, container_id: int) -> List[dict]:
        """Get panel snapshots for a container."""
        try:
            from sqlalchemy import select
            from app.models.snapshots import PanelSnapshot
            
            query = select(PanelSnapshot).where(PanelSnapshot.container_id == container_id)
            result = await self.db.execute(query)
            snapshots = result.scalars().all()
            
            return [
                {
                    "id": snapshot.id,
                    "timestamp": snapshot.timestamp.isoformat(),
                    "container_id": snapshot.container_id,
                    "rfid_tag": snapshot.rfid_tag,
                    "location": snapshot.location,
                    "crop_count": snapshot.crop_count,
                    "utilization_percentage": snapshot.utilization_percentage,
                    "status": snapshot.status
                }
                for snapshot in snapshots
            ]
        except Exception as e:
            logger.error(f"Error getting panel snapshots: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get panel snapshots"
            ) from e

    async def create_panel_snapshot(self, container_id: int, snapshot_data: dict) -> dict:
        """Create a new panel snapshot."""
        try:
            from app.models.snapshots import PanelSnapshot
            
            snapshot = PanelSnapshot(
                container_id=container_id,
                rfid_tag=snapshot_data["rfid_tag"],
                location=snapshot_data["location"],
                crop_count=snapshot_data["crop_count"],
                utilization_percentage=snapshot_data["utilization_percentage"],
                status=snapshot_data["status"],
                timestamp=datetime.now()
            )
            
            self.db.add(snapshot)
            await self.db.commit()
            await self.db.refresh(snapshot)
            
            return {
                "id": snapshot.id,
                "timestamp": snapshot.timestamp.isoformat(),
                "container_id": snapshot.container_id,
                "rfid_tag": snapshot.rfid_tag,
                "location": snapshot.location,
                "crop_count": snapshot.crop_count,
                "utilization_percentage": snapshot.utilization_percentage,
                "status": snapshot.status
            }
        except Exception as e:
            logger.error(f"Error creating panel snapshot: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create panel snapshot"
            ) from e

    async def get_available_panel_slots(self, container_id: int) -> dict:
        """Get available panel slots in cultivation area."""
        try:
            # Mock implementation - generate available slots
            available_slots = []
            for wall in ["wall_1", "wall_2", "wall_3", "wall_4"]:
                for slot in range(1, 23):  # 22 slots per wall
                    available_slots.append({
                        "wall": wall,
                        "slot_number": slot,
                        "location_description": f"{wall.replace('_', ' ').title()} - Slot {slot}"
                    })
            
            # Remove occupied slots (mock - first 3 slots on wall_1)
            occupied_slots = [
                {"wall": "wall_1", "slot_number": 1},
                {"wall": "wall_1", "slot_number": 2},
                {"wall": "wall_2", "slot_number": 5}
            ]
            
            available_slots = [
                slot for slot in available_slots
                if not any(
                    slot["wall"] == occ["wall"] and slot["slot_number"] == occ["slot_number"]
                    for occ in occupied_slots
                )
            ]
            
            return {"available_slots": available_slots}
        except Exception as e:
            logger.error(f"Error getting available slots: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get available slots"
            ) from e

    async def get_cultivation_area_summary(self, container_id: int) -> dict:
        """Get cultivation area summary."""
        try:
            return {
                "total_slots": 88,  # 4 walls * 22 slots each
                "occupied_slots": 3,
                "utilization_percentage": 3.4,  # 3/88 * 100
                "total_panels": 4,
                "off_wall_panels": 1,
                "total_crops": 28,
                "overdue_crops": 2,
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting cultivation area summary: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get cultivation area summary"
            ) from e

    async def get_provisioning_context(self, container_id: int) -> dict:
        """Get provisioning context for container."""
        try:
            # Mock implementation
            return {
                "container_id": container_id,
                "available_locations": ["nursery-station", "cultivation-area"],
                "current_inventory": {"panels": 4, "trays": 12}
            }
        except Exception as e:
            logger.error(f"Error getting provisioning context: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get provisioning context"
            ) from e

    async def get_location_details(self, container_id: int, location_type: str, location: str) -> dict:
        """Get location details for provisioning."""
        try:
            # Mock implementation
            return {
                "container_id": container_id,
                "location_type": location_type,
                "location": location,
                "capacity": 15,
                "current_utilization": 0
            }
        except Exception as e:
            logger.error(f"Error getting location details: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get location details"
            ) from e

    async def get_provisioning_summary(self, container_id: int, days: int) -> dict:
        """Get provisioning summary."""
        try:
            # Mock implementation
            return {
                "container_id": container_id,
                "days": days,
                "recent_activities": [],
                "summary": {"total_provisioned": 0, "total_moved": 0}
            }
        except Exception as e:
            logger.error(f"Error getting provisioning summary: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get provisioning summary"
            ) from e
