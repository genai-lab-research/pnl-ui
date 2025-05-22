#!/usr/bin/env python
"""
Script to list all containers in the database
"""
from app.database.database import SessionLocal
from app.models.models import Container, Tray, Panel

db = SessionLocal()

try:
    # Get all containers
    containers = db.query(Container).all()
    print(f"Found {len(containers)} containers:")
    
    for container in containers:
        # Get trays and panels
        trays = db.query(Tray).filter(Tray.container_id == container.id).all()
        panels = db.query(Panel).filter(Panel.container_id == container.id).all()
        
        print(f"Container: {container.name} (ID: {container.id})")
        print(f"  Type: {container.type}")
        print(f"  Status: {container.status}")
        print(f"  Trays: {len(trays)}")
        print(f"  Panels: {len(panels)}")
        print("  " + "-" * 40)
    
finally:
    db.close()