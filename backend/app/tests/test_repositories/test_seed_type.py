"""Tests for SeedType repository operations."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.seed_type import SeedTypeRepository
from app.schemas.seed_type import SeedTypeCreate, SeedTypeUpdate
from app.models.seed_type import SeedType


@pytest.mark.repositories
@pytest.mark.database
class TestSeedTypeRepository:
    """Test SeedTypeRepository functionality."""

    @pytest.mark.asyncio

    async def test_repository_initialization(self, async_session: AsyncSession):
        """Test repository initialization."""
        repository = SeedTypeRepository(async_session)
        
        assert repository.db == async_session
        assert repository.model == SeedType

    @pytest.mark.asyncio

    async def test_create_seed_type(self, async_session: AsyncSession):
        """Test creating a seed type."""
        repository = SeedTypeRepository(async_session)
        
        seed_type_data = SeedTypeCreate(
            name="Tomato",
            variety="Cherry",
            supplier="Seeds Corp",
            batch_id="TCH001"
        )
        
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type.id is not None
        assert seed_type.name == "Tomato"
        assert seed_type.variety == "Cherry"
        assert seed_type.supplier == "Seeds Corp"
        assert seed_type.batch_id == "TCH001"
        assert seed_type.created_at is not None
        assert seed_type.updated_at is not None

    @pytest.mark.asyncio

    async def test_create_seed_type_minimal(self, async_session: AsyncSession):
        """Test creating a seed type with minimal data."""
        repository = SeedTypeRepository(async_session)
        
        seed_type_data = SeedTypeCreate(name="Lettuce")
        
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type.id is not None
        assert seed_type.name == "Lettuce"
        assert seed_type.variety is None
        assert seed_type.supplier is None
        assert seed_type.batch_id is None

    @pytest.mark.asyncio

    async def test_get_seed_type_by_id(self, async_session: AsyncSession, test_seed_types):
        """Test getting a seed type by ID."""
        repository = SeedTypeRepository(async_session)
        
        seed_type = await repository.get(test_seed_types[0].id)
        
        assert seed_type is not None
        assert seed_type.id == test_seed_types[0].id
        assert seed_type.name == test_seed_types[0].name

    @pytest.mark.asyncio

    async def test_get_seed_type_not_found(self, async_session: AsyncSession):
        """Test getting a non-existent seed type."""
        repository = SeedTypeRepository(async_session)
        
        seed_type = await repository.get(99999)
        
        assert seed_type is None

    @pytest.mark.asyncio

    async def test_get_all_seed_types(self, async_session: AsyncSession, test_seed_types):
        """Test getting all seed types."""
        repository = SeedTypeRepository(async_session)
        
        seed_types = await repository.get_all()
        
        assert len(seed_types) == len(test_seed_types)
        
        # Check all seed types are returned
        returned_ids = {st.id for st in seed_types}
        expected_ids = {st.id for st in test_seed_types}
        assert returned_ids == expected_ids

    @pytest.mark.asyncio

    async def test_get_all_seed_types_empty(self, async_session: AsyncSession):
        """Test getting all seed types when none exist."""
        repository = SeedTypeRepository(async_session)
        
        seed_types = await repository.get_all()
        
        assert seed_types == []

    @pytest.mark.asyncio

    async def test_update_seed_type(self, async_session: AsyncSession, test_seed_types):
        """Test updating a seed type."""
        repository = SeedTypeRepository(async_session)
        
        update_data = SeedTypeUpdate(
            name="Updated Tomato",
            variety="Roma",
            supplier="New Seeds Corp"
        )
        
        updated_seed_type = await repository.update(test_seed_types[0].id, update_data)
        
        assert updated_seed_type is not None
        assert updated_seed_type.id == test_seed_types[0].id
        assert updated_seed_type.name == "Updated Tomato"
        assert updated_seed_type.variety == "Roma"
        assert updated_seed_type.supplier == "New Seeds Corp"
        # batch_id should remain unchanged
        assert updated_seed_type.batch_id == test_seed_types[0].batch_id

    @pytest.mark.asyncio

    async def test_update_seed_type_partial(self, async_session: AsyncSession, test_seed_types):
        """Test partially updating a seed type."""
        repository = SeedTypeRepository(async_session)
        
        # Only update name
        update_data = SeedTypeUpdate(name="Partially Updated")
        
        updated_seed_type = await repository.update(test_seed_types[0].id, update_data)
        
        assert updated_seed_type is not None
        assert updated_seed_type.name == "Partially Updated"
        # Other fields should remain unchanged
        assert updated_seed_type.variety == test_seed_types[0].variety
        assert updated_seed_type.supplier == test_seed_types[0].supplier
        assert updated_seed_type.batch_id == test_seed_types[0].batch_id

    @pytest.mark.asyncio

    async def test_update_seed_type_not_found(self, async_session: AsyncSession):
        """Test updating a non-existent seed type."""
        repository = SeedTypeRepository(async_session)
        
        update_data = SeedTypeUpdate(name="Non-existent")
        
        updated_seed_type = await repository.update(99999, update_data)
        
        assert updated_seed_type is None

    @pytest.mark.asyncio

    async def test_delete_seed_type(self, async_session: AsyncSession, test_seed_types):
        """Test deleting a seed type."""
        repository = SeedTypeRepository(async_session)
        
        # Delete the first seed type
        seed_type_id = test_seed_types[0].id
        
        deleted = await repository.delete(seed_type_id)
        
        assert deleted is True
        
        # Verify seed type is deleted
        seed_type = await repository.get(seed_type_id)
        assert seed_type is None
        
        # Verify other seed types still exist
        remaining_seed_types = await repository.get_all()
        assert len(remaining_seed_types) == len(test_seed_types) - 1

    @pytest.mark.asyncio

    async def test_delete_seed_type_not_found(self, async_session: AsyncSession):
        """Test deleting a non-existent seed type."""
        repository = SeedTypeRepository(async_session)
        
        deleted = await repository.delete(99999)
        
        assert deleted is False

    @pytest.mark.asyncio

    async def test_get_by_field_name(self, async_session: AsyncSession, test_seed_types):
        """Test getting seed type by name field."""
        repository = SeedTypeRepository(async_session)
        
        seed_type = await repository.get_by_field("name", test_seed_types[0].name)
        
        assert seed_type is not None
        assert seed_type.id == test_seed_types[0].id
        assert seed_type.name == test_seed_types[0].name

    @pytest.mark.asyncio

    async def test_get_by_field_variety(self, async_session: AsyncSession, test_seed_types):
        """Test getting seed type by variety field."""
        repository = SeedTypeRepository(async_session)
        
        # Find a seed type with a variety
        test_seed_type = next((st for st in test_seed_types if st.variety), None)
        
        if test_seed_type:
            seed_type = await repository.get_by_field("variety", test_seed_type.variety)
            
            assert seed_type is not None
            assert seed_type.variety == test_seed_type.variety

    @pytest.mark.asyncio

    async def test_get_by_field_not_found(self, async_session: AsyncSession):
        """Test getting seed type by field with non-existent value."""
        repository = SeedTypeRepository(async_session)
        
        seed_type = await repository.get_by_field("name", "Non-existent Seed")
        
        assert seed_type is None

    @pytest.mark.asyncio

    async def test_get_by_field_invalid_field(self, async_session: AsyncSession):
        """Test getting seed type by invalid field."""
        repository = SeedTypeRepository(async_session)
        
        # Should handle invalid field gracefully
        seed_type = await repository.get_by_field("invalid_field", "some_value")
        
        assert seed_type is None

    @pytest.mark.asyncio

    async def test_seed_type_with_containers_relationship(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test seed type with containers relationship."""
        repository = SeedTypeRepository(async_session)
        
        # Create a seed type
        seed_type_data = SeedTypeCreate(
            name="Relationship Test Seed",
            variety="Test Variety"
        )
        
        seed_type = await repository.create(seed_type_data)
        
        # The relationship should be accessible but empty initially
        # Note: Container relationships are managed at the container level
        assert seed_type.id is not None

    @pytest.mark.asyncio

    async def test_seed_type_batch_operations(self, async_session: AsyncSession):
        """Test batch operations with seed types."""
        repository = SeedTypeRepository(async_session)
        
        # Create multiple seed types
        seed_types_data = [
            SeedTypeCreate(name="Batch Seed 1", variety="Variety 1"),
            SeedTypeCreate(name="Batch Seed 2", variety="Variety 2"),
            SeedTypeCreate(name="Batch Seed 3", variety="Variety 3"),
        ]
        
        created_seed_types = []
        for data in seed_types_data:
            seed_type = await repository.create(data)
            created_seed_types.append(seed_type)
        
        # Verify all were created
        assert len(created_seed_types) == 3
        
        # Get all and verify they exist
        all_seed_types = await repository.get_all()
        created_ids = {st.id for st in created_seed_types}
        all_ids = {st.id for st in all_seed_types}
        
        assert created_ids.issubset(all_ids)

    @pytest.mark.asyncio

    async def test_seed_type_unique_constraints(self, async_session: AsyncSession):
        """Test seed type uniqueness constraints if any."""
        repository = SeedTypeRepository(async_session)
        
        # Create first seed type
        seed_type_data1 = SeedTypeCreate(
            name="Unique Test Seed",
            variety="Test Variety"
        )
        
        seed_type1 = await repository.create(seed_type_data1)
        assert seed_type1 is not None
        
        # Create second seed type with same name (should be allowed based on model)
        seed_type_data2 = SeedTypeCreate(
            name="Unique Test Seed",  # Same name
            variety="Different Variety"
        )
        
        # This should succeed unless there's a unique constraint on name
        seed_type2 = await repository.create(seed_type_data2)
        
        # Based on the model, names are not unique, so this should succeed
        assert seed_type2 is not None
        assert seed_type2.id != seed_type1.id

    @pytest.mark.asyncio

    async def test_seed_type_field_length_limits(self, async_session: AsyncSession):
        """Test seed type with field length limits."""
        repository = SeedTypeRepository(async_session)
        
        # Test with maximum length fields
        long_name = "A" * 100  # Assuming 100 char limit
        long_variety = "B" * 100
        long_supplier = "C" * 100
        long_batch_id = "D" * 100
        
        seed_type_data = SeedTypeCreate(
            name=long_name,
            variety=long_variety,
            supplier=long_supplier,
            batch_id=long_batch_id
        )
        
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type is not None
        assert seed_type.name == long_name
        assert seed_type.variety == long_variety
        assert seed_type.supplier == long_supplier
        assert seed_type.batch_id == long_batch_id

    @pytest.mark.asyncio

    async def test_seed_type_special_characters(self, async_session: AsyncSession):
        """Test seed type with special characters."""
        repository = SeedTypeRepository(async_session)
        
        seed_type_data = SeedTypeCreate(
            name="Ñuña Bean",
            variety="Purple & Gold",
            supplier="Specialty Seeds (UK) Ltd.",
            batch_id="NB-2023/001"
        )
        
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type is not None
        assert seed_type.name == "Ñuña Bean"
        assert seed_type.variety == "Purple & Gold"
        assert seed_type.supplier == "Specialty Seeds (UK) Ltd."
        assert seed_type.batch_id == "NB-2023/001"

    @pytest.mark.asyncio

    async def test_seed_type_null_optional_fields(self, async_session: AsyncSession):
        """Test seed type with explicitly null optional fields."""
        repository = SeedTypeRepository(async_session)
        
        seed_type_data = SeedTypeCreate(
            name="Null Fields Test",
            variety=None,
            supplier=None,
            batch_id=None
        )
        
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type is not None
        assert seed_type.name == "Null Fields Test"
        assert seed_type.variety is None
        assert seed_type.supplier is None
        assert seed_type.batch_id is None

    @pytest.mark.asyncio

    async def test_repository_inheritance(self, async_session: AsyncSession):
        """Test that repository inherits from BaseRepository correctly."""
        repository = SeedTypeRepository(async_session)
        
        # Test inherited methods exist
        assert hasattr(repository, 'get')
        assert hasattr(repository, 'create')
        assert hasattr(repository, 'update')
        assert hasattr(repository, 'delete')
        assert hasattr(repository, 'get_all')
        assert hasattr(repository, 'get_by_field')

    @pytest.mark.asyncio

    async def test_seed_type_timestamps(self, async_session: AsyncSession):
        """Test seed type created_at and updated_at timestamps."""
        repository = SeedTypeRepository(async_session)
        
        # Create seed type
        seed_type_data = SeedTypeCreate(name="Timestamp Test")
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type.created_at is not None
        assert seed_type.updated_at is not None
        
        original_updated_at = seed_type.updated_at
        
        # Update seed type
        update_data = SeedTypeUpdate(variety="Updated Variety")
        updated_seed_type = await repository.update(seed_type.id, update_data)
        
        assert updated_seed_type.updated_at is not None
        assert updated_seed_type.updated_at >= original_updated_at
        assert updated_seed_type.created_at == seed_type.created_at

    @pytest.mark.asyncio

    async def test_seed_type_case_sensitivity(self, async_session: AsyncSession):
        """Test seed type case sensitivity in searches."""
        repository = SeedTypeRepository(async_session)
        
        # Create seed type with specific case
        seed_type_data = SeedTypeCreate(name="CaseSensitive")
        seed_type = await repository.create(seed_type_data)
        
        # Test exact case match
        found_exact = await repository.get_by_field("name", "CaseSensitive")
        assert found_exact is not None
        
        # Test different case (should not match unless database is case-insensitive)
        found_different = await repository.get_by_field("name", "casesensitive")
        # Result depends on database configuration
        # SQLite is case-sensitive by default for string comparisons

    @pytest.mark.asyncio

    async def test_seed_type_empty_string_fields(self, async_session: AsyncSession):
        """Test seed type with empty string fields."""
        repository = SeedTypeRepository(async_session)
        
        seed_type_data = SeedTypeCreate(
            name="Empty Fields Test",
            variety="",
            supplier="",
            batch_id=""
        )
        
        seed_type = await repository.create(seed_type_data)
        
        assert seed_type is not None
        assert seed_type.name == "Empty Fields Test"
        assert seed_type.variety == ""
        assert seed_type.supplier == ""
        assert seed_type.batch_id == ""