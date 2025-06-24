from typing import List, Union
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.services.location import LocationService
from app.schemas.location import LocationCreate, LocationUpdate, LocationResponse
from app.core.pagination import PaginationParams, PaginatedResponse

router = APIRouter()


@router.get("/", response_model=Union[List[LocationResponse], PaginatedResponse[LocationResponse]])
def list_locations(
    skip: int = Query(None, ge=0, description="Number of locations to skip (legacy)"),
    limit: int = Query(None, ge=1, le=1000, description="Number of locations to return (legacy)"),
    page: int = Query(None, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(None, ge=1, le=1000, description="Number of items per page"),
    db: Session = Depends(get_db),
):
    service = LocationService(db)
    
    # Check if new pagination parameters are provided
    if page is not None or page_size is not None:
        # Use new pagination
        pagination = PaginationParams(
            page=page or 1,
            page_size=page_size or 20
        )
        return service.get_locations_paginated(pagination)
    else:
        # Use legacy pagination for backward compatibility
        skip_val = skip or 0
        limit_val = limit or 100
        return service.get_locations(skip=skip_val, limit=limit_val)


@router.post("/", response_model=LocationResponse, status_code=201)
def create_location(
    location: LocationCreate,
    db: Session = Depends(get_db),
):
    service = LocationService(db)
    return service.create_location(location)


@router.get("/{location_id}", response_model=LocationResponse)
def get_location(
    location_id: int,
    db: Session = Depends(get_db),
):
    service = LocationService(db)
    location = service.get_location(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.put("/{location_id}", response_model=LocationResponse)
def update_location(
    location_id: int,
    location: LocationUpdate,
    db: Session = Depends(get_db),
):
    service = LocationService(db)
    updated_location = service.update_location(location_id, location)
    if not updated_location:
        raise HTTPException(status_code=404, detail="Location not found")
    return updated_location


@router.delete("/{location_id}", status_code=204)
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
):
    service = LocationService(db)
    if not service.delete_location(location_id):
        raise HTTPException(status_code=404, detail="Location not found")
