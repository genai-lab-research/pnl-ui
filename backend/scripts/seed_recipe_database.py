#!/usr/bin/env python3
"""
Recipe database seeding script for Recipe Management System.
This script populates the database with recipe-related sample data for development and testing.
"""

import asyncio
import sys
from pathlib import Path
import argparse

# Add the parent directory to the path to import from app
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.core.db import AsyncSessionLocal
from app.seed_data.recipes import seed_recipe_data


async def clear_recipe_data():
    """Clear all recipe-related data from the database"""
    print("Clearing recipe data...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Delete in reverse dependency order
            await session.execute(text("DELETE FROM crop_snapshots WHERE recipe_version_id IS NOT NULL"))
            await session.execute(text("DELETE FROM crop_history"))
            await session.execute(text("UPDATE crops SET recipe_version_id = NULL"))
            await session.execute(text("DELETE FROM crops WHERE recipe_version_id IS NULL"))
            await session.execute(text("DELETE FROM crop_measurements"))
            await session.execute(text("DELETE FROM recipe_versions"))
            await session.execute(text("DELETE FROM recipe_master"))
            
            await session.commit()
            print("✅ Recipe data cleared successfully!")
            
        except Exception as e:
            print(f"❌ Error during recipe data clearing: {e}")
            await session.rollback()
            raise


async def seed_recipe_database(scenario: str = "medium"):
    """Main function to seed recipe-related data"""
    print(f"Starting recipe database seeding process with '{scenario}' scenario...")
    
    async with AsyncSessionLocal() as session:
        try:
            await seed_recipe_data(session, scenario)
            print("\n✅ Recipe database seeding completed successfully!")
            
        except Exception as e:
            print(f"\n❌ Error during recipe database seeding: {e}")
            await session.rollback()
            raise


async def main():
    parser = argparse.ArgumentParser(description="Recipe database seeding script")
    parser.add_argument("--clear", action="store_true", help="Clear recipe data before seeding")
    parser.add_argument("--clear-only", action="store_true", help="Only clear recipe data")
    parser.add_argument("--scenario", choices=["small", "medium", "large"], default="medium", 
                       help="Data volume scenario (default: medium)")
    
    args = parser.parse_args()
    
    if args.clear or args.clear_only:
        await clear_recipe_data()
    
    if not args.clear_only:
        await seed_recipe_database(args.scenario)


if __name__ == "__main__":
    asyncio.run(main())