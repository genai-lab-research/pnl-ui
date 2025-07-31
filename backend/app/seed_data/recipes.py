from datetime import datetime, timedelta, date
from faker import Faker
import random
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.recipe import RecipeMaster, RecipeVersion
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.models.crop_history import CropHistory
from app.models.snapshots import CropSnapshot

fake = Faker()

# Recipe configuration data
CROP_TYPES = [
    "Lettuce", "Spinach", "Kale", "Arugula", "Basil", "Cilantro", 
    "Parsley", "Mint", "Tomato", "Cucumber", "Pepper", "Microgreens"
]

RECIPE_TEMPLATES = {
    "Lettuce": {
        "tray_density": (150, 200),
        "air_temperature": (18, 22),
        "humidity": (60, 70),
        "co2": (800, 1200),
        "water_temperature": (18, 20),
        "ec": (1.2, 1.8),
        "ph": (5.5, 6.5),
        "water_hours": (2, 4),
        "light_hours": (14, 16)
    },
    "Spinach": {
        "tray_density": (100, 150),
        "air_temperature": (15, 20),
        "humidity": (50, 65),
        "co2": (600, 1000),
        "water_temperature": (16, 18),
        "ec": (1.0, 1.6),
        "ph": (6.0, 7.0),
        "water_hours": (3, 5),
        "light_hours": (12, 14)
    },
    "Basil": {
        "tray_density": (80, 120),
        "air_temperature": (20, 25),
        "humidity": (60, 75),
        "co2": (1000, 1500),
        "water_temperature": (20, 22),
        "ec": (1.4, 2.0),
        "ph": (5.5, 6.5),
        "water_hours": (2, 3),
        "light_hours": (16, 18)
    }
}

LIFECYCLE_STATUSES = ["seeded", "germinated", "vegetative", "flowering", "ready_to_harvest", "harvested"]
HEALTH_STATUSES = ["excellent", "good", "fair", "poor", "diseased"]


async def create_recipe_masters(session: AsyncSession, count: int = 50):
    """Create recipe masters with varied crop types"""
    recipe_masters = []
    
    for i in range(count):
        crop_type = random.choice(CROP_TYPES)
        recipe_master = RecipeMaster(
            name=f"{crop_type} Recipe {i+1}",
            crop_type=crop_type,
            notes=fake.text(max_nb_chars=200) if random.random() > 0.3 else None
        )
        recipe_masters.append(recipe_master)
    
    session.add_all(recipe_masters)
    await session.commit()
    return recipe_masters


async def create_recipe_versions(session: AsyncSession, recipe_masters: list, count: int = 200):
    """Create recipe versions for existing masters"""
    recipe_versions = []
    
    for recipe_master in recipe_masters:
        # Create 2-5 versions per master
        num_versions = random.randint(2, 5)
        
        for version_num in range(1, num_versions + 1):
            template = RECIPE_TEMPLATES.get(recipe_master.crop_type, RECIPE_TEMPLATES["Lettuce"])
            
            valid_from = fake.date_time_between(start_date="-1y", end_date="now")
            valid_to = None
            if version_num < num_versions:  # Not the latest version
                valid_to = valid_from + timedelta(days=random.randint(30, 180))
            
            recipe_version = RecipeVersion(
                recipe_id=recipe_master.id,
                version=f"v{version_num}.{random.randint(0, 9)}",
                valid_from=valid_from,
                valid_to=valid_to,
                tray_density=random.uniform(*template["tray_density"]),
                air_temperature=random.uniform(*template["air_temperature"]),
                humidity=random.uniform(*template["humidity"]),
                co2=random.uniform(*template["co2"]),
                water_temperature=random.uniform(*template["water_temperature"]),
                ec=random.uniform(*template["ec"]),
                ph=random.uniform(*template["ph"]),
                water_hours=random.uniform(*template["water_hours"]),
                light_hours=random.uniform(*template["light_hours"]),
                created_by=fake.name()
            )
            recipe_versions.append(recipe_version)
    
    session.add_all(recipe_versions)
    await session.commit()
    return recipe_versions


async def create_crop_measurements(session: AsyncSession, count: int = 300):
    """Create crop measurement records"""
    measurements = []
    
    for _ in range(count):
        measurement = CropMeasurement(
            radius=random.uniform(2.0, 15.0) if random.random() > 0.3 else None,
            width=random.uniform(5.0, 30.0) if random.random() > 0.3 else None,
            height=random.uniform(3.0, 25.0) if random.random() > 0.3 else None,
            area=random.uniform(10.0, 500.0) if random.random() > 0.3 else None,
            area_estimated=random.uniform(8.0, 450.0) if random.random() > 0.3 else None,
            weight=random.uniform(5.0, 200.0) if random.random() > 0.3 else None
        )
        measurements.append(measurement)
    
    session.add_all(measurements)
    await session.commit()
    return measurements


async def create_crops(session: AsyncSession, recipe_versions: list, measurements: list, seed_type_ids: list, count: int = 500):
    """Create crop records linked to recipe versions"""
    crops = []
    
    for i in range(count):
        seed_date = fake.date_between(start_date="-1y", end_date="-30d")
        
        # Calculate planned dates based on seed date
        transplant_planned = seed_date + timedelta(days=random.randint(14, 28))
        harvest_planned = transplant_planned + timedelta(days=random.randint(30, 90))
        
        # Actual dates (might be None if not yet reached)
        transplant_actual = None
        harvest_actual = None
        
        if fake.boolean(chance_of_getting_true=70):  # 70% chance of being transplanted
            transplant_actual = transplant_planned + timedelta(days=random.randint(-3, 10))
            
            if fake.boolean(chance_of_getting_true=40):  # 40% chance of being harvested
                harvest_actual = harvest_planned + timedelta(days=random.randint(-5, 15))
        
        crop = Crop(
            seed_type_id=random.choice(seed_type_ids) if seed_type_ids else None,
            seed_date=seed_date,
            transplanting_date_planned=transplant_planned,
            transplanting_date=transplant_actual,
            harvesting_date_planned=harvest_planned,
            harvesting_date=harvest_actual,
            lifecycle_status=random.choice(LIFECYCLE_STATUSES),
            health_check=random.choice(HEALTH_STATUSES),
            current_location={
                "container_id": random.randint(1, 10),
                "tray_id": random.randint(1, 50),
                "position": {"x": random.randint(1, 10), "y": random.randint(1, 10)}
            },
            last_location={
                "container_id": random.randint(1, 10),
                "tray_id": random.randint(1, 50),
                "position": {"x": random.randint(1, 10), "y": random.randint(1, 10)}
            } if random.random() > 0.4 else None,
            measurements_id=random.choice(measurements).id if measurements and random.random() > 0.3 else None,
            image_url=f"https://example.com/crops/{i+1}.jpg" if random.random() > 0.5 else None,
            recipe_version_id=random.choice(recipe_versions).id if recipe_versions else None,
            accumulated_light_hours=random.uniform(100, 2000),
            accumulated_water_hours=random.uniform(50, 500),
            notes=fake.text(max_nb_chars=300) if random.random() > 0.6 else None
        )
        crops.append(crop)
    
    session.add_all(crops)
    await session.commit()
    return crops


async def create_crop_history(session: AsyncSession, crops: list, count: int = 1000):
    """Create crop history events"""
    history_events = []
    
    events = [
        "Seeded", "Germinated", "Transplanted", "Watered", "Fertilized", 
        "Pruned", "Health check", "Harvested", "Moved location", "Treatment applied"
    ]
    
    for _ in range(count):
        crop = random.choice(crops)
        event_date = fake.date_time_between(
            start_date=crop.seed_date, 
            end_date="now"
        )
        
        history = CropHistory(
            crop_id=crop.id,
            timestamp=event_date,
            event=random.choice(events),
            performed_by=fake.name(),
            notes=fake.text(max_nb_chars=200) if random.random() > 0.5 else None
        )
        history_events.append(history)
    
    session.add_all(history_events)
    await session.commit()
    return history_events


async def create_crop_snapshots(session: AsyncSession, crops: list, recipe_versions: list, measurements: list, count: int = 800):
    """Create crop snapshots over time"""
    snapshots = []
    
    for _ in range(count):
        crop = random.choice(crops)
        snapshot_date = fake.date_time_between(
            start_date=crop.seed_date,
            end_date="now"
        )
        
        snapshot = CropSnapshot(
            timestamp=snapshot_date,
            crop_id=crop.id,
            lifecycle_status=random.choice(LIFECYCLE_STATUSES),
            health_status=random.choice(HEALTH_STATUSES),
            recipe_version_id=random.choice(recipe_versions).id if recipe_versions else None,
            location={
                "container_id": random.randint(1, 10),
                "tray_id": random.randint(1, 50),
                "position": {"x": random.randint(1, 10), "y": random.randint(1, 10)}
            },
            measurements_id=random.choice(measurements).id if measurements and random.random() > 0.4 else None,
            accumulated_light_hours=random.uniform(50, 1500),
            accumulated_water_hours=random.uniform(20, 300),
            image_url=f"https://example.com/snapshots/{fake.uuid4()}.jpg" if random.random() > 0.6 else None
        )
        snapshots.append(snapshot)
    
    session.add_all(snapshots)
    await session.commit()
    return snapshots


async def seed_recipe_data(session: AsyncSession, scenario: str = "medium"):
    """
    Seed recipe management data
    
    Scenarios:
    - small: ~100 total records
    - medium: ~500 total records  
    - large: ~2000+ total records
    """
    
    scenarios = {
        "small": {"masters": 20, "measurements": 50, "crops": 100, "history": 200, "snapshots": 150},
        "medium": {"masters": 50, "measurements": 300, "crops": 500, "history": 1000, "snapshots": 800},
        "large": {"masters": 100, "measurements": 800, "crops": 1500, "history": 3000, "snapshots": 2000}
    }
    
    config = scenarios.get(scenario, scenarios["medium"])
    
    print(f"Seeding recipe data with '{scenario}' scenario...")
    
    # Get existing seed type IDs for foreign key references
    from app.models.seed_type import SeedType
    from sqlalchemy import text
    result = await session.execute(text("SELECT id FROM seed_types LIMIT 10"))
    seed_type_ids = [row[0] for row in result.fetchall()]
    
    # Create data in dependency order
    recipe_masters = await create_recipe_masters(session, config["masters"])
    print(f"Created {len(recipe_masters)} recipe masters")
    
    recipe_versions = await create_recipe_versions(session, recipe_masters, config["masters"] * 3)
    print(f"Created {len(recipe_versions)} recipe versions")
    
    measurements = await create_crop_measurements(session, config["measurements"])
    print(f"Created {len(measurements)} crop measurements")
    
    crops = await create_crops(session, recipe_versions, measurements, seed_type_ids, config["crops"])
    print(f"Created {len(crops)} crops")
    
    history = await create_crop_history(session, crops, config["history"])
    print(f"Created {len(history)} crop history events")
    
    snapshots = await create_crop_snapshots(session, crops, recipe_versions, measurements, config["snapshots"])
    print(f"Created {len(snapshots)} crop snapshots")
    
    print(f"Recipe data seeding completed for '{scenario}' scenario!")