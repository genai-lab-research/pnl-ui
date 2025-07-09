"""RFID validation and availability service."""

import re
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.tray import Tray
from app.models.panel import Panel
from app.schemas.rfid import (
    RFIDValidationResponse, RFIDAvailabilityResponse, RFIDCurrentUsage
)


class RFIDService:
    """Service for RFID validation and availability checking."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def validate_rfid_tag(self, rfid_tag: str, item_type: str) -> RFIDValidationResponse:
        """Validate RFID tag format and check for uniqueness."""
        # Check format validity
        format_valid = self._validate_rfid_format(rfid_tag)
        
        # Check uniqueness
        is_unique = await self._check_rfid_uniqueness(rfid_tag)
        
        # Overall validity
        is_valid = format_valid and is_unique
        
        # Generate error message if validation fails
        error_message = None
        if not format_valid:
            error_message = "RFID tag format is invalid. Expected format: 3-4 letter prefix followed by 6 digits"
        elif not is_unique:
            error_message = "RFID tag already exists in the system"
        
        return RFIDValidationResponse(
            is_valid=is_valid,
            is_unique=is_unique,
            format_valid=format_valid,
            error_message=error_message
        )
    
    async def check_rfid_availability(self, rfid_tag: str) -> RFIDAvailabilityResponse:
        """Check if an RFID tag is available for use."""
        current_usage = await self._find_rfid_usage(rfid_tag)
        
        return RFIDAvailabilityResponse(
            is_available=current_usage is None,
            current_usage=current_usage
        )
    
    def _validate_rfid_format(self, rfid_tag: str) -> bool:
        """Validate RFID tag format."""
        if not rfid_tag:
            return False
        
        # Expected format: 3-4 letter prefix followed by 6 digits
        # Examples: TRY123456, PNL789012, TRAY123456
        pattern = r'^[A-Z]{3,4}\d{6}$'
        return bool(re.match(pattern, rfid_tag.upper()))
    
    async def _check_rfid_uniqueness(self, rfid_tag: str) -> bool:
        """Check if RFID tag is unique across trays and panels."""
        # Check in trays table
        tray_query = select(Tray).where(Tray.rfid_tag == rfid_tag)
        tray_result = await self.db.execute(tray_query)
        existing_tray = tray_result.scalar_one_or_none()
        
        if existing_tray:
            return False
        
        # Check in panels table
        panel_query = select(Panel).where(Panel.rfid_tag == rfid_tag)
        panel_result = await self.db.execute(panel_query)
        existing_panel = panel_result.scalar_one_or_none()
        
        return existing_panel is None
    
    async def _find_rfid_usage(self, rfid_tag: str) -> Optional[RFIDCurrentUsage]:
        """Find current usage of an RFID tag."""
        # Check in trays
        tray_query = select(Tray).where(Tray.rfid_tag == rfid_tag)
        tray_result = await self.db.execute(tray_query)
        existing_tray = tray_result.scalar_one_or_none()
        
        if existing_tray:
            return RFIDCurrentUsage(
                type="tray",
                id=existing_tray.id,
                container_id=existing_tray.container_id
            )
        
        # Check in panels
        panel_query = select(Panel).where(Panel.rfid_tag == rfid_tag)
        panel_result = await self.db.execute(panel_query)
        existing_panel = panel_result.scalar_one_or_none()
        
        if existing_panel:
            return RFIDCurrentUsage(
                type="panel",
                id=existing_panel.id,
                container_id=existing_panel.container_id
            )
        
        return None
