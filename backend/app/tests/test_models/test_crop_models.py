"""Test cases for crop-related models."""

import pytest
from datetime import datetime, date, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.models.crop_history import CropHistory
from app.models.snapshots import CropSnapshot
from app.models.seed_type import SeedType


class TestCropModels:
    """Test crop model functionality."""
    
    @pytest.mark.asyncio
    async def test_crop_model_creation(self, async_session: AsyncSession):
        """Test creating a crop model."""
        # Create seed type first
        seed_type = SeedType(
            name="Test Lettuce",
            variety="Romaine",
            supplier="Test Supplier",
            batch_id="TST-001"
        )
        async_session.add(seed_type)
        await async_session.flush()
        
        # Create crop measurement
        measurement = CropMeasurement(
            radius=2.5,
            width=5.0,
            height=3.5,
            area=19.6,
            area_estimated=20.0,
            weight=45.5
        )
        async_session.add(measurement)
        await async_session.flush()
        
        # Create crop
        crop = Crop(
            seed_type_id=seed_type.id,
            seed_date=date.today() - timedelta(days=30),
            transplanting_date_planned=date.today() - timedelta(days=16),
            transplanting_date=date.today() - timedelta(days=15),
            harvesting_date_planned=date.today() + timedelta(days=30),
            lifecycle_status="vegetative",
            health_check="good",
            current_location={"type": "tray", "tray_id": 1, "row": 2, "column": 3},
            last_location={"type": "tray", "tray_id": 2, "row": 1, "column": 1},
            measurements_id=measurement.id,
            image_url="https://example.com/crop1.jpg",
            recipe_version_id=None,
            accumulated_light_hours=720.0,
            accumulated_water_hours=180.0,
            notes="Test crop for model testing"
        )
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        # Verify crop creation
        assert crop.id is not None
        assert crop.seed_type_id == seed_type.id
        assert crop.lifecycle_status == "vegetative"
        assert crop.health_check == "good"
        assert crop.current_location["type"] == "tray"
        assert crop.accumulated_light_hours == 720.0
        assert crop.notes == "Test crop for model testing"
    
    @pytest.mark.asyncio
    async def test_crop_model_relationships(self, async_session: AsyncSession):
        """Test crop model relationships."""
        # Create related entities
        seed_type = SeedType(name="Test Seed", variety="Test Variety")
        async_session.add(seed_type)
        await async_session.flush()
        
        measurement = CropMeasurement(radius=1.0, width=2.0, height=1.5)
        async_session.add(measurement)
        await async_session.flush()
        
        crop = Crop(
            seed_type_id=seed_type.id,
            measurements_id=measurement.id,
            lifecycle_status="germinating"
        )
        async_session.add(crop)
        await async_session.flush()
        
        # Create history entry
        history = CropHistory(
            crop_id=crop.id,
            timestamp=datetime.now(timezone.utc),
            event="Created",
            performed_by="test"
        )
        async_session.add(history)
        
        # Create snapshot
        snapshot = CropSnapshot(
            crop_id=crop.id,
            timestamp=datetime.now(timezone.utc),
            lifecycle_status="germinating",
            measurements_id=measurement.id
        )
        async_session.add(snapshot)
        
        await async_session.commit()
        
        # Verify relationships
        await async_session.refresh(crop, ["seed_type", "measurements", "crop_history", "crop_snapshots"])
        
        assert crop.seed_type is not None
        assert crop.seed_type.name == "Test Seed"
        assert crop.measurements is not None
        assert crop.measurements.radius == 1.0
        assert len(crop.crop_history) >= 1
        assert len(crop.crop_snapshots) >= 1
    
    @pytest.mark.asyncio
    async def test_crop_measurement_model(self, async_session: AsyncSession):
        """Test crop measurement model."""
        measurement = CropMeasurement(
            radius=3.2,
            width=6.4,
            height=4.8,
            area=32.2,
            area_estimated=30.0,
            weight=85.5
        )
        
        async_session.add(measurement)
        await async_session.commit()
        await async_session.refresh(measurement)
        
        # Verify measurement creation
        assert measurement.id is not None
        assert measurement.radius == 3.2
        assert measurement.width == 6.4
        assert measurement.height == 4.8
        assert measurement.area == 32.2
        assert measurement.area_estimated == 30.0
        assert measurement.weight == 85.5
    
    @pytest.mark.asyncio
    async def test_crop_history_model(self, async_session: AsyncSession):
        """Test crop history model."""
        # Create crop first
        crop = Crop(lifecycle_status="seeded")
        async_session.add(crop)
        await async_session.flush()
        
        # Create history entry
        timestamp = datetime.now(timezone.utc)
        history = CropHistory(
            crop_id=crop.id,
            timestamp=timestamp,
            event="Seeded",
            performed_by="John Doe",
            notes="Crop was seeded in tray 1"
        )
        
        async_session.add(history)
        await async_session.commit()
        await async_session.refresh(history)
        
        # Verify history creation
        assert history.crop_id == crop.id
        assert history.timestamp == timestamp
        assert history.event == "Seeded"
        assert history.performed_by == "John Doe"
        assert history.notes == "Crop was seeded in tray 1"
    
    @pytest.mark.asyncio
    async def test_crop_snapshot_model(self, async_session: AsyncSession):
        """Test crop snapshot model."""
        # Create dependencies
        crop = Crop(lifecycle_status="vegetative")
        async_session.add(crop)
        await async_session.flush()
        
        measurement = CropMeasurement(radius=2.0, area=12.6)
        async_session.add(measurement)
        await async_session.flush()
        
        # Create snapshot
        timestamp = datetime.now(timezone.utc)
        snapshot = CropSnapshot(
            crop_id=crop.id,
            timestamp=timestamp,
            lifecycle_status="vegetative",
            health_status="good",
            recipe_version_id=None,
            location={"type": "panel", "panel_id": 3, "channel": 2},
            measurements_id=measurement.id,
            accumulated_light_hours=600.0,
            accumulated_water_hours=150.0,
            image_url="https://example.com/snapshot.jpg"
        )
        
        async_session.add(snapshot)
        await async_session.commit()
        await async_session.refresh(snapshot)
        
        # Verify snapshot creation
        assert snapshot.id is not None
        assert snapshot.crop_id == crop.id
        assert snapshot.timestamp == timestamp
        assert snapshot.lifecycle_status == "vegetative"
        assert snapshot.health_status == "good"
        assert snapshot.location["type"] == "panel"
        assert snapshot.accumulated_light_hours == 600.0
        assert snapshot.image_url == "https://example.com/snapshot.jpg"
    
    @pytest.mark.asyncio
    async def test_crop_model_constraints(self, async_session: AsyncSession):
        """Test crop model field constraints and validation."""
        # Test with minimal required fields
        crop = Crop()
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        # Verify creation with minimal fields
        assert crop.id is not None
        assert crop.seed_type_id is None
        assert crop.lifecycle_status is None
        assert crop.notes is None
    
    @pytest.mark.asyncio
    async def test_crop_json_fields(self, async_session: AsyncSession):
        """Test JSON field handling in crop model."""
        complex_location = {
            "type": "panel",
            "panel_id": 5,
            "channel": 3,
            "position": 7,
            "metadata": {
                "installation_date": "2023-01-15",
                "last_maintenance": "2023-06-01"
            }
        }
        
        crop = Crop(
            current_location=complex_location,
            last_location={"type": "tray", "tray_id": 1}
        )
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        # Verify JSON field storage and retrieval
        assert crop.current_location["type"] == "panel"
        assert crop.current_location["panel_id"] == 5
        assert crop.current_location["metadata"]["installation_date"] == "2023-01-15"
        assert crop.last_location["type"] == "tray"
    
    @pytest.mark.asyncio
    async def test_model_cascade_operations(self, async_session: AsyncSession):
        """Test cascade operations between related models."""
        # Create crop with related data
        crop = Crop(lifecycle_status="test")
        async_session.add(crop)
        await async_session.flush()
        
        # Create multiple history entries
        history_entries = [
            CropHistory(crop_id=crop.id, timestamp=datetime.now(), event="Event 1"),
            CropHistory(crop_id=crop.id, timestamp=datetime.now(), event="Event 2"),
            CropHistory(crop_id=crop.id, timestamp=datetime.now(), event="Event 3")
        ]
        
        for history in history_entries:
            async_session.add(history)
        
        # Create multiple snapshots
        snapshots = [
            CropSnapshot(crop_id=crop.id, timestamp=datetime.now(), lifecycle_status="test1"),
            CropSnapshot(crop_id=crop.id, timestamp=datetime.now(), lifecycle_status="test2")
        ]
        
        for snapshot in snapshots:
            async_session.add(snapshot)
        
        await async_session.commit()
        
        # Verify related data was created
        await async_session.refresh(crop, ["crop_history", "crop_snapshots"])
        assert len(crop.crop_history) == 3
        assert len(crop.crop_snapshots) == 2
        
        # Delete crop and verify cascade behavior would be handled by application logic
        # (Note: Actual cascade behavior depends on foreign key constraints)
        crop_id = crop.id
        await async_session.delete(crop)
        await async_session.commit()
        
        # The related history and snapshots should still exist since we don't have CASCADE DELETE
        # This tests that the application needs to handle cleanup explicitly
    
    @pytest.mark.asyncio
    async def test_model_field_types_and_nullability(self, async_session: AsyncSession):
        """Test model field types and null handling."""
        # Test with all nullable fields as None
        crop = Crop(
            seed_type_id=None,
            seed_date=None,
            transplanting_date_planned=None,
            transplanting_date=None,
            harvesting_date_planned=None,
            harvesting_date=None,
            lifecycle_status=None,
            health_check=None,
            current_location=None,
            last_location=None,
            measurements_id=None,
            image_url=None,
            recipe_version_id=None,
            accumulated_light_hours=None,
            accumulated_water_hours=None,
            notes=None
        )
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        # Verify all nullable fields are handled correctly
        assert crop.id is not None  # Primary key should be assigned
        assert crop.seed_type_id is None
        assert crop.seed_date is None
        assert crop.lifecycle_status is None
        assert crop.current_location is None
        assert crop.accumulated_light_hours is None
        assert crop.notes is None