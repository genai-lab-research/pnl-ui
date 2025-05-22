from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

from app.models.enums import ActorType


class ActivityLogBase(BaseModel):
    action_type: str = Field(..., description="Type of action performed")
    actor_type: ActorType = Field(..., description="Actor type (User or System)")
    actor_id: str = Field(..., description="Actor identifier")
    description: str = Field(..., description="Activity description")


class ActivityLogCreate(ActivityLogBase):
    container_id: str = Field(..., description="Container ID")


class ActivityLog(ActivityLogBase):
    id: str
    container_id: str
    timestamp: datetime

    class Config:
        from_attributes = True


class ActivityLogList(BaseModel):
    total: int
    results: List[ActivityLog]


# New schemas for container activities endpoint
class ActivityUser(BaseModel):
    name: str
    role: str


class ActivityDetails(BaseModel):
    additional_info: Optional[str] = None


class ContainerActivity(BaseModel):
    id: str
    type: str
    timestamp: str
    description: str
    user: ActivityUser
    details: ActivityDetails


class ContainerActivityList(BaseModel):
    activities: List[ContainerActivity]