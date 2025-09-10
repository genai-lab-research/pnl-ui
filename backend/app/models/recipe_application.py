from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.core.db import Base


class RecipeApplication(Base):
    """Historical record of recipe applications to containers."""
    __tablename__ = "recipe_applications"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), nullable=False, index=True)
    recipe_version_id = Column(Integer, ForeignKey("recipe_versions.id"), nullable=False, index=True)
    applied_at = Column(DateTime(timezone=True), nullable=False)
    applied_by = Column(String, nullable=False)
    previous_recipe_version_id = Column(Integer, ForeignKey("recipe_versions.id"), nullable=True, index=True)
    changes_summary = Column(JSON, nullable=True)
    environment_sync_status = Column(String, nullable=True)

    # Relationships
    container = relationship("Container", back_populates="recipe_applications")
    recipe_version = relationship("RecipeVersion", foreign_keys=[recipe_version_id])
    previous_recipe_version = relationship("RecipeVersion", foreign_keys=[previous_recipe_version_id])