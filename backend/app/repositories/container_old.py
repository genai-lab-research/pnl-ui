"""Container repository with advanced filtering and search capabilities."""

from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import and_, asc, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.container import Container
from app.models.alert import Alert
from app.models.seed_type import SeedType
from app.repositories.base import BaseRepository
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerFilterCriteria


class ContainerRepository(BaseRepository[Container, ContainerCreate, ContainerUpdate]):
    """Container repository with advanced filtering and search."""

    def __init__(self, db: AsyncSession):
        super().__init__(Container, db)

    async def get_with_relationships(self, container_id: int) -> Optional[Container]:
        """Get container with all relationships loaded."""
        query = select(Container).where(Container.id == container_id)
        
        # Load all relationships to avoid N+1 queries
        query = query.options(
            selectinload(Container.seed_types),
            selectinload(Container.settings),
            selectinload(Container.environment),
            selectinload(Container.inventory),
            selectinload(Container.metrics),
            selectinload(Container.alerts)
        )
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_filtered(
        self,
        filters: ContainerFilterCriteria,
        load_relationships: bool = True
    ) -> Tuple[List[Container], int]:
        """Get containers with filtering, search, pagination, and sorting."""
        # Base query with relationships
        query = select(Container)
        count_query = select(func.count(Container.id))
        
        # Apply filters
        where_conditions = []
        
        # Search across multiple fields
        if filters.search:
            search_term = f"%{filters.search.lower()}%"
            search_conditions = [
                func.lower(Container.name).contains(search_term),
                func.lower(Container.type).contains(search_term),
                func.lower(Container.purpose).contains(search_term),
                func.lower(Container.status).contains(search_term),
            ]
            where_conditions.append(or_(*search_conditions))
        
        # Type filter
        if filters.type:
            where_conditions.append(Container.type == filters.type)
        
        # Tenant filter
        if filters.tenant:
            where_conditions.append(Container.tenant_id == filters.tenant)
        
        # Purpose filter
        if filters.purpose:
            where_conditions.append(Container.purpose == filters.purpose)
        
        # Status filter
        if filters.status:
            where_conditions.append(Container.status == filters.status)
        
        # Alerts filter
        if filters.alerts is not None:
            if filters.alerts:
                # Has alerts
                query = query.join(Alert, Container.id == Alert.container_id)
                query = query.where(Alert.active == True)
                count_query = count_query.join(Alert, Container.id == Alert.container_id)
                count_query = count_query.where(Alert.active == True)
            else:
                # No alerts
                subquery = select(Alert.container_id).where(Alert.active == True)
                where_conditions.append(Container.id.notin_(subquery))
        
        # Apply all where conditions
        if where_conditions:
            query = query.where(and_(*where_conditions))
            count_query = count_query.where(and_(*where_conditions))
        
        # Get total count
        total_count = await self.db.execute(count_query)
        total = total_count.scalar()
        
        # Apply sorting
        if hasattr(Container, filters.sort):
            order_column = getattr(Container, filters.sort)
            if filters.order == "desc":
                query = query.order_by(desc(order_column))
            else:
                query = query.order_by(asc(order_column))
        
        # Apply pagination
        offset = (filters.page - 1) * filters.limit
        query = query.offset(offset).limit(filters.limit)
        
        # Load relationships if requested
        if load_relationships:
            query = query.options(
                selectinload(Container.seed_types),
                selectinload(Container.settings),
                selectinload(Container.environment),
                selectinload(Container.inventory),
                selectinload(Container.metrics),
                selectinload(Container.alerts)
            )
        
        result = await self.db.execute(query)
        containers = result.scalars().all()
        
        return containers, total

    async def get_metrics_data(
        self,
        container_type: Optional[str] = None,
        container_ids: Optional[List[int]] = None
    ) -> List[Container]:
        """Get containers with metrics for performance calculations."""
        query = select(Container).options(
            selectinload(Container.metrics),
            selectinload(Container.alerts)
        )
        
        where_conditions = []
        
        if container_type:
            where_conditions.append(Container.type == container_type)
        
        if container_ids:
            where_conditions.append(Container.id.in_(container_ids))
        
        # Only include active containers for metrics
        where_conditions.append(Container.status.in_(["active", "maintenance"]))
        
        if where_conditions:
            query = query.where(and_(*where_conditions))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_distinct_values(self, field: str) -> List[str]:
        """Get distinct values for a field (for filter options)."""
        if not hasattr(Container, field):
            return []
        
        query = select(getattr(Container, field)).distinct()
        result = await self.db.execute(query)
        return [value for value in result.scalars().all() if value]

    async def get_tenant_options(self) -> List[Dict[str, Any]]:
        """Get distinct tenant options with names."""
        query = select(Container.tenant_id).distinct()
        result = await self.db.execute(query)
        tenant_ids = result.scalars().all()
        
        # For now, return tenant IDs as names (in a real app, you'd join with a tenants table)
        return [
            {"id": tenant_id, "name": f"Tenant {tenant_id}"}
            for tenant_id in tenant_ids
        ]

    async def shutdown_container(self, container_id: int) -> bool:
        """Shutdown a container by setting its status to inactive."""
        container = await self.get(container_id)
        if not container:
            return False
        
        container.status = "inactive"
        await self.db.commit()
        await self.db.refresh(container)
        return True

    async def get_containers_with_alerts(self) -> List[Container]:
        """Get containers that have active alerts."""
        query = select(Container).join(Alert).where(Alert.active == True).options(
            selectinload(Container.alerts)
        )
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_with_relationships(self, container_data: ContainerCreate) -> Container:
        """Create a container with all its relationships."""
        # Create the related entities first
        settings = ContainerSettings(**container_data.settings.model_dump())
        environment = ContainerEnvironment(**container_data.environment.model_dump())
        inventory = ContainerInventory(**container_data.inventory.model_dump())
        metrics = ContainerMetrics(**container_data.metrics.model_dump())
        
        # Add related entities to session
        self.db.add_all([settings, environment, inventory, metrics])
        await self.db.flush()  # Flush to get IDs
        
        # Create the container
        container_dict = container_data.model_dump(exclude={"settings", "environment", "inventory", "metrics", "seed_type_ids"})
        container = Container(
            **container_dict,
            settings_id=settings.id,
            environment_id=environment.id,
            inventory_id=inventory.id,
            metrics_id=metrics.id
        )
        
        # Add seed types if provided
        if container_data.seed_type_ids:
            seed_types = await self.db.execute(
                select(SeedType).where(SeedType.id.in_(container_data.seed_type_ids))
            )
            container.seed_types = seed_types.scalars().all()
        
        self.db.add(container)
        await self.db.commit()
        await self.db.refresh(container)
        
        # Load relationships
        return await self.get_with_relationships(container.id)

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
            exclude={"settings", "environment", "inventory", "metrics", "seed_type_ids"},
            exclude_unset=True
        )
        
        for field, value in container_dict.items():
            if hasattr(container, field):
                setattr(container, field, value)
        
        # Update related entities
        if container_data.settings:
            settings_dict = container_data.settings.model_dump(exclude_unset=True)
            for field, value in settings_dict.items():
                if hasattr(container.settings, field):
                    setattr(container.settings, field, value)
        
        if container_data.environment:
            env_dict = container_data.environment.model_dump(exclude_unset=True)
            for field, value in env_dict.items():
                if hasattr(container.environment, field):
                    setattr(container.environment, field, value)
        
        if container_data.inventory:
            inv_dict = container_data.inventory.model_dump(exclude_unset=True)
            for field, value in inv_dict.items():
                if hasattr(container.inventory, field):
                    setattr(container.inventory, field, value)
        
        if container_data.metrics:
            met_dict = container_data.metrics.model_dump(exclude_unset=True)
            for field, value in met_dict.items():
                if hasattr(container.metrics, field):
                    setattr(container.metrics, field, value)
        
        # Update seed types if provided
        if container_data.seed_type_ids is not None:
            seed_types = await self.db.execute(
                select(SeedType).where(SeedType.id.in_(container_data.seed_type_ids))
            )
            container.seed_types = seed_types.scalars().all()
        
        await self.db.commit()
        await self.db.refresh(container)
        
        return container