"""Authentication routes for user login and token management."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.auth.jwt_handler import create_access_token, verify_password, get_password_hash, verify_token
from app.core.config import settings
from app.core.db import get_async_db
from app.schemas.auth import Token, TokenData, UserLogin, UserCreate
from app.core.constants import ErrorMessages

router = APIRouter()

# Default test user credentials
DEFAULT_USERNAME = "testuser"
DEFAULT_PASSWORD = "testpassword"
DEFAULT_HASHED_PASSWORD = get_password_hash(DEFAULT_PASSWORD)

# In-memory user store for demo purposes
# In production, this would be a database table
DEMO_USERS = {
    DEFAULT_USERNAME: {
        "username": DEFAULT_USERNAME,
        "hashed_password": DEFAULT_HASHED_PASSWORD,
        "is_active": True,
        "permissions": ["read", "write", "delete"]
    }
}


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_db)
) -> Any:
    """
    Login endpoint that returns JWT token.
    
    Uses OAuth2PasswordRequestForm for form data authentication.
    """
    # Get user from demo store
    user = DEMO_USERS.get(form_data.username)
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorMessages.INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(subject=user["username"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "username": user["username"],
            "is_active": user["is_active"],
            "permissions": user["permissions"]
        }
    }


@router.post("/register", response_model=dict)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_async_db)
) -> Any:
    """
    Register a new user (for demo purposes).
    
    In production, this would create a user in the database.
    """
    # Check if user already exists
    if user_data.username in DEMO_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    DEMO_USERS[user_data.username] = {
        "username": user_data.username,
        "hashed_password": hashed_password,
        "is_active": True,
        "permissions": ["read", "write"]  # Default permissions
    }
    
    return {
        "message": "User created successfully",
        "username": user_data.username
    }


@router.get("/me")
async def get_current_user_info(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")),
    db: AsyncSession = Depends(get_async_db)
) -> Any:
    """Get current user information."""
    from app.auth.dependencies import get_current_user
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=ErrorMessages.INVALID_CREDENTIALS,
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    username = verify_token(token)
    if username is None:
        raise credentials_exception
    
    return {
        "username": username,
        "is_active": True,
        "permissions": ["read", "write", "delete"]
    }


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")),
    db: AsyncSession = Depends(get_async_db)
) -> Any:
    """Refresh JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=ErrorMessages.INVALID_CREDENTIALS,
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    username = verify_token(token)
    if username is None:
        raise credentials_exception
    
    current_user = {
        "username": username,
        "is_active": True,
        "permissions": ["read", "write", "delete"]
    }
    
    access_token = create_access_token(subject=current_user["username"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": current_user
    }


@router.post("/logout")
async def logout(
    token: str = Depends(OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")),
    db: AsyncSession = Depends(get_async_db)
) -> Any:
    """
    Logout endpoint.
    
    In a production system, you would typically blacklist the token
    or store it in a revocation list.
    """
    return {"message": "Successfully logged out"}


# Import the get_current_user dependency at the end to avoid circular imports