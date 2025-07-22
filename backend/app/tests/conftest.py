"""Test configuration and fixtures for the Container Management System."""

import asyncio
import pytest
import pytest_asyncio
from typing import AsyncGenerator, Dict, Any
from unittest.mock import AsyncMock, MagicMock

from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.db import Base, get_async_db
from app.main import app
from app.models.container import Container
from app.models.seed_type import SeedType
from app.models.alert import Alert
from app.models.tenant import Tenant
from app.auth.jwt_handler import create_access_token


# Test database configuration - use PostgreSQL for consistency
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/demo"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def async_engine():
    """Create async engine for testing."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
    )
    
    # Tables are already created by alembic migrations
    # No need to recreate them
    
    yield engine
    
    # Clean up
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def async_session(async_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create async session for testing with transaction rollback."""
    async with async_engine.connect() as connection:
        # Start a transaction
        transaction = await connection.begin()
        
        # Create session bound to the connection
        async_session_maker = async_sessionmaker(
            bind=connection,
            class_=AsyncSession,
            expire_on_commit=False,
        )
        
        async with async_session_maker() as session:
            try:
                yield session
            finally:
                # Rollback the transaction to clean up test data
                await transaction.rollback()


@pytest_asyncio.fixture(scope="function")
async def override_get_db(async_session):
    """Override database dependency for testing."""
    async def _override_get_db():
        yield async_session
    
    app.dependency_overrides[get_async_db] = _override_get_db
    yield
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def client(async_session) -> AsyncGenerator[AsyncClient, None]:
    """Create async HTTP client for testing."""
    from httpx import ASGITransport
    
    # Create a test app without lifespan to avoid database initialization conflicts
    from fastapi import FastAPI
    from app.core.config import settings
    from app.core.middleware import setup_middleware
    from app.api.routes.containers import router as containers_router
    from app.api.routes.crops import router as crops_router
    
    test_app = FastAPI(
        title="Test Container Management Dashboard API",
        description="Test API for managing containers and monitoring performance metrics",
        version="1.0.0"
    )
    
    # Set up minimal middleware for testing
    setup_middleware(test_app)
    
    # Include API routes
    test_app.include_router(
        containers_router,
        prefix=settings.API_V1_STR,
        tags=["containers"]
    )
    test_app.include_router(
        crops_router,
        prefix=settings.API_V1_STR,
        tags=["crops"]
    )
    
    # Override database dependency with the actual session used for test data
    async def get_test_db():
        yield async_session
    test_app.dependency_overrides[get_async_db] = get_test_db
    
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def mock_auth_user():
    """Mock authenticated user for testing."""
    return {
        "user_id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "admin"
    }


@pytest.fixture
def auth_headers(mock_auth_user):
    """Create authentication headers for testing."""
    token = create_access_token(subject=mock_auth_user["username"])
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def test_seed_types(async_session: AsyncSession):
    """Create test seed types."""
    seed_types = [
        SeedType(
            name="Tomato",
            variety="Cherry",
            supplier="Seeds Corp",
            batch_id="TCH001"
        ),
        SeedType(
            name="Lettuce",
            variety="Romaine",
            supplier="Green Seeds",
            batch_id="LR002"
        ),
        SeedType(
            name="Basil",
            variety="Sweet",
            supplier="Herb Supply",
            batch_id="BS003"
        ),
    ]
    
    for seed_type in seed_types:
        async_session.add(seed_type)
    
    await async_session.commit()
    
    # Refresh to get IDs
    for seed_type in seed_types:
        await async_session.refresh(seed_type)
    
    return seed_types


# Container settings fixture removed - now part of Container model directly


# Container environment fixture removed - now part of Container model directly


# Container inventory fixture removed - now part of Container model directly


# Container metrics fixture removed - now part of Container model directly


@pytest_asyncio.fixture
async def test_container(
    async_session: AsyncSession,
    test_seed_types,
):
    """Create test container with all relationships."""
    # First create a tenant with unique name
    import uuid
    tenant = Tenant(name=f"Test Tenant {uuid.uuid4().hex[:8]}")
    async_session.add(tenant)
    await async_session.commit()
    await async_session.refresh(tenant)
    
    container = Container(
        name=f"Test Container 1 {uuid.uuid4().hex[:8]}",
        tenant_id=tenant.id,
        type="physical",
        purpose="development",
        location={
            "city": "San Francisco",
            "country": "USA",
            "address": "123 Test St"
        },
        notes="Test container for development",
        status="active",
        shadow_service_enabled=False,
        robotics_simulation_enabled=False,
        ecosystem_connected=False,
        ecosystem_settings={}
    )
    
    # Add seed types
    container.seed_types = test_seed_types[:2]  # First 2 seed types
    
    async_session.add(container)
    await async_session.commit()
    await async_session.refresh(container)
    
    return container


@pytest_asyncio.fixture
async def test_containers_with_alerts(
    async_session: AsyncSession,
    test_seed_types,
):
    """Create multiple test containers with alerts."""
    containers = []
    
    # Create a tenant first with unique name
    import uuid
    tenant = Tenant(name=f"Test Tenant {uuid.uuid4().hex[:8]}")
    async_session.add(tenant)
    await async_session.commit()
    await async_session.refresh(tenant)
    
    for i in range(3):
        # Create container with simplified structure
        container = Container(
            name=f"Container {i + 1} {uuid.uuid4().hex[:8]}",
            tenant_id=tenant.id,
            type="physical" if i % 2 == 0 else "virtual",
            purpose=["development", "research", "production"][i % 3],
            location={
                "city": f"City {i + 1}",
                "country": "USA",
                "address": f"{i + 1}00 Test St"
            } if i % 2 == 0 else None,
            notes=f"Test container {i + 1}",
            status=["active", "maintenance", "inactive"][i % 3],
            shadow_service_enabled=True,
            robotics_simulation_enabled=False,
            ecosystem_connected=False,
            ecosystem_settings={}
        )
        
        container.seed_types = test_seed_types[:2]
        async_session.add(container)
        await async_session.flush()
        
        # Add alerts for some containers
        if i < 2:
            alert = Alert(
                container_id=container.id,
                description=f"Test alert {i + 1}",
                severity=["high", "medium"][i % 2],
                active=True,
                related_object={"type": "sensor", "id": f"sensor_{i + 1}"}
            )
            async_session.add(alert)
        
        containers.append(container)
    
    await async_session.commit()
    
    # Refresh all containers
    for container in containers:
        await async_session.refresh(container)
    
    return containers


@pytest.fixture
def container_create_data():
    """Sample container creation data."""
    return {
        "name": "New Test Container",
        "tenant_id": 1,
        "type": "physical",
        "purpose": "development",
        "location": {
            "city": "New York",
            "country": "USA",
            "address": "456 New St"
        },
        "notes": "New container for testing",
        "status": "created",
        "shadow_service_enabled": True,
        "robotics_simulation_enabled": False,
        "ecosystem_connected": False,
        "ecosystem_settings": {},
        "seed_type_ids": [1, 2]
    }


@pytest.fixture
def container_update_data():
    """Sample container update data."""
    return {
        "name": "Updated Test Container",
        "status": "maintenance",
        "notes": "Updated container for testing",
        "shadow_service_enabled": False,
        "robotics_simulation_enabled": True,
        "ecosystem_connected": True,
        "ecosystem_settings": {"updated": True}
    }


@pytest.fixture
def container_filter_data():
    """Sample container filter data."""
    return {
        "search": "test",
        "type": "physical",
        "tenant": 1,
        "purpose": "development",
        "status": "active",
        "alerts": True,
        "page": 1,
        "limit": 10,
        "sort": "name",
        "order": "asc"
    }


@pytest.fixture
def shutdown_request_data():
    """Sample shutdown request data."""
    return {
        "reason": "Maintenance required",
        "force": False
    }


# Mock fixtures for external dependencies
@pytest.fixture
def mock_logger():
    """Mock logger for testing."""
    return MagicMock()


@pytest.fixture
def mock_metrics_service():
    """Mock metrics service for testing."""
    mock = AsyncMock()
    mock.get_performance_metrics.return_value = {
        "physical": {
            "container_count": 5,
            "yield": {"average": 25.0, "total": 125.0, "chart_data": []},
            "space_utilization": {"average": 85.0, "chart_data": []}
        },
        "virtual": {
            "container_count": 3,
            "yield": {"average": 15.0, "total": 45.0, "chart_data": []},
            "space_utilization": {"average": 75.0, "chart_data": []}
        },
        "time_range": {
            "type": "week",
            "start_date": "2023-01-01",
            "end_date": "2023-01-07"
        },
        "generated_at": "2023-01-07T10:00:00Z"
    }
    return mock


# Helper functions for testing
def assert_container_response(container_data: Dict[str, Any], expected_fields: Dict[str, Any]):
    """Assert container response matches expected fields."""
    for field, expected_value in expected_fields.items():
        assert container_data.get(field) == expected_value, f"Field {field} mismatch"


def assert_pagination_response(pagination_data: Dict[str, Any], expected_pagination: Dict[str, Any]):
    """Assert pagination response matches expected values."""
    for field, expected_value in expected_pagination.items():
        assert pagination_data.get(field) == expected_value, f"Pagination field {field} mismatch"


def assert_performance_metrics(metrics_data: Dict[str, Any]):
    """Assert performance metrics have required structure."""
    assert "physical" in metrics_data
    assert "virtual" in metrics_data
    
    for container_type in ["physical", "virtual"]:
        type_data = metrics_data[container_type]
        assert "container_count" in type_data
        assert "yield" in type_data
        assert "space_utilization" in type_data
        
        # Check yield structure
        yield_data = type_data["yield"]
        assert "average" in yield_data
        assert "total" in yield_data
        assert "chart_data" in yield_data
        
        # Check space utilization structure
        util_data = type_data["space_utilization"]
        assert "average" in util_data
        assert "chart_data" in util_data