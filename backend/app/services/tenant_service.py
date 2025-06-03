# No additional imports needed

from app.models import TenantResponse
from app.repositories.tenant_repository import TenantRepository


class TenantService:
    def __init__(self):
        self.repository = TenantRepository()

    def get_tenants(self) -> list[TenantResponse]:
        """Get all tenants."""
        tenants = self.repository.get_tenants()
        return [TenantResponse(id=tenant.id, name=tenant.name) for tenant in tenants]
