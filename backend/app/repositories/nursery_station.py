"""
Nursery station repository layer for database operations.
Handles async database queries for nursery station functionality.
"""

from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from app.models.tray import Tray
from app.models.crop import Crop
from app.models.snapshots import TraySnapshot
from app.models.seed_type import SeedType
from app.schemas.nursery_station import TraySnapshotCreate, TrayLocationUpdate, TrayUpdate
from app.repositories.base import BaseRepository


class NurseryStationRepository(BaseRepository[Tray, dict, dict]):
    """Repository for nursery station operations."""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Tray, db)
    
    async def get_trays_for_container(self, container_id: int, status: Optional[str] = None, 
                                    location_type: Optional[str] = None) -> List[Tray]:
        """
        Get all trays for a container with optional filtering.
        
        Args:
            container_id: Container identifier
            status: Optional status filter
            location_type: Optional location type filter
            
        Returns:
            List of trays
        """
        query = select(Tray).where(Tray.container_id == container_id)
        
        # Add status filter
        if status:
            query = query.where(Tray.status == status)
        
        # Add location type filter
        if location_type:
            if location_type == "nursery":
                # Filter for trays in nursery station (have location with shelf/slot)
                query = query.where(
                    and_(
                        Tray.location.isnot(None),
                        Tray.location.op('->>')('shelf').isnot(None)
                    )
                )
            elif location_type == "cultivation":
                # Filter for trays in cultivation area (different location type)
                query = query.where(
                    Tray.location.op('->>')('location_type') == 'cultivation'
                )
            elif location_type == "none":
                # Filter for trays with no location
                query = query.where(
                    or_(
                        Tray.location.is_(None),
                        Tray.location.op('->>')('shelf').is_(None)
                    )
                )
        
        query = query.order_by(Tray.id)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_crops_for_tray(self, tray_id: int) -> List[Crop]:
        """
        Get all crops for a specific tray.
        
        Args:
            tray_id: Tray identifier
            
        Returns:
            List of crops with seed type information
        """
        query = select(Crop).options(
            selectinload(Crop.seed_type)
        ).where(Crop.tray_id == tray_id).order_by(Crop.row, Crop.column)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_tray_snapshots(self, container_id: int, start_date: datetime, 
                               end_date: datetime, tray_id: Optional[int] = None) -> List[TraySnapshot]:
        """
        Get tray snapshots for time-lapse functionality.
        
        Args:
            container_id: Container identifier
            start_date: Timeline start date
            end_date: Timeline end date
            tray_id: Optional tray filter
            
        Returns:
            List of tray snapshots
        """
        query = select(TraySnapshot).where(
            and_(
                TraySnapshot.container_id == container_id,
                TraySnapshot.timestamp >= start_date,
                TraySnapshot.timestamp <= end_date
            )
        )
        
        if tray_id:
            query = query.where(TraySnapshot.tray_id == tray_id)
        
        query = query.order_by(TraySnapshot.timestamp.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create_tray_snapshot(self, container_id: int, snapshot_data: TraySnapshotCreate) -> TraySnapshot:
        """
        Create a new tray snapshot.
        
        Args:
            container_id: Container identifier
            snapshot_data: Snapshot data
            
        Returns:
            Created tray snapshot
        """
        # Find tray by RFID tag
        tray_query = select(Tray).where(
            and_(
                Tray.container_id == container_id,
                Tray.rfid_tag == snapshot_data.rfid_tag
            )
        )
        tray_result = await self.db.execute(tray_query)
        tray = tray_result.scalar_one_or_none()
        
        snapshot = TraySnapshot(
            timestamp=datetime.now(),
            container_id=container_id,
            tray_id=tray.id if tray else None,
            rfid_tag=snapshot_data.rfid_tag,
            location=snapshot_data.location,
            crop_count=snapshot_data.crop_count,
            utilization_percentage=snapshot_data.utilization_percentage,
            status=snapshot_data.status
        )
        
        self.db.add(snapshot)
        await self.db.flush()
        return snapshot
    
    async def update_tray_location(self, tray_id: int, location_data: TrayLocationUpdate) -> Optional[Tray]:
        """
        Update tray location.
        
        Args:
            tray_id: Tray identifier
            location_data: New location data
            
        Returns:
            Updated tray or None if not found
        """
        async with self.db.begin():
            query = select(Tray).where(Tray.id == tray_id)
            result = await self.db.execute(query)
            tray = result.scalar_one_or_none()
            
            if not tray:
                return None
            
            # Update location
            tray.location = location_data.location
            
            # Add to session and flush to get updated object
            self.db.add(tray)
            await self.db.flush()
            
            return tray
    
    async def get_tray_by_id(self, tray_id: int) -> Optional[Tray]:
        """
        Get tray by ID.
        
        Args:
            tray_id: Tray identifier
            
        Returns:
            Tray or None if not found
        """
        query = select(Tray).where(Tray.id == tray_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def update_tray(self, tray_id: int, tray_data: TrayUpdate) -> Optional[Tray]:
        """
        Update tray information.
        
        Args:
            tray_id: Tray identifier
            tray_data: Updated tray data
            
        Returns:
            Updated tray or None if not found
        """
        async with self.db.begin():
            query = select(Tray).where(Tray.id == tray_id)
            result = await self.db.execute(query)
            tray = result.scalar_one_or_none()
            
            if not tray:
                return None
            
            # Update fields if provided
            update_data = tray_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(tray, field, value)
            
            # Add to session and flush to get updated object
            self.db.add(tray)
            await self.db.flush()
            
            return tray
    
    async def get_nursery_trays_by_location(self, container_id: int, shelf: str, slot_number: int) -> List[Tray]:
        """
        Get trays at a specific nursery location.
        
        Args:
            container_id: Container identifier
            shelf: Shelf identifier (upper/lower)
            slot_number: Slot number (1-8)
            
        Returns:
            List of trays at the specified location
        """
        query = select(Tray).where(
            and_(
                Tray.container_id == container_id,
                Tray.location.op('->>')('shelf') == shelf,
                Tray.location.op('->>')('slot_number') == str(slot_number)
            )
        )
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_nursery_trays_without_location(self, container_id: int) -> List[Tray]:
        """
        Get trays that are off-shelf (no location or invalid location).
        
        Args:
            container_id: Container identifier
            
        Returns:
            List of off-shelf trays
        """
        query = select(Tray).where(
            and_(
                Tray.container_id == container_id,
                or_(
                    Tray.location.is_(None),
                    Tray.location.op('->>')('shelf').is_(None),
                    Tray.location.op('->>')('slot_number').is_(None)
                )
            )
        )
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def count_crops_for_container(self, container_id: int) -> int:
        """
        Count total crops in nursery for a container.
        
        Args:
            container_id: Container identifier
            
        Returns:
            Total crop count
        """
        # Join crops with trays to filter by container
        query = select(Crop).join(Tray).where(
            and_(
                Tray.container_id == container_id,
                Crop.tray_id.isnot(None)
            )
        )
        
        result = await self.db.execute(query)
        crops = result.scalars().all()
        return len(crops)
    
    async def count_overdue_crops_for_container(self, container_id: int) -> int:
        """
        Count overdue crops in nursery for a container.
        
        Args:
            container_id: Container identifier
            
        Returns:
            Overdue crop count
        """
        # Join crops with trays to filter by container
        query = select(Crop).join(Tray).where(
            and_(
                Tray.container_id == container_id,
                Crop.tray_id.isnot(None),
                Crop.transplanting_date_planned < datetime.now().date()
            )
        )
        
        result = await self.db.execute(query)
        crops = result.scalars().all()
        return len(crops)