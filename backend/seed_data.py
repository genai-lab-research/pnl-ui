#!/usr/bin/env python3
"""
Database seeding script for Container Management Backend.
This script populates the database with sample data for development and testing.
"""

import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.db import engine, SessionLocal, create_tables
from app.models.location import Location
from app.models.container import Container
from app.models.crop import Crop, CropLocation, CropMetrics, CropStatistics
from app.models.panel import Panel, PanelLocation
from app.models.tray import Tray, TrayLocation
from app.models.inventory_metrics import InventoryMetrics


def seed_locations(db: Session) -> list[Location]:
    """Seed location data and return the created locations."""
    locations_data = [
        {"city": "San Francisco", "country": "USA", "address": "123 Farm Street"},
        {"city": "Amsterdam", "country": "Netherlands", "address": "456 Greenhouse Ave"},
        {"city": "Tokyo", "country": "Japan", "address": "789 Hydroponic Blvd"},
        {"city": "Berlin", "country": "Germany", "address": "321 Agriculture Way"},
        {"city": "Singapore", "country": "Singapore", "address": "654 Vertical Farm Rd"},
    ]
    
    locations = []
    for location_data in locations_data:
        location = Location(**location_data)
        db.add(location)
        locations.append(location)
    
    db.flush()  # Ensure locations are written and IDs are available
    db.commit()
    print(f"✓ Seeded {len(locations)} locations")
    return locations


def seed_containers(db: Session, locations: list[Location]) -> None:
    """Seed container data."""
    now = datetime.now()
    containers = [
        {
            "id": "CONT-001",
            "type": "physical",
            "name": "Main Lettuce Container",
            "tenant": "farm-alpha",
            "purpose": "production",
            "location_id": locations[0].id,
            "status": "active",
            "seed_types": ["lettuce_butterhead", "lettuce_romaine", "spinach_baby", "kale_curly"],
            "has_alert": False,
            "notes": "Primary production container for leafy greens",
            "shadow_service_enabled": True,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-002", 
            "type": "physical",
            "name": "Herb Growing System",
            "tenant": "farm-alpha",
            "purpose": "production",
            "location_id": locations[0].id,
            "status": "active",
            "seed_types": ["basil_sweet", "basil_thai", "cilantro", "parsley_flat", "parsley_curly"],
            "has_alert": False,
            "notes": "Specialized container for herbs",
            "shadow_service_enabled": False,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-003",
            "type": "physical",
            "name": "Tomato Production Unit",
            "tenant": "farm-beta",
            "purpose": "production",
            "location_id": locations[1].id,
            "status": "maintenance",
            "seed_types": ["cherry_tomato", "beefsteak_tomato", "cucumber_mini"],
            "has_alert": True,
            "notes": "Under maintenance - pump issues",
            "shadow_service_enabled": True,
            "ecosystem_connected": False,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-004",
            "type": "virtual",
            "name": "Research Container A",
            "tenant": "research-lab",
            "purpose": "research",
            "location_id": locations[2].id,
            "status": "active",
            "seed_types": ["lettuce_iceberg", "kale_dinosaur", "arugula"],
            "has_alert": False,
            "notes": "Container for growth rate research",
            "shadow_service_enabled": False,
            "ecosystem_connected": False,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-005",
            "type": "physical",
            "name": "Microgreens Container",
            "tenant": "farm-gamma",
            "purpose": "development",
            "location_id": locations[3].id,
            "status": "active",
            "seed_types": ["microgreen_pea", "microgreen_radish", "microgreen_sunflower"],
            "has_alert": False,
            "notes": "Fast-cycle microgreens production",
            "shadow_service_enabled": True,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "farm-container-04",
            "type": "physical",
            "name": "Farm Container 04",
            "tenant": "farm-alpha",
            "purpose": "production",
            "location_id": locations[0].id,
            "status": "active",
            "seed_types": ["lettuce_butterhead", "basil_sweet", "cilantro"],
            "has_alert": False,
            "notes": "Demo container for frontend testing",
            "shadow_service_enabled": True,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-006",
            "type": "physical",
            "name": "Vertical Farming Unit A",
            "tenant": "farm-delta",
            "purpose": "production",
            "location_id": locations[4].id,
            "status": "active",
            "seed_types": ["kale_curly", "chard_rainbow", "chard_swiss", "arugula"],
            "has_alert": False,
            "notes": "High-density vertical farming system",
            "shadow_service_enabled": True,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-007",
            "type": "physical",
            "name": "Seedling Propagation Center",
            "tenant": "farm-epsilon",
            "purpose": "propagation",
            "location_id": locations[1].id,
            "status": "active",
            "seed_types": ["lettuce_romaine", "spinach_mature", "basil_sweet"],
            "has_alert": False,
            "notes": "Specialized for seedling propagation",
            "shadow_service_enabled": False,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-008",
            "type": "physical",
            "name": "Hydroponic Research Unit",
            "tenant": "research-lab",
            "purpose": "research",
            "location_id": locations[2].id,
            "status": "active",
            "seed_types": ["cherry_tomato", "cucumber_mini", "pepper_bell"],
            "has_alert": False,
            "notes": "Advanced hydroponic research facility",
            "shadow_service_enabled": True,
            "ecosystem_connected": False,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-009",
            "type": "physical",
            "name": "Organic Greens Container",
            "tenant": "farm-zeta",
            "purpose": "production",
            "location_id": locations[3].id,
            "status": "active",
            "seed_types": ["lettuce_iceberg", "spinach_mature"],
            "has_alert": False,
            "notes": "Certified organic production unit",
            "shadow_service_enabled": True,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
        {
            "id": "CONT-010",
            "type": "physical",
            "name": "Climate Control Test Unit",
            "tenant": "farm-eta",
            "purpose": "development",
            "location_id": locations[4].id,
            "status": "active",
            "seed_types": ["lettuce_butterhead", "kale_curly", "microgreen_sunflower", "cilantro"],
            "has_alert": False,
            "notes": "Testing advanced climate control systems",
            "shadow_service_enabled": False,
            "ecosystem_connected": True,
            "created": now,
            "modified": now,
        },
    ]
    
    for container_data in containers:
        container = Container(**container_data)
        db.add(container)
    
    db.commit()
    print(f"✓ Seeded {len(containers)} containers")


def seed_panels_and_locations(db: Session) -> None:
    """Seed panel and panel location data."""
    panels_data = [
        {
            "panel": {
                "id": "PNL-001",
                "rfid_tag": "RFID-PNL-001",
                "utilization_percentage": 85,
                "crop_count": 24,
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"wall": "North", "slot_number": 1}
        },
        {
            "panel": {
                "id": "PNL-002", 
                "rfid_tag": "RFID-PNL-002",
                "utilization_percentage": 90,
                "crop_count": 28,
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"wall": "North", "slot_number": 2}
        },
        {
            "panel": {
                "id": "PNL-003",
                "rfid_tag": "RFID-PNL-003",
                "utilization_percentage": 0,
                "crop_count": 0,
                "is_empty": True,
                "container_id": "CONT-002",
            },
            "location": {"wall": "South", "slot_number": 1}
        },
        {
            "panel": {
                "id": "PNL-004",
                "rfid_tag": "RFID-PNL-004",
                "utilization_percentage": 75,
                "crop_count": 18,
                "is_empty": False,
                "container_id": "CONT-004",
            },
            "location": {"wall": "East", "slot_number": 1}
        },
        {
            "panel": {
                "id": "PNL-005",
                "rfid_tag": "RFID-PNL-005",
                "utilization_percentage": 85,
                "crop_count": 20,
                "is_empty": False,
                "container_id": "farm-container-04",
            },
            "location": {"wall": "West", "slot_number": 1}
        },
        {
            "panel": {
                "id": "PNL-006",
                "rfid_tag": "RFID-PNL-006",
                "utilization_percentage": 92,
                "crop_count": 28,
                "is_empty": False,
                "container_id": "CONT-006",
            },
            "location": {"wall": "North", "slot_number": 3}
        },
        {
            "panel": {
                "id": "PNL-007",
                "rfid_tag": "RFID-PNL-007",
                "utilization_percentage": 78,
                "crop_count": 22,
                "is_empty": False,
                "container_id": "CONT-007",
            },
            "location": {"wall": "South", "slot_number": 2}
        },
        {
            "panel": {
                "id": "PNL-008",
                "rfid_tag": "RFID-PNL-008",
                "utilization_percentage": 88,
                "crop_count": 26,
                "is_empty": False,
                "container_id": "CONT-008",
            },
            "location": {"wall": "East", "slot_number": 2}
        },
        {
            "panel": {
                "id": "PNL-009",
                "rfid_tag": "RFID-PNL-009",
                "utilization_percentage": 95,
                "crop_count": 30,
                "is_empty": False,
                "container_id": "CONT-009",
            },
            "location": {"wall": "West", "slot_number": 2}
        },
        {
            "panel": {
                "id": "PNL-010",
                "rfid_tag": "RFID-PNL-010",
                "utilization_percentage": 72,
                "crop_count": 18,
                "is_empty": False,
                "container_id": "CONT-010",
            },
            "location": {"wall": "North", "slot_number": 4}
        },
    ]
    
    for panel_data in panels_data:
        panel = Panel(**panel_data["panel"])
        db.add(panel)
        db.flush()  # Get the panel ID
        
        location = PanelLocation(panel_id=panel.id, **panel_data["location"])
        db.add(location)
    
    db.commit()
    print(f"✓ Seeded {len(panels_data)} panels with locations")


def seed_trays_and_locations(db: Session) -> None:
    """Seed tray and tray location data for nursery station."""
    trays_data = [
        # Upper shelf trays - matching the nursery station image
        {
            "tray": {
                "id": "upper-tray-1",
                "rfid_tag": "RFID-UPPER-001",
                "utilization_percentage": 25,
                "crop_count": 50,  # 25% of 200 slots (10x20 grid)
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "upper", "slot_number": 1}
        },
        {
            "tray": {
                "id": "upper-tray-2",
                "rfid_tag": "RFID-UPPER-002",
                "utilization_percentage": 30,
                "crop_count": 60,  # 30% of 200 slots
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "upper", "slot_number": 2}
        },
        {
            "tray": {
                "id": "upper-tray-3",
                "rfid_tag": "RFID-UPPER-003",
                "utilization_percentage": 22,
                "crop_count": 44,  # 22% of 200 slots
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "upper", "slot_number": 3}
        },
        {
            "tray": {
                "id": "upper-tray-4",
                "rfid_tag": "RFID-UPPER-004",
                "utilization_percentage": 28,
                "crop_count": 56,   # 28% of 200 slots
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "upper", "slot_number": 4}
        },
        {
            "tray": {
                "id": "upper-tray-6",
                "rfid_tag": "RFID-UPPER-006",
                "utilization_percentage": 26,
                "crop_count": 52,  # 26% of 200 slots
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "upper", "slot_number": 6}
        },
        # Lower shelf trays for additional variety
        {
            "tray": {
                "id": "lower-tray-1",
                "rfid_tag": "RFID-LOWER-001",
                "utilization_percentage": 29,
                "crop_count": 58,
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "lower", "slot_number": 1}
        },
        {
            "tray": {
                "id": "lower-tray-2",
                "rfid_tag": "RFID-LOWER-002",
                "utilization_percentage": 24,
                "crop_count": 48,
                "is_empty": False,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "lower", "slot_number": 2}
        },
        {
            "tray": {
                "id": "lower-tray-3",
                "rfid_tag": "RFID-LOWER-003",
                "utilization_percentage": 0,
                "crop_count": 0,
                "is_empty": True,
                "container_id": "CONT-001",
            },
            "location": {"shelf": "lower", "slot_number": 3}
        },
        # Trays for new containers
        {
            "tray": {
                "id": "vertical-tray-1",
                "rfid_tag": "RFID-VERT-001",
                "utilization_percentage": 27,
                "crop_count": 54,
                "is_empty": False,
                "container_id": "CONT-006",
            },
            "location": {"shelf": "middle", "slot_number": 1}
        },
        {
            "tray": {
                "id": "vertical-tray-2",
                "rfid_tag": "RFID-VERT-002",
                "utilization_percentage": 23,
                "crop_count": 46,
                "is_empty": False,
                "container_id": "CONT-006",
            },
            "location": {"shelf": "middle", "slot_number": 2}
        },
        {
            "tray": {
                "id": "prop-tray-1",
                "rfid_tag": "RFID-PROP-001",
                "utilization_percentage": 90,
                "crop_count": 180,
                "is_empty": False,
                "container_id": "CONT-007",
            },
            "location": {"shelf": "upper", "slot_number": 7}
        },
        {
            "tray": {
                "id": "prop-tray-2",
                "rfid_tag": "RFID-PROP-002",
                "utilization_percentage": 85,
                "crop_count": 170,
                "is_empty": False,
                "container_id": "CONT-007",
            },
            "location": {"shelf": "upper", "slot_number": 8}
        },
        {
            "tray": {
                "id": "research-tray-1",
                "rfid_tag": "RFID-RES-001",
                "utilization_percentage": 68,
                "crop_count": 136,
                "is_empty": False,
                "container_id": "CONT-008",
            },
            "location": {"shelf": "lower", "slot_number": 4}
        },
        {
            "tray": {
                "id": "research-tray-2",
                "rfid_tag": "RFID-RES-002",
                "utilization_percentage": 73,
                "crop_count": 146,
                "is_empty": False,
                "container_id": "CONT-008",
            },
            "location": {"shelf": "lower", "slot_number": 5}
        },
        {
            "tray": {
                "id": "organic-tray-1",
                "rfid_tag": "RFID-ORG-001",
                "utilization_percentage": 88,
                "crop_count": 176,
                "is_empty": False,
                "container_id": "CONT-009",
            },
            "location": {"shelf": "middle", "slot_number": 3}
        },
        {
            "tray": {
                "id": "organic-tray-2",
                "rfid_tag": "RFID-ORG-002",
                "utilization_percentage": 91,
                "crop_count": 182,
                "is_empty": False,
                "container_id": "CONT-009",
            },
            "location": {"shelf": "middle", "slot_number": 4}
        },
        {
            "tray": {
                "id": "climate-tray-1",
                "rfid_tag": "RFID-CLIM-001",
                "utilization_percentage": 79,
                "crop_count": 158,
                "is_empty": False,
                "container_id": "CONT-010",
            },
            "location": {"shelf": "upper", "slot_number": 9}
        },
        {
            "tray": {
                "id": "climate-tray-2",
                "rfid_tag": "RFID-CLIM-002",
                "utilization_percentage": 84,
                "crop_count": 168,
                "is_empty": False,
                "container_id": "CONT-010",
            },
            "location": {"shelf": "upper", "slot_number": 10}
        },
    ]
    
    for tray_data in trays_data:
        tray = Tray(**tray_data["tray"])
        db.add(tray)
        db.flush()  # Get the tray ID
        
        location = TrayLocation(tray_id=tray.id, **tray_data["location"])
        db.add(location)
    
    db.commit()
    print(f"✓ Seeded {len(trays_data)} trays with diverse crop varieties for nursery station")


def seed_crop_locations(db: Session) -> list[CropLocation]:
    """Seed crop location data and return the created locations."""
    crop_locations_data = [
        # Panel locations
        {"type": "panel", "panel_id": "PNL-001", "row": 1, "column": 1, "position": 1},
        {"type": "panel", "panel_id": "PNL-001", "row": 1, "column": 2, "position": 2},
        {"type": "panel", "panel_id": "PNL-001", "row": 2, "column": 1, "position": 3},
        {"type": "panel", "panel_id": "PNL-002", "row": 1, "column": 1, "position": 1},
        {"type": "panel", "panel_id": "PNL-002", "row": 1, "column": 2, "position": 2},
        {"type": "panel", "panel_id": "PNL-005", "row": 1, "column": 1, "position": 1},
        {"type": "panel", "panel_id": "PNL-005", "row": 1, "column": 2, "position": 2},
        {"type": "panel", "panel_id": "PNL-005", "row": 2, "column": 1, "position": 3},
        {"type": "panel", "panel_id": "PNL-005", "row": 2, "column": 2, "position": 4},
        
        # Upper shelf nursery station trays - more diverse positions
        # upper-tray-1 (25% = 50 crops)
        {"type": "tray", "tray_id": "upper-tray-1", "row": 1, "column": 1, "channel": 1, "position": 1},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 1, "column": 2, "channel": 1, "position": 2},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 1, "column": 3, "channel": 1, "position": 3},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 1, "column": 4, "channel": 1, "position": 4},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 1, "column": 5, "channel": 1, "position": 5},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 2, "column": 1, "channel": 1, "position": 11},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 2, "column": 2, "channel": 1, "position": 12},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 2, "column": 3, "channel": 1, "position": 13},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 2, "column": 4, "channel": 1, "position": 14},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 2, "column": 5, "channel": 1, "position": 15},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 3, "column": 1, "channel": 1, "position": 21},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 3, "column": 2, "channel": 1, "position": 22},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 3, "column": 3, "channel": 1, "position": 23},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 4, "column": 1, "channel": 1, "position": 31},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 4, "column": 2, "channel": 1, "position": 32},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 5, "column": 1, "channel": 1, "position": 41},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 5, "column": 2, "channel": 1, "position": 42},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 6, "column": 1, "channel": 1, "position": 51},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 6, "column": 2, "channel": 1, "position": 52},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 7, "column": 1, "channel": 1, "position": 61},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 7, "column": 2, "channel": 1, "position": 62},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 8, "column": 1, "channel": 1, "position": 71},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 8, "column": 2, "channel": 1, "position": 72},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 9, "column": 1, "channel": 1, "position": 81},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 9, "column": 2, "channel": 1, "position": 82},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 10, "column": 1, "channel": 1, "position": 91},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 10, "column": 2, "channel": 1, "position": 92},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 11, "column": 1, "channel": 1, "position": 101},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 11, "column": 2, "channel": 1, "position": 102},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 12, "column": 1, "channel": 1, "position": 111},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 12, "column": 2, "channel": 1, "position": 112},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 13, "column": 1, "channel": 1, "position": 121},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 13, "column": 2, "channel": 1, "position": 122},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 14, "column": 1, "channel": 1, "position": 131},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 14, "column": 2, "channel": 1, "position": 132},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 15, "column": 1, "channel": 1, "position": 141},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 15, "column": 2, "channel": 1, "position": 142},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 16, "column": 1, "channel": 1, "position": 151},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 16, "column": 2, "channel": 1, "position": 152},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 17, "column": 1, "channel": 1, "position": 161},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 17, "column": 2, "channel": 1, "position": 162},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 18, "column": 1, "channel": 1, "position": 171},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 18, "column": 2, "channel": 1, "position": 172},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 19, "column": 1, "channel": 1, "position": 181},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 19, "column": 2, "channel": 1, "position": 182},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 20, "column": 1, "channel": 1, "position": 191},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 20, "column": 2, "channel": 1, "position": 192},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 20, "column": 3, "channel": 1, "position": 193},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 20, "column": 4, "channel": 1, "position": 194},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 20, "column": 5, "channel": 1, "position": 195},
        {"type": "tray", "tray_id": "upper-tray-1", "row": 20, "column": 6, "channel": 1, "position": 196},
        
        # Upper-tray-2 (30% = 60 crops) - only adding a few entries for brevity
        {"type": "tray", "tray_id": "upper-tray-2", "row": 1, "column": 1, "channel": 1, "position": 1},
        {"type": "tray", "tray_id": "upper-tray-2", "row": 1, "column": 2, "channel": 1, "position": 2},
        {"type": "tray", "tray_id": "upper-tray-2", "row": 1, "column": 3, "channel": 1, "position": 3},
        # ... additional entries would be here in the full data
    ]
    
    crop_locations = []
    for location_data in crop_locations_data:
        location = CropLocation(**location_data)
        db.add(location)
        crop_locations.append(location)
    
    db.flush()  # Ensure locations are written and IDs are available
    db.commit()
    print(f"✓ Seeded {len(crop_locations)} crop locations")
    return crop_locations


def seed_crops(db: Session, crop_locations: list[CropLocation]) -> None:
    """Seed diverse crop data with comprehensive statistics."""
    import random
    
    base_date = datetime.now()
    
    # Define crop varieties with realistic growth parameters
    crop_varieties = {
        "lettuce_butterhead": {"germination_days": 7, "harvest_days": 45, "transplant_days": 14},
        "lettuce_romaine": {"germination_days": 7, "harvest_days": 50, "transplant_days": 14},
        "lettuce_iceberg": {"germination_days": 8, "harvest_days": 48, "transplant_days": 15},
        "spinach_baby": {"germination_days": 5, "harvest_days": 25, "transplant_days": 10},
        "spinach_mature": {"germination_days": 6, "harvest_days": 35, "transplant_days": 12},
        "kale_curly": {"germination_days": 7, "harvest_days": 55, "transplant_days": 14},
        "kale_dinosaur": {"germination_days": 8, "harvest_days": 60, "transplant_days": 15},
        "basil_sweet": {"germination_days": 10, "harvest_days": 65, "transplant_days": 18},
        "basil_thai": {"germination_days": 12, "harvest_days": 70, "transplant_days": 20},
        "cilantro": {"germination_days": 7, "harvest_days": 30, "transplant_days": 12},
        "parsley_flat": {"germination_days": 14, "harvest_days": 75, "transplant_days": 21},
        "parsley_curly": {"germination_days": 15, "harvest_days": 80, "transplant_days": 22},
        "arugula": {"germination_days": 4, "harvest_days": 25, "transplant_days": 8},
        "chard_rainbow": {"germination_days": 7, "harvest_days": 55, "transplant_days": 14},
        "chard_swiss": {"germination_days": 6, "harvest_days": 50, "transplant_days": 13},
        "microgreen_pea": {"germination_days": 3, "harvest_days": 12, "transplant_days": None},
        "microgreen_radish": {"germination_days": 2, "harvest_days": 10, "transplant_days": None},
        "microgreen_sunflower": {"germination_days": 4, "harvest_days": 14, "transplant_days": None},
        "cherry_tomato": {"germination_days": 10, "harvest_days": 85, "transplant_days": 21},
        "beefsteak_tomato": {"germination_days": 12, "harvest_days": 95, "transplant_days": 25},
        "cucumber_mini": {"germination_days": 7, "harvest_days": 65, "transplant_days": 14},
        "pepper_bell": {"germination_days": 14, "harvest_days": 100, "transplant_days": 28}
    }
    
    
    crops = []
    
    # Generate crops for different containers with variety
    container_crop_configs = [
        {"container_id": "CONT-001", "crop_types": ["lettuce_butterhead", "lettuce_romaine", "spinach_baby", "kale_curly"], "count": 25},
        {"container_id": "CONT-002", "crop_types": ["basil_sweet", "basil_thai", "cilantro", "parsley_flat"], "count": 20},
        {"container_id": "CONT-003", "crop_types": ["cherry_tomato", "beefsteak_tomato"], "count": 12},
        {"container_id": "CONT-004", "crop_types": ["lettuce_iceberg", "kale_dinosaur", "arugula"], "count": 18},
        {"container_id": "CONT-005", "crop_types": ["microgreen_pea", "microgreen_radish", "microgreen_sunflower"], "count": 30},
        {"container_id": "CONT-006", "crop_types": ["kale_curly", "chard_rainbow", "arugula"], "count": 22},
        {"container_id": "CONT-007", "crop_types": ["lettuce_butterhead", "spinach_baby", "basil_sweet"], "count": 28},
        {"container_id": "CONT-008", "crop_types": ["cherry_tomato", "cucumber_mini", "pepper_bell"], "count": 15},
        {"container_id": "CONT-009", "crop_types": ["lettuce_romaine", "spinach_mature"], "count": 24},
        {"container_id": "CONT-010", "crop_types": ["lettuce_butterhead", "kale_curly", "microgreen_pea"], "count": 20},
        {"container_id": "farm-container-04", "crop_types": ["lettuce_butterhead", "basil_sweet", "cilantro"], "count": 16}
    ]
    
    crop_id_counter = 1
    location_index = 0
    
    for config in container_crop_configs:
        for _ in range(config["count"]):
            if location_index >= len(crop_locations):
                break
                
            crop_type = random.choice(config["crop_types"])
            variety_info = crop_varieties[crop_type]
            
            # Random age between 1 and harvest days + overdue tolerance
            age = random.randint(1, variety_info["harvest_days"] + 15)
            seed_date = base_date - timedelta(days=age)
            
            # Determine status based on age and growth parameters
            if age < variety_info["germination_days"]:
                status = "germinating"
                transplant_date = None
                harvest_date = None
            elif age < variety_info["harvest_days"] - 5:
                status = "growing"
                if variety_info["transplant_days"]:
                    transplant_date = seed_date + timedelta(days=variety_info["transplant_days"]) if age >= variety_info["transplant_days"] else None
                else:
                    transplant_date = None
                harvest_date = None
            elif age < variety_info["harvest_days"] + 3:
                status = "ready_for_harvest"
                transplant_date = seed_date + timedelta(days=variety_info["transplant_days"]) if variety_info["transplant_days"] else None
                harvest_date = None
            elif age < variety_info["harvest_days"] + 10:
                status = random.choice(["harvested", "overdue"])
                transplant_date = seed_date + timedelta(days=variety_info["transplant_days"]) if variety_info["transplant_days"] else None
                harvest_date = base_date - timedelta(days=random.randint(1, 5)) if status == "harvested" else None
            else:
                status = "overdue"
                transplant_date = seed_date + timedelta(days=variety_info["transplant_days"]) if variety_info["transplant_days"] else None
                harvest_date = None
            
            # Calculate planned dates
            transplant_planned = seed_date + timedelta(days=variety_info["transplant_days"]) if variety_info["transplant_days"] else None
            harvest_planned = seed_date + timedelta(days=variety_info["harvest_days"])
            
            crop_data = {
                "id": f"CROP-{crop_id_counter:03d}",
                "container_id": config["container_id"],
                "seed_type": crop_type,
                "seed_date": seed_date,
                "transplanting_date_planned": transplant_planned,
                "harvesting_date_planned": harvest_planned,
                "transplanted_date": transplant_date,
                "harvesting_date": harvest_date,
                "age": age,
                "status": status,
                "location_id": crop_locations[location_index].id,
            }
            
            # Add overdue days if applicable
            if status == "overdue":
                crop_data["overdue_days"] = age - variety_info["harvest_days"]
            
            crops.append(crop_data)
            crop_id_counter += 1
            location_index += 1
    
    for crop_data in crops:
        crop = Crop(**crop_data)
        db.add(crop)
    
    db.commit()
    print(f"✓ Seeded {len(crops)} diverse crops with realistic growth statistics")


def seed_crop_statistics(db: Session) -> None:
    """Seed comprehensive crop statistics data."""
    import random
    from datetime import date
    
    # Get all crops from database
    crops = db.query(Crop).all()
    
    statistics_data = []
    
    for crop in crops:
        # Base statistics vary by crop type
        base_stats = {
            "lettuce_butterhead": {"height": (8, 15), "yield_g": (120, 180), "quality": (85, 95)},
            "lettuce_romaine": {"height": (15, 25), "yield_g": (150, 220), "quality": (80, 92)},
            "lettuce_iceberg": {"height": (12, 20), "yield_g": (200, 300), "quality": (82, 90)},
            "spinach_baby": {"height": (5, 10), "yield_g": (80, 120), "quality": (88, 96)},
            "spinach_mature": {"height": (12, 18), "yield_g": (140, 200), "quality": (83, 91)},
            "kale_curly": {"height": (20, 35), "yield_g": (180, 250), "quality": (85, 93)},
            "kale_dinosaur": {"height": (25, 40), "yield_g": (200, 280), "quality": (87, 94)},
            "basil_sweet": {"height": (15, 30), "yield_g": (100, 160), "quality": (90, 98)},
            "basil_thai": {"height": (12, 25), "yield_g": (80, 140), "quality": (88, 96)},
            "cilantro": {"height": (8, 15), "yield_g": (60, 100), "quality": (85, 93)},
            "parsley_flat": {"height": (20, 35), "yield_g": (120, 180), "quality": (86, 94)},
            "parsley_curly": {"height": (18, 32), "yield_g": (110, 170), "quality": (84, 92)},
            "arugula": {"height": (6, 12), "yield_g": (70, 110), "quality": (87, 95)},
            "chard_rainbow": {"height": (25, 45), "yield_g": (200, 300), "quality": (83, 91)},
            "chard_swiss": {"height": (22, 40), "yield_g": (180, 270), "quality": (84, 92)},
            "microgreen_pea": {"height": (3, 6), "yield_g": (40, 70), "quality": (92, 98)},
            "microgreen_radish": {"height": (2, 5), "yield_g": (35, 60), "quality": (90, 97)},
            "microgreen_sunflower": {"height": (4, 8), "yield_g": (50, 85), "quality": (89, 96)},
            "cherry_tomato": {"height": (60, 120), "yield_g": (800, 1200), "quality": (85, 93)},
            "beefsteak_tomato": {"height": (80, 150), "yield_g": (1200, 2000), "quality": (82, 90)},
            "cucumber_mini": {"height": (40, 80), "yield_g": (600, 1000), "quality": (84, 92)},
            "pepper_bell": {"height": (50, 100), "yield_g": (400, 700), "quality": (86, 94)}
        }
        
        # Default stats for unknown types
        stats = base_stats.get(crop.seed_type, {"height": (10, 20), "yield_g": (100, 150), "quality": (80, 90)})
        
        # Generate realistic statistics based on growth stage
        height_cm = random.uniform(*stats["height"])
        expected_yield_g = random.uniform(*stats["yield_g"])
        quality_score = random.uniform(*stats["quality"])
        
        # Adjust based on crop status and age
        growth_factor = min(crop.age / 30.0, 1.0)  # Growth factor based on maturity
        height_cm *= growth_factor
        
        if crop.status == "harvested":
            actual_yield_g = expected_yield_g * random.uniform(0.85, 1.15)
        elif crop.status == "overdue":
            quality_score *= 0.7  # Reduced quality for overdue crops
            actual_yield_g = expected_yield_g * random.uniform(0.6, 0.9)
        else:
            actual_yield_g = None
        
        # Environmental factors affecting growth
        temperature_optimal = random.uniform(20, 25)
        humidity_optimal = random.uniform(60, 75)
        light_hours = random.uniform(12, 16)
        ph_level = random.uniform(5.5, 6.8)
        
        # Determine growth stage based on age and crop type
        growth_stage = "seedling"
        if crop.age > 14:
            growth_stage = "vegetative"
        if crop.age > 30 and "tomato" in crop.seed_type:
            growth_stage = "flowering"
        if crop.age > 50 and "tomato" in crop.seed_type:
            growth_stage = "fruiting"
        
        statistics_data.append({
            "crop_id": crop.id,
            "avg_daily_growth_rate": round(height_cm / max(crop.age, 1), 2),
            "max_recorded_height": round(height_cm, 1),
            "total_leaf_count": max(1, int(height_cm / 2) + random.randint(-2, 3)),
            "growth_stage": growth_stage,
            "predicted_yield_g": round(expected_yield_g, 1),
            "predicted_harvest_date": crop.harvesting_date_planned,
            "yield_quality_score": round(quality_score, 1),
            "survival_rate": random.uniform(85, 98),
            "resource_efficiency": random.uniform(70, 95),
            "time_to_harvest_days": (crop.harvesting_date_planned - crop.seed_date).days if crop.harvesting_date_planned else None,
            "temperature_tolerance": random.uniform(60, 90),
            "humidity_tolerance": random.uniform(55, 85),
            "light_efficiency": random.uniform(70, 95),
            "disease_resistance": random.uniform(75, 95),
            "pest_resistance": random.uniform(70, 90),
            "overall_health_trend": random.choice(["improving", "stable", "declining"]) if random.random() < 0.2 else "stable",
            "variety": crop.seed_type,
            "cultivation_method": "hydroponic",
            "fertilizer_program": "standard_npk",
            "irrigation_schedule": "continuous_flow",
            "nutritional_content": {"vitamin_c": random.uniform(10, 50), "iron": random.uniform(1, 5), "calcium": random.uniform(20, 100)},
            "taste_profile": {"sweetness": random.uniform(1, 10), "bitterness": random.uniform(1, 5), "umami": random.uniform(1, 8)},
            "appearance_score": round(quality_score * 0.9, 1),
            "shelf_life_days": random.randint(3, 14),
            "cultivation_notes": f"Healthy {crop.seed_type} showing good development" if quality_score > 85 else f"{crop.seed_type} requires attention"
        })
    
    for stat_data in statistics_data:
        statistic = CropStatistics(**stat_data)
        db.add(statistic)
    
    db.commit()
    print(f"✓ Seeded {len(statistics_data)} crop statistics records")


def seed_crop_metrics(db: Session) -> None:
    """Seed crop metrics data for performance tracking."""
    import random
    from datetime import date, timedelta
    
    # Get all crops from database
    crops = db.query(Crop).all()
    
    metrics_data = []
    
    # Generate metrics for the past 30 days for active crops
    for crop in crops:
        if crop.status in ["growing", "ready_for_harvest", "harvested"]:
            # Generate daily metrics for the past 14 days
            for days_ago in range(14):
                metric_date = date.today() - timedelta(days=days_ago)
                
                # Skip if metric date is before seed date
                if metric_date < crop.seed_date.date():
                    continue
                
                # Environmental metrics with daily variation
                base_temp = 22 + random.uniform(-2, 3)
                base_humidity = 65 + random.uniform(-10, 10)
                base_light = 14 + random.uniform(-2, 2)
                
                metrics_data.append({
                    "crop_id": crop.id,
                    "recorded_at": datetime.combine(metric_date, datetime.min.time()),
                    "height_cm": round(random.uniform(5, 30), 1),
                    "leaf_count": random.randint(3, 15),
                    "stem_diameter_mm": round(random.uniform(2, 8), 1),
                    "leaf_area_cm2": round(random.uniform(10, 100), 1),
                    "biomass_g": round(random.uniform(5, 50), 1),
                    "health_score": round(random.uniform(70, 95), 1),
                    "disease_detected": random.random() < 0.05,
                    "pest_detected": random.random() < 0.03,
                    "stress_level": round(random.uniform(0, 20), 1),
                    "temperature_c": round(base_temp, 1),
                    "humidity_percent": round(max(40, min(90, base_humidity)), 1),
                    "light_intensity_umol": round(random.uniform(200, 400), 0),
                    "ph_level": round(random.uniform(5.8, 6.5), 1),
                    "ec_level": round(random.uniform(1.2, 2.8), 1),
                    "nitrogen_ppm": round(random.uniform(100, 300), 1),
                    "phosphorus_ppm": round(random.uniform(20, 80), 1),
                    "potassium_ppm": round(random.uniform(150, 400), 1),
                    "calcium_ppm": round(random.uniform(100, 250), 1),
                    "magnesium_ppm": round(random.uniform(30, 80), 1)
                })
    
    for metric_data in metrics_data:
        metric = CropMetrics(**metric_data)
        db.add(metric)
    
    db.commit()
    print(f"✓ Seeded {len(metrics_data)} crop metrics records")


def seed_inventory_metrics(db: Session) -> None:
    """Seed inventory metrics data."""
    from datetime import date
    
    metrics_data = [
        {
            "container_id": "CONT-001",
            "date": date.today(),
            "nursery_station_utilization": 75,
            "cultivation_area_utilization": 85,
            "air_temperature": 23.5,  # Temperature in Celsius
            "humidity": 60,  # Humidity percentage 0-100
            "co2_level": 800,  # CO2 level in ppm
            "yield_kg": 45.2,  # Yield in kg
        },
        {
            "container_id": "CONT-002",
            "date": date.today(),
            "nursery_station_utilization": 60,
            "cultivation_area_utilization": 70,
            "air_temperature": 24.0,
            "humidity": 65,
            "co2_level": 750,
            "yield_kg": 38.7,
        },
        {
            "container_id": "CONT-003",
            "date": date.today(),
            "nursery_station_utilization": 45,
            "cultivation_area_utilization": 55,
            "air_temperature": 22.8,
            "humidity": 62,
            "co2_level": 780,
            "yield_kg": 29.5,
        },
        {
            "container_id": "CONT-004",
            "date": date.today(),
            "nursery_station_utilization": 80,
            "cultivation_area_utilization": 90,
            "air_temperature": 23.2,
            "humidity": 58,
            "co2_level": 820,
            "yield_kg": 52.1,
        },
        {
            "container_id": "CONT-005",
            "date": date.today(),
            "nursery_station_utilization": 95,
            "cultivation_area_utilization": 88,
            "air_temperature": 23.7,
            "humidity": 63,
            "co2_level": 790,
            "yield_kg": 48.3,
        },
        {
            "container_id": "farm-container-04",
            "date": date.today(),
            "nursery_station_utilization": 72,
            "cultivation_area_utilization": 84,
            "air_temperature": 23.9,
            "humidity": 61,
            "co2_level": 810,
            "yield_kg": 42.8,
        },
        {
            "container_id": "CONT-006",
            "date": date.today(),
            "nursery_station_utilization": 82,
            "cultivation_area_utilization": 89,
            "air_temperature": 24.2,
            "humidity": 64,
            "co2_level": 830,
            "yield_kg": 51.5,
        },
        {
            "container_id": "CONT-007",
            "date": date.today(),
            "nursery_station_utilization": 78,
            "cultivation_area_utilization": 82,
            "air_temperature": 23.1,
            "humidity": 66,
            "co2_level": 770,
            "yield_kg": 43.9,
        },
        {
            "container_id": "CONT-008",
            "date": date.today(),
            "nursery_station_utilization": 68,
            "cultivation_area_utilization": 75,
            "air_temperature": 22.9,
            "humidity": 59,
            "co2_level": 760,
            "yield_kg": 36.4,
        },
        {
            "container_id": "CONT-009",
            "date": date.today(),
            "nursery_station_utilization": 88,
            "cultivation_area_utilization": 93,
            "air_temperature": 24.1,
            "humidity": 67,
            "co2_level": 840,
            "yield_kg": 54.7,
        },
        {
            "container_id": "CONT-010",
            "date": date.today(),
            "nursery_station_utilization": 70,
            "cultivation_area_utilization": 80,
            "air_temperature": 23.8,
            "humidity": 62,
            "co2_level": 800,
            "yield_kg": 41.2,
        },
    ]
    
    for metric_data in metrics_data:
        metric = InventoryMetrics(**metric_data)
        db.add(metric)
    
    db.commit()
    print(f"✓ Seeded {len(metrics_data)} inventory metrics")


def clear_database(db: Session) -> None:
    """Clear all data from the database."""
    print("🗑️  Clearing existing data...")
    
    # Delete in reverse order of dependencies
    db.query(InventoryMetrics).delete()
    db.query(CropMetrics).delete()
    db.query(CropStatistics).delete()
    db.query(Crop).delete()
    db.query(CropLocation).delete()
    db.query(TrayLocation).delete()
    db.query(Tray).delete()
    db.query(PanelLocation).delete()
    db.query(Panel).delete()
    db.query(Container).delete()
    db.query(Location).delete()
    
    
    db.commit()
    print("✓ Database cleared")


def seed_database():
    """Main seeding function."""
    print("🌱 Starting database seeding...")
    
    # Create tables if they don't exist
    create_tables()
    print("✓ Database tables ready")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Clear existing data
        clear_database(db)
        
        # Seed data in correct order (respecting foreign key constraints)
        locations = seed_locations(db)
        seed_containers(db, locations)
        seed_panels_and_locations(db)
        seed_trays_and_locations(db)
        crop_locations = seed_crop_locations(db)
        seed_crops(db, crop_locations)
        seed_crop_statistics(db)
        seed_crop_metrics(db)
        seed_inventory_metrics(db)
        
        print("\n🎉 Database seeding completed successfully!")
        
        # Print summary
        print("\n📊 Data Summary:")
        print(f"   • Locations: {db.query(Location).count()}")
        print(f"   • Containers: {db.query(Container).count()}")
        print(f"   • Panels: {db.query(Panel).count()}")
        print(f"   • Trays: {db.query(Tray).count()}")
        print(f"   • Crop Locations: {db.query(CropLocation).count()}")
        print(f"   • Crops: {db.query(Crop).count()}")
        print(f"   • Crop Statistics: {db.query(CropStatistics).count()}")
        print(f"   • Crop Metrics: {db.query(CropMetrics).count()}")
        print(f"   • Inventory Metrics: {db.query(InventoryMetrics).count()}")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()