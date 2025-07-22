"""
Nursery station service layer for business logic and data processing.
Handles nursery station operations, tray management, and time-lapse functionality.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.tray import Tray
from app.models.crop import Crop
from app.models.snapshots import TraySnapshot
from app.models.seed_type import SeedType
from app.schemas.nursery_station import (
    NurseryStationLayout,
    NurseryStationSummary,
    TraySnapshot as TraySnapshotSchema,
    TraySnapshotCreate,
    AvailableSlotsResponse,
    AvailableSlot,
    TrayLocationUpdate,
    TrayLocationUpdateResponse,
    TrayUpdate,
    NurseryTray,
    NurseryCrop,
    TraySlot,
    NurseryLayout,
    UtilizationSummary,
    OffShelfTray
)
from app.schemas.tray import TrayResponse
from app.repositories.nursery_station import NurseryStationRepository


class NurseryStationService:
    """Service layer for nursery station operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = NurseryStationRepository(db)
    
    async def get_nursery_station_layout(self, container_id: int, date: Optional[datetime] = None) -> NurseryStationLayout:
        """
        Get the complete nursery station layout for a container.
        
        Args:
            container_id: Container identifier
            date: Optional specific date for historical view
            
        Returns:
            Complete nursery station layout with utilization summary
        """
        # Get all trays for the container
        trays = await self.repository.get_trays_for_container(container_id)
        
        # Initialize shelf layouts
        upper_shelf = [TraySlot(slot_number=i, tray=None) for i in range(1, 9)]
        lower_shelf = [TraySlot(slot_number=i, tray=None) for i in range(1, 9)]
        off_shelf_trays = []
        
        total_crops = 0
        total_capacity = 0
        
        for tray in trays:
            # Get crops for this tray
            crops = await self.repository.get_crops_for_tray(tray.id)
            
            # Convert crops to nursery crop schema
            nursery_crops = []
            for crop in crops:
                # Calculate age in days
                age_days = 0
                if crop.seed_date:
                    age_days = (datetime.now().date() - crop.seed_date).days
                
                # Calculate overdue days
                overdue_days = None
                if crop.transplanting_date_planned and crop.transplanting_date_planned < datetime.now().date():
                    overdue_days = (datetime.now().date() - crop.transplanting_date_planned).days
                
                # Get seed type name
                seed_type_name = "Unknown"
                if crop.seed_type:
                    seed_type_name = crop.seed_type.name
                
                nursery_crop = NurseryCrop(
                    id=crop.id,
                    seed_type_id=crop.seed_type_id,
                    row=crop.row or 1,
                    column=crop.column or 1,
                    seed_type=seed_type_name,
                    age_days=age_days,
                    health_check=crop.health_check,
                    seed_date=crop.seed_date,
                    transplanting_date_planned=crop.transplanting_date_planned,
                    overdue_days=overdue_days,
                    current_location=crop.current_location,
                    lifecycle_status=crop.lifecycle_status
                )
                nursery_crops.append(nursery_crop)
            
            # Create nursery tray
            nursery_tray = NurseryTray(
                id=tray.id,
                container_id=tray.container_id,
                rfid_tag=tray.rfid_tag,
                location=tray.location,
                utilization_pct=tray.utilization_pct,
                provisioned_at=tray.provisioned_at,
                status=tray.status,
                capacity=tray.capacity,
                tray_type=tray.tray_type,
                crops=nursery_crops
            )
            
            # Count crops and capacity for utilization
            total_crops += len(nursery_crops)
            if tray.capacity:
                total_capacity += tray.capacity
            
            # Place tray in appropriate location
            if tray.location and isinstance(tray.location, dict):
                shelf = tray.location.get('shelf')
                slot_number = tray.location.get('slot_number')
                
                if shelf and slot_number:
                    if shelf == 'upper' and 1 <= slot_number <= 8:
                        upper_shelf[slot_number - 1].tray = nursery_tray
                    elif shelf == 'lower' and 1 <= slot_number <= 8:
                        lower_shelf[slot_number - 1].tray = nursery_tray
                    else:
                        # Invalid location, treat as off-shelf
                        off_shelf_tray = OffShelfTray(
                            id=tray.id,
                            container_id=tray.container_id,
                            rfid_tag=tray.rfid_tag,
                            utilization_pct=tray.utilization_pct,
                            status=tray.status,
                            last_location=tray.location,
                            capacity=tray.capacity,
                            tray_type=tray.tray_type
                        )
                        off_shelf_trays.append(off_shelf_tray)
                else:
                    # No shelf/slot info, treat as off-shelf
                    off_shelf_tray = OffShelfTray(
                        id=tray.id,
                        container_id=tray.container_id,
                        rfid_tag=tray.rfid_tag,
                        utilization_pct=tray.utilization_pct,
                        status=tray.status,
                        last_location=tray.location,
                        capacity=tray.capacity,
                        tray_type=tray.tray_type
                    )
                    off_shelf_trays.append(off_shelf_tray)
            else:
                # No location, definitely off-shelf
                off_shelf_tray = OffShelfTray(
                    id=tray.id,
                    container_id=tray.container_id,
                    rfid_tag=tray.rfid_tag,
                    utilization_pct=tray.utilization_pct,
                    status=tray.status,
                    last_location=tray.location,
                    capacity=tray.capacity,
                    tray_type=tray.tray_type
                )
                off_shelf_trays.append(off_shelf_tray)
        
        # Calculate utilization percentage
        utilization_percentage = 0.0
        if total_capacity > 0:
            utilization_percentage = (total_crops / total_capacity) * 100.0
        
        # Create layout components
        utilization_summary = UtilizationSummary(
            total_utilization_percentage=utilization_percentage
        )
        
        layout = NurseryLayout(
            upper_shelf=upper_shelf,
            lower_shelf=lower_shelf
        )
        
        return NurseryStationLayout(
            utilization_summary=utilization_summary,
            layout=layout,
            off_shelf_trays=off_shelf_trays
        )
    
    async def get_trays_for_container(self, container_id: int, status: Optional[str] = None, 
                                    location_type: Optional[str] = None) -> List[TrayResponse]:
        """
        Get all trays for a container with optional filtering.
        
        Args:
            container_id: Container identifier
            status: Optional status filter
            location_type: Optional location type filter
            
        Returns:
            List of tray responses
        """
        trays = await self.repository.get_trays_for_container(container_id, status, location_type)
        
        return [
            TrayResponse(
                id=tray.id,
                container_id=tray.container_id,
                rfid_tag=tray.rfid_tag,
                location=tray.location,
                utilization_pct=tray.utilization_pct,
                provisioned_at=tray.provisioned_at,
                status=tray.status,
                capacity=tray.capacity,
                tray_type=tray.tray_type
            )
            for tray in trays
        ]
    
    async def get_tray_snapshots(self, container_id: int, start_date: Optional[datetime] = None,
                               end_date: Optional[datetime] = None, tray_id: Optional[int] = None) -> List[TraySnapshotSchema]:
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
        # Set default date range if not provided
        if not start_date:
            start_date = datetime.now() - timedelta(weeks=2)
        if not end_date:
            end_date = datetime.now() + timedelta(weeks=2)
        
        snapshots = await self.repository.get_tray_snapshots(container_id, start_date, end_date, tray_id)
        
        return [
            TraySnapshotSchema(
                id=snapshot.id,
                timestamp=snapshot.timestamp,
                container_id=snapshot.container_id,
                rfid_tag=snapshot.rfid_tag,
                location=snapshot.location,
                crop_count=snapshot.crop_count,
                utilization_percentage=snapshot.utilization_percentage,
                status=snapshot.status
            )
            for snapshot in snapshots
        ]
    
    async def create_tray_snapshot(self, container_id: int, snapshot_data: TraySnapshotCreate) -> TraySnapshotSchema:
        """
        Create a new tray snapshot.
        
        Args:
            container_id: Container identifier
            snapshot_data: Snapshot data
            
        Returns:
            Created tray snapshot
        """
        snapshot = await self.repository.create_tray_snapshot(container_id, snapshot_data)
        
        return TraySnapshotSchema(
            id=snapshot.id,
            timestamp=snapshot.timestamp,
            container_id=snapshot.container_id,
            rfid_tag=snapshot.rfid_tag,
            location=snapshot.location,
            crop_count=snapshot.crop_count,
            utilization_percentage=snapshot.utilization_percentage,
            status=snapshot.status
        )
    
    async def get_available_slots(self, container_id: int) -> AvailableSlotsResponse:
        """
        Get available slots for tray placement.
        
        Args:
            container_id: Container identifier
            
        Returns:
            Available slots response
        """
        # Get all trays for container
        trays = await self.repository.get_trays_for_container(container_id)
        
        # Track occupied slots
        occupied_slots = set()
        
        for tray in trays:
            if tray.location and isinstance(tray.location, dict):
                shelf = tray.location.get('shelf')
                slot_number = tray.location.get('slot_number')
                
                if shelf and slot_number:
                    occupied_slots.add(f"{shelf}_{slot_number}")
        
        # Find available slots
        available_slots = []
        
        for shelf in ['upper', 'lower']:
            for slot in range(1, 9):
                slot_key = f"{shelf}_{slot}"
                if slot_key not in occupied_slots:
                    available_slot = AvailableSlot(
                        shelf=shelf,
                        slot_number=slot,
                        location_description=f"{shelf.title()} Shelf, Slot {slot}"
                    )
                    available_slots.append(available_slot)
        
        return AvailableSlotsResponse(available_slots=available_slots)
    
    async def update_tray_location(self, tray_id: int, location_data: TrayLocationUpdate) -> TrayLocationUpdateResponse:
        """
        Update tray location.
        
        Args:
            tray_id: Tray identifier
            location_data: New location data
            
        Returns:
            Update response with tray details
        """
        tray = await self.repository.update_tray_location(tray_id, location_data)
        
        if not tray:
            raise ValueError(f"Tray with ID {tray_id} not found")
        
        # Get crops for the tray
        crops = await self.repository.get_crops_for_tray(tray.id)
        
        # Convert to nursery crops
        nursery_crops = [
            NurseryCrop(
                id=crop.id,
                seed_type_id=crop.seed_type_id,
                row=crop.row or 1,
                column=crop.column or 1,
                seed_type=crop.seed_type.name if crop.seed_type else "Unknown",
                age_days=(datetime.now().date() - crop.seed_date).days if crop.seed_date else 0,
                health_check=crop.health_check,
                seed_date=crop.seed_date,
                transplanting_date_planned=crop.transplanting_date_planned,
                current_location=crop.current_location,
                lifecycle_status=crop.lifecycle_status
            )
            for crop in crops
        ]
        
        nursery_tray = NurseryTray(
            id=tray.id,
            container_id=tray.container_id,
            rfid_tag=tray.rfid_tag,
            location=tray.location,
            utilization_pct=tray.utilization_pct,
            provisioned_at=tray.provisioned_at,
            status=tray.status,
            capacity=tray.capacity,
            tray_type=tray.tray_type,
            crops=nursery_crops
        )
        
        return TrayLocationUpdateResponse(
            success=True,
            message="Tray location updated successfully",
            tray=nursery_tray
        )
    
    async def get_tray_by_id(self, tray_id: int) -> Optional[NurseryTray]:
        """
        Get tray by ID with full details.
        
        Args:
            tray_id: Tray identifier
            
        Returns:
            Tray with crops or None if not found
        """
        tray = await self.repository.get_tray_by_id(tray_id)
        
        if not tray:
            return None
        
        # Get crops for the tray
        crops = await self.repository.get_crops_for_tray(tray.id)
        
        # Convert to nursery crops
        nursery_crops = [
            NurseryCrop(
                id=crop.id,
                seed_type_id=crop.seed_type_id,
                row=crop.row or 1,
                column=crop.column or 1,
                seed_type=crop.seed_type.name if crop.seed_type else "Unknown",
                age_days=(datetime.now().date() - crop.seed_date).days if crop.seed_date else 0,
                health_check=crop.health_check,
                seed_date=crop.seed_date,
                transplanting_date_planned=crop.transplanting_date_planned,
                current_location=crop.current_location,
                lifecycle_status=crop.lifecycle_status
            )
            for crop in crops
        ]
        
        return NurseryTray(
            id=tray.id,
            container_id=tray.container_id,
            rfid_tag=tray.rfid_tag,
            location=tray.location,
            utilization_pct=tray.utilization_pct,
            provisioned_at=tray.provisioned_at,
            status=tray.status,
            capacity=tray.capacity,
            tray_type=tray.tray_type,
            crops=nursery_crops
        )
    
    async def update_tray(self, tray_id: int, tray_data: TrayUpdate) -> Optional[NurseryTray]:
        """
        Update tray information.
        
        Args:
            tray_id: Tray identifier
            tray_data: Updated tray data
            
        Returns:
            Updated tray or None if not found
        """
        tray = await self.repository.update_tray(tray_id, tray_data)
        
        if not tray:
            return None
        
        # Get crops for the tray
        crops = await self.repository.get_crops_for_tray(tray.id)
        
        # Convert to nursery crops
        nursery_crops = [
            NurseryCrop(
                id=crop.id,
                seed_type_id=crop.seed_type_id,
                row=crop.row or 1,
                column=crop.column or 1,
                seed_type=crop.seed_type.name if crop.seed_type else "Unknown",
                age_days=(datetime.now().date() - crop.seed_date).days if crop.seed_date else 0,
                health_check=crop.health_check,
                seed_date=crop.seed_date,
                transplanting_date_planned=crop.transplanting_date_planned,
                current_location=crop.current_location,
                lifecycle_status=crop.lifecycle_status
            )
            for crop in crops
        ]
        
        return NurseryTray(
            id=tray.id,
            container_id=tray.container_id,
            rfid_tag=tray.rfid_tag,
            location=tray.location,
            utilization_pct=tray.utilization_pct,
            provisioned_at=tray.provisioned_at,
            status=tray.status,
            capacity=tray.capacity,
            tray_type=tray.tray_type,
            crops=nursery_crops
        )
    
    async def get_nursery_station_summary(self, container_id: int) -> NurseryStationSummary:
        """
        Get nursery station summary for dashboard.
        
        Args:
            container_id: Container identifier
            
        Returns:
            Nursery station summary
        """
        # Get all trays for container
        trays = await self.repository.get_trays_for_container(container_id)
        
        # Count placed vs off-shelf trays
        placed_trays = 0
        off_shelf_trays = 0
        total_crops = 0
        overdue_crops = 0
        
        for tray in trays:
            if tray.location and isinstance(tray.location, dict):
                shelf = tray.location.get('shelf')
                slot_number = tray.location.get('slot_number')
                if shelf and slot_number:
                    placed_trays += 1
                else:
                    off_shelf_trays += 1
            else:
                off_shelf_trays += 1
            
            # Count crops
            crops = await self.repository.get_crops_for_tray(tray.id)
            total_crops += len(crops)
            
            # Count overdue crops
            for crop in crops:
                if (crop.transplanting_date_planned and 
                    crop.transplanting_date_planned < datetime.now().date()):
                    overdue_crops += 1
        
        # Calculate utilization
        total_slots = 16  # 8 upper + 8 lower
        occupied_slots = placed_trays
        utilization_percentage = (occupied_slots / total_slots) * 100.0 if total_slots > 0 else 0.0
        
        return NurseryStationSummary(
            total_slots=total_slots,
            occupied_slots=occupied_slots,
            utilization_percentage=utilization_percentage,
            total_trays=len(trays),
            off_shelf_trays=off_shelf_trays,
            total_crops=total_crops,
            overdue_crops=overdue_crops,
            last_updated=datetime.now()
        )