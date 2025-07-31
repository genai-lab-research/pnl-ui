#!/usr/bin/env python3
"""
Crop seeding data for development and testing.
Provides comprehensive test data for crop timelapse functionality.
"""

import random
from datetime import date, datetime, timedelta
from typing import List, Dict, Any
from faker import Faker

fake = Faker()


def generate_crop_location(location_type: str = None) -> Dict[str, Any]:
    """Generate realistic crop location data."""
    if not location_type:
        location_type = random.choice(["tray", "panel"])
    
    if location_type == "tray":
        return {
            "type": "tray",
            "tray_id": random.randint(1, 10),
            "row": random.randint(1, 8),
            "column": random.randint(1, 12)
        }
    else:
        return {
            "type": "panel",
            "panel_id": random.randint(1, 20),
            "channel": random.randint(1, 6),
            "position": random.randint(1, 10)
        }


def generate_lifecycle_dates() -> Dict[str, date]:
    """Generate realistic lifecycle dates for crops."""
    seed_date = date.today() - timedelta(days=random.randint(10, 120))
    
    transplanting_planned = seed_date + timedelta(days=random.randint(14, 28))
    transplanting_actual = transplanting_planned + timedelta(days=random.randint(-3, 7))
    
    harvesting_planned = transplanting_actual + timedelta(days=random.randint(30, 90))
    harvesting_actual = None
    
    # Some crops may be harvested already
    if random.random() < 0.3:
        harvesting_actual = harvesting_planned + timedelta(days=random.randint(-5, 10))
    
    return {
        "seed_date": seed_date,
        "transplanting_date_planned": transplanting_planned,
        "transplanting_date": transplanting_actual,
        "harvesting_date_planned": harvesting_planned,
        "harvesting_date": harvesting_actual
    }


def generate_crop_measurements() -> Dict[str, float]:
    """Generate realistic crop measurement data."""
    base_size = random.uniform(0.5, 3.0)
    return {
        "radius": base_size + random.uniform(-0.2, 0.2),
        "width": base_size * 2 + random.uniform(-0.3, 0.3),
        "height": base_size * 1.5 + random.uniform(-0.4, 0.4),
        "area": base_size ** 2 * 3.14 + random.uniform(-0.5, 0.5),
        "area_estimated": base_size ** 2 * 3.14 + random.uniform(-0.8, 0.8),
        "weight": base_size * 50 + random.uniform(-10, 10)
    }


# Crop seed data with various growth stages
crop_seeds = []
lifecycle_statuses = ["germinating", "sprouting", "vegetative", "flowering", "fruiting", "mature", "harvested"]
health_statuses = ["excellent", "good", "fair", "poor", "critical"]

# Generate 100+ crop records
for i in range(150):
    dates = generate_lifecycle_dates()
    location = generate_crop_location()
    
    crop_data = {
        "seed_type_id": random.randint(1, 10),  # Assuming 10 seed types exist
        "tray_id": random.randint(1, 20) if random.random() < 0.8 else None,  # 80% chance of being in a tray
        "row": random.randint(1, 20) if random.random() < 0.8 else None,  # Grid row position
        "column": random.randint(1, 10) if random.random() < 0.8 else None,  # Grid column position
        "lifecycle_status": random.choice(lifecycle_statuses),
        "health_check": random.choice(health_statuses),
        "current_location": location,
        "last_location": generate_crop_location() if random.random() < 0.4 else None,
        "recipe_version_id": None,  # No recipe versions available
        "accumulated_light_hours": random.uniform(100, 2000),
        "accumulated_water_hours": random.uniform(50, 500),
        "notes": f"Crop {i+1} - {random.choice(['Growing well', 'Needs attention', 'Excellent progress', 'Monitor closely', 'Ready for harvest'])}" if random.random() < 0.6 else None,
        **dates
    }
    crop_seeds.append(crop_data)

# Crop measurement seed data
crop_measurement_seeds = []
for i in range(200):  # More measurements than crops for historical data
    measurements = generate_crop_measurements()
    crop_measurement_seeds.append(measurements)

# Crop history seed data
crop_history_seeds = []
events = [
    "Seeded", "Germinated", "Transplanted", "Watered", "Fertilized", 
    "Pruned", "Harvested", "Health check", "Location changed", "Recipe updated"
]
performers = ["System", "John Doe", "Jane Smith", "Robot #1", "Automated System", "Technician A"]

for crop_id in range(1, 151):  # For each crop
    num_events = random.randint(3, 15)  # 3-15 events per crop
    
    for event_idx in range(num_events):
        timestamp = datetime.now() - timedelta(
            days=random.randint(1, 100),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        event_data = {
            "crop_id": crop_id,
            "timestamp": timestamp,
            "event": random.choice(events),
            "performed_by": random.choice(performers),
            "notes": f"Event details for crop {crop_id}" if random.random() < 0.7 else None
        }
        crop_history_seeds.append(event_data)

# Crop snapshot seed data for timelapse functionality
crop_snapshot_seeds = []
for crop_id in range(1, 151):  # For each crop
    # Generate daily snapshots for the last 60 days
    for day in range(60):
        timestamp = datetime.now() - timedelta(days=day)
        
        snapshot_data = {
            "crop_id": crop_id,
            "timestamp": timestamp,
            "lifecycle_status": random.choice(lifecycle_statuses),
            "health_status": random.choice(health_statuses),
            "recipe_version_id": None,
            "location": generate_crop_location(),
            "measurements_id": random.randint(1, 200),  # Link to measurement data
            "accumulated_light_hours": random.uniform(100 + day * 5, 2000 + day * 10),
            "accumulated_water_hours": random.uniform(50 + day * 2, 500 + day * 5),
            "image_url": f"https://storage.example.com/crops/{crop_id}/day_{60-day}.jpg" if random.random() < 0.8 else None
        }
        crop_snapshot_seeds.append(snapshot_data)

# Environmental metrics for snapshots (simulated recipe version data)
environmental_metrics_seeds = []
for i in range(1000):  # Large dataset for performance testing
    env_data = {
        "air_temperature": random.uniform(18.0, 26.0),
        "humidity": random.uniform(60.0, 80.0),
        "co2": random.uniform(800, 1200),
        "water_temperature": random.uniform(18.0, 24.0),
        "ph": random.uniform(5.5, 7.0),
        "ec": random.uniform(1.0, 2.5)
    }
    environmental_metrics_seeds.append(env_data)