#!/usr/bin/env python
"""
Script to verify lifecycle statuses of crops across containers
"""
from app.database.database import SessionLocal
from app.models.models import Container, Crop, Tray, Panel
from app.models.enums import CropLifecycleStatus

db = SessionLocal()

try:
    # Get all containers
    containers = db.query(Container).all()
    
    total_seeded = 0
    total_transplanted = 0
    total_harvested = 0
    
    # For each container, count the number of crops in each lifecycle status
    for container in containers:
        # Get tray and panel IDs belonging to this container
        tray_ids = [tray.id for tray in container.trays]
        panel_ids = [panel.id for panel in container.panels]
        
        # Skip if no trays or panels
        if not tray_ids and not panel_ids:
            continue
        
        # Query crops that are in trays or panels of this container
        crops_query = db.query(Crop).filter(
            ((Crop.tray_id.in_(tray_ids)) if tray_ids else False) | 
            ((Crop.panel_id.in_(panel_ids)) if panel_ids else False)
        )
        
        # Count by lifecycle status
        seeded = crops_query.filter(Crop.lifecycle_status == CropLifecycleStatus.SEEDED).count()
        transplanted = crops_query.filter(Crop.lifecycle_status == CropLifecycleStatus.TRANSPLANTED).count()
        harvested = crops_query.filter(Crop.lifecycle_status == CropLifecycleStatus.HARVESTED).count()
        
        # Add to totals
        total_seeded += seeded
        total_transplanted += transplanted
        total_harvested += harvested
        
        # Calculate percentages
        total_crops = seeded + transplanted + harvested
        seeded_pct = seeded / total_crops * 100 if total_crops > 0 else 0
        transplanted_pct = transplanted / total_crops * 100 if total_crops > 0 else 0
        harvested_pct = harvested / total_crops * 100 if total_crops > 0 else 0
        
        print(f"Container: {container.name} (ID: {container.id})")
        print(f"  Total crops: {total_crops}")
        print(f"  Seeded: {seeded} ({seeded_pct:.1f}%)")
        print(f"  Transplanted: {transplanted} ({transplanted_pct:.1f}%)")
        print(f"  Harvested: {harvested} ({harvested_pct:.1f}%)")
        print("  " + "-" * 40)
    
    # Calculate overall percentages
    total_crops = total_seeded + total_transplanted + total_harvested
    seeded_pct = total_seeded / total_crops * 100 if total_crops > 0 else 0
    transplanted_pct = total_transplanted / total_crops * 100 if total_crops > 0 else 0
    harvested_pct = total_harvested / total_crops * 100 if total_crops > 0 else 0
    
    print("\nOverall statistics:")
    print(f"  Total crops across all containers: {total_crops}")
    print(f"  Seeded: {total_seeded} ({seeded_pct:.1f}%)")
    print(f"  Transplanted: {total_transplanted} ({transplanted_pct:.1f}%)")
    print(f"  Harvested: {total_harvested} ({harvested_pct:.1f}%)")
    
finally:
    db.close()