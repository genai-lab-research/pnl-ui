#!/usr/bin/env python3
"""Debug test for database operations"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.db import get_db, SessionLocal
from app.services.container import ContainerService
from app.services.location import LocationService
from app.schemas.container import ContainerCreate
from app.schemas.location import LocationCreate

def test_direct_db():
    """Test database operations directly"""
    db = SessionLocal()
    try:
        # Create location
        location_service = LocationService(db)
        location_data = LocationCreate(
            city="Test City",
            country="Test Country",
            address="Test Address"
        )
        location = location_service.create_location(location_data)
        print(f"Created location: {location.id}")
        
        # Create container
        container_service = ContainerService(db)
        container_data = ContainerCreate(
            id="test-container-001",
            type="physical",
            name="Test Container",
            tenant="test-tenant",
            purpose="development",
            location_id=location.id,
            status="active",
            seed_types=["seed1", "seed2"],
            has_alert=False,
            notes="Test container",
            shadow_service_enabled=True,
            ecosystem_connected=True
        )
        
        container = container_service.create_container(container_data)
        print(f"Created container: {container.id}")
        print("Direct database test: SUCCESS")
        
    except Exception as e:
        print(f"Direct database test failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_direct_db()