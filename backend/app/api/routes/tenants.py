from typing import Any

from fastapi import APIRouter

from app.models import TenantResponse
from app.services.tenant_service import TenantService

router = APIRouter()
tenant_service = TenantService()


@router.get("/", response_model=list[TenantResponse])
def get_tenants() -> Any:
    """
    Get all tenants.
    """
    return tenant_service.get_tenants()
