import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.models import Container, Tenant, Alert, SeedType
from app.models.enums import ContainerType, ContainerPurpose, ContainerStatus, AlertSeverity, AlertRelatedObjectType
from app.database.container_details_samples import create_container_details_samples

def update_sample_data():
    """
    Update the database with the specified container data.
    """
    db = SessionLocal()
    
    try:
        # Clear existing alerts and containers
        db.query(Alert).delete()
        db.query(Container).delete()
        
        # Clear seed types
        db.query(SeedType).delete()
        db.commit()
        
        # Clear tenants
        db.query(Tenant).delete()
        db.commit()
        
        # Create tenants with specified IDs and names
        tenants = [
            Tenant(
                id="tenant-001",
                name="Skybridge Farms"
            ),
            Tenant(
                id="tenant-002",
                name="EcoGrow Solutions"
            ),
            Tenant(
                id="tenant-003",
                name="UrbanLeaf Inc."
            ),
            Tenant(
                id="tenant-004",
                name="AgroTech Research"
            ),
            Tenant(
                id="tenant-005",
                name="FarmFusion Labs"
            )
        ]
        
        # Add tenants to database
        db.add_all(tenants)
        db.commit()
        
        # Get tenants for container creation
        skybridge = db.query(Tenant).filter(Tenant.name == "Skybridge Farms").first()
        ecogrow = db.query(Tenant).filter(Tenant.name == "EcoGrow Solutions").first()
        urbanleaf = db.query(Tenant).filter(Tenant.name == "UrbanLeaf Inc.").first()
        
        # Create seed types
        seed_types = [
            SeedType(
                id="seed-001",
                name="Someroots",
                variety="Standard",
                supplier="BioCrop"
            ),
            SeedType(
                id="seed-002",
                name="Sunflower",
                variety="Giant",
                supplier="SeedPro"
            ),
            SeedType(
                id="seed-003",
                name="Basil",
                variety="Sweet",
                supplier="HerbGarden"
            ),
            SeedType(
                id="seed-004",
                name="Lettuce",
                variety="Romaine",
                supplier="GreenLeaf"
            ),
            SeedType(
                id="seed-005",
                name="Kale",
                variety="Curly",
                supplier="Nutrifoods"
            ),
            SeedType(
                id="seed-006",
                name="Spinach",
                variety="Baby",
                supplier="GreenLeaf"
            ),
            SeedType(
                id="seed-007",
                name="Arugula",
                variety="Wild",
                supplier="HerbGarden"
            ),
            SeedType(
                id="seed-008",
                name="Microgreens",
                variety="Mixed",
                supplier="SproutLife"
            )
        ]
        
        # Add seed types to database
        db.add_all(seed_types)
        db.commit()
            
        db.commit()
        
        # Create containers based on the specified data
        containers = [
            Container(
                id="1",
                name="virtual-farm-04",
                type=ContainerType.VIRTUAL,
                tenant_id=skybridge.id,
                purpose=ContainerPurpose.DEVELOPMENT,
                location_city="Agriville",
                location_country="USA",
                status=ContainerStatus.ACTIVE,
                created_at=datetime.strptime("30/01/2025", "%d/%m/%Y"),
                updated_at=datetime.strptime("30/01/2025", "%d/%m/%Y")
            ),
            Container(
                id="2",
                name="virtual-farm-03",
                type=ContainerType.VIRTUAL,
                tenant_id=ecogrow.id,
                purpose=ContainerPurpose.RESEARCH,
                location_city="Farmington",
                location_country="USA",
                status=ContainerStatus.MAINTENANCE,
                created_at=datetime.strptime("30/01/2025", "%d/%m/%Y"),
                updated_at=datetime.strptime("30/01/2025", "%d/%m/%Y")
            ),
            Container(
                id="3",
                name="farm-container-04",
                type=ContainerType.PHYSICAL,
                tenant_id=ecogrow.id,
                purpose=ContainerPurpose.RESEARCH,
                location_city="Techville",
                location_country="Canada",
                status=ContainerStatus.CREATED,
                created_at=datetime.strptime("25/01/2025", "%d/%m/%Y"),
                updated_at=datetime.strptime("26/01/2025", "%d/%m/%Y")
            ),
            Container(
                id="4",
                name="farm-container-07",
                type=ContainerType.PHYSICAL,
                tenant_id=skybridge.id,
                purpose=ContainerPurpose.DEVELOPMENT,
                location_city="Agriville",
                location_country="USA",
                status=ContainerStatus.ACTIVE,
                created_at=datetime.strptime("25/01/2025", "%d/%m/%Y"),
                updated_at=datetime.strptime("26/01/2025", "%d/%m/%Y")
            ),
            Container(
                id="5",
                name="virtual-farm-02",
                type=ContainerType.VIRTUAL,
                tenant_id=skybridge.id,
                purpose=ContainerPurpose.DEVELOPMENT,
                location_city="Croptown",
                location_country="USA",
                status=ContainerStatus.INACTIVE,
                created_at=datetime.strptime("13/01/2025", "%d/%m/%Y"),
                updated_at=datetime.strptime("15/01/2025", "%d/%m/%Y")
            ),
            Container(
                id="6",
                name="farm-container-06",
                type=ContainerType.PHYSICAL,
                tenant_id=urbanleaf.id,
                purpose=ContainerPurpose.RESEARCH,
                location_city="Scienceville",
                location_country="Germany",
                status=ContainerStatus.ACTIVE,
                created_at=datetime.strptime("12/01/2025", "%d/%m/%Y"),
                updated_at=datetime.strptime("18/01/2025", "%d/%m/%Y")
            )
        ]
        
        # Add containers to database
        db.add_all(containers)
        db.commit()
        
        # Add alerts for each container
        alerts = [
            Alert(
                id=str(uuid.uuid4()),
                container_id="1",
                description="Temperature warning",
                severity=AlertSeverity.MEDIUM,
                created_at=datetime.utcnow(),
                active=True,
                related_object_type=AlertRelatedObjectType.ENVIRONMENT
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id="2",
                description="Maintenance required",
                severity=AlertSeverity.HIGH,
                created_at=datetime.utcnow(),
                active=True,
                related_object_type=AlertRelatedObjectType.CONTAINER
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id="3",
                description="Setup incomplete",
                severity=AlertSeverity.LOW,
                created_at=datetime.utcnow(),
                active=True,
                related_object_type=AlertRelatedObjectType.CONTAINER
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id="4",
                description="Network connectivity issue",
                severity=AlertSeverity.MEDIUM,
                created_at=datetime.utcnow(),
                active=True,
                related_object_type=AlertRelatedObjectType.DEVICE
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id="5",
                description="System offline",
                severity=AlertSeverity.CRITICAL,
                created_at=datetime.utcnow(),
                active=True,
                related_object_type=AlertRelatedObjectType.CONTAINER
            ),
            Alert(
                id=str(uuid.uuid4()),
                container_id="6",
                description="Humidity levels abnormal",
                severity=AlertSeverity.MEDIUM,
                created_at=datetime.utcnow(),
                active=True,
                related_object_type=AlertRelatedObjectType.ENVIRONMENT
            )
        ]
        
        # Add alerts to database
        db.add_all(alerts)
        db.commit()
        
        print("Sample data updated successfully with specified containers and alerts!")
        
        # Add container details sample data
        create_container_details_samples(db)
        print("Container details sample data added successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error updating sample data: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    update_sample_data()