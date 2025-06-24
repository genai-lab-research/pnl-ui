"""
Pagination utilities for consistent pagination across all API endpoints.
"""
from typing import Generic, TypeVar, List, Optional, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Query
from sqlalchemy import func, select
from math import ceil

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Standard pagination parameters."""
    page: int = Field(1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(20, ge=1, le=1000, description="Number of items per page")
    
    @property
    def skip(self) -> int:
        """Calculate skip value for database queries."""
        return (self.page - 1) * self.page_size
    
    @property
    def limit(self) -> int:
        """Alias for page_size."""
        return self.page_size


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    page: int = Field(description="Current page number")
    page_size: int = Field(description="Number of items per page")
    total_items: int = Field(description="Total number of items")
    total_pages: int = Field(description="Total number of pages")
    has_next: bool = Field(description="Whether there is a next page")
    has_previous: bool = Field(description="Whether there is a previous page")
    next_page: Optional[int] = Field(None, description="Next page number if available")
    previous_page: Optional[int] = Field(None, description="Previous page number if available")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response."""
    data: List[T] = Field(description="List of items for current page")
    meta: PaginationMeta = Field(description="Pagination metadata")


def create_pagination_meta(
    page: int,
    page_size: int,
    total_items: int
) -> PaginationMeta:
    """Create pagination metadata."""
    total_pages = ceil(total_items / page_size) if total_items > 0 else 1
    has_next = page < total_pages
    has_previous = page > 1
    next_page = page + 1 if has_next else None
    previous_page = page - 1 if has_previous else None
    
    return PaginationMeta(
        page=page,
        page_size=page_size,
        total_items=total_items,
        total_pages=total_pages,
        has_next=has_next,
        has_previous=has_previous,
        next_page=next_page,
        previous_page=previous_page
    )


def paginate_query(
    query: Query,
    pagination: PaginationParams,
    count_query: Optional[Query] = None
) -> tuple[List[Any], PaginationMeta]:
    """
    Paginate a SQLAlchemy query and return data with pagination metadata.
    
    Args:
        query: The SQLAlchemy query to paginate
        pagination: Pagination parameters
        count_query: Optional separate count query for performance
        
    Returns:
        Tuple of (data, pagination_meta)
    """
    # Get total count
    if count_query is not None:
        total_items = count_query.scalar()
    else:
        # Create count query from the original query
        total_items = query.count()
    
    # Apply pagination to query
    data = query.offset(pagination.skip).limit(pagination.limit).all()
    
    # Create pagination metadata
    meta = create_pagination_meta(
        page=pagination.page,
        page_size=pagination.page_size,
        total_items=total_items
    )
    
    return data, meta


async def paginate_query_async(
    query: Query,
    pagination: PaginationParams,
    session,
    count_query: Optional[Query] = None
) -> tuple[List[Any], PaginationMeta]:
    """
    Async version of paginate_query for async database operations.
    
    Args:
        query: The SQLAlchemy query to paginate
        pagination: Pagination parameters
        session: Async database session
        count_query: Optional separate count query for performance
        
    Returns:
        Tuple of (data, pagination_meta)
    """
    # Get total count
    if count_query is not None:
        result = await session.execute(count_query)
        total_items = result.scalar()
    else:
        # Create count query from the original query
        count_stmt = select(func.count()).select_from(query.statement.alias())
        result = await session.execute(count_stmt)
        total_items = result.scalar()
    
    # Apply pagination to query
    paginated_query = query.offset(pagination.skip).limit(pagination.limit)
    result = await session.execute(paginated_query)
    data = result.scalars().all()
    
    # Create pagination metadata
    meta = create_pagination_meta(
        page=pagination.page,
        page_size=pagination.page_size,
        total_items=total_items
    )
    
    return data, meta


def create_paginated_response(
    data: List[T],
    pagination: PaginationParams,
    total_items: int
) -> PaginatedResponse[T]:
    """
    Create a paginated response from data and parameters.
    
    Args:
        data: List of items for current page
        pagination: Pagination parameters
        total_items: Total number of items
        
    Returns:
        PaginatedResponse with data and metadata
    """
    meta = create_pagination_meta(
        page=pagination.page,
        page_size=pagination.page_size,
        total_items=total_items
    )
    
    return PaginatedResponse(data=data, meta=meta)