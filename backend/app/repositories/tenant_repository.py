from typing import Optional

from app.models import Tenant


class TenantRepository:
    def __init__(self):
        self._tenants: dict[str, Tenant] = {}
        self._initialize_mock_data()

    def _initialize_mock_data(self):
        """Initialize repository with mock tenant data."""
        tenants = [
            Tenant(id="tenant-001", name="AeroFarms"),
            Tenant(id="tenant-002", name="Green Valley Co"),
            Tenant(id="tenant-003", name="Urban Harvest"),
            Tenant(id="tenant-004", name="Sustainable Growth"),
            Tenant(id="tenant-005", name="Future Farms"),
        ]
        
        for tenant in tenants:
            self._tenants[tenant.id] = tenant

    def get_tenants(self) -> list[Tenant]:
        """Get all tenants."""
        return list(self._tenants.values())

    def get_tenant_by_id(self, tenant_id: str) -> Tenant | None:
        """Get a tenant by ID."""
        return self._tenants.get(tenant_id)