#!/usr/bin/env python
"""
Script to verify the database has the expected crops by container data
"""
from app.database.database import SessionLocal
from app.models.models import Container, Crop, SeedType, Tray, Panel

db = SessionLocal()

try:
    # Look for our specific container
    container = db.query(Container).filter(Container.id == "container-crops-demo").first()
    
    if container:
        print(f"Found container: {container.name} (ID: {container.id})")
        
        # Get trays and panels
        trays = db.query(Tray).filter(Tray.container_id == container.id).all()
        panels = db.query(Panel).filter(Panel.container_id == container.id).all()
        
        print(f"Trays: {len(trays)}")
        print(f"Panels: {len(panels)}")
        
        # Get tray and panel IDs
        tray_ids = [tray.id for tray in trays]
        panel_ids = [panel.id for panel in panels]
        
        # Count crops
        tray_crops = db.query(Crop).filter(Crop.tray_id.in_(tray_ids)).all()
        panel_crops = db.query(Crop).filter(Crop.panel_id.in_(panel_ids)).all()
        
        print(f"Crops in trays: {len(tray_crops)}")
        print(f"Crops in panels: {len(panel_crops)}")
        print(f"Total crops: {len(tray_crops) + len(panel_crops)}")
        
        # Count by lifecycle status
        from app.models.enums import CropLifecycleStatus
        
        seeded = db.query(Crop).filter(
            (Crop.tray_id.in_(tray_ids) | Crop.panel_id.in_(panel_ids)),
            Crop.lifecycle_status == CropLifecycleStatus.SEEDED
        ).count()
        
        transplanted = db.query(Crop).filter(
            (Crop.tray_id.in_(tray_ids) | Crop.panel_id.in_(panel_ids)),
            Crop.lifecycle_status == CropLifecycleStatus.TRANSPLANTED
        ).count()
        
        harvested = db.query(Crop).filter(
            (Crop.tray_id.in_(tray_ids) | Crop.panel_id.in_(panel_ids)),
            Crop.lifecycle_status == CropLifecycleStatus.HARVESTED
        ).count()
        
        print(f"\nCrops by lifecycle status:")
        print(f"- Seeded: {seeded}")
        print(f"- Transplanted: {transplanted}")
        print(f"- Harvested: {harvested}")
        
        # Seed types
        seed_types = db.query(SeedType).filter(SeedType.id.in_(
            db.query(Crop.seed_type_id).filter(
                (Crop.tray_id.in_(tray_ids) | Crop.panel_id.in_(panel_ids))
            ).distinct()
        )).all()
        
        print(f"\nSeed types used ({len(seed_types)}):")
        for st in seed_types:
            count = db.query(Crop).filter(
                (Crop.tray_id.in_(tray_ids) | Crop.panel_id.in_(panel_ids)),
                Crop.seed_type_id == st.id
            ).count()
            print(f"- {st.name} ({st.variety}): {count} crops")
        
    else:
        print("Container 'container-crops-demo' not found!")
        
        # List all available containers
        containers = db.query(Container).all()
        print(f"\nAvailable containers ({len(containers)}):")
        for c in containers:
            print(f"- {c.name} (ID: {c.id})")

finally:
    db.close()