#!/usr/bin/env python
"""
Script to fill all containers with crop data.
This script will add trays, panels, seed types, crops, and crop history entries
to all containers that don't already have them.
"""
from datetime import datetime, timedelta
import random
import uuid

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.models import (
    Container, Tenant, SeedType, Crop, Tray, Panel, CropHistoryEntry
)
from app.models.enums import (
    ContainerType, ContainerStatus, CropLifecycleStatus, CropHealthCheck, CropLocationType,
    ShelfPosition, WallPosition, InventoryStatus
)


# Define seed type varieties to use
SEED_VARIETIES = [
    {"name": "Romaine", "variety": "Lettuce"},
    {"name": "Green Oak", "variety": "Lettuce"},
    {"name": "Red Oak", "variety": "Lettuce"},
    {"name": "Basil Genovese", "variety": "Herb"},
    {"name": "Cilantro", "variety": "Herb"},
    {"name": "Arugula", "variety": "Greens"},
    {"name": "Mizuna", "variety": "Greens"},
    {"name": "Mustard Greens", "variety": "Greens"},
    {"name": "Kale", "variety": "Greens"},
    {"name": "Swiss Chard", "variety": "Greens"},
    {"name": "Spinach", "variety": "Greens"},
    {"name": "Thai Basil", "variety": "Herb"},
    {"name": "Butterhead", "variety": "Lettuce"},
    {"name": "Lollo Rossa", "variety": "Lettuce"},
    {"name": "Bok Choy", "variety": "Asian Greens"}
]

# People names for the "performed_by" field
PEOPLE_NAMES = [
    "Emily Chen", "Marcus Johnson", "Jessica Rodriguez", "David Kim",
    "Sarah Ahmed", "Miguel Gonzalez", "Aisha Patel", "John Smith", 
    "Maria Lopez", "Daniel Thompson", "Ava Williams", "Noah Martinez"
]

# Teams for "performed_by" field
TEAMS = [
    "Harvest Team", "Maintenance Team", "Production Team", "Farm Operations",
    "Quality Control", "Research Team", "Crop Management"
]


def generate_name(prefix: str, container_id: str) -> str:
    """Generate a unique name with the given prefix and a short hash of the container ID."""
    short_id = container_id[:4] if isinstance(container_id, str) else str(container_id)
    return f"{prefix}-{short_id}-{random.randint(1000, 9999)}"


def add_crops_to_container(db: Session, container_id: str, min_crops: int = 30, max_crops: int = 100) -> None:
    """Add crop data to a container.
    
    Args:
        db: Database session
        container_id: ID of the container to add crops to
        min_crops: Minimum number of crops to add
        max_crops: Maximum number of crops to add
    """
    print(f"Adding crops to container {container_id}")
    
    # Get container
    container = db.query(Container).filter(Container.id == container_id).first()
    if not container:
        print(f"Container {container_id} not found")
        return
    
    # Check if container already has trays and panels
    existing_trays = db.query(Tray).filter(Tray.container_id == container_id).all()
    existing_panels = db.query(Panel).filter(Panel.container_id == container_id).all()
    
    # Only add trays and panels if needed
    trays = existing_trays
    panels = existing_panels
    
    if not existing_trays:
        # Create trays
        num_trays = random.randint(4, 8) if container.type == ContainerType.PHYSICAL else random.randint(1, 3)
        trays = []
        for i in range(1, num_trays + 1):
            tray_id = f"tray-{container_id}-{i}" if isinstance(container_id, str) else f"tray-{container_id:02d}-{i}"
            tray = Tray(
                id=tray_id,
                container_id=container_id,
                rfid_tag=f"RFID-{uuid.uuid4().hex[:8].upper()}",
                shelf=random.choice(list(ShelfPosition)),
                slot_number=i,
                utilization_percentage=random.randint(40, 95),
                provisioned_at=datetime.now() - timedelta(days=random.randint(30, 90)),
                status=InventoryStatus.IN_USE,
                capacity=200,
                tray_type="Standard"
            )
            trays.append(tray)
        
        db.add_all(trays)
        db.commit()
        print(f"Created {len(trays)} new trays")
    
    if not existing_panels:
        # Create panels
        num_panels = random.randint(2, 6) if container.type == ContainerType.PHYSICAL else random.randint(1, 2)
        panels = []
        for i in range(1, num_panels + 1):
            panel_id = f"panel-{container_id}-{i}" if isinstance(container_id, str) else f"panel-{container_id:02d}-{i}"
            panel = Panel(
                id=panel_id,
                container_id=container_id,
                rfid_tag=f"RFID-P-{uuid.uuid4().hex[:8].upper()}",
                wall=random.choice(list(WallPosition)),
                slot_number=i,
                utilization_percentage=random.randint(60, 95),
                provisioned_at=datetime.now() - timedelta(days=random.randint(30, 90)),
                status=InventoryStatus.IN_USE,
                capacity=60,
                panel_type="Standard"
            )
            panels.append(panel)
            
        db.add_all(panels)
        db.commit()
        print(f"Created {len(panels)} new panels")

    # Get all seed types or create if none exist
    seed_types = db.query(SeedType).all()
    
    if len(seed_types) < 5:
        # Create seed types
        new_seed_types = []
        for variety in SEED_VARIETIES:
            seed_id = f"seed-{container_id}-{len(new_seed_types) + 1}" if isinstance(container_id, str) else f"seed-{container_id:02d}-{len(new_seed_types) + 1}"
            seed_type = SeedType(
                id=seed_id,
                name=variety["name"],
                variety=variety["variety"],
                supplier=random.choice(["SeedCorp", "GreenSeeds", "FarmTech", "OrganicSprouts"]),
                batch_id=f"BATCH-{uuid.uuid4().hex[:6].upper()}"
            )
            new_seed_types.append(seed_type)
            
        db.add_all(new_seed_types)
        db.commit()
        
        # Link seed types to container
        for st in new_seed_types:
            container.seed_types.append(st)
        db.commit()
        
        print(f"Created {len(new_seed_types)} new seed types")
        seed_types.extend(new_seed_types)
    
    # Make sure container has at least some seed types
    container_seed_types = container.seed_types
    
    if not container_seed_types:
        # Add 3-6 random seed types to this container
        selected_seed_types = random.sample(seed_types, min(random.randint(3, 6), len(seed_types)))
        for st in selected_seed_types:
            container.seed_types.append(st)
        db.commit()
        container_seed_types = selected_seed_types
        print(f"Added {len(selected_seed_types)} seed types to container")
    
    # Set up cut-off dates for different lifecycle statuses
    now = datetime.now()
    
    # Create crops for each seed type
    all_crops = []
    
    # Helper function to create a crop
    def create_crop(seed_type, status, seed_date, location_type, tray=None, panel=None):
        transplant_date = None
        harvest_date = None
        
        if status == CropLifecycleStatus.TRANSPLANTED:
            transplant_date = seed_date + timedelta(days=random.randint(12, 15))
        elif status == CropLifecycleStatus.HARVESTED:
            transplant_date = seed_date + timedelta(days=random.randint(12, 15))
            harvest_date = transplant_date + timedelta(days=random.randint(20, 25))
        
        # Generate a unique crop ID
        if isinstance(container_id, str):
            crop_id = f"crop-{container_id[:4]}-{len(all_crops) + 1}"
        else:
            crop_id = f"crop-{container_id:02d}-{len(all_crops) + 1}"
        
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
        
        # Add physical properties
        if status == CropLifecycleStatus.SEEDED:
            crop_data["radius"] = random.uniform(0.5, 2.0)
            crop_data["width"] = random.uniform(1.0, 3.0)
            crop_data["height"] = random.uniform(0.5, 1.5)
        elif status == CropLifecycleStatus.TRANSPLANTED:
            crop_data["radius"] = random.uniform(2.0, 5.0)
            crop_data["width"] = random.uniform(4.0, 8.0)
            crop_data["height"] = random.uniform(2.0, 5.0)
        elif status == CropLifecycleStatus.HARVESTED:
            crop_data["radius"] = random.uniform(5.0, 10.0)
            crop_data["width"] = random.uniform(8.0, 15.0)
            crop_data["height"] = random.uniform(5.0, 10.0)
            crop_data["weight"] = random.uniform(0.5, 3.0)
        
        return Crop(**crop_data)
    
    # Determine how many crops to create
    num_crops = random.randint(min_crops, max_crops)
    if container.type == ContainerType.VIRTUAL:
        # Virtual containers have fewer crops
        num_crops = max(10, num_crops // 2)
    
    # Create a distribution of crops across lifecycle statuses
    target_distribution = {
        CropLifecycleStatus.SEEDED: 0.4,       # 40% seeded
        CropLifecycleStatus.TRANSPLANTED: 0.4, # 40% transplanted
        CropLifecycleStatus.HARVESTED: 0.2     # 20% harvested
    }
    
    # Calculate target counts
    target_counts = {
        status: int(num_crops * percentage)
        for status, percentage in target_distribution.items()
    }
    
    # Adjust to make sure we reach the exact total
    remainder = num_crops - sum(target_counts.values())
    if remainder > 0:
        target_counts[CropLifecycleStatus.SEEDED] += remainder
    
    # Create crops for each seed type
    for seed_type in container_seed_types:
        # Calculate how many crops of this seed type
        seed_type_count = num_crops // len(container_seed_types)
        if seed_type == container_seed_types[-1]:
            # Make sure we hit our target
            seed_type_count = num_crops - len(all_crops)
        
        # Scale down the target distribution for this seed type
        seed_type_targets = {
            status: max(1, int(seed_type_count * percentage))
            for status, percentage in target_distribution.items()
        }
        
        # Create crops in trays (SEEDED)
        seeded_count = seed_type_targets[CropLifecycleStatus.SEEDED]
        for _ in range(seeded_count):
            if not trays:  # Safety check
                continue
                
            tray = random.choice(trays)
            seed_date = now - timedelta(days=random.randint(1, 14))
            
            crop = create_crop(
                seed_type=seed_type,
                status=CropLifecycleStatus.SEEDED,
                seed_date=seed_date,
                location_type=CropLocationType.TRAY_LOCATION,
                tray=tray
            )
            all_crops.append(crop)
        
        # Create crops in panels (TRANSPLANTED)
        transplanted_count = seed_type_targets[CropLifecycleStatus.TRANSPLANTED]
        for _ in range(transplanted_count):
            if not panels:  # Safety check
                continue
                
            panel = random.choice(panels)
            seed_date = now - timedelta(days=random.randint(15, 30))
            
            crop = create_crop(
                seed_type=seed_type,
                status=CropLifecycleStatus.TRANSPLANTED,
                seed_date=seed_date,
                location_type=CropLocationType.PANEL_LOCATION,
                panel=panel
            )
            all_crops.append(crop)
        
        # Create HARVESTED crops
        harvested_count = seed_type_targets[CropLifecycleStatus.HARVESTED]
        for _ in range(harvested_count):
            if not panels:  # Safety check
                continue
                
            panel = random.choice(panels)
            seed_date = now - timedelta(days=random.randint(35, 50))
            
            crop = create_crop(
                seed_type=seed_type,
                status=CropLifecycleStatus.HARVESTED,
                seed_date=seed_date,
                location_type=CropLocationType.PANEL_LOCATION,
                panel=panel
            )
            all_crops.append(crop)
    
    # Add overdue crops for some extra data variety
    for i, seed_type in enumerate(container_seed_types[:2]):  # Only add overdue for first couple seed types
        # Overdue for transplanting
        if trays:
            overdue_crop1 = Crop(
                id=f"crop-{container_id}-overdue-{i*2+1}" if isinstance(container_id, str) else f"crop-{container_id:02d}-overdue-{i*2+1}",
                seed_type_id=seed_type.id,
                seed_date=now - timedelta(days=20),
                transplanting_date_planned=now - timedelta(days=5),
                harvesting_date_planned=now + timedelta(days=15),
                lifecycle_status=CropLifecycleStatus.SEEDED,
                health_check=random.choice([CropHealthCheck.HEALTHY, CropHealthCheck.TREATMENT_REQUIRED]),
                current_location_type=CropLocationType.TRAY_LOCATION,
                tray_id=random.choice(trays).id if trays else None,
                tray_row=random.randint(1, 5),
                tray_column=random.randint(1, 10),
                area=random.uniform(10, 20),
                radius=random.uniform(0.5, 2.0),
                width=random.uniform(1.0, 3.0),
                height=random.uniform(0.5, 1.5),
            )
            all_crops.append(overdue_crop1)
        
        # Overdue for harvesting
        if panels:
            overdue_crop2 = Crop(
                id=f"crop-{container_id}-overdue-{i*2+2}" if isinstance(container_id, str) else f"crop-{container_id:02d}-overdue-{i*2+2}",
                seed_type_id=seed_type.id,
                seed_date=now - timedelta(days=45),
                transplanting_date_planned=now - timedelta(days=30),
                harvesting_date_planned=now - timedelta(days=5),
                transplanted_date=now - timedelta(days=31),
                lifecycle_status=CropLifecycleStatus.TRANSPLANTED,
                health_check=random.choice([CropHealthCheck.HEALTHY, CropHealthCheck.TREATMENT_REQUIRED]),
                current_location_type=CropLocationType.PANEL_LOCATION,
                panel_id=random.choice(panels).id if panels else None,
                panel_channel=random.randint(1, 8),
                panel_position=random.uniform(1, 10),
                area=random.uniform(15, 25),
                radius=random.uniform(2.0, 5.0),
                width=random.uniform(4.0, 8.0),
                height=random.uniform(2.0, 5.0),
            )
            all_crops.append(overdue_crop2)
    
    # Save crops
    db.add_all(all_crops)
    db.commit()
    print(f"Created {len(all_crops)} crops")
    
    # Create crop history entries
    history_entries = []
    
    for crop in all_crops:
        # Seed history
        seed_history = CropHistoryEntry(
            crop_id=crop.id,
            timestamp=crop.seed_date,
            event="Crop seeded",
            performed_by=random.choice(PEOPLE_NAMES),
            notes=f"Initial seeding of {crop.seed_type_ref.name}"
        )
        history_entries.append(seed_history)
        
        # Transplant history if applicable
        if crop.transplanted_date:
            transplant_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=crop.transplanted_date,
                event="Crop transplanted",
                performed_by=random.choice(PEOPLE_NAMES),
                notes=f"Transplanted from nursery to cultivation area"
            )
            history_entries.append(transplant_history)
        
        # Harvest history if applicable
        if crop.harvesting_date:
            harvest_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=crop.harvesting_date,
                event="Crop harvested",
                performed_by=random.choice(TEAMS),
                notes=f"Harvested with weight: {crop.weight:.2f}kg"
            )
            history_entries.append(harvest_history)
        
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
            history_entries.append(health_history)
            
        # Add some random check entries
        if random.random() > 0.7:
            check_date = crop.seed_date + timedelta(days=random.randint(3, 10))
            crop_history = CropHistoryEntry(
                crop_id=crop.id,
                timestamp=check_date,
                event="Health check performed",
                performed_by=random.choice(PEOPLE_NAMES),
                notes="Regular health inspection"
            )
            history_entries.append(crop_history)
    
    db.add_all(history_entries)
    db.commit()
    print(f"Created {len(history_entries)} crop history entries")


def fill_all_containers():
    """Add crop data to all containers that don't already have crops."""
    db = SessionLocal()
    
    try:
        # Get all containers
        containers = db.query(Container).all()
        print(f"Found {len(containers)} containers")
        
        for container in containers:
            # Check if container already has enough crops
            tray_ids = [tray.id for tray in container.trays]
            panel_ids = [panel.id for panel in container.panels]
            
            crop_count = 0
            if tray_ids or panel_ids:
                crop_count = db.query(Crop).filter(
                    (Crop.tray_id.in_(tray_ids) if tray_ids else False) | 
                    (Crop.panel_id.in_(panel_ids) if panel_ids else False)
                ).count()
            
            if crop_count < 20:  # If container has fewer than 20 crops
                print(f"Container {container.name} (ID: {container.id}) has only {crop_count} crops, adding more")
                add_crops_to_container(db, container.id)
            else:
                print(f"Container {container.name} (ID: {container.id}) already has {crop_count} crops, skipping")
    
    finally:
        db.close()


if __name__ == "__main__":
    fill_all_containers()