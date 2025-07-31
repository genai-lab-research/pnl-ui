"""Test cases for crop-related schemas."""

import pytest
from datetime import datetime, date
from pydantic import ValidationError

from app.schemas.crop import (
    CropLocation, CropMetadata, LifecycleMilestones, GrowthMetrics,
    EnvironmentalMetrics, TimelapseFrame, CropHistoryEntry, CropTimelapse,
    CropSnapshot, CropSnapshotCreate, MetricDefinition, MetricDefinitions,
    GrowthDataPoint, GrowthChartData, NotesUpdateRequest, NotesUpdateResponse,
    CropHistoryCreate, CropMeasurementUpdate, CropMeasurementResponse,
    CropResponse
)


class TestCropSchemas:
    """Test crop schema validation and serialization."""
    
    def test_crop_location_schema(self):
        """Test CropLocation schema validation."""
        # Test tray location
        tray_location = CropLocation(
            type="tray",
            tray_id=1,
            row=2,
            column=3
        )
        assert tray_location.type == "tray"
        assert tray_location.tray_id == 1
        assert tray_location.row == 2
        assert tray_location.column == 3
        assert tray_location.panel_id is None
        
        # Test panel location
        panel_location = CropLocation(
            type="panel",
            panel_id=5,
            channel=2,
            position=8
        )
        assert panel_location.type == "panel"
        assert panel_location.panel_id == 5
        assert panel_location.channel == 2
        assert panel_location.position == 8
        assert panel_location.tray_id is None
    
    def test_crop_metadata_schema(self):
        """Test CropMetadata schema validation."""
        location = CropLocation(type="tray", tray_id=1, row=1, column=1)
        metadata = CropMetadata(
            id=1,
            seed_type="Lettuce",
            seed_type_id=10,
            variety="Romaine",
            supplier="Test Supplier",
            batch_id="TST-001",
            location=location
        )
        
        assert metadata.id == 1
        assert metadata.seed_type == "Lettuce"
        assert metadata.variety == "Romaine"
        assert metadata.supplier == "Test Supplier"
        assert metadata.batch_id == "TST-001"
        assert metadata.location.type == "tray"
    
    def test_lifecycle_milestones_schema(self):
        """Test LifecycleMilestones schema validation."""
        milestones = LifecycleMilestones(
            seed_date=date(2023, 1, 1),
            transplanting_date_planned=date(2023, 1, 15),
            transplanting_date=date(2023, 1, 16),
            harvesting_date_planned=date(2023, 3, 1),
            harvesting_date=date(2023, 3, 2)
        )
        
        assert milestones.seed_date == date(2023, 1, 1)
        assert milestones.transplanting_date_planned == date(2023, 1, 15)
        assert milestones.transplanting_date == date(2023, 1, 16)
        assert milestones.harvesting_date_planned == date(2023, 3, 1)
        assert milestones.harvesting_date == date(2023, 3, 2)
        
        # Test with optional fields as None
        minimal_milestones = LifecycleMilestones()
        assert minimal_milestones.seed_date is None
        assert minimal_milestones.transplanting_date is None
    
    def test_growth_metrics_schema(self):
        """Test GrowthMetrics schema validation."""
        metrics = GrowthMetrics(
            radius=2.5,
            width=5.0,
            height=3.5,
            area=19.6,
            area_estimated=20.0,
            weight=45.5,
            accumulated_light_hours=720.0,
            accumulated_water_hours=180.0
        )
        
        assert metrics.radius == 2.5
        assert metrics.width == 5.0
        assert metrics.height == 3.5
        assert metrics.area == 19.6
        assert metrics.area_estimated == 20.0
        assert metrics.weight == 45.5
        assert metrics.accumulated_light_hours == 720.0
        assert metrics.accumulated_water_hours == 180.0
        
        # Test with optional fields as None
        minimal_metrics = GrowthMetrics()
        assert minimal_metrics.radius is None
        assert minimal_metrics.weight is None
    
    def test_environmental_metrics_schema(self):
        """Test EnvironmentalMetrics schema validation."""
        env_metrics = EnvironmentalMetrics(
            air_temperature=22.5,
            humidity=65.0,
            co2=1000.0,
            water_temperature=20.0,
            ph=6.5,
            ec=1.8
        )
        
        assert env_metrics.air_temperature == 22.5
        assert env_metrics.humidity == 65.0
        assert env_metrics.co2 == 1000.0
        assert env_metrics.water_temperature == 20.0
        assert env_metrics.ph == 6.5
        assert env_metrics.ec == 1.8
    
    def test_timelapse_frame_schema(self):
        """Test TimelapseFrame schema validation."""
        growth_metrics = GrowthMetrics(area=20.0, weight=50.0)
        env_metrics = EnvironmentalMetrics(air_temperature=22.0, humidity=65.0)
        
        frame = TimelapseFrame(
            timestamp=datetime(2023, 6, 15, 12, 0, 0),
            crop_age_days=30,
            image_url="https://example.com/image.jpg",
            lifecycle_status="vegetative",
            health_status="good",
            growth_metrics=growth_metrics,
            environmental_metrics=env_metrics
        )
        
        assert frame.timestamp == datetime(2023, 6, 15, 12, 0, 0)
        assert frame.crop_age_days == 30
        assert frame.image_url == "https://example.com/image.jpg"
        assert frame.lifecycle_status == "vegetative"
        assert frame.health_status == "good"
        assert frame.growth_metrics.area == 20.0
        assert frame.environmental_metrics.air_temperature == 22.0
    
    def test_crop_history_entry_schema(self):
        """Test CropHistoryEntry schema validation."""
        history_entry = CropHistoryEntry(
            crop_id=1,
            timestamp=datetime(2023, 6, 15, 10, 30, 0),
            event="Transplanted",
            performed_by="John Doe",
            notes="Crop moved to panel 3"
        )
        
        assert history_entry.crop_id == 1
        assert history_entry.timestamp == datetime(2023, 6, 15, 10, 30, 0)
        assert history_entry.event == "Transplanted"
        assert history_entry.performed_by == "John Doe"
        assert history_entry.notes == "Crop moved to panel 3"
    
    def test_crop_timelapse_schema(self):
        """Test CropTimelapse schema validation."""
        location = CropLocation(type="tray", tray_id=1, row=1, column=1)
        metadata = CropMetadata(id=1, seed_type="Lettuce", location=location)
        milestones = LifecycleMilestones(seed_date=date(2023, 1, 1))
        
        growth_metrics = GrowthMetrics(area=20.0)
        env_metrics = EnvironmentalMetrics(air_temperature=22.0)
        frame = TimelapseFrame(
            timestamp=datetime.now(),
            crop_age_days=30,
            growth_metrics=growth_metrics,
            environmental_metrics=env_metrics
        )
        
        history = CropHistoryEntry(
            crop_id=1,
            timestamp=datetime.now(),
            event="Created"
        )
        
        timelapse = CropTimelapse(
            crop_metadata=metadata,
            lifecycle_milestones=milestones,
            timelapse_frames=[frame],
            notes="Test crop",
            history=[history]
        )
        assert timelapse.crop_metadata.id == 1
        assert len(timelapse.timelapse_frames) == 1
        assert len(timelapse.history) == 1
        assert timelapse.notes == "Test crop"
    
    def test_crop_snapshot_schema(self):
        """Test CropSnapshot schema validation."""
        snapshot = CropSnapshot(
            id=1,
            timestamp=datetime(2023, 6, 15, 12, 0, 0),
            crop_id=10,
            lifecycle_status="flowering",
            health_status="excellent",
            recipe_version_id=2,
            location={"type": "panel", "panel_id": 3},
            measurements_id=5,
            accumulated_light_hours=800.0,
            accumulated_water_hours=200.0,
            image_url="https://example.com/snapshot.jpg"
        )
        
        assert snapshot.id == 1
        assert snapshot.crop_id == 10
        assert snapshot.lifecycle_status == "flowering"
        assert snapshot.health_status == "excellent"
        assert snapshot.location["type"] == "panel"
        assert snapshot.accumulated_light_hours == 800.0
    
    def test_crop_snapshot_create_schema(self):
        """Test CropSnapshotCreate schema validation."""
        snapshot_data = CropSnapshotCreate(
            lifecycle_status="fruiting",
            health_status="good",
            recipe_version_id=3,
            location={"type": "tray", "tray_id": 2},
            measurements_id=8,
            accumulated_light_hours=1000.0,
            accumulated_water_hours=250.0,
            image_url="https://example.com/new_snapshot.jpg"
        )
        
        assert snapshot_data.lifecycle_status == "fruiting"
        assert snapshot_data.health_status == "good"
        assert snapshot_data.recipe_version_id == 3
        assert snapshot_data.location["type"] == "tray"
        assert snapshot_data.accumulated_light_hours == 1000.0
    
    def test_metric_definition_schema(self):
        """Test MetricDefinition schema validation."""
        definition = MetricDefinition(
            unit="cm²",
            description="Measured crop area"
        )
        
        assert definition.unit == "cm²"
        assert definition.description == "Measured crop area"
    
    def test_metric_definitions_schema(self):
        """Test MetricDefinitions schema validation."""
        area_def = MetricDefinition(unit="cm²", description="Area measurement")
        weight_def = MetricDefinition(unit="g", description="Weight measurement")
        light_def = MetricDefinition(unit="hours", description="Light exposure")
        water_def = MetricDefinition(unit="hours", description="Water exposure")
        
        definitions = MetricDefinitions(
            area=area_def,
            area_estimated=area_def,
            weight=weight_def,
            accumulated_light_hours=light_def,
            accumulated_water_hours=water_def
        )
        
        assert definitions.area.unit == "cm²"
        assert definitions.weight.unit == "g"
        assert definitions.accumulated_light_hours.unit == "hours"
    
    def test_growth_data_point_schema(self):
        """Test GrowthDataPoint schema validation."""
        data_point = GrowthDataPoint(
            timestamp=datetime(2023, 6, 15, 12, 0, 0),
            crop_age_days=45,
            area=25.5,
            area_estimated=26.0,
            weight=70.0,
            accumulated_light_hours=1080.0,
            accumulated_water_hours=270.0,
            air_temperature=23.0,
            humidity=68.0,
            co2=950.0,
            water_temperature=21.0,
            ph=6.3,
            ec=1.9
        )
        
        assert data_point.timestamp == datetime(2023, 6, 15, 12, 0, 0)
        assert data_point.crop_age_days == 45
        assert data_point.area == 25.5
        assert data_point.weight == 70.0
        assert data_point.air_temperature == 23.0
    
    def test_growth_chart_data_schema(self):
        """Test GrowthChartData schema validation."""
        data_point = GrowthDataPoint(
            timestamp=datetime.now(),
            crop_age_days=30
        )
        
        area_def = MetricDefinition(unit="cm²", description="Area")
        weight_def = MetricDefinition(unit="g", description="Weight")
        light_def = MetricDefinition(unit="hours", description="Light")
        water_def = MetricDefinition(unit="hours", description="Water")
        
        definitions = MetricDefinitions(
            area=area_def,
            area_estimated=area_def,
            weight=weight_def,
            accumulated_light_hours=light_def,
            accumulated_water_hours=water_def
        )
        
        chart_data = GrowthChartData(
            chart_data=[data_point],
            metric_definitions=definitions
        )
        
        assert len(chart_data.chart_data) == 1
        assert chart_data.metric_definitions.area.unit == "cm²"
    
    def test_notes_update_request_schema(self):
        """Test NotesUpdateRequest schema validation."""
        request = NotesUpdateRequest(
            notes="Updated crop notes for testing"
        )
        
        assert request.notes == "Updated crop notes for testing"
        
        # Test validation error for empty notes
        with pytest.raises(ValidationError):
            NotesUpdateRequest(notes="")
    
    def test_notes_update_response_schema(self):
        """Test NotesUpdateResponse schema validation."""
        response = NotesUpdateResponse(
            success=True,
            message="Notes updated successfully",
            updated_at=datetime(2023, 6, 15, 12, 0, 0)
        )
        
        assert response.success is True
        assert response.message == "Notes updated successfully"
        assert response.updated_at == datetime(2023, 6, 15, 12, 0, 0)
    
    def test_crop_history_create_schema(self):
        """Test CropHistoryCreate schema validation."""
        history_create = CropHistoryCreate(
            event="Health Check",
            performed_by="Dr. Smith",
            notes="Crop looking healthy, continue current regimen"
        )
        
        assert history_create.event == "Health Check"
        assert history_create.performed_by == "Dr. Smith"
        assert history_create.notes == "Crop looking healthy, continue current regimen"
    
    def test_crop_measurement_update_schema(self):
        """Test CropMeasurementUpdate schema validation."""
        measurement_update = CropMeasurementUpdate(
            radius=3.2,
            width=6.4,
            height=4.8,
            area=32.2,
            area_estimated=33.0,
            weight=95.5
        )
        
        assert measurement_update.radius == 3.2
        assert measurement_update.width == 6.4
        assert measurement_update.height == 4.8
        assert measurement_update.area == 32.2
        assert measurement_update.area_estimated == 33.0
        assert measurement_update.weight == 95.5
        
        # Test partial update
        partial_update = CropMeasurementUpdate(weight=100.0)
        assert partial_update.weight == 100.0
        assert partial_update.radius is None
    
    def test_crop_measurement_response_schema(self):
        """Test CropMeasurementResponse schema validation."""
        measurement_response = CropMeasurementResponse(
            id=1,
            radius=2.8,
            width=5.6,
            height=4.2,
            area=24.6,
            area_estimated=25.0,
            weight=68.0
        )
        
        assert measurement_response.id == 1
        assert measurement_response.radius == 2.8
        assert measurement_response.width == 5.6
        assert measurement_response.height == 4.2
        assert measurement_response.area == 24.6
        assert measurement_response.weight == 68.0
    
    def test_crop_response_schema(self):
        """Test CropResponse schema validation."""
        crop_response = CropResponse(
            id=1,
            seed_type_id=5,
            seed_date=date(2023, 1, 1),
            transplanting_date_planned=date(2023, 1, 15),
            transplanting_date=date(2023, 1, 16),
            harvesting_date_planned=date(2023, 3, 1),
            harvesting_date=None,
            lifecycle_status="flowering",
            health_check="good",
            current_location={"type": "panel", "panel_id": 2},
            last_location={"type": "tray", "tray_id": 1},
            measurements_id=3,
            image_url="https://example.com/crop.jpg",
            recipe_version_id=2,
            accumulated_light_hours=960.0,
            accumulated_water_hours=240.0,
            notes="Crop progressing well"
        )
        
        assert crop_response.id == 1
        assert crop_response.seed_type_id == 5
        assert crop_response.lifecycle_status == "flowering"
        assert crop_response.health_check == "good"
        assert crop_response.current_location["type"] == "panel"
        assert crop_response.accumulated_light_hours == 960.0
        assert crop_response.notes == "Crop progressing well"
    
    def test_schema_optional_fields(self):
        """Test schema handling of optional fields."""
        # Test minimal CropResponse with only required field
        minimal_crop = CropResponse(id=1)
        assert minimal_crop.id == 1
        assert minimal_crop.seed_type_id is None
        assert minimal_crop.notes is None
        
        # Test minimal TimelapseFrame with required fields
        growth_metrics = GrowthMetrics()
        env_metrics = EnvironmentalMetrics()
        
        minimal_frame = TimelapseFrame(
            timestamp=datetime.now(),
            crop_age_days=0,
            growth_metrics=growth_metrics,
            environmental_metrics=env_metrics
        )
        assert minimal_frame.crop_age_days == 0
        assert minimal_frame.image_url is None
        assert minimal_frame.lifecycle_status is None
    
    def test_schema_field_validation(self):
        """Test schema field validation rules."""
        # Test that required fields raise validation errors
        with pytest.raises(ValidationError):
            CropResponse()  # Missing required 'id' field
        
        with pytest.raises(ValidationError):
            MetricDefinition(unit="cm²")  # Missing required 'description' field
        
        with pytest.raises(ValidationError):
            TimelapseFrame(timestamp=datetime.now())  # Missing required fields