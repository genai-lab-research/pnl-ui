"""Container repository with simplified model structure."""

from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import and_, asc, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.container import Container
from app.models.alert import Alert
from app.models.seed_type import SeedType
from app.models.activity_log import ActivityLog
from app.models.snapshots import MetricSnapshot, ContainerSnapshot
from app.models.environment_link import EnvironmentLink
from app.models.tenant import Tenant
from app.repositories.base import BaseRepository
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerFilterCriteria


class ContainerRepository(BaseRepository[Container, ContainerCreate, ContainerUpdate]):
    """Container repository with simplified model structure."""

    def __init__(self, db: AsyncSession):
        super().__init__(Container, db)

    async def get_with_relationships(self, container_id: int) -> Optional[Container]:
        """Get container with all relationships loaded."""
        result = await self.db.execute(
            select(Container)
            .options(
                selectinload(Container.seed_types),
                selectinload(Container.alerts),
                selectinload(Container.tenant),
                selectinload(Container.metric_snapshots)
            )
            .where(Container.id == container_id)
        )
        return result.scalar_one_or_none()
    
    async def get_with_relationships_detached(self, container_id: int) -> Optional[Container]:
        """Get container with all relationships loaded and detached from session."""
        container = await self.get_with_relationships(container_id)
        if container:
            # Force load all relationships before expunging
            _ = container.seed_types  # Force load seed_types
            _ = container.alerts      # Force load alerts
            if hasattr(container, 'metric_snapshots'):
                _ = container.metric_snapshots  # Force load metric_snapshots
            
            # Expunge the object to detach it from the session
            self.db.expunge(container)
        
        return container

    async def get_all_with_relationships(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Container]:
        """Get all containers with relationships."""
        result = await self.db.execute(
            select(Container)
            .options(
                selectinload(Container.seed_types),
                selectinload(Container.alerts),
                selectinload(Container.tenant),
                selectinload(Container.metric_snapshots)
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_filtered(
        self,
        filters: ContainerFilterCriteria,
        skip: int = 0,
        limit: int = 100,
        load_relationships: bool = True
    ) -> Tuple[List[Container], int]:
        """Get filtered containers with total count."""
        
        # Build the base query
        query = select(Container)
        
        if load_relationships:
            query = query.options(
                selectinload(Container.seed_types),
                selectinload(Container.alerts),
                selectinload(Container.tenant),
                selectinload(Container.metric_snapshots)
            )
        
        # Apply filters
        conditions = []
        
        if filters.search:
            search_term = f"%{filters.search}%"
            conditions.append(
                or_(
                    Container.name.ilike(search_term),
                    Container.notes.ilike(search_term)
                )
            )
        
        if filters.type:
            conditions.append(Container.type == filters.type)
        
        if filters.tenant:
            conditions.append(Container.tenant_id == filters.tenant)
        
        if filters.purpose:
            conditions.append(Container.purpose == filters.purpose)
        
        if filters.status:
            conditions.append(Container.status == filters.status)
        
        if filters.alerts is not None:
            if filters.alerts:
                # Has alerts
                conditions.append(Container.alerts.any())
            else:
                # No alerts
                conditions.append(~Container.alerts.any())
        
        # Apply conditions
        if conditions:
            query = query.where(and_(*conditions))
        
        # Apply sorting
        sort_column = getattr(Container, filters.sort, Container.name)
        if filters.order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
        
        # Get total count (without pagination)
        count_query = select(func.count(Container.id))
        if conditions:
            count_query = count_query.where(and_(*conditions))
        
        total_count = await self.db.scalar(count_query) or 0
        
        # Apply pagination - use filters if available, otherwise use parameters
        if hasattr(filters, 'page') and hasattr(filters, 'limit'):
            skip = (filters.page - 1) * filters.limit
            limit = filters.limit
        
        query = query.offset(skip).limit(limit)
        
        # Execute query
        result = await self.db.execute(query)
        containers = result.scalars().all()
        
        # Force load relationships for all containers before expunging (only if requested)
        if load_relationships:
            for container in containers:
                _ = container.seed_types  # Force load seed_types
                _ = container.alerts      # Force load alerts
                if hasattr(container, 'metric_snapshots'):
                    _ = container.metric_snapshots  # Force load metric_snapshots
        
        # Expunge all containers from session
        for container in containers:
            self.db.expunge(container)
        
        return containers, total_count

    async def get_by_tenant(
        self, 
        tenant_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Container]:
        """Get containers by tenant with relationships."""
        result = await self.db.execute(
            select(Container)
            .options(
                selectinload(Container.seed_types),
                selectinload(Container.alerts),
                selectinload(Container.tenant),
                selectinload(Container.metric_snapshots)
            )
            .where(Container.tenant_id == tenant_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_with_alerts(
        self, 
        active_only: bool = True, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Container]:
        """Get containers that have alerts."""
        query = (
            select(Container)
            .options(
                selectinload(Container.seed_types),
                selectinload(Container.alerts),
                selectinload(Container.tenant),
                selectinload(Container.metric_snapshots)
            )
            .join(Alert)
        )
        
        if active_only:
            query = query.where(Alert.active == True)
        
        query = query.offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_metrics_data(
        self,
        container_type: Optional[str] = None,
        container_ids: Optional[List[int]] = None
    ) -> List[Container]:
        """Get containers for metrics calculation."""
        from sqlalchemy.orm import selectinload
        
        query = select(Container).options(
            selectinload(Container.metric_snapshots),
            selectinload(Container.alerts)
        )
        
        conditions = []
        
        # Only include active and maintenance containers for metrics
        conditions.append(Container.status.in_(["active", "maintenance"]))
        
        if container_type:
            conditions.append(Container.type == container_type)
        
        if container_ids:
            conditions.append(Container.id.in_(container_ids))
        
        query = query.where(and_(*conditions))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_with_relationships(self, container_data: ContainerCreate) -> Container:
        """Create a container with all its relationships."""
        # Create the container with all fields directly
        container_dict = container_data.model_dump(exclude={"seed_type_ids"})
        container = Container(**container_dict)
        
        # Add seed types if provided
        if container_data.seed_type_ids:
            seed_types = await self.db.execute(
                select(SeedType).where(SeedType.id.in_(container_data.seed_type_ids))
            )
            container.seed_types = seed_types.scalars().all()
        
        self.db.add(container)
        await self.db.commit()
        await self.db.refresh(container)
        
        # Get the container with all relationships loaded and detached
        return await self.get_with_relationships_detached(container.id)

    async def update_with_relationships(
        self,
        container_id: int,
        container_data: ContainerUpdate
    ) -> Optional[Container]:
        """Update a container with its relationships."""
        container = await self.get_with_relationships(container_id)
        if not container:
            return None
        
        # Update basic fields
        container_dict = container_data.model_dump(
            exclude={"seed_type_ids"},
            exclude_unset=True
        )
        
        for field, value in container_dict.items():
            if hasattr(container, field):
                setattr(container, field, value)
        
        # Update seed types if provided
        if container_data.seed_type_ids is not None:
            seed_types = await self.db.execute(
                select(SeedType).where(SeedType.id.in_(container_data.seed_type_ids))
            )
            container.seed_types = seed_types.scalars().all()
        
        await self.db.commit()
        await self.db.refresh(container)
        
        # Return the updated container with all relationships loaded and detached
        return await self.get_with_relationships_detached(container.id)

    async def get_filter_options(self) -> Dict[str, Any]:
        """Get available filter options."""
        # Get unique values for filter dropdowns
        types_result = await self.db.execute(
            select(Container.type).distinct().where(Container.type.is_not(None))
        )
        types = [row[0] for row in types_result.fetchall()]
        
        purposes_result = await self.db.execute(
            select(Container.purpose).distinct().where(Container.purpose.is_not(None))
        )
        purposes = [row[0] for row in purposes_result.fetchall()]
        
        statuses_result = await self.db.execute(
            select(Container.status).distinct().where(Container.status.is_not(None))
        )
        statuses = [row[0] for row in statuses_result.fetchall()]
        
        # Get tenant info
        from app.models.tenant import Tenant
        tenants_result = await self.db.execute(
            select(Tenant.id, Tenant.name).order_by(Tenant.name)
        )
        tenants = [{"id": row[0], "name": row[1]} for row in tenants_result.fetchall()]
        
        return {
            "types": types,
            "purposes": purposes,
            "statuses": statuses,
            "tenants": tenants,
            "sort_options": ["name", "type", "status", "created_at", "updated_at"]
        }

    async def get_distinct_values(self, field: str) -> List[str]:
        """Get distinct values for a field."""
        try:
            column = getattr(Container, field)
            result = await self.db.execute(
                select(column).distinct().where(column.is_not(None))
            )
            return [row[0] for row in result.fetchall()]
        except AttributeError:
            # Return empty list for invalid fields
            return []

    async def get_tenant_options(self) -> List[Dict[str, Any]]:
        """Get tenant options for filters."""
        from app.models.tenant import Tenant
        result = await self.db.execute(
            select(Tenant.id, Tenant.name).order_by(Tenant.name)
        )
        return [{"id": row[0], "name": row[1]} for row in result.fetchall()]

    async def get_containers_with_alerts(self) -> List[Container]:
        """Get containers that have active alerts."""
        result = await self.db.execute(
            select(Container)
            .options(
                selectinload(Container.seed_types),
                selectinload(Container.alerts),
                selectinload(Container.tenant),
                selectinload(Container.metric_snapshots)
            )
            .join(Alert)
            .where(Alert.active == True)
        )
        return result.scalars().all()

    async def shutdown_container(self, container_id: int) -> bool:
        """Shutdown a container by setting its status to inactive."""
        try:
            container = await self.get(container_id)
            if not container:
                return False
            
            container.status = "inactive"
            await self.db.commit()
            return True
        except Exception:
            await self.db.rollback()
            return False

    # Container Overview Tab Repository Methods
    async def get_activity_logs(
        self,
        container_id: int,
        page: int = 1,
        limit: int = 20,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        action_type: Optional[str] = None,
        actor_type: Optional[str] = None
    ) -> Tuple[List[ActivityLog], int]:
        """Get paginated activity logs for a container with optional filters."""
        query = select(ActivityLog).where(ActivityLog.container_id == container_id)
        
        # Apply filters
        if start_date:
            query = query.where(ActivityLog.timestamp >= start_date)
        if end_date:
            query = query.where(ActivityLog.timestamp <= end_date)
        if action_type:
            query = query.where(ActivityLog.action_type == action_type)
        if actor_type:
            query = query.where(ActivityLog.actor_type == actor_type)
        
        # Count total records
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        offset = (page - 1) * limit
        query = query.order_by(desc(ActivityLog.timestamp)).offset(offset).limit(limit)
        
        result = await self.db.execute(query)
        activities = result.scalars().all()
        
        return activities, total

    async def create_activity_log(self, container_id: int, activity_data: dict) -> ActivityLog:
        """Create a new activity log entry."""
        from datetime import datetime
        
        activity = ActivityLog(
            container_id=container_id,
            timestamp=datetime.now(),
            **activity_data
        )
        self.db.add(activity)
        await self.db.commit()
        await self.db.refresh(activity)
        return activity

    async def get_metric_snapshots(
        self,
        container_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        interval: str = "day"
    ) -> List[MetricSnapshot]:
        """Get metric snapshots for a container with optional date filters."""
        query = select(MetricSnapshot).where(MetricSnapshot.container_id == container_id)
        
        if start_date:
            query = query.where(MetricSnapshot.timestamp >= start_date)
        if end_date:
            query = query.where(MetricSnapshot.timestamp <= end_date)
        
        # Order by timestamp descending
        query = query.order_by(desc(MetricSnapshot.timestamp))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_metric_snapshot(self, container_id: int, snapshot_data: dict) -> MetricSnapshot:
        """Create a new metric snapshot."""
        from datetime import datetime
        
        snapshot = MetricSnapshot(
            container_id=container_id,
            timestamp=datetime.now(),
            **snapshot_data
        )
        self.db.add(snapshot)
        await self.db.commit()
        await self.db.refresh(snapshot)
        return snapshot

    async def get_container_snapshots(
        self,
        container_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 100
    ) -> List[ContainerSnapshot]:
        """Get container snapshots for historical tracking."""
        query = select(ContainerSnapshot).where(ContainerSnapshot.container_id == container_id)
        
        if start_date:
            query = query.where(ContainerSnapshot.timestamp >= start_date)
        if end_date:
            query = query.where(ContainerSnapshot.timestamp <= end_date)
        
        query = query.order_by(desc(ContainerSnapshot.timestamp)).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_container_snapshot(self, container_id: int, snapshot_data: dict) -> ContainerSnapshot:
        """Create a new container snapshot."""
        from datetime import datetime
        
        snapshot = ContainerSnapshot(
            container_id=container_id,
            timestamp=datetime.now(),
            **snapshot_data
        )
        self.db.add(snapshot)
        await self.db.commit()
        await self.db.refresh(snapshot)
        return snapshot

    async def get_environment_links(self, container_id: int) -> Optional[EnvironmentLink]:
        """Get environment links for a container."""
        result = await self.db.execute(
            select(EnvironmentLink).where(EnvironmentLink.container_id == container_id)
        )
        return result.scalar_one_or_none()

    async def update_environment_links(self, container_id: int, links_data: dict) -> EnvironmentLink:
        """Update environment links for a container."""
        # Try to get existing links
        existing_links = await self.get_environment_links(container_id)
        
        if existing_links:
            # Update existing links
            for field, value in links_data.items():
                if hasattr(existing_links, field):
                    setattr(existing_links, field, value)
            await self.db.commit()
            await self.db.refresh(existing_links)
            return existing_links
        else:
            # Create new links
            new_links = EnvironmentLink(
                container_id=container_id,
                **links_data
            )
            self.db.add(new_links)
            await self.db.commit()
            await self.db.refresh(new_links)
            return new_links

    async def update_container_settings(self, container_id: int, settings_data: dict) -> bool:
        """Update container settings from overview tab."""
        try:
            container = await self.get(container_id)
            if not container:
                return False
            
            # Update container fields
            for field, value in settings_data.items():
                if hasattr(container, field):
                    setattr(container, field, value)
            
            await self.db.commit()
            return True
        except Exception:
            await self.db.rollback()
            return False

    async def get_container_with_tenant(self, container_id: int) -> Optional[Container]:
        """Get container with tenant information for overview."""
        result = await self.db.execute(
            select(Container)
            .options(selectinload(Container.tenant))
            .where(Container.id == container_id)
        )
        return result.scalar_one_or_none()

    async def get_recent_activity_logs(self, container_id: int, limit: int = 10) -> List[ActivityLog]:
        """Get recent activity logs for container overview."""
        result = await self.db.execute(
            select(ActivityLog)
            .where(ActivityLog.container_id == container_id)
            .order_by(desc(ActivityLog.timestamp))
            .limit(limit)
        )
        return result.scalars().all()

    async def get_latest_metrics(self, container_id: int) -> Optional[MetricSnapshot]:
        """Get the latest metric snapshot for a container."""
        result = await self.db.execute(
            select(MetricSnapshot)
            .where(MetricSnapshot.container_id == container_id)
            .order_by(desc(MetricSnapshot.timestamp))
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def get_metrics_for_time_range(
        self,
        container_id: int,
        time_range: str = "week"
    ) -> List[MetricSnapshot]:
        """Get metrics for a specific time range."""
        from datetime import datetime, timedelta
        
        # Calculate date range
        now = datetime.now()
        if time_range == "week":
            start_date = now - timedelta(days=7)
        elif time_range == "month":
            start_date = now - timedelta(days=30)
        elif time_range == "quarter":
            start_date = now - timedelta(days=90)
        elif time_range == "year":
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=7)  # Default to week
        
        result = await self.db.execute(
            select(MetricSnapshot)
            .where(
                and_(
                    MetricSnapshot.container_id == container_id,
                    MetricSnapshot.timestamp >= start_date
                )
            )
            .order_by(MetricSnapshot.timestamp)
        )
        return result.scalars().all()