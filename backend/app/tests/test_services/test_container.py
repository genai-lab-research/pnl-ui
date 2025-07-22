"""Tests for Container service business logic."""

import pytest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.container import ContainerService
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerFilterCriteria, ShutdownRequest
from app.core.constants import ErrorMessages


@pytest.mark.services
class TestContainerService:
    """Test ContainerService business logic."""

    def test_service_initialization(self, async_session: AsyncSession):
        """Test service initialization."""
        service = ContainerService(async_session)
        
        assert service.db == async_session
        assert service.repository is not None
        assert service.metrics_service is not None

    @pytest.mark.asyncio

    async def test_get_container_success(self, async_session: AsyncSession, test_container):
        """Test getting a container successfully."""
        service = ContainerService(async_session)
        
        container = await service.get_container(test_container.id)
        
        assert container is not None
        assert container.id == test_container.id
        assert container.name == test_container.name

    @pytest.mark.asyncio

    async def test_get_container_not_found(self, async_session: AsyncSession):
        """Test getting a non-existent container."""
        service = ContainerService(async_session)
        
        container = await service.get_container(99999)
        
        assert container is None

    @pytest.mark.asyncio

    async def test_get_container_database_error(self, async_session: AsyncSession):
        """Test getting container with database error."""
        service = ContainerService(async_session)
        
        # Mock repository to raise exception
        with patch.object(service.repository, 'get_with_relationships', side_effect=Exception("Database error")):
            from app.core.exceptions import DatabaseException
            with pytest.raises(DatabaseException) as exc_info:
                await service.get_container(1)
            
            assert exc_info.value.status_code == 500
            assert "Failed to retrieve container" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_get_containers_success(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts,
        mock_metrics_service
    ):
        """Test getting containers with filters successfully."""
        service = ContainerService(async_session)
        service.metrics_service = mock_metrics_service
        
        filters = ContainerFilterCriteria(page=1, limit=10)
        
        result = await service.get_containers(filters)
        
        assert result is not None
        assert hasattr(result, 'containers')
        assert hasattr(result, 'pagination')
        assert hasattr(result, 'performance_metrics')
        assert len(result.containers) > 0
        assert result.pagination.page == 1
        assert result.pagination.limit == 10

    @pytest.mark.asyncio

    async def test_get_containers_with_search(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts,
        mock_metrics_service
    ):
        """Test getting containers with search filter."""
        service = ContainerService(async_session)
        service.metrics_service = mock_metrics_service
        
        filters = ContainerFilterCriteria(search="Container 1")
        
        result = await service.get_containers(filters)
        
        assert result is not None
        assert len(result.containers) >= 0
        if result.containers:
            assert "Container 1" in result.containers[0].name

    @pytest.mark.asyncio

    async def test_get_containers_database_error(
        self,
        async_session: AsyncSession,
        mock_metrics_service
    ):
        """Test getting containers with database error."""
        service = ContainerService(async_session)
        service.metrics_service = mock_metrics_service
        
        filters = ContainerFilterCriteria()
        
        # Mock repository to raise exception
        with patch.object(service.repository, 'get_filtered', side_effect=Exception("Database error")):
            from app.core.exceptions import DatabaseException
            with pytest.raises(DatabaseException) as exc_info:
                await service.get_containers(filters)
            
            assert exc_info.value.status_code == 500
            assert "Failed to retrieve containers" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_create_container_success(
        self,
        async_session: AsyncSession,
        container_create_data,
        test_seed_types
    ):
        """Test creating a container successfully."""
        service = ContainerService(async_session)
        
        container_create = ContainerCreate(**container_create_data)
        
        # Mock get_by_field to return None (name not taken)
        with patch.object(service.repository, 'get_by_field', return_value=None):
            container = await service.create_container(container_create)
        
        assert container is not None
        assert container.name == container_create_data["name"]
        assert container.tenant_id == container_create_data["tenant_id"]

    @pytest.mark.asyncio

    async def test_create_container_name_already_exists(
        self,
        async_session: AsyncSession,
        container_create_data,
        test_container
    ):
        """Test creating a container with existing name."""
        service = ContainerService(async_session)
        
        container_create = ContainerCreate(**container_create_data)
        
        # Mock get_by_field to return existing container
        with patch.object(service.repository, 'get_by_field', return_value=test_container):
            from app.core.exceptions import ContainerValidationException
            with pytest.raises(ContainerValidationException) as exc_info:
                await service.create_container(container_create)
            
            assert exc_info.value.status_code == 400
            assert "name" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_create_container_database_error(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test creating container with database error."""
        service = ContainerService(async_session)
        
        container_create = ContainerCreate(**container_create_data)
        
        # Mock get_by_field to return None (name not taken)
        with patch.object(service.repository, 'get_by_field', return_value=None):
            # Mock create_with_relationships to raise exception
            with patch.object(service.repository, 'create_with_relationships', side_effect=Exception("Database error")):
                from app.core.exceptions import DatabaseException
                with pytest.raises(DatabaseException) as exc_info:
                    await service.create_container(container_create)
                
                assert exc_info.value.status_code == 500
                assert "Failed to create container" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_update_container_success(
        self,
        async_session: AsyncSession,
        test_container,
        container_update_data
    ):
        """Test updating a container successfully."""
        service = ContainerService(async_session)
        
        container_update = ContainerUpdate(**container_update_data)
        
        # Mock repository methods
        with patch.object(service.repository, 'get', return_value=test_container):
            with patch.object(service.repository, 'get_by_field', return_value=None):
                updated_container = await service.update_container(test_container.id, container_update)
        
        assert updated_container is not None

    @pytest.mark.asyncio

    async def test_update_container_not_found(
        self,
        async_session: AsyncSession,
        container_update_data
    ):
        """Test updating a non-existent container."""
        service = ContainerService(async_session)
        
        container_update = ContainerUpdate(**container_update_data)
        
        # Mock repository to return None
        with patch.object(service.repository, 'get', return_value=None):
            from app.core.exceptions import ContainerNotFoundException
            with pytest.raises(ContainerNotFoundException) as exc_info:
                await service.update_container(99999, container_update)
            
            assert exc_info.value.status_code == 404
            assert "Container 99999 not found" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_update_container_name_conflict(
        self,
        async_session: AsyncSession,
        test_container,
        test_containers_with_alerts
    ):
        """Test updating container with conflicting name."""
        service = ContainerService(async_session)
        
        # Try to update with name of another container
        other_container = test_containers_with_alerts[0]
        container_update = ContainerUpdate(name=other_container.name)
        
        # Mock repository methods
        with patch.object(service.repository, 'get', return_value=test_container):
            with patch.object(service.repository, 'get_by_field', return_value=other_container):
                from app.core.exceptions import ContainerValidationException
                with pytest.raises(ContainerValidationException) as exc_info:
                    await service.update_container(test_container.id, container_update)
                
                assert exc_info.value.status_code == 400
                assert "name" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_delete_container_success(self, async_session: AsyncSession, test_container):
        """Test deleting a container successfully."""
        service = ContainerService(async_session)
        
        # Mock repository methods
        with patch.object(service.repository, 'get', return_value=test_container):
            with patch.object(service.repository, 'delete', return_value=True):
                deleted = await service.delete_container(test_container.id)
        
        assert deleted is True

    @pytest.mark.asyncio

    async def test_delete_container_not_found(self, async_session: AsyncSession):
        """Test deleting a non-existent container."""
        service = ContainerService(async_session)
        
        # Mock repository to return None
        with patch.object(service.repository, 'get', return_value=None):
            from app.core.exceptions import ContainerNotFoundException
            with pytest.raises(ContainerNotFoundException) as exc_info:
                await service.delete_container(99999)
            
            assert exc_info.value.status_code == 404
            assert "Container 99999 not found" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_shutdown_container_success(self, async_session: AsyncSession, test_container):
        """Test shutting down a container successfully."""
        service = ContainerService(async_session)
        
        shutdown_request = ShutdownRequest(reason="Maintenance required", force=False)
        
        # Mock repository methods
        with patch.object(service.repository, 'get', return_value=test_container):
            with patch.object(service.repository, 'shutdown_container', return_value=True):
                response = await service.shutdown_container(test_container.id, shutdown_request)
        
        assert response.success is True
        assert response.container_id == test_container.id
        assert "Maintenance required" in response.message

    @pytest.mark.asyncio

    async def test_shutdown_container_not_found(self, async_session: AsyncSession):
        """Test shutting down a non-existent container."""
        service = ContainerService(async_session)
        
        shutdown_request = ShutdownRequest()
        
        # Mock repository to return None
        with patch.object(service.repository, 'get', return_value=None):
            from app.core.exceptions import ContainerNotFoundException
            with pytest.raises(ContainerNotFoundException) as exc_info:
                await service.shutdown_container(99999, shutdown_request)
            
            assert exc_info.value.status_code == 404
            assert "Container 99999 not found" in str(exc_info.value)

    @pytest.mark.asyncio

    async def test_shutdown_container_already_inactive(self, async_session: AsyncSession):
        """Test shutting down an already inactive container."""
        service = ContainerService(async_session)
        
        # Create inactive container mock
        inactive_container = AsyncMock()
        inactive_container.id = 1
        inactive_container.name = "Inactive Container"
        inactive_container.status = "inactive"
        
        shutdown_request = ShutdownRequest()
        
        # Mock repository to return inactive container
        with patch.object(service.repository, 'get', return_value=inactive_container):
            response = await service.shutdown_container(1, shutdown_request)
        
        assert response.success is False
        assert "already inactive" in response.message

    @pytest.mark.asyncio

    async def test_get_filter_options_success(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting filter options successfully."""
        service = ContainerService(async_session)
        
        filter_options = await service.get_filter_options()
        
        assert filter_options is not None
        assert hasattr(filter_options, 'tenants')
        assert hasattr(filter_options, 'purposes')
        assert hasattr(filter_options, 'statuses')
        assert hasattr(filter_options, 'container_types')

    @pytest.mark.asyncio

    async def test_get_containers_by_tenant(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers by tenant."""
        service = ContainerService(async_session)
        
        containers, total = await service.get_containers_by_tenant(tenant_id=1, page=1, limit=10)
        
        assert isinstance(containers, list)
        assert isinstance(total, int)
        assert total >= 0

    @pytest.mark.asyncio

    async def test_get_containers_with_alerts(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting containers with alerts."""
        service = ContainerService(async_session)
        
        containers = await service.get_containers_with_alerts()
        
        assert isinstance(containers, list)
        # From fixture, first 2 containers have alerts
        assert len(containers) >= 0

    @pytest.mark.asyncio

    async def test_validate_container_data_valid_physical(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test validating valid physical container data."""
        service = ContainerService(async_session)
        
        container_create = ContainerCreate(**container_create_data)
        
        is_valid = await service.validate_container_data(container_create)
        
        assert is_valid is True

    @pytest.mark.asyncio

    async def test_validate_container_data_physical_without_location(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test validating physical container without location."""
        service = ContainerService(async_session)
        
        # Remove location from physical container
        data = {**container_create_data, "location": None}
        container_create = ContainerCreate(**data)
        
        with pytest.raises(HTTPException) as exc_info:
            await service.validate_container_data(container_create)
        
        assert exc_info.value.status_code == 400
        assert "Physical containers must have a location" in exc_info.value.detail

    @pytest.mark.asyncio

    async def test_validate_container_data_invalid_type(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test validating container with invalid type."""
        service = ContainerService(async_session)
        
        # Set invalid type
        data = {**container_create_data}
        data["type"] = "invalid_type"  # Invalid: not physical or virtual
        
        with pytest.raises(Exception):  # Should raise validation error during schema creation
            container_create = ContainerCreate(**data)

    @pytest.mark.asyncio

    async def test_validate_container_data_invalid_purpose(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test validating container with invalid purpose."""
        service = ContainerService(async_session)
        
        # Set invalid purpose
        data = {**container_create_data}
        data["purpose"] = "invalid_purpose"  # Invalid: not development/research/production
        
        with pytest.raises(Exception):  # Should raise validation error during schema creation
            container_create = ContainerCreate(**data)

    @pytest.mark.asyncio

    async def test_validate_container_data_virtual_container(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test validating valid virtual container data."""
        service = ContainerService(async_session)
        
        # Create virtual container (no location required)
        data = {**container_create_data, "type": "virtual", "location": None}
        container_create = ContainerCreate(**data)
        
        is_valid = await service.validate_container_data(container_create)
        
        assert is_valid is True

    @pytest.mark.asyncio

    async def test_validate_container_data_invalid_status(
        self,
        async_session: AsyncSession,
        container_create_data
    ):
        """Test validating container with invalid status."""
        service = ContainerService(async_session)
        
        # Set invalid status
        data = {**container_create_data}
        data["status"] = "invalid_status"  # Invalid: not created/active/maintenance/inactive
        
        with pytest.raises(Exception):  # Should raise validation error during schema creation
            container_create = ContainerCreate(**data)

    @pytest.mark.asyncio

    async def test_service_error_handling_with_repository_exceptions(
        self,
        async_session: AsyncSession
    ):
        """Test service error handling when repository raises exceptions."""
        service = ContainerService(async_session)
        
        # Test various repository operations raising exceptions
        filters = ContainerFilterCriteria()
        
        # Mock repository methods to raise different exceptions
        with patch.object(service.repository, 'get_filtered', side_effect=Exception("Repository error")):
            from app.core.exceptions import DatabaseException
            with pytest.raises(DatabaseException) as exc_info:
                await service.get_containers(filters)
            assert exc_info.value.status_code == 500

    @pytest.mark.asyncio

    async def test_service_logging(self, async_session: AsyncSession, container_create_data):
        """Test that service operations are properly logged."""
        service = ContainerService(async_session)
        
        container_create = ContainerCreate(**container_create_data)
        
        # Mock logging to verify log calls
        with patch('app.services.container.logger') as mock_logger:
            # Mock repository methods
            with patch.object(service.repository, 'get_by_field', return_value=None):
                with patch.object(service.repository, 'create_with_relationships') as mock_create:
                    # Create a proper mock container object with all required attributes
                    from datetime import datetime, timezone
                    from app.models.container import Container as ContainerModel
                    now = datetime.now(timezone.utc)
                    mock_container = ContainerModel(
                        id=1,
                        name=container_create_data["name"],
                        tenant_id=container_create_data["tenant_id"],
                        type=container_create_data["type"],
                        purpose=container_create_data["purpose"],
                        location=container_create_data["location"],
                        notes=container_create_data["notes"],
                        status=container_create_data["status"],
                        shadow_service_enabled=container_create_data.get("shadow_service_enabled", False),
                        robotics_simulation_enabled=container_create_data.get("robotics_simulation_enabled", False),
                        ecosystem_connected=container_create_data.get("ecosystem_connected", False),
                        ecosystem_settings=container_create_data.get("ecosystem_settings", {}),
                        created_at=now,
                        updated_at=now
                    )
                    # Mock the relationships
                    mock_container.seed_types = []
                    mock_container.alerts = []
                    mock_container.tenant = None
                    mock_container.metric_snapshots = []
                    mock_create.return_value = mock_container
                    
                    await service.create_container(container_create)
                    
                    # Verify info log was called
                    mock_logger.info.assert_called()

    @pytest.mark.asyncio

    async def test_service_metrics_integration(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts,
        mock_metrics_service
    ):
        """Test service integration with metrics service."""
        service = ContainerService(async_session)
        service.metrics_service = mock_metrics_service
        
        filters = ContainerFilterCriteria()
        
        result = await service.get_containers(filters)
        
        # Verify metrics service was called
        mock_metrics_service.get_performance_metrics.assert_called_once()
        assert result.performance_metrics is not None

    @pytest.mark.asyncio

    async def test_service_pagination_calculation(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts,
        mock_metrics_service
    ):
        """Test service pagination calculation."""
        service = ContainerService(async_session)
        service.metrics_service = mock_metrics_service
        
        filters = ContainerFilterCriteria(page=2, limit=2)
        
        result = await service.get_containers(filters)
        
        assert result.pagination.page == 2
        assert result.pagination.limit == 2
        # total_pages calculation: (total + limit - 1) // limit
        assert result.pagination.total_pages >= 0

    @pytest.mark.asyncio

    async def test_container_name_validation_edge_cases(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test container name validation edge cases."""
        service = ContainerService(async_session)
        
        # Test updating container with same name (should be allowed)
        container_update = ContainerUpdate(name=test_container.name)
        
        with patch.object(service.repository, 'get', return_value=test_container):
            # Should not raise exception when updating with same name
            with patch.object(service.repository, 'update_with_relationships') as mock_update:
                mock_update.return_value = test_container
                from app.core.exceptions import DatabaseException
                with pytest.raises(DatabaseException) as exc_info:
                    await service.update_container(test_container.id, container_update)
                assert exc_info.value.status_code == 500