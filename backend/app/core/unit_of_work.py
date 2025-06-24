"""Unit of Work pattern implementation for transaction management."""

from abc import ABC, abstractmethod
from contextlib import contextmanager
from typing import Any, Generator, Optional
import logging

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.db import SessionLocal
from app.repositories.container import ContainerRepository
from app.repositories.location import LocationRepository
from app.repositories.crop import CropRepository
from app.repositories.inventory_metrics import InventoryMetricsRepository
from app.repositories.panel import PanelRepository
from app.repositories.tray import TrayRepository

logger = logging.getLogger(__name__)


class AbstractUnitOfWork(ABC):
    """Abstract base class for Unit of Work pattern."""

    containers: ContainerRepository
    locations: LocationRepository
    crops: CropRepository
    inventory_metrics: InventoryMetricsRepository
    panels: PanelRepository
    trays: TrayRepository

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.rollback()

    @abstractmethod
    def commit(self):
        """Commit the transaction."""
        raise NotImplementedError

    @abstractmethod
    def rollback(self):
        """Rollback the transaction."""
        raise NotImplementedError


class SqlAlchemyUnitOfWork(AbstractUnitOfWork):
    """SQLAlchemy implementation of Unit of Work pattern."""

    def __init__(self, session_factory=SessionLocal):
        self.session_factory = session_factory
        self._session: Optional[Session] = None

    def __enter__(self):
        self._session = self.session_factory()
        self.containers = ContainerRepository(self._session)
        self.locations = LocationRepository(self._session)
        self.crops = CropRepository(self._session)
        self.inventory_metrics = InventoryMetricsRepository(self._session)
        self.panels = PanelRepository(self._session)
        self.trays = TrayRepository(self._session)
        return super().__enter__()

    def __exit__(self, *args):
        super().__exit__(*args)
        if self._session:
            self._session.close()

    def commit(self):
        """Commit the transaction."""
        if not self._session:
            raise RuntimeError("Unit of Work not properly initialized")

        try:
            self._session.commit()
            logger.debug("Transaction committed successfully")
        except SQLAlchemyError as exc:
            logger.error("Failed to commit transaction: %s", str(exc))
            self.rollback()
            raise

    def rollback(self):
        """Rollback the transaction."""
        if not self._session:
            return

        try:
            self._session.rollback()
            logger.debug("Transaction rolled back")
        except SQLAlchemyError as exc:
            logger.error("Failed to rollback transaction: %s", str(exc))
            raise


@contextmanager
def get_unit_of_work() -> Generator[AbstractUnitOfWork, None, None]:
    """Context manager for Unit of Work."""
    uow = SqlAlchemyUnitOfWork()
    try:
        with uow:
            yield uow
            uow.commit()
    except Exception:
        uow.rollback()
        raise


class TransactionManager:
    """Helper class for managing transactions in services."""

    @staticmethod
    @contextmanager
    def transaction(uow: Optional[AbstractUnitOfWork] = None) -> Generator[AbstractUnitOfWork, None, None]:
        """Context manager for transaction handling."""
        if uow:
            # Use existing unit of work (for nested operations)
            yield uow
        else:
            # Create new unit of work
            with get_unit_of_work() as new_uow:
                yield new_uow

    @staticmethod
    def execute_in_transaction(func, *args, **kwargs) -> Any:
        """Execute a function within a transaction."""
        with get_unit_of_work() as uow:
            return func(uow, *args, **kwargs)