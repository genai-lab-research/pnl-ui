from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.tenant import Tenant, TenantCreate, TenantUpdate, TenantList

from app.models.models import Tenant as TenantModel

router = APIRouter()


@router.get("/", response_model=TenantList)
def list_tenants(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None
) -> Any:
    """
    List tenants with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **name**: Filter by tenant name (partial match)
    """
    query = db.query(TenantModel)
    
    # Apply filters
    if name:
        query = query.filter(TenantModel.name.ilike(f"%{name}%"))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    tenants = query.offset(skip).limit(limit).all()
    
    return TenantList(total=total, results=tenants)


@router.post("/", response_model=Tenant, status_code=status.HTTP_201_CREATED)
def create_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_in: TenantCreate
) -> Any:
    """
    Create a new tenant.
    
    - Tenant name must be unique
    """
    # Check if tenant with this name already exists
    tenant_exists = db.query(TenantModel).filter(TenantModel.name == tenant_in.name).first()
    if tenant_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tenant with this name already exists"
        )
    
    # Create new tenant
    db_tenant = TenantModel(name=tenant_in.name)
    
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    
    return db_tenant


@router.get("/{tenant_id}", response_model=Tenant)
def get_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_id: str
) -> Any:
    """
    Get tenant details by ID.
    """
    tenant = db.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    return tenant


@router.put("/{tenant_id}", response_model=Tenant)
def update_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_id: str,
    tenant_in: TenantUpdate
) -> Any:
    """
    Update a tenant.
    
    - Tenant name must be unique if changed
    """
    tenant = db.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Check if name is being changed and if the new name is already in use
    if tenant_in.name and tenant_in.name != tenant.name:
        tenant_with_name = db.query(TenantModel).filter(TenantModel.name == tenant_in.name).first()
        if tenant_with_name:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Tenant with this name already exists"
            )
        tenant.name = tenant_in.name
    
    db.commit()
    db.refresh(tenant)
    
    return tenant


@router.delete("/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_id: str
) -> None:
    """
    Delete a tenant.
    
    - This will fail if there are containers associated with the tenant
    """
    tenant = db.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Check if the tenant has associated containers
    if tenant.containers:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete tenant with associated containers"
        )
    
    db.delete(tenant)
    db.commit()
