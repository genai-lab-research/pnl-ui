"""Tests for Container schemas with simplified structure."""

import pytest
from pydantic import ValidationError

from app.schemas.container import (
    ContainerBase,
    ContainerCreate,
    ContainerUpdate,
    Container,
    ContainerFilterCriteria
)


@pytest.mark.schemas
class TestContainerSchemas:
    """Test Container schema functionality with simplified structure."""

    def test_container_base_valid(self):
        """Test ContainerBase with valid data."""
        data = {
            "name": "Test Container",
            "tenant_id": 1,
            "type": "physical",
            "purpose": "development",
            "location": {
                "city": "San Francisco",
                "country": "USA",
                "address": "123 Test St"
            },
            "notes": "Test container notes",
            "status": "active",
            "shadow_service_enabled": True,
            "robotics_simulation_enabled": False,
            "ecosystem_connected": True,
            "ecosystem_settings": {"monitoring": True}
        }
        
        container = ContainerBase(**data)
        
        assert container.name == "Test Container"
        assert container.tenant_id == 1
        assert container.type == "physical"
        assert container.purpose == "development"
        assert container.location.city == "San Francisco"
        assert container.notes == "Test container notes"
        assert container.status == "active"
        assert container.shadow_service_enabled is True
        assert container.robotics_simulation_enabled is False
        assert container.ecosystem_connected is True
        assert container.ecosystem_settings["monitoring"] is True

    def test_container_create_valid(self):
        """Test ContainerCreate with valid data."""
        data = {
            "name": "New Container",
            "tenant_id": 2,
            "type": "virtual",
            "purpose": "research",
            "status": "created",
            "shadow_service_enabled": False,
            "ecosystem_connected": False,
            "seed_type_ids": [1, 2, 3]
        }
        
        container = ContainerCreate(**data)
        
        assert container.name == "New Container"
        assert container.tenant_id == 2
        assert container.type == "virtual"
        assert container.purpose == "research"
        assert container.status == "created"
        assert container.shadow_service_enabled is False
        assert container.ecosystem_connected is False
        assert container.seed_type_ids == [1, 2, 3]

    def test_container_create_minimal(self):
        """Test ContainerCreate with minimal required fields."""
        data = {
            "name": "Minimal Container",
            "tenant_id": 1,
            "type": "physical",
            "purpose": "production"
        }
        
        container = ContainerCreate(**data)
        
        assert container.name == "Minimal Container"
        assert container.tenant_id == 1
        assert container.type == "physical"
        assert container.purpose == "production"
        assert container.status == "created"  # Default value
        assert container.shadow_service_enabled is False  # Default value
        assert container.seed_type_ids == []  # Default value

    def test_container_create_invalid_type(self):
        """Test ContainerCreate with invalid type."""
        data = {
            "name": "Invalid Container",
            "tenant_id": 1,
            "type": "invalid_type",  # Should only be 'physical' or 'virtual'
            "purpose": "development"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(**data)
        
        assert "type" in str(exc_info.value)

    def test_container_create_invalid_purpose(self):
        """Test ContainerCreate with invalid purpose."""
        data = {
            "name": "Invalid Container",
            "tenant_id": 1,
            "type": "physical",
            "purpose": "invalid_purpose"  # Should be development, research, or production
        }
        
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(**data)
        
        assert "purpose" in str(exc_info.value)

    def test_container_create_invalid_status(self):
        """Test ContainerCreate with invalid status."""
        data = {
            "name": "Invalid Container",
            "tenant_id": 1,
            "type": "physical",
            "purpose": "development",
            "status": "invalid_status"  # Should be created, active, maintenance, or inactive
        }
        
        with pytest.raises(ValidationError) as exc_info:
            ContainerCreate(**data)
        
        assert "status" in str(exc_info.value)

    def test_container_update_valid(self):
        """Test ContainerUpdate with valid data."""
        data = {
            "name": "Updated Container",
            "status": "maintenance",
            "notes": "Updated notes",
            "shadow_service_enabled": True,
            "ecosystem_connected": True,
            "ecosystem_settings": {"updated": True},
            "seed_type_ids": [2, 3, 4]
        }
        
        container = ContainerUpdate(**data)
        
        assert container.name == "Updated Container"
        assert container.status == "maintenance"
        assert container.notes == "Updated notes"
        assert container.shadow_service_enabled is True
        assert container.ecosystem_connected is True
        assert container.ecosystem_settings["updated"] is True
        assert container.seed_type_ids == [2, 3, 4]

    def test_container_update_partial(self):
        """Test ContainerUpdate with partial data."""
        data = {
            "status": "active",
            "notes": "Partial update"
        }
        
        container = ContainerUpdate(**data)
        
        assert container.status == "active"
        assert container.notes == "Partial update"
        assert container.name is None  # Not provided
        assert container.tenant_id is None  # Not provided

    def test_container_full_schema(self):
        """Test full Container schema with relationships."""
        data = {
            "id": 1,
            "name": "Full Container",
            "tenant_id": 1,
            "type": "physical",
            "purpose": "production",
            "location": {"city": "NYC", "country": "USA"},
            "notes": "Full container",
            "status": "active",
            "shadow_service_enabled": True,
            "robotics_simulation_enabled": False,
            "ecosystem_connected": True,
            "ecosystem_settings": {"monitoring": True},
            "created_at": "2023-01-01T00:00:00Z",
            "updated_at": "2023-01-01T00:00:00Z",
            "seed_types": [],
            "alerts": []
        }
        
        container = Container(**data)
        
        assert container.id == 1
        assert container.name == "Full Container"
        assert container.tenant_id == 1
        assert container.type == "physical"
        assert container.purpose == "production"
        assert container.location.city == "NYC"
        assert container.status == "active"
        assert container.shadow_service_enabled is True
        assert container.ecosystem_connected is True
        assert isinstance(container.seed_types, list)
        assert isinstance(container.alerts, list)

    def test_container_filter_criteria(self):
        """Test ContainerFilterCriteria schema."""
        data = {
            "search": "test",
            "type": "physical",
            "tenant": 1,
            "purpose": "development",
            "status": "active",
            "alerts": True,
            "page": 2,
            "limit": 50,
            "sort": "name",
            "order": "desc"
        }
        
        filters = ContainerFilterCriteria(**data)
        
        assert filters.search == "test"
        assert filters.type == "physical"
        assert filters.tenant == 1
        assert filters.purpose == "development"
        assert filters.status == "active"
        assert filters.alerts is True
        assert filters.page == 2
        assert filters.limit == 50
        assert filters.sort == "name"
        assert filters.order == "desc"

    def test_container_filter_criteria_defaults(self):
        """Test ContainerFilterCriteria with default values."""
        filters = ContainerFilterCriteria()
        
        assert filters.search is None
        assert filters.type is None
        assert filters.tenant is None
        assert filters.purpose is None
        assert filters.status is None
        assert filters.alerts is None
        assert filters.page == 1  # Default
        assert filters.limit == 10  # Default
        assert filters.sort == "name"  # Default
        assert filters.order == "asc"  # Default

    def test_schema_serialization(self):
        """Test schema serialization to dict."""
        data = {
            "name": "Serialization Test",
            "tenant_id": 1,
            "type": "virtual",
            "purpose": "research",
            "shadow_service_enabled": True,
            "seed_type_ids": [1, 2]
        }
        
        container = ContainerCreate(**data)
        serialized = container.model_dump()
        
        assert serialized["name"] == "Serialization Test"
        assert serialized["tenant_id"] == 1
        assert serialized["type"] == "virtual"
        assert serialized["purpose"] == "research"
        assert serialized["shadow_service_enabled"] is True
        assert serialized["seed_type_ids"] == [1, 2]

    def test_schema_json_serialization(self):
        """Test schema JSON serialization."""
        data = {
            "name": "JSON Test",
            "tenant_id": 1,
            "type": "physical",
            "purpose": "production",
            "ecosystem_settings": {"test": True}
        }
        
        container = ContainerCreate(**data)
        json_str = container.model_dump_json()
        
        assert "JSON Test" in json_str
        assert "physical" in json_str
        assert "production" in json_str
        assert "test" in json_str