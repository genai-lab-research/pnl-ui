"""Tests for Container model with simplified structure."""

import pytest
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.container import Container, container_seed_types
from app.models.seed_type import SeedType
from app.models.tenant import Tenant
from app.models.alert import Alert


@pytest.mark.models
@pytest.mark.database
class TestContainerModel:
    """Test Container model functionality with simplified structure."""

    @pytest.mark.asyncio
    async def test_container_creation(self, async_session: AsyncSession):
        """Test creating a container with all fields."""
        # Create tenant first
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container with all fields
        container = Container(
            name="Full Test Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production",
            location={
                "city": "San Francisco",
                "country": "USA",
                "address": "123 Test St"
            },
            notes="Production container for testing",
            status="active",
            shadow_service_enabled=True,
            copied_environment_from=None,
            robotics_simulation_enabled=False,
            ecosystem_connected=True,
            ecosystem_settings={
                "monitoring": True,
                "alerts": True,
                "auto_scaling": False
            }
        )
        
        async_session.add(container)
        await async_session.commit()
        
        # Verify container creation
        assert container.id is not None
        assert container.name == "Full Test Container"
        assert container.tenant_id == tenant.id
        assert container.type == "physical"
        assert container.purpose == "production"
        assert container.location["city"] == "San Francisco"
        assert container.location["country"] == "USA"
        assert container.location["address"] == "123 Test St"
        assert container.notes == "Production container for testing"
        assert container.status == "active"
        assert container.shadow_service_enabled is True
        assert container.copied_environment_from is None
        assert container.robotics_simulation_enabled is False
        assert container.ecosystem_connected is True
        assert container.ecosystem_settings["monitoring"] is True
        assert container.ecosystem_settings["alerts"] is True
        assert container.ecosystem_settings["auto_scaling"] is False
        assert isinstance(container.created_at, datetime)
        assert isinstance(container.updated_at, datetime)

    @pytest.mark.asyncio
    async def test_container_minimal_creation(self, async_session: AsyncSession):
        """Test creating a container with minimal fields."""
        # Create tenant first
        tenant = Tenant(name="Minimal Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create minimal container
        container = Container(
            name="Minimal Container",
            tenant_id=tenant.id,
            type="virtual",
            purpose="development"
        )
        
        async_session.add(container)
        await async_session.commit()
        
        # Verify defaults
        assert container.id is not None
        assert container.name == "Minimal Container"
        assert container.tenant_id == tenant.id
        assert container.type == "virtual"
        assert container.purpose == "development"
        assert container.location is None
        assert container.notes is None
        assert container.status == "created"  # Default value
        assert container.shadow_service_enabled is False  # Default value
        assert container.robotics_simulation_enabled is False  # Default value
        assert container.ecosystem_connected is False  # Default value
        assert container.ecosystem_settings is None

    @pytest.mark.asyncio
    async def test_container_seed_type_relationship(self, async_session: AsyncSession):
        """Test container relationship with seed types."""
        # Create tenant
        tenant = Tenant(name="Seed Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create seed types
        seed_types = [
            SeedType(name="Tomato", variety="Cherry", supplier="Seeds Corp", batch_id="TC001"),
            SeedType(name="Lettuce", variety="Romaine", supplier="Green Co", batch_id="LR001"),
            SeedType(name="Basil", variety="Sweet", supplier="Herb Co", batch_id="BS001")
        ]
        
        async_session.add_all(seed_types)
        await async_session.flush()
        
        # Create container
        container = Container(
            name="Seed Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="research",
            status="active"
        )
        
        # Associate seed types
        container.seed_types = seed_types[:2]  # First 2 seed types
        
        async_session.add(container)
        await async_session.commit()
        
        # Test relationship loading
        container_with_seeds = await async_session.get(
            Container, container.id, options=[selectinload(Container.seed_types)]
        )
        
        assert len(container_with_seeds.seed_types) == 2
        seed_names = [st.name for st in container_with_seeds.seed_types]
        assert "Tomato" in seed_names
        assert "Lettuce" in seed_names
        assert "Basil" not in seed_names

    @pytest.mark.asyncio
    async def test_container_tenant_relationship(self, async_session: AsyncSession):
        """Test container relationship with tenant."""
        # Create tenant
        tenant = Tenant(name="Relationship Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container
        container = Container(
            name="Tenant Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production",
            status="active"
        )
        
        async_session.add(container)
        await async_session.commit()
        
        # Test relationship loading
        container_with_tenant = await async_session.get(
            Container, container.id, options=[selectinload(Container.tenant)]
        )
        
        assert container_with_tenant.tenant is not None
        assert container_with_tenant.tenant.name == "Relationship Tenant"
        assert container_with_tenant.tenant.id == tenant.id

    @pytest.mark.asyncio
    async def test_container_alerts_relationship(self, async_session: AsyncSession):
        """Test container relationship with alerts."""
        # Create tenant
        tenant = Tenant(name="Alert Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container
        container = Container(
            name="Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production",
            status="maintenance"
        )
        
        async_session.add(container)
        await async_session.flush()
        
        # Create alerts
        alerts = [
            Alert(
                container_id=container.id,
                description="High temperature alert",
                severity="high",
                active=True
            ),
            Alert(
                container_id=container.id,
                description="Low humidity alert",
                severity="medium",
                active=False
            )
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        # Test relationship by querying alerts directly
        result = await async_session.execute(
            select(Alert).where(Alert.container_id == container.id)
        )
        container_alerts = result.scalars().all()
        
        assert len(container_alerts) == 2
        alert_descriptions = [alert.description for alert in container_alerts]
        assert "High temperature alert" in alert_descriptions
        assert "Low humidity alert" in alert_descriptions

    @pytest.mark.asyncio
    async def test_container_name_uniqueness(self, async_session: AsyncSession):
        """Test that container names should be unique."""
        # Create tenant
        tenant = Tenant(name="Unique Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create first container
        container1 = Container(
            name="Unique Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        
        async_session.add(container1)
        await async_session.commit()
        
        # Try to create second container with same name
        container2 = Container(
            name="Unique Container",  # Same name
            tenant_id=tenant.id,
            type="virtual",
            purpose="research"
        )
        
        async_session.add(container2)
        with pytest.raises(Exception):  # Should raise integrity constraint error
            await async_session.commit()