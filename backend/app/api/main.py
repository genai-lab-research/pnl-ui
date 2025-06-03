from fastapi import APIRouter

from app.api.routes import (
    containers,
    inventory,
    items,
    login,
    metrics,
    private,
    seed_types,
    tenants,
    users,
    utils,
)
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(containers.router, prefix="/containers", tags=["containers"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(seed_types.router, prefix="/seed-types", tags=["seed-types"])
api_router.include_router(inventory.router, tags=["inventory"])


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
