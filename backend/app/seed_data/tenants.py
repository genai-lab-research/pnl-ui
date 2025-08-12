"""Seed data for Tenant model using Faker"""
from typing import List, Dict, Any
from faker import Faker

fake = Faker()

# Define some realistic tenant company names for vertical farming
TENANT_COMPANIES = [
    "AgriTech Solutions",
    "Urban Harvest Co",
    "Green Future Farms",
    "Sustainable Growth Systems",
    "Vertical Farming Innovations",
    "FreshProduce Technologies",
    "BioGrow Enterprises",
    "Smart Farm Solutions",
    "Hydroponic Systems Inc",
    "EcoFarm Technologies"
]

def generate_tenants(count: int = 10) -> List[Dict[str, Any]]:
    """Generate tenant data using predefined company names and Faker"""
    tenants = []
    
    # Use predefined company names first
    for i in range(count):
        if i < len(TENANT_COMPANIES):
            name = TENANT_COMPANIES[i]
        else:
            # Generate additional tenant names
            name = f"{fake.word().title()} {fake.random_element(['Farms', 'AgTech', 'Solutions', 'Systems', 'Innovations'])}"
        
        tenant = {
            "id": 1000 + i + 1,  # Start from 1001
            "name": name,
        }
        
        tenants.append(tenant)
    
    return tenants

# Generate the actual tenant data
tenant_seeds = generate_tenants(10)