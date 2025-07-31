#!/usr/bin/env python3
"""
Script to seed hundreds of containers for performance testing and demo purposes.
This script generates realistic container data using Faker.
"""

import asyncio
import sys
from pathlib import Path

# Add the parent directory to the path to import from app
sys.path.append(str(Path(__file__).parent.parent))

from scripts.seed_database import seed_database, clear_database

async def main():
    """Main function to seed hundreds of containers"""
    print("🚀 Starting bulk container seeding process...")
    print("📊 This will generate:")
    print("   • 500 containers with realistic data")
    print("   • 2,500+ IoT devices across containers")
    print("   • 1,200 trays and 1,500 panels")
    print("   • Thousands of device health records")
    print("   • Hundreds of alerts")
    print("   • Comprehensive crop and measurement data")
    print("\n⏱️  This process may take several minutes...")
    
    # Ask for confirmation
    response = input("\nDo you want to proceed? (y/N): ")
    if response.lower() != 'y':
        print("❌ Operation cancelled.")
        return
    
    # Clear database first
    print("\n🧹 Clearing existing data...")
    await clear_database()
    
    # Run the seeding
    print("\n🌱 Starting bulk seeding...")
    await seed_database()
    
    print("\n✅ Bulk container seeding completed successfully!")
    print("🎯 You now have hundreds of containers for testing and demonstration.")

if __name__ == "__main__":
    asyncio.run(main())