"""Seed data for SeedType model using Faker"""
from typing import List, Dict, Any
from faker import Faker
from datetime import datetime

fake = Faker()

# Define some realistic seed varieties for vertical farming
SEED_VARIETIES = [
    # Leafy Greens
    {"name": "Butter Lettuce", "variety": "Boston Bibb", "category": "leafy_greens", "days_to_harvest": 45},
    {"name": "Romaine Lettuce", "variety": "Parris Island Cos", "category": "leafy_greens", "days_to_harvest": 50},
    {"name": "Spinach", "variety": "Space", "category": "leafy_greens", "days_to_harvest": 30},
    {"name": "Arugula", "variety": "Astro", "category": "leafy_greens", "days_to_harvest": 25},
    {"name": "Kale", "variety": "Red Russian", "category": "leafy_greens", "days_to_harvest": 40},
    {"name": "Swiss Chard", "variety": "Bright Lights", "category": "leafy_greens", "days_to_harvest": 35},
    
    # Herbs
    {"name": "Basil", "variety": "Genovese", "category": "herbs", "days_to_harvest": 28},
    {"name": "Cilantro", "variety": "Slow Bolt", "category": "herbs", "days_to_harvest": 21},
    {"name": "Parsley", "variety": "Flat Leaf Italian", "category": "herbs", "days_to_harvest": 35},
    {"name": "Mint", "variety": "Spearmint", "category": "herbs", "days_to_harvest": 30},
    {"name": "Oregano", "variety": "Greek", "category": "herbs", "days_to_harvest": 40},
    
    # Microgreens
    {"name": "Pea Shoots", "variety": "Dwarf Grey Sugar", "category": "microgreens", "days_to_harvest": 14},
    {"name": "Sunflower Microgreens", "variety": "Black Oil", "category": "microgreens", "days_to_harvest": 12},
    {"name": "Radish Microgreens", "variety": "Red Rambo", "category": "microgreens", "days_to_harvest": 10},
    {"name": "Broccoli Microgreens", "variety": "De Cicco", "category": "microgreens", "days_to_harvest": 15},
    
    # Fruiting Plants
    {"name": "Cherry Tomato", "variety": "Sweet 100", "category": "fruiting", "days_to_harvest": 65},
    {"name": "Strawberry", "variety": "Albion", "category": "fruiting", "days_to_harvest": 60},
    {"name": "Pepper", "variety": "Mini Bell", "category": "fruiting", "days_to_harvest": 70},
    {"name": "Cucumber", "variety": "Suyo Long", "category": "fruiting", "days_to_harvest": 55},
]

SUPPLIERS = [
    "Johnny's Seeds",
    "Hydrofarm Seed Co",
    "True Leaf Market",
    "Eden Brothers",
    "Burpee Seeds",
    "Ferry-Morse",
    "Botanical Interests",
    "Southern Exposure",
    "High Mowing Seeds",
    "Mountain Valley Seed"
]

def generate_seed_types(count: int = None) -> List[Dict[str, Any]]:
    """Generate seed type data using Faker and predefined varieties"""
    if count is None:
        count = len(SEED_VARIETIES)
    
    seed_types = []
    
    for i in range(count):
        # Use predefined varieties first, then generate random ones
        if i < len(SEED_VARIETIES):
            variety_data = SEED_VARIETIES[i]
            name = variety_data["name"]
            variety = variety_data["variety"]
            category = variety_data["category"]
        else:
            # Generate additional random seed types
            name = fake.word().title() + " " + fake.random_element(["Lettuce", "Herb", "Green", "Plant"])
            variety = fake.word().title() + " " + fake.word().title()
            category = fake.random_element(["leafy_greens", "herbs", "microgreens", "fruiting"])
        
        seed_type = {
            "name": name,
            "variety": variety,
            "supplier": fake.random_element(SUPPLIERS),
            "batch_id": f"BT{fake.random_int(1000, 9999)}-{fake.random_int(100, 999)}",
        }
        
        seed_types.append(seed_type)
    
    return seed_types

# Generate the actual seed data
seed_type_seeds = generate_seed_types()