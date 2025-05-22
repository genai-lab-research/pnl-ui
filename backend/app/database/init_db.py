import uuid
from datetime import datetime, timedelta
import random

from sqlalchemy.orm import Session

from app.database.database import Base, engine, SessionLocal
from app.models.models import (
    Container, Tenant, SeedType, Alert, Device, Tray, Panel, 
    Crop, CropHistoryEntry, ActivityLog, MetricSnapshot
)
from app.models.enums import (
    ContainerType, ContainerPurpose, ContainerStatus, AlertSeverity,
    DeviceStatus, ShelfPosition, WallPosition, CropLifecycleStatus,
    CropHealthCheck, InventoryStatus, ActorType
)

# Import the container details sample data functions
from app.database.container_details_samples import create_container_details_samples, create_additional_container_crop_samples


def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)


def populate_sample_data():
    """
    Populate the database with sample data for development purposes.
    Only runs if the database is empty.
    """
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Tenant).first():
        db.close()
        return
    
    try:
        # Create tenants
        tenants = [
            Tenant(id=str(uuid.uuid4()), name="AgroTech Inc."),
            Tenant(id=str(uuid.uuid4()), name="FarmFuture Research"),
            Tenant(id=str(uuid.uuid4()), name="GreenHarvest Solutions"),
        ]
        db.add_all(tenants)
        db.commit()
        
        # Create seed types
        seed_types = [
            SeedType(id=str(uuid.uuid4()), name="Basil", variety="Genovese", supplier="SeedCorp", batch_id="BC-2023-001"),
            SeedType(id=str(uuid.uuid4()), name="Lettuce", variety="Butterhead", supplier="GreenSeeds", batch_id="LS-2023-057"),
            SeedType(id=str(uuid.uuid4()), name="Kale", variety="Lacinato", supplier="SeedCorp", batch_id="KC-2023-089"),
            SeedType(id=str(uuid.uuid4()), name="Spinach", variety="Bloomsdale", supplier="GreenSeeds", batch_id="SP-2023-112"),
            SeedType(id=str(uuid.uuid4()), name="Arugula", variety="Wild Rocket", supplier="HerbMasters", batch_id="AR-2023-045")
        ]
        db.add_all(seed_types)
        db.commit()
        
        # Create containers
        containers = [
            Container(
                id=str(uuid.uuid4()),
                name="FC-001",
                type=ContainerType.PHYSICAL,
                tenant_id=tenants[0].id,
                purpose=ContainerPurpose.PRODUCTION,
                location_city="Seattle",
                location_country="USA",
                notes="Primary production container",
                shadow_service_enabled=True,
                ecosystem_connected=True,
                ecosystem_settings={
                    "fa_environment": "Prod",
                    "pya_environment": "Prod",
                    "aws_environment": "Prod"
                },
                status=ContainerStatus.ACTIVE,
                created_at=datetime.utcnow() - timedelta(days=90),
                updated_at=datetime.utcnow() - timedelta(days=5)
            ),
            Container(
                id=str(uuid.uuid4()),
                name="FC-002",
                type=ContainerType.PHYSICAL,
                tenant_id=tenants[0].id,
                purpose=ContainerPurpose.PRODUCTION,
                location_city="Portland",
                location_country="USA",
                notes="Secondary production container",
                shadow_service_enabled=True,
                ecosystem_connected=True,
                ecosystem_settings={
                    "fa_environment": "Prod",
                    "pya_environment": "Prod",
                    "aws_environment": "Prod"
                },
                status=ContainerStatus.MAINTENANCE,
                created_at=datetime.utcnow() - timedelta(days=85),
                updated_at=datetime.utcnow() - timedelta(days=2)
            ),
            Container(
                id=str(uuid.uuid4()),
                name="VC-TEST-01",
                type=ContainerType.VIRTUAL,
                tenant_id=tenants[1].id,
                purpose=ContainerPurpose.RESEARCH,
                notes="Research environment for new crop varieties",
                shadow_service_enabled=False,
                robotics_simulation_enabled=True,
                ecosystem_connected=True,
                ecosystem_settings={
                    "fa_environment": "Alpha",
                    "pya_environment": "Test",
                    "aws_environment": "Dev"
                },
                status=ContainerStatus.ACTIVE,
                created_at=datetime.utcnow() - timedelta(days=45),
                updated_at=datetime.utcnow() - timedelta(days=10)
            ),
            Container(
                id=str(uuid.uuid4()),
                name="VC-DEV-01",
                type=ContainerType.VIRTUAL,
                tenant_id=tenants[2].id,
                purpose=ContainerPurpose.DEVELOPMENT,
                notes="Development environment for testing new features",
                shadow_service_enabled=True,
                robotics_simulation_enabled=True,
                ecosystem_connected=True,
                ecosystem_settings={
                    "fa_environment": "Alpha",
                    "pya_environment": "Dev",
                    "aws_environment": "Dev"
                },
                status=ContainerStatus.ACTIVE,
                created_at=datetime.utcnow() - timedelta(days=30),
                updated_at=datetime.utcnow() - timedelta(days=1)
            )
        ]
        db.add_all(containers)
        db.commit()
        
        # Associate seed types with containers
        containers[0].seed_types = [seed_types[0], seed_types[1]]
        containers[1].seed_types = [seed_types[2], seed_types[3]]
        containers[2].seed_types = [seed_types[0], seed_types[2], seed_types[4]]
        containers[3].seed_types = [seed_types[1], seed_types[3]]
        db.commit()
        
        # Create alerts
        alerts = [
            Alert(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                description="Temperature exceeds normal range",
                severity=AlertSeverity.MEDIUM,
                created_at=datetime.utcnow() - timedelta(hours=5),
                active=True,
                related_object_type="Environment"
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id=containers[1].id,
                description="Maintenance required for irrigation system",
                severity=AlertSeverity.HIGH,
                created_at=datetime.utcnow() - timedelta(days=1, hours=12),
                active=True,
                related_object_type="Device",
                related_object_id="device-001"
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id=containers[2].id,
                description="Network connectivity issues",
                severity=AlertSeverity.LOW,
                created_at=datetime.utcnow() - timedelta(days=3),
                active=False,
                related_object_type="Container"
            )
        ]
        db.add_all(alerts)
        db.commit()
        
        # Create devices
        devices = [
            Device(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                name="Environmental Sensor A1",
                model="EnvPro-3000",
                serial_number="EP3K-12345",
                firmware_version="2.4.1",
                port="COM3",
                status=DeviceStatus.RUNNING,
                last_active_at=datetime.utcnow() - timedelta(minutes=5)
            ),
            Device(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                name="Irrigation Controller",
                model="AquaControl-X",
                serial_number="ACX-78901",
                firmware_version="1.9.3",
                port="COM4",
                status=DeviceStatus.RUNNING,
                last_active_at=datetime.utcnow() - timedelta(minutes=8)
            ),
            Device(
                id=str(uuid.uuid4()),
                container_id=containers[1].id,
                name="Environmental Sensor B1",
                model="EnvPro-3000",
                serial_number="EP3K-12346",
                firmware_version="2.4.1",
                port="COM3",
                status=DeviceStatus.ISSUE,
                last_active_at=datetime.utcnow() - timedelta(hours=3)
            ),
            Device(
                id=str(uuid.uuid4()),
                container_id=containers[1].id,
                name="Lighting Controller",
                model="LumenMaster-500",
                serial_number="LM5-23456",
                firmware_version="3.1.2",
                port="COM5",
                status=DeviceStatus.RUNNING,
                last_active_at=datetime.utcnow() - timedelta(minutes=15)
            ),
            Device(
                id=str(uuid.uuid4()),
                container_id=containers[2].id,
                name="Virtual Sensor Array",
                model="VSim-2000",
                serial_number="VS2K-34567",
                firmware_version="1.0.4",
                port="N/A",
                status=DeviceStatus.IDLE,
                last_active_at=datetime.utcnow() - timedelta(hours=1)
            )
        ]
        db.add_all(devices)
        db.commit()
        
        # Create trays and panels
        trays = [
            Tray(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                rfid_tag="AB12CD34EF56",
                shelf=ShelfPosition.UPPER,
                slot_number=1,
                utilization_percentage=75.0,
                provisioned_at=datetime.utcnow() - timedelta(days=60),
                status=InventoryStatus.IN_USE,
                capacity=200,
                tray_type="Standard"
            ),
            Tray(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                rfid_tag="GH78IJ90KL12",
                shelf=ShelfPosition.LOWER,
                slot_number=3,
                utilization_percentage=90.0,
                provisioned_at=datetime.utcnow() - timedelta(days=58),
                status=InventoryStatus.IN_USE,
                capacity=200,
                tray_type="Standard"
            ),
            Tray(
                id=str(uuid.uuid4()),
                container_id=containers[1].id,
                rfid_tag="MN34OP56QR78",
                shelf=ShelfPosition.UPPER,
                slot_number=2,
                utilization_percentage=60.0,
                provisioned_at=datetime.utcnow() - timedelta(days=45),
                status=InventoryStatus.IN_USE,
                capacity=200,
                tray_type="Standard"
            )
        ]
        db.add_all(trays)
        db.commit()
        
        panels = [
            Panel(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                rfid_tag="ST90UV12WX34",
                wall=WallPosition.WALL_1,
                slot_number=5,
                utilization_percentage=80.0,
                provisioned_at=datetime.utcnow() - timedelta(days=55),
                status=InventoryStatus.IN_USE,
                capacity=60,
                panel_type="Standard"
            ),
            Panel(
                id=str(uuid.uuid4()),
                container_id=containers[0].id,
                rfid_tag="YZ56AB78CD90",
                wall=WallPosition.WALL_2,
                slot_number=8,
                utilization_percentage=85.0,
                provisioned_at=datetime.utcnow() - timedelta(days=54),
                status=InventoryStatus.IN_USE,
                capacity=60,
                panel_type="Standard"
            ),
            Panel(
                id=str(uuid.uuid4()),
                container_id=containers[1].id,
                rfid_tag="EF12GH34IJ56",
                wall=WallPosition.WALL_1,
                slot_number=3,
                utilization_percentage=70.0,
                provisioned_at=datetime.utcnow() - timedelta(days=40),
                status=InventoryStatus.IN_USE,
                capacity=60,
                panel_type="Standard"
            )
        ]
        db.add_all(panels)
        db.commit()
        
        # Create crops
        # Tray crops
        tray_crops = []
        for i in range(150):
            seed_type = random.choice(seed_types)
            tray = random.choice(trays)
            seed_date = datetime.utcnow() - timedelta(days=random.randint(7, 30))
            
            # Randomly assign lifecycle status based on age
            age_days = (datetime.utcnow() - seed_date).days
            if age_days < 10:
                lifecycle_status = CropLifecycleStatus.SEEDED
                health_status = CropHealthCheck.HEALTHY if random.random() > 0.1 else CropHealthCheck.TREATMENT_REQUIRED
            elif age_days < 20:
                lifecycle_status = CropLifecycleStatus.TRANSPLANTED if random.random() > 0.3 else CropLifecycleStatus.SEEDED
                health_status = CropHealthCheck.HEALTHY if random.random() > 0.15 else CropHealthCheck.TREATMENT_REQUIRED
            else:
                lifecycle_status = random.choices([CropLifecycleStatus.TRANSPLANTED, CropLifecycleStatus.HARVESTED], weights=[0.6, 0.4])[0]
                health_status = CropHealthCheck.HEALTHY if random.random() > 0.2 else CropHealthCheck.TREATMENT_REQUIRED
            
            transplant_date = None
            if lifecycle_status in [CropLifecycleStatus.TRANSPLANTED, CropLifecycleStatus.HARVESTED]:
                transplant_date = seed_date + timedelta(days=random.randint(5, 10))
            
            harvest_date = None
            if lifecycle_status == CropLifecycleStatus.HARVESTED:
                harvest_date = transplant_date + timedelta(days=random.randint(10, 15))
            
            crop = Crop(
                id=str(uuid.uuid4()),
                seed_type_id=seed_type.id,
                seed_date=seed_date,
                transplanting_date_planned=seed_date + timedelta(days=10),
                harvesting_date_planned=seed_date + timedelta(days=25),
                transplanted_date=transplant_date,
                harvesting_date=harvest_date,
                lifecycle_status=lifecycle_status,
                health_check=health_status,
                current_location_type=CropLocationType.TRAY_LOCATION,
                tray_id=tray.id,
                tray_row=random.randint(1, 10),
                tray_column=random.randint(1, 20),
                radius=random.uniform(2.0, 5.0),
                area=random.uniform(10.0, 80.0),
                weight=random.uniform(5.0, 50.0) if lifecycle_status == CropLifecycleStatus.HARVESTED else None
            )
            tray_crops.append(crop)
        
        # Panel crops
        panel_crops = []
        for i in range(120):
            seed_type = random.choice(seed_types)
            panel = random.choice(panels)
            seed_date = datetime.utcnow() - timedelta(days=random.randint(15, 45))
            
            # For panel crops, most should be transplanted
            transplant_date = seed_date + timedelta(days=random.randint(5, 10))
            
            # Randomly assign lifecycle status with bias toward transplanted for panel crops
            if random.random() > 0.8:
                lifecycle_status = CropLifecycleStatus.HARVESTED
                harvest_date = transplant_date + timedelta(days=random.randint(10, 20))
            else:
                lifecycle_status = CropLifecycleStatus.TRANSPLANTED
                harvest_date = None
                
            health_status = CropHealthCheck.HEALTHY if random.random() > 0.15 else CropHealthCheck.TREATMENT_REQUIRED
            
            crop = Crop(
                id=str(uuid.uuid4()),
                seed_type_id=seed_type.id,
                seed_date=seed_date,
                transplanting_date_planned=seed_date + timedelta(days=10),
                harvesting_date_planned=seed_date + timedelta(days=30),
                transplanted_date=transplant_date,
                harvesting_date=harvest_date,
                lifecycle_status=lifecycle_status,
                health_check=health_status,
                current_location_type=CropLocationType.PANEL_LOCATION,
                panel_id=panel.id,
                panel_channel=random.randint(1, 5),
                panel_position=random.uniform(0.0, 100.0),
                radius=random.uniform(5.0, 15.0),
                area=random.uniform(50.0, 200.0),
                weight=random.uniform(50.0, 200.0) if lifecycle_status == CropLifecycleStatus.HARVESTED else None
            )
            panel_crops.append(crop)
        
        db.add_all(tray_crops)
        db.add_all(panel_crops)
        db.commit()
        
        # Create crop history entries
        all_crops = tray_crops + panel_crops
        crop_history = []
        
        for crop in all_crops:
            # Initial seeding entry
            crop_history.append(
                CropHistoryEntry(
                    id=str(uuid.uuid4()),
                    crop_id=crop.id,
                    timestamp=crop.seed_date,
                    event="Crop seeded",
                    performed_by="System",
                    notes=f"Initial seeding of {crop.seed_type_ref.name}"
                )
            )
            
            # Transplanting entry if applicable
            if crop.transplanted_date:
                crop_history.append(
                    CropHistoryEntry(
                        id=str(uuid.uuid4()),
                        crop_id=crop.id,
                        timestamp=crop.transplanted_date,
                        event="Crop transplanted",
                        performed_by="System",
                        notes=f"Transplanted from nursery to cultivation area"
                    )
                )
            
            # Harvesting entry if applicable
            if crop.harvesting_date:
                crop_history.append(
                    CropHistoryEntry(
                        id=str(uuid.uuid4()),
                        crop_id=crop.id,
                        timestamp=crop.harvesting_date,
                        event="Crop harvested",
                        performed_by="System",
                        notes=f"Harvested with weight: {crop.weight}g"
                    )
                )
                
            # Add random health check entries
            if random.random() > 0.7:
                check_date = crop.seed_date + timedelta(days=random.randint(3, 10))
                crop_history.append(
                    CropHistoryEntry(
                        id=str(uuid.uuid4()),
                        crop_id=crop.id,
                        timestamp=check_date,
                        event="Health check performed",
                        performed_by="User",
                        notes="Regular health inspection"
                    )
                )
        
        db.add_all(crop_history)
        db.commit()
        
        # Create activity logs
        activity_logs = []
        for container in containers:
            # Container creation
            activity_logs.append(
                ActivityLog(
                    id=str(uuid.uuid4()),
                    container_id=container.id,
                    timestamp=container.created_at,
                    action_type="Container Created",
                    actor_type=ActorType.USER,
                    actor_id="admin",
                    description=f"Container {container.name} was created"
                )
            )
            
            # Random number of configuration changes
            for i in range(random.randint(2, 5)):
                change_date = container.created_at + timedelta(days=random.randint(1, 30))
                activity_logs.append(
                    ActivityLog(
                        id=str(uuid.uuid4()),
                        container_id=container.id,
                        timestamp=change_date,
                        action_type="Settings Updated",
                        actor_type=ActorType.USER,
                        actor_id="admin",
                        description=f"Container settings updated"
                    )
                )
                
            # Inventory additions
            if container.type == ContainerType.PHYSICAL:
                for i in range(random.randint(1, 3)):
                    addition_date = container.created_at + timedelta(days=random.randint(5, 20))
                    activity_logs.append(
                        ActivityLog(
                            id=str(uuid.uuid4()),
                            container_id=container.id,
                            timestamp=addition_date,
                            action_type="Inventory Added",
                            actor_type=ActorType.USER,
                            actor_id="operator",
                            description=f"New {'tray' if i % 2 == 0 else 'panel'} added to inventory"
                        )
                    )
            
            # System health checks
            for i in range(random.randint(3, 8)):
                check_date = container.created_at + timedelta(days=random.randint(1, 40))
                activity_logs.append(
                    ActivityLog(
                        id=str(uuid.uuid4()),
                        container_id=container.id,
                        timestamp=check_date,
                        action_type="System Health Check",
                        actor_type=ActorType.SYSTEM,
                        actor_id="system",
                        description=f"Routine system health check performed"
                    )
                )
                
            # Alert notifications
            for alert in alerts:
                if alert.container_id == container.id:
                    activity_logs.append(
                        ActivityLog(
                            id=str(uuid.uuid4()),
                            container_id=container.id,
                            timestamp=alert.created_at,
                            action_type="Alert Generated",
                            actor_type=ActorType.SYSTEM,
                            actor_id="monitoring",
                            description=f"Alert: {alert.description}"
                        )
                    )
        
        db.add_all(activity_logs)
        db.commit()
        
        # Create metric snapshots for the past 30 days
        current_time = datetime.utcnow()
        for container in containers:
            # Starting values
            temp_base = random.uniform(20.0, 25.0)
            humidity_base = random.uniform(60.0, 75.0)
            co2_base = random.uniform(800.0, 1000.0)
            yield_kg_base = 0
            space_util_base = random.uniform(50.0, 70.0)
            nursery_util_base = random.uniform(60.0, 80.0)
            cultivation_util_base = random.uniform(40.0, 70.0)
            
            # Daily change factors
            temp_change = random.uniform(-0.5, 0.5)
            humidity_change = random.uniform(-1.0, 1.0)
            co2_change = random.uniform(-10.0, 10.0)
            yield_kg_change = random.uniform(0.5, 2.0)
            space_util_change = random.uniform(-2.0, 3.0)
            nursery_util_change = random.uniform(-3.0, 4.0)
            cultivation_util_change = random.uniform(-3.0, 3.0)
            
            metrics = []
            for days_back in range(30, -1, -1):
                # Calculate values with some randomness
                day_factor = days_back / 30.0
                noise_factor = 0.2
                
                temp = temp_base + temp_change * (30 - days_back) + random.uniform(-noise_factor, noise_factor) * temp_base
                humidity = humidity_base + humidity_change * (30 - days_back) + random.uniform(-noise_factor, noise_factor) * humidity_base
                co2 = co2_base + co2_change * (30 - days_back) + random.uniform(-noise_factor, noise_factor) * co2_base
                
                # Cumulative yield increases over time
                yield_kg = yield_kg_base + yield_kg_change * (30 - days_back) + random.uniform(0, noise_factor) * yield_kg_base if yield_kg_base > 0 else yield_kg_change * (30 - days_back)
                
                # Space utilization fluctuates but trends upward
                space_util = min(100.0, max(0.0, space_util_base + space_util_change * (30 - days_back) + random.uniform(-noise_factor, noise_factor) * space_util_base))
                nursery_util = min(100.0, max(0.0, nursery_util_base + nursery_util_change * (30 - days_back) + random.uniform(-noise_factor, noise_factor) * nursery_util_base))
                cultivation_util = min(100.0, max(0.0, cultivation_util_base + cultivation_util_change * (30 - days_back) + random.uniform(-noise_factor, noise_factor) * cultivation_util_base))
                
                timestamp = current_time - timedelta(days=days_back)
                
                metrics.append(
                    MetricSnapshot(
                        id=str(uuid.uuid4()),
                        container_id=container.id,
                        timestamp=timestamp,
                        air_temperature=temp,
                        humidity=humidity,
                        co2=co2,
                        yield_kg=yield_kg,
                        space_utilization_percentage=space_util,
                        nursery_utilization_percentage=nursery_util,
                        cultivation_utilization_percentage=cultivation_util
                    )
                )
            
            db.add_all(metrics)
        
        db.commit()
        
        print("Standard sample data populated successfully!")
        
        # Add data specifically for the container details page
        create_container_details_samples(db)
        
        # Add data specifically for diverse crops by container
        create_additional_container_crop_samples(db)
        
        print("All sample data created successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error populating sample data: {e}")
    
    finally:
        db.close()