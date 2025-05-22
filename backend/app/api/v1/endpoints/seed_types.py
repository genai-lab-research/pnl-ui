from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.seed_type import SeedType, SeedTypeCreate, SeedTypeUpdate
from app.models.models import SeedType as SeedTypeModel

router = APIRouter()


@router.get("/", response_model=List[SeedType])
def list_seed_types(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    variety: Optional[str] = None,
    supplier: Optional[str] = None
) -> Any:
    """
    Get all seed types.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **name**: Filter by seed name (partial match)
    - **variety**: Filter by variety (partial match)
    - **supplier**: Filter by supplier (partial match)
    """
    query = db.query(SeedTypeModel)
    
    # Apply filters
    if name:
        query = query.filter(SeedTypeModel.name.ilike(f"%{name}%"))
    if variety:
        query = query.filter(SeedTypeModel.variety.ilike(f"%{variety}%"))
    if supplier:
        query = query.filter(SeedTypeModel.supplier.ilike(f"%{supplier}%"))
    
    # Apply pagination
    seed_types = query.offset(skip).limit(limit).all()
    
    return seed_types


@router.post("/", response_model=SeedType, status_code=status.HTTP_201_CREATED)
def create_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_in: SeedTypeCreate
) -> Any:
    """
    Create a new seed type.
    """
    db_seed_type = SeedTypeModel(
        name=seed_type_in.name,
        variety=seed_type_in.variety,
        supplier=seed_type_in.supplier,
        batch_id=seed_type_in.batch_id
    )
    
    db.add(db_seed_type)
    db.commit()
    db.refresh(db_seed_type)
    
    return db_seed_type


@router.get("/{seed_type_id}", response_model=SeedType)
def get_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_id: str
) -> Any:
    """
    Get seed type details by ID.
    """
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    return seed_type


@router.put("/{seed_type_id}", response_model=SeedType)
def update_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_id: str,
    seed_type_in: SeedTypeUpdate
) -> Any:
    """
    Update a seed type.
    """
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    
    update_data = seed_type_in.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(seed_type, field, value)
    
    db.commit()
    db.refresh(seed_type)
    
    return seed_type


@router.delete("/{seed_type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_seed_type(
    *,
    db: Session = Depends(get_db),
    seed_type_id: str
) -> None:
    """
    Delete a seed type.
    
    - This will fail if there are containers using this seed type
    """
    seed_type = db.query(SeedTypeModel).filter(SeedTypeModel.id == seed_type_id).first()
    if not seed_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Seed type not found"
        )
    
    # Check if the seed type is being used by any containers
    if seed_type.containers:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete seed type that is in use by containers"
        )
    
    db.delete(seed_type)
    db.commit()