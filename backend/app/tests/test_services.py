"""Unit tests for service layer."""

import pytest
from datetime import datetime, date
from unittest.mock import Mock, patch

from app.services.location import LocationService
from app.services.container import ContainerService
from app.services.crop import CropService
from app.services.inventory_metrics import InventoryMetricsService
from app.services.tray import TrayService
from app.services.panel import PanelService
from app.schemas.location import LocationCreate, LocationUpdate
from app.schemas.container import ContainerCreateRequest, ContainerCreate, ContainerUpdate, ContainerFilter
from app.schemas.crop import CropCreate, CropFilter, CropLocationCreate
from app.schemas.inventory_metrics import InventoryMetricsCreate, InventoryMetricsQuery
from app.schemas.tray import TrayCreate


class TestLocationService:
    """Test cases for LocationService."""

    def test_create_location(self, db_session):
        """Test creating a location through service."""
        service = LocationService(db_session)
        location_data = LocationCreate(
            city="San Francisco",
            country="USA",
            address="123 Bay Street"
        )
        
        location = service.create_location(location_data)
        
        assert location.city == "San Francisco"
        assert location.country == "USA"
        assert location.address == "123 Bay Street"
        assert location.id is not None

    def test_get_location(self, db_session, sample_location):
        """Test getting a location through service."""
        service = LocationService(db_session)
        
        location = service.get_location(sample_location.id)
        
        assert location is not None
        assert location.id == sample_location.id
        assert location.city == sample_location.city

    def test_get_location_not_found(self, db_session):
        """Test getting a non-existent location through service."""
        service = LocationService(db_session)
        
        location = service.get_location(999)
        
        assert location is None

    def test_get_locations(self, db_session):
        """Test getting multiple locations through service."""
        service = LocationService(db_session)
        
        # Create test locations
        locations_data = [
            LocationCreate(city="NYC", country="USA"),
            LocationCreate(city="LA", country="USA"),
        ]
        
        for location_data in locations_data:
            service.create_location(location_data)
        
        locations = service.get_locations()
        
        assert len(locations) >= 2

    def test_update_location(self, db_session, sample_location):
        """Test updating a location through service."""
        service = LocationService(db_session)
        update_data = LocationUpdate(
            city="Updated City"
        )
        
        updated_location = service.update_location(sample_location.id, update_data)
        
        assert updated_location is not None
        assert updated_location.city == "Updated City"
        assert updated_location.country == sample_location.country

    def test_update_location_not_found(self, db_session):
        """Test updating a non-existent location through service."""
        service = LocationService(db_session)
        update_data = LocationUpdate(city="New City")
        
        result = service.update_location(999, update_data)
        
        assert result is None

    def test_delete_location(self, db_session, sample_location):
        """Test deleting a location through service."""
        service = LocationService(db_session)
        
        result = service.delete_location(sample_location.id)
        
        assert result is True

    def test_delete_location_not_found(self, db_session):
        """Test deleting a non-existent location through service."""
        service = LocationService(db_session)
        
        result = service.delete_location(999)
        
        assert result is False

    def test_validate_location_exists(self, db_session, sample_location):
        """Test validating location exists."""
        service = LocationService(db_session)
        
        exists = service.validate_location_exists(sample_location.id)
        not_exists = service.validate_location_exists(999)
        
        assert exists is True
        assert not_exists is False


class TestContainerService:
    """Test cases for ContainerService."""

    def test_create_container(self, db_session, sample_location):
        """Test creating a container through service."""
        service = ContainerService(db_session)
        container_data = ContainerCreateRequest(
            type="virtual",
            name="Service Test Container",
            tenant="service-tenant",
            purpose="research",
            location=f"{sample_location.city}, {sample_location.country}",
            seed_types=["research-seed"],
            notes="Service layer test",
            shadow_service_enabled=False,
            connect_to_other_systems=True
        )
        
        container = service.create_container(container_data)
        
        assert container.type == "virtual"
        assert container.name == "Service Test Container"
        assert container.tenant == "service-tenant"
        assert container.purpose == "research"
        assert container.location is not None
        assert container.location.city == sample_location.city
        assert "id" in container.model_dump()  # Auto-generated UUID

    def test_create_container_invalid_location(self, db_session):
        """Test creating a container with empty location."""
        service = ContainerService(db_session)
        container_data = ContainerCreateRequest(
            type="physical",
            name="Invalid Location Container",
            tenant="test-tenant",
            purpose="development",
            location="",  # Empty location
            shadow_service_enabled=False,
            connect_to_other_systems=False
        )
        
        with pytest.raises(Exception):  # Should handle empty location gracefully
            service.create_container(container_data)

    def test_create_container_duplicate_name(self, db_session, sample_container):
        """Test creating a container with duplicate name and tenant."""
        service = ContainerService(db_session)
        container_data = ContainerCreateRequest(
            type="physical",
            name=sample_container.name,  # Same name
            tenant=sample_container.tenant,  # Same tenant
            purpose="development",
            location="Test City, Test Country",
            shadow_service_enabled=False,
            connect_to_other_systems=False
        )
        
        with pytest.raises(ValueError, match="already exists"):
            service.create_container(container_data)

    def test_get_container(self, db_session, sample_container):
        """Test getting a container through service."""
        service = ContainerService(db_session)
        
        container = service.get_container(sample_container.id)
        
        assert container is not None
        assert container.id == sample_container.id
        assert container.location is not None

    def test_get_container_not_found(self, db_session):
        """Test getting a non-existent container through service."""
        service = ContainerService(db_session)
        
        container = service.get_container("non-existent")
        
        assert container is None

    def test_get_containers(self, db_session, multiple_containers):
        """Test getting multiple containers through service."""
        service = ContainerService(db_session)
        
        containers = service.get_containers()
        
        assert len(containers) == 5

    def test_get_containers_with_filters(self, db_session, multiple_containers):
        """Test getting containers with filters through service."""
        service = ContainerService(db_session)
        filters = ContainerFilter(
            type="physical",
            status="active"
        )
        
        containers = service.get_containers(filters=filters)
        
        # Should get physical and active containers
        assert len(containers) >= 1
        for container in containers:
            assert container.type == "physical"
            assert container.status == "active"

    def test_update_container(self, db_session, sample_container):
        """Test updating a container through service."""
        service = ContainerService(db_session)
        update_data = ContainerUpdate(
            name="Updated Service Container",
            status="maintenance",
            has_alert=True
        )
        
        updated_container = service.update_container(sample_container.id, update_data)
        
        assert updated_container is not None
        assert updated_container.name == "Updated Service Container"
        assert updated_container.status == "maintenance"
        assert updated_container.has_alert is True

    def test_update_container_invalid_location(self, db_session, sample_container):
        """Test updating a container with invalid location."""
        service = ContainerService(db_session)
        update_data = ContainerUpdate(location_id=999)
        
        with pytest.raises(ValueError, match="Location with ID 999 does not exist"):
            service.update_container(sample_container.id, update_data)

    def test_update_container_not_found(self, db_session):
        """Test updating a non-existent container through service."""
        service = ContainerService(db_session)
        update_data = ContainerUpdate(name="New Name")
        
        result = service.update_container("non-existent", update_data)
        
        assert result is None

    def test_delete_container(self, db_session, sample_container):
        """Test deleting a container through service."""
        service = ContainerService(db_session)
        
        result = service.delete_container(sample_container.id)
        
        assert result is True

    def test_delete_container_not_found(self, db_session):
        """Test deleting a non-existent container through service."""
        service = ContainerService(db_session)
        
        result = service.delete_container("non-existent")
        
        assert result is False

    def test_get_containers_by_tenant(self, db_session, multiple_containers):
        """Test getting containers by tenant through service."""
        service = ContainerService(db_session)
        
        containers = service.get_containers_by_tenant("tenant-0")
        
        assert len(containers) == 3
        for container in containers:
            assert container.tenant == "tenant-0"

    def test_get_containers_with_alerts(self, db_session, multiple_containers):
        """Test getting containers with alerts through service."""
        service = ContainerService(db_session)
        
        containers = service.get_containers_with_alerts()
        
        assert len(containers) == 2
        for container in containers:
            assert container.has_alert is True

    def test_validate_container_exists(self, db_session, sample_container):
        """Test validating container exists."""
        service = ContainerService(db_session)
        
        exists = service.validate_container_exists(sample_container.id)
        not_exists = service.validate_container_exists("non-existent")
        
        assert exists is True
        assert not_exists is False


class TestServiceIntegration:
    """Integration tests between services."""

    def test_location_container_relationship(self, db_session):
        """Test the relationship between location and container services."""
        location_service = LocationService(db_session)
        container_service = ContainerService(db_session)
        
        # Create location
        location_data = LocationCreate(
            city="Integration City",
            country="Integration Country"
        )
        location = location_service.create_location(location_data)
        
        # Create container with the location
        container_data = ContainerCreateRequest(
            type="physical",
            name="Integration Container",
            tenant="integration-tenant",
            purpose="production",
            location=f"{location.city}, {location.country}",
            shadow_service_enabled=False,
            connect_to_other_systems=False
        )
        container = container_service.create_container(container_data)
        
        # Verify relationship
        assert container.location.city == "Integration City"
        retrieved_container = container_service.get_container(container.id)
        assert retrieved_container.location.city == "Integration City"

    def test_location_deletion_with_containers(self, db_session, sample_location, sample_container):
        """Test that location deletion is handled properly when containers exist."""
        location_service = LocationService(db_session)
        
        # Try to delete location that has containers - this should be handled gracefully
        # In a real application, you might want to prevent this or cascade delete
        with pytest.raises(Exception):  # This should raise an integrity error
            location_service.delete_location(sample_location.id)


class TestCropService:
    """Test cases for CropService."""

    def test_create_crop(self, db_session, sample_container):
        """Test creating a crop through service."""
        service = CropService(db_session)
        crop_data = CropCreate(
            id="service-crop-001",
            container_id=sample_container.id,
            seed_type="lettuce",
            seed_date=datetime.now(),
            age=5,
            status="seedling",
            overdue_days=0,
            location=CropLocationCreate(
                type="tray",
                tray_id=None,  # Don't reference non-existent tray
                row=2,
                column=3,
                position=1
            )
        )
        
        crop = service.create_crop(crop_data)
        
        assert crop.id == "service-crop-001"
        assert crop.seed_type == "lettuce"
        assert crop.age == 5
        assert crop.status == "seedling"
        assert crop.location is not None
        assert crop.location.type == "tray"

    def test_create_crop_invalid_container(self, db_session):
        """Test creating a crop with invalid container."""
        service = CropService(db_session)
        crop_data = CropCreate(
            id="invalid-crop",
            container_id="non-existent",
            seed_type="tomato",
            seed_date=datetime.now(),
            age=1,
            status="seeded",
            overdue_days=0,
            location=CropLocationCreate(
                type="tray", 
                tray_id=None,
                row=1,
                column=1,
                position=1
            )
        )
        
        with pytest.raises(ValueError, match="Container with id non-existent not found"):
            service.create_crop(crop_data)

    def test_create_crop_duplicate_id(self, db_session, sample_crop):
        """Test creating a crop with duplicate ID."""
        service = CropService(db_session)
        crop_data = CropCreate(
            id=sample_crop.id,  # Same ID
            container_id=sample_crop.container_id,
            seed_type="tomato",
            seed_date=datetime.now(),
            age=1,
            status="seeded",
            overdue_days=0,
            location=CropLocationCreate(
                type="tray", 
                tray_id=None,
                row=1,
                column=1,
                position=1
            )
        )
        
        with pytest.raises(ValueError, match="already exists"):
            service.create_crop(crop_data)

    def test_get_crop(self, db_session, sample_crop):
        """Test getting a crop through service."""
        service = CropService(db_session)
        
        crop = service.get_crop(sample_crop.id)
        
        assert crop is not None
        assert crop.id == sample_crop.id
        assert crop.location is not None

    def test_get_crop_not_found(self, db_session):
        """Test getting a non-existent crop through service."""
        service = CropService(db_session)
        
        crop = service.get_crop("non-existent")
        
        assert crop is None

    def test_get_crops_by_container(self, db_session, sample_container, multiple_crops):
        """Test getting crops by container through service."""
        service = CropService(db_session)
        
        crops = service.get_crops_by_container(sample_container.id)
        
        assert len(crops) == 3
        for crop in crops:
            assert hasattr(crop, 'location')

    def test_get_crops_by_container_with_filter(self, db_session, sample_container, multiple_crops):
        """Test getting crops by container with filter through service."""
        service = CropService(db_session)
        filters = CropFilter(seed_type="tomato")
        
        crops = service.get_crops_by_container(sample_container.id, filters)
        
        assert len(crops) == 1
        assert crops[0].seed_type == "tomato"

    def test_get_crops_by_container_invalid_container(self, db_session):
        """Test getting crops for non-existent container."""
        service = CropService(db_session)
        
        with pytest.raises(ValueError, match="Container with id non-existent not found"):
            service.get_crops_by_container("non-existent")

    def test_update_crop(self, db_session, sample_crop):
        """Test updating a crop through service."""
        service = CropService(db_session)
        update_data = {
            "status": "mature",
            "age": 25,
            "overdue_days": 2
        }
        
        updated_crop = service.update_crop(sample_crop.id, update_data)
        
        assert updated_crop is not None
        assert updated_crop.status == "mature"
        assert updated_crop.age == 25
        assert updated_crop.overdue_days == 2

    def test_update_crop_not_found(self, db_session):
        """Test updating a non-existent crop through service."""
        service = CropService(db_session)
        update_data = {"status": "new_status"}
        
        result = service.update_crop("non-existent", update_data)
        
        assert result is None

    def test_delete_crop(self, db_session, sample_crop):
        """Test deleting a crop through service."""
        service = CropService(db_session)
        
        result = service.delete_crop(sample_crop.id)
        
        assert result is True

    def test_delete_crop_not_found(self, db_session):
        """Test deleting a non-existent crop through service."""
        service = CropService(db_session)
        
        result = service.delete_crop("non-existent")
        
        assert result is False


class TestInventoryMetricsService:
    """Test cases for InventoryMetricsService."""

    def test_get_metrics_current_date(self, db_session, sample_container, sample_inventory_metrics):
        """Test getting metrics for current date through service."""
        service = InventoryMetricsService(db_session)
        
        metrics = service.get_metrics(sample_container.id)
        
        assert metrics is not None
        assert metrics.container_id == sample_container.id
        assert metrics.nursery_station_utilization == 75
        assert metrics.cultivation_area_utilization == 80

    def test_get_metrics_specific_date(self, db_session, sample_container):
        """Test getting metrics for specific date through service."""
        service = InventoryMetricsService(db_session)
        
        # Create metrics for specific date
        metrics_data = InventoryMetricsCreate(
            container_id=sample_container.id,
            date=date(2024, 1, 15),
            nursery_station_utilization=60,
            cultivation_area_utilization=70
        )
        service.create_metrics(metrics_data)
        
        # Query for that specific date
        query_params = InventoryMetricsQuery(date="2024-01-15")
        metrics = service.get_metrics(sample_container.id, query_params)
        
        assert metrics is not None
        assert metrics.nursery_station_utilization == 60
        assert metrics.cultivation_area_utilization == 70

    def test_get_metrics_invalid_date_format(self, db_session, sample_container):
        """Test getting metrics with invalid date format."""
        service = InventoryMetricsService(db_session)
        query_params = InventoryMetricsQuery(date="invalid-date")
        
        with pytest.raises(ValueError, match="Invalid date format"):
            service.get_metrics(sample_container.id, query_params)

    def test_get_metrics_invalid_container(self, db_session):
        """Test getting metrics for non-existent container."""
        service = InventoryMetricsService(db_session)
        
        with pytest.raises(ValueError, match="Container with id non-existent not found"):
            service.get_metrics("non-existent")

    def test_get_metrics_no_data_returns_default(self, db_session, sample_container):
        """Test getting metrics when no data exists returns default values."""
        service = InventoryMetricsService(db_session)
        
        metrics = service.get_metrics(sample_container.id)
        
        # Should return default metrics with 0 values
        assert metrics is not None
        assert metrics.nursery_station_utilization == 0
        assert metrics.cultivation_area_utilization == 0

    def test_create_metrics(self, db_session, sample_container):
        """Test creating metrics through service."""
        service = InventoryMetricsService(db_session)
        metrics_data = InventoryMetricsCreate(
            container_id=sample_container.id,
            date=date(2024, 3, 1),
            nursery_station_utilization=85,
            cultivation_area_utilization=90
        )
        
        metrics = service.create_metrics(metrics_data)
        
        assert metrics.container_id == sample_container.id
        assert metrics.nursery_station_utilization == 85
        assert metrics.cultivation_area_utilization == 90

    def test_create_metrics_invalid_container(self, db_session):
        """Test creating metrics for non-existent container."""
        service = InventoryMetricsService(db_session)
        metrics_data = InventoryMetricsCreate(
            container_id="non-existent",
            date=date.today(),
            nursery_station_utilization=50,
            cultivation_area_utilization=60
        )
        
        with pytest.raises(ValueError, match="Container with id non-existent not found"):
            service.create_metrics(metrics_data)

    def test_create_metrics_duplicate(self, db_session, sample_inventory_metrics):
        """Test creating duplicate metrics for same container and date."""
        service = InventoryMetricsService(db_session)
        metrics_data = InventoryMetricsCreate(
            container_id=sample_inventory_metrics.container_id,
            date=sample_inventory_metrics.date,  # Same date
            nursery_station_utilization=50,
            cultivation_area_utilization=60
        )
        
        with pytest.raises(ValueError, match="already exist"):
            service.create_metrics(metrics_data)

    def test_update_metrics(self, db_session, sample_inventory_metrics):
        """Test updating metrics through service."""
        service = InventoryMetricsService(db_session)
        update_data = {
            "nursery_station_utilization": 95,
            "cultivation_area_utilization": 100
        }
        
        updated_metrics = service.update_metrics(
            sample_inventory_metrics.container_id,
            sample_inventory_metrics.date,
            update_data
        )
        
        assert updated_metrics is not None
        assert updated_metrics.nursery_station_utilization == 95
        assert updated_metrics.cultivation_area_utilization == 100

    def test_update_metrics_invalid_container(self, db_session):
        """Test updating metrics for non-existent container."""
        service = InventoryMetricsService(db_session)
        
        with pytest.raises(ValueError, match="Container with id non-existent not found"):
            service.update_metrics("non-existent", date.today(), {})

    def test_delete_metrics(self, db_session, sample_inventory_metrics):
        """Test deleting metrics through service."""
        service = InventoryMetricsService(db_session)
        
        result = service.delete_metrics(
            sample_inventory_metrics.container_id,
            sample_inventory_metrics.date
        )
        
        assert result is True


class TestTrayService:
    """Test cases for TrayService."""

    def test_get_nursery_station(self, db_session, sample_trays):
        """Test getting nursery station data through service."""
        service = TrayService(db_session)
        
        nursery_station = service.get_nursery_station("container-1")
        
        assert nursery_station.upper_shelf is not None
        assert nursery_station.lower_shelf is not None
        assert nursery_station.off_shelf_trays is not None
        assert len(nursery_station.upper_shelf) == 1
        assert len(nursery_station.lower_shelf) == 1
        assert nursery_station.utilization_percentage > 0

    def test_get_nursery_station_with_date_filter(self, db_session, sample_trays):
        """Test getting nursery station data with date filter."""
        service = TrayService(db_session)
        
        nursery_station = service.get_nursery_station("container-1", date.today())
        
        assert nursery_station is not None
        assert isinstance(nursery_station.utilization_percentage, int)

    def test_create_tray(self, db_session):
        """Test creating a tray through service."""
        service = TrayService(db_session)
        tray_data = TrayCreate(
            rfid_tag="NEW_TRAY",
            shelf="upper",
            slot_number=5
        )
        
        tray = service.create_tray("container-1", tray_data)
        
        assert tray.id == "tray_NEW_TRAY"
        assert tray.rfid_tag == "NEW_TRAY"
        assert tray.location.shelf == "upper"
        assert tray.location.slot_number == 5
        assert tray.is_empty is True
        assert tray.utilization_percentage == 0

    def test_get_tray_by_id(self, db_session, sample_trays):
        """Test getting a tray by ID through service."""
        service = TrayService(db_session)
        
        tray = service.get_tray_by_id("tray_TRAY001")
        
        assert tray is not None
        assert tray.id == "tray_TRAY001"
        assert tray.location is not None

    def test_get_tray_by_id_not_found(self, db_session):
        """Test getting a non-existent tray through service."""
        service = TrayService(db_session)
        
        tray = service.get_tray_by_id("non-existent")
        
        assert tray is None

    def test_delete_tray(self, db_session, sample_trays):
        """Test deleting a tray through service."""
        service = TrayService(db_session)
        
        result = service.delete_tray("tray_TRAY001")
        
        assert result is True
        assert service.get_tray_by_id("tray_TRAY001") is None

    def test_delete_tray_not_found(self, db_session):
        """Test deleting a non-existent tray through service."""
        service = TrayService(db_session)
        
        result = service.delete_tray("non-existent")
        
        assert result is False


class TestPanelService:
    """Test cases for PanelService."""

    def test_get_cultivation_area(self, db_session, sample_panels):
        """Test getting cultivation area data through service."""
        service = PanelService(db_session)
        
        cultivation_area = service.get_cultivation_area("container-1")
        
        assert cultivation_area.wall_1 is not None
        assert cultivation_area.wall_2 is not None
        assert cultivation_area.wall_3 is not None
        assert cultivation_area.wall_4 is not None
        assert cultivation_area.off_wall_panels is not None
        assert len(cultivation_area.wall_1) == 2
        assert len(cultivation_area.wall_2) == 1
        assert cultivation_area.utilization_percentage > 0

    def test_get_cultivation_area_with_date_filter(self, db_session, sample_panels):
        """Test getting cultivation area data with date filter."""
        service = PanelService(db_session)
        
        cultivation_area = service.get_cultivation_area("container-1", date.today())
        
        assert cultivation_area is not None
        assert isinstance(cultivation_area.utilization_percentage, int)

    def test_get_panel_by_id(self, db_session, sample_panels):
        """Test getting a panel by ID through service."""
        service = PanelService(db_session)
        
        panel = service.get_panel_by_id("panel-001")
        
        assert panel is not None
        assert panel.id == "panel-001"
        assert panel.location is not None

    def test_get_panel_by_id_not_found(self, db_session):
        """Test getting a non-existent panel through service."""
        service = PanelService(db_session)
        
        panel = service.get_panel_by_id("non-existent")
        
        assert panel is None

    def test_create_panel(self, db_session):
        """Test creating a panel through service."""
        service = PanelService(db_session)
        
        panel = service.create_panel("container-1", "new-panel", "NEW_PANEL", "wall_3", 1)
        
        assert panel.id == "new-panel"
        assert panel.rfid_tag == "NEW_PANEL"
        assert panel.location.wall == "wall_3"
        assert panel.location.slot_number == 1
        assert panel.is_empty is True
        assert panel.utilization_percentage == 0

    def test_delete_panel(self, db_session, sample_panels):
        """Test deleting a panel through service."""
        service = PanelService(db_session)
        
        result = service.delete_panel("panel-001")
        
        assert result is True
        assert service.get_panel_by_id("panel-001") is None

    def test_delete_panel_not_found(self, db_session):
        """Test deleting a non-existent panel through service."""
        service = PanelService(db_session)
        
        result = service.delete_panel("non-existent")
        
        assert result is False
