"""Test data generation and seeding functionality."""

import pytest
import pytest_asyncio
from datetime import datetime, date, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.recipe import RecipeMaster, RecipeVersion
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.models.crop_history import CropHistory
from app.models.snapshots import CropSnapshot


class TestDataSeeding:
    """Test comprehensive data seeding functionality."""

    @pytest.mark.asyncio
    async def test_small_dataset_seeding(self, async_session: AsyncSession):
        """Test seeding with small dataset (< 100 records)."""
        # Create small dataset
        recipes = await self._create_recipe_dataset(async_session, 5)
        crops = await self._create_crop_dataset(async_session, recipes, 20)
        measurements = await self._create_measurement_dataset(async_session, 20)
        
        # Verify counts
        recipe_count = await self._get_count(async_session, RecipeMaster)
        crop_count = await self._get_count(async_session, Crop)
        measurement_count = await self._get_count(async_session, CropMeasurement)
        
        assert recipe_count == 5
        assert crop_count == 20
        assert measurement_count == 20

    @pytest.mark.asyncio
    async def test_medium_dataset_seeding(self, async_session: AsyncSession):
        """Test seeding with medium dataset (1,000 records)."""
        # Create medium dataset
        recipes = await self._create_recipe_dataset(async_session, 50)
        crops = await self._create_crop_dataset(async_session, recipes, 500)
        measurements = await self._create_measurement_dataset(async_session, 500)
        history_entries = await self._create_history_dataset(async_session, crops, 1000)
        
        # Verify counts
        recipe_count = await self._get_count(async_session, RecipeMaster)
        crop_count = await self._get_count(async_session, Crop)
        measurement_count = await self._get_count(async_session, CropMeasurement)
        history_count = await self._get_count(async_session, CropHistory)
        
        assert recipe_count == 50
        assert crop_count == 500
        assert measurement_count == 500
        assert history_count == 1000

    @pytest.mark.asyncio
    async def test_large_dataset_seeding(self, async_session: AsyncSession):
        """Test seeding with large dataset (10,000+ records)."""
        # Create large dataset
        recipes = await self._create_recipe_dataset(async_session, 100)
        crops = await self._create_crop_dataset(async_session, recipes, 2000)
        measurements = await self._create_measurement_dataset(async_session, 2000)
        snapshots = await self._create_snapshot_dataset(async_session, crops, 5000)
        
        # Verify counts
        recipe_count = await self._get_count(async_session, RecipeMaster)
        crop_count = await self._get_count(async_session, Crop)
        measurement_count = await self._get_count(async_session, CropMeasurement)
        snapshot_count = await self._get_count(async_session, CropSnapshot)
        
        assert recipe_count == 100
        assert crop_count == 2000
        assert measurement_count == 2000
        assert snapshot_count == 5000

    @pytest.mark.asyncio
    async def test_seeding_data_quality(self, async_session: AsyncSession):
        """Test that seeded data maintains quality and relationships."""
        # Create dataset with relationships
        recipes = await self._create_recipe_dataset(async_session, 10)
        crops = await self._create_crop_dataset(async_session, recipes, 50)
        
        # Verify data quality
        # 1. All recipes should have valid names and crop types
        result = await async_session.execute(
            select(RecipeMaster).where(
                (RecipeMaster.name == None) | (RecipeMaster.crop_type == None)
            )
        )
        invalid_recipes = result.scalars().all()
        assert len(invalid_recipes) == 0
        
        # 2. All crops with recipe_version_id should have valid references
        from sqlalchemy.orm import selectinload
        result = await async_session.execute(
            select(Crop).options(selectinload(Crop.recipe_version)).where(Crop.recipe_version_id.isnot(None))
        )
        crops_with_versions = result.scalars().all()
        
        for crop in crops_with_versions:
            assert crop.recipe_version is not None

    @pytest.mark.asyncio
    async def test_seeding_performance(self, async_session: AsyncSession):
        """Test seeding performance with timing."""
        import time
        
        # Time recipe creation
        start_time = time.time()
        recipes = await self._create_recipe_dataset(async_session, 100)
        recipe_time = time.time() - start_time
        
        # Time crop creation
        start_time = time.time()
        crops = await self._create_crop_dataset(async_session, recipes, 500)
        crop_time = time.time() - start_time
        
        # Performance assertions (reasonable for test environment)
        assert recipe_time < 10.0  # Should create 100 recipes in under 10 seconds
        assert crop_time < 30.0    # Should create 500 crops in under 30 seconds

    @pytest.mark.asyncio
    async def test_seeding_idempotency(self, async_session: AsyncSession):
        """Test that seeding can be run multiple times safely."""
        # First seeding run
        recipes1 = await self._create_recipe_dataset(async_session, 5, name_prefix="First")
        first_count = await self._get_count(async_session, RecipeMaster)
        
        # Second seeding run (different names to avoid conflicts)
        recipes2 = await self._create_recipe_dataset(async_session, 5, name_prefix="Second")
        second_count = await self._get_count(async_session, RecipeMaster)
        
        # Should have both sets of data
        assert second_count == first_count + 5

    @pytest.mark.asyncio
    async def test_seeding_with_enum_values(self, async_session: AsyncSession):
        """Test seeding covers all enum values and edge cases."""
        # Create crops with different lifecycle statuses
        lifecycle_statuses = [
            "seedling", "growing", "flowering", "mature", "harvested", "failed"
        ]
        health_checks = [
            "excellent", "good", "fair", "poor", "critical"
        ]
        
        crops = []
        for i, status in enumerate(lifecycle_statuses):
            for j, health in enumerate(health_checks):
                crop = Crop(
                    lifecycle_status=status,
                    health_check=health,
                    seed_date=date.today() - timedelta(days=i*10 + j)
                )
                crops.append(crop)
        
        async_session.add_all(crops)
        await async_session.commit()
        
        # Verify all combinations exist
        for status in lifecycle_statuses:
            result = await async_session.execute(
                select(Crop).where(Crop.lifecycle_status == status)
            )
            status_crops = result.scalars().all()
            assert len(status_crops) == len(health_checks)

    @pytest.mark.asyncio
    async def test_seeding_data_relationships(self, async_session: AsyncSession):
        """Test that seeded data maintains proper relationships."""
        # Create related data
        recipes = await self._create_recipe_dataset(async_session, 5)
        crops = await self._create_crop_dataset(async_session, recipes, 25)
        measurements = await self._create_measurement_dataset(async_session, 25)
        
        # Link crops to measurements
        for i, crop in enumerate(crops):
            if i < len(measurements):
                crop.measurements_id = measurements[i].id
        
        await async_session.commit()
        
        # Verify relationships
        from sqlalchemy.orm import selectinload
        result = await async_session.execute(
            select(Crop).options(selectinload(Crop.measurements)).where(Crop.measurements_id.isnot(None))
        )
        crops_with_measurements = result.scalars().all()
        
        for crop in crops_with_measurements:
            assert crop.measurements is not None
            assert crop.measurements.id == crop.measurements_id

    @pytest.mark.asyncio
    async def test_seeding_data_cleanup(self, async_session: AsyncSession):
        """Test data cleanup and reset functionality."""
        # Create initial data
        recipes = await self._create_recipe_dataset(async_session, 10)
        crops = await self._create_crop_dataset(async_session, recipes, 50)
        
        initial_recipe_count = await self._get_count(async_session, RecipeMaster)
        initial_crop_count = await self._get_count(async_session, Crop)
        
        assert initial_recipe_count == 10
        assert initial_crop_count == 50
        
        # Cleanup all data
        await async_session.execute(select(Crop).where(Crop.id.isnot(None)))
        crops_to_delete = (await async_session.execute(select(Crop))).scalars().all()
        for crop in crops_to_delete:
            await async_session.delete(crop)
        
        await async_session.execute(select(RecipeMaster).where(RecipeMaster.id.isnot(None)))
        recipes_to_delete = (await async_session.execute(select(RecipeMaster))).scalars().all()
        for recipe in recipes_to_delete:
            await async_session.delete(recipe)
        
        await async_session.commit()
        
        # Verify cleanup
        final_recipe_count = await self._get_count(async_session, RecipeMaster)
        final_crop_count = await self._get_count(async_session, Crop)
        
        assert final_recipe_count == 0
        assert final_crop_count == 0

    # Helper methods for data creation
    async def _create_recipe_dataset(
        self, 
        session: AsyncSession, 
        count: int,
        name_prefix: str = "Recipe"
    ) -> list:
        """Create a dataset of recipes."""
        crop_types = ["Tomato", "Lettuce", "Basil", "Spinach", "Kale"]
        recipes = []
        
        for i in range(count):
            recipe = RecipeMaster(
                name=f"{name_prefix} {i+1}",
                crop_type=crop_types[i % len(crop_types)],
                notes=f"Test recipe {i+1} for seeding"
            )
            recipes.append(recipe)
        
        session.add_all(recipes)
        await session.commit()
        
        # Refresh to get IDs
        for recipe in recipes:
            await session.refresh(recipe)
        
        # Create versions for each recipe
        for recipe in recipes:
            version = RecipeVersion(
                recipe_id=recipe.id,
                version="1.0",
                valid_from=datetime.now(timezone.utc),
                created_by="seeding_system",
                air_temperature=20.0 + (recipe.id % 10),
                humidity=60.0 + (recipe.id % 20)
            )
            session.add(version)
        
        await session.commit()
        return recipes

    async def _create_crop_dataset(
        self, 
        session: AsyncSession, 
        recipes: list,
        count: int
    ) -> list:
        """Create a dataset of crops."""
        lifecycle_statuses = ["seedling", "growing", "flowering", "mature"]
        health_checks = ["excellent", "good", "fair", "poor"]
        crops = []
        
        for i in range(count):
            # Get recipe version for this crop
            recipe = recipes[i % len(recipes)]
            
            # Get the first version of this recipe
            result = await session.execute(
                select(RecipeVersion).where(RecipeVersion.recipe_id == recipe.id).limit(1)
            )
            version = result.scalar_one_or_none()
            
            crop = Crop(
                seed_date=date.today() - timedelta(days=i % 100),
                lifecycle_status=lifecycle_statuses[i % len(lifecycle_statuses)],
                health_check=health_checks[i % len(health_checks)],
                current_location={"zone": f"Zone_{i % 5}", "tray": i % 20},
                recipe_version_id=version.id if version else None,
                notes=f"Seeded crop {i+1}"
            )
            crops.append(crop)
        
        session.add_all(crops)
        await session.commit()
        
        for crop in crops:
            await session.refresh(crop)
        
        return crops

    async def _create_measurement_dataset(
        self, 
        session: AsyncSession, 
        count: int
    ) -> list:
        """Create a dataset of measurements."""
        measurements = []
        
        for i in range(count):
            measurement = CropMeasurement(
                radius=5.0 + (i % 10) * 0.5,
                width=10.0 + (i % 15) * 0.3,
                height=15.0 + (i % 20) * 0.2,
                area=150.0 + (i % 50) * 2.0,
                weight=200.0 + (i % 100) * 1.5
            )
            measurements.append(measurement)
        
        session.add_all(measurements)
        await session.commit()
        
        for measurement in measurements:
            await session.refresh(measurement)
        
        return measurements

    async def _create_history_dataset(
        self, 
        session: AsyncSession, 
        crops: list,
        count: int
    ) -> list:
        """Create a dataset of crop history entries."""
        events = ["planting", "watering", "fertilizing", "pruning", "harvesting"]
        performers = ["farmer_john", "farmer_alice", "farmer_bob", "system"]
        history_entries = []
        
        for i in range(count):
            crop = crops[i % len(crops)]
            
            history = CropHistory(
                crop_id=crop.id,
                timestamp=datetime.now(timezone.utc) - timedelta(hours=i % 1000),
                event=events[i % len(events)],
                performed_by=performers[i % len(performers)],
                notes=f"Seeded history entry {i+1}"
            )
            history_entries.append(history)
        
        session.add_all(history_entries)
        await session.commit()
        
        return history_entries

    async def _create_snapshot_dataset(
        self, 
        session: AsyncSession, 
        crops: list,
        count: int
    ) -> list:
        """Create a dataset of crop snapshots."""
        lifecycle_statuses = ["seedling", "growing", "flowering", "mature"]
        health_statuses = ["excellent", "good", "fair", "poor"]
        snapshots = []
        
        for i in range(count):
            crop = crops[i % len(crops)]
            
            snapshot = CropSnapshot(
                timestamp=datetime.now(timezone.utc) - timedelta(hours=i % 2000),
                crop_id=crop.id,
                lifecycle_status=lifecycle_statuses[i % len(lifecycle_statuses)],
                health_status=health_statuses[i % len(health_statuses)],
                location={"zone": f"Zone_{i % 5}", "tray": i % 20},
                accumulated_light_hours=100.0 + (i % 200) * 0.5,
                accumulated_water_hours=50.0 + (i % 100) * 0.3
            )
            snapshots.append(snapshot)
        
        session.add_all(snapshots)
        await session.commit()
        
        return snapshots

    async def _get_count(self, session: AsyncSession, model) -> int:
        """Get count of records for a model."""
        result = await session.execute(select(func.count()).select_from(model))
        return result.scalar()


class TestSeedingSystemIntegration:
    """Test integration with existing seeding system."""

    @pytest.mark.asyncio
    async def test_seed_types_integration(self, async_session: AsyncSession, test_seed_types):
        """Test integration with existing seed types."""
        # Use existing seed types for crops
        crops = []
        for i, seed_type in enumerate(test_seed_types):
            crop = Crop(
                seed_type_id=seed_type.id,
                seed_date=date.today() - timedelta(days=i*10),
                lifecycle_status="growing",
                health_check="good"
            )
            crops.append(crop)
        
        async_session.add_all(crops)
        await async_session.commit()
        
        # Verify relationships
        from sqlalchemy.orm import selectinload
        result = await async_session.execute(
            select(Crop).options(selectinload(Crop.seed_type)).where(Crop.seed_type_id.isnot(None))
        )
        crops_with_seed_types = result.scalars().all()
        
        for crop in crops_with_seed_types:
            assert crop.seed_type is not None
            assert crop.seed_type.name in ["Tomato", "Lettuce", "Basil"]

    @pytest.mark.asyncio
    async def test_realistic_data_volumes(self, async_session: AsyncSession):
        """Test with realistic production-like data volumes."""
        # Create a realistic scenario
        recipes = await self._create_realistic_recipe_dataset(async_session)
        crops = await self._create_realistic_crop_dataset(async_session, recipes)
        
        # Verify realistic constraints
        recipe_count = await self._get_count(async_session, RecipeMaster)
        crop_count = await self._get_count(async_session, Crop)
        
        assert recipe_count >= 10  # At least 10 different recipes
        assert crop_count >= 100   # At least 100 crops
        
        # Verify realistic data distribution
        result = await async_session.execute(
            select(Crop.lifecycle_status, func.count()).group_by(Crop.lifecycle_status)
        )
        status_counts = result.fetchall()
        
        # Should have multiple lifecycle statuses represented
        assert len(status_counts) >= 3

    async def _create_realistic_recipe_dataset(self, session: AsyncSession) -> list:
        """Create realistic recipe dataset."""
        realistic_recipes = [
            ("Cherry Tomato Hydroponic", "Cherry Tomato"),
            ("Butter Lettuce NFT", "Butter Lettuce"),
            ("Sweet Basil Aeroponics", "Sweet Basil"),
            ("Baby Spinach DWC", "Baby Spinach"),
            ("Curly Kale Flood and Drain", "Curly Kale"),
            ("Arugula Microgreens", "Arugula"),
            ("Red Leaf Lettuce", "Red Lettuce"),
            ("Thai Basil Specialty", "Thai Basil"),
            ("Baby Bok Choy", "Bok Choy"),
            ("Mixed Herb Garden", "Mixed Herbs")
        ]
        
        recipes = []
        for name, crop_type in realistic_recipes:
            recipe = RecipeMaster(
                name=name,
                crop_type=crop_type,
                notes=f"Production recipe for {crop_type}"
            )
            recipes.append(recipe)
        
        session.add_all(recipes)
        await session.commit()
        
        # Create realistic versions
        for recipe in recipes:
            await session.refresh(recipe)
            
            # Version 1.0 - basic version
            version1 = RecipeVersion(
                recipe_id=recipe.id,
                version="1.0",
                valid_from=datetime.now(timezone.utc) - timedelta(days=90),
                valid_to=datetime.now(timezone.utc) - timedelta(days=30),
                created_by="head_grower",
                air_temperature=22.0,
                humidity=65.0,
                light_hours=14.0
            )
            session.add(version1)
            
            # Version 2.0 - current version
            version2 = RecipeVersion(
                recipe_id=recipe.id,
                version="2.0",
                valid_from=datetime.now(timezone.utc) - timedelta(days=30),
                created_by="head_grower",
                air_temperature=23.0,
                humidity=70.0,
                light_hours=16.0
            )
            session.add(version2)
        
        await session.commit()
        return recipes

    async def _create_realistic_crop_dataset(self, session: AsyncSession, recipes: list) -> list:
        """Create realistic crop dataset."""
        crops = []
        
        # Create crops at different lifecycle stages
        for i in range(200):  # 200 crops total
            recipe = recipes[i % len(recipes)]
            
            # Get current version of recipe
            result = await session.execute(
                select(RecipeVersion)
                .where(RecipeVersion.recipe_id == recipe.id)
                .where(RecipeVersion.valid_to.is_(None))
                .limit(1)
            )
            version = result.scalar_one_or_none()
            
            # Create realistic crop timeline
            days_old = i % 60  # Crops from 0 to 60 days old
            seed_date = date.today() - timedelta(days=days_old)
            
            # Lifecycle status based on age
            if days_old < 7:
                lifecycle_status = "seedling"
                health_check = "good"
            elif days_old < 21:
                lifecycle_status = "growing"
                health_check = "excellent" if days_old % 3 == 0 else "good"
            elif days_old < 40:
                lifecycle_status = "flowering"
                health_check = "good" if days_old % 4 != 0 else "fair"
            else:
                lifecycle_status = "mature"
                health_check = "excellent" if days_old % 5 == 0 else "good"
            
            crop = Crop(
                seed_date=seed_date,
                lifecycle_status=lifecycle_status,
                health_check=health_check,
                current_location={
                    "greenhouse": f"GH_{(i // 50) + 1}",
                    "zone": f"Zone_{chr(65 + (i // 10) % 6)}",  # A-F
                    "tray": (i % 20) + 1
                },
                recipe_version_id=version.id if version else None,
                accumulated_light_hours=days_old * 14.0,
                accumulated_water_hours=days_old * 6.0,
                notes=f"Production crop batch {(i // 20) + 1}"
            )
            crops.append(crop)
        
        session.add_all(crops)
        await session.commit()
        
        return crops

    async def _get_count(self, session: AsyncSession, model) -> int:
        """Get count of records for a model."""
        result = await session.execute(select(func.count()).select_from(model))
        return result.scalar()