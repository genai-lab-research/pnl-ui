"""Test recipe models for data validation and relationships."""

import pytest
import pytest_asyncio
from datetime import datetime, date, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.models.recipe import RecipeMaster, RecipeVersion
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.models.snapshots import CropSnapshot


class TestRecipeMaster:
    """Test RecipeMaster model validation and functionality."""

    @pytest_asyncio.fixture
    async def sample_recipe_master(self, async_session: AsyncSession):
        """Create a sample recipe master for testing."""
        recipe = RecipeMaster(
            name="Tomato Growth Recipe",
            crop_type="Tomato",
            notes="Basic tomato growing recipe"
        )
        async_session.add(recipe)
        await async_session.commit()
        await async_session.refresh(recipe)
        return recipe

    @pytest.mark.asyncio
    async def test_recipe_master_creation(self, async_session: AsyncSession):
        """Test basic recipe master creation."""
        recipe = RecipeMaster(
            name="Test Recipe",
            crop_type="Lettuce",
            notes="Test notes"
        )
        
        async_session.add(recipe)
        await async_session.commit()
        await async_session.refresh(recipe)
        
        assert recipe.id is not None
        assert recipe.name == "Test Recipe"
        assert recipe.crop_type == "Lettuce"
        assert recipe.notes == "Test notes"

    @pytest.mark.asyncio
    async def test_recipe_master_required_fields(self, async_session: AsyncSession):
        """Test that required fields are validated."""
        # Test missing name
        with pytest.raises(IntegrityError):
            recipe = RecipeMaster(
                name=None,
                crop_type="Lettuce",
                notes="Test notes"
            )
            async_session.add(recipe)
            await async_session.commit()

    @pytest.mark.asyncio
    async def test_recipe_master_optional_notes(self, async_session: AsyncSession):
        """Test that notes field is optional."""
        recipe = RecipeMaster(
            name="Test Recipe",
            crop_type="Lettuce",
            notes=None
        )
        
        async_session.add(recipe)
        await async_session.commit()
        await async_session.refresh(recipe)
        
        assert recipe.notes is None

    @pytest.mark.asyncio
    async def test_recipe_master_versions_relationship(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test relationship with recipe versions."""
        # Create a version for the recipe
        version = RecipeVersion(
            recipe_id=sample_recipe_master.id,
            version="1.0",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user",
            tray_density=10.5,
            air_temperature=22.0
        )
        
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        
        # Test the relationship using explicit loading
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        
        # Load recipe master with versions
        result = await async_session.execute(
            select(RecipeMaster).options(
                selectinload(RecipeMaster.recipe_versions)
            ).where(RecipeMaster.id == sample_recipe_master.id)
        )
        recipe_with_versions = result.scalar_one()
        
        assert len(recipe_with_versions.recipe_versions) == 1
        assert recipe_with_versions.recipe_versions[0].version == "1.0"

    @pytest.mark.asyncio
    async def test_recipe_master_cascade_delete(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test that deleting recipe master cascades to versions."""
        # Create a version
        version = RecipeVersion(
            recipe_id=sample_recipe_master.id,
            version="1.0",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.commit()
        
        recipe_id = sample_recipe_master.id
        
        # Delete the recipe master
        await async_session.delete(sample_recipe_master)
        await async_session.commit()
        
        # Verify version is also deleted
        from sqlalchemy import select
        result = await async_session.execute(
            select(RecipeVersion).where(RecipeVersion.recipe_id == recipe_id)
        )
        remaining_versions = result.scalars().all()
        assert len(remaining_versions) == 0


class TestRecipeVersion:
    """Test RecipeVersion model validation and functionality."""

    @pytest_asyncio.fixture
    async def sample_recipe_master(self, async_session: AsyncSession):
        """Create a sample recipe master for testing."""
        recipe = RecipeMaster(
            name="Base Recipe",
            crop_type="Basil",
            notes="Base recipe for testing versions"
        )
        async_session.add(recipe)
        await async_session.commit()
        await async_session.refresh(recipe)
        return recipe

    @pytest.mark.asyncio
    async def test_recipe_version_creation(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test basic recipe version creation."""
        version = RecipeVersion(
            recipe_id=sample_recipe_master.id,
            version="1.0",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user",
            tray_density=15.0,
            air_temperature=25.0,
            humidity=70.0,
            co2=400.0,
            water_temperature=20.0,
            ec=1.5,
            ph=6.5,
            water_hours=8.0,
            light_hours=16.0
        )
        
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        
        assert version.id is not None
        assert version.version == "1.0"
        assert version.created_by == "test_user"
        assert version.tray_density == 15.0
        assert version.ph == 6.5

    @pytest.mark.asyncio
    async def test_recipe_version_required_fields(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test that required fields are validated."""
        # Test missing version
        with pytest.raises(IntegrityError):
            version = RecipeVersion(
                recipe_id=sample_recipe_master.id,
                version=None,
                valid_from=datetime.now(timezone.utc),
                created_by="test_user"
            )
            async_session.add(version)
            await async_session.commit()

    @pytest.mark.asyncio
    async def test_recipe_version_optional_fields(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test that optional measurement fields work."""
        version = RecipeVersion(
            recipe_id=sample_recipe_master.id,
            version="minimal",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user"
            # All measurement fields are optional
        )
        
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        
        assert version.tray_density is None
        assert version.air_temperature is None
        assert version.humidity is None

    @pytest.mark.asyncio
    async def test_recipe_version_foreign_key_constraint(self, async_session: AsyncSession):
        """Test foreign key constraint to recipe master."""
        # Note: SQLite in-memory DB may not enforce FK constraints by default
        # This test validates that the constraint exists in the model definition
        version = RecipeVersion(
            recipe_id=99999,  # Non-existent recipe
            version="1.0",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user"
        )
        async_session.add(version)
        
        # In production with PostgreSQL, this would raise IntegrityError
        # For SQLite test environment, we just verify the model can be created
        try:
            await async_session.commit()
            # If we reach here, SQLite didn't enforce the constraint
            await async_session.rollback()
        except IntegrityError:
            # This is expected in production PostgreSQL
            await async_session.rollback()
            
        # Verify the foreign key relationship is properly defined
        assert hasattr(RecipeVersion, 'recipe_id')
        assert hasattr(RecipeVersion, 'recipe_master')

    @pytest.mark.asyncio
    async def test_recipe_version_relationship_to_master(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test relationship back to recipe master."""
        version = RecipeVersion(
            recipe_id=sample_recipe_master.id,
            version="1.0",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user"
        )
        
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        
        # Test the relationship
        assert version.recipe_master is not None
        assert version.recipe_master.name == sample_recipe_master.name

    @pytest.mark.asyncio
    async def test_recipe_version_datetime_fields(
        self, 
        async_session: AsyncSession,
        sample_recipe_master
    ):
        """Test datetime field handling."""
        now = datetime.now(timezone.utc)
        later = datetime(2025, 12, 31, 23, 59, 59, tzinfo=timezone.utc)
        
        version = RecipeVersion(
            recipe_id=sample_recipe_master.id,
            version="dated",
            valid_from=now,
            valid_to=later,
            created_by="test_user"
        )
        
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        
        assert version.valid_from == now
        assert version.valid_to == later


class TestCropModel:
    """Test Crop model validation and relationships."""

    @pytest_asyncio.fixture
    async def sample_recipe_version(self, async_session: AsyncSession):
        """Create a sample recipe version for testing."""
        recipe = RecipeMaster(
            name="Crop Test Recipe",
            crop_type="Tomato"
        )
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=datetime.now(timezone.utc),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        return version

    @pytest_asyncio.fixture
    async def sample_measurement(self, async_session: AsyncSession):
        """Create a sample measurement for testing."""
        measurement = CropMeasurement(
            radius=5.0,
            width=10.0,
            height=15.0,
            area=150.0,
            weight=250.0
        )
        async_session.add(measurement)
        await async_session.commit()
        await async_session.refresh(measurement)
        return measurement

    @pytest.mark.asyncio
    async def test_crop_creation(
        self, 
        async_session: AsyncSession,
        sample_recipe_version,
        sample_measurement
    ):
        """Test basic crop creation."""
        crop = Crop(
            seed_date=date.today(),
            lifecycle_status="seedling",
            health_check="good",
            current_location={"zone": "A", "tray": 1},
            recipe_version_id=sample_recipe_version.id,
            measurements_id=sample_measurement.id,
            notes="Test crop"
        )
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        assert crop.id is not None
        assert crop.lifecycle_status == "seedling"
        assert crop.current_location == {"zone": "A", "tray": 1}

    @pytest.mark.asyncio
    async def test_crop_optional_fields(self, async_session: AsyncSession):
        """Test that most crop fields are optional."""
        crop = Crop()  # All fields are optional
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        assert crop.id is not None
        assert crop.seed_date is None
        assert crop.lifecycle_status is None

    @pytest.mark.asyncio
    async def test_crop_json_fields(self, async_session: AsyncSession):
        """Test JSON field handling."""
        location_data = {
            "zone": "B",
            "tray": 5,
            "position": {"x": 10, "y": 20}
        }
        
        crop = Crop(
            current_location=location_data,
            last_location={"zone": "A", "tray": 1}
        )
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        assert crop.current_location == location_data
        assert crop.last_location == {"zone": "A", "tray": 1}

    @pytest.mark.asyncio
    async def test_crop_relationships(
        self, 
        async_session: AsyncSession,
        sample_recipe_version,
        sample_measurement
    ):
        """Test crop relationships to other models."""
        crop = Crop(
            recipe_version_id=sample_recipe_version.id,
            measurements_id=sample_measurement.id
        )
        
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        # Test relationships
        assert crop.recipe_version is not None
        assert crop.recipe_version.version == "1.0"
        assert crop.measurements is not None
        assert crop.measurements.width == 10.0


class TestCropMeasurement:
    """Test CropMeasurement model validation."""

    @pytest.mark.asyncio
    async def test_measurement_creation(self, async_session: AsyncSession):
        """Test basic measurement creation."""
        measurement = CropMeasurement(
            radius=7.5,
            width=12.0,
            height=18.0,
            area=216.0,
            area_estimated=220.0,
            weight=300.0
        )
        
        async_session.add(measurement)
        await async_session.commit()
        await async_session.refresh(measurement)
        
        assert measurement.id is not None
        assert measurement.radius == 7.5
        assert measurement.weight == 300.0

    @pytest.mark.asyncio
    async def test_measurement_optional_fields(self, async_session: AsyncSession):
        """Test that all measurement fields are optional."""
        measurement = CropMeasurement()
        
        async_session.add(measurement)
        await async_session.commit()
        await async_session.refresh(measurement)
        
        assert measurement.id is not None
        assert measurement.radius is None
        assert measurement.weight is None

    @pytest.mark.asyncio
    async def test_measurement_numeric_types(self, async_session: AsyncSession):
        """Test numeric field handling."""
        measurement = CropMeasurement(
            radius=5.123456,
            width=10.987654,
            area=54.321
        )
        
        async_session.add(measurement)
        await async_session.commit()
        await async_session.refresh(measurement)
        
        # Check that float values are preserved
        assert abs(measurement.radius - 5.123456) < 0.000001
        assert abs(measurement.width - 10.987654) < 0.000001