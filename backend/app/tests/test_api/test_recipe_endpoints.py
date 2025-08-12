"""Test recipe API endpoints with comprehensive coverage."""

import pytest
import pytest_asyncio
from datetime import datetime, date
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.core.db import get_async_db
from app.models.recipe import RecipeMaster, RecipeVersion
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.auth.jwt_handler import create_access_token


class TestRecipeEndpoints:
    """Test all recipe management endpoints."""

    @pytest_asyncio.fixture
    async def auth_client(self, async_session: AsyncSession):
        """Create authenticated HTTP client."""
        from httpx import ASGITransport
        
        # Override database dependency
        async def override_get_db():
            yield async_session
        
        app.dependency_overrides[get_async_db] = override_get_db
        
        # Create auth token
        token = create_access_token(subject="testuser")
        headers = {"Authorization": f"Bearer {token}"}
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as client:
            yield client
        
        # Cleanup
        app.dependency_overrides.clear()

    @pytest_asyncio.fixture
    async def sample_recipe_data(self, async_session: AsyncSession):
        """Create sample recipe data for testing."""
        recipe = RecipeMaster(
            name="API Test Recipe",
            crop_type="Test Crop",
            notes="Recipe for API testing"
        )
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="api_tester",
            air_temperature=22.0,
            humidity=65.0
        )
        async_session.add(version)
        await async_session.commit()
        
        await async_session.refresh(recipe)
        await async_session.refresh(version)
        
        return {"recipe": recipe, "version": version}

    @pytest.mark.asyncio
    async def test_get_all_recipes(self, auth_client: AsyncClient, sample_recipe_data):
        """Test GET /api/v1/recipes/ endpoint."""
        response = await auth_client.get("/api/v1/recipes/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Verify recipe structure
        recipe = data[0]
        assert "id" in recipe
        assert "name" in recipe
        assert "crop_type" in recipe
        assert "recipe_versions" in recipe

    @pytest.mark.asyncio
    async def test_get_all_recipes_with_filters(self, auth_client: AsyncClient, sample_recipe_data):
        """Test GET /api/v1/recipes/ with query parameters."""
        params = {
            "search": "API",
            "crop_type": "Test Crop",
            "page": 1,
            "limit": 10,
            "sort": "name",
            "order": "asc"
        }
        
        response = await auth_client.get("/api/v1/recipes/", params=params)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            assert "API" in data[0]["name"]

    @pytest.mark.asyncio
    async def test_create_recipe(self, auth_client: AsyncClient):
        """Test POST /api/v1/recipes/ endpoint."""
        recipe_data = {
            "name": "New API Recipe",
            "crop_type": "New Crop",
            "notes": "Created via API"
        }
        
        response = await auth_client.post("/api/v1/recipes/", json=recipe_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "New API Recipe"
        assert data["crop_type"] == "New Crop"
        assert "id" in data

    @pytest.mark.asyncio
    async def test_create_recipe_validation_error(self, auth_client: AsyncClient):
        """Test POST /api/v1/recipes/ with invalid data."""
        invalid_data = {
            "crop_type": "Missing Name"
            # Missing required 'name' field
        }
        
        response = await auth_client.post("/api/v1/recipes/", json=invalid_data)
        
        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_get_recipe_by_id(self, auth_client: AsyncClient, sample_recipe_data):
        """Test GET /api/v1/recipes/{id} endpoint."""
        recipe_id = sample_recipe_data["recipe"].id
        
        response = await auth_client.get(f"/api/v1/recipes/{recipe_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == recipe_id
        assert data["name"] == "API Test Recipe"
        assert len(data["recipe_versions"]) == 1

    @pytest.mark.asyncio
    async def test_get_recipe_by_id_not_found(self, auth_client: AsyncClient):
        """Test GET /api/v1/recipes/{id} with non-existent ID."""
        response = await auth_client.get("/api/v1/recipes/99999")
        
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_update_recipe(self, auth_client: AsyncClient, sample_recipe_data):
        """Test PUT /api/v1/recipes/{id} endpoint."""
        recipe_id = sample_recipe_data["recipe"].id
        update_data = {
            "name": "Updated API Recipe",
            "crop_type": "Updated Crop",
            "notes": "Updated via API"
        }
        
        response = await auth_client.put(f"/api/v1/recipes/{recipe_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated API Recipe"
        assert data["crop_type"] == "Updated Crop"

    @pytest.mark.asyncio
    async def test_update_recipe_not_found(self, auth_client: AsyncClient):
        """Test PUT /api/v1/recipes/{id} with non-existent ID."""
        update_data = {
            "name": "Non-existent Recipe",
            "crop_type": "Test"
        }
        
        response = await auth_client.put("/api/v1/recipes/99999", json=update_data)
        
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_recipe(self, auth_client: AsyncClient, async_session: AsyncSession):
        """Test DELETE /api/v1/recipes/{id} endpoint."""
        # Create a recipe to delete
        recipe = RecipeMaster(name="Delete Test Recipe", crop_type="Test")
        async_session.add(recipe)
        await async_session.commit()
        await async_session.refresh(recipe)
        
        response = await auth_client.delete(f"/api/v1/recipes/{recipe.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Recipe deleted successfully"

    @pytest.mark.asyncio
    async def test_delete_recipe_not_found(self, auth_client: AsyncClient):
        """Test DELETE /api/v1/recipes/{id} with non-existent ID."""
        response = await auth_client.delete("/api/v1/recipes/99999")
        
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_create_recipe_version(self, auth_client: AsyncClient, sample_recipe_data):
        """Test POST /api/v1/recipes/{recipe_id}/versions/ endpoint."""
        recipe_id = sample_recipe_data["recipe"].id
        version_data = {
            "version": "2.0",
            "valid_from": datetime.utcnow().isoformat(),
            "created_by": "api_tester",
            "air_temperature": 24.0,
            "humidity": 70.0,
            "ph": 6.5
        }
        
        response = await auth_client.post(
            f"/api/v1/recipes/{recipe_id}/versions/", 
            json=version_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == "2.0"
        assert data["recipe_id"] == recipe_id
        assert data["air_temperature"] == 24.0

    @pytest.mark.asyncio
    async def test_create_recipe_version_validation_error(self, auth_client: AsyncClient, sample_recipe_data):
        """Test POST /api/v1/recipes/{recipe_id}/versions/ with invalid data."""
        recipe_id = sample_recipe_data["recipe"].id
        invalid_data = {
            "valid_from": datetime.utcnow().isoformat(),
            "created_by": "api_tester"
            # Missing required 'version' field
        }
        
        response = await auth_client.post(
            f"/api/v1/recipes/{recipe_id}/versions/", 
            json=invalid_data
        )
        
        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_get_recipe_versions(self, auth_client: AsyncClient, sample_recipe_data):
        """Test GET /api/v1/recipes/{recipe_id}/versions/ endpoint."""
        recipe_id = sample_recipe_data["recipe"].id
        
        response = await auth_client.get(f"/api/v1/recipes/{recipe_id}/versions/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["version"] == "1.0"

    @pytest.mark.asyncio
    async def test_get_latest_recipe_version(self, auth_client: AsyncClient, sample_recipe_data):
        """Test GET /api/v1/recipes/{recipe_id}/versions/latest endpoint."""
        recipe_id = sample_recipe_data["recipe"].id
        
        response = await auth_client.get(f"/api/v1/recipes/{recipe_id}/versions/latest")
        
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == "1.0"
        assert data["recipe_id"] == recipe_id

    @pytest.mark.asyncio
    async def test_get_active_recipe_versions(self, auth_client: AsyncClient, sample_recipe_data):
        """Test GET /api/v1/recipes/{recipe_id}/versions/active endpoint."""
        recipe_id = sample_recipe_data["recipe"].id
        
        response = await auth_client.get(f"/api/v1/recipes/{recipe_id}/versions/active")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestRecipeVersionEndpoints:
    """Test recipe version specific endpoints."""

    @pytest_asyncio.fixture
    async def auth_client(self, async_session: AsyncSession):
        """Create authenticated HTTP client."""
        from httpx import ASGITransport
        
        async def override_get_db():
            yield async_session
        
        app.dependency_overrides[get_async_db] = override_get_db
        
        token = create_access_token(subject="testuser")
        headers = {"Authorization": f"Bearer {token}"}
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as client:
            yield client
        
        app.dependency_overrides.clear()

    @pytest_asyncio.fixture
    async def sample_version_data(self, async_session: AsyncSession):
        """Create sample version data for testing."""
        recipe = RecipeMaster(name="Version Test Recipe", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="1.0",
            valid_from=datetime.utcnow(),
            created_by="version_tester",
            air_temperature=23.0
        )
        async_session.add(version)
        await async_session.commit()
        
        await async_session.refresh(version)
        return version

    @pytest.mark.asyncio
    async def test_get_recipe_version_by_id(self, auth_client: AsyncClient, sample_version_data):
        """Test GET /api/v1/recipe-versions/{id} endpoint."""
        version_id = sample_version_data.id
        
        response = await auth_client.get(f"/api/v1/recipe-versions/{version_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == version_id
        assert data["version"] == "1.0"
        assert data["air_temperature"] == 23.0

    @pytest.mark.asyncio
    async def test_get_recipe_version_by_id_not_found(self, auth_client: AsyncClient):
        """Test GET /api/v1/recipe-versions/{id} with non-existent ID."""
        response = await auth_client.get("/api/v1/recipe-versions/99999")
        
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_update_recipe_version(self, auth_client: AsyncClient, sample_version_data):
        """Test PUT /api/v1/recipe-versions/{id} endpoint."""
        version_id = sample_version_data.id
        update_data = {
            "version": "1.1",
            "valid_from": datetime.utcnow().isoformat(),
            "created_by": "updated_tester",
            "air_temperature": 25.0,
            "humidity": 75.0
        }
        
        response = await auth_client.put(f"/api/v1/recipe-versions/{version_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["version"] == "1.1"
        assert data["air_temperature"] == 25.0

    @pytest.mark.asyncio
    async def test_update_recipe_version_not_found(self, auth_client: AsyncClient):
        """Test PUT /api/v1/recipe-versions/{id} with non-existent ID."""
        update_data = {
            "version": "2.0",
            "valid_from": datetime.utcnow().isoformat(),
            "created_by": "tester"
        }
        
        response = await auth_client.put("/api/v1/recipe-versions/99999", json=update_data)
        
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_recipe_version(self, auth_client: AsyncClient, async_session: AsyncSession):
        """Test DELETE /api/v1/recipe-versions/{id} endpoint."""
        # Create a recipe and version to delete
        recipe = RecipeMaster(name="Delete Version Test", crop_type="Test")
        async_session.add(recipe)
        await async_session.flush()
        
        version = RecipeVersion(
            recipe_id=recipe.id,
            version="delete_me",
            valid_from=datetime.utcnow(),
            created_by="tester"
        )
        async_session.add(version)
        await async_session.commit()
        await async_session.refresh(version)
        
        response = await auth_client.delete(f"/api/v1/recipe-versions/{version.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Recipe version deleted successfully"

    @pytest.mark.asyncio
    async def test_delete_recipe_version_not_found(self, auth_client: AsyncClient):
        """Test DELETE /api/v1/recipe-versions/{id} with non-existent ID."""
        response = await auth_client.delete("/api/v1/recipe-versions/99999")
        
        assert response.status_code == 404


class TestCropEndpoints:
    """Test crop management endpoints."""

    @pytest_asyncio.fixture
    async def auth_client(self, async_session: AsyncSession):
        """Create authenticated HTTP client."""
        from httpx import ASGITransport
        
        async def override_get_db():
            yield async_session
        
        app.dependency_overrides[get_async_db] = override_get_db
        
        token = create_access_token(subject="testuser")
        headers = {"Authorization": f"Bearer {token}"}
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test", headers=headers) as client:
            yield client
        
        app.dependency_overrides.clear()

    @pytest_asyncio.fixture
    async def sample_crop_data(self, async_session: AsyncSession):
        """Create sample crop data for testing."""
        crop = Crop(
            seed_date=date.today(),
            lifecycle_status="growing",
            health_check="good",
            current_location={"zone": "A", "tray": 1},
            notes="API test crop"
        )
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        return crop

    @pytest.mark.asyncio
    async def test_get_all_crops(self, auth_client: AsyncClient, sample_crop_data):
        """Test GET /api/v1/crops-new/ endpoint."""
        response = await auth_client.get("/api/v1/crops-new/")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Verify crop structure
        crop = data[0]
        assert "id" in crop
        assert "lifecycle_status" in crop
        assert "health_check" in crop

    @pytest.mark.asyncio
    async def test_get_all_crops_with_filters(self, auth_client: AsyncClient, sample_crop_data):
        """Test GET /api/v1/crops-new/ with query parameters."""
        params = {
            "lifecycle_status": "growing",
            "health_check": "good",
            "page": 1,
            "limit": 10,
            "sort": "seed_date",
            "order": "desc"
        }
        
        response = await auth_client.get("/api/v1/crops-new/", params=params)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.asyncio
    async def test_create_crop(self, auth_client: AsyncClient):
        """Test POST /api/v1/crops-new/ endpoint."""
        crop_data = {
            "seed_date": date.today().isoformat(),
            "lifecycle_status": "seedling",
            "health_check": "excellent",
            "current_location": {"zone": "B", "tray": 5},
            "notes": "New API crop"
        }
        
        response = await auth_client.post("/api/v1/crops-new/", json=crop_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["lifecycle_status"] == "seedling"
        assert data["current_location"] == {"zone": "B", "tray": 5}
        assert "id" in data

    @pytest.mark.asyncio
    async def test_get_crop_by_id(self, auth_client: AsyncClient, sample_crop_data):
        """Test GET /api/v1/crops-new/{id} endpoint."""
        crop_id = sample_crop_data.id
        
        response = await auth_client.get(f"/api/v1/crops-new/{crop_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == crop_id
        assert data["lifecycle_status"] == "growing"

    @pytest.mark.asyncio
    async def test_update_crop(self, auth_client: AsyncClient, sample_crop_data):
        """Test PUT /api/v1/crops-new/{id} endpoint."""
        crop_id = sample_crop_data.id
        update_data = {
            "lifecycle_status": "flowering",
            "health_check": "excellent",
            "notes": "Updated via API"
        }
        
        response = await auth_client.put(f"/api/v1/crops-new/{crop_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["lifecycle_status"] == "flowering"
        assert data["health_check"] == "excellent"

    @pytest.mark.asyncio
    async def test_delete_crop(self, auth_client: AsyncClient, async_session: AsyncSession):
        """Test DELETE /api/v1/crops-new/{id} endpoint."""
        # Create a crop to delete
        crop = Crop(lifecycle_status="test_delete")
        async_session.add(crop)
        await async_session.commit()
        await async_session.refresh(crop)
        
        response = await auth_client.delete(f"/api/v1/crops-new/{crop.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Crop deleted successfully"

    @pytest.mark.asyncio
    async def test_create_crop_measurement(self, auth_client: AsyncClient):
        """Test POST /api/v1/crops-new/crop-measurements/ endpoint."""
        measurement_data = {
            "radius": 5.5,
            "width": 11.0,
            "height": 16.5,
            "area": 181.5,
            "weight": 275.0
        }
        
        response = await auth_client.post("/api/v1/crops-new/crop-measurements/", json=measurement_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["radius"] == 5.5
        assert data["weight"] == 275.0
        assert "id" in data

    @pytest.mark.asyncio
    async def test_get_crop_measurement(self, auth_client: AsyncClient, async_session: AsyncSession):
        """Test GET /api/v1/crops-new/crop-measurements/{id} endpoint."""
        # Create a measurement first
        measurement = CropMeasurement(radius=6.0, weight=300.0)
        async_session.add(measurement)
        await async_session.commit()
        await async_session.refresh(measurement)
        
        response = await auth_client.get(f"/api/v1/crops-new/crop-measurements/{measurement.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == measurement.id
        assert data["radius"] == 6.0


class TestAuthenticationEndpoints:
    """Test authentication endpoints."""

    @pytest_asyncio.fixture
    async def client(self, async_session: AsyncSession):
        """Create HTTP client without authentication."""
        from httpx import ASGITransport
        
        async def override_get_db():
            yield async_session
        
        app.dependency_overrides[get_async_db] = override_get_db
        
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            yield client
        
        app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient):
        """Test POST /api/v1/auth/login with valid credentials."""
        login_data = {
            "username": "testuser",
            "password": "testpassword"
        }
        
        response = await client.post(
            "/api/v1/auth/login",
            data=login_data,  # OAuth2PasswordRequestForm expects form data
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data

    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, client: AsyncClient):
        """Test POST /api/v1/auth/login with invalid credentials."""
        login_data = {
            "username": "invalid",
            "password": "wrong"
        }
        
        response = await client.post(
            "/api/v1/auth/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_protected_endpoint_without_auth(self, client: AsyncClient):
        """Test accessing protected endpoint without authentication."""
        response = await client.get("/api/v1/recipes/")
        
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_protected_endpoint_with_invalid_token(self, client: AsyncClient):
        """Test accessing protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalid_token"}
        
        response = await client.get("/api/v1/recipes/", headers=headers)
        
        assert response.status_code == 401