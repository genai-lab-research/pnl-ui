"""Seed Type API routes for the Vertical Farm Management System."""

import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.models import SeedType
from app.schemas.seed_type import SeedTypeCreate, SeedTypeResponse
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/seed-types", tags=["seed-types"])


@router.get("/", response_model=List[SeedTypeResponse])
async def get_seed_types(
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve list of available seed types."""
    from sqlalchemy import select
    
    try:
        result = await db.execute(select(SeedType))
        seed_types = result.scalars().all()
        return [
            SeedTypeResponse(
                id=st.id,
                name=st.name,
                variety=st.variety,
                supplier=st.supplier,
                batch_id=st.batch_id
            ) for st in seed_types
        ]
    except Exception as e:
        logger.error(f"Error retrieving seed types: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve seed types"
        )


@router.post("/", response_model=SeedTypeResponse, status_code=status.HTTP_201_CREATED)
async def create_seed_type(
    seed_type_data: SeedTypeCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create a new seed type."""
    try:
        seed_type = SeedType(
            name=seed_type_data.name,
            variety=seed_type_data.variety,
            supplier=seed_type_data.supplier,
            batch_id=seed_type_data.batch_id
        )
        db.add(seed_type)
        await db.commit()
        await db.refresh(seed_type)
        
        return SeedTypeResponse(
            id=seed_type.id,
            name=seed_type.name,
            variety=seed_type.variety,
            supplier=seed_type.supplier,
            batch_id=seed_type.batch_id
        )
    except Exception as e:
        logger.error(f"Error creating seed type: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create seed type"
        )