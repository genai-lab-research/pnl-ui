from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.auth.dependencies import get_current_user
from app.services.environment import EnvironmentService
from app.services.recipe_application import RecipeApplicationService
from app.schemas.environment import (
    EnvironmentStatus, EnvironmentLinksResponse, EnvironmentLinksUpdate,
    EnvironmentLinksUpdateResponse, IframeUrlResponse, ExternalUrlResponse,
    EnvironmentConnectionRequest, EnvironmentConnectionResponse,
    EnvironmentSystemHealth, SessionRefreshResponse
)
from app.schemas.recipe import (
    ActiveRecipe, RecipeApplicationRequest, RecipeApplicationResponse,
    RecipeApplicationHistory, AvailableRecipeVersion
)
# No UserInDB import needed - get_current_user returns dict
from app.core.exceptions import NotFoundException, ValidationException

router = APIRouter()


@router.get("/containers/{container_id}/environment/status", response_model=EnvironmentStatus)
async def get_container_environment_status(
    container_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get container environment system connection status and iframe configuration.
    
    - **container_id**: Container identifier
    - Returns environment connection status, URLs, and connection details
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.get_environment_status(container_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/containers/{container_id}/environment-links", response_model=EnvironmentLinksResponse)
async def get_environment_links(
    container_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get environment links from environment_links table.
    
    - **container_id**: Container identifier
    - Returns environment configuration for all systems (fa, pya, aws, mbai, fh)
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.get_environment_links(container_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/containers/{container_id}/environment-links", response_model=EnvironmentLinksUpdateResponse)
async def update_environment_links(
    container_id: int,
    update_data: EnvironmentLinksUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update environment links in environment_links table.
    
    - **container_id**: Container identifier
    - **update_data**: Environment configuration updates
    - Returns success status and update timestamp
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.update_environment_links(container_id, update_data)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/containers/{container_id}/environment/iframe-url", response_model=IframeUrlResponse)
async def get_farmhand_iframe_url(
    container_id: int,
    tab: Optional[str] = Query(None, description="Specific FarmHand tab to open"),
    refresh: Optional[bool] = Query(False, description="Force refresh of authentication token"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Generate authenticated iframe URL for embedding FarmHand interface.
    
    - **container_id**: Container identifier
    - **tab**: Optional specific FarmHand tab to open
    - **refresh**: Optional flag to force refresh of authentication token
    - Returns iframe URL with expiration and permissions
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.get_iframe_url(container_id, tab, refresh)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/containers/{container_id}/environment/external-url", response_model=ExternalUrlResponse)
async def get_farmhand_external_url(
    container_id: int,
    tab: Optional[str] = Query(None, description="Specific FarmHand tab to open"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Generate authenticated external URL for opening FarmHand in new tab.
    
    - **container_id**: Container identifier
    - **tab**: Optional specific FarmHand tab to open
    - Returns external URL with expiration and session token
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.get_external_url(container_id, tab)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/containers/{container_id}/environment/connect", response_model=EnvironmentConnectionResponse)
async def initialize_environment_connection(
    container_id: int,
    connection_request: EnvironmentConnectionRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Initialize connection to environment control system for containers not yet connected.
    
    - **container_id**: Container identifier
    - **connection_request**: Environment system connection configuration
    - Returns connection status, URLs, and estimated setup time
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.initialize_environment_connection(container_id, connection_request)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/containers/{container_id}/environment/health", response_model=EnvironmentSystemHealth)
async def get_environment_system_health(
    container_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get health status of the connected environment system.
    
    - **container_id**: Container identifier
    - Returns system health status, response times, and maintenance information
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.get_system_health(container_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/containers/{container_id}/environment/refresh-session", response_model=SessionRefreshResponse)
async def refresh_environment_session(
    container_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Refresh the authentication session for environment system access.
    
    - **container_id**: Container identifier
    - Returns refreshed URLs and new session information
    """
    try:
        environment_service = EnvironmentService(db)
        return await environment_service.refresh_session(container_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Recipe Management Routes

@router.get("/containers/{container_id}/recipes/active", response_model=List[ActiveRecipe])
async def get_active_recipes(
    container_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get currently active recipes for the container from recipe_versions.
    
    - **container_id**: Container identifier
    - Returns list of currently active recipes with environment parameters
    """
    try:
        recipe_service = RecipeApplicationService(db)
        return await recipe_service.get_active_recipes(container_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/containers/{container_id}/recipes/apply", response_model=RecipeApplicationResponse)
async def apply_recipe_version(
    container_id: int,
    request: RecipeApplicationRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Apply a recipe version to the container environment.
    
    - **container_id**: Container identifier
    - **request**: Recipe application request with version ID and sync options
    - Returns application status and environment sync information
    """
    try:
        recipe_service = RecipeApplicationService(db)
        return await recipe_service.apply_recipe_version(container_id, request)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/containers/{container_id}/recipes/history", response_model=List[RecipeApplicationHistory])
async def get_recipe_application_history(
    container_id: int,
    limit: Optional[int] = Query(50, description="Maximum number of records"),
    start_date: Optional[str] = Query(None, description="Filter from start date (ISO format)"),
    end_date: Optional[str] = Query(None, description="Filter to end date (ISO format)"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get history of recipe applications for the container.
    
    - **container_id**: Container identifier
    - **limit**: Maximum number of records to return (default: 50)
    - **start_date**: Optional filter from start date
    - **end_date**: Optional filter to end date
    - Returns chronological history of recipe applications
    """
    try:
        # Parse date strings if provided
        parsed_start_date = None
        parsed_end_date = None
        if start_date:
            from datetime import datetime
            parsed_start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        if end_date:
            from datetime import datetime
            parsed_end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

        recipe_service = RecipeApplicationService(db)
        return await recipe_service.get_recipe_application_history(
            container_id, limit, parsed_start_date, parsed_end_date
        )
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/containers/{container_id}/recipes/available", response_model=List[AvailableRecipeVersion])
async def get_available_recipe_versions(
    container_id: int,
    crop_type: Optional[str] = Query(None, description="Filter by crop type"),
    active_only: Optional[bool] = Query(True, description="Only active versions"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get available recipe versions that can be applied to the container.
    
    - **container_id**: Container identifier
    - **crop_type**: Optional filter by crop type
    - **active_only**: Only return active versions (default: true)
    - Returns list of available recipe versions with environment parameters
    """
    try:
        recipe_service = RecipeApplicationService(db)
        return await recipe_service.get_available_recipe_versions(container_id, crop_type, active_only)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))