"""Authentication schemas for requests and responses."""

from typing import Optional, List
from pydantic import BaseModel, Field


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


class TokenData(BaseModel):
    """Token data schema."""
    username: Optional[str] = None


class UserLogin(BaseModel):
    """User login schema."""
    username: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=1)


class UserCreate(BaseModel):
    """User creation schema."""
    username: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=6, max_length=255)


class UserResponse(BaseModel):
    """User response schema."""
    username: str
    is_active: bool
    permissions: List[str]