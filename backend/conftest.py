"""Test configuration and fixtures for the application."""

import pytest
from datetime import datetime, date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.core.db import Base, get_db
from app.models import Location, Container, Crop, CropLocation, InventoryMetrics, Tray, TrayLocation, Panel, PanelLocation

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost:5432/demo_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with a test database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_location(db_session):
    """Create a sample location for testing."""
    location = Location(
        city="Test City",
        country="Test Country",
        address="123 Test Street"
    )
    db_session.add(location)
    db_session.commit()
    db_session.refresh(location)
    return location


@pytest.fixture
def sample_container(db_session, sample_location):
    """Create a sample container for testing."""
    container = Container(
        id="test-container-001",
        type="physical",
        name="Test Container",
        tenant="test-tenant",
        purpose="development",
        location_id=sample_location.id,
        status="active",
        seed_types=["seed1", "seed2"],
        has_alert=False,
        notes="Test container",
        shadow_service_enabled=True,
        ecosystem_connected=True
    )
    db_session.add(container)
    db_session.commit()
    db_session.refresh(container)
    return container


@pytest.fixture
def multiple_containers(db_session, sample_location):
    """Create multiple containers for testing."""
    containers = []
    for i in range(5):
        container = Container(
            id=f"container-{i:03d}",
            type="physical" if i % 2 == 0 else "virtual",
            name=f"Container {i}",
            tenant=f"tenant-{i % 2}",
            purpose="development" if i < 3 else "production",
            location_id=sample_location.id,
            status="active" if i < 4 else "inactive",
            seed_types=[f"seed-{i}"],
            has_alert=i % 3 == 0,
            notes=f"Container {i} notes",
            shadow_service_enabled=True,
            ecosystem_connected=i % 2 == 0
        )
        containers.append(container)
        db_session.add(container)
    
    db_session.commit()
    for container in containers:
        db_session.refresh(container)
    return containers


@pytest.fixture
def sample_crop_location(db_session):
    """Create a sample crop location for testing."""
    crop_location = CropLocation(
        type="tray",
        tray_id=None,  # Don't reference non-existent tray
        row=1,
        column=2,
        position=1
    )
    db_session.add(crop_location)
    db_session.commit()
    db_session.refresh(crop_location)
    return crop_location


@pytest.fixture
def sample_crop(db_session, sample_container, sample_crop_location):
    """Create a sample crop for testing."""
    now = datetime.now()
    crop = Crop(
        id="crop-001",
        container_id=sample_container.id,
        seed_type="tomato",
        seed_date=now,
        transplanting_date_planned=now,
        harvesting_date_planned=now,
        age=15,
        status="growing",
        overdue_days=0,
        location_id=sample_crop_location.id
    )
    db_session.add(crop)
    db_session.commit()
    db_session.refresh(crop)
    return crop


@pytest.fixture
def sample_crop_with_location(db_session, sample_container):
    """Create a sample crop with location for testing the specific endpoint."""
    # Create crop location
    crop_location = CropLocation(
        type="tray",
        tray_id=None,  # Don't reference non-existent tray
        panel_id=None,
        row=1,
        column=2,
        channel=1,
        position=5
    )
    db_session.add(crop_location)
    db_session.flush()  # Get the ID without committing
    
    # Create crop
    now = datetime.now()
    crop = Crop(
        id="crop-specific-001",
        container_id=sample_container.id,
        seed_type="lettuce",
        seed_date=now,
        transplanting_date_planned=now,
        harvesting_date_planned=now,
        transplanted_date=None,
        harvesting_date=None,
        age=21,
        status="growing",
        overdue_days=None,
        location_id=crop_location.id
    )
    db_session.add(crop)
    db_session.commit()
    db_session.refresh(crop)
    
    return sample_container.id, crop


@pytest.fixture
def multiple_crops(db_session, sample_container):
    """Create multiple crops for testing."""
    crops = []
    seed_types = ["tomato", "lettuce", "spinach"]
    
    for i in range(3):
        # Create crop location
        crop_location = CropLocation(
            type="tray",
            tray_id=None,  # Don't reference non-existent tray
            row=i+1,
            column=1,
            position=i+1
        )
        db_session.add(crop_location)
        db_session.flush()  # Get the ID without committing
        
        # Create crop
        now = datetime.now()
        crop = Crop(
            id=f"crop-{i:03d}",
            container_id=sample_container.id,
            seed_type=seed_types[i],
            seed_date=now,
            transplanting_date_planned=now,
            harvesting_date_planned=now,
            age=10 + i,
            status="growing",
            overdue_days=i,
            location_id=crop_location.id
        )
        crops.append(crop)
        db_session.add(crop)
    
    db_session.commit()
    for crop in crops:
        db_session.refresh(crop)
    return crops


@pytest.fixture
def sample_inventory_metrics(db_session, sample_container):
    """Create sample inventory metrics for testing."""
    metrics = InventoryMetrics(
        container_id=sample_container.id,
        date=date.today(),
        nursery_station_utilization=75,
        cultivation_area_utilization=80
    )
    db_session.add(metrics)
    db_session.commit()
    db_session.refresh(metrics)
    return metrics


@pytest.fixture
def sample_trays(db_session):
    """Create sample trays for testing."""
    trays = []
    
    # Create tray 1 with location
    tray1 = Tray(
        id="tray_TRAY001",
        rfid_tag="TRAY001",
        container_id="container-1",
        utilization_percentage=50,
        crop_count=5,
        is_empty=False
    )
    location1 = TrayLocation(shelf="upper", slot_number=1)
    db_session.add(tray1)
    db_session.flush()
    location1.tray_id = tray1.id
    db_session.add(location1)
    trays.append(tray1)
    
    # Create tray 2 with location
    tray2 = Tray(
        id="tray_TRAY002",
        rfid_tag="TRAY002",
        container_id="container-1",
        utilization_percentage=75,
        crop_count=8,
        is_empty=False
    )
    location2 = TrayLocation(shelf="lower", slot_number=1)
    db_session.add(tray2)
    db_session.flush()
    location2.tray_id = tray2.id
    db_session.add(location2)
    trays.append(tray2)
    
    db_session.commit()
    for tray in trays:
        db_session.refresh(tray)
    return trays


@pytest.fixture
def sample_trays_mixed(db_session):
    """Create sample trays with some off-shelf for testing."""
    trays = []
    
    # Create on-shelf tray
    tray1 = Tray(
        id="tray_TRAY001",
        rfid_tag="TRAY001",
        container_id="container-1",
        utilization_percentage=50,
        crop_count=5
    )
    location1 = TrayLocation(shelf="upper", slot_number=1)
    db_session.add(tray1)
    db_session.flush()
    location1.tray_id = tray1.id
    db_session.add(location1)
    trays.append(tray1)
    
    # Create off-shelf tray (no location)
    tray2 = Tray(
        id="tray_TRAY002",
        rfid_tag="TRAY002",
        container_id="container-1",
        utilization_percentage=0,
        crop_count=0,
        is_empty=True
    )
    db_session.add(tray2)
    trays.append(tray2)
    
    db_session.commit()
    for tray in trays:
        db_session.refresh(tray)
    return trays


@pytest.fixture
def sample_panels(db_session):
    """Create sample panels for testing."""
    panels = []
    
    # Create panel 1
    panel1 = Panel(
        id="panel-001",
        rfid_tag="PANEL001",
        container_id="container-1",
        utilization_percentage=60,
        crop_count=12
    )
    location1 = PanelLocation(wall="wall_1", slot_number=1)
    db_session.add(panel1)
    db_session.flush()
    location1.panel_id = panel1.id
    db_session.add(location1)
    panels.append(panel1)
    
    # Create panel 2
    panel2 = Panel(
        id="panel-002",
        rfid_tag="PANEL002",
        container_id="container-1",
        utilization_percentage=80,
        crop_count=16
    )
    location2 = PanelLocation(wall="wall_1", slot_number=2)
    db_session.add(panel2)
    db_session.flush()
    location2.panel_id = panel2.id
    db_session.add(location2)
    panels.append(panel2)
    
    # Create panel 3
    panel3 = Panel(
        id="panel-003",
        rfid_tag="PANEL003",
        container_id="container-1",
        utilization_percentage=45,
        crop_count=9
    )
    location3 = PanelLocation(wall="wall_2", slot_number=1)
    db_session.add(panel3)
    db_session.flush()
    location3.panel_id = panel3.id
    db_session.add(location3)
    panels.append(panel3)
    
    db_session.commit()
    for panel in panels:
        db_session.refresh(panel)
    return panels


@pytest.fixture
def sample_panels_mixed(db_session):
    """Create sample panels with some off-wall for testing."""
    panels = []
    
    # Create on-wall panel
    panel1 = Panel(
        id="panel-001",
        rfid_tag="PANEL001",
        container_id="container-1",
        utilization_percentage=60,
        crop_count=12
    )
    location1 = PanelLocation(wall="wall_1", slot_number=1)
    db_session.add(panel1)
    db_session.flush()
    location1.panel_id = panel1.id
    db_session.add(location1)
    panels.append(panel1)
    
    # Create off-wall panel (no location)
    panel2 = Panel(
        id="panel-002",
        rfid_tag="PANEL002",
        container_id="container-1",
        utilization_percentage=0,
        crop_count=0,
        is_empty=True
    )
    db_session.add(panel2)
    panels.append(panel2)
    
    db_session.commit()
    for panel in panels:
        db_session.refresh(panel)
    return panels