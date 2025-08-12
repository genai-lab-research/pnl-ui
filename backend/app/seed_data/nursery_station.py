#!/usr/bin/env python3
"""
Nursery station seeding data for development and testing.
Provides comprehensive test data for nursery station functionality.
"""

import random
from datetime import date, datetime, timedelta
from typing import List, Dict, Any
from faker import Faker

fake = Faker()

def generate_nursery_tray_location(shelf: str = None, slot: int = None) -> Dict[str, Any]:
    """Generate realistic nursery tray location data."""
    if not shelf:
        shelf = random.choice(["upper", "lower"])
    if not slot:
        slot = random.randint(1, 8)
    
    return {
        "shelf": shelf,
        "slot_number": slot,
        "location_type": "nursery_station"
    }

def generate_nursery_tray_status() -> str:
    """Generate realistic tray status."""
    statuses = ["active", "ready", "germinating", "growing", "full", "empty", "maintenance"]
    return random.choice(statuses)

def generate_tray_type() -> str:
    """Generate realistic tray type."""
    types = ["seed_tray", "nursery_tray", "propagation_tray", "specialty_tray"]
    return random.choice(types)

def generate_utilization_percentage() -> float:
    """Generate realistic utilization percentage."""
    # Most trays should be well utilized in nursery
    return random.uniform(60.0, 100.0)

def generate_nursery_crop_data(tray_id: int, position: int) -> Dict[str, Any]:
    """Generate realistic nursery crop data."""
    row = (position - 1) // 10 + 1  # 10 crops per row
    column = (position - 1) % 10 + 1
    
    seed_date = date.today() - timedelta(days=random.randint(5, 30))
    age_days = (date.today() - seed_date).days
    
    # Planned transplanting is usually 14-21 days after seeding
    transplanting_planned = seed_date + timedelta(days=random.randint(14, 21))
    
    # Calculate if overdue
    overdue_days = max(0, (date.today() - transplanting_planned).days) if transplanting_planned < date.today() else 0
    
    lifecycle_statuses = ["germinating", "sprouting", "seedling", "ready_for_transplant", "overdue"]
    health_checks = ["excellent", "good", "fair", "needs_attention", "critical"]
    
    return {
        "tray_id": tray_id,
        "row": row,
        "column": column,
        "seed_type_id": random.randint(1, 10),
        "seed_date": seed_date,
        "transplanting_date_planned": transplanting_planned,
        "lifecycle_status": random.choice(lifecycle_statuses),
        "health_check": random.choice(health_checks),
        "current_location": {
            "type": "nursery_tray",
            "tray_id": tray_id,
            "row": row,
            "column": column
        },
        "age_days": age_days,
        "overdue_days": overdue_days if overdue_days > 0 else None,
        "accumulated_light_hours": random.uniform(50, 200),
        "accumulated_water_hours": random.uniform(10, 50),
        "notes": f"Nursery crop in tray {tray_id}, position {row}x{column}" if random.random() < 0.3 else None
    }

# Nursery station tray seed data
nursery_tray_seeds = []
tray_id_counter = 1

# Generate trays for different containers
for container_id in range(1, 4):  # 3 containers
    # Upper shelf trays (8 slots)
    for slot in range(1, 9):
        if random.random() < 0.85:  # 85% chance of having a tray
            tray_data = {
                "id": tray_id_counter,
                "container_id": container_id,
                "rfid_tag": f"NT-{container_id:02d}-{slot:02d}-{random.randint(1000, 9999)}",
                "location": generate_nursery_tray_location("upper", slot),
                "utilization_pct": generate_utilization_percentage(),
                "provisioned_at": datetime.now() - timedelta(
                    days=random.randint(1, 30),
                    hours=random.randint(0, 23)
                ),
                "status": generate_nursery_tray_status(),
                "capacity": random.choice([100, 150, 200]),  # Common nursery tray capacities
                "tray_type": generate_tray_type()
            }
            nursery_tray_seeds.append(tray_data)
            tray_id_counter += 1
    
    # Lower shelf trays (8 slots)
    for slot in range(1, 9):
        if random.random() < 0.80:  # 80% chance of having a tray
            tray_data = {
                "id": tray_id_counter,
                "container_id": container_id,
                "rfid_tag": f"NT-{container_id:02d}-L{slot:02d}-{random.randint(1000, 9999)}",
                "location": generate_nursery_tray_location("lower", slot),
                "utilization_pct": generate_utilization_percentage(),
                "provisioned_at": datetime.now() - timedelta(
                    days=random.randint(1, 30),
                    hours=random.randint(0, 23)
                ),
                "status": generate_nursery_tray_status(),
                "capacity": random.choice([100, 150, 200]),
                "tray_type": generate_tray_type()
            }
            nursery_tray_seeds.append(tray_data)
            tray_id_counter += 1
    
    # Off-shelf trays (trays not currently placed)
    for _ in range(random.randint(2, 5)):
        tray_data = {
            "id": tray_id_counter,
            "container_id": container_id,
            "rfid_tag": f"NT-{container_id:02d}-OFF-{random.randint(1000, 9999)}",
            "location": None,  # Off-shelf
            "utilization_pct": generate_utilization_percentage(),
            "provisioned_at": datetime.now() - timedelta(
                days=random.randint(1, 60),
                hours=random.randint(0, 23)
            ),
            "status": random.choice(["storage", "cleaning", "maintenance", "ready"]),
            "capacity": random.choice([100, 150, 200]),
            "tray_type": generate_tray_type()
        }
        nursery_tray_seeds.append(tray_data)
        tray_id_counter += 1

# Nursery crop seed data
nursery_crop_seeds = []
crop_id_counter = 1

for tray in nursery_tray_seeds:
    if tray["location"] is not None:  # Only for trays currently placed
        # Generate crops for this tray based on capacity and utilization
        num_crops = int(tray["capacity"] * (tray["utilization_pct"] / 100.0))
        
        for position in range(1, num_crops + 1):
            crop_data = generate_nursery_crop_data(tray["id"], position)
            crop_data["id"] = crop_id_counter
            nursery_crop_seeds.append(crop_data)
            crop_id_counter += 1

# Tray snapshot seed data for time-lapse functionality
tray_snapshot_seeds = []
snapshot_id_counter = 1

for tray in nursery_tray_seeds:
    if tray["location"] is not None:  # Only for placed trays
        # Generate daily snapshots for the last 30 days
        for day in range(30):
            timestamp = datetime.now() - timedelta(days=day)
            
            # Simulate changing crop counts and utilization over time
            base_crop_count = int(tray["capacity"] * (tray["utilization_pct"] / 100.0))
            day_variation = random.randint(-5, 5)
            crop_count = max(0, base_crop_count + day_variation)
            
            utilization = (crop_count / tray["capacity"]) * 100.0 if tray["capacity"] > 0 else 0.0
            
            snapshot_data = {
                "id": snapshot_id_counter,
                "timestamp": timestamp,
                "container_id": tray["container_id"],
                "tray_id": tray["id"],
                "rfid_tag": tray["rfid_tag"],
                "location": tray["location"],
                "crop_count": crop_count,
                "utilization_percentage": utilization,
                "status": random.choice(["active", "growing", "ready", "full"]) if day < 15 else tray["status"]
            }
            tray_snapshot_seeds.append(snapshot_data)
            snapshot_id_counter += 1

# Generate additional performance test data
performance_test_seeds = {
    "large_tray_dataset": [],
    "large_crop_dataset": [],
    "large_snapshot_dataset": []
}

# Large dataset for performance testing (2000+ records)
for i in range(2000):
    container_id = random.randint(1, 10)
    tray_data = {
        "id": tray_id_counter + i,
        "container_id": container_id,
        "rfid_tag": f"PERF-{container_id:02d}-{i:04d}",
        "location": generate_nursery_tray_location() if random.random() < 0.7 else None,
        "utilization_pct": generate_utilization_percentage(),
        "provisioned_at": datetime.now() - timedelta(
            days=random.randint(1, 365),
            hours=random.randint(0, 23)
        ),
        "status": generate_nursery_tray_status(),
        "capacity": random.choice([100, 150, 200]),
        "tray_type": generate_tray_type()
    }
    performance_test_seeds["large_tray_dataset"].append(tray_data)

# Summary statistics for seeded data
seed_summary = {
    "total_nursery_trays": len(nursery_tray_seeds),
    "placed_trays": len([t for t in nursery_tray_seeds if t["location"] is not None]),
    "off_shelf_trays": len([t for t in nursery_tray_seeds if t["location"] is None]),
    "total_nursery_crops": len(nursery_crop_seeds),
    "total_tray_snapshots": len(tray_snapshot_seeds),
    "containers_with_nursery_data": 3,
    "performance_test_trays": len(performance_test_seeds["large_tray_dataset"]),
    "average_utilization": sum(t["utilization_pct"] for t in nursery_tray_seeds) / len(nursery_tray_seeds) if nursery_tray_seeds else 0
}

print(f"Nursery Station Seed Data Summary:")
print(f"- Total Nursery Trays: {seed_summary['total_nursery_trays']}")
print(f"- Placed Trays: {seed_summary['placed_trays']}")
print(f"- Off-shelf Trays: {seed_summary['off_shelf_trays']}")
print(f"- Total Nursery Crops: {seed_summary['total_nursery_crops']}")
print(f"- Total Tray Snapshots: {seed_summary['total_tray_snapshots']}")
print(f"- Average Utilization: {seed_summary['average_utilization']:.1f}%")