from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


class ConnectionDetails(BaseModel):
    """Connection details for environment systems"""
    fa: Optional[Dict[str, Any]] = Field(None, description="FA environment configuration")
    pya: Optional[Dict[str, Any]] = Field(None, description="PYA environment configuration")
    aws: Optional[Dict[str, Any]] = Field(None, description="AWS environment configuration")
    mbai: Optional[Dict[str, Any]] = Field(None, description="MBAI environment configuration")
    fh: Optional[Dict[str, Any]] = Field(None, description="FH environment configuration")
    system_version: str = Field(..., description="Environment system version")


class EnvironmentStatus(BaseModel):
    """Environment system status response"""
    is_connected: bool = Field(..., description="Environment system connection status")
    environment_system: Optional[str] = Field(None, description="Name of connected environment system")
    iframe_url: Optional[str] = Field(None, description="Authenticated iframe embedding URL")
    external_url: Optional[str] = Field(None, description="External system access URL")
    last_sync: Optional[datetime] = Field(None, description="Last synchronization timestamp")
    connection_details: Optional[ConnectionDetails] = Field(None, description="System connection information")


class EnvironmentLinksResponse(BaseModel):
    """Environment links response"""
    container_id: int = Field(..., description="Container identifier")
    fa: Optional[Dict[str, Any]] = Field(None, description="FA environment configuration")
    pya: Optional[Dict[str, Any]] = Field(None, description="PYA environment configuration")
    aws: Optional[Dict[str, Any]] = Field(None, description="AWS environment configuration")
    mbai: Optional[Dict[str, Any]] = Field(None, description="MBAI environment configuration")
    fh: Optional[Dict[str, Any]] = Field(None, description="FH environment configuration")


class EnvironmentLinksUpdate(BaseModel):
    """Environment links update request"""
    fa: Optional[Dict[str, Any]] = Field(None, description="FA environment configuration")
    pya: Optional[Dict[str, Any]] = Field(None, description="PYA environment configuration")
    aws: Optional[Dict[str, Any]] = Field(None, description="AWS environment configuration")
    mbai: Optional[Dict[str, Any]] = Field(None, description="MBAI environment configuration")
    fh: Optional[Dict[str, Any]] = Field(None, description="FH environment configuration")


class EnvironmentLinksUpdateResponse(BaseModel):
    """Environment links update response"""
    success: bool = Field(..., description="Update success status")
    message: str = Field(..., description="Status message")
    updated_at: datetime = Field(..., description="Update timestamp")


class ContainerContext(BaseModel):
    """Container context for environment system"""
    container_id: int = Field(..., description="Container identifier")
    environment_id: str = Field(..., description="Environment system identifier")


class IframeUrlResponse(BaseModel):
    """FarmHand iframe URL response"""
    iframe_url: str = Field(..., description="Authenticated iframe URL")
    expires_at: datetime = Field(..., description="URL expiration timestamp")
    permissions: List[str] = Field(..., description="User permissions in environment system")
    container_context: ContainerContext = Field(..., description="Container-specific context")


class ExternalUrlResponse(BaseModel):
    """FarmHand external URL response"""
    external_url: str = Field(..., description="Authenticated external URL")
    expires_at: datetime = Field(..., description="URL expiration timestamp")
    session_token: str = Field(..., description="Session authentication token")


class EnvironmentConnectionRequest(BaseModel):
    """Environment system connection request"""
    environment_system: str = Field(..., description="Target environment system")
    fa: Optional[Dict[str, Any]] = Field(None, description="FA environment configuration")
    pya: Optional[Dict[str, Any]] = Field(None, description="PYA environment configuration")
    aws: Optional[Dict[str, Any]] = Field(None, description="AWS environment configuration")
    mbai: Optional[Dict[str, Any]] = Field(None, description="MBAI environment configuration")
    fh: Optional[Dict[str, Any]] = Field(None, description="FH environment configuration")
    user_permissions: List[str] = Field(..., description="Requested user permissions")


class EnvironmentConnectionResponse(BaseModel):
    """Environment system connection response"""
    success: bool = Field(..., description="Connection initiation status")
    message: str = Field(..., description="Status message")
    connection_id: Optional[str] = Field(None, description="Unique connection identifier")
    iframe_url: Optional[str] = Field(None, description="Initial iframe URL")
    external_url: Optional[str] = Field(None, description="Initial external URL")
    estimated_setup_time: Optional[int] = Field(None, description="Estimated setup time in minutes")


class MaintenanceWindow(BaseModel):
    """Scheduled maintenance information"""
    scheduled: bool = Field(..., description="Whether maintenance is scheduled")
    start_time: Optional[datetime] = Field(None, description="Maintenance start time")
    end_time: Optional[datetime] = Field(None, description="Maintenance end time")
    reason: Optional[str] = Field(None, description="Maintenance reason/description")


class EnvironmentSystemHealth(BaseModel):
    """Environment system health status"""
    status: str = Field(..., description="System health status")
    last_heartbeat: datetime = Field(..., description="Last system heartbeat")
    response_time_ms: float = Field(..., description="Average response time in milliseconds")
    system_version: str = Field(..., description="Current system version")
    features_available: List[str] = Field(..., description="Available system features")
    maintenance_window: Optional[MaintenanceWindow] = Field(None, description="Scheduled maintenance information")


class SessionRefreshResponse(BaseModel):
    """Environment system session refresh response"""
    success: bool = Field(..., description="Session refresh status")
    new_iframe_url: Optional[str] = Field(None, description="Updated iframe URL")
    new_external_url: Optional[str] = Field(None, description="Updated external URL")
    expires_at: Optional[datetime] = Field(None, description="New expiration timestamp")
    session_id: Optional[str] = Field(None, description="New session identifier")


class PlaceholderState(BaseModel):
    """Placeholder state for unconnected containers"""
    message: str = Field(default="This container is not yet connected to an environment control system.", 
                        description="Placeholder message")
    can_connect: bool = Field(..., description="Whether user can initiate connection")
    connection_options: Optional[List[str]] = Field(None, description="Available environment systems")