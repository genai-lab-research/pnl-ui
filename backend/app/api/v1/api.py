from fastapi import APIRouter

from app.api.v1.endpoints import containers, tenants, devices, inventory, metrics, crops, activity, alerts, performance, seed_types

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(containers.router, prefix="/containers", tags=["containers"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(devices.router, prefix="/devices", tags=["devices"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(crops.router, prefix="/crops", tags=["crops"])
api_router.include_router(activity.router, prefix="/activity", tags=["activity"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(performance.router, prefix="/performance", tags=["performance"])
api_router.include_router(seed_types.router, prefix="/seed-types", tags=["seed-types"])