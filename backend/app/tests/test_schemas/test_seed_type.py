"""Tests for SeedType Pydantic schemas."""

import pytest
from pydantic import ValidationError

from app.schemas.seed_type import SeedTypeCreate, SeedTypeUpdate, SeedType


@pytest.mark.schemas
class TestSeedTypeSchemas:
    """Test SeedType schema validation."""

    def test_seed_type_create_valid_full(self):
        """Test seed type creation with all fields."""
        data = {
            "name": "Tomato",
            "variety": "Cherry",
            "supplier": "Seeds Corp",
            "batch_id": "TCH001"
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == "Tomato"
        assert seed_type.variety == "Cherry"
        assert seed_type.supplier == "Seeds Corp"
        assert seed_type.batch_id == "TCH001"

    def test_seed_type_create_required_only(self):
        """Test seed type creation with only required fields."""
        data = {
            "name": "Lettuce"
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == "Lettuce"
        assert seed_type.variety is None
        assert seed_type.supplier is None
        assert seed_type.batch_id is None

    def test_seed_type_create_partial_fields(self):
        """Test seed type creation with different combinations of optional fields."""
        # Only name and variety
        data1 = {
            "name": "Basil",
            "variety": "Sweet"
        }
        
        seed_type1 = SeedTypeCreate(**data1)
        
        assert seed_type1.name == "Basil"
        assert seed_type1.variety == "Sweet"
        assert seed_type1.supplier is None
        assert seed_type1.batch_id is None
        
        # Only name and supplier
        data2 = {
            "name": "Oregano",
            "supplier": "Herb Supply"
        }
        
        seed_type2 = SeedTypeCreate(**data2)
        
        assert seed_type2.name == "Oregano"
        assert seed_type2.variety is None
        assert seed_type2.supplier == "Herb Supply"
        assert seed_type2.batch_id is None
        
        # Only name and batch_id
        data3 = {
            "name": "Thyme",
            "batch_id": "TH001"
        }
        
        seed_type3 = SeedTypeCreate(**data3)
        
        assert seed_type3.name == "Thyme"
        assert seed_type3.variety is None
        assert seed_type3.supplier is None
        assert seed_type3.batch_id == "TH001"

    def test_seed_type_create_missing_required_field(self):
        """Test seed type creation fails without required name field."""
        # Missing name field
        data = {
            "variety": "Cherry",
            "supplier": "Seeds Corp",
            "batch_id": "TCH001"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            SeedTypeCreate(**data)
        assert "name" in str(exc_info.value)

    def test_seed_type_create_empty_strings(self):
        """Test seed type creation with empty strings."""
        data = {
            "name": "",
            "variety": "",
            "supplier": "",
            "batch_id": ""
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == ""
        assert seed_type.variety == ""
        assert seed_type.supplier == ""
        assert seed_type.batch_id == ""

    def test_seed_type_create_whitespace_strings(self):
        """Test seed type creation with whitespace strings."""
        data = {
            "name": "   Parsley   ",
            "variety": "  Flat-leaf  ",
            "supplier": "  Green Herbs  ",
            "batch_id": "  PFL001  "
        }
        
        seed_type = SeedTypeCreate(**data)
        
        # Pydantic doesn't strip whitespace by default
        assert seed_type.name == "   Parsley   "
        assert seed_type.variety == "  Flat-leaf  "
        assert seed_type.supplier == "  Green Herbs  "
        assert seed_type.batch_id == "  PFL001  "

    def test_seed_type_create_long_strings(self):
        """Test seed type creation with maximum length strings."""
        # Test with strings at the field length limits (assumed 100 chars based on model)
        long_name = "A" * 100
        long_variety = "B" * 100
        long_supplier = "C" * 100
        long_batch_id = "D" * 100
        
        data = {
            "name": long_name,
            "variety": long_variety,
            "supplier": long_supplier,
            "batch_id": long_batch_id
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == long_name
        assert seed_type.variety == long_variety
        assert seed_type.supplier == long_supplier
        assert seed_type.batch_id == long_batch_id

    def test_seed_type_create_special_characters(self):
        """Test seed type creation with special characters."""
        data = {
            "name": "Ñuña Bean",
            "variety": "Purple & Gold",
            "supplier": "Specialty Seeds (UK) Ltd.",
            "batch_id": "NB-2023/001"
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == "Ñuña Bean"
        assert seed_type.variety == "Purple & Gold"
        assert seed_type.supplier == "Specialty Seeds (UK) Ltd."
        assert seed_type.batch_id == "NB-2023/001"

    def test_seed_type_create_numeric_strings(self):
        """Test seed type creation with numeric strings."""
        data = {
            "name": "Variety 123",
            "variety": "Type 456",
            "supplier": "Supplier 789",
            "batch_id": "001002003"
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == "Variety 123"
        assert seed_type.variety == "Type 456"
        assert seed_type.supplier == "Supplier 789"
        assert seed_type.batch_id == "001002003"

    def test_seed_type_update_valid_full(self):
        """Test seed type update with all fields."""
        data = {
            "name": "Updated Tomato",
            "variety": "Roma",
            "supplier": "New Seeds Corp",
            "batch_id": "ROM001"
        }
        
        seed_type_update = SeedTypeUpdate(**data)
        
        assert seed_type_update.name == "Updated Tomato"
        assert seed_type_update.variety == "Roma"
        assert seed_type_update.supplier == "New Seeds Corp"
        assert seed_type_update.batch_id == "ROM001"

    def test_seed_type_update_partial(self):
        """Test seed type update with partial fields."""
        # Only update name
        data1 = {
            "name": "Updated Name"
        }
        
        seed_type_update1 = SeedTypeUpdate(**data1)
        
        assert seed_type_update1.name == "Updated Name"
        assert seed_type_update1.variety is None
        assert seed_type_update1.supplier is None
        assert seed_type_update1.batch_id is None
        
        # Only update variety and supplier
        data2 = {
            "variety": "New Variety",
            "supplier": "New Supplier"
        }
        
        seed_type_update2 = SeedTypeUpdate(**data2)
        
        assert seed_type_update2.name is None
        assert seed_type_update2.variety == "New Variety"
        assert seed_type_update2.supplier == "New Supplier"
        assert seed_type_update2.batch_id is None

    def test_seed_type_update_empty(self):
        """Test seed type update with no fields."""
        seed_type_update = SeedTypeUpdate()
        
        assert seed_type_update.name is None
        assert seed_type_update.variety is None
        assert seed_type_update.supplier is None
        assert seed_type_update.batch_id is None

    def test_seed_type_update_explicit_none(self):
        """Test seed type update with explicit None values."""
        data = {
            "name": "Keep Name",
            "variety": None,
            "supplier": None,
            "batch_id": "Keep Batch"
        }
        
        seed_type_update = SeedTypeUpdate(**data)
        
        assert seed_type_update.name == "Keep Name"
        assert seed_type_update.variety is None
        assert seed_type_update.supplier is None
        assert seed_type_update.batch_id == "Keep Batch"

    def test_seed_type_full_schema(self):
        """Test full seed type schema with ID and timestamps."""
        data = {
            "id": 1,
            "name": "Full Schema Tomato",
            "variety": "Beefsteak",
            "supplier": "Premium Seeds",
            "batch_id": "BST001",
            "created_at": "2023-01-01T12:00:00Z",
            "updated_at": "2023-01-02T12:00:00Z"
        }
        
        seed_type = SeedType(**data)
        
        assert seed_type.id == 1
        assert seed_type.name == "Full Schema Tomato"
        assert seed_type.variety == "Beefsteak"
        assert seed_type.supplier == "Premium Seeds"
        assert seed_type.batch_id == "BST001"
        from datetime import datetime, timezone
        assert seed_type.created_at == datetime(2023, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
        assert seed_type.updated_at == datetime(2023, 1, 2, 12, 0, 0, tzinfo=timezone.utc)

    def test_seed_type_invalid_types(self):
        """Test seed type creation with invalid data types."""
        # Non-string name
        with pytest.raises(ValidationError):
            SeedTypeCreate(name=123)
        
        # Non-string variety
        with pytest.raises(ValidationError):
            SeedTypeCreate(name="Test", variety=456)
        
        # Non-string supplier
        with pytest.raises(ValidationError):
            SeedTypeCreate(name="Test", supplier=789)
        
        # Non-string batch_id
        with pytest.raises(ValidationError):
            SeedTypeCreate(name="Test", batch_id=101112)

    def test_seed_type_serialization(self):
        """Test seed type schema serialization to dict."""
        data = {
            "name": "Serialization Test",
            "variety": "Test Variety",
            "supplier": "Test Supplier",
            "batch_id": "ST001"
        }
        
        seed_type = SeedTypeCreate(**data)
        serialized = seed_type.model_dump()
        
        assert serialized["name"] == "Serialization Test"
        assert serialized["variety"] == "Test Variety"
        assert serialized["supplier"] == "Test Supplier"
        assert serialized["batch_id"] == "ST001"

    def test_seed_type_deserialization_from_json(self):
        """Test seed type schema deserialization from JSON-like dict."""
        json_data = {
            "name": "JSON Seed Type",
            "variety": "JSON Variety",
            "supplier": "JSON Supplier",
            "batch_id": "JSON001"
        }
        
        seed_type = SeedTypeCreate.model_validate(json_data)
        
        assert seed_type.name == "JSON Seed Type"
        assert seed_type.variety == "JSON Variety"
        assert seed_type.supplier == "JSON Supplier"
        assert seed_type.batch_id == "JSON001"

    def test_seed_type_model_dump_exclude_none(self):
        """Test seed type model dump excluding None values."""
        data = {
            "name": "Exclude None Test",
            "variety": "Test Variety"
            # supplier and batch_id are None
        }
        
        seed_type = SeedTypeCreate(**data)
        serialized = seed_type.model_dump(exclude_none=True)
        
        assert "name" in serialized
        assert "variety" in serialized
        assert "supplier" not in serialized
        assert "batch_id" not in serialized

    def test_seed_type_model_dump_exclude_unset(self):
        """Test seed type model dump excluding unset values."""
        data = {
            "name": "Exclude Unset Test",
            "variety": "Test Variety"
        }
        
        seed_type = SeedTypeUpdate(**data)
        serialized = seed_type.model_dump(exclude_unset=True)
        
        assert "name" in serialized
        assert "variety" in serialized
        assert "supplier" not in serialized
        assert "batch_id" not in serialized

    def test_seed_type_field_validation_edge_cases(self):
        """Test seed type field validation edge cases."""
        # Test with None for optional fields in create schema
        data = {
            "name": "Edge Case Test",
            "variety": None,
            "supplier": None,
            "batch_id": None
        }
        
        seed_type = SeedTypeCreate(**data)
        
        assert seed_type.name == "Edge Case Test"
        assert seed_type.variety is None
        assert seed_type.supplier is None
        assert seed_type.batch_id is None

    def test_seed_type_create_with_containers_relationship(self):
        """Test seed type create schema doesn't include containers relationship."""
        # The create schema should not include the containers relationship
        # as it's managed separately
        data = {
            "name": "Relationship Test",
            "variety": "Test Variety"
        }
        
        seed_type = SeedTypeCreate(**data)
        
        # Verify containers relationship is not part of create schema
        assert not hasattr(seed_type, 'containers')
        
        # Full schema can be created without containers relationship
        # (containers relationship is managed from Container side)
        full_data = {
            "id": 1,
            "name": "Relationship Test",
            "variety": "Test Variety",
            "created_at": "2023-01-01T12:00:00Z",
            "updated_at": "2023-01-01T12:00:00Z"
        }
        
        full_seed_type = SeedType(**full_data)
        assert full_seed_type.name == "Relationship Test"
        assert full_seed_type.variety == "Test Variety"

    def test_seed_type_realistic_data_scenarios(self):
        """Test seed type schemas with realistic data scenarios."""
        # Vegetable seed
        vegetable_data = {
            "name": "Carrot",
            "variety": "Nantes",
            "supplier": "European Seeds Ltd",
            "batch_id": "CAR-NT-2023-045"
        }
        
        vegetable_seed = SeedTypeCreate(**vegetable_data)
        assert vegetable_seed.name == "Carrot"
        
        # Herb seed
        herb_data = {
            "name": "Rosemary",
            "variety": "Blue Lagoon",
            "supplier": "Mediterranean Herbs Co",
            "batch_id": "ROS-BL-2023-012"
        }
        
        herb_seed = SeedTypeCreate(**herb_data)
        assert herb_seed.variety == "Blue Lagoon"
        
        # Flower seed
        flower_data = {
            "name": "Marigold",
            "variety": "French Vanilla",
            "supplier": "Bloom & Grow Seeds",
            "batch_id": "MAR-FV-2023-078"
        }
        
        flower_seed = SeedTypeCreate(**flower_data)
        assert flower_seed.supplier == "Bloom & Grow Seeds"
        
        # Specialty seed with minimal info
        specialty_data = {
            "name": "Microgreens Mix"
        }
        
        specialty_seed = SeedTypeCreate(**specialty_data)
        assert specialty_seed.name == "Microgreens Mix"
        assert specialty_seed.variety is None