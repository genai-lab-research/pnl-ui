"""Device API routes for the Vertical Farm Management System."""

import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.services.device import DeviceService
from app.schemas.device import (
    ContainerDevices, Device, DeviceDetails, DeviceRegistration, DeviceUpdate,
    DeviceStatusUpdate, DeviceStatusUpdateResponse, DeviceHealthHistory,
    DeviceRestartRequest, DeviceRestartResponse, DeviceManagementSummary,
    BulkStatusUpdate, BulkStatusUpdateResponse
)
from app.schemas.alert import (
    DeviceAlertCreate, DeviceAlerts, AlertAcknowledge, AlertResolve,
    AlertAcknowledgeResponse, AlertResolveResponse
)
from app.schemas.base import SuccessResponse
from app.auth.dependencies import get_current_active_user
from app.core.exceptions import (
    DeviceNotFoundError, ContainerNotFoundError, AlertNotFoundError,
    DeviceValidationError, DeviceOperationError
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/devices", tags=["devices"])

# Container-based device routes (should be mounted under /api/v1/containers)
containers_router = APIRouter(prefix="/containers", tags=["containers", "devices"])


@containers_router.get("/{container_id}/devices", response_model=ContainerDevices)
async def get_container_devices(
    container_id: int = Path(..., description="Container identifier"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve all IoT devices integrated within a specific container."""
    try:
        service = DeviceService(db)
        devices = await service.get_container_devices(container_id)
        return devices
    except ContainerNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error retrieving container devices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve container devices"
        )


@router.get("/{device_id}", response_model=DeviceDetails)
async def get_device_details(
    device_id: int = Path(..., description="Device identifier"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve detailed information about a specific device."""
    try:
        service = DeviceService(db)
        device = await service.get_device_details(device_id)
        return device
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error retrieving device details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve device details"
        )


@router.post("/register", response_model=Device)
async def register_device(
    device_data: DeviceRegistration,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Register a new device in the system."""
    try:
        service = DeviceService(db)
        device = await service.register_device(device_data)
        return device
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except DeviceValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error registering device: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register device"
        )


@router.put("/{device_id}/status", response_model=DeviceStatusUpdateResponse)
async def update_device_status(
    device_id: int = Path(..., description="Device identifier"),
    status_update: DeviceStatusUpdate = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Update the operational status of a device."""
    try:
        service = DeviceService(db)
        response = await service.update_device_status(device_id, status_update)
        return response
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except DeviceValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error updating device status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update device status"
        )


@router.put("/{device_id}", response_model=Device)
async def update_device_information(
    device_id: int = Path(..., description="Device identifier"),
    device_update: DeviceUpdate = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Update device information."""
    try:
        service = DeviceService(db)
        device = await service.update_device_information(device_id, device_update)
        return device
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except DeviceValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error updating device information: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update device information"
        )


@router.get("/{device_id}/health-history", response_model=DeviceHealthHistory)
async def get_device_health_history(
    device_id: int = Path(..., description="Device identifier"),
    start_date: Optional[datetime] = Query(None, description="History start date"),
    end_date: Optional[datetime] = Query(None, description="History end date"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve historical health and status data for a device."""
    try:
        service = DeviceService(db)
        history = await service.get_device_health_history(
            device_id, start_date, end_date, limit
        )
        return history
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error retrieving device health history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve device health history"
        )


@router.post("/{device_id}/restart", response_model=DeviceRestartResponse)
async def restart_device(
    device_id: int = Path(..., description="Device identifier"),
    restart_request: DeviceRestartRequest = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Initiate a restart command for a specific device."""
    try:
        service = DeviceService(db)
        response = await service.restart_device(device_id, restart_request)
        return response
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except DeviceOperationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error restarting device: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to restart device"
        )


@containers_router.get("/{container_id}/devices/alerts", response_model=DeviceAlerts)
async def get_device_alerts(
    container_id: int = Path(..., description="Container identifier"),
    severity: Optional[str] = Query(None, description="Filter by alert severity"),
    device_id: Optional[int] = Query(None, description="Filter by specific device"),
    active_only: bool = Query(True, description="Only active alerts"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve active alerts for devices in the container."""
    try:
        service = DeviceService(db)
        alerts = await service.get_device_alerts(
            container_id, device_id, severity, active_only
        )
        return alerts
    except ContainerNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error retrieving device alerts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve device alerts"
        )


@router.post("/{device_id}/alerts", response_model=Device)
async def create_device_alert(
    device_id: int = Path(..., description="Device identifier"),
    alert_data: DeviceAlertCreate = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create a new device alert."""
    try:
        service = DeviceService(db)
        alert = await service.create_device_alert(device_id, alert_data)
        return alert
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except DeviceValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error creating device alert: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create device alert"
        )


@router.put("/alerts/{alert_id}/acknowledge", response_model=AlertAcknowledgeResponse)
async def acknowledge_device_alert(
    alert_id: int = Path(..., description="Alert identifier"),
    acknowledge_data: AlertAcknowledge = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Acknowledge a device alert."""
    try:
        service = DeviceService(db)
        alert = await service.acknowledge_alert(
            alert_id, acknowledge_data.acknowledged_by, acknowledge_data.notes
        )
        return AlertAcknowledgeResponse(
            success=True,
            message="Alert acknowledged successfully",
            acknowledged_at=alert.acknowledged_at
        )
    except AlertNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error acknowledging alert: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to acknowledge alert"
        )


@router.put("/alerts/{alert_id}/resolve", response_model=AlertResolveResponse)
async def resolve_device_alert(
    alert_id: int = Path(..., description="Alert identifier"),
    resolve_data: AlertResolve = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Resolve a device alert."""
    try:
        service = DeviceService(db)
        alert = await service.resolve_alert(
            alert_id, resolve_data.resolved_by, resolve_data.resolution_notes
        )
        return AlertResolveResponse(
            success=True,
            message="Alert resolved successfully",
            resolved_at=alert.resolved_at
        )
    except AlertNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error resolving alert: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to resolve alert"
        )


@router.delete("/{device_id}", response_model=SuccessResponse)
async def delete_device(
    device_id: int = Path(..., description="Device identifier"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Remove a device from the system."""
    try:
        service = DeviceService(db)
        success = await service.delete_device(device_id)
        return SuccessResponse(
            success=success,
            message="Device deleted successfully",
            deleted_at=datetime.utcnow()
        )
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error deleting device: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete device"
        )


@containers_router.get("/{container_id}/devices/summary", response_model=DeviceManagementSummary)
async def get_device_management_summary(
    container_id: int = Path(..., description="Container identifier"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve overall device management status for a container."""
    try:
        service = DeviceService(db)
        summary = await service.get_device_management_summary(container_id)
        return summary
    except ContainerNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error retrieving device management summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve device management summary"
        )


@router.put("/bulk-status-update", response_model=BulkStatusUpdateResponse)
async def bulk_update_device_status(
    bulk_update: BulkStatusUpdate = ...,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Update status for multiple devices."""
    try:
        service = DeviceService(db)
        response = await service.bulk_update_device_status(bulk_update)
        return response
    except DeviceValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error bulk updating device status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to bulk update device status"
        )


# Additional utility endpoints for device management
@router.get("/{device_id}/heartbeat", response_model=SuccessResponse)
async def device_heartbeat(
    device_id: int = Path(..., description="Device identifier"),
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Simulate device heartbeat update."""
    try:
        service = DeviceService(db)
        await service.simulate_device_heartbeat(device_id)
        return SuccessResponse(
            success=True,
            message="Device heartbeat updated successfully"
        )
    except DeviceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error updating device heartbeat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update device heartbeat"
        )


# Export both routers for use in main app
device_routers = [router, containers_router]
