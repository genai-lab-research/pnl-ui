"""Panel provisioning service for business logic."""

from typing import List  # Used in bulk_provision_panels return type
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.panel import Panel
from app.models.container import Container
from app.schemas.panel import (
    PanelProvisionRequest, PanelProvisionResponse, ProvisionedPanel,
    BulkPanelProvisionRequest, BulkPanelProvisionResponse, 
    PrintLabelResponse, ProvisionFailure
)
from app.services.rfid import RFIDService


class PanelService:
    """Service for panel provisioning business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.rfid_service = RFIDService(db)
    
    async def provision_panel(self, request: PanelProvisionRequest) -> PanelProvisionResponse:
        """Provision a new panel with RFID tag assignment."""
        # Validate container exists
        await self._validate_container_exists(request.container_id)
        
        # Validate RFID tag
        rfid_validation = await self.rfid_service.validate_rfid_tag(
            request.rfid_tag, "panel"
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
        
        # Create and save panel
        async with self.db.begin():
            panel = Panel(
                container_id=request.container_id,
                rfid_tag=request.rfid_tag,
                location=request.location.model_dump(),
                provisioned_at=datetime.now(),
                status="active",
                capacity=request.capacity,
                panel_type=request.panel_type,
                utilization_pct=0.0
            )
            
            self.db.add(panel)
            await self.db.flush()
            await self.db.refresh(panel)
        
        # Generate print label URL
        print_label_url = await self._generate_label_url(panel.id, "panel")
        
        # Build response
        provisioned_panel = ProvisionedPanel(
            id=panel.id,
            container_id=panel.container_id,
            rfid_tag=panel.rfid_tag,
            location=panel.location,
            utilization_pct=panel.utilization_pct,
            provisioned_at=panel.provisioned_at,
            status=panel.status,
            capacity=panel.capacity,
            panel_type=panel.panel_type,
            print_label_url=print_label_url
        )
        
        return PanelProvisionResponse(
            success=True,
            message=f"Panel {panel.id} provisioned successfully",
            panel=provisioned_panel
        )
    
    async def generate_print_label(self, panel_id: int) -> PrintLabelResponse:
        """Generate a printable label for the provisioned panel."""
        # Validate panel exists
        panel = await self._get_panel_by_id(panel_id)
        
        # Generate label URL
        label_url = await self._generate_label_url(panel_id, "panel")
        
        return PrintLabelResponse(
            label_url=label_url,
            print_format="PDF",
            expires_at=datetime.now().replace(hour=23, minute=59, second=59)
        )
    
    async def bulk_provision_panels(
        self, request: BulkPanelProvisionRequest
    ) -> BulkPanelProvisionResponse:
        """Provision multiple panels in a single operation."""
        provisioned_panels = []
        failed_provisions = []
        
        # Validate container exists
        await self._validate_container_exists(request.container_id)
        
        for panel_item in request.panels:
            try:
                # Create individual provision request
                individual_request = PanelProvisionRequest(
                    container_id=request.container_id,
                    location=panel_item.location,
                    rfid_tag=panel_item.rfid_tag,
                    capacity=panel_item.capacity,
                    panel_type=panel_item.panel_type
                )
                
                # Provision the panel
                provision_result = await self.provision_panel(individual_request)
                provisioned_panels.append(provision_result.panel)
                
            except HTTPException as e:
                failed_provisions.append(ProvisionFailure(
                    rfid_tag=panel_item.rfid_tag,
                    error=e.detail
                ))
            except Exception as e:
                failed_provisions.append(ProvisionFailure(
                    rfid_tag=panel_item.rfid_tag,
                    error=str(e)
                ))
        
        success = len(failed_provisions) == 0
        message = f"Provisioned {len(provisioned_panels)} panels"
        if failed_provisions:
            message += f", {len(failed_provisions)} failed"
        
        return BulkPanelProvisionResponse(
            success=success,
            message=message,
            provisioned_panels=provisioned_panels,
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
        # Check if any panel already occupies this location
        query = select(Panel).where(
            Panel.container_id == container_id,
            Panel.location.contains(location)
        )
        result = await self.db.execute(query)
        existing_panel = result.scalar_one_or_none()
        
        if existing_panel:
            wall = location.get("wall", "unknown")
            slot = location.get("slot_number", "unknown")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Location {wall} slot {slot} is already occupied by panel {existing_panel.id}"
            )
    
    async def _get_panel_by_id(self, panel_id: int) -> Panel:
        """Get panel by ID or raise 404."""
        query = select(Panel).where(Panel.id == panel_id)
        result = await self.db.execute(query)
        panel = result.scalar_one_or_none()
        
        if not panel:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Panel with ID {panel_id} not found"
            )
        
        return panel
    
    async def _generate_label_url(self, item_id: int, item_type: str) -> str:
        """Generate a printable label URL."""
        # In a real implementation, this would integrate with a label printing service
        base_url = "https://labels.farm-system.com"
        return f"{base_url}/{item_type}/{item_id}/label.pdf"
