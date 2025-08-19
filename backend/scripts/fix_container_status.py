#!/usr/bin/env python3
"""
Fix containers with invalid status values.
This script corrects containers that have 'production' in the status column 
instead of the purpose column.
"""

import asyncio
import sys
from pathlib import Path

# Add the parent directory to the path to import from app
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, text

from app.core.db import AsyncSessionLocal
from app.models.container import Container


async def fix_container_status_data():
    """Fix containers that have 'production' in status instead of purpose."""
    
    async with AsyncSessionLocal() as session:
        # First, find containers with invalid status values
        result = await session.execute(
            text("SELECT id, name, status, purpose FROM containers WHERE status NOT IN ('created', 'active', 'maintenance', 'inactive')")
        )
        invalid_containers = result.fetchall()
        
        if not invalid_containers:
            print("No containers with invalid status found.")
            return
        
        print(f"Found {len(invalid_containers)} containers with invalid status:")
        
        fixes_made = 0
        for container in invalid_containers:
            print(f"ID: {container.id}, Name: {container.name}, Status: {container.status}, Purpose: {container.purpose}")
            
            # If status is 'production', it should likely be the purpose, and status should be 'active'
            if container.status == 'production':
                # Update the container: move 'production' from status to purpose, set status to 'active'
                await session.execute(
                    update(Container)
                    .where(Container.id == container.id)
                    .values(
                        purpose='production',
                        status='active'
                    )
                )
                fixes_made += 1
                print(f"  → Fixed: Set purpose='production', status='active'")
            else:
                # For other invalid statuses, just set to 'active' 
                await session.execute(
                    update(Container)
                    .where(Container.id == container.id)
                    .values(status='active')
                )
                fixes_made += 1
                print(f"  → Fixed: Set status='active' (was '{container.status}')")
        
        await session.commit()
        print(f"\nFixed {fixes_made} containers successfully!")
        
        # Verify the fix
        result = await session.execute(
            text("SELECT COUNT(*) FROM containers WHERE status NOT IN ('created', 'active', 'maintenance', 'inactive')")
        )
        remaining_invalid = result.scalar()
        
        if remaining_invalid == 0:
            print("All containers now have valid status values!")
        else:
            print(f"Warning: {remaining_invalid} containers still have invalid status values.")


if __name__ == "__main__":
    asyncio.run(fix_container_status_data())