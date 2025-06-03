from fastapi import HTTPException, status

from app.models import SeedTypeCreate, SeedTypePublic
from app.repositories.seed_type_repository import SeedTypeRepository


class SeedTypeService:
    def __init__(self):
        self.repository = SeedTypeRepository()

    def get_seed_type_by_id(self, seed_type_id: str) -> SeedTypePublic:
        """Get a seed type by ID."""
        seed_type = self.repository.get_seed_type_by_id(seed_type_id)
        if not seed_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Seed type not found"
            )
        return SeedTypePublic.model_validate(seed_type)

    def get_all_seed_types(self) -> list[SeedTypePublic]:
        """Get all seed types."""
        seed_types = self.repository.get_all_seed_types()
        return [SeedTypePublic.model_validate(seed_type) for seed_type in seed_types]

    def create_seed_type(self, seed_type_data: SeedTypeCreate) -> SeedTypePublic:
        """Create a new seed type."""
        try:
            seed_type = self.repository.create_seed_type(seed_type_data)
            return SeedTypePublic.model_validate(seed_type)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error creating seed type: {str(e)}",
            )

    def update_seed_type(
        self, seed_type_id: str, seed_type_data: SeedTypeCreate
    ) -> SeedTypePublic:
        """Update an existing seed type."""
        seed_type = self.repository.update_seed_type(seed_type_id, seed_type_data)
        if not seed_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Seed type not found"
            )
        return SeedTypePublic.model_validate(seed_type)

    def delete_seed_type(self, seed_type_id: str) -> bool:
        """Delete a seed type."""
        if not self.repository.delete_seed_type(seed_type_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Seed type not found"
            )
        return True
