"""Unit tests for repository layer."""

import pytest
from datetime import datetime, date
from sqlalchemy.exc import IntegrityError

from app.repositories.location import LocationRepository
from app.repositories.container import ContainerRepository
from app.repositories.crop import CropRepository, CropLocationRepository
from app.repositories.inventory_metrics import InventoryMetricsRepository
from app.repositories.tray import TrayRepository
from app.repositories.panel import PanelRepository
from app.schemas.location import LocationCreate, LocationUpdate
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerFilter
from app.schemas.crop import CropCreate, CropFilter, CropLocationCreate
from app.schemas.inventory_metrics import InventoryMetricsCreate
from app.schemas.tray import TrayCreate
from app.models import Location, Container, Crop, CropLocation, InventoryMetrics, Tray, TrayLocation, Panel, PanelLocation


class TestLocationRepository:
    """Test cases for LocationRepository."""

    def test_create_location(self, db_session):
        """Test creating a location."""
        repo = LocationRepository(db_session)
        location_data = LocationCreate(
            city="New York",
            country="USA",
            address="123 Main St"
        )
        
        location = repo.create(location_data)
        
        assert location.id is not None
        assert location.city == "New York"
        assert location.country == "USA"
        assert location.address == "123 Main St"

    def test_get_location_by_id(self, db_session, sample_location):
        """Test getting a location by ID."""
        repo = LocationRepository(db_session)
        
        location = repo.get_by_id(sample_location.id)
        
        assert location is not None
        assert location.id == sample_location.id
        assert location.city == sample_location.city

    def test_get_location_by_id_not_found(self, db_session):
        """Test getting a non-existent location."""
        repo = LocationRepository(db_session)
        
        location = repo.get_by_id(999)
        
        assert location is None

    def test_get_all_locations(self, db_session):
        """Test getting all locations."""
        repo = LocationRepository(db_session)
        
        # Create multiple locations
        locations_data = [
            LocationCreate(city="NYC", country="USA"),
            LocationCreate(city="LA", country="USA"),
            LocationCreate(city="London", country="UK"),
        ]
        
        for location_data in locations_data:
            repo.create(location_data)
        
        locations = repo.get_all()
        
        assert len(locations) == 3

    def test_get_all_locations_with_pagination(self, db_session):
        """Test getting locations with pagination."""
        repo = LocationRepository(db_session)
        
        # Create 5 locations
        for i in range(5):
            location_data = LocationCreate(
                city=f"City {i}",
                country="Country"
            )
            repo.create(location_data)
        
        # Test pagination
        locations_page1 = repo.get_all(skip=0, limit=2)
        locations_page2 = repo.get_all(skip=2, limit=2)
        
        assert len(locations_page1) == 2
        assert len(locations_page2) == 2
        assert locations_page1[0].id != locations_page2[0].id

    def test_update_location(self, db_session, sample_location):
        """Test updating a location."""
        repo = LocationRepository(db_session)
        update_data = LocationUpdate(
            city="Updated City",
            address="Updated Address"
        )
        
        updated_location = repo.update(sample_location.id, update_data)
        
        assert updated_location is not None
        assert updated_location.city == "Updated City"
        assert updated_location.address == "Updated Address"
        assert updated_location.country == sample_location.country  # Unchanged

    def test_update_location_not_found(self, db_session):
        """Test updating a non-existent location."""
        repo = LocationRepository(db_session)
        update_data = LocationUpdate(city="New City")
        
        result = repo.update(999, update_data)
        
        assert result is None

    def test_delete_location(self, db_session, sample_location):
        """Test deleting a location."""
        repo = LocationRepository(db_session)
        
        result = repo.delete(sample_location.id)
        
        assert result is True
        assert repo.get_by_id(sample_location.id) is None

    def test_delete_location_not_found(self, db_session):
        """Test deleting a non-existent location."""
        repo = LocationRepository(db_session)
        
        result = repo.delete(999)
        
        assert result is False


class TestContainerRepository:
    """Test cases for ContainerRepository."""

    def test_create_container(self, db_session, sample_location):
        """Test creating a container."""
        repo = ContainerRepository(db_session)
        container_data = ContainerCreate(
            id="test-container",
            type="physical",
            name="Test Container",
            tenant="test-tenant",
            purpose="development",
            location_id=sample_location.id,
            status="active"
        )
        
        container = repo.create(container_data)
        
        assert container.id == "test-container"
        assert container.type == "physical"
        assert container.name == "Test Container"

    def test_create_container_with_invalid_location(self, db_session):
        """Test creating a container with invalid location."""
        repo = ContainerRepository(db_session)
        container_data = ContainerCreate(
            id="test-container",
            type="physical",
            name="Test Container",
            tenant="test-tenant",
            purpose="development",
            location_id=999,  # Non-existent location
            status="active"
        )
        
        with pytest.raises(IntegrityError):
            repo.create(container_data)

    def test_get_container_by_id(self, db_session, sample_container):
        """Test getting a container by ID."""
        repo = ContainerRepository(db_session)
        
        container = repo.get_by_id(sample_container.id)
        
        assert container is not None
        assert container.id == sample_container.id
        assert container.location is not None  # Verify relationship loading

    def test_get_container_by_id_not_found(self, db_session):
        """Test getting a non-existent container."""
        repo = ContainerRepository(db_session)
        
        container = repo.get_by_id("non-existent")
        
        assert container is None

    def test_get_all_containers(self, db_session, multiple_containers):
        """Test getting all containers."""
        repo = ContainerRepository(db_session)
        
        containers = repo.get_all()
        
        assert len(containers) == 5

    def test_get_all_containers_with_search_filter(self, db_session, multiple_containers):
        """Test getting containers with search filter."""
        repo = ContainerRepository(db_session)
        filters = ContainerFilter(search="Container 1")
        
        containers = repo.get_all(filters=filters)
        
        assert len(containers) == 1
        assert "Container 1" in containers[0].name

    def test_get_all_containers_with_type_filter(self, db_session, multiple_containers):
        """Test getting containers with type filter."""
        repo = ContainerRepository(db_session)
        filters = ContainerFilter(type="physical")
        
        containers = repo.get_all(filters=filters)
        
        # Should get containers 0, 2, 4 (physical ones)
        assert len(containers) == 3
        for container in containers:
            assert container.type == "physical"

    def test_get_all_containers_with_tenant_filter(self, db_session, multiple_containers):
        """Test getting containers with tenant filter."""
        repo = ContainerRepository(db_session)
        filters = ContainerFilter(tenant="tenant-0")
        
        containers = repo.get_all(filters=filters)
        
        # Should get containers 0, 2, 4 (tenant-0)
        assert len(containers) == 3
        for container in containers:
            assert container.tenant == "tenant-0"

    def test_get_all_containers_with_status_filter(self, db_session, multiple_containers):
        """Test getting containers with status filter."""
        repo = ContainerRepository(db_session)
        filters = ContainerFilter(status="active")
        
        containers = repo.get_all(filters=filters)
        
        # Should get containers 0, 1, 2, 3 (active ones)
        assert len(containers) == 4
        for container in containers:
            assert container.status == "active"

    def test_get_all_containers_with_alerts_filter(self, db_session, multiple_containers):
        """Test getting containers with alerts filter."""
        repo = ContainerRepository(db_session)
        filters = ContainerFilter(has_alerts=True)
        
        containers = repo.get_all(filters=filters)
        
        # Should get containers 0, 3 (has_alert=True for i % 3 == 0)
        assert len(containers) == 2
        for container in containers:
            assert container.has_alert is True

    def test_update_container(self, db_session, sample_container):
        """Test updating a container."""
        repo = ContainerRepository(db_session)
        update_data = ContainerUpdate(
            name="Updated Container",
            status="maintenance"
        )
        
        updated_container = repo.update(sample_container.id, update_data)
        
        assert updated_container is not None
        assert updated_container.name == "Updated Container"
        assert updated_container.status == "maintenance"
        assert updated_container.type == sample_container.type  # Unchanged

    def test_update_container_not_found(self, db_session):
        """Test updating a non-existent container."""
        repo = ContainerRepository(db_session)
        update_data = ContainerUpdate(name="New Name")
        
        result = repo.update("non-existent", update_data)
        
        assert result is None

    def test_delete_container(self, db_session, sample_container):
        """Test deleting a container."""
        repo = ContainerRepository(db_session)
        
        result = repo.delete(sample_container.id)
        
        assert result is True
        assert repo.get_by_id(sample_container.id) is None

    def test_delete_container_not_found(self, db_session):
        """Test deleting a non-existent container."""
        repo = ContainerRepository(db_session)
        
        result = repo.delete("non-existent")
        
        assert result is False

    def test_get_by_tenant(self, db_session, multiple_containers):
        """Test getting containers by tenant."""
        repo = ContainerRepository(db_session)
        
        containers = repo.get_by_tenant("tenant-0")
        
        assert len(containers) == 3
        for container in containers:
            assert container.tenant == "tenant-0"

    def test_get_with_alerts(self, db_session, multiple_containers):
        """Test getting containers with alerts."""
        repo = ContainerRepository(db_session)
        
        containers = repo.get_with_alerts()
        
        assert len(containers) == 2
        for container in containers:
            assert container.has_alert is True


class TestCropLocationRepository:
    """Test cases for CropLocationRepository."""

    def test_create_crop_location(self, db_session):
        """Test creating a crop location."""
        repo = CropLocationRepository(db_session)
        location_data = {
            "type": "tray",
            "tray_id": None,  # Don't reference non-existent tray
            "row": 1,
            "column": 2,
            "position": 3
        }
        
        location = repo.create(location_data)
        
        assert location.id is not None
        assert location.type == "tray"
        assert location.tray_id is None
        assert location.row == 1
        assert location.column == 2
        assert location.position == 3

    def test_get_crop_location_by_id(self, db_session):
        """Test getting a crop location by ID."""
        repo = CropLocationRepository(db_session)
        location_data = {
            "type": "panel",
            "panel_id": None,  # Don't reference non-existent panel
            "row": 1,
            "column": 1,
            "position": 1,
            "channel": 5
        }
        created_location = repo.create(location_data)
        
        location = repo.get_by_id(created_location.id)
        
        assert location is not None
        assert location.id == created_location.id
        assert location.type == "panel"
        assert location.panel_id is None
        assert location.channel == 5

    def test_get_crop_location_by_id_not_found(self, db_session):
        """Test getting a non-existent crop location."""
        repo = CropLocationRepository(db_session)
        
        location = repo.get_by_id(999)
        
        assert location is None


class TestCropRepository:
    """Test cases for CropRepository."""

    def test_create_crop(self, db_session, sample_container):
        """Test creating a crop."""
        repo = CropRepository(db_session)
        crop_data = CropCreate(
            id="crop-001",
            container_id=sample_container.id,
            seed_type="tomato",
            seed_date=datetime.now(),
            age=10,
            status="growing",
            overdue_days=0,
            location=CropLocationCreate(
                type="tray",
                tray_id=None,  # Don't reference non-existent tray
                row=1,
                column=2,
                position=1
            )
        )
        
        crop = repo.create(crop_data)
        
        assert crop.id == "crop-001"
        assert crop.container_id == sample_container.id
        assert crop.seed_type == "tomato"
        assert crop.age == 10
        assert crop.status == "growing"
        assert crop.location is not None
        assert crop.location.type == "tray"

    def test_get_crop_by_id(self, db_session, sample_crop):
        """Test getting a crop by ID."""
        repo = CropRepository(db_session)
        
        crop = repo.get_by_id(sample_crop.id)
        
        assert crop is not None
        assert crop.id == sample_crop.id
        assert crop.location is not None

    def test_get_crop_by_id_not_found(self, db_session):
        """Test getting a non-existent crop."""
        repo = CropRepository(db_session)
        
        crop = repo.get_by_id("non-existent")
        
        assert crop is None

    def test_get_crops_by_container_id(self, db_session, sample_container, multiple_crops):
        """Test getting crops by container ID."""
        repo = CropRepository(db_session)
        
        crops = repo.get_by_container_id(sample_container.id)
        
        assert len(crops) == 3
        for crop in crops:
            assert crop.container_id == sample_container.id

    def test_get_crops_by_container_id_with_filter(self, db_session, sample_container, multiple_crops):
        """Test getting crops by container ID with seed type filter."""
        repo = CropRepository(db_session)
        filters = CropFilter(seed_type="tomato")
        
        crops = repo.get_by_container_id(sample_container.id, filters)
        
        assert len(crops) == 1
        assert crops[0].seed_type == "tomato"

    def test_get_crops_by_container_id_with_pagination(self, db_session, sample_container, multiple_crops):
        """Test getting crops with pagination."""
        repo = CropRepository(db_session)
        
        crops_page1 = repo.get_by_container_id(sample_container.id, skip=0, limit=2)
        crops_page2 = repo.get_by_container_id(sample_container.id, skip=2, limit=2)
        
        assert len(crops_page1) == 2
        assert len(crops_page2) == 1
        assert crops_page1[0].id != crops_page2[0].id

    def test_update_crop(self, db_session, sample_crop):
        """Test updating a crop."""
        repo = CropRepository(db_session)
        update_data = {
            "status": "harvested",
            "age": 30,
            "overdue_days": 5
        }
        
        updated_crop = repo.update(sample_crop.id, update_data)
        
        assert updated_crop is not None
        assert updated_crop.status == "harvested"
        assert updated_crop.age == 30
        assert updated_crop.overdue_days == 5

    def test_update_crop_not_found(self, db_session):
        """Test updating a non-existent crop."""
        repo = CropRepository(db_session)
        update_data = {"status": "new_status"}
        
        result = repo.update("non-existent", update_data)
        
        assert result is None

    def test_delete_crop(self, db_session, sample_crop):
        """Test deleting a crop."""
        repo = CropRepository(db_session)
        
        result = repo.delete(sample_crop.id)
        
        assert result is True
        assert repo.get_by_id(sample_crop.id) is None

    def test_delete_crop_not_found(self, db_session):
        """Test deleting a non-existent crop."""
        repo = CropRepository(db_session)
        
        result = repo.delete("non-existent")
        
        assert result is False


class TestInventoryMetricsRepository:
    """Test cases for InventoryMetricsRepository."""

    def test_create_inventory_metrics(self, db_session, sample_container):
        """Test creating inventory metrics."""
        repo = InventoryMetricsRepository(db_session)
        metrics_data = InventoryMetricsCreate(
            container_id=sample_container.id,
            date=date.today(),
            nursery_station_utilization=75,
            cultivation_area_utilization=80
        )
        
        metrics = repo.create(metrics_data)
        
        assert metrics.id is not None
        assert metrics.container_id == sample_container.id
        assert metrics.nursery_station_utilization == 75
        assert metrics.cultivation_area_utilization == 80

    def test_get_metrics_by_container_and_date(self, db_session, sample_inventory_metrics):
        """Test getting metrics by container and date."""
        repo = InventoryMetricsRepository(db_session)
        
        metrics = repo.get_by_container_and_date(
            sample_inventory_metrics.container_id,
            sample_inventory_metrics.date
        )
        
        assert metrics is not None
        assert metrics.id == sample_inventory_metrics.id

    def test_get_metrics_by_container_and_date_not_found(self, db_session, sample_container):
        """Test getting metrics that don't exist."""
        repo = InventoryMetricsRepository(db_session)
        
        metrics = repo.get_by_container_and_date(
            sample_container.id,
            date(2023, 1, 1)
        )
        
        assert metrics is None

    def test_get_latest_metrics_by_container(self, db_session, sample_container):
        """Test getting latest metrics by container."""
        repo = InventoryMetricsRepository(db_session)
        
        # Create multiple metrics for different dates
        metrics_data1 = InventoryMetricsCreate(
            container_id=sample_container.id,
            date=date(2024, 1, 1),
            nursery_station_utilization=50,
            cultivation_area_utilization=60
        )
        metrics_data2 = InventoryMetricsCreate(
            container_id=sample_container.id,
            date=date(2024, 2, 1),
            nursery_station_utilization=70,
            cultivation_area_utilization=80
        )
        
        repo.create(metrics_data1)
        latest_created = repo.create(metrics_data2)
        
        latest_metrics = repo.get_latest_by_container(sample_container.id)
        
        assert latest_metrics is not None
        assert latest_metrics.id == latest_created.id
        assert latest_metrics.date == date(2024, 2, 1)

    def test_update_inventory_metrics(self, db_session, sample_inventory_metrics):
        """Test updating inventory metrics."""
        repo = InventoryMetricsRepository(db_session)
        update_data = {
            "nursery_station_utilization": 90,
            "cultivation_area_utilization": 95
        }
        
        updated_metrics = repo.update(
            sample_inventory_metrics.container_id,
            sample_inventory_metrics.date,
            update_data
        )
        
        assert updated_metrics is not None
        assert updated_metrics.nursery_station_utilization == 90
        assert updated_metrics.cultivation_area_utilization == 95

    def test_update_inventory_metrics_not_found(self, db_session, sample_container):
        """Test updating non-existent inventory metrics."""
        repo = InventoryMetricsRepository(db_session)
        update_data = {"nursery_station_utilization": 50}
        
        result = repo.update(
            sample_container.id,
            date(2023, 1, 1),
            update_data
        )
        
        assert result is None

    def test_delete_inventory_metrics(self, db_session, sample_inventory_metrics):
        """Test deleting inventory metrics."""
        repo = InventoryMetricsRepository(db_session)
        
        result = repo.delete(
            sample_inventory_metrics.container_id,
            sample_inventory_metrics.date
        )
        
        assert result is True
        
        # Verify deletion
        metrics = repo.get_by_container_and_date(
            sample_inventory_metrics.container_id,
            sample_inventory_metrics.date
        )
        assert metrics is None

    def test_delete_inventory_metrics_not_found(self, db_session, sample_container):
        """Test deleting non-existent inventory metrics."""
        repo = InventoryMetricsRepository(db_session)
        
        result = repo.delete(sample_container.id, date(2023, 1, 1))
        
        assert result is False


class TestTrayRepository:
    """Test cases for TrayRepository."""

    def test_create_tray(self, db_session):
        """Test creating a tray."""
        repo = TrayRepository(db_session)
        tray_data = TrayCreate(
            rfid_tag="TRAY001",
            shelf="upper",
            slot_number=1
        )
        
        tray = repo.create_tray(tray_data, "container-1")
        
        assert tray.id == "tray_TRAY001"
        assert tray.rfid_tag == "TRAY001"
        assert tray.container_id == "container-1"
        assert tray.location is not None
        assert tray.location.shelf == "upper"
        assert tray.location.slot_number == 1

    def test_get_trays_by_container(self, db_session, sample_trays):
        """Test getting trays by container."""
        repo = TrayRepository(db_session)
        
        trays = repo.get_trays_by_container("container-1")
        
        assert len(trays) == 2
        for tray in trays:
            assert tray.container_id == "container-1"

    def test_get_trays_by_shelf(self, db_session, sample_trays):
        """Test getting trays by shelf."""
        repo = TrayRepository(db_session)
        
        upper_trays = repo.get_trays_by_shelf("container-1", "upper")
        lower_trays = repo.get_trays_by_shelf("container-1", "lower")
        
        assert len(upper_trays) == 1
        assert len(lower_trays) == 1
        assert upper_trays[0].location.shelf == "upper"
        assert lower_trays[0].location.shelf == "lower"

    def test_get_off_shelf_trays(self, db_session, sample_trays_mixed):
        """Test getting off-shelf trays."""
        repo = TrayRepository(db_session)
        
        off_shelf_trays = repo.get_off_shelf_trays("container-1")
        
        assert len(off_shelf_trays) == 1

    def test_get_tray_by_id(self, db_session, sample_trays):
        """Test getting a tray by ID."""
        repo = TrayRepository(db_session)
        
        tray = repo.get_tray_by_id("tray_TRAY001")
        
        assert tray is not None
        assert tray.id == "tray_TRAY001"
        assert tray.location is not None

    def test_get_tray_by_id_not_found(self, db_session):
        """Test getting a non-existent tray."""
        repo = TrayRepository(db_session)
        
        tray = repo.get_tray_by_id("non-existent")
        
        assert tray is None

    def test_delete_tray(self, db_session, sample_trays):
        """Test deleting a tray."""
        repo = TrayRepository(db_session)
        
        result = repo.delete_tray("tray_TRAY001")
        
        assert result is True
        assert repo.get_tray_by_id("tray_TRAY001") is None

    def test_delete_tray_not_found(self, db_session):
        """Test deleting a non-existent tray."""
        repo = TrayRepository(db_session)
        
        result = repo.delete_tray("non-existent")
        
        assert result is False


class TestPanelRepository:
    """Test cases for PanelRepository."""

    def test_create_panel(self, db_session):
        """Test creating a panel."""
        repo = PanelRepository(db_session)
        
        panel = repo.create_panel("panel-001", "PANEL001", "container-1", "wall_1", 1)
        
        assert panel.id == "panel-001"
        assert panel.rfid_tag == "PANEL001"
        assert panel.container_id == "container-1"
        assert panel.location is not None
        assert panel.location.wall == "wall_1"
        assert panel.location.slot_number == 1

    def test_get_panels_by_container(self, db_session, sample_panels):
        """Test getting panels by container."""
        repo = PanelRepository(db_session)
        
        panels = repo.get_panels_by_container("container-1")
        
        assert len(panels) == 3
        for panel in panels:
            assert panel.container_id == "container-1"

    def test_get_panels_by_wall(self, db_session, sample_panels):
        """Test getting panels by wall."""
        repo = PanelRepository(db_session)
        
        wall1_panels = repo.get_panels_by_wall("container-1", "wall_1")
        wall2_panels = repo.get_panels_by_wall("container-1", "wall_2")
        
        assert len(wall1_panels) == 2
        assert len(wall2_panels) == 1
        for panel in wall1_panels:
            assert panel.location.wall == "wall_1"
        for panel in wall2_panels:
            assert panel.location.wall == "wall_2"

    def test_get_off_wall_panels(self, db_session, sample_panels_mixed):
        """Test getting off-wall panels."""
        repo = PanelRepository(db_session)
        
        off_wall_panels = repo.get_off_wall_panels("container-1")
        
        assert len(off_wall_panels) == 1

    def test_get_panel_by_id(self, db_session, sample_panels):
        """Test getting a panel by ID."""
        repo = PanelRepository(db_session)
        
        panel = repo.get_panel_by_id("panel-001")
        
        assert panel is not None
        assert panel.id == "panel-001"
        assert panel.location is not None

    def test_get_panel_by_id_not_found(self, db_session):
        """Test getting a non-existent panel."""
        repo = PanelRepository(db_session)
        
        panel = repo.get_panel_by_id("non-existent")
        
        assert panel is None

    def test_delete_panel(self, db_session, sample_panels):
        """Test deleting a panel."""
        repo = PanelRepository(db_session)
        
        result = repo.delete_panel("panel-001")
        
        assert result is True
        assert repo.get_panel_by_id("panel-001") is None

    def test_delete_panel_not_found(self, db_session):
        """Test deleting a non-existent panel."""
        repo = PanelRepository(db_session)
        
        result = repo.delete_panel("non-existent")
        
        assert result is False
