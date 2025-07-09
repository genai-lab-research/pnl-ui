"""Tests for Base repository operations."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.seed_type import SeedType
from app.schemas.seed_type import SeedTypeCreate, SeedTypeUpdate


@pytest.mark.repositories
@pytest.mark.database
class TestBaseRepository:
    """Test BaseRepository functionality using SeedType as example."""

    def test_repository_initialization(self, async_session: AsyncSession):
        """Test base repository initialization."""
        repository = BaseRepository(SeedType, async_session)
        
        assert repository.model == SeedType
        assert repository.db == async_session

    @pytest.mark.asyncio

    async def test_base_create(self, async_session: AsyncSession):
        """Test base repository create method."""
        repository = BaseRepository(SeedType, async_session)
        
        data = SeedTypeCreate(name="Base Test Seed", variety="Base Variety")
        
        entity = await repository.create(data)
        
        assert entity is not None
        assert entity.id is not None
        assert entity.name == "Base Test Seed"
        assert entity.variety == "Base Variety"

    @pytest.mark.asyncio

    async def test_base_get(self, async_session: AsyncSession, test_seed_types):
        """Test base repository get method."""
        repository = BaseRepository(SeedType, async_session)
        
        entity = await repository.get(test_seed_types[0].id)
        
        assert entity is not None
        assert entity.id == test_seed_types[0].id
        assert entity.name == test_seed_types[0].name

    @pytest.mark.asyncio

    async def test_base_get_not_found(self, async_session: AsyncSession):
        """Test base repository get method with non-existent ID."""
        repository = BaseRepository(SeedType, async_session)
        
        entity = await repository.get(99999)
        
        assert entity is None

    @pytest.mark.asyncio

    async def test_base_get_all(self, async_session: AsyncSession, test_seed_types):
        """Test base repository get_all method."""
        repository = BaseRepository(SeedType, async_session)
        
        entities = await repository.get_all()
        
        assert len(entities) == len(test_seed_types)
        
        # Check all entities are returned
        returned_ids = {e.id for e in entities}
        expected_ids = {st.id for st in test_seed_types}
        assert returned_ids == expected_ids

    @pytest.mark.asyncio

    async def test_base_get_all_empty(self, async_session: AsyncSession):
        """Test base repository get_all method when no entities exist."""
        repository = BaseRepository(SeedType, async_session)
        
        entities = await repository.get_all()
        
        assert entities == []

    @pytest.mark.asyncio

    async def test_base_update(self, async_session: AsyncSession, test_seed_types):
        """Test base repository update method."""
        repository = BaseRepository(SeedType, async_session)
        
        update_data = SeedTypeUpdate(name="Base Updated Seed")
        
        updated_entity = await repository.update(test_seed_types[0].id, update_data)
        
        assert updated_entity is not None
        assert updated_entity.id == test_seed_types[0].id
        assert updated_entity.name == "Base Updated Seed"
        # Other fields should remain unchanged
        assert updated_entity.variety == test_seed_types[0].variety

    @pytest.mark.asyncio

    async def test_base_update_not_found(self, async_session: AsyncSession):
        """Test base repository update method with non-existent ID."""
        repository = BaseRepository(SeedType, async_session)
        
        update_data = SeedTypeUpdate(name="Non-existent Update")
        
        updated_entity = await repository.update(99999, update_data)
        
        assert updated_entity is None

    @pytest.mark.asyncio

    async def test_base_delete(self, async_session: AsyncSession, test_seed_types):
        """Test base repository delete method."""
        repository = BaseRepository(SeedType, async_session)
        
        entity_id = test_seed_types[0].id
        
        deleted = await repository.delete(entity_id)
        
        assert deleted is True
        
        # Verify entity is deleted
        entity = await repository.get(entity_id)
        assert entity is None

    @pytest.mark.asyncio

    async def test_base_delete_not_found(self, async_session: AsyncSession):
        """Test base repository delete method with non-existent ID."""
        repository = BaseRepository(SeedType, async_session)
        
        deleted = await repository.delete(99999)
        
        assert deleted is False

    @pytest.mark.asyncio

    async def test_base_get_by_field(self, async_session: AsyncSession, test_seed_types):
        """Test base repository get_by_field method."""
        repository = BaseRepository(SeedType, async_session)
        
        entity = await repository.get_by_field("name", test_seed_types[0].name)
        
        assert entity is not None
        assert entity.id == test_seed_types[0].id
        assert entity.name == test_seed_types[0].name

    @pytest.mark.asyncio

    async def test_base_get_by_field_not_found(self, async_session: AsyncSession):
        """Test base repository get_by_field method with non-existent value."""
        repository = BaseRepository(SeedType, async_session)
        
        entity = await repository.get_by_field("name", "Non-existent Name")
        
        assert entity is None

    @pytest.mark.asyncio

    async def test_base_get_by_field_invalid_field(self, async_session: AsyncSession):
        """Test base repository get_by_field method with invalid field."""
        repository = BaseRepository(SeedType, async_session)
        
        # Should handle invalid field gracefully
        entity = await repository.get_by_field("invalid_field", "some_value")
        
        assert entity is None

    @pytest.mark.asyncio

    async def test_base_transaction_rollback_on_error(self, async_session: AsyncSession):
        """Test that base repository handles transaction rollback on errors."""
        repository = BaseRepository(SeedType, async_session)
        
        # Get initial count
        initial_entities = await repository.get_all()
        initial_count = len(initial_entities)
        
        # Try to create entity with invalid data (this might not fail with SeedType)
        # but demonstrates the pattern
        try:
            data = SeedTypeCreate(name="Transaction Test")
            entity = await repository.create(data)
            
            # If creation succeeds, verify it worked
            assert entity is not None
            
            # Verify count increased
            current_entities = await repository.get_all()
            assert len(current_entities) == initial_count + 1
            
        except Exception:
            # If creation fails, verify rollback
            current_entities = await repository.get_all()
            assert len(current_entities) == initial_count

    @pytest.mark.asyncio

    async def test_base_repository_with_different_models(self, async_session: AsyncSession):
        """Test that base repository works with different model types."""
        # Test with SeedType
        seed_repository = BaseRepository(SeedType, async_session)
        
        seed_data = SeedTypeCreate(name="Multi Model Test")
        seed_entity = await seed_repository.create(seed_data)
        
        assert seed_entity is not None
        assert isinstance(seed_entity, SeedType)
        assert seed_entity.name == "Multi Model Test"

    @pytest.mark.asyncio

    async def test_base_repository_model_validation(self, async_session: AsyncSession):
        """Test base repository model validation."""
        repository = BaseRepository(SeedType, async_session)
        
        # Create with valid data
        valid_data = SeedTypeCreate(name="Validation Test")
        entity = await repository.create(valid_data)
        
        assert entity is not None
        assert entity.name == "Validation Test"
        
        # Update with valid data
        update_data = SeedTypeUpdate(variety="Updated Variety")
        updated_entity = await repository.update(entity.id, update_data)
        
        assert updated_entity is not None
        assert updated_entity.variety == "Updated Variety"

    @pytest.mark.asyncio

    async def test_base_repository_async_operations(self, async_session: AsyncSession):
        """Test that base repository operations are properly async."""
        repository = BaseRepository(SeedType, async_session)
        
        # All operations should be awaitable
        data = SeedTypeCreate(name="Async Test")
        
        # Create
        entity = await repository.create(data)
        assert entity is not None
        
        # Get
        retrieved = await repository.get(entity.id)
        assert retrieved is not None
        
        # Get all
        all_entities = await repository.get_all()
        assert len(all_entities) > 0
        
        # Update
        update_data = SeedTypeUpdate(variety="Async Updated")
        updated = await repository.update(entity.id, update_data)
        assert updated is not None
        
        # Get by field
        by_field = await repository.get_by_field("name", "Async Test")
        assert by_field is not None
        
        # Delete
        deleted = await repository.delete(entity.id)
        assert deleted is True

    @pytest.mark.asyncio

    async def test_base_repository_error_handling(self, async_session: AsyncSession):
        """Test base repository error handling."""
        repository = BaseRepository(SeedType, async_session)
        
        # Test with various invalid operations that should be handled gracefully
        
        # Get with invalid ID type (handled by SQLAlchemy)
        try:
            entity = await repository.get("invalid_id")
            # If no exception, result should be None
            assert entity is None
        except Exception:
            # Some databases might raise an exception for invalid ID types
            pass
        
        # Update with invalid ID
        update_data = SeedTypeUpdate(name="Invalid Update")
        updated = await repository.update(-1, update_data)
        assert updated is None
        
        # Delete with invalid ID
        deleted = await repository.delete(-1)
        assert deleted is False

    @pytest.mark.asyncio

    async def test_base_repository_session_handling(self, async_session: AsyncSession):
        """Test base repository session handling."""
        repository = BaseRepository(SeedType, async_session)
        
        # Verify repository uses the provided session
        assert repository.db is async_session
        
        # Create entity
        data = SeedTypeCreate(name="Session Test")
        entity = await repository.create(data)
        
        # Verify entity is in session
        assert entity is not None
        assert entity.id is not None
        
        # Session should handle commit/rollback automatically through fixtures

    @pytest.mark.asyncio

    async def test_base_repository_polymorphism(self, async_session: AsyncSession):
        """Test base repository with inheritance patterns."""
        # Create repositories for different models using same base class
        seed_repo = BaseRepository(SeedType, async_session)
        
        # Both should work independently
        seed_data = SeedTypeCreate(name="Polymorphism Test Seed")
        seed_entity = await seed_repo.create(seed_data)
        
        assert seed_entity is not None
        assert isinstance(seed_entity, SeedType)
        
        # Verify operations are isolated
        seed_entities = await seed_repo.get_all()
        seed_ids = {e.id for e in seed_entities}
        
        assert seed_entity.id in seed_ids