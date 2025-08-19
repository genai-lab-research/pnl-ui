"""Tests for Container repository operations."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.container import ContainerRepository
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerFilterCriteria
from app.models.container import Container


@pytest.mark.repositories
@pytest.mark.database
class TestContainerRepository:
    """Test ContainerRepository functionality."""

    @pytest.mark.asyncio

    async def test_repository_initialization(self, async_session: AsyncSession):
        """Test repository initialization."""
        repository = ContainerRepository(async_session)
        
        assert repository.db == async_session
        assert repository.model == Container

    @pytest.mark.asyncio

    async def test_get_with_relationships(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test getting container with all relationships loaded."""
        repository = ContainerRepository(async_session)
        
        container = await repository.get_with_relationships(test_container.id)
        
        assert container is not None
        assert container.id == test_container.id
        assert container.name == test_container.name
        
        # Check that relationships are loaded
        assert container.seed_types is not None
        assert container.alerts is not None
        assert container.tenant is not None
        assert container.metric_snapshots is not None

    @pytest.mark.asyncio

    async def test_get_with_relationships_not_found(self, async_session: AsyncSession):
        """Test getting non-existent container with relationships."""
        repository = ContainerRepository(async_session)
        
        container = await repository.get_with_relationships(99999)
        
        assert container is None

    @pytest.mark.asyncio

    async def test_get_filtered_no_filters(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers with no filters applied."""
        repository = ContainerRepository(async_session)
        filters = ContainerFilterCriteria()
        
        containers, total = await repository.get_filtered(filters)
        
        assert len(containers) == 3  # From fixture
        assert total == 3
        
        # Check default sorting (by name, ascending)
        container_names = [c.name for c in containers]
        assert container_names == sorted(container_names)

    @pytest.mark.asyncio

    async def test_get_filtered_search(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers with search filter."""
        repository = ContainerRepository(async_session)
        
        # Search by name
        filters = ContainerFilterCriteria(search="Container 1")
        containers, total = await repository.get_filtered(filters)
        
        assert len(containers) == 1
        assert total == 1
        assert containers[0].name == "Container 1"
        
        # Search with partial match
        filters = ContainerFilterCriteria(search="container")
        containers, total = await repository.get_filtered(filters)
        
        assert len(containers) == 3  # All containers match
        assert total == 3

    @pytest.mark.asyncio

    async def test_get_filtered_type(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers filtered by type."""
        repository = ContainerRepository(async_session)
        
        # Filter physical containers
        filters = ContainerFilterCriteria(type="physical")
        containers, total = await repository.get_filtered(filters)
        
        physical_count = sum(1 for c in containers if c.type == "physical")
        assert physical_count == len(containers)
        
        # Filter virtual containers
        filters = ContainerFilterCriteria(type="virtual")
        containers, total = await repository.get_filtered(filters)
        
        virtual_count = sum(1 for c in containers if c.type == "virtual")
        assert virtual_count == len(containers)

    @pytest.mark.asyncio

    async def test_get_filtered_tenant(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers filtered by tenant."""
        repository = ContainerRepository(async_session)
        
        # Filter by tenant 1
        filters = ContainerFilterCriteria(tenant=1)
        containers, total = await repository.get_filtered(filters)
        
        for container in containers:
            assert container.tenant_id == 1

    @pytest.mark.asyncio

    async def test_get_filtered_purpose(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers filtered by purpose."""
        repository = ContainerRepository(async_session)
        
        # Filter by development purpose
        filters = ContainerFilterCriteria(purpose="development")
        containers, total = await repository.get_filtered(filters)
        
        for container in containers:
            assert container.purpose == "development"

    @pytest.mark.asyncio

    async def test_get_filtered_status(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers filtered by status."""
        repository = ContainerRepository(async_session)
        
        # Filter by active status
        filters = ContainerFilterCriteria(status="active")
        containers, total = await repository.get_filtered(filters)
        
        for container in containers:
            assert container.status == "active"

    @pytest.mark.asyncio

    async def test_get_filtered_alerts(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers filtered by alert presence."""
        repository = ContainerRepository(async_session)
        
        # Filter containers with alerts
        filters = ContainerFilterCriteria(alerts=True)
        containers, total = await repository.get_filtered(filters)
        
        # From fixture, first 2 containers have alerts
        assert len(containers) == 2
        
        # Filter containers without alerts
        filters = ContainerFilterCriteria(alerts=False)
        containers, total = await repository.get_filtered(filters)
        
        # Third container should not have alerts
        assert len(containers) == 1

    @pytest.mark.asyncio

    async def test_get_filtered_pagination(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers with pagination."""
        repository = ContainerRepository(async_session)
        
        # First page
        filters = ContainerFilterCriteria(page=1, limit=2)
        containers, total = await repository.get_filtered(filters)
        
        assert len(containers) == 2
        assert total == 3
        
        # Second page
        filters = ContainerFilterCriteria(page=2, limit=2)
        containers, total = await repository.get_filtered(filters)
        
        assert len(containers) == 1  # Remaining container
        assert total == 3

    @pytest.mark.asyncio

    async def test_get_filtered_sorting(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers with sorting."""
        repository = ContainerRepository(async_session)
        
        # Sort by name ascending (default)
        filters = ContainerFilterCriteria(sort="name", order="asc")
        containers, total = await repository.get_filtered(filters)
        
        names_asc = [c.name for c in containers]
        assert names_asc == sorted(names_asc)
        
        # Sort by name descending
        filters = ContainerFilterCriteria(sort="name", order="desc")
        containers, total = await repository.get_filtered(filters)
        
        names_desc = [c.name for c in containers]
        assert names_desc == sorted(names_desc, reverse=True)

    @pytest.mark.asyncio

    async def test_get_filtered_combined_filters(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers with multiple filters combined."""
        repository = ContainerRepository(async_session)
        
        # Combine type and tenant filters
        filters = ContainerFilterCriteria(type="physical", tenant=1)
        containers, total = await repository.get_filtered(filters)
        
        for container in containers:
            assert container.type == "physical"
            assert container.tenant_id == 1

    @pytest.mark.asyncio

    async def test_get_metrics_data_all_containers(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting metrics data for all containers."""
        repository = ContainerRepository(async_session)
        
        containers = await repository.get_metrics_data()
        
        # Should only include active and maintenance containers
        for container in containers:
            assert container.status in ["active", "maintenance"]
        
        # Check that metric_snapshots are loaded
        for container in containers:
            assert container.metric_snapshots is not None

    @pytest.mark.asyncio

    async def test_get_metrics_data_by_type(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting metrics data filtered by container type."""
        repository = ContainerRepository(async_session)
        
        # Get physical containers only
        physical_containers = await repository.get_metrics_data(container_type="physical")
        
        for container in physical_containers:
            assert container.type == "physical"
            assert container.status in ["active", "maintenance"]

    @pytest.mark.asyncio

    async def test_get_metrics_data_by_ids(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting metrics data for specific container IDs."""
        repository = ContainerRepository(async_session)
        
        # Get first container only
        container_ids = [test_containers_with_alerts[0].id]
        containers = await repository.get_metrics_data(container_ids=container_ids)
        
        assert len(containers) == 1
        assert containers[0].id == test_containers_with_alerts[0].id

    @pytest.mark.asyncio

    async def test_get_distinct_values(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting distinct values for container fields."""
        repository = ContainerRepository(async_session)
        
        # Get distinct purposes
        purposes = await repository.get_distinct_values("purpose")
        assert len(purposes) > 0
        assert all(isinstance(purpose, str) for purpose in purposes)
        
        # Get distinct types
        types = await repository.get_distinct_values("type")
        assert "physical" in types or "virtual" in types
        
        # Get distinct statuses
        statuses = await repository.get_distinct_values("status")
        assert len(statuses) > 0

    @pytest.mark.asyncio

    async def test_get_distinct_values_invalid_field(self, async_session: AsyncSession):
        """Test getting distinct values for invalid field."""
        repository = ContainerRepository(async_session)
        
        values = await repository.get_distinct_values("invalid_field")
        assert values == []

    @pytest.mark.asyncio

    async def test_get_tenant_options(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting tenant options."""
        repository = ContainerRepository(async_session)
        
        tenant_options = await repository.get_tenant_options()
        
        assert len(tenant_options) > 0
        for option in tenant_options:
            assert "id" in option
            assert "name" in option
            assert isinstance(option["id"], int)
            assert isinstance(option["name"], str)

    @pytest.mark.asyncio

    async def test_shutdown_container(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test shutting down a container."""
        repository = ContainerRepository(async_session)
        
        # Verify container is not inactive initially
        assert test_container.status != "inactive"
        
        # Shutdown container
        success = await repository.shutdown_container(test_container.id)
        
        assert success is True
        
        # Verify container status changed
        updated_container = await repository.get(test_container.id)
        assert updated_container.status == "inactive"

    @pytest.mark.asyncio

    async def test_shutdown_container_not_found(self, async_session: AsyncSession):
        """Test shutting down non-existent container."""
        repository = ContainerRepository(async_session)
        
        success = await repository.shutdown_container(99999)
        
        assert success is False

    @pytest.mark.asyncio

    async def test_get_containers_with_alerts(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers that have active alerts."""
        repository = ContainerRepository(async_session)
        
        containers = await repository.get_containers_with_alerts()
        
        # From fixture, first 2 containers have alerts
        assert len(containers) == 2
        
        # Check that alerts are loaded
        for container in containers:
            assert len(container.alerts) > 0
            for alert in container.alerts:
                assert alert.active is True

    @pytest.mark.asyncio

    async def test_create_with_relationships(
        self,
        async_session: AsyncSession,
        test_seed_types,
        container_create_data
    ):
        """Test creating container with all relationships."""
        repository = ContainerRepository(async_session)
        
        # Create container schema
        container_create = ContainerCreate(**container_create_data)
        
        # Create container
        container = await repository.create_with_relationships(container_create)
        
        assert container is not None
        assert container.id is not None
        assert container.name == container_create_data["name"]
        assert container.tenant_id == container_create_data["tenant_id"]
        
        # Check relationships are created
        assert container.ecosystem_settings is not None
        assert container.seed_types is not None
        assert container.alerts is not None
        assert container.metric_snapshots is not None
        
        # Check seed types association
        assert len(container.seed_types) == len(container_create_data["seed_type_ids"])

    @pytest.mark.asyncio

    async def test_create_with_relationships_no_seed_types(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test creating container without seed types."""
        repository = ContainerRepository(async_session)
        
        # Remove seed types from data
        data = {**container_create_data}
        data["seed_type_ids"] = []
        
        container_create = ContainerCreate(**data)
        container = await repository.create_with_relationships(container_create)
        
        assert container is not None
        assert len(container.seed_types) == 0

    @pytest.mark.asyncio

    async def test_update_with_relationships(
        self,
        async_session: AsyncSession,
        test_container,
        container_update_data
    ):
        """Test updating container with relationships."""
        repository = ContainerRepository(async_session)
        
        # Create update schema
        container_update = ContainerUpdate(**container_update_data)
        
        # Update container
        updated_container = await repository.update_with_relationships(
            test_container.id, container_update
        )
        
        assert updated_container is not None
        assert updated_container.id == test_container.id
        assert updated_container.name == container_update_data["name"]
        assert updated_container.status == container_update_data["status"]
        assert updated_container.notes == container_update_data["notes"]
        
        # Check that related entities were updated (use actual Container attributes)
        assert updated_container.shadow_service_enabled == container_update_data.get("shadow_service_enabled", updated_container.shadow_service_enabled)
        assert updated_container.ecosystem_connected == container_update_data.get("ecosystem_connected", updated_container.ecosystem_connected)
        assert updated_container.ecosystem_settings is not None

    @pytest.mark.asyncio

    async def test_update_with_relationships_not_found(
        self,
        async_session: AsyncSession,
        container_update_data
    ):
        """Test updating non-existent container."""
        repository = ContainerRepository(async_session)
        
        container_update = ContainerUpdate(**container_update_data)
        
        updated_container = await repository.update_with_relationships(
            99999, container_update
        )
        
        assert updated_container is None

    @pytest.mark.asyncio

    async def test_update_with_relationships_seed_types(
        self,
        async_session: AsyncSession,
        test_container,
        test_seed_types
    ):
        """Test updating container seed types."""
        repository = ContainerRepository(async_session)
        
        # Update with different seed types
        new_seed_type_ids = [test_seed_types[2].id]  # Third seed type
        container_update = ContainerUpdate(seed_type_ids=new_seed_type_ids)
        
        updated_container = await repository.update_with_relationships(
            test_container.id, container_update
        )
        
        assert updated_container is not None
        assert len(updated_container.seed_types) == 1
        assert updated_container.seed_types[0].id == test_seed_types[2].id

    @pytest.mark.asyncio

    async def test_update_with_relationships_partial(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test updating container with partial data."""
        repository = ContainerRepository(async_session)
        
        # Only update name and settings
        container_update = ContainerUpdate(
            name="Partially Updated Container",
            settings={"shadow_service_enabled": False}
        )
        
        updated_container = await repository.update_with_relationships(
            test_container.id, container_update
        )
        
        assert updated_container is not None
        assert updated_container.name == "Partially Updated Container"
        assert updated_container.shadow_service_enabled is False
        
        # Other fields should remain unchanged
        assert updated_container.tenant_id == test_container.tenant_id
        assert updated_container.type == test_container.type

    @pytest.mark.asyncio

    async def test_repository_inheritance(self, async_session: AsyncSession):
        """Test that repository inherits from BaseRepository correctly."""
        repository = ContainerRepository(async_session)
        
        # Test inherited methods exist
        assert hasattr(repository, 'get')
        assert hasattr(repository, 'create')
        assert hasattr(repository, 'update')
        assert hasattr(repository, 'delete')
        assert hasattr(repository, 'get_all')

    @pytest.mark.asyncio

    async def test_load_relationships_flag(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test load_relationships flag in get_filtered method."""
        repository = ContainerRepository(async_session)
        
        # With relationships loaded (default)
        filters = ContainerFilterCriteria(limit=1)
        containers, total = await repository.get_filtered(filters, load_relationships=True)
        
        assert len(containers) == 1
        container = containers[0]
        assert container.seed_types is not None
        assert container.ecosystem_settings is not None
        
        # Without relationships loaded
        containers, total = await repository.get_filtered(filters, load_relationships=False)
        
        assert len(containers) == 1
        # Note: Without eager loading, relationships might be None or require separate queries

    @pytest.mark.asyncio

    async def test_filtering_with_load_relationships_false(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test filtering without loading relationships for performance."""
        repository = ContainerRepository(async_session)
        
        filters = ContainerFilterCriteria()
        containers, total = await repository.get_filtered(filters, load_relationships=False)
        
        assert len(containers) > 0
        assert total > 0
        
        # Verify we can still access basic container properties
        for container in containers:
            assert container.id is not None
            assert container.name is not None
            assert container.type is not None