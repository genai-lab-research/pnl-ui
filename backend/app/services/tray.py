"""Tray provisioning service for business logic."""

from typing import List  # Used in bulk_provision_trays return type
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.tray import Tray
from app.models.container import Container
from app.schemas.tray import (
    TrayProvisionRequest, TrayProvisionResponse, ProvisionedTray,
    BulkTrayProvisionRequest, BulkTrayProvisionResponse, 
    PrintLabelResponse, ProvisionFailure
)
from app.services.rfid import RFIDService


class TrayService:
    """Service for tray provisioning business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.rfid_service = RFIDService(db)
    
    async def provision_tray(self, request: TrayProvisionRequest) -> TrayProvisionResponse:
        """Provision a new tray with RFID tag assignment."""
        # Validate container exists
        await self._validate_container_exists(request.container_id)
        
        # Validate RFID tag
        rfid_validation = await self.rfid_service.validate_rfid_tag(
            request.rfid_tag, "tray"
        )
        
        if not rfid_validation.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=rfid_validation.error_message
            )
        
        # Check location availability
        await self._validate_location_availability(
            request.container_id, request.location.model_dump()
        )
        
        # Create and save tray
        async with self.db.begin():
            tray = Tray(
                container_id=request.container_id,
                rfid_tag=request.rfid_tag,
                location=request.location.model_dump(),
                provisioned_at=datetime.now(),
                status="active",
                capacity=request.capacity,
                tray_type=request.tray_type,
                utilization_pct=0.0
            )
            
            self.db.add(tray)
            await self.db.flush()
            await self.db.refresh(tray)
        
        # Generate print label URL
        print_label_url = await self._generate_label_url(tray.id, "tray")
        
        # Build response
        provisioned_tray = ProvisionedTray(
            id=tray.id,
            container_id=tray.container_id,
            rfid_tag=tray.rfid_tag,
            location=tray.location,
            utilization_pct=tray.utilization_pct,
            provisioned_at=tray.provisioned_at,
            status=tray.status,
            capacity=tray.capacity,
            tray_type=tray.tray_type,
            print_label_url=print_label_url
        )
        
        return TrayProvisionResponse(
            success=True,
            message=f"Tray {tray.id} provisioned successfully",
            tray=provisioned_tray
        )
    
    async def generate_print_label(self, tray_id: int) -> PrintLabelResponse:
        """Generate a printable label for the provisioned tray."""
        # Validate tray exists
        tray = await self._get_tray_by_id(tray_id)
        
        # Generate label URL
        label_url = await self._generate_label_url(tray_id, "tray")
        
        return PrintLabelResponse(
            label_url=label_url,
            print_format="PDF",
            expires_at=datetime.now().replace(hour=23, minute=59, second=59)
        )
    
    async def bulk_provision_trays(
        self, request: BulkTrayProvisionRequest
    ) -> BulkTrayProvisionResponse:
        """Provision multiple trays in a single operation."""
        provisioned_trays = []
        failed_provisions = []
        
        # Validate container exists
        await self._validate_container_exists(request.container_id)
        
        for tray_item in request.trays:
            try:
                # Create individual provision request
                individual_request = TrayProvisionRequest(
                    container_id=request.container_id,
                    location=tray_item.location,
                    rfid_tag=tray_item.rfid_tag,
                    capacity=tray_item.capacity,
                    tray_type=tray_item.tray_type
                )
                
                # Provision the tray
                provision_result = await self.provision_tray(individual_request)
                provisioned_trays.append(provision_result.tray)
                
            except HTTPException as e:
                failed_provisions.append(ProvisionFailure(
                    rfid_tag=tray_item.rfid_tag,
                    error=e.detail
                ))
            except Exception as e:
                failed_provisions.append(ProvisionFailure(
                    rfid_tag=tray_item.rfid_tag,
                    error=str(e)
                ))
        
        success = len(failed_provisions) == 0
        message = f"Provisioned {len(provisioned_trays)} trays"
        if failed_provisions:
            message += f", {len(failed_provisions)} failed"
        
        return BulkTrayProvisionResponse(
            success=success,
            message=message,
            provisioned_trays=provisioned_trays,
            failed_provisions=failed_provisions
        )
    
    async def _validate_container_exists(self, container_id: int):
        """Validate that container exists."""
        query = select(Container).where(Container.id == container_id)
        result = await self.db.execute(query)
        container = result.scalar_one_or_none()
        
        if not container:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Container with ID {container_id} not found"
            )
    
    async def _validate_location_availability(self, container_id: int, location: dict):
        """Validate that the specified location is available."""
        # Check if any tray already occupies this location
        query = select(Tray).where(
            Tray.container_id == container_id,
            Tray.location.contains(location)
        )
        result = await self.db.execute(query)
        existing_tray = result.scalar_one_or_none()
        
        if existing_tray:
            shelf = location.get("shelf", "unknown")
            slot = location.get("slot_number", "unknown")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Location {shelf} slot {slot} is already occupied by tray {existing_tray.id}"
            )
    
    async def _get_tray_by_id(self, tray_id: int) -> Tray:
        """Get tray by ID or raise 404."""
        query = select(Tray).where(Tray.id == tray_id)
        result = await self.db.execute(query)
        tray = result.scalar_one_or_none()
        
        if not tray:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tray with ID {tray_id} not found"
            )
        
        return tray
    
    async def _generate_label_url(self, item_id: int, item_type: str) -> str:
        """Generate a printable label URL."""
        # In a real implementation, this would integrate with a label printing service
        base_url = "https://labels.farm-system.com"
        return f"{base_url}/{item_type}/{item_id}/label.pdf"
