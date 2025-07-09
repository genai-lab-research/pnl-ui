"""Test async database operations and connections."""

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy import text, select

from app.core.db import Base, get_async_db
from app.models.recipe import RecipeMaster, RecipeVersion
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement


class TestAsyncDatabaseOperations:
    """Test async database connectivity and operations."""

    @pytest.mark.asyncio
    async def test_async_engine_creation(self, async_engine):
        """Test that async engine is created properly."""
        assert async_engine is not None
        
        # Test connection
        async with async_engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            assert result.scalar() == 1

    @pytest.mark.asyncio
    async def test_async_session_creation(self, async_session):
        """Test that async session works properly."""
        assert isinstance(async_session, AsyncSession)
        
        # Test session query
        result = await async_session.execute(text("SELECT 1 as test_value"))
        assert result.scalar() == 1

    @pytest.mark.asyncio
    async def test_database_health_check(self, async_session):
        """Test database health check functionality."""
        # Test basic query execution
        result = await async_session.execute(
            text("SELECT 'healthy' as status")
        )
        status = result.scalar()
        assert status == "healthy"

    @pytest.mark.asyncio
    async def test_table_creation(self, async_engine):
        """Test that all tables are created properly."""
        async with async_engine.begin() as conn:
            # Get all table names (PostgreSQL version)
            result = await conn.execute(
                text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
            )
            tables = [row[0] for row in result.fetchall()]
            
            # Check that our model tables exist
            expected_tables = [
                "recipe_master", "recipe_versions", "crops", 
                "crop_measurements", "crop_snapshots", "crop_history"
            ]
            
            for table in expected_tables:
                assert table in tables, f"Table {table} not found"

    @pytest.mark.asyncio
    async def test_async_crud_operations(self, async_session):
        """Test basic async CRUD operations."""
        # Create
        recipe = RecipeMaster(
            name="Async Test Recipe",
            crop_type="Test Crop",
            notes="Testing async operations"
        )
        async_session.add(recipe)
        await async_session.commit()
        await async_session.refresh(recipe)
        
        assert recipe.id is not None
        
        # Read
        result = await async_session.execute(
            select(RecipeMaster).where(RecipeMaster.id == recipe.id)
        )
        fetched_recipe = result.scalar_one()
        assert fetched_recipe.name == "Async Test Recipe"
        
        # Update
        fetched_recipe.notes = "Updated notes"
        await async_session.commit()
        await async_session.refresh(fetched_recipe)
        assert fetched_recipe.notes == "Updated notes"
        
        # Delete
        await async_session.delete(fetched_recipe)
        await async_session.commit()
        
        # Verify deletion
        result = await async_session.execute(
            select(RecipeMaster).where(RecipeMaster.id == recipe.id)
        )
        assert result.scalar_one_or_none() is None

    @pytest.mark.asyncio
    async def test_async_relationship_loading(self, async_session):
        """Test async relationship loading with selectinload."""
        from sqlalchemy.orm import selectinload
        
        # Create recipe with version
        recipe = RecipeMaster(name="Relationship Test", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=text("NOW()"),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.commit()
        
        # Test eager loading
        result = await async_session.execute(
            select(RecipeMaster)
            .options(selectinload(RecipeMaster.recipe_versions))
            .where(RecipeMaster.id == recipe.id)
        )
        fetched_recipe = result.scalar_one()
        
        # Access relationship (should be loaded)
        assert len(fetched_recipe.recipe_versions) == 1
        assert fetched_recipe.recipe_versions[0].version == "1.0"

    @pytest.mark.asyncio
    async def test_async_transaction_rollback(self, async_session):
        """Test async transaction rollback functionality."""
        # Create a recipe
        recipe = RecipeMaster(name="Rollback Test", crop_type="Test")
        async_session.add(recipe)
        await async_session.commit()
        original_id = recipe.id
        
        # Start a transaction that we'll rollback
        try:
            recipe.name = "Modified Name"
            async_session.add(recipe)
            
            # Force an error to trigger rollback
            invalid_recipe = RecipeMaster(name=None, crop_type="Test")
            async_session.add(invalid_recipe)
            await async_session.commit()
        except Exception:
            await async_session.rollback()
        
        # Verify rollback worked
        await async_session.refresh(recipe)
        assert recipe.name == "Rollback Test"

    @pytest.mark.asyncio
    async def test_async_bulk_operations(self, async_session):
        """Test async bulk insert operations."""
        # Create multiple recipes
        recipes = [
            RecipeMaster(name=f"Bulk Recipe {i}", crop_type="Bulk Test")
            for i in range(5)
        ]
        
        async_session.add_all(recipes)
        await async_session.commit()
        
        # Verify all were created
        result = await async_session.execute(
            select(RecipeMaster).where(RecipeMaster.crop_type == "Bulk Test")
        )
        fetched_recipes = result.scalars().all()
        assert len(fetched_recipes) == 5

    @pytest.mark.asyncio
    async def test_async_complex_query(self, async_session):
        """Test complex async queries with joins."""
        # Create test data
        recipe = RecipeMaster(name="Complex Query Recipe", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=text("NOW()"),
            created_by="test_user",
            air_temperature=25.0
        )
        async_session.add(version)
        await async_session.flush()
        
        crop = Crop(
            recipe_version_id=version.id,
            lifecycle_status="test_status"
        )
        async_session.add(crop)
        await async_session.commit()
        
        # Complex query with joins
        result = await async_session.execute(
            select(Crop, RecipeVersion, RecipeMaster)
            .join(RecipeVersion, Crop.recipe_version_id == RecipeVersion.id)
            .join(RecipeMaster, RecipeVersion.recipe_id == RecipeMaster.id)
            .where(RecipeMaster.name == "Complex Query Recipe")
        )
        
        row = result.first()
        assert row is not None
        crop_result, version_result, recipe_result = row
        assert crop_result.lifecycle_status == "test_status"
        assert version_result.air_temperature == 25.0
        assert recipe_result.name == "Complex Query Recipe"


class TestAsyncConnectionPooling:
    """Test async connection pooling and resource management."""

    @pytest.mark.asyncio
    async def test_multiple_concurrent_sessions(self):
        """Test multiple concurrent async sessions."""
        # Create multiple engines to simulate concurrent access
        engine1 = create_async_engine(
            "sqlite+aiosqlite:///:memory:",
            poolclass=StaticPool,
            connect_args={"check_same_thread": False}
        )
        engine2 = create_async_engine(
            "sqlite+aiosqlite:///:memory:",
            poolclass=StaticPool,
            connect_args={"check_same_thread": False}
        )
        
        try:
            # Test concurrent operations
            async with engine1.begin() as conn1:
                await conn1.run_sync(Base.metadata.create_all)
                result1 = await conn1.execute(text("SELECT 1"))
                assert result1.scalar() == 1
            
            async with engine2.begin() as conn2:
                await conn2.run_sync(Base.metadata.create_all)
                result2 = await conn2.execute(text("SELECT 2"))
                assert result2.scalar() == 2
        
        finally:
            await engine1.dispose()
            await engine2.dispose()

    @pytest.mark.asyncio
    async def test_session_cleanup(self, async_session):
        """Test proper session cleanup after operations."""
        # Perform operations
        recipe = RecipeMaster(name="Cleanup Test", crop_type="Test")
        async_session.add(recipe)
        await async_session.commit()
        
        # Session should still be active
        assert async_session.is_active
        
        # After explicit close, session should be inactive
        await async_session.close()
        assert not async_session.is_active

    @pytest.mark.asyncio
    async def test_connection_error_handling(self):
        """Test handling of connection errors."""
        # Create engine with invalid connection string
        bad_engine = create_async_engine("sqlite+aiosqlite:///nonexistent/path/db.sqlite")
        
        try:
            async with bad_engine.begin() as conn:
                await conn.execute(text("SELECT 1"))
        except Exception as e:
            # Should raise an appropriate database error
            assert "No such file or directory" in str(e) or "cannot open" in str(e)
        finally:
            await bad_engine.dispose()


class TestAsyncDatabaseMigrations:
    """Test database migration related async operations."""

    @pytest.mark.asyncio
    async def test_schema_evolution(self, async_engine):
        """Test that schema can be evolved properly."""
        # Test that we can create and drop tables
        async with async_engine.begin() as conn:
            # Create a test table
            await conn.execute(text("""
                CREATE TABLE test_migration_table (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                )
            """))
            
            # Insert test data
            await conn.execute(text(
                "INSERT INTO test_migration_table (name) VALUES ('test')"
            ))
            
            # Verify data exists
            result = await conn.execute(text(
                "SELECT name FROM test_migration_table WHERE id = 1"
            ))
            assert result.scalar() == "test"
            
            # Drop the table
            await conn.execute(text("DROP TABLE test_migration_table"))

    @pytest.mark.asyncio
    async def test_foreign_key_constraints(self, async_session):
        """Test that foreign key constraints work properly."""
        # Create recipe and version with proper relationship
        recipe = RecipeMaster(name="FK Test Recipe", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=text("NOW()"),
            created_by="test_user"
        )
        async_session.add(version)
        await async_session.commit()
        
        # Verify relationship works
        await async_session.refresh(recipe)
        assert len(recipe.recipe_versions) == 1
        
        # Verify version references correct recipe
        await async_session.refresh(version)
        assert version.recipe_master.name == "FK Test Recipe"

    @pytest.mark.asyncio
    async def test_index_performance(self, async_session):
        """Test that database indexes are working for performance."""
        # Create multiple recipes for performance testing
        recipes = [
            RecipeMaster(name=f"Performance Recipe {i}", crop_type=f"Type_{i % 5}")
            for i in range(100)
        ]
        async_session.add_all(recipes)
        await async_session.commit()
        
        # Test query performance with filtering (should use indexes)
        import time
        start_time = time.time()
        
        result = await async_session.execute(
            select(RecipeMaster).where(RecipeMaster.crop_type == "Type_1")
        )
        filtered_recipes = result.scalars().all()
        
        end_time = time.time()
        query_time = end_time - start_time
        
        # Should find the correct recipes
        assert len(filtered_recipes) == 20  # Every 5th recipe
        
        # Query should be reasonably fast (less than 1 second for this small dataset)
        assert query_time < 1.0