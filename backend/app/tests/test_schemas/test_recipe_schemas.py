"""Test recipe schemas for validation and serialization."""

import pytest
from datetime import datetime, date
from pydantic import ValidationError

from app.schemas.recipe import (
    RecipeMasterCreate,
    RecipeMasterUpdate,
    RecipeMasterInDB,
    RecipeVersionCreate,
    RecipeVersionUpdate,
    RecipeVersionInDB,
    CropCreate,
    CropUpdate,
    CropInDB,
    CropHistoryCreate,
    CropHistoryInDB,
    CropSnapshotCreate,
    CropSnapshotInDB,
    CropMeasurementCreate,
    CropMeasurementInDB,
    RecipeFilterCriteria,
    CropFilterCriteria,
    CropSnapshotFilterCriteria
)


class TestRecipeMasterSchemas:
    """Test RecipeMaster schema validation."""

    def test_recipe_master_create_valid(self):
        """Test valid recipe master creation schema."""
        data = {
            "name": "Tomato Recipe",
            "crop_type": "Tomato",
            "notes": "Basic tomato growing instructions"
        }
        
        schema = RecipeMasterCreate(**data)
        
        assert schema.name == "Tomato Recipe"
        assert schema.crop_type == "Tomato"
        assert schema.notes == "Basic tomato growing instructions"

    def test_recipe_master_create_required_fields(self):
        """Test that required fields are validated."""
        # Missing name
        with pytest.raises(ValidationError) as exc_info:
            RecipeMasterCreate(crop_type="Tomato")
        assert "name" in str(exc_info.value)

        # Missing crop_type
        with pytest.raises(ValidationError) as exc_info:
            RecipeMasterCreate(name="Test Recipe")
        assert "crop_type" in str(exc_info.value)

    def test_recipe_master_create_optional_notes(self):
        """Test that notes field is optional."""
        schema = RecipeMasterCreate(
            name="Test Recipe",
            crop_type="Lettuce"
        )
        
        assert schema.notes is None

    def test_recipe_master_update_schema(self):
        """Test recipe master update schema."""
        data = {
            "name": "Updated Recipe",
            "crop_type": "Basil",
            "notes": "Updated notes"
        }
        
        schema = RecipeMasterUpdate(**data)
        
        assert schema.name == "Updated Recipe"
        assert schema.crop_type == "Basil"

    def test_recipe_master_in_db_schema(self):
        """Test recipe master database output schema."""
        data = {
            "id": 1,
            "name": "DB Recipe",
            "crop_type": "Spinach",
            "notes": "From database",
            "recipe_versions": []
        }
        
        schema = RecipeMasterInDB(**data)
        
        assert schema.id == 1
        assert schema.name == "DB Recipe"
        assert schema.recipe_versions == []

    def test_recipe_master_with_versions(self):
        """Test recipe master with nested versions."""
        version_data = {
            "id": 1,
            "recipe_id": 1,
            "version": "1.0",
            "valid_from": datetime.utcnow(),
            "created_by": "test_user"
        }
        
        data = {
            "id": 1,
            "name": "Recipe with Versions",
            "crop_type": "Herbs",
            "recipe_versions": [version_data]
        }
        
        schema = RecipeMasterInDB(**data)
        
        assert len(schema.recipe_versions) == 1
        assert schema.recipe_versions[0].version == "1.0"


class TestRecipeVersionSchemas:
    """Test RecipeVersion schema validation."""

    def test_recipe_version_create_valid(self):
        """Test valid recipe version creation schema."""
        data = {
            "version": "1.0",
            "valid_from": datetime.utcnow(),
            "created_by": "test_user",
            "tray_density": 10.5,
            "air_temperature": 22.0,
            "humidity": 70.0,
            "co2": 400.0,
            "water_temperature": 20.0,
            "ec": 1.5,
            "ph": 6.5,
            "water_hours": 8.0,
            "light_hours": 16.0
        }
        
        schema = RecipeVersionCreate(**data)
        
        assert schema.version == "1.0"
        assert schema.created_by == "test_user"
        assert schema.tray_density == 10.5
        assert schema.ph == 6.5

    def test_recipe_version_required_fields(self):
        """Test that required fields are validated."""
        # Missing version
        with pytest.raises(ValidationError) as exc_info:
            RecipeVersionCreate(
                valid_from=datetime.utcnow(),
                created_by="test_user"
            )
        assert "version" in str(exc_info.value)

        # Missing created_by
        with pytest.raises(ValidationError) as exc_info:
            RecipeVersionCreate(
                version="1.0",
                valid_from=datetime.utcnow()
            )
        assert "created_by" in str(exc_info.value)

    def test_recipe_version_optional_measurements(self):
        """Test that measurement fields are optional."""
        schema = RecipeVersionCreate(
            version="minimal",
            valid_from=datetime.utcnow(),
            created_by="test_user"
        )
        
        assert schema.tray_density is None
        assert schema.air_temperature is None
        assert schema.humidity is None

    def test_recipe_version_datetime_validation(self):
        """Test datetime field validation."""
        valid_datetime = datetime.utcnow()
        
        schema = RecipeVersionCreate(
            version="1.0",
            valid_from=valid_datetime,
            valid_to=valid_datetime,
            created_by="test_user"
        )
        
        assert schema.valid_from == valid_datetime
        assert schema.valid_to == valid_datetime

    def test_recipe_version_numeric_validation(self):
        """Test numeric field validation."""
        schema = RecipeVersionCreate(
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="test_user",
            ph=6.5,
            humidity=75.5,
            tray_density=12.25
        )
        
        assert schema.ph == 6.5
        assert schema.humidity == 75.5
        assert schema.tray_density == 12.25

    def test_recipe_version_in_db_schema(self):
        """Test recipe version database output schema."""
        data = {
            "id": 1,
            "recipe_id": 1,
            "version": "1.0",
            "valid_from": datetime.utcnow(),
            "created_by": "test_user",
            "air_temperature": 23.0
        }
        
        schema = RecipeVersionInDB(**data)
        
        assert schema.id == 1
        assert schema.recipe_id == 1
        assert schema.air_temperature == 23.0


class TestCropSchemas:
    """Test Crop schema validation."""

    def test_crop_create_valid(self):
        """Test valid crop creation schema."""
        data = {
            "seed_type_id": 1,
            "seed_date": date.today(),
            "transplanting_date_planned": date.today(),
            "harvesting_date_planned": date.today(),
            "lifecycle_status": "seedling",
            "health_check": "good",
            "current_location": {"zone": "A", "tray": 1},
            "recipe_version_id": 1,
            "notes": "Test crop"
        }
        
        schema = CropCreate(**data)
        
        assert schema.seed_type_id == 1
        assert schema.lifecycle_status == "seedling"
        assert schema.current_location == {"zone": "A", "tray": 1}

    def test_crop_create_all_optional(self):
        """Test that all crop fields are optional."""
        schema = CropCreate()
        
        assert schema.seed_type_id is None
        assert schema.seed_date is None
        assert schema.lifecycle_status is None

    def test_crop_date_validation(self):
        """Test date field validation."""
        today = date.today()
        
        schema = CropCreate(
            seed_date=today,
            transplanting_date_planned=today,
            harvesting_date_planned=today
        )
        
        assert schema.seed_date == today
        assert schema.transplanting_date_planned == today
        assert schema.harvesting_date_planned == today

    def test_crop_json_location_validation(self):
        """Test JSON location field validation."""
        location = {
            "zone": "B",
            "tray": 5,
            "position": {"x": 10, "y": 20}
        }
        
        schema = CropCreate(current_location=location)
        
        assert schema.current_location == location

    def test_crop_in_db_schema(self):
        """Test crop database output schema."""
        data = {
            "id": 1,
            "seed_type_id": 1,
            "seed_date": date.today(),
            "lifecycle_status": "mature",
            "health_check": "excellent",
            "current_location": {"zone": "C"},
            "last_location": {"zone": "B"},
            "measurements_id": 1,
            "image_url": "https://example.com/crop.jpg",
            "accumulated_light_hours": 120.5,
            "accumulated_water_hours": 48.0,
            "notes": "Database crop"
        }
        
        schema = CropInDB(**data)
        
        assert schema.id == 1
        assert schema.accumulated_light_hours == 120.5


class TestCropHistorySchemas:
    """Test CropHistory schema validation."""

    def test_crop_history_create_valid(self):
        """Test valid crop history creation schema."""
        data = {
            "event": "watering",
            "performed_by": "farmer_john",
            "notes": "Regular watering schedule"
        }
        
        schema = CropHistoryCreate(**data)
        
        assert schema.event == "watering"
        assert schema.performed_by == "farmer_john"
        assert schema.notes == "Regular watering schedule"

    def test_crop_history_all_optional(self):
        """Test that all history fields are optional."""
        schema = CropHistoryCreate()
        
        assert schema.event is None
        assert schema.performed_by is None
        assert schema.notes is None

    def test_crop_history_in_db_schema(self):
        """Test crop history database output schema."""
        data = {
            "crop_id": 1,
            "timestamp": datetime.utcnow(),
            "event": "transplanting",
            "performed_by": "farmer_alice",
            "notes": "Moved to larger tray"
        }
        
        schema = CropHistoryInDB(**data)
        
        assert schema.crop_id == 1
        assert schema.event == "transplanting"


class TestCropSnapshotSchemas:
    """Test CropSnapshot schema validation."""

    def test_crop_snapshot_create_valid(self):
        """Test valid crop snapshot creation schema."""
        data = {
            "lifecycle_status": "flowering",
            "health_status": "good",
            "recipe_version_id": 1,
            "location": {"zone": "C", "tray": 3},
            "measurements_id": 1,
            "accumulated_light_hours": 120.5,
            "accumulated_water_hours": 48.0,
            "image_url": "https://example.com/snapshot.jpg"
        }
        
        schema = CropSnapshotCreate(**data)
        
        assert schema.lifecycle_status == "flowering"
        assert schema.location == {"zone": "C", "tray": 3}
        assert schema.accumulated_light_hours == 120.5

    def test_crop_snapshot_all_optional(self):
        """Test that all snapshot fields are optional."""
        schema = CropSnapshotCreate()
        
        assert schema.lifecycle_status is None
        assert schema.location is None
        assert schema.accumulated_light_hours is None

    def test_crop_snapshot_in_db_schema(self):
        """Test crop snapshot database output schema."""
        data = {
            "id": 1,
            "timestamp": datetime.utcnow(),
            "crop_id": 1,
            "lifecycle_status": "mature",
            "health_status": "excellent",
            "location": {"zone": "D"}
        }
        
        schema = CropSnapshotInDB(**data)
        
        assert schema.id == 1
        assert schema.crop_id == 1


class TestCropMeasurementSchemas:
    """Test CropMeasurement schema validation."""

    def test_crop_measurement_create_valid(self):
        """Test valid crop measurement creation schema."""
        data = {
            "radius": 7.5,
            "width": 12.0,
            "height": 18.0,
            "area": 216.0,
            "area_estimated": 220.0,
            "weight": 300.0
        }
        
        schema = CropMeasurementCreate(**data)
        
        assert schema.radius == 7.5
        assert schema.weight == 300.0

    def test_crop_measurement_all_optional(self):
        """Test that all measurement fields are optional."""
        schema = CropMeasurementCreate()
        
        assert schema.radius is None
        assert schema.weight is None

    def test_crop_measurement_numeric_validation(self):
        """Test numeric field validation."""
        schema = CropMeasurementCreate(
            radius=5.123456,
            width=10.987654,
            area=54.321
        )
        
        assert schema.radius == 5.123456
        assert schema.width == 10.987654
        assert schema.area == 54.321

    def test_crop_measurement_in_db_schema(self):
        """Test crop measurement database output schema."""
        data = {
            "id": 1,
            "radius": 8.0,
            "width": 15.0,
            "height": 20.0,
            "area": 300.0,
            "weight": 450.0
        }
        
        schema = CropMeasurementInDB(**data)
        
        assert schema.id == 1
        assert schema.area == 300.0


class TestFilterSchemas:
    """Test filter criteria schemas."""

    def test_recipe_filter_criteria(self):
        """Test recipe filter criteria schema."""
        data = {
            "search": "tomato",
            "crop_type": "Tomato",
            "created_by": "test_user",
            "active_only": True,
            "page": 2,
            "limit": 20,
            "sort": "name",
            "order": "desc"
        }
        
        schema = RecipeFilterCriteria(**data)
        
        assert schema.search == "tomato"
        assert schema.active_only is True
        assert schema.page == 2
        assert schema.order == "desc"

    def test_recipe_filter_defaults(self):
        """Test recipe filter default values."""
        schema = RecipeFilterCriteria()
        
        assert schema.active_only is False
        assert schema.page == 1
        assert schema.limit == 10
        assert schema.sort == "name"
        assert schema.order == "asc"

    def test_crop_filter_criteria(self):
        """Test crop filter criteria schema."""
        data = {
            "search": "lettuce",
            "seed_type_id": 1,
            "lifecycle_status": "mature",
            "health_check": "good",
            "recipe_version_id": 1,
            "page": 3,
            "limit": 25,
            "sort": "seed_date",
            "order": "asc"
        }
        
        schema = CropFilterCriteria(**data)
        
        assert schema.search == "lettuce"
        assert schema.seed_type_id == 1
        assert schema.page == 3

    def test_crop_filter_defaults(self):
        """Test crop filter default values."""
        schema = CropFilterCriteria()
        
        assert schema.page == 1
        assert schema.limit == 10
        assert schema.sort == "seed_date"
        assert schema.order == "desc"

    def test_crop_snapshot_filter_criteria(self):
        """Test crop snapshot filter criteria schema."""
        start_date = datetime.utcnow()
        end_date = datetime.utcnow()
        
        data = {
            "start_date": start_date,
            "end_date": end_date
        }
        
        schema = CropSnapshotFilterCriteria(**data)
        
        assert schema.start_date == start_date
        assert schema.end_date == end_date

    def test_crop_snapshot_filter_optional(self):
        """Test crop snapshot filter optional fields."""
        schema = CropSnapshotFilterCriteria()
        
        assert schema.start_date is None
        assert schema.end_date is None