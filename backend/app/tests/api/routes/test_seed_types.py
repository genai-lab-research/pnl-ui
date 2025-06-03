from fastapi import status
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_seed_types():
    """Test getting all seed types."""
    response = client.get("/api/v1/seed-types/")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 8  # We have 8 mock seed types

    # Check structure of first seed type
    seed_type = data[0]
    assert "id" in seed_type
    assert "name" in seed_type
    assert "variety" in seed_type
    assert "supplier" in seed_type

    # Check for specific mock data
    seed_type_names = [st["name"] for st in data]
    assert "Someroots" in seed_type_names
    assert "Sunflower" in seed_type_names
    assert "Basil" in seed_type_names


def test_get_seed_type_by_id():
    """Test getting a specific seed type by ID."""
    response = client.get("/api/v1/seed-types/seed-001")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert data["id"] == "seed-001"
    assert data["name"] == "Someroots"
    assert data["variety"] == "Standard"
    assert data["supplier"] == "BioCrop"


def test_get_seed_type_not_found():
    """Test getting a non-existent seed type."""
    response = client.get("/api/v1/seed-types/non-existent")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_create_seed_type():
    """Test creating a new seed type."""
    new_seed_type = {
        "name": "Test Seed",
        "variety": "Test Variety",
        "supplier": "Test Supplier",
    }

    response = client.post("/api/v1/seed-types/", json=new_seed_type)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert data["name"] == new_seed_type["name"]
    assert data["variety"] == new_seed_type["variety"]
    assert data["supplier"] == new_seed_type["supplier"]
    assert "id" in data


def test_create_seed_type_validation_error():
    """Test creating a seed type with invalid data."""
    invalid_seed_type = {
        "name": "",  # Empty name should fail
        "variety": "Test Variety",
        "supplier": "Test Supplier",
    }

    response = client.post("/api/v1/seed-types/", json=invalid_seed_type)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_update_seed_type():
    """Test updating an existing seed type."""
    updated_data = {
        "name": "Updated Someroots",
        "variety": "Premium",
        "supplier": "Premium BioCrop",
    }

    response = client.put("/api/v1/seed-types/seed-001", json=updated_data)
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert data["name"] == updated_data["name"]
    assert data["variety"] == updated_data["variety"]
    assert data["supplier"] == updated_data["supplier"]


def test_update_seed_type_not_found():
    """Test updating a non-existent seed type."""
    updated_data = {
        "name": "Updated Name",
        "variety": "Updated Variety",
        "supplier": "Updated Supplier",
    }

    response = client.put("/api/v1/seed-types/non-existent", json=updated_data)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_seed_type():
    """Test deleting a seed type."""
    response = client.delete("/api/v1/seed-types/seed-008")
    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert data["message"] == "Seed type deleted successfully"

    # Verify it's actually deleted
    response = client.get("/api/v1/seed-types/seed-008")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_seed_type_not_found():
    """Test deleting a non-existent seed type."""
    response = client.delete("/api/v1/seed-types/non-existent")
    assert response.status_code == status.HTTP_404_NOT_FOUND
