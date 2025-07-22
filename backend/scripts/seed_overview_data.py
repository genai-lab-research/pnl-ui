#!/usr/bin/env python3
"""
Enhanced database seeding script for Container Overview functionality.
This script specifically seeds data needed for the Container Overview Tab API.
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random
from faker import Faker

# Add the parent directory to the path to import from app
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.core.db import AsyncSessionLocal
from app.models.container import Container
from app.models.tenant import Tenant
from app.models.activity_log import ActivityLog
from app.models.snapshots import MetricSnapshot, ContainerSnapshot
from app.models.environment_link import EnvironmentLink

fake = Faker()

# Sample data for seeding
ACTION_TYPES = [
    "seeding", "transplanting", "harvesting", "watering", "lighting_adjustment",
    "temperature_adjustment", "humidity_adjustment", "co2_adjustment", "maintenance",
    "inspection", "cleaning", "nutrient_adjustment", "pest_control", "pruning"
]

ACTOR_TYPES = ["user", "system", "automation", "technician", "researcher", "ai_agent"]

ENVIRONMENT_SYSTEMS = {
    "fa": {"status": "connected", "version": "2.1.3", "endpoint": "https://fa.example.com/api"},
    "pya": {"status": "connected", "version": "1.8.2", "endpoint": "https://pya.example.com/api"},
    "aws": {"status": "connected", "region": "us-west-2", "account": "123456789012"},
    "mbai": {"status": "disconnected", "last_sync": "2025-07-07T10:30:00Z"},
    "fh": {"status": "connected", "version": "3.2.1", "endpoint": "https://fh.example.com/api"}
}


async def seed_tenants(session: AsyncSession) -> Dict[int, int]:
    """Seed tenants if they don't exist"""
    print("Checking/seeding tenants...")
    
    result = await session.execute(select(Tenant))
    existing_tenants = result.scalars().all()
    
    if existing_tenants:
        print(f"Found {len(existing_tenants)} existing tenants")
        return {i: tenant.id for i, tenant in enumerate(existing_tenants)}
    
    # Create sample tenants
    tenant_names = ["AgroTech Solutions", "GreenSpace Industries", "Urban Harvest Co.", "FreshLeaf Farms"]
    tenant_mapping = {}
    
    for i, name in enumerate(tenant_names):
        tenant = Tenant(name=name)
        session.add(tenant)
        await session.flush()
        tenant_mapping[i] = tenant.id
        print(f"  Created tenant: {name} (ID: {tenant.id})")
    
    await session.commit()
    return tenant_mapping


async def seed_containers_basic(session: AsyncSession, tenant_mapping: Dict[int, int]) -> Dict[int, int]:
    """Seed basic containers if they don't exist"""
    print("Checking/seeding containers...")
    
    result = await session.execute(select(Container))
    existing_containers = result.scalars().all()
    
    if existing_containers:
        print(f"Found {len(existing_containers)} existing containers")
        return {i: container.id for i, container in enumerate(existing_containers)}
    
    # Create sample containers
    container_data = [
        {
            "name": "Container-Alpha-01",
            "type": "physical",
            "status": "active",
            "purpose": "production",
            "tenant_id": list(tenant_mapping.values())[0] if tenant_mapping else 1,
            "location": {"city": "San Francisco", "country": "USA", "address": "123 Tech Street"},
            "ecosystem_connected": True,
            "shadow_service_enabled": True,
            "robotics_simulation_enabled": False
        },
        {
            "name": "Container-Beta-02",
            "type": "virtual",
            "status": "active",
            "purpose": "development",
            "tenant_id": list(tenant_mapping.values())[1] if len(tenant_mapping) > 1 else 1,
            "location": {"city": "Austin", "country": "USA", "address": "456 Innovation Blvd"},
            "ecosystem_connected": False,
            "shadow_service_enabled": False,
            "robotics_simulation_enabled": True
        },
        {
            "name": "Container-Gamma-03",
            "type": "physical",
            "status": "maintenance",
            "purpose": "research",
            "tenant_id": list(tenant_mapping.values())[2] if len(tenant_mapping) > 2 else 1,
            "location": {"city": "Seattle", "country": "USA", "address": "789 Research Way"},
            "ecosystem_connected": True,
            "shadow_service_enabled": True,
            "robotics_simulation_enabled": True
        }
    ]
    
    container_mapping = {}
    for i, data in enumerate(container_data):
        container = Container(**data)
        session.add(container)
        await session.flush()
        container_mapping[i] = container.id
        print(f"  Created container: {data['name']} (ID: {container.id})")
    
    await session.commit()
    return container_mapping


async def seed_activity_logs(session: AsyncSession, container_mapping: Dict[int, int]):
    """Seed activity logs for containers"""
    print("Seeding activity logs...")
    
    # Check if activity logs already exist
    result = await session.execute(select(ActivityLog))
    existing_logs = result.scalars().all()
    
    if existing_logs:
        print(f"Found {len(existing_logs)} existing activity logs, skipping...")
        return
    
    # Generate 50-100 activity logs per container over the last 30 days
    base_time = datetime.now()
    
    for container_index, container_id in container_mapping.items():
        num_activities = random.randint(50, 100)
        
        for _ in range(num_activities):
            # Random timestamp in the last 30 days
            days_ago = random.randint(0, 30)
            hours_ago = random.randint(0, 23)
            minutes_ago = random.randint(0, 59)
            timestamp = base_time - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
            
            action_type = random.choice(ACTION_TYPES)
            actor_type = random.choice(ACTOR_TYPES)
            actor_id = f"{actor_type}_{random.randint(1000, 9999)}"
            
            # Generate realistic descriptions
            descriptions = {
                "seeding": f"Seeded {random.randint(10, 50)} {fake.color_name()} lettuce seeds in nursery station",
                "harvesting": f"Harvested {random.randint(5, 25)} mature plants from cultivation area",
                "watering": f"Automated watering cycle completed - {random.randint(50, 200)}ml per plant",
                "temperature_adjustment": f"Temperature adjusted to {random.randint(18, 28)}°C for optimal growth",
                "maintenance": f"Routine maintenance performed on {fake.random_element(['LED panels', 'water pumps', 'air circulation'])}"
            }
            
            description = descriptions.get(action_type, f"Performed {action_type} operation")
            
            activity = ActivityLog(
                container_id=container_id,
                timestamp=timestamp,
                action_type=action_type,
                actor_type=actor_type,
                actor_id=actor_id,
                description=description
            )
            session.add(activity)
        
        print(f"  Created {num_activities} activity logs for container {container_id}")
    
    await session.commit()
    print("Activity logs seeded successfully!")


async def seed_metric_snapshots(session: AsyncSession, container_mapping: Dict[int, int]):
    """Seed metric snapshots for containers"""
    print("Seeding metric snapshots...")
    
    # Check if metric snapshots already exist
    result = await session.execute(select(MetricSnapshot))
    existing_snapshots = result.scalars().all()
    
    if existing_snapshots:
        print(f"Found {len(existing_snapshots)} existing metric snapshots, skipping...")
        return
    
    # Generate hourly snapshots for the last 7 days
    base_time = datetime.now()
    hours_to_generate = 7 * 24  # 7 days worth of hourly data
    
    for container_index, container_id in container_mapping.items():
        # Base values that will fluctuate
        base_temp = random.uniform(20.0, 26.0)
        base_humidity = random.uniform(60.0, 80.0)
        base_co2 = random.uniform(350.0, 450.0)
        cumulative_yield = 0.0
        
        for hour in range(hours_to_generate):
            timestamp = base_time - timedelta(hours=hour)
            
            # Simulate realistic fluctuations
            temp_variation = random.uniform(-2.0, 2.0)
            humidity_variation = random.uniform(-5.0, 5.0)
            co2_variation = random.uniform(-20.0, 20.0)
            
            # Yield grows over time with some randomness
            yield_increment = random.uniform(0.01, 0.1) if random.random() > 0.3 else 0.0
            cumulative_yield += yield_increment
            
            # Space utilization varies based on growth cycle
            space_utilization = min(95.0, 10.0 + (hour / hours_to_generate) * 80.0 + random.uniform(-5.0, 5.0))
            
            snapshot = MetricSnapshot(
                container_id=container_id,
                timestamp=timestamp,
                air_temperature=max(15.0, min(35.0, base_temp + temp_variation)),
                humidity=max(30.0, min(95.0, base_humidity + humidity_variation)),
                co2=max(300.0, min(600.0, base_co2 + co2_variation)),
                yield_kg=round(cumulative_yield, 2),
                space_utilization_pct=max(0.0, min(100.0, space_utilization))
            )
            session.add(snapshot)
        
        print(f"  Created {hours_to_generate} metric snapshots for container {container_id}")
    
    await session.commit()
    print("Metric snapshots seeded successfully!")


async def seed_container_snapshots(session: AsyncSession, container_mapping: Dict[int, int]):
    """Seed container snapshots"""
    print("Seeding container snapshots...")
    
    # Check if container snapshots already exist
    result = await session.execute(select(ContainerSnapshot))
    existing_snapshots = result.scalars().all()
    
    if existing_snapshots:
        print(f"Found {len(existing_snapshots)} existing container snapshots, skipping...")
        return
    
    # Generate daily snapshots for the last 30 days
    base_time = datetime.now()
    days_to_generate = 30
    
    for container_index, container_id in container_mapping.items():
        # Get container details
        result = await session.execute(select(Container).where(Container.id == container_id))
        container = result.scalar_one()
        
        for day in range(days_to_generate):
            timestamp = base_time - timedelta(days=day)
            
            # Generate realistic snapshot data
            yield_kg = random.uniform(0.5, 5.0) * (day + 1) / days_to_generate
            space_util = random.uniform(10.0, 95.0)
            
            snapshot = ContainerSnapshot(
                container_id=container_id,
                timestamp=timestamp,
                type=container.type,
                status=container.status,
                tenant_id=container.tenant_id,
                purpose=container.purpose,
                location=container.location,
                shadow_service_enabled=container.shadow_service_enabled,
                copied_environment_from=container.copied_environment_from,
                robotics_simulation_enabled=container.robotics_simulation_enabled,
                ecosystem_settings=container.ecosystem_settings,
                yield_kg=round(yield_kg, 2),
                space_utilization_pct=round(space_util, 1),
                tray_ids=[i for i in range(1, random.randint(5, 15))],
                panel_ids=[i for i in range(1, random.randint(3, 8))]
            )
            session.add(snapshot)
        
        print(f"  Created {days_to_generate} container snapshots for container {container_id}")
    
    await session.commit()
    print("Container snapshots seeded successfully!")


async def seed_environment_links(session: AsyncSession, container_mapping: Dict[int, int]):
    """Seed environment links for containers"""
    print("Seeding environment links...")
    
    # Check if environment links already exist
    result = await session.execute(select(EnvironmentLink))
    existing_links = result.scalars().all()
    
    if existing_links:
        print(f"Found {len(existing_links)} existing environment links, skipping...")
        return
    
    for container_index, container_id in container_mapping.items():
        # Randomly decide which systems are connected
        systems = {}
        for system, config in ENVIRONMENT_SYSTEMS.items():
            if random.random() > 0.3:  # 70% chance of being connected
                systems[system] = config.copy()
                if system == "mbai" and random.random() > 0.5:
                    systems[system]["status"] = "connected"
                    systems[system]["last_sync"] = fake.date_time_between(start_date='-1d').isoformat() + "Z"
        
        env_link = EnvironmentLink(
            container_id=container_id,
            **systems
        )
        session.add(env_link)
        print(f"  Created environment links for container {container_id} with {len(systems)} systems")
    
    await session.commit()
    print("Environment links seeded successfully!")


async def seed_overview_data():
    """Main function to seed container overview data"""
    print("Starting container overview data seeding process...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Step 1: Ensure tenants exist
            tenant_mapping = await seed_tenants(session)
            
            # Step 2: Ensure containers exist
            container_mapping = await seed_containers_basic(session, tenant_mapping)
            
            # Step 3: Seed activity logs
            await seed_activity_logs(session, container_mapping)
            
            # Step 4: Seed metric snapshots
            await seed_metric_snapshots(session, container_mapping)
            
            # Step 5: Seed container snapshots
            await seed_container_snapshots(session, container_mapping)
            
            # Step 6: Seed environment links
            await seed_environment_links(session, container_mapping)
            
            print("\n🌱 Container overview data seeding completed successfully!")
            print(f"Created comprehensive data for {len(container_mapping)} containers")
            
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(seed_overview_data())