"""Basic tests to verify test setup."""

import pytest


def test_basic_assertion():
    """Test basic assertion to verify pytest works."""
    assert 1 + 1 == 2


def test_import_models():
    """Test that we can import our models."""
    from app.models.recipe import RecipeMaster, RecipeVersion
    from app.models.crop import Crop
    
    assert RecipeMaster is not None
    assert RecipeVersion is not None
    assert Crop is not None


def test_import_schemas():
    """Test that we can import our schemas."""
    from app.schemas.recipe import RecipeMasterCreate, CropCreate
    
    assert RecipeMasterCreate is not None
    assert CropCreate is not None


def test_import_repositories():
    """Test that we can import our repositories."""
    from app.repositories.recipe_master import RecipeMasterRepository
    from app.repositories.crop import CropRepository
    
    assert RecipeMasterRepository is not None
    assert CropRepository is not None


def test_import_services():
    """Test that we can import our services."""
    from app.services.recipe_master import RecipeMasterService
    from app.services.crop import CropService
    
    assert RecipeMasterService is not None
    assert CropService is not None