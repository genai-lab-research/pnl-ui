"""Seed data for Container model using Faker"""
from typing import List, Dict, Any
from datetime import datetime
from faker import Faker
import random

fake = Faker()

# Define cities suitable for vertical farming
FARMING_CITIES = [
    {"city": "San Francisco", "country": "USA", "state": "CA"},
    {"city": "Austin", "country": "USA", "state": "TX"},
    {"city": "Seattle", "country": "USA", "state": "WA"},
    {"city": "Denver", "country": "USA", "state": "CO"},
    {"city": "Portland", "country": "USA", "state": "OR"},
    {"city": "Boston", "country": "USA", "state": "MA"},
    {"city": "Atlanta", "country": "USA", "state": "GA"},
    {"city": "Phoenix", "country": "USA", "state": "AZ"},
    {"city": "Toronto", "country": "Canada", "state": "ON"},
    {"city": "Vancouver", "country": "Canada", "state": "BC"},
    {"city": "Amsterdam", "country": "Netherlands", "state": "NH"},
    {"city": "Copenhagen", "country": "Denmark", "state": "DK"},
    {"city": "Singapore", "country": "Singapore", "state": "SG"},
    {"city": "Tokyo", "country": "Japan", "state": "TK"},
    {"city": "Sydney", "country": "Australia", "state": "NSW"},
]

CONTAINER_PREFIXES = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa"]
TENANT_IDS = [1001, 1002, 1003, 1004, 1005]

def generate_containers(count: int = 12) -> List[Dict[str, Any]]:
    """Generate container data using Faker"""
    containers = []
    
    for i in range(count):
        # Generate container name
        prefix = fake.random_element(CONTAINER_PREFIXES)
        suffix = f"{i+1:03d}"
        name = f"Container-{prefix}-{suffix}"
        
        # Choose physical or virtual (70% physical, 30% virtual)
        container_type = fake.random_element(elements=["physical", "physical", "physical", "virtual"])
        
        # Generate location for physical containers
        location = None
        if container_type == "physical":
            city_data = fake.random_element(FARMING_CITIES)
            location = {
                "city": city_data["city"],
                "country": city_data["country"],
                "address": f"{fake.building_number()} {fake.street_name()}"
            }
        
        # Generate realistic notes
        purposes = ["leafy greens", "herbs", "microgreens", "fruiting plants", "research crops"]
        activities = ["production", "testing", "research", "development", "experimentation"]
        notes_templates = [
            f"Specialized container for {fake.random_element(purposes)} {fake.random_element(activities)}",
            f"High-efficiency container optimized for {fake.random_element(purposes)}",
            f"Container used for {fake.random_element(activities)} of {fake.random_element(purposes)}",
            f"Advanced hydroponic system for {fake.random_element(purposes)}",
            f"Climate-controlled environment for {fake.random_element(activities)}"
        ]
        
        container = {
            "name": name,
            "tenant_id": fake.random_element(TENANT_IDS),
            "type": container_type,
            "purpose": fake.random_element(["development", "research", "production"]),
            "location": location,
            "notes": fake.random_element(notes_templates) if fake.boolean(chance_of_getting_true=80) else None,
            "status": fake.random_element(elements=["active", "active", "active", "maintenance", "created"]),
            
            # Settings
            "shadow_service_enabled": fake.boolean(chance_of_getting_true=60),
            "copied_environment_from": random.randint(1, max(1, i)) if fake.boolean(chance_of_getting_true=30) and i > 0 else None,
            "robotics_simulation_enabled": fake.boolean(chance_of_getting_true=70),
            "ecosystem_connected": fake.boolean(chance_of_getting_true=80),
            "ecosystem_settings": {
                "fa": {"enabled": fake.boolean(chance_of_getting_true=60), "endpoint": f"https://fa-{fake.word()}.example.com"},
                "pya": {"enabled": fake.boolean(chance_of_getting_true=40), "version": fake.random_element(["v2", "v3", "v4"])},
                "aws": {"enabled": fake.boolean(chance_of_getting_true=70), "region": fake.random_element(["us-west-1", "us-west-2", "us-east-1", "eu-west-1"])},
                "mbai": {"enabled": fake.boolean(chance_of_getting_true=50), "api_key": "encrypted" if fake.boolean() else None},
                "fh": {"enabled": fake.boolean(chance_of_getting_true=60), "version": "v2"}
            } if fake.boolean(chance_of_getting_true=70) else None,
            
            # Seed type relationships (1-based indices for the seeding script)
            "seed_type_ids": random.sample(range(1, 19), random.randint(2, 5))  # 2-5 random seed types
        }
        
        containers.append(container)
    
    return containers

def generate_alerts(container_count: int = 12) -> List[Dict[str, Any]]:
    """Generate alert data for containers"""
    alerts = []
    
    # Generate alerts for about 40% of containers
    containers_with_alerts = random.sample(range(1, container_count + 1), int(container_count * 0.4))
    
    alert_templates = [
        {"severity": "critical", "descriptions": [
            "Temperature sensor malfunction detected",
            "Critical system failure in hydroponic pump",
            "CO2 levels critically low",
            "Power supply voltage irregularities detected"
        ]},
        {"severity": "high", "descriptions": [
            "Temperature exceeding optimal range for extended period",
            "Humidity levels too high, mold risk detected",
            "Nutrient solution pH out of range",
            "LED lighting system showing degraded performance"
        ]},
        {"severity": "medium", "descriptions": [
            "Minor temperature fluctuations detected",
            "Water level in reservoir needs attention",
            "Air circulation fan operating at reduced efficiency",
            "Scheduled maintenance reminder"
        ]},
        {"severity": "low", "descriptions": [
            "Routine system check completed with minor notes",
            "Sensor calibration recommended",
            "Container capacity approaching 80%",
            "Growth rate slightly below average"
        ]}
    ]
    
    for container_id in containers_with_alerts:
        # Generate 1-3 alerts per container
        num_alerts = random.randint(1, 3)
        
        for _ in range(num_alerts):
            severity_data = fake.random_element(alert_templates)
            severity = severity_data["severity"]
            description = fake.random_element(severity_data["descriptions"])
            
            # Most alerts are active, some are resolved
            active = fake.boolean(chance_of_getting_true=75)
            
            alert = {
                "container_id": container_id,
                "description": description,
                "severity": severity,
                "active": active,
                "related_object": {
                    "sensor_id": f"SENS_{fake.random_int(1000, 9999)}",
                    "location": fake.random_element(["nursery", "cultivation_area", "control_room"]),
                    "component": fake.random_element(["temperature_sensor", "humidity_sensor", "ph_sensor", "pump", "led_lights", "fan"])
                } if fake.boolean(chance_of_getting_true=60) else None
            }
            
            alerts.append(alert)
    
    return alerts

# Generate the actual seed data - hundreds of containers
container_seeds = generate_containers(500)  # Generate 500 containers for testing
alert_seeds = generate_alerts(500)