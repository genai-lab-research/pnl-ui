from typing import Generator, Dict, Any

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.database.database import Base, get_db
from app.models.models import Container, Tenant, MetricSnapshot, ActivityLog, SeedType, Crop, Tray, Panel
from app.models.enums import ContainerType, ContainerStatus, ContainerPurpose, ActorType
from app.api.api_v1 import api_router
from app.main import app

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db() -> Generator:
    """
    Create a fresh database on each test case.
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(db: Session) -> Generator:
    """
    Create a fresh database session for each test.
    """
    # Start with a clean slate for each test
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())
    db.commit()

    # Setup test data
    create_test_data(db)
    yield db
    db.rollback()


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator:
    """
    Create a FastAPI TestClient with overridden dependencies.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def create_test_data(db: Session) -> Dict[str, Any]:
    """Create test data for testing."""
    # Create a tenant
    tenant = Tenant(id="tenant-123", name="Test Tenant")
    db.add(tenant)
    db.commit()
    
    # Create seed types
    seed_type1 = SeedType(id="seed-type-1", name="Salanova Cousteau", variety="Lettuce")
    seed_type2 = SeedType(id="seed-type-2", name="Kiribati", variety="Kale")
    db.add(seed_type1)
    db.add(seed_type2)
    db.commit()

    # Create a container
    container = Container(
        id="container-123",
        name="Test Container",
        type=ContainerType.PHYSICAL,
        tenant_id=tenant.id,
        purpose=ContainerPurpose.DEVELOPMENT,
        location_city="Test City",
        location_country="Test Country",
        location_address="123 Test Street",
        notes="Test container for API testing",
        shadow_service_enabled=True,
        ecosystem_connected=True,
        ecosystem_settings={
            "fa_integration": {
                "name": "Alpha",
                "enabled": True
            },
            "aws_environment": {
                "name": "Dev",
                "enabled": True
            },
            "mbai_environment": {
                "name": "Disabled",
                "enabled": False
            }
        },
        status=ContainerStatus.ACTIVE
    )
    db.add(container)
    db.commit()
    
    # Associate seed types with container
    container.seed_types.extend([seed_type1, seed_type2])
    db.commit()
    
    # Create a tray in the container
    tray = Tray(
        id="tray-123",
        container_id=container.id,
        rfid_tag="RFID-TRAY-123",
        utilization_percentage=75
    )
    db.add(tray)
    db.commit()
    
    # Create a panel in the container
    panel = Panel(
        id="panel-123",
        container_id=container.id,
        rfid_tag="RFID-PANEL-123",
        utilization_percentage=90
    )
    db.add(panel)
    db.commit()
    
    # Create some metrics data
    from datetime import datetime
    metrics = MetricSnapshot(
        id="metric-123",
        container_id=container.id,
        timestamp=datetime.utcnow(),
        air_temperature=20.5,
        humidity=65.2,
        co2=850,
        yield_kg=51.3,
        nursery_utilization_percentage=75,
        cultivation_utilization_percentage=90
    )
    db.add(metrics)
    db.commit()
    
    # Create some activity logs
    activities = [
        ActivityLog(
            id="activity-1",
            container_id=container.id,
            action_type="SEEDED",
            actor_type=ActorType.USER,
            actor_id="user-123",
            description="Seeded Salanova Cousteau in Nursery"
        ),
        ActivityLog(
            id="activity-2",
            container_id=container.id,
            action_type="SYNCED",
            actor_type=ActorType.SYSTEM,
            actor_id="system",
            description="Data synced"
        ),
        ActivityLog(
            id="activity-3",
            container_id=container.id,
            action_type="ENVIRONMENT_CHANGED",
            actor_type=ActorType.USER,
            actor_id="admin-123",
            description="Environment mode switched to Auto"
        )
    ]
    db.add_all(activities)
    db.commit()
    
    # Create some crops
    from datetime import datetime
    from app.models.enums import CropLifecycleStatus, CropHealthCheck, CropLocationType
    
    crops = [
        Crop(
            id="crop-1",
            seed_type_id=seed_type1.id,
            seed_date=datetime(2023, 1, 30, 9, 30, 0),
            transplanting_date_planned=datetime(2023, 2, 10, 9, 30, 0),
            harvesting_date_planned=datetime(2023, 2, 28, 9, 30, 0),
            lifecycle_status=CropLifecycleStatus.SEEDED,
            health_check=CropHealthCheck.HEALTHY,
            current_location_type=CropLocationType.TRAY_LOCATION,
            tray_id=tray.id,
            tray_row=1,
            tray_column=1
        ),
        Crop(
            id="crop-2",
            seed_type_id=seed_type2.id,
            seed_date=datetime(2023, 1, 15, 11, 20, 0),
            transplanting_date_planned=datetime(2023, 1, 25, 11, 20, 0),
            harvesting_date_planned=datetime(2023, 2, 15, 11, 20, 0),
            lifecycle_status=CropLifecycleStatus.TRANSPLANTED,
            health_check=CropHealthCheck.HEALTHY,
            current_location_type=CropLocationType.PANEL_LOCATION,
            panel_id=panel.id,
            panel_channel=1,
            panel_position=2.5
        )
    ]
    db.add_all(crops)
    db.commit()
    
    return {
        "tenant": tenant,
        "container": container,
        "seed_types": [seed_type1, seed_type2],
        "metrics": metrics,
        "activities": activities,
        "tray": tray,
        "panel": panel,
        "crops": crops
    }