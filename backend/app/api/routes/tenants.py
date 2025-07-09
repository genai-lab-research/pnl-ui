"""Tenant API routes for the Vertical Farm Management System."""

import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_db
from app.models import Tenant
from app.schemas.tenant import TenantCreate, TenantResponse
from app.auth.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.get("/", response_model=List[TenantResponse])
async def get_tenants(
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Retrieve list of available tenants."""
    from sqlalchemy import select
    
    try:
        result = await db.execute(select(Tenant))
        tenants = result.scalars().all()
        return [TenantResponse(id=t.id, name=t.name) for t in tenants]
    except Exception as e:
        logger.error(f"Error retrieving tenants: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tenants"
        )


@router.post("/", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    tenant_data: TenantCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_active_user)
):
    """Create a new tenant."""
    try:
        # Check if tenant name already exists
        from sqlalchemy import select
        existing = await db.execute(select(Tenant).where(Tenant.name == tenant_data.name))
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant with this name already exists"
            )
        
        tenant = Tenant(name=tenant_data.name)
        db.add(tenant)
        await db.commit()
        await db.refresh(tenant)
        
        return TenantResponse(id=tenant.id, name=tenant.name)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating tenant: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create tenant"
        )