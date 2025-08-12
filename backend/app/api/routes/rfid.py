"""RFID validation and provisioning API routes."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.schemas.rfid import (
    RFIDValidationRequest, RFIDValidationResponse, RFIDAvailabilityResponse
)
from app.services.rfid import RFIDService
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/rfid", tags=["rfid"])


@router.post("/validate", response_model=RFIDValidationResponse)
async def validate_rfid_tag(
    request: RFIDValidationRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Validate RFID tag format and check for uniqueness."""
    try:
        rfid_service = RFIDService(db)
        validation_result = await rfid_service.validate_rfid_tag(
            request.rfid_tag, request.type
        )
        return validation_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating RFID tag {request.rfid_tag}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to validate RFID tag"
        ) from e


@router.get("/{rfid_tag}/availability", response_model=RFIDAvailabilityResponse)
async def check_rfid_availability(
    rfid_tag: str,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Check if an RFID tag is available for use."""
    try:
        rfid_service = RFIDService(db)
        availability_result = await rfid_service.check_rfid_availability(rfid_tag)
        return availability_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking RFID availability for {rfid_tag}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check RFID availability"
        ) from e
