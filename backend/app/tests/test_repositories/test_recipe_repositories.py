"""Test recipe repository implementations."""

import pytest
import pytest_asyncio
from datetime import datetime, date
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.recipe_master import RecipeMasterRepository
from app.repositories.recipe_version import RecipeVersionRepository
from app.repositories.crop import CropRepository
from app.repositories.crop_history import CropHistoryRepository
from app.repositories.crop_measurement import CropMeasurementRepository
from app.repositories.crop_snapshot import CropSnapshotRepository

from app.schemas.recipe import (
    RecipeMasterCreate, RecipeMasterUpdate, RecipeFilterCriteria,
    RecipeVersionCreate, RecipeVersionUpdate,
    CropCreate, CropUpdate, CropFilterCriteria,
    CropHistoryCreate, CropSnapshotCreate, CropSnapshotFilterCriteria,
    CropMeasurementCreate, CropMeasurementUpdate
)

from app.models.recipe import RecipeMaster, RecipeVersion
from app.models.crop import Crop


class TestRecipeMasterRepository:
    """Test RecipeMasterRepository functionality."""

    @pytest_asyncio.fixture
    async def recipe_repo(self, async_session: AsyncSession):
        """Create recipe repository instance."""
        return RecipeMasterRepository(async_session)

    @pytest_asyncio.fixture
    async def sample_recipes(self, async_session: AsyncSession):
        """Create sample recipes for testing."""
        recipes = [
            RecipeMaster(name="Tomato Recipe", crop_type="Tomato", notes="Basic tomato"),
            RecipeMaster(name="Lettuce Recipe", crop_type="Lettuce", notes="Hydroponic lettuce"),
            RecipeMaster(name="Basil Recipe", crop_type="Basil", notes="Aromatic basil"),
        ]
        async_session.add_all(recipes)
        await async_session.commit()
        
        for recipe in recipes:
            await async_session.refresh(recipe)
        
        return recipes

    @pytest.mark.asyncio
    async def test_create_recipe(self, recipe_repo: RecipeMasterRepository):
        """Test creating a new recipe."""
        recipe_data = RecipeMasterCreate(
            name="Test Recipe",
            crop_type="Test Crop",
            notes="Test notes"
        )
        
        created_recipe = await recipe_repo.create(recipe_data)
        
        assert created_recipe.id is not None
        assert created_recipe.name == "Test Recipe"
        assert created_recipe.crop_type == "Test Crop"

    @pytest.mark.asyncio
    async def test_get_recipe_by_id(self, recipe_repo: RecipeMasterRepository, sample_recipes):
        """Test getting recipe by ID."""
        recipe_id = sample_recipes[0].id
        
        retrieved_recipe = await recipe_repo.get(recipe_id)
        
        assert retrieved_recipe is not None
        assert retrieved_recipe.id == recipe_id
        assert retrieved_recipe.name == "Tomato Recipe"

    @pytest.mark.asyncio
    async def test_get_recipe_with_versions(self, recipe_repo: RecipeMasterRepository, sample_recipes, async_session):
        """Test getting recipe with all versions."""
        recipe = sample_recipes[0]
        
        # Create a version for the recipe
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.commit()
        
        # Get recipe with versions
        retrieved_recipe = await recipe_repo.get_with_versions(recipe.id)
        
        assert retrieved_recipe is not None
        assert len(retrieved_recipe.recipe_versions) == 1
        assert retrieved_recipe.recipe_versions[0].version == "1.0"

    @pytest.mark.asyncio
    async def test_update_recipe(self, recipe_repo: RecipeMasterRepository, sample_recipes):
        """Test updating an existing recipe."""
        recipe_id = sample_recipes[0].id
        update_data = RecipeMasterUpdate(
            name="Updated Tomato Recipe",
            crop_type="Cherry Tomato",
            notes="Updated notes"
        )
        
        updated_recipe = await recipe_repo.update(recipe_id, update_data)
        
        assert updated_recipe is not None
        assert updated_recipe.name == "Updated Tomato Recipe"
        assert updated_recipe.crop_type == "Cherry Tomato"

    @pytest.mark.asyncio
    async def test_delete_recipe(self, recipe_repo: RecipeMasterRepository, sample_recipes):
        """Test deleting a recipe."""
        recipe_id = sample_recipes[0].id
        
        result = await recipe_repo.delete(recipe_id)
        
        assert result is True
        
        # Verify deletion
        deleted_recipe = await recipe_repo.get(recipe_id)
        assert deleted_recipe is None

    @pytest.mark.asyncio
    async def test_get_filtered_recipes(self, recipe_repo: RecipeMasterRepository, sample_recipes):
        """Test filtering recipes with criteria."""
        criteria = RecipeFilterCriteria(
            search="tomato",
            crop_type="Tomato",
            page=1,
            limit=10
        )
        
        filtered_recipes = await recipe_repo.get_filtered(criteria)
        
        assert len(filtered_recipes) == 1
        assert filtered_recipes[0].name == "Tomato Recipe"

    @pytest.mark.asyncio
    async def test_get_filtered_recipes_with_versions(self, recipe_repo: RecipeMasterRepository, sample_recipes, async_session):
        """Test filtering recipes with versions included."""
        recipe = sample_recipes[0]
        
        # Create version
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.commit()
        
        criteria = RecipeFilterCriteria(crop_type="Tomato")
        
        filtered_recipes = await recipe_repo.get_filtered(criteria, include_versions=True)
        
        assert len(filtered_recipes) == 1
        assert len(filtered_recipes[0].recipe_versions) == 1

    @pytest.mark.asyncio
    async def test_get_count_filtered(self, recipe_repo: RecipeMasterRepository, sample_recipes):
        """Test getting count of filtered recipes."""
        criteria = RecipeFilterCriteria(crop_type="Lettuce")
        
        count = await recipe_repo.get_count_filtered(criteria)
        
        assert count == 1

    @pytest.mark.asyncio
    async def test_get_by_crop_type(self, recipe_repo: RecipeMasterRepository, sample_recipes):
        """Test getting recipes by crop type."""
        tomato_recipes = await recipe_repo.get_by_crop_type("Tomato")
        
        assert len(tomato_recipes) == 1
        assert tomato_recipes[0].crop_type == "Tomato"


class TestRecipeVersionRepository:
    """Test RecipeVersionRepository functionality."""

    @pytest_asyncio.fixture
    async def version_repo(self, async_session: AsyncSession):
        """Create version repository instance."""
        return RecipeVersionRepository(async_session)

    @pytest_asyncio.fixture
    async def recipe_repo(self, async_session: AsyncSession):
        """Create recipe repository instance."""
        return RecipeMasterRepository(async_session)

    @pytest_asyncio.fixture
    async def sample_recipe_with_versions(self, async_session: AsyncSession):
        """Create sample recipe with versions."""
        recipe = RecipeMaster(name="Version Test Recipe", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        versions = [
            RecipeVersion(
                recipe_id=recipe.id,
                version="1.0",
                valid_from=datetime.utcnow(),
                created_by="user1",
                air_temperature=22.0
            ),
            RecipeVersion(
                recipe_id=recipe.id,
                version="1.1",
                valid_from=datetime.utcnow(),
                created_by="user2",
                air_temperature=23.0
            ),
        ]
        async_session.add_all(versions)
        await async_session.commit()
        
        await async_session.refresh(recipe)
        for version in versions:
            await async_session.refresh(version)
        
        return recipe, versions

    @pytest.mark.asyncio
    async def test_create_version(self, version_repo: RecipeVersionRepository, recipe_repo: RecipeMasterRepository):
        """Test creating a new recipe version."""
        # Create recipe first
        recipe_data = RecipeMasterCreate(name="Test Recipe", crop_type="Test")
        recipe = await recipe_repo.create(recipe_data)
        
        version_data = RecipeVersionCreate(
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="test_user",
            air_temperature=25.0,
            humidity=70.0
        )
        
        created_version = await version_repo.create_version(recipe.id, version_data)
        
        assert created_version.id is not None
        assert created_version.version == "1.0"
        assert created_version.recipe_id == recipe.id

    @pytest.mark.asyncio
    async def test_get_version_by_id(self, version_repo: RecipeVersionRepository, sample_recipe_with_versions):
        """Test getting version by ID."""
        recipe, versions = sample_recipe_with_versions
        version_id = versions[0].id
        
        retrieved_version = await version_repo.get(version_id)
        
        assert retrieved_version is not None
        assert retrieved_version.version == "1.0"

    @pytest.mark.asyncio
    async def test_get_by_recipe_id(self, version_repo: RecipeVersionRepository, sample_recipe_with_versions):
        """Test getting all versions for a recipe."""
        recipe, versions = sample_recipe_with_versions
        
        recipe_versions = await version_repo.get_by_recipe_id(recipe.id)
        
        assert len(recipe_versions) == 2
        assert recipe_versions[0].version in ["1.0", "1.1"]

    @pytest.mark.asyncio
    async def test_get_latest_version(self, version_repo: RecipeVersionRepository, sample_recipe_with_versions):
        """Test getting latest version for a recipe."""
        recipe, versions = sample_recipe_with_versions
        
        latest_version = await version_repo.get_latest_version(recipe.id)
        
        assert latest_version is not None
        # Should be the most recent one based on valid_from

    @pytest.mark.asyncio
    async def test_update_version(self, version_repo: RecipeVersionRepository, sample_recipe_with_versions):
        """Test updating a recipe version."""
        recipe, versions = sample_recipe_with_versions
        version_id = versions[0].id
        
        update_data = RecipeVersionUpdate(
            version="1.0-updated",
            valid_from=datetime.utcnow(),
            created_by="updated_user",
            air_temperature=24.0
        )
        
        updated_version = await version_repo.update(version_id, update_data)
        
        assert updated_version is not None
        assert updated_version.version == "1.0-updated"
        assert updated_version.air_temperature == 24.0

    @pytest.mark.asyncio
    async def test_delete_version(self, version_repo: RecipeVersionRepository, sample_recipe_with_versions):
        """Test deleting a recipe version."""
        recipe, versions = sample_recipe_with_versions
        version_id = versions[0].id
        
        result = await version_repo.delete(version_id)
        
        assert result is True
        
        # Verify deletion
        deleted_version = await version_repo.get(version_id)
        assert deleted_version is None

    @pytest.mark.asyncio
    async def test_is_version_unique(self, version_repo: RecipeVersionRepository, sample_recipe_with_versions):
        """Test checking version uniqueness."""
        recipe, versions = sample_recipe_with_versions
        
        # Test existing version
        is_unique = await version_repo.is_version_unique(recipe.id, "1.0")
        assert is_unique is False
        
        # Test new version
        is_unique = await version_repo.is_version_unique(recipe.id, "2.0")
        assert is_unique is True


class TestCropRepository:
    """Test CropRepository functionality."""

    @pytest_asyncio.fixture
    async def crop_repo(self, async_session: AsyncSession):
        """Create crop repository instance."""
        return CropRepository(async_session)

    @pytest_asyncio.fixture
    async def sample_crops_with_recipe(self, async_session: AsyncSession):
        """Create sample crops with recipe relationship."""
        # Create recipe and version
        recipe = RecipeMaster(name="Crop Test Recipe", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.flush()
        
        # Create crops
        crops = [
            Crop(
                seed_date=date.today(),
                lifecycle_status="growing",
                health_check="good",
                recipe_version_id=version.id,
                notes="Test crop 1"
            ),
            Crop(
                seed_date=date.today(),
                lifecycle_status="mature",
                health_check="excellent",
                recipe_version_id=version.id,
                notes="Test crop 2"
            ),
        ]
        async_session.add_all(crops)
        await async_session.commit()
        
        for crop in crops:
            await async_session.refresh(crop)
        
        return crops, version

    @pytest.mark.asyncio
    async def test_create_crop(self, crop_repo: CropRepository):
        """Test creating a new crop."""
        crop_data = CropCreate(
            seed_date=date.today(),
            lifecycle_status="seedling",
            health_check="good",
            current_location={"zone": "A", "tray": 1},
            notes="Test crop"
        )
        
        created_crop = await crop_repo.create(crop_data)
        
        assert created_crop.id is not None
        assert created_crop.lifecycle_status == "seedling"
        assert created_crop.current_location == {"zone": "A", "tray": 1}

    @pytest.mark.asyncio
    async def test_get_crop_by_id(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test getting crop by ID."""
        crops, version = sample_crops_with_recipe
        crop_id = crops[0].id
        
        retrieved_crop = await crop_repo.get(crop_id)
        
        assert retrieved_crop is not None
        assert retrieved_crop.id == crop_id
        assert retrieved_crop.lifecycle_status == "growing"

    @pytest.mark.asyncio
    async def test_get_crop_with_relationships(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test getting crop with all relationships."""
        crops, version = sample_crops_with_recipe
        crop_id = crops[0].id
        
        retrieved_crop = await crop_repo.get_with_relationships(crop_id)
        
        assert retrieved_crop is not None
        assert retrieved_crop.recipe_version is not None
        assert retrieved_crop.recipe_version.version == "1.0"

    @pytest.mark.asyncio
    async def test_update_crop(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test updating a crop."""
        crops, version = sample_crops_with_recipe
        crop_id = crops[0].id
        
        update_data = CropUpdate(
            lifecycle_status="flowering",
            health_check="excellent",
            notes="Updated crop"
        )
        
        updated_crop = await crop_repo.update(crop_id, update_data)
        
        assert updated_crop is not None
        assert updated_crop.lifecycle_status == "flowering"
        assert updated_crop.health_check == "excellent"

    @pytest.mark.asyncio
    async def test_delete_crop(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test deleting a crop."""
        crops, version = sample_crops_with_recipe
        crop_id = crops[0].id
        
        result = await crop_repo.delete(crop_id)
        
        assert result is True
        
        # Verify deletion
        deleted_crop = await crop_repo.get(crop_id)
        assert deleted_crop is None

    @pytest.mark.asyncio
    async def test_get_filtered_crops(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test filtering crops with criteria."""
        crops, version = sample_crops_with_recipe
        
        criteria = CropFilterCriteria(
            lifecycle_status="growing",
            page=1,
            limit=10
        )
        
        filtered_crops = await crop_repo.get_filtered(criteria)
        
        assert len(filtered_crops) == 1
        assert filtered_crops[0].lifecycle_status == "growing"

    @pytest.mark.asyncio
    async def test_get_count_filtered(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test getting count of filtered crops."""
        crops, version = sample_crops_with_recipe
        
        criteria = CropFilterCriteria(health_check="excellent")
        
        count = await crop_repo.get_count_filtered(criteria)
        
        assert count == 1

    @pytest.mark.asyncio
    async def test_get_by_recipe_version(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test getting crops by recipe version."""
        crops, version = sample_crops_with_recipe
        
        recipe_crops = await crop_repo.get_by_recipe_version(version.id)
        
        assert len(recipe_crops) == 2

    @pytest.mark.asyncio
    async def test_get_by_lifecycle_status(self, crop_repo: CropRepository, sample_crops_with_recipe):
        """Test getting crops by lifecycle status."""
        crops, version = sample_crops_with_recipe
        
        growing_crops = await crop_repo.get_by_lifecycle_status("growing")
        
        assert len(growing_crops) == 1
        assert growing_crops[0].lifecycle_status == "growing"


class TestCropMeasurementRepository:
    """Test CropMeasurementRepository functionality."""

    @pytest_asyncio.fixture
    async def measurement_repo(self, async_session: AsyncSession):
        """Create measurement repository instance."""
        return CropMeasurementRepository(async_session)

    @pytest.mark.asyncio
    async def test_create_measurement(self, measurement_repo: CropMeasurementRepository):
        """Test creating a new measurement."""
        measurement_data = CropMeasurementCreate(
            radius=5.0,
            width=10.0,
            height=15.0,
            area=150.0,
            weight=200.0
        )
        
        created_measurement = await measurement_repo.create_measurement(measurement_data)
        
        assert created_measurement.id is not None
        assert created_measurement.radius == 5.0
        assert created_measurement.weight == 200.0

    @pytest.mark.asyncio
    async def test_get_measurement_by_id(self, measurement_repo: CropMeasurementRepository):
        """Test getting measurement by ID."""
        # Create measurement first
        measurement_data = CropMeasurementCreate(width=12.0, height=18.0)
        created_measurement = await measurement_repo.create_measurement(measurement_data)
        
        # Get by ID
        retrieved_measurement = await measurement_repo.get_by_id(created_measurement.id)
        
        assert retrieved_measurement is not None
        assert retrieved_measurement.width == 12.0

    @pytest.mark.asyncio
    async def test_update_measurement(self, measurement_repo: CropMeasurementRepository):
        """Test updating a measurement."""
        # Create measurement first
        measurement_data = CropMeasurementCreate(radius=3.0, weight=100.0)
        created_measurement = await measurement_repo.create_measurement(measurement_data)
        
        # Update
        update_data = CropMeasurementUpdate(radius=4.0, weight=150.0)
        updated_measurement = await measurement_repo.update_measurement(created_measurement.id, update_data)
        
        assert updated_measurement is not None
        assert updated_measurement.radius == 4.0
        assert updated_measurement.weight == 150.0

    @pytest.mark.asyncio
    async def test_delete_measurement(self, measurement_repo: CropMeasurementRepository):
        """Test deleting a measurement."""
        # Create measurement first
        measurement_data = CropMeasurementCreate(area=100.0)
        created_measurement = await measurement_repo.create_measurement(measurement_data)
        
        # Delete
        result = await measurement_repo.delete_measurement(created_measurement.id)
        
        assert result is True
        
        # Verify deletion
        deleted_measurement = await measurement_repo.get_by_id(created_measurement.id)
        assert deleted_measurement is None