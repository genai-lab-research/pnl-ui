#!/usr/bin/env python3
"""
Provisioning seeding data for development and testing.
Provides comprehensive test data for RFID validation and tray/panel provisioning.
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict, Any


def generate_tray_location() -> Dict[str, Any]:
    """Generate realistic tray location data."""
    shelves = ["upper", "lower"]
    return {
        "shelf": random.choice(shelves),
        "slot_number": random.randint(1, 8)
    }


def generate_panel_location() -> Dict[str, Any]:
    """Generate realistic panel location data."""
    walls = ["wall_1", "wall_2", "wall_3", "wall_4"]
    return {
        "wall": random.choice(walls),
        "slot_number": random.randint(1, 22)
    }


def generate_rfid_tag(prefix: str = "RFID", unique_id: int = None) -> str:
    """Generate realistic RFID tag."""
    if unique_id is not None:
        return f"{prefix}{unique_id:08d}"
    else:
        return f"{prefix}{random.randint(10000000, 99999999)}"


# Tray seed data with realistic provisioning scenarios
tray_seeds = []
tray_types = ["seedling", "growing", "harvest", "specialty"]
statuses = ["active", "inactive", "maintenance", "full", "empty"]

# Generate 1000+ tray records for 100 containers
for i in range(1200):
    provisioned_at = datetime.now() - timedelta(days=random.randint(1, 90))
    tray_data = {
        "container_id": random.randint(1, 500),  # Assuming 500 containers exist
        "rfid_tag": generate_rfid_tag("TRY", unique_id=i+10000),  # Use unique ID to prevent duplicates
        "location": generate_tray_location(),
        "utilization_pct": random.uniform(0.0, 100.0),
        "provisioned_at": provisioned_at,
        "status": random.choice(statuses),
        "capacity": random.randint(20, 100),
        "tray_type": random.choice(tray_types)
    }
    tray_seeds.append(tray_data)

# Panel seed data with realistic provisioning scenarios
panel_seeds = []
panel_types = ["hydroponic", "aeroponic", "drip", "nft"]

# Generate 1500+ panel records for 100 containers
for i in range(1500):  # Generate 1500 panels for 100 containers
    provisioned_at = datetime.now() - timedelta(days=random.randint(1, 120))
    panel_data = {
        "container_id": random.randint(1, 500),  # Assuming 500 containers exist
        "rfid_tag": generate_rfid_tag("PNL", unique_id=i+20000),  # Use unique ID to prevent duplicates
        "location": generate_panel_location(),
        "utilization_pct": random.uniform(0.0, 100.0),
        "provisioned_at": provisioned_at,
        "status": random.choice(statuses),
        "capacity": random.randint(50, 200),
        "panel_type": random.choice(panel_types)
    }
    panel_seeds.append(panel_data)

# RFID validation test data - both valid and invalid scenarios
rfid_validation_test_cases = [
    # Valid RFID tags
    {"rfid_tag": "TRY123456", "type": "tray", "expected_valid": True, "expected_unique": True},
    {"rfid_tag": "PNL789012", "type": "panel", "expected_valid": True, "expected_unique": True},
    {"rfid_tag": "TRY999888", "type": "tray", "expected_valid": True, "expected_unique": True},
    
    # Invalid format RFID tags
    {"rfid_tag": "INVALID", "type": "tray", "expected_valid": False, "expected_unique": True},
    {"rfid_tag": "123", "type": "panel", "expected_valid": False, "expected_unique": True},
    {"rfid_tag": "", "type": "tray", "expected_valid": False, "expected_unique": True},
    
    # Duplicate RFID tags (will be created as duplicates for testing)
    {"rfid_tag": "TRY000001", "type": "tray", "expected_valid": True, "expected_unique": False},
    {"rfid_tag": "PNL000001", "type": "panel", "expected_valid": True, "expected_unique": False},
]

# Bulk provisioning test scenarios
bulk_tray_provision_scenarios = [
    {
        "container_id": 1,
        "count": 5,
        "shelf_preference": "upper",
        "tray_type": "seedling",
        "capacity_range": (20, 40)
    },
    {
        "container_id": 2,
        "count": 8,
        "shelf_preference": "lower",
        "tray_type": "growing",
        "capacity_range": (40, 80)
    },
    {
        "container_id": 3,
        "count": 3,
        "shelf_preference": "upper",
        "tray_type": "harvest",
        "capacity_range": (60, 100)
    }
]

bulk_panel_provision_scenarios = [
    {
        "container_id": 1,
        "count": 10,
        "wall_preference": "wall_1",
        "panel_type": "hydroponic",
        "capacity_range": (50, 100)
    },
    {
        "container_id": 2,
        "count": 15,
        "wall_preference": "wall_2",
        "panel_type": "aeroponic",
        "capacity_range": (80, 150)
    },
    {
        "container_id": 3,
        "count": 12,
        "wall_preference": "wall_3",
        "panel_type": "drip",
        "capacity_range": (100, 200)
    }
]

# Location availability test data
location_test_scenarios = [
    # Available locations
    {"container_id": 1, "type": "nursery-station", "location": "upper-1", "is_available": True},
    {"container_id": 1, "type": "nursery-station", "location": "upper-2", "is_available": True},
    {"container_id": 1, "type": "cultivation-area", "location": "wall_1-1", "is_available": True},
    
    # Occupied locations
    {"container_id": 1, "type": "nursery-station", "location": "lower-1", "is_available": False, "occupant_type": "tray"},
    {"container_id": 1, "type": "cultivation-area", "location": "wall_2-5", "is_available": False, "occupant_type": "panel"},
]

# Provisioning summary test data (recent activities)
provisioning_summary_scenarios = [
    {
        "container_id": 1,
        "days_back": 7,
        "expected_trays": 5,
        "expected_panels": 8,
        "expected_avg_daily": 1.8
    },
    {
        "container_id": 2,
        "days_back": 14,
        "expected_trays": 12,
        "expected_panels": 15,
        "expected_avg_daily": 1.9
    },
    {
        "container_id": 3,
        "days_back": 30,
        "expected_trays": 25,
        "expected_panels": 30,
        "expected_avg_daily": 1.8
    }
]

# Print label test scenarios
print_label_scenarios = [
    {"format": "PDF", "base_url": "https://labels.example.com/pdf/"},
    {"format": "PNG", "base_url": "https://labels.example.com/png/"},
]

# Error scenarios for testing
error_scenarios = [
    {
        "scenario": "duplicate_rfid",
        "description": "Attempting to provision with duplicate RFID",
        "expected_error": "RFID tag already exists"
    },
    {
        "scenario": "invalid_container",
        "description": "Provisioning to non-existent container",
        "expected_error": "Container not found"
    },
    {
        "scenario": "occupied_location",
        "description": "Provisioning to occupied location",
        "expected_error": "Location already occupied"
    },
    {
        "scenario": "invalid_location",
        "description": "Provisioning to invalid location",
        "expected_error": "Invalid location specification"
    }
]

# Edge case scenarios
edge_case_scenarios = [
    {
        "name": "maximum_capacity_tray",
        "type": "tray",
        "capacity": 999,
        "expected_behavior": "Should handle large capacity values"
    },
    {
        "name": "maximum_capacity_panel", 
        "type": "panel",
        "capacity": 9999,
        "expected_behavior": "Should handle large capacity values"
    },
    {
        "name": "zero_capacity",
        "type": "tray",
        "capacity": 0,
        "expected_behavior": "Should allow zero capacity"
    },
    {
        "name": "special_characters_rfid",
        "rfid_tag": "TRY-123_456",
        "expected_behavior": "Should validate RFID format with special characters"
    }
]