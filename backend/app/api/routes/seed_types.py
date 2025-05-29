from typing import Any

from fastapi import APIRouter, status

from app.models import Message, SeedTypeCreate, SeedTypePublic
from app.services.seed_type_service import SeedTypeService

router = APIRouter()
seed_type_service = SeedTypeService()


@router.get("/", response_model=list[SeedTypePublic])
def get_seed_types() -> Any:
    """
    Get all seed types.
    """
    return seed_type_service.get_all_seed_types()


@router.get("/{seed_type_id}", response_model=SeedTypePublic)
def get_seed_type(seed_type_id: str) -> Any:
    """
    Get a specific seed type by ID.
    """
    return seed_type_service.get_seed_type_by_id(seed_type_id)


@router.post("/", response_model=SeedTypePublic, status_code=status.HTTP_201_CREATED)
def create_seed_type(
    *,
    seed_type_in: SeedTypeCreate,
) -> Any:
    """
    Create new seed type.
    """
    return seed_type_service.create_seed_type(seed_type_in)


@router.put("/{seed_type_id}", response_model=SeedTypePublic)
def update_seed_type(
    *,
    seed_type_id: str,
    seed_type_in: SeedTypeCreate,
) -> Any:
    """
    Update seed type.
    """
    return seed_type_service.update_seed_type(seed_type_id, seed_type_in)


@router.delete("/{seed_type_id}")
def delete_seed_type(
    seed_type_id: str,
) -> Any:
    """
    Delete seed type.
    """
    seed_type_service.delete_seed_type(seed_type_id)
    return Message(message="Seed type deleted successfully")
