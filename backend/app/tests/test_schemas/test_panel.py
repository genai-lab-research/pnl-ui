"""Tests for Panel schemas."""

import pytest
from datetime import datetime, timezone
from pydantic import ValidationError

from app.schemas.panel import PanelResponse


@pytest.mark.schemas
class TestPanelResponse:
    """Test PanelResponse schema validation and serialization."""

    def test_panel_response_complete_data(self):
        """Test PanelResponse with all fields."""
        panel_data = {
            "id": 1,
            "container_id": 100,
            "rfid_tag": "PANEL001",
            "location": {"wall": "wall_1", "slot_number": 15},
            "utilization_pct": 75.5,
            "provisioned_at": datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc),
            "status": "active",
            "capacity": 15,
            "panel_type": "cultivation"
        }
        
        panel_response = PanelResponse(**panel_data)
        
        assert panel_response.id == 1
        assert panel_response.container_id == 100
        assert panel_response.rfid_tag == "PANEL001"
        assert panel_response.location["wall"] == "wall_1"
        assert panel_response.location["slot_number"] == 15
        assert panel_response.utilization_pct == 75.5
        assert panel_response.provisioned_at == datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
        assert panel_response.status == "active"
        assert panel_response.capacity == 15
        assert panel_response.panel_type == "cultivation"

    def test_panel_response_minimal_data(self):
        """Test PanelResponse with only required field."""
        panel_data = {"id": 1}
        
        panel_response = PanelResponse(**panel_data)
        
        assert panel_response.id == 1
        assert panel_response.container_id is None
        assert panel_response.rfid_tag is None
        assert panel_response.location is None
        assert panel_response.utilization_pct is None
        assert panel_response.provisioned_at is None
        assert panel_response.status is None
        assert panel_response.capacity is None
        assert panel_response.panel_type is None

    def test_panel_response_missing_required_field(self):
        """Test PanelResponse validation with missing required field."""
        panel_data = {
            "container_id": 100,
            "rfid_tag": "PANEL001"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            PanelResponse(**panel_data)
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]["loc"] == ("id",)
        assert errors[0]["type"] == "missing"

    def test_panel_response_invalid_types(self):
        """Test PanelResponse validation with invalid field types."""
        # Invalid ID type
        with pytest.raises(ValidationError) as exc_info:
            PanelResponse(id="invalid_id")
        
        errors = exc_info.value.errors()
        assert any(error["loc"] == ("id",) for error in errors)

    def test_panel_response_location_json_validation(self):
        """Test location field JSON validation."""
        # Valid location formats
        valid_locations = [
            {"wall": "wall_1", "slot_number": 1},
            {"wall": "wall_2", "slot_number": 22},
            {"wall": "wall_3", "slot_number": 10, "notes": "test"},
            {},  # Empty dict is valid
            None  # None is valid
        ]
        
        for location in valid_locations:
            panel_data = {"id": 1, "location": location}
            panel_response = PanelResponse(**panel_data)
            assert panel_response.location == location

    def test_panel_response_utilization_percentage_validation(self):
        """Test utilization percentage field validation."""
        # Valid percentages
        valid_percentages = [0.0, 50.0, 100.0, 0, 100, None]
        
        for percentage in valid_percentages:
            panel_data = {"id": 1, "utilization_pct": percentage}
            panel_response = PanelResponse(**panel_data)
            assert panel_response.utilization_pct == percentage

    def test_panel_response_capacity_validation(self):
        """Test capacity field validation."""
        # Valid capacities
        valid_capacities = [1, 15, 75, 100, None]
        
        for capacity in valid_capacities:
            panel_data = {"id": 1, "capacity": capacity}
            panel_response = PanelResponse(**panel_data)
            assert panel_response.capacity == capacity
        
        # Invalid capacity type
        with pytest.raises(ValidationError):
            PanelResponse(id=1, capacity="invalid")

    def test_panel_response_datetime_validation(self):
        """Test datetime field validation."""
        # Valid datetime formats
        valid_datetimes = [
            datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc),
            datetime(2024, 12, 31, 23, 59, 59),
            None
        ]
        
        for dt in valid_datetimes:
            panel_data = {"id": 1, "provisioned_at": dt}
            panel_response = PanelResponse(**panel_data)
            assert panel_response.provisioned_at == dt

    def test_panel_response_status_validation(self):
        """Test status field validation."""
        # Valid status values
        valid_statuses = ["active", "inactive", "maintenance", "error", None, ""]
        
        for status in valid_statuses:
            panel_data = {"id": 1, "status": status}
            panel_response = PanelResponse(**panel_data)
            assert panel_response.status == status

    def test_panel_response_serialization(self):
        """Test PanelResponse serialization to dict."""
        panel_data = {
            "id": 1,
            "container_id": 100,
            "rfid_tag": "PANEL001",
            "location": {"wall": "wall_1", "slot_number": 15},
            "utilization_pct": 75.5,
            "provisioned_at": datetime(2024, 1, 1, 12, 0, 0, tzinfo=timezone.utc),
            "status": "active",
            "capacity": 15,
            "panel_type": "cultivation"
        }
        
        panel_response = PanelResponse(**panel_data)
        serialized = panel_response.model_dump()
        
        assert serialized["id"] == 1
        assert serialized["container_id"] == 100
        assert serialized["rfid_tag"] == "PANEL001"
        assert serialized["location"]["wall"] == "wall_1"
        assert serialized["utilization_pct"] == 75.5
        assert serialized["status"] == "active"

    def test_panel_response_from_attributes(self):
        """Test PanelResponse creation from model attributes."""
        # Simulate SQLAlchemy model object
        class MockPanelModel:
            id = 1
            container_id = 100
            rfid_tag = "PANEL001"
            location = {"wall": "wall_2", "slot_number": 8}
            utilization_pct = 60.0
            provisioned_at = datetime(2024, 1, 1, tzinfo=timezone.utc)
            status = "active"
            capacity = 15
            panel_type = "cultivation"
        
        mock_panel = MockPanelModel()
        panel_response = PanelResponse.model_validate(mock_panel)
        
        assert panel_response.id == 1
        assert panel_response.container_id == 100
        assert panel_response.rfid_tag == "PANEL001"
        assert panel_response.location["wall"] == "wall_2"
        assert panel_response.utilization_pct == 60.0
        assert panel_response.status == "active"