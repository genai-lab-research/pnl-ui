from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestTenantAPI:
    """Test the tenant API endpoints."""

    def test_get_tenants(self):
        """Test getting all tenants."""
        response = client.get("/api/v1/tenants/")
        assert response.status_code == 200
        data = response.json()

        # Should return a list of tenants
        assert isinstance(data, list)

        # Check that each tenant has required fields
        if data:
            tenant = data[0]
            assert "id" in tenant
            assert "name" in tenant
            assert isinstance(tenant["id"], str)
            assert isinstance(tenant["name"], str)

    def test_tenants_response_format(self):
        """Test that tenants response has correct format."""
        response = client.get("/api/v1/tenants/")
        assert response.status_code == 200
        data = response.json()

        # Should have expected tenant data
        tenant_names = [tenant["name"] for tenant in data]
        expected_tenants = [
            "AeroFarms",
            "Green Valley Co",
            "Urban Harvest",
            "Sustainable Growth",
            "Future Farms",
        ]

        for expected_tenant in expected_tenants:
            assert expected_tenant in tenant_names

    def test_tenants_not_empty(self):
        """Test that tenants list is not empty."""
        response = client.get("/api/v1/tenants/")
        assert response.status_code == 200
        data = response.json()

        # Should have at least one tenant
        assert len(data) > 0
