"""Integration tests for pagination in API endpoints."""

from fastapi import status


class TestLocationPaginationAPI:
    """Test pagination in location API endpoints."""

    def test_locations_legacy_pagination(self, client, db_session):
        """Test legacy pagination (skip/limit) for locations."""
        # Create test locations
        for i in range(25):
            location_data = {
                "city": f"City {i:02d}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test first page with legacy pagination
        response = client.get("/api/locations/?skip=0&limit=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 10

        # Test second page with legacy pagination
        response = client.get("/api/locations/?skip=10&limit=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 10

        # Test third page with legacy pagination
        response = client.get("/api/locations/?skip=20&limit=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5  # Remaining items

    def test_locations_new_pagination(self, client, db_session):
        """Test new pagination (page/page_size) for locations."""
        # Create test locations
        for i in range(25):
            location_data = {
                "city": f"City {i:02d}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test first page with new pagination
        response = client.get("/api/locations/?page=1&page_size=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Should return PaginatedResponse structure
        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 10

        # Verify metadata
        meta = data["meta"]
        assert meta["page"] == 1
        assert meta["page_size"] == 10
        assert meta["total_items"] == 25
        assert meta["total_pages"] == 3
        assert meta["has_next"] is True
        assert meta["has_previous"] is False
        assert meta["next_page"] == 2
        assert meta["previous_page"] is None

    def test_locations_pagination_second_page(self, client, db_session):
        """Test second page of location pagination."""
        # Create test locations
        for i in range(25):
            location_data = {
                "city": f"City {i:02d}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test second page
        response = client.get("/api/locations/?page=2&page_size=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 10

        # Verify metadata for middle page
        meta = data["meta"]
        assert meta["page"] == 2
        assert meta["page_size"] == 10
        assert meta["total_items"] == 25
        assert meta["total_pages"] == 3
        assert meta["has_next"] is True
        assert meta["has_previous"] is True
        assert meta["next_page"] == 3
        assert meta["previous_page"] == 1

    def test_locations_pagination_last_page(self, client, db_session):
        """Test last page of location pagination."""
        # Create test locations
        for i in range(25):
            location_data = {
                "city": f"City {i:02d}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test last page
        response = client.get("/api/locations/?page=3&page_size=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 5  # Remaining items

        # Verify metadata for last page
        meta = data["meta"]
        assert meta["page"] == 3
        assert meta["page_size"] == 10
        assert meta["total_items"] == 25
        assert meta["total_pages"] == 3
        assert meta["has_next"] is False
        assert meta["has_previous"] is True
        assert meta["next_page"] is None
        assert meta["previous_page"] == 2

    def test_locations_pagination_beyond_available_pages(self, client, db_session):
        """Test requesting page beyond available data."""
        # Create test locations
        for i in range(5):
            location_data = {
                "city": f"City {i}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Request page 3 when only 1 page exists
        response = client.get("/api/locations/?page=3&page_size=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 0  # No data on page 3

        # Metadata should still be accurate
        meta = data["meta"]
        assert meta["page"] == 3
        assert meta["page_size"] == 10
        assert meta["total_items"] == 5
        assert meta["total_pages"] == 1

    def test_locations_pagination_empty_results(self, client, db_session):
        """Test pagination with no locations."""
        response = client.get("/api/locations/?page=1&page_size=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 0

        meta = data["meta"]
        assert meta["page"] == 1
        assert meta["page_size"] == 10
        assert meta["total_items"] == 0
        assert meta["total_pages"] == 1
        assert meta["has_next"] is False
        assert meta["has_previous"] is False

    def test_locations_pagination_default_values(self, client, db_session):
        """Test pagination with default values when only one parameter is provided."""
        # Create test locations
        for i in range(15):
            location_data = {
                "city": f"City {i}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test with only page parameter (should default page_size to 20)
        response = client.get("/api/locations/?page=1")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 15  # All items fit on one page

        meta = data["meta"]
        assert meta["page"] == 1
        assert meta["page_size"] == 20  # Default value
        assert meta["total_items"] == 15

    def test_locations_pagination_parameter_validation(self, client):
        """Test validation of pagination parameters."""
        # Test negative page
        response = client.get("/api/locations/?page=0&page_size=10")
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

        # Test negative page_size
        response = client.get("/api/locations/?page=1&page_size=0")
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

        # Test page_size too large
        response = client.get("/api/locations/?page=1&page_size=1001")
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

        # Test negative skip (legacy)
        response = client.get("/api/locations/?skip=-1&limit=10")
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_locations_pagination_mixed_parameters(self, client, db_session):
        """Test behavior when both new and legacy pagination parameters are provided."""
        # Create test locations
        for i in range(10):
            location_data = {
                "city": f"City {i}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # When both are provided, new pagination should take precedence
        response = client.get("/api/locations/?page=1&page_size=5&skip=0&limit=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Should use new pagination (PaginatedResponse)
        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) == 5  # page_size=5, not limit=10
        assert data["meta"]["page_size"] == 5


class TestContainerPaginationAPI:
    """Test pagination in container API endpoints."""

    def test_containers_new_pagination_with_filters(self, client, multiple_containers):
        """Test container pagination with filters."""
        # Test pagination with type filter
        response = client.get("/api/containers/?page=1&page_size=2&type=physical")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) <= 2

        # All returned containers should be physical
        for container in data["data"]:
            assert container["type"] == "physical"

        # Meta should reflect filtered results
        meta = data["meta"]
        assert meta["page"] == 1
        assert meta["page_size"] == 2

    def test_containers_pagination_with_search(self, client, multiple_containers):
        """Test container pagination with search filter."""
        response = client.get("/api/containers/?page=1&page_size=10&search=Container 1")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data

        # Should find containers matching the search
        for container in data["data"]:
            assert "Container 1" in container["name"]

    def test_containers_pagination_multiple_filters(self, client, multiple_containers):
        """Test container pagination with multiple filters."""
        response = client.get("/api/containers/?page=1&page_size=5&type=physical&status=active")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data

        # All returned containers should match all filters
        for container in data["data"]:
            assert container["type"] == "physical"
            assert container["status"] == "active"


class TestCropsPaginationAPI:
    """Test pagination in crops API endpoints."""

    def test_crops_pagination(self, client, sample_container, multiple_crops):
        """Test crops pagination endpoint."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops?page=1&page_size=2")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data
        assert len(data["data"]) <= 2

        meta = data["meta"]
        assert meta["page"] == 1
        assert meta["page_size"] == 2

    def test_crops_pagination_with_filter(self, client, sample_container, multiple_crops):
        """Test crops pagination with seed type filter."""
        response = client.get(f"/api/containers/{sample_container.id}/inventory/crops?page=1&page_size=10&seed_type=tomato")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert "data" in data
        assert "meta" in data

        # All returned crops should match the filter
        for crop in data["data"]:
            assert crop["seed_type"] == "tomato"


class TestPaginationConsistency:
    """Test consistency across different paginated endpoints."""

    def test_pagination_response_format_consistency(self, client, db_session, multiple_containers):
        """Test that all paginated endpoints return consistent response format."""
        # Create locations for testing
        for i in range(5):
            location_data = {
                "city": f"City {i}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test all paginated endpoints
        endpoints = [
            "/api/locations/?page=1&page_size=3",
            "/api/containers/?page=1&page_size=3",
        ]

        for endpoint in endpoints:
            response = client.get(endpoint)
            if response.status_code == status.HTTP_200_OK:
                data = response.json()

                # All should have same structure
                assert "data" in data, f"Missing 'data' in {endpoint}"
                assert "meta" in data, f"Missing 'meta' in {endpoint}"
                assert isinstance(data["data"], list), f"'data' not list in {endpoint}"

                # Meta should have required fields
                meta = data["meta"]
                required_meta_fields = [
                    "page", "page_size", "total_items", "total_pages",
                    "has_next", "has_previous", "next_page", "previous_page"
                ]
                for field in required_meta_fields:
                    assert field in meta, f"Missing '{field}' in meta for {endpoint}"

    def test_pagination_parameter_consistency(self, client, db_session):
        """Test that pagination parameters work consistently across endpoints."""
        # Create test data
        for i in range(15):
            location_data = {
                "city": f"City {i}",
                "country": "Test Country",
                "address": f"Address {i}"
            }
            client.post("/api/locations/", json=location_data)

        # Test same pagination parameters on different endpoints
        page_params = "?page=2&page_size=5"

        # Locations
        response = client.get(f"/api/locations/{page_params}")
        assert response.status_code == status.HTTP_200_OK
        locations_data = response.json()

        # Containers (if any exist)
        response = client.get(f"/api/containers/{page_params}")
        assert response.status_code == status.HTTP_200_OK
        containers_data = response.json()

        # Both should have consistent meta structure
        assert locations_data["meta"]["page"] == 2
        assert locations_data["meta"]["page_size"] == 5
        assert containers_data["meta"]["page"] == 2
        assert containers_data["meta"]["page_size"] == 5

    def test_pagination_edge_cases_consistency(self, client, db_session):
        """Test that edge cases are handled consistently across endpoints."""
        # Test that response structure is consistent across endpoints
        test_endpoints = [
            "/api/locations/?page=1&page_size=10",
            "/api/containers/?page=1&page_size=10",
        ]

        for endpoint in test_endpoints:
            response = client.get(endpoint)
            if response.status_code == status.HTTP_200_OK:
                data = response.json()

                # All should have consistent structure regardless of data amount
                assert "data" in data
                assert "meta" in data
                assert isinstance(data["data"], list)

                # Meta should have required fields
                meta = data["meta"]
                assert "page" in meta
                assert "page_size" in meta
                assert "total_items" in meta
                assert "total_pages" in meta
                assert "has_next" in meta
                assert "has_previous" in meta
                assert meta["page"] == 1
                assert meta["page_size"] == 10

    def test_pagination_large_page_numbers(self, client, db_session):
        """Test behavior with large page numbers."""
        # Create minimal test data
        location_data = {
            "city": "Test City",
            "country": "Test Country",
            "address": "Test Address"
        }
        client.post("/api/locations/", json=location_data)

        # Test large page number
        response = client.get("/api/locations/?page=999&page_size=10")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        assert len(data["data"]) == 0
        assert data["meta"]["page"] == 999
        assert data["meta"]["total_pages"] == 1
        assert data["meta"]["has_next"] is False
        assert data["meta"]["has_previous"] is True

    def test_pagination_max_page_size(self, client, db_session):
        """Test maximum page size limits."""
        # Test maximum allowed page size
        response = client.get("/api/locations/?page=1&page_size=1000")
        assert response.status_code == status.HTTP_200_OK

        # Test exceeding maximum page size
        response = client.get("/api/locations/?page=1&page_size=1001")
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
