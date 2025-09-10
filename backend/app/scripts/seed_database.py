#!/usr/bin/env python3
"""
Comprehensive database seeding script for Environment & Recipes functionality.
Supports different data volumes and seeding scenarios.
"""

import asyncio
import sys
import argparse
from pathlib import Path
from datetime import datetime

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy import text
from app.core.db import AsyncSessionLocal
from app.models import EnvironmentLink, RecipeApplication
from app.seed_data.environment_links import (
    create_environment_links_seed_data,
    create_large_environment_links_dataset
)
from app.seed_data.recipe_applications import (
    create_recipe_applications_seed_data,
    create_recipe_applications_by_size,
    create_edge_case_applications
)


async def clear_environment_recipe_data():
    """Clear existing environment and recipe application data"""
    async with AsyncSessionLocal() as session:
        # Delete recipe applications first (due to foreign key constraints)
        await session.execute(text("DELETE FROM recipe_applications"))
        await session.execute(text("DELETE FROM environment_links"))
        await session.commit()
        print("✅ Cleared existing environment and recipe application data")


async def seed_environment_links(data_size: str = "medium"):
    """Seed environment_links table"""
    async with AsyncSessionLocal() as session:
        print(f"🌱 Seeding environment_links with {data_size} dataset...")
        
        seed_data = create_large_environment_links_dataset(data_size)
        
        for link_data in seed_data:
            environment_link = EnvironmentLink(**link_data)
            session.add(environment_link)
        
        await session.commit()
        print(f"✅ Seeded {len(seed_data)} environment links")


async def seed_recipe_applications(data_size: str = "medium"):
    """Seed recipe_applications table"""
    async with AsyncSessionLocal() as session:
        print(f"🌱 Seeding recipe_applications with {data_size} dataset...")
        
        seed_data = create_recipe_applications_by_size(data_size)
        
        for app_data in seed_data:
            recipe_app = RecipeApplication(**app_data)
            session.add(recipe_app)
        
        await session.commit()
        print(f"✅ Seeded {len(seed_data)} recipe applications")


async def seed_edge_cases():
    """Seed edge case data for testing"""
    async with AsyncSessionLocal() as session:
        print("🧪 Seeding edge case data...")
        
        edge_data = create_edge_case_applications()
        
        for app_data in edge_data:
            recipe_app = RecipeApplication(**app_data)
            session.add(recipe_app)
        
        await session.commit()
        print(f"✅ Seeded {len(edge_data)} edge case applications")


async def verify_seeded_data():
    """Verify the seeded data"""
    async with AsyncSessionLocal() as session:
        # Count environment links
        env_links_result = await session.execute(text("SELECT COUNT(*) FROM environment_links"))
        env_links_count = env_links_result.scalar()
        
        # Count recipe applications
        recipe_apps_result = await session.execute(text("SELECT COUNT(*) FROM recipe_applications"))
        recipe_apps_count = recipe_apps_result.scalar()
        
        print(f"\n📊 Verification Results:")
        print(f"   Environment Links: {env_links_count}")
        print(f"   Recipe Applications: {recipe_apps_count}")
        
        # Sample queries
        print(f"\n🔍 Sample Data:")
        
        # Connected containers
        connected_result = await session.execute(text("""
            SELECT COUNT(*) FROM environment_links 
            WHERE fa IS NOT NULL OR pya IS NOT NULL OR aws IS NOT NULL 
            OR mbai IS NOT NULL OR fh IS NOT NULL
        """))
        connected_count = connected_result.scalar()
        print(f"   Connected Containers: {connected_count}")
        
        # Recent applications
        recent_result = await session.execute(text("""
            SELECT COUNT(*) FROM recipe_applications 
            WHERE applied_at >= NOW() - INTERVAL '30 days'
        """))
        recent_count = recent_result.scalar()
        print(f"   Recent Applications (30 days): {recent_count}")


async def main():
    parser = argparse.ArgumentParser(description="Seed Environment & Recipes database")
    parser.add_argument(
        "--size", 
        choices=["small", "medium", "large", "xlarge"], 
        default="medium",
        help="Dataset size (default: medium)"
    )
    parser.add_argument(
        "--clear", 
        action="store_true",
        help="Clear existing data before seeding"
    )
    parser.add_argument(
        "--edge-cases", 
        action="store_true",
        help="Include edge case data for testing"
    )
    parser.add_argument(
        "--verify-only", 
        action="store_true",
        help="Only verify existing data, don't seed"
    )
    
    args = parser.parse_args()
    
    start_time = datetime.now()
    print(f"🚀 Starting Environment & Recipes database seeding...")
    print(f"   Size: {args.size}")
    print(f"   Clear existing: {args.clear}")
    print(f"   Include edge cases: {args.edge_cases}")
    print(f"   Started at: {start_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    try:
        if args.verify_only:
            await verify_seeded_data()
            return
        
        if args.clear:
            await clear_environment_recipe_data()
        
        await seed_environment_links(args.size)
        await seed_recipe_applications(args.size)
        
        if args.edge_cases:
            await seed_edge_cases()
        
        await verify_seeded_data()
        
        end_time = datetime.now()
        duration = end_time - start_time
        print(f"\n✅ Seeding completed successfully!")
        print(f"   Duration: {duration.total_seconds():.2f} seconds")
        print(f"   Completed at: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"❌ Seeding failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())