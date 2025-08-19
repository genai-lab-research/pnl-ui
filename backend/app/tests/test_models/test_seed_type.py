"""Tests for SeedType model with simplified container structure."""

import pytest
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.seed_type import SeedType
from app.models.container import Container
from app.models.tenant import Tenant


@pytest.mark.models
@pytest.mark.database
class TestSeedTypeModel:
    """Test SeedType model functionality."""

    @pytest.mark.asyncio
    async def test_seed_type_creation(self, async_session: AsyncSession):
        """Test creating a seed type with all fields."""
        seed_type = SeedType(
            name="Tomato",
            variety="Cherry",
            supplier="Seeds Corp",
            batch_id="TCH001"
        )
        
        async_session.add(seed_type)
        await async_session.commit()
        
        # Verify seed type creation
        assert seed_type.id is not None
        assert seed_type.name == "Tomato"
        assert seed_type.variety == "Cherry"
        assert seed_type.supplier == "Seeds Corp"
        assert seed_type.batch_id == "TCH001"
        assert isinstance(seed_type.created_at, datetime)
        assert isinstance(seed_type.updated_at, datetime)

    @pytest.mark.asyncio
    async def test_seed_type_minimal_creation(self, async_session: AsyncSession):
        """Test creating a seed type with only required fields."""
        seed_type = SeedType(
            name="Lettuce"
        )
        
        async_session.add(seed_type)
        await async_session.commit()
        
        # Verify minimal creation
        assert seed_type.id is not None
        assert seed_type.name == "Lettuce"
        assert seed_type.variety is None
        assert seed_type.supplier is None
        assert seed_type.batch_id is None

    @pytest.mark.asyncio
    async def test_seed_type_container_relationship(self, async_session: AsyncSession):
        """Test seed type relationship with containers."""
        # Create tenant
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create seed types
        seed_type1 = SeedType(
            name="Basil",
            variety="Sweet",
            supplier="Herb Supply",
            batch_id="BS003"
        )
        seed_type2 = SeedType(
            name="Spinach",
            variety="Baby Leaf",
            supplier="Leaf Co",
            batch_id="SP004"
        )
        
        async_session.add_all([seed_type1, seed_type2])
        await async_session.flush()
        
        # Create container with simplified structure
        container = Container(
            name="Herb Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production",
            status="active",
            shadow_service_enabled=False,
            robotics_simulation_enabled=False,
            ecosystem_connected=True,
            ecosystem_settings={"monitoring": True}
        )
        
        # Associate seed types with container
        container.seed_types = [seed_type1, seed_type2]
        
        async_session.add(container)
        await async_session.commit()
        
        # Test relationship loading
        container_with_seeds = await async_session.get(
            Container, container.id, options=[selectinload(Container.seed_types)]
        )
        
        assert len(container_with_seeds.seed_types) == 2
        seed_names = [st.name for st in container_with_seeds.seed_types]
        assert "Basil" in seed_names
        assert "Spinach" in seed_names

    @pytest.mark.asyncio
    async def test_seed_type_name_required(self, async_session: AsyncSession):
        """Test that name is required."""
        seed_type = SeedType(
            variety="Test Variety",
            supplier="Test Supplier",
            batch_id="TEST001"
        )
        
        async_session.add(seed_type)
        with pytest.raises(Exception):  # Should raise because name is required
            await async_session.commit()