"""Tray repository for database operations."""

from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.models.tray import Tray
from app.models.container import Container


class TrayRepository:
    """Repository for tray database operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, tray_id: int) -> Optional[Tray]:
        """Get tray by ID with container relationship loaded."""
        query = select(Tray).options(selectinload(Tray.container)).where(Tray.id == tray_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_rfid_tag(self, rfid_tag: str) -> Optional[Tray]:
        """Get tray by RFID tag."""
        query = select(Tray).where(Tray.rfid_tag == rfid_tag)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_container(
        self, 
        container_id: int, 
        status: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Tray]:
        """Get trays by container with optional filters."""
        query = select(Tray).where(Tray.container_id == container_id)
        
        if status:
            query = query.where(Tray.status == status)
        
        if offset:
            query = query.offset(offset)
        if limit:
            query = query.limit(limit)
            
        query = query.order_by(Tray.provisioned_at.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_location(
        self, 
        container_id: int, 
        location_dict: dict
    ) -> Optional[Tray]:
        """Get tray at specific location."""
        query = select(Tray).where(
            and_(
                Tray.container_id == container_id,
                Tray.location.contains(location_dict)
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def create(self, tray_data: dict) -> Tray:
        """Create a new tray."""
        tray = Tray(**tray_data)
        self.db.add(tray)
        await self.db.flush()
        await self.db.refresh(tray)
        return tray
    
    async def update(self, tray_id: int, update_data: dict) -> Optional[Tray]:
        """Update tray data."""
        tray = await self.get_by_id(tray_id)
        if not tray:
            return None
            
        for key, value in update_data.items():
            if hasattr(tray, key):
                setattr(tray, key, value)
        
        await self.db.flush()
        await self.db.refresh(tray)
        return tray
    
    async def delete(self, tray_id: int) -> bool:
        """Delete tray by ID."""
        tray = await self.get_by_id(tray_id)
        if not tray:
            return False
            
        await self.db.delete(tray)
        await self.db.flush()
        return True
    
    async def get_container_statistics(self, container_id: int) -> dict:
        """Get tray statistics for a container."""
        # Total trays
        total_query = select(func.count(Tray.id)).where(Tray.container_id == container_id)
        total_result = await self.db.execute(total_query)
        total_trays = total_result.scalar() or 0
        
        # Active trays
        active_query = select(func.count(Tray.id)).where(
            and_(Tray.container_id == container_id, Tray.status == "active")
        )
        active_result = await self.db.execute(active_query)
        active_trays = active_result.scalar() or 0
        
        # Average utilization
        util_query = select(func.avg(Tray.utilization_pct)).where(
            and_(Tray.container_id == container_id, Tray.status == "active")
        )
        util_result = await self.db.execute(util_query)
        avg_utilization = util_result.scalar() or 0.0
        
        return {
            "total_trays": total_trays,
            "active_trays": active_trays,
            "average_utilization": round(float(avg_utilization), 2)
        }
    
    async def get_available_locations(self, container_id: int) -> List[dict]:
        """Get available shelf locations in container."""
        # Query for occupied locations
        occupied_query = select(Tray.location).where(
            and_(Tray.container_id == container_id, Tray.status == "active")
        )
        occupied_result = await self.db.execute(occupied_query)
        occupied_locations = [row[0] for row in occupied_result.fetchall()]
        
        # Generate all possible locations (assuming 8 shelves with 8 slots each)
        all_locations = []
        for shelf_num in range(1, 9):  # Shelves A-H
            shelf = chr(ord('A') + shelf_num - 1)
            for slot in range(1, 9):  # Slots 1-8
                location = {"shelf": shelf, "slot_number": slot}
                if location not in occupied_locations:
                    all_locations.append(location)
        
        return all_locations
    
    async def count_by_container(self, container_id: int) -> int:
        """Count total trays in container."""
        query = select(func.count(Tray.id)).where(Tray.container_id == container_id)
        result = await self.db.execute(query)
        return result.scalar() or 0