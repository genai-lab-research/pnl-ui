"""
Sample data generation script for container details test data.
This script adds mock data for container details page endpoints.
"""
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.models import (
    Container, Tenant, SeedType, MetricSnapshot, ActivityLog, Crop,
    Tray, Panel, CropHistoryEntry
)
from app.models.enums import (
    ContainerType, ContainerPurpose, ContainerStatus, ActorType,
    CropLifecycleStatus, CropHealthCheck, CropLocationType
)


def create_container_details_samples(db: Session) -> None:
    """Create sample data for container details page."""
    print("Creating sample data for container details page...")
    
    # Clean up any existing data related to our container-details-04 container
    container_id = "container-details-04"
    
    # Delete existing crops for this container (cascades to crop_history)
    db.query(Crop).filter(
        (Crop.tray_id.in_(db.query(Tray.id).filter(Tray.container_id == container_id))) | 
        (Crop.panel_id.in_(db.query(Panel.id).filter(Panel.container_id == container_id)))
    ).delete(synchronize_session=False)
    
    # Delete existing metric snapshots
    db.query(MetricSnapshot).filter(MetricSnapshot.container_id == container_id).delete()
    
    # Delete existing activity logs
    db.query(ActivityLog).filter(ActivityLog.container_id == container_id).delete()
    
    db.commit()
    
    # Get existing tenants or create if none
    tenant = db.query(Tenant).first()
    if not tenant:
        tenant = Tenant(
            id="tenant-detail-1",
            name="Farm Technologies Corp"
        )
        db.add(tenant)
        db.commit()
    
    # Create seed types if needed
    seed_types = db.query(SeedType).all()
    if len(seed_types) < 4:
        seed_types = [
            SeedType(id="seed-detail-1", name="Salanova Cousteau", variety="Lettuce"),
            SeedType(id="seed-detail-2", name="Kiribati", variety="Kale"),
            SeedType(id="seed-detail-3", name="Rex Butterhead", variety="Lettuce"),
            SeedType(id="seed-detail-4", name="Lollo Rossa", variety="Lettuce")
        ]
        db.add_all(seed_types)
        db.commit()
    
    # Check if container already exists and update it, or create a new one
    container = db.query(Container).filter(Container.name == "farm-container-04").first()
    
    if container:
        # Update existing container
        container.id = "container-details-04"  # Ensure it has the right ID
        container.type = ContainerType.PHYSICAL
        container.tenant_id = tenant.id
        container.purpose = ContainerPurpose.DEVELOPMENT
        container.location_city = "Lviv"
        container.location_country = "Ukraine"
        container.location_address = "123 Innovation Park"
        container.notes = "Primary production container for Farm A."
        container.status = ContainerStatus.ACTIVE
        container.shadow_service_enabled = False
        container.ecosystem_connected = True
        container.created_at = datetime(2023, 1, 30, 9, 30)
        container.updated_at = datetime(2023, 1, 30, 11, 14)
        container.ecosystem_settings = {
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
        }
    else:
        # Create new container
        container = Container(
            id="container-details-04",
            name="farm-container-04",
            type=ContainerType.PHYSICAL,
            tenant_id=tenant.id,
            purpose=ContainerPurpose.DEVELOPMENT,
            location_city="Lviv",
            location_country="Ukraine",
            location_address="123 Innovation Park",
            notes="Primary production container for Farm A.",
            status=ContainerStatus.ACTIVE,
            shadow_service_enabled=False,
            ecosystem_connected=True,
            created_at=datetime(2023, 1, 30, 9, 30),
            updated_at=datetime(2023, 1, 30, 11, 14),
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
            }
        )
        db.add(container)
    
    db.commit()
    
    # Associate seed types with container
    for seed_type in seed_types:
        container.seed_types.append(seed_type)
    db.commit()
    
    # Check for existing trays and create or update them
    trays = []
    for i in range(1, 6):  # 5 trays
        # Check if tray with this RFID tag already exists
        existing_tray = db.query(Tray).filter(Tray.rfid_tag == f"RFID-TRAY-{i}").first()
        
        if existing_tray:
            # Update existing tray
            existing_tray.id = f"tray-detail-{i}"
            existing_tray.container_id = container.id
            existing_tray.utilization_percentage = random.randint(50, 95)
            trays.append(existing_tray)
        else:
            # Create new tray
            new_tray = Tray(
                id=f"tray-detail-{i}",
                container_id=container.id,
                rfid_tag=f"RFID-TRAY-{i}",
                utilization_percentage=random.randint(50, 95)
            )
            db.add(new_tray)
            trays.append(new_tray)
    
    db.commit()
    
    # Check for existing panels and create or update them
    panels = []
    for i in range(1, 4):  # 3 panels
        # Check if panel with this RFID tag already exists
        existing_panel = db.query(Panel).filter(Panel.rfid_tag == f"RFID-PANEL-{i}").first()
        
        if existing_panel:
            # Update existing panel
            existing_panel.id = f"panel-detail-{i}"
            existing_panel.container_id = container.id
            existing_panel.utilization_percentage = random.randint(70, 100)
            panels.append(existing_panel)
        else:
            # Create new panel
            new_panel = Panel(
                id=f"panel-detail-{i}",
                container_id=container.id,
                rfid_tag=f"RFID-PANEL-{i}",
                utilization_percentage=random.randint(70, 100)
            )
            db.add(new_panel)
            panels.append(new_panel)
    
    db.commit()
    
    # Create metric snapshots for the last 60 days
    now = datetime.utcnow()
    for i in range(60, 0, -1):
        date = now - timedelta(days=i)
        
        # Daily fluctuation with upward trend
        temp_multiplier = 1.0 + (60 - i) / 300  # Slight increase over time
        temp_fluctuation = random.uniform(-0.7, 0.7)
        
        # Create the metric snapshot
        metric = MetricSnapshot(
            container_id=container.id,
            timestamp=date,
            air_temperature=20.0 + temp_fluctuation,
            humidity=65.0 + random.uniform(-5, 5),
            co2=850 + random.randint(-50, 50),
            yield_kg=45.0 + (60 - i) / 10,  # Increasing yield
            space_utilization_percentage=80 + random.randint(-10, 10),
            nursery_utilization_percentage=70 + random.randint(-10, 15),
            cultivation_utilization_percentage=85 + random.randint(-10, 15)
        )
        db.add(metric)
    
    db.commit()
    
    # Create crops for the container
    crops = []
    for i, seed_type in enumerate(seed_types):
        # Calculate dates for mock data
        seed_date = datetime(2025, 1, 30) - timedelta(days=i*5)
        transplant_date = seed_date + timedelta(days=10) if i < 3 else None
        harvest_date = seed_date + timedelta(days=30) if i < 2 else None
        
        # Determine lifecycle status
        if harvest_date:
            lifecycle_status = CropLifecycleStatus.HARVESTED
        elif transplant_date:
            lifecycle_status = CropLifecycleStatus.TRANSPLANTED
        else:
            lifecycle_status = CropLifecycleStatus.SEEDED
        
        # Create crop with either tray or panel location
        if i % 2 == 0:
            # Tray location
            crop = Crop(
                id=f"crop-detail-{i+1}",
                seed_type_id=seed_type.id,
                seed_date=seed_date,
                transplanting_date_planned=seed_date + timedelta(days=12),
                harvesting_date_planned=seed_date + timedelta(days=35),
                transplanted_date=transplant_date,
                harvesting_date=harvest_date,
                lifecycle_status=lifecycle_status,
                health_check=CropHealthCheck.HEALTHY,
                current_location_type=CropLocationType.TRAY_LOCATION,
                tray_id=trays[i % len(trays)].id,
                tray_row=random.randint(1, 5),
                tray_column=random.randint(1, 10),
                area=random.uniform(10, 20),
                weight=random.uniform(0.5, 2.0) if lifecycle_status == CropLifecycleStatus.HARVESTED else None
            )
        else:
            # Panel location
            crop = Crop(
                id=f"crop-detail-{i+1}",
                seed_type_id=seed_type.id,
                seed_date=seed_date,
                transplanting_date_planned=seed_date + timedelta(days=12),
                harvesting_date_planned=seed_date + timedelta(days=35),
                transplanted_date=transplant_date,
                harvesting_date=harvest_date,
                lifecycle_status=lifecycle_status,
                health_check=CropHealthCheck.HEALTHY,
                current_location_type=CropLocationType.PANEL_LOCATION,
                panel_id=panels[i % len(panels)].id,
                panel_channel=random.randint(1, 8),
                panel_position=random.uniform(1, 10),
                area=random.uniform(10, 20),
                weight=random.uniform(0.5, 2.0) if lifecycle_status == CropLifecycleStatus.HARVESTED else None
            )
        
        crops.append(crop)
    
    # Add overdue crops
    overdue_crop1 = Crop(
        id="crop-detail-overdue-1",
        seed_type_id=seed_types[0].id,
        seed_date=datetime(2025, 1, 15),
        transplanting_date_planned=datetime(2025, 1, 25),
        harvesting_date_planned=datetime(2025, 2, 15),
        lifecycle_status=CropLifecycleStatus.SEEDED,
        health_check=CropHealthCheck.HEALTHY,
        current_location_type=CropLocationType.TRAY_LOCATION,
        tray_id=trays[0].id,
        tray_row=3,
        tray_column=5
    )
    
    overdue_crop2 = Crop(
        id="crop-detail-overdue-2",
        seed_type_id=seed_types[3].id,
        seed_date=datetime(2025, 1, 10),
        transplanting_date_planned=datetime(2025, 1, 20),
        harvesting_date_planned=datetime(2025, 2, 10),
        transplanted_date=datetime(2025, 1, 22),  # Late transplant
        lifecycle_status=CropLifecycleStatus.TRANSPLANTED,
        health_check=CropHealthCheck.TREATMENT_REQUIRED,
        current_location_type=CropLocationType.PANEL_LOCATION,
        panel_id=panels[0].id,
        panel_channel=2,
        panel_position=3.5
    )
    
    crops.extend([overdue_crop1, overdue_crop2])
    db.add_all(crops)
    db.commit()
    
    # Create crop history
    for crop in crops:
        # Seed history
        seed_history = CropHistoryEntry(
            crop_id=crop.id,
            timestamp=crop.seed_date,
            event="Crop seeded",
            performed_by="Emily Chen",
            notes=f"Initial seeding of {crop.seed_type_ref.name}"
        )
        db.add(seed_history)
        
        # Transplant history if applicable
        if crop.transplanted_date:
            transplant_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=crop.transplanted_date,
                event="Crop transplanted",
                performed_by="Marius Johnson",
                notes=f"Transplanted from nursery to cultivation area"
            )
            db.add(transplant_history)
        
        # Harvest history if applicable
        if crop.harvesting_date:
            harvest_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=crop.harvesting_date,
                event="Crop harvested",
                performed_by="Maintenance Team",
                notes=f"Harvested with weight: {crop.weight}kg"
            )
            db.add(harvest_history)
    
    db.commit()
    
    # Create activity logs
    activities = [
        ActivityLog(
            container_id=container.id,
            timestamp=datetime(2025, 4, 13, 12, 30),
            action_type="SEEDED",
            actor_type=ActorType.USER,
            actor_id="user-emily",
            description="Seeded Salanova Cousteau in Nursery"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=datetime(2025, 4, 13, 9, 45),
            action_type="SYNCED",
            actor_type=ActorType.SYSTEM,
            actor_id="system",
            description="Data synced"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=datetime(2025, 4, 10, 10, 0),
            action_type="ENVIRONMENT_CHANGED",
            actor_type=ActorType.USER,
            actor_id="admin-marius",
            description="Environment mode switched to Auto"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=datetime(2025, 4, 10, 9, 0),
            action_type="CREATED",
            actor_type=ActorType.SYSTEM,
            actor_id="system",
            description="Container created"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=datetime(2025, 4, 9, 10, 0),
            action_type="MAINTENANCE",
            actor_type=ActorType.USER,
            actor_id="maintenance-team",
            description="Container maintenance performed"
        )
    ]
    
    db.add_all(activities)
    db.commit()
    
    print(f"Created sample container with id: {container.id}")
    print("Sample crops and metrics created. Activity logs added.")


def create_additional_container_crop_samples(db: Session) -> None:
    """Create additional container with more diverse crop samples."""
    print("Creating additional container with diverse crop samples...")
    
    # Container ID for the new container
    container_id = "container-crops-demo"
    
    # Clean up any existing data related to our container
    # Delete existing crops for this container (cascades to crop_history)
    db.query(Crop).filter(
        (Crop.tray_id.in_(db.query(Tray.id).filter(Tray.container_id == container_id))) | 
        (Crop.panel_id.in_(db.query(Panel.id).filter(Panel.container_id == container_id)))
    ).delete(synchronize_session=False)
    
    # Delete existing metric snapshots
    db.query(MetricSnapshot).filter(MetricSnapshot.container_id == container_id).delete()
    
    # Delete existing activity logs
    db.query(ActivityLog).filter(ActivityLog.container_id == container_id).delete()
    
    db.commit()
    
    # Get existing tenants or create if none
    tenant = db.query(Tenant).first()
    if not tenant:
        tenant = Tenant(
            id="tenant-detail-1",
            name="Farm Technologies Corp"
        )
        db.add(tenant)
        db.commit()
        
    # Create diverse seed types
    seed_types = [
        SeedType(id="seed-diverse-1", name="Romaine", variety="Lettuce"),
        SeedType(id="seed-diverse-2", name="Green Oak", variety="Lettuce"),
        SeedType(id="seed-diverse-3", name="Red Oak", variety="Lettuce"),
        SeedType(id="seed-diverse-4", name="Basil Genovese", variety="Herb"),
        SeedType(id="seed-diverse-5", name="Cilantro", variety="Herb"),
        SeedType(id="seed-diverse-6", name="Arugula", variety="Greens"),
        SeedType(id="seed-diverse-7", name="Mizuna", variety="Greens"),
        SeedType(id="seed-diverse-8", name="Mustard Greens", variety="Greens")
    ]
    
    # Check if these seed types already exist
    for st in seed_types:
        existing = db.query(SeedType).filter(SeedType.id == st.id).first()
        if not existing:
            db.add(st)
    
    db.commit()
    
    # Check if container already exists and update it, or create a new one
    container = db.query(Container).filter(Container.id == container_id).first()
    
    if container:
        # Update existing container
        container.name = "farm-container-crops"
        container.type = ContainerType.PHYSICAL
        container.tenant_id = tenant.id
        container.purpose = ContainerPurpose.PRODUCTION
        container.location_city = "Barcelona"
        container.location_country = "Spain"
        container.location_address = "456 Production Avenue"
        container.notes = "Container with diverse crop examples"
        container.status = ContainerStatus.ACTIVE
        container.shadow_service_enabled = True
        container.ecosystem_connected = True
        container.created_at = datetime(2025, 1, 10, 14, 30)
        container.updated_at = datetime(2025, 1, 10, 15, 45)
    else:
        # Create new container
        container = Container(
            id=container_id,
            name="farm-container-crops",
            type=ContainerType.PHYSICAL,
            tenant_id=tenant.id,
            purpose=ContainerPurpose.PRODUCTION,
            location_city="Barcelona",
            location_country = "Spain",
            location_address = "456 Production Avenue",
            notes = "Container with diverse crop examples",
            status=ContainerStatus.ACTIVE,
            shadow_service_enabled=True,
            ecosystem_connected=True,
            created_at=datetime(2025, 1, 10, 14, 30),
            updated_at=datetime(2025, 1, 10, 15, 45)
        )
        db.add(container)
    
    db.commit()
    
    # Associate seed types with container
    for seed_type in seed_types:
        if seed_type not in container.seed_types:
            container.seed_types.append(seed_type)
    
    db.commit()
    
    # Create more trays with different utilization levels
    trays = []
    for i in range(1, 11):  # 10 trays
        # Check if tray with this RFID tag already exists
        existing_tray = db.query(Tray).filter(Tray.rfid_tag == f"RFID-DIV-TRAY-{i}").first()
        
        if existing_tray:
            # Update existing tray
            existing_tray.id = f"tray-div-{i}"
            existing_tray.container_id = container.id
            existing_tray.utilization_percentage = random.randint(50, 95)
            trays.append(existing_tray)
        else:
            # Create new tray
            new_tray = Tray(
                id=f"tray-div-{i}",
                container_id=container.id,
                rfid_tag=f"RFID-DIV-TRAY-{i}",
                utilization_percentage=random.randint(50, 95)
            )
            db.add(new_tray)
            trays.append(new_tray)
    
    db.commit()
    
    # Create more panels
    panels = []
    for i in range(1, 6):  # 5 panels
        # Check if panel with this RFID tag already exists
        existing_panel = db.query(Panel).filter(Panel.rfid_tag == f"RFID-DIV-PANEL-{i}").first()
        
        if existing_panel:
            # Update existing panel
            existing_panel.id = f"panel-div-{i}"
            existing_panel.container_id = container.id
            existing_panel.utilization_percentage = random.randint(70, 100)
            panels.append(existing_panel)
        else:
            # Create new panel
            new_panel = Panel(
                id=f"panel-div-{i}",
                container_id=container.id,
                rfid_tag=f"RFID-DIV-PANEL-{i}",
                utilization_percentage=random.randint(70, 100)
            )
            db.add(new_panel)
            panels.append(new_panel)
    
    db.commit()
    
    # Create a diverse set of crops in different lifecycle stages
    now = datetime.utcnow()
    crops = []
    
    # Helper function to create a crop
    def create_crop(seed_type, status, seed_date, location_type, tray=None, panel=None):
        transplant_date = None
        harvest_date = None
        
        if status == CropLifecycleStatus.TRANSPLANTED:
            transplant_date = seed_date + timedelta(days=random.randint(12, 15))
        elif status == CropLifecycleStatus.HARVESTED:
            transplant_date = seed_date + timedelta(days=random.randint(12, 15))
            harvest_date = transplant_date + timedelta(days=random.randint(20, 25))
        
        # Generate a random crop ID
        crop_id = f"crop-div-{len(crops) + 1}"
        
        # Basic crop properties
        crop_data = {
            "id": crop_id,
            "seed_type_id": seed_type.id,
            "seed_date": seed_date,
            "transplanting_date_planned": seed_date + timedelta(days=14),
            "harvesting_date_planned": seed_date + timedelta(days=35),
            "transplanted_date": transplant_date,
            "harvesting_date": harvest_date,
            "lifecycle_status": status,
            "health_check": random.choice([
                CropHealthCheck.HEALTHY, 
                CropHealthCheck.HEALTHY, 
                CropHealthCheck.HEALTHY,  # Weighted to be mostly healthy
                CropHealthCheck.TREATMENT_REQUIRED, 
                CropHealthCheck.TO_BE_DISPOSED
            ]),
            "current_location_type": location_type,
            "area": random.uniform(10, 25),
        }
        
        # Add location-specific properties
        if location_type == CropLocationType.TRAY_LOCATION and tray:
            crop_data["tray_id"] = tray.id
            crop_data["tray_row"] = random.randint(1, 5)
            crop_data["tray_column"] = random.randint(1, 10)
        elif location_type == CropLocationType.PANEL_LOCATION and panel:
            crop_data["panel_id"] = panel.id
            crop_data["panel_channel"] = random.randint(1, 8)
            crop_data["panel_position"] = random.uniform(1, 10)
        
        # Add weight for harvested crops
        if status == CropLifecycleStatus.HARVESTED:
            crop_data["weight"] = random.uniform(0.5, 3.0)
        
        return Crop(**crop_data)
    
    # Create crops across different lifecycle stages for each seed type
    for seed_type in seed_types:
        # Create 2-4 SEEDED crops in trays
        for _ in range(random.randint(2, 4)):
            seed_date = now - timedelta(days=random.randint(1, 10))
            tray = random.choice(trays)
            crop = create_crop(
                seed_type=seed_type,
                status=CropLifecycleStatus.SEEDED,
                seed_date=seed_date,
                location_type=CropLocationType.TRAY_LOCATION,
                tray=tray
            )
            crops.append(crop)
        
        # Create 2-4 TRANSPLANTED crops in panels
        for _ in range(random.randint(2, 4)):
            seed_date = now - timedelta(days=random.randint(15, 25))
            panel = random.choice(panels)
            crop = create_crop(
                seed_type=seed_type,
                status=CropLifecycleStatus.TRANSPLANTED,
                seed_date=seed_date,
                location_type=CropLocationType.PANEL_LOCATION,
                panel=panel
            )
            crops.append(crop)
        
        # Create 1-3 HARVESTED crops (still in panels)
        for _ in range(random.randint(1, 3)):
            seed_date = now - timedelta(days=random.randint(35, 45))
            panel = random.choice(panels)
            crop = create_crop(
                seed_type=seed_type,
                status=CropLifecycleStatus.HARVESTED,
                seed_date=seed_date,
                location_type=CropLocationType.PANEL_LOCATION,
                panel=panel
            )
            crops.append(crop)
    
    # Add overdue crops for each seed type
    for i, seed_type in enumerate(seed_types):
        # Overdue for transplanting
        overdue_crop1 = Crop(
            id=f"crop-div-overdue-{i*2+1}",
            seed_type_id=seed_type.id,
            seed_date=now - timedelta(days=20),
            transplanting_date_planned=now - timedelta(days=5),
            harvesting_date_planned=now + timedelta(days=15),
            lifecycle_status=CropLifecycleStatus.SEEDED,
            health_check=CropHealthCheck.HEALTHY,
            current_location_type=CropLocationType.TRAY_LOCATION,
            tray_id=trays[i % len(trays)].id,
            tray_row=random.randint(1, 5),
            tray_column=random.randint(1, 10),
            area=random.uniform(10, 20)
        )
        crops.append(overdue_crop1)
        
        # Overdue for harvesting
        overdue_crop2 = Crop(
            id=f"crop-div-overdue-{i*2+2}",
            seed_type_id=seed_type.id,
            seed_date=now - timedelta(days=45),
            transplanting_date_planned=now - timedelta(days=30),
            harvesting_date_planned=now - timedelta(days=5),
            transplanted_date=now - timedelta(days=31),
            lifecycle_status=CropLifecycleStatus.TRANSPLANTED,
            health_check=random.choice([CropHealthCheck.HEALTHY, CropHealthCheck.TREATMENT_REQUIRED]),
            current_location_type=CropLocationType.PANEL_LOCATION,
            panel_id=panels[i % len(panels)].id,
            panel_channel=random.randint(1, 8),
            panel_position=random.uniform(1, 10),
            area=random.uniform(15, 25)
        )
        crops.append(overdue_crop2)
    
    db.add_all(crops)
    db.commit()
    
    # Create crop history
    for crop in crops:
        # Seed history
        seed_history = CropHistoryEntry(
            crop_id=crop.id,
            timestamp=crop.seed_date,
            event="Crop seeded",
            performed_by=random.choice(["Emily Chen", "John Wilson", "Maria Rodriguez", "Sanjay Patel"]),
            notes=f"Initial seeding of {crop.seed_type_ref.name}"
        )
        db.add(seed_history)
        
        # Transplant history if applicable
        if crop.transplanted_date:
            transplant_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=crop.transplanted_date,
                event="Crop transplanted",
                performed_by=random.choice(["Emily Chen", "John Wilson", "Maria Rodriguez", "Sanjay Patel"]),
                notes=f"Transplanted from nursery to cultivation area"
            )
            db.add(transplant_history)
        
        # Harvest history if applicable
        if crop.harvesting_date:
            harvest_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=crop.harvesting_date,
                event="Crop harvested",
                performed_by=random.choice(["Maintenance Team", "Harvest Crew", "Production Team"]),
                notes=f"Harvested with weight: {crop.weight:.2f}kg"
            )
            db.add(harvest_history)
        
        # Add health check entries for crops with issues
        if crop.health_check != CropHealthCheck.HEALTHY:
            health_check_date = now - timedelta(days=random.randint(1, 5))
            health_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=health_check_date,
                event="Health inspection",
                performed_by="Health Inspector",
                notes=f"Health status set to {crop.health_check.value}"
            )
            db.add(health_history)
    
    db.commit()
    
    # Create activity logs
    activities = [
        ActivityLog(
            container_id=container.id,
            timestamp=now - timedelta(days=1, hours=3),
            action_type="SEEDED",
            actor_type=ActorType.USER,
            actor_id="user-maria",
            description="Seeded Green Oak in Nursery"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=now - timedelta(days=2, hours=5),
            action_type="ENVIRONMENT_CHANGED",
            actor_type=ActorType.USER,
            actor_id="admin-john",
            description="Adjusted light cycle for herbs"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=now - timedelta(days=3, hours=8),
            action_type="HARVESTED",
            actor_type=ActorType.USER,
            actor_id="user-harvest-team",
            description="Harvested Romaine batch"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=now - timedelta(days=5),
            action_type="TRANSPLANTED",
            actor_type=ActorType.USER,
            actor_id="user-sanjay",
            description="Transplanted Basil Genovese to cultivation panels"
        ),
        ActivityLog(
            container_id=container.id,
            timestamp=now - timedelta(days=10),
            action_type="MAINTENANCE",
            actor_type=ActorType.USER,
            actor_id="maintenance-team",
            description="Scheduled maintenance performed"
        )
    ]
    
    db.add_all(activities)
    db.commit()
    
    print(f"Created additional container with id: {container.id}")
    print(f"Created {len(crops)} crops with {len(seed_types)} seed types")
    print(f"Created {len(trays)} trays and {len(panels)} panels")


if __name__ == "__main__":
    # This allows running this script directly for testing
    from app.database.database import SessionLocal
    db = SessionLocal()
    try:
        create_container_details_samples(db)
        create_additional_container_crop_samples(db)
    finally:
        db.close()