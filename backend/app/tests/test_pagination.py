"""Comprehensive tests for pagination functionality."""


from app.core.pagination import (
    PaginatedResponse,
    PaginationMeta,
    PaginationParams,
    create_paginated_response,
    create_pagination_meta,
    paginate_query,
)
from app.models import Location


class TestPaginationParams:
    """Test PaginationParams model."""

    def test_default_values(self):
        """Test default values for pagination parameters."""
        params = PaginationParams()
        assert params.page == 1
        assert params.page_size == 20
        assert params.skip == 0
        assert params.limit == 20

    def test_custom_values(self):
        """Test custom pagination parameters."""
        params = PaginationParams(page=3, page_size=50)
        assert params.page == 3
        assert params.page_size == 50
        assert params.skip == 100  # (3-1) * 50
        assert params.limit == 50

    def test_skip_calculation(self):
        """Test skip value calculation for different pages."""
        # Page 1
        params = PaginationParams(page=1, page_size=10)
        assert params.skip == 0

        # Page 2
        params = PaginationParams(page=2, page_size=10)
        assert params.skip == 10

        # Page 5
        params = PaginationParams(page=5, page_size=25)
        assert params.skip == 100

    def test_validation_constraints(self):
        """Test validation constraints on pagination parameters."""
        # Valid values
        params = PaginationParams(page=1, page_size=1)
        assert params.page == 1
        assert params.page_size == 1

        params = PaginationParams(page=100, page_size=1000)
        assert params.page == 100
        assert params.page_size == 1000

    def test_edge_cases(self):
        """Test edge cases for pagination parameters."""
        # Large page numbers
        params = PaginationParams(page=999, page_size=100)
        assert params.skip == 99800

        # Maximum page size
        params = PaginationParams(page=1, page_size=1000)
        assert params.limit == 1000


class TestPaginationMeta:
    """Test PaginationMeta model."""

    def test_pagination_meta_creation(self):
        """Test creating pagination metadata."""
        meta = PaginationMeta(
            page=2,
            page_size=10,
            total_items=45,
            total_pages=5,
            has_next=True,
            has_previous=True,
            next_page=3,
            previous_page=1
        )
        assert meta.page == 2
        assert meta.page_size == 10
        assert meta.total_items == 45
        assert meta.total_pages == 5
        assert meta.has_next is True
        assert meta.has_previous is True
        assert meta.next_page == 3
        assert meta.previous_page == 1


class TestCreatePaginationMeta:
    """Test create_pagination_meta function."""

    def test_first_page(self):
        """Test pagination metadata for first page."""
        meta = create_pagination_meta(page=1, page_size=10, total_items=25)

        assert meta.page == 1
        assert meta.page_size == 10
        assert meta.total_items == 25
        assert meta.total_pages == 3
        assert meta.has_next is True
        assert meta.has_previous is False
        assert meta.next_page == 2
        assert meta.previous_page is None

    def test_middle_page(self):
        """Test pagination metadata for middle page."""
        meta = create_pagination_meta(page=2, page_size=10, total_items=25)

        assert meta.page == 2
        assert meta.page_size == 10
        assert meta.total_items == 25
        assert meta.total_pages == 3
        assert meta.has_next is True
        assert meta.has_previous is True
        assert meta.next_page == 3
        assert meta.previous_page == 1

    def test_last_page(self):
        """Test pagination metadata for last page."""
        meta = create_pagination_meta(page=3, page_size=10, total_items=25)

        assert meta.page == 3
        assert meta.page_size == 10
        assert meta.total_items == 25
        assert meta.total_pages == 3
        assert meta.has_next is False
        assert meta.has_previous is True
        assert meta.next_page is None
        assert meta.previous_page == 2

    def test_single_page(self):
        """Test pagination metadata when all items fit on one page."""
        meta = create_pagination_meta(page=1, page_size=20, total_items=15)

        assert meta.page == 1
        assert meta.page_size == 20
        assert meta.total_items == 15
        assert meta.total_pages == 1
        assert meta.has_next is False
        assert meta.has_previous is False
        assert meta.next_page is None
        assert meta.previous_page is None

    def test_empty_results(self):
        """Test pagination metadata with no items."""
        meta = create_pagination_meta(page=1, page_size=10, total_items=0)

        assert meta.page == 1
        assert meta.page_size == 10
        assert meta.total_items == 0
        assert meta.total_pages == 1
        assert meta.has_next is False
        assert meta.has_previous is False
        assert meta.next_page is None
        assert meta.previous_page is None

    def test_exact_page_boundary(self):
        """Test pagination when items exactly fill pages."""
        meta = create_pagination_meta(page=2, page_size=10, total_items=20)

        assert meta.page == 2
        assert meta.page_size == 10
        assert meta.total_items == 20
        assert meta.total_pages == 2
        assert meta.has_next is False
        assert meta.has_previous is True
        assert meta.next_page is None
        assert meta.previous_page == 1

    def test_large_numbers(self):
        """Test pagination with large numbers."""
        meta = create_pagination_meta(page=50, page_size=100, total_items=10000)

        assert meta.page == 50
        assert meta.page_size == 100
        assert meta.total_items == 10000
        assert meta.total_pages == 100
        assert meta.has_next is True
        assert meta.has_previous is True
        assert meta.next_page == 51
        assert meta.previous_page == 49

    def test_different_page_sizes(self):
        """Test pagination with different page sizes."""
        # Small page size
        meta = create_pagination_meta(page=1, page_size=5, total_items=23)
        assert meta.total_pages == 5

        # Large page size
        meta = create_pagination_meta(page=1, page_size=100, total_items=23)
        assert meta.total_pages == 1

        # Page size equals total items
        meta = create_pagination_meta(page=1, page_size=23, total_items=23)
        assert meta.total_pages == 1


class TestPaginatedResponse:
    """Test PaginatedResponse model."""

    def test_paginated_response_creation(self):
        """Test creating a paginated response."""
        meta = create_pagination_meta(page=1, page_size=2, total_items=5)
        data = [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]

        response = PaginatedResponse(data=data, meta=meta)

        assert len(response.data) == 2
        assert response.data[0]["id"] == 1
        assert response.data[1]["id"] == 2
        assert response.meta.page == 1
        assert response.meta.total_items == 5
        assert response.meta.has_next is True

    def test_empty_paginated_response(self):
        """Test creating a paginated response with no data."""
        meta = create_pagination_meta(page=1, page_size=10, total_items=0)

        response = PaginatedResponse(data=[], meta=meta)

        assert len(response.data) == 0
        assert response.meta.page == 1
        assert response.meta.total_items == 0
        assert response.meta.has_next is False


class TestCreatePaginatedResponse:
    """Test create_paginated_response function."""

    def test_create_paginated_response(self):
        """Test creating paginated response from data and parameters."""
        data = [{"id": 1}, {"id": 2}, {"id": 3}]
        pagination = PaginationParams(page=1, page_size=3)

        response = create_paginated_response(data, pagination, total_items=10)

        assert len(response.data) == 3
        assert response.data[0]["id"] == 1
        assert response.meta.page == 1
        assert response.meta.page_size == 3
        assert response.meta.total_items == 10
        assert response.meta.total_pages == 4
        assert response.meta.has_next is True

    def test_create_paginated_response_last_page(self):
        """Test creating paginated response for last page."""
        data = [{"id": 8}, {"id": 9}]
        pagination = PaginationParams(page=3, page_size=3)

        response = create_paginated_response(data, pagination, total_items=8)

        assert len(response.data) == 2
        assert response.meta.page == 3
        assert response.meta.total_items == 8
        assert response.meta.has_next is False
        assert response.meta.has_previous is True


class TestPaginateQuery:
    """Test paginate_query function with database queries."""

    def test_paginate_query_first_page(self, db_session):
        """Test paginating query for first page."""
        # Create test locations
        for i in range(15):
            location = Location(
                city=f"City {i}",
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Test pagination
        query = db_session.query(Location)
        pagination = PaginationParams(page=1, page_size=5)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 5
        assert meta.page == 1
        assert meta.page_size == 5
        assert meta.total_items == 15
        assert meta.total_pages == 3
        assert meta.has_next is True
        assert meta.has_previous is False

    def test_paginate_query_middle_page(self, db_session):
        """Test paginating query for middle page."""
        # Create test locations
        for i in range(15):
            location = Location(
                city=f"City {i}",
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Test pagination
        query = db_session.query(Location)
        pagination = PaginationParams(page=2, page_size=5)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 5
        assert meta.page == 2
        assert meta.page_size == 5
        assert meta.total_items == 15
        assert meta.total_pages == 3
        assert meta.has_next is True
        assert meta.has_previous is True

    def test_paginate_query_last_page(self, db_session):
        """Test paginating query for last page."""
        # Create test locations
        for i in range(12):
            location = Location(
                city=f"City {i}",
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Test pagination
        query = db_session.query(Location)
        pagination = PaginationParams(page=3, page_size=5)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 2  # Only 2 items on last page
        assert meta.page == 3
        assert meta.page_size == 5
        assert meta.total_items == 12
        assert meta.total_pages == 3
        assert meta.has_next is False
        assert meta.has_previous is True

    def test_paginate_query_empty_results(self, db_session):
        """Test paginating query with no results."""
        query = db_session.query(Location)
        pagination = PaginationParams(page=1, page_size=10)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 0
        assert meta.page == 1
        assert meta.page_size == 10
        assert meta.total_items == 0
        assert meta.total_pages == 1
        assert meta.has_next is False
        assert meta.has_previous is False

    def test_paginate_query_beyond_available_pages(self, db_session):
        """Test paginating query beyond available pages."""
        # Create 5 locations
        for i in range(5):
            location = Location(
                city=f"City {i}",
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Request page 3 when only 1 page exists
        query = db_session.query(Location)
        pagination = PaginationParams(page=3, page_size=10)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 0  # No data on page 3
        assert meta.page == 3
        assert meta.page_size == 10
        assert meta.total_items == 5
        assert meta.total_pages == 1
        assert meta.has_next is False
        assert meta.has_previous is True

    def test_paginate_query_with_custom_count_query(self, db_session):
        """Test paginate_query with custom count query for performance."""
        # Create test locations
        for i in range(20):
            location = Location(
                city=f"City {i}",
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Create custom count query
        from sqlalchemy import func
        query = db_session.query(Location)
        count_query = db_session.query(func.count(Location.id))
        pagination = PaginationParams(page=2, page_size=7)

        data, meta = paginate_query(query, pagination, count_query)

        assert len(data) == 7
        assert meta.page == 2
        assert meta.page_size == 7
        assert meta.total_items == 20
        assert meta.total_pages == 3

    def test_paginate_query_ordering(self, db_session):
        """Test that pagination preserves query ordering."""
        # Create locations in random order
        cities = ["Zebra", "Alpha", "Beta", "Charlie", "Delta"]
        for city in cities:
            location = Location(
                city=city,
                country="Country",
                address=f"Address {city}"
            )
            db_session.add(location)
        db_session.commit()

        # Query with ordering
        query = db_session.query(Location).order_by(Location.city)
        pagination = PaginationParams(page=1, page_size=3)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 3
        assert data[0].city == "Alpha"  # Should be alphabetically first
        assert data[1].city == "Beta"
        assert data[2].city == "Charlie"

    def test_paginate_query_with_filters(self, db_session):
        """Test pagination with filtered queries."""
        # Create locations
        countries = ["USA", "USA", "Canada", "USA", "Mexico", "Canada"]
        for i, country in enumerate(countries):
            location = Location(
                city=f"City {i}",
                country=country,
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Query with filter
        query = db_session.query(Location).filter(Location.country == "USA")
        pagination = PaginationParams(page=1, page_size=2)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 2
        assert meta.total_items == 3  # Only 3 USA locations
        assert meta.total_pages == 2
        assert all(loc.country == "USA" for loc in data)


class TestPaginationIntegration:
    """Integration tests for pagination across different components."""

    def test_pagination_consistency_across_pages(self, db_session):
        """Test that pagination is consistent across multiple pages."""
        # Create 25 locations
        for i in range(25):
            location = Location(
                city=f"City {i:02d}",  # Zero-padded for consistent ordering
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        page_size = 10
        all_ids = set()

        # Fetch all pages
        for page in range(1, 4):  # Pages 1, 2, 3
            query = db_session.query(Location).order_by(Location.id)
            pagination = PaginationParams(page=page, page_size=page_size)

            data, meta = paginate_query(query, pagination)

            # Collect IDs from this page
            page_ids = {loc.id for loc in data}

            # Ensure no overlap between pages
            assert len(page_ids & all_ids) == 0, f"Page {page} has overlapping IDs with previous pages"
            all_ids.update(page_ids)

            # Verify page size (except possibly the last page)
            if page < 3:
                assert len(data) == page_size
            else:
                assert len(data) == 5  # Last page has 5 items

        # Ensure we got all 25 items
        assert len(all_ids) == 25

    def test_pagination_boundary_conditions(self, db_session):
        """Test pagination boundary conditions."""
        # Create exactly 20 items (2 pages of 10)
        for i in range(20):
            location = Location(
                city=f"City {i}",
                country="Country",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        query = db_session.query(Location)

        # Test exact boundary
        pagination = PaginationParams(page=2, page_size=10)
        data, meta = paginate_query(query, pagination)

        assert len(data) == 10
        assert meta.total_pages == 2
        assert meta.has_next is False
        assert meta.has_previous is True

    def test_pagination_performance_characteristics(self, db_session):
        """Test pagination performance doesn't degrade with larger datasets."""
        # Create a larger dataset
        for i in range(1000):
            location = Location(
                city=f"City {i}",
                country=f"Country {i % 10}",
                address=f"Address {i}"
            )
            db_session.add(location)
        db_session.commit()

        # Test pagination on a later page
        query = db_session.query(Location).order_by(Location.id)
        pagination = PaginationParams(page=50, page_size=20)

        data, meta = paginate_query(query, pagination)

        assert len(data) == 20
        assert meta.page == 50
        assert meta.total_items == 1000
        assert meta.total_pages == 50
        assert meta.has_next is False
        assert meta.has_previous is True
