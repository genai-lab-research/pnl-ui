"""Panel repository for database operations."""

from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.models.panel import Panel
from app.models.container import Container


class PanelRepository:
    """Repository for panel database operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, panel_id: int) -> Optional[Panel]:
        """Get panel by ID with container relationship loaded."""
        query = select(Panel).options(selectinload(Panel.container)).where(Panel.id == panel_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_rfid_tag(self, rfid_tag: str) -> Optional[Panel]:
        """Get panel by RFID tag."""
        query = select(Panel).where(Panel.rfid_tag == rfid_tag)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_by_container(
        self, 
        container_id: int, 
        status: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Panel]:
        """Get panels by container with optional filters."""
        query = select(Panel).where(Panel.container_id == container_id)
        
        if status:
            query = query.where(Panel.status == status)
        
        if offset:
            query = query.offset(offset)
        if limit:
            query = query.limit(limit)
            
        query = query.order_by(Panel.provisioned_at.desc())
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def get_by_location(
        self, 
        container_id: int, 
        location_dict: dict
    ) -> Optional[Panel]:
        """Get panel at specific location."""
        query = select(Panel).where(
            and_(
                Panel.container_id == container_id,
                Panel.location.contains(location_dict)
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def create(self, panel_data: dict) -> Panel:
        """Create a new panel."""
        panel = Panel(**panel_data)
        self.db.add(panel)
        await self.db.flush()
        await self.db.refresh(panel)
        return panel
    
    async def update(self, panel_id: int, update_data: dict) -> Optional[Panel]:
        """Update panel data."""
        panel = await self.get_by_id(panel_id)
        if not panel:
            return None
            
        for key, value in update_data.items():
            if hasattr(panel, key):
                setattr(panel, key, value)
        
        await self.db.flush()
        await self.db.refresh(panel)
        return panel
    
    async def delete(self, panel_id: int) -> bool:
        """Delete panel by ID."""
        panel = await self.get_by_id(panel_id)
        if not panel:
            return False
            
        await self.db.delete(panel)
        await self.db.flush()
        return True
    
    async def get_container_statistics(self, container_id: int) -> dict:
        """Get panel statistics for a container."""
        # Total panels
        total_query = select(func.count(Panel.id)).where(Panel.container_id == container_id)
        total_result = await self.db.execute(total_query)
        total_panels = total_result.scalar() or 0
        
        # Active panels
        active_query = select(func.count(Panel.id)).where(
            and_(Panel.container_id == container_id, Panel.status == "active")
        )
        active_result = await self.db.execute(active_query)
        active_panels = active_result.scalar() or 0
        
        # Average utilization
        util_query = select(func.avg(Panel.utilization_pct)).where(
            and_(Panel.container_id == container_id, Panel.status == "active")
        )
        util_result = await self.db.execute(util_query)
        avg_utilization = util_result.scalar() or 0.0
        
        return {
            "total_panels": total_panels,
            "active_panels": active_panels,
            "average_utilization": round(float(avg_utilization), 2)
        }
    
    async def get_available_locations(self, container_id: int) -> List[dict]:
        """Get available wall locations in container."""
        # Query for occupied locations
        occupied_query = select(Panel.location).where(
            and_(Panel.container_id == container_id, Panel.status == "active")
        )
        occupied_result = await self.db.execute(occupied_query)
        occupied_locations = [row[0] for row in occupied_result.fetchall()]
        
        # Generate all possible locations (assuming 4 walls with 22 slots each)
        all_locations = []
        walls = ["North", "South", "East", "West"]
        for wall in walls:
            for slot in range(1, 23):  # Slots 1-22
                location = {"wall": wall, "slot_number": slot}
                if location not in occupied_locations:
                    all_locations.append(location)
        
        return all_locations
    
    async def count_by_container(self, container_id: int) -> int:
        """Count total panels in container."""
        query = select(func.count(Panel.id)).where(Panel.container_id == container_id)
        result = await self.db.execute(query)
        return result.scalar() or 0