"""Authentication dependencies for FastAPI."""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt_handler import verify_token
from app.core.db import get_async_db
from app.core.config import settings
from app.core.constants import ErrorMessages

# OAuth2 scheme for password-based authentication
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False
)

# HTTP Bearer scheme for JWT tokens
security = HTTPBearer(auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_async_db)
):
    """Get current authenticated user from OAuth2 token."""
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
    
    # Return user info (in a real app, you'd fetch from database)
    return {
        "username": username,
        "is_active": True,
        "permissions": ["read", "write", "delete"]
    }


async def get_current_user_from_bearer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_db)
):
    """Get current authenticated user from Bearer token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=ErrorMessages.INVALID_CREDENTIALS,
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not credentials:
        raise credentials_exception
    
    username = verify_token(credentials.credentials)
    if username is None:
        raise credentials_exception
    
    # Return user info (in a real app, you'd fetch from database)
    return {
        "username": username,
        "is_active": True,
        "permissions": ["read", "write", "delete"]
    }


async def get_current_active_user(
    current_user: dict = Depends(get_current_user),
):
    """Get current active user."""
    if not current_user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_optional_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_async_db)
) -> Optional[dict]:
    """Get current user if authenticated, otherwise None."""
    if not token:
        return None
    
    try:
        username = verify_token(token)
        if username is None:
            return None
        
        return {
            "username": username,
            "is_active": True,
            "permissions": ["read", "write", "delete"]
        }
    except Exception:
        return None


def require_permissions(required_permissions: list):
    """Dependency factory for requiring specific permissions."""
    def permission_checker(
        current_user: dict = Depends(get_current_active_user)
    ):
        user_permissions = current_user.get("permissions", [])
        
        for permission in required_permissions:
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=ErrorMessages.INSUFFICIENT_PERMISSIONS
                )
        
        return current_user
    
    return permission_checker


# Common permission dependencies
require_read_permission = require_permissions(["read"])
require_write_permission = require_permissions(["write"])
require_delete_permission = require_permissions(["delete"])


async def validate_api_key(
    api_key: Optional[str] = None
) -> bool:
    """Validate API key for internal service calls."""
    if not api_key:
        return False
    
    # In a real app, you'd validate against a database or config
    valid_api_keys = ["demo-api-key", "internal-service-key"]
    return api_key in valid_api_keys
