"""Tests for Alert Pydantic schemas."""

import pytest
from pydantic import ValidationError

from app.schemas.alert import AlertCreate, AlertUpdate, Alert


@pytest.mark.schemas
class TestAlertSchemas:
    """Test Alert schema validation."""

    def test_alert_create_valid_full(self):
        """Test alert creation with all fields."""
        data = {
            "container_id": 1,
            "description": "High temperature detected",
            "severity": "high",
            "active": True,
            "related_object": {
                "sensor_id": "temp_001",
                "sensor_type": "temperature",
                "reading": 45.5,
                "threshold": 35.0
            }
        }
        
        alert = AlertCreate(**data)
        
        assert alert.container_id == 1
        assert alert.description == "High temperature detected"
        assert alert.severity == "high"
        assert alert.active is True
        assert alert.related_object["sensor_id"] == "temp_001"
        assert alert.related_object["reading"] == 45.5

    def test_alert_create_required_only(self):
        """Test alert creation with only required fields."""
        data = {
            "container_id": 1,
            "description": "System notification",
            "severity": "low"
        }
        
        alert = AlertCreate(**data)
        
        assert alert.container_id == 1
        assert alert.description == "System notification"
        assert alert.severity == "low"
        assert alert.active is True  # Default value
        assert alert.related_object is None

    def test_alert_create_severity_validation(self):
        """Test alert severity field validation."""
        base_data = {
            "container_id": 1,
            "description": "Test alert"
        }
        
        # Valid severity values
        valid_severities = ["low", "medium", "high", "critical"]
        
        for severity in valid_severities:
            data = {**base_data, "severity": severity}
            alert = AlertCreate(**data)
            assert alert.severity == severity
        
        # Invalid severity
        with pytest.raises(ValidationError) as exc_info:
            data = {**base_data, "severity": "invalid_severity"}
            AlertCreate(**data)
        assert "String should match pattern" in str(exc_info.value)

    def test_alert_create_missing_required_fields(self):
        """Test alert creation fails without required fields."""
        # Missing container_id
        with pytest.raises(ValidationError) as exc_info:
            AlertCreate(description="Test alert", severity="medium")
        assert "container_id" in str(exc_info.value)
        
        # Missing description
        with pytest.raises(ValidationError) as exc_info:
            AlertCreate(container_id=1, severity="medium")
        assert "description" in str(exc_info.value)
        
        # Missing severity
        with pytest.raises(ValidationError) as exc_info:
            AlertCreate(container_id=1, description="Test alert")
        assert "severity" in str(exc_info.value)

    def test_alert_create_active_field_validation(self):
        """Test alert active field validation."""
        data = {
            "container_id": 1,
            "description": "Active test alert",
            "severity": "medium"
        }
        
        # Test default value (True)
        alert_default = AlertCreate(**data)
        assert alert_default.active is True
        
        # Test explicit True
        alert_true = AlertCreate(**{**data, "active": True})
        assert alert_true.active is True
        
        # Test explicit False
        alert_false = AlertCreate(**{**data, "active": False})
        assert alert_false.active is False

    def test_alert_create_related_object_types(self):
        """Test alert related_object field with different data types."""
        base_data = {
            "container_id": 1,
            "description": "Related object test",
            "severity": "medium"
        }
        
        # Simple object
        simple_object = {"sensor": "temp_01", "value": 25.0}
        alert1 = AlertCreate(**{**base_data, "related_object": simple_object})
        assert alert1.related_object["sensor"] == "temp_01"
        
        # Complex nested object
        complex_object = {
            "sensor": {
                "id": "sensor_001",
                "type": "temperature",
                "location": "zone_a"
            },
            "readings": [
                {"timestamp": "2023-01-01T12:00:00Z", "value": 22.5},
                {"timestamp": "2023-01-01T12:05:00Z", "value": 25.0}
            ],
            "metadata": {
                "calibration_date": "2023-01-01",
                "last_maintenance": "2022-12-15"
            }
        }
        alert2 = AlertCreate(**{**base_data, "related_object": complex_object})
        assert alert2.related_object["sensor"]["id"] == "sensor_001"
        assert len(alert2.related_object["readings"]) == 2
        
        # Array object
        array_object = ["sensor_1", "sensor_2", "sensor_3"]
        alert3 = AlertCreate(**{**base_data, "related_object": array_object})
        assert alert3.related_object == ["sensor_1", "sensor_2", "sensor_3"]
        
        # String object
        string_object = "simple_string_reference"
        alert4 = AlertCreate(**{**base_data, "related_object": string_object})
        assert alert4.related_object == "simple_string_reference"
        
        # Number object
        number_object = 12345
        alert5 = AlertCreate(**{**base_data, "related_object": number_object})
        assert alert5.related_object == 12345

    def test_alert_create_description_validation(self):
        """Test alert description field validation."""
        base_data = {
            "container_id": 1,
            "severity": "medium"
        }
        
        # Normal description
        normal_desc = "Temperature sensor reading above threshold"
        alert1 = AlertCreate(**{**base_data, "description": normal_desc})
        assert alert1.description == normal_desc
        
        # Long description (test field length limits)
        long_desc = "A" * 500  # Max length from model
        alert2 = AlertCreate(**{**base_data, "description": long_desc})
        assert alert2.description == long_desc
        
        # Empty description (should be invalid)
        with pytest.raises(ValidationError):
            AlertCreate(**{**base_data, "description": ""})

    def test_alert_create_container_id_validation(self):
        """Test alert container_id field validation."""
        base_data = {
            "description": "Container ID test",
            "severity": "medium"
        }
        
        # Valid positive integer
        alert1 = AlertCreate(**{**base_data, "container_id": 1})
        assert alert1.container_id == 1
        
        alert2 = AlertCreate(**{**base_data, "container_id": 999999})
        assert alert2.container_id == 999999
        
        # Invalid types
        with pytest.raises(ValidationError):
            AlertCreate(**{**base_data, "container_id": "not_an_integer"})
        
        with pytest.raises(ValidationError):
            AlertCreate(**{**base_data, "container_id": 1.5})
        
        with pytest.raises(ValidationError):
            AlertCreate(**{**base_data, "container_id": None})

    def test_alert_update_valid_full(self):
        """Test alert update with all fields."""
        data = {
            "container_id": 2,
            "description": "Updated alert description",
            "severity": "critical",
            "active": False,
            "related_object": {
                "updated_sensor": "temp_002",
                "new_reading": 50.0
            }
        }
        
        alert_update = AlertUpdate(**data)
        
        assert alert_update.container_id == 2
        assert alert_update.description == "Updated alert description"
        assert alert_update.severity == "critical"
        assert alert_update.active is False
        assert alert_update.related_object["updated_sensor"] == "temp_002"

    def test_alert_update_partial(self):
        """Test alert update with partial fields."""
        # Only update description and severity
        data1 = {
            "description": "Partially updated description",
            "severity": "high"
        }
        
        alert_update1 = AlertUpdate(**data1)
        
        assert alert_update1.description == "Partially updated description"
        assert alert_update1.severity == "high"
        assert alert_update1.container_id is None
        assert alert_update1.active is None
        assert alert_update1.related_object is None
        
        # Only update active status
        data2 = {
            "active": False
        }
        
        alert_update2 = AlertUpdate(**data2)
        
        assert alert_update2.active is False
        assert alert_update2.description is None
        assert alert_update2.severity is None

    def test_alert_update_empty(self):
        """Test alert update with no fields."""
        alert_update = AlertUpdate()
        
        assert alert_update.container_id is None
        assert alert_update.description is None
        assert alert_update.severity is None
        assert alert_update.active is None
        assert alert_update.related_object is None

    def test_alert_update_severity_validation(self):
        """Test alert update severity validation."""
        # Valid severities
        for severity in ["low", "medium", "high", "critical"]:
            alert_update = AlertUpdate(severity=severity)
            assert alert_update.severity == severity
        
        # Invalid severity
        with pytest.raises(ValidationError):
            AlertUpdate(severity="invalid_level")

    def test_alert_full_schema(self):
        """Test full alert schema with ID and timestamps."""
        data = {
            "id": 1,
            "container_id": 5,
            "description": "Full schema alert",
            "severity": "medium",
            "active": True,
            "related_object": {
                "sensor": "full_schema_sensor",
                "value": 30.0
            },
            "created_at": "2023-01-01T12:00:00Z",
            "updated_at": "2023-01-02T12:00:00Z"
        }
        
        alert = Alert(**data)
        
        assert alert.id == 1
        assert alert.container_id == 5
        assert alert.description == "Full schema alert"
        assert alert.severity == "medium"
        assert alert.active is True
        assert alert.related_object["sensor"] == "full_schema_sensor"
        from datetime import datetime, timezone
        assert alert.created_at == datetime(2023, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
        assert alert.updated_at == datetime(2023, 1, 2, 12, 0, 0, tzinfo=timezone.utc)

    def test_alert_serialization(self):
        """Test alert schema serialization to dict."""
        data = {
            "container_id": 3,
            "description": "Serialization test alert",
            "severity": "high",
            "active": True,
            "related_object": {"test": "data"}
        }
        
        alert = AlertCreate(**data)
        serialized = alert.model_dump()
        
        assert serialized["container_id"] == 3
        assert serialized["description"] == "Serialization test alert"
        assert serialized["severity"] == "high"
        assert serialized["active"] is True
        assert serialized["related_object"]["test"] == "data"

    def test_alert_deserialization_from_json(self):
        """Test alert schema deserialization from JSON-like dict."""
        json_data = {
            "container_id": 4,
            "description": "JSON deserialization test",
            "severity": "critical",
            "active": False,
            "related_object": {
                "json_sensor": "json_sensor_001",
                "json_value": 99.9
            }
        }
        
        alert = AlertCreate.model_validate(json_data)
        
        assert alert.container_id == 4
        assert alert.description == "JSON deserialization test"
        assert alert.severity == "critical"
        assert alert.active is False
        assert alert.related_object["json_sensor"] == "json_sensor_001"

    def test_alert_model_dump_exclude_none(self):
        """Test alert model dump excluding None values."""
        data = {
            "container_id": 1,
            "description": "Exclude None test",
            "severity": "medium"
            # active uses default, related_object is None
        }
        
        alert = AlertCreate(**data)
        serialized = alert.model_dump(exclude_none=True)
        
        assert "container_id" in serialized
        assert "description" in serialized
        assert "severity" in serialized
        assert "active" in serialized  # Has default value
        assert "related_object" not in serialized  # Is None

    def test_alert_model_dump_exclude_unset(self):
        """Test alert model dump excluding unset values."""
        data = {
            "container_id": 1,
            "description": "Exclude unset test",
            "severity": "medium"
        }
        
        alert_update = AlertUpdate(**data)
        serialized = alert_update.model_dump(exclude_unset=True)
        
        assert "container_id" in serialized
        assert "description" in serialized
        assert "severity" in serialized
        assert "active" not in serialized  # Not set
        assert "related_object" not in serialized  # Not set

    def test_alert_realistic_scenarios(self):
        """Test alert schemas with realistic data scenarios."""
        # Temperature alert
        temp_alert = AlertCreate(
            container_id=1,
            description="Temperature exceeds optimal range",
            severity="high",
            active=True,
            related_object={
                "sensor_type": "temperature",
                "sensor_id": "TEMP_001",
                "current_value": 35.5,
                "threshold_value": 30.0,
                "unit": "celsius",
                "location": "greenhouse_section_a"
            }
        )
        assert temp_alert.severity == "high"
        assert temp_alert.related_object["sensor_type"] == "temperature"
        
        # Humidity alert
        humidity_alert = AlertCreate(
            container_id=2,
            description="Humidity levels below minimum threshold",
            severity="medium",
            active=True,
            related_object={
                "sensor_type": "humidity",
                "sensor_id": "HUM_002", 
                "current_value": 40.0,
                "threshold_value": 60.0,
                "unit": "percentage",
                "trend": "decreasing"
            }
        )
        assert humidity_alert.description == "Humidity levels below minimum threshold"
        
        # System alert (no sensor data)
        system_alert = AlertCreate(
            container_id=3,
            description="Container power supply disconnected",
            severity="critical",
            active=True,
            related_object={
                "alert_type": "system",
                "component": "power_supply",
                "last_contact": "2023-01-01T11:30:00Z",
                "backup_status": "active"
            }
        )
        assert system_alert.severity == "critical"
        
        # Maintenance alert (inactive)
        maintenance_alert = AlertCreate(
            container_id=1,
            description="Scheduled maintenance completed",
            severity="low", 
            active=False,
            related_object={
                "maintenance_type": "routine_cleaning",
                "completed_by": "tech_001",
                "completion_time": "2023-01-01T14:00:00Z",
                "next_scheduled": "2023-02-01T14:00:00Z"
            }
        )
        assert maintenance_alert.active is False

    def test_alert_edge_cases(self):
        """Test alert schema edge cases and boundary conditions."""
        # Minimum valid alert
        min_alert = AlertCreate(
            container_id=1,
            description="X",  # Single character
            severity="low"
        )
        assert min_alert.description == "X"
        
        # Maximum description length
        max_desc = "A" * 500  # Assuming 500 char limit from model
        max_alert = AlertCreate(
            container_id=1,
            description=max_desc,
            severity="critical"
        )
        assert len(max_alert.description) == 500
        
        # Very large container ID
        large_id_alert = AlertCreate(
            container_id=999999999,
            description="Large container ID test",
            severity="medium"
        )
        assert large_id_alert.container_id == 999999999
        
        # Complex nested related_object
        complex_alert = AlertCreate(
            container_id=1,
            description="Complex related object test",
            severity="high",
            related_object={
                "level_1": {
                    "level_2": {
                        "level_3": {
                            "deep_value": "nested_data",
                            "array": [1, 2, 3, {"nested_array_object": True}]
                        }
                    }
                },
                "parallel_data": ["a", "b", "c"]
            }
        )
        assert complex_alert.related_object["level_1"]["level_2"]["level_3"]["deep_value"] == "nested_data"

    def test_alert_with_container_relationship(self):
        """Test alert schema doesn't include container relationship in create/update."""
        # Create and update schemas should not include container relationship
        data = {
            "container_id": 1,
            "description": "Relationship test",
            "severity": "medium"
        }
        
        alert_create = AlertCreate(**data)
        
        # Verify container relationship is not part of create schema
        assert not hasattr(alert_create, 'container')
        
        # But should be present in full schema
        full_data = {
            "id": 1,
            "container_id": 1,
            "description": "Relationship test",
            "severity": "medium",
            "active": True,
            "created_at": "2023-01-01T12:00:00Z",
            "updated_at": "2023-01-01T12:00:00Z"
        }
        
        full_alert = Alert(**full_data)
        # Note: The actual container object would be loaded separately
        # The schema just defines the structure