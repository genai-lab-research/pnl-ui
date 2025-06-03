from app.models import (
    SeedType,
    SeedTypeCreate,
)


class SeedTypeRepository:
    def __init__(self):
        self._seed_types: dict[str, SeedType] = {}
        self._initialize_mock_data()

    def _initialize_mock_data(self):
        """Initialize repository with mock seed types from the page2 specification."""
        mock_seed_types = [
            {
                "id": "seed-001",
                "name": "Someroots",
                "variety": "Standard",
                "supplier": "BioCrop",
            },
            {
                "id": "seed-002",
                "name": "Sunflower",
                "variety": "Giant",
                "supplier": "SeedPro",
            },
            {
                "id": "seed-003",
                "name": "Basil",
                "variety": "Sweet",
                "supplier": "HerbGarden",
            },
            {
                "id": "seed-004",
                "name": "Lettuce",
                "variety": "Romaine",
                "supplier": "GreenLeaf",
            },
            {
                "id": "seed-005",
                "name": "Kale",
                "variety": "Curly",
                "supplier": "Nutrifoods",
            },
            {
                "id": "seed-006",
                "name": "Spinach",
                "variety": "Baby",
                "supplier": "GreenLeaf",
            },
            {
                "id": "seed-007",
                "name": "Arugula",
                "variety": "Wild",
                "supplier": "HerbGarden",
            },
            {
                "id": "seed-008",
                "name": "Microgreens",
                "variety": "Mixed",
                "supplier": "SproutLife",
            },
        ]

        for seed_data in mock_seed_types:
            seed_type = SeedType(**seed_data)
            self._seed_types[seed_type.id] = seed_type

    def get_seed_type_by_id(self, seed_type_id: str) -> SeedType | None:
        """Get a seed type by its ID."""
        return self._seed_types.get(seed_type_id)

    def get_all_seed_types(self) -> list[SeedType]:
        """Get all seed types."""
        return list(self._seed_types.values())

    def create_seed_type(self, seed_type_data: SeedTypeCreate) -> SeedType:
        """Create a new seed type."""
        seed_type_id = f"seed-{len(self._seed_types) + 1:03d}"
        seed_type = SeedType(id=seed_type_id, **seed_type_data.model_dump())
        self._seed_types[seed_type_id] = seed_type
        return seed_type

    def update_seed_type(
        self, seed_type_id: str, seed_type_data: SeedTypeCreate
    ) -> SeedType | None:
        """Update an existing seed type."""
        if seed_type_id not in self._seed_types:
            return None

        seed_type = self._seed_types[seed_type_id]
        update_data = seed_type_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(seed_type, field, value)
        return seed_type

    def delete_seed_type(self, seed_type_id: str) -> bool:
        """Delete a seed type."""
        if seed_type_id not in self._seed_types:
            return False
        del self._seed_types[seed_type_id]
        return True
