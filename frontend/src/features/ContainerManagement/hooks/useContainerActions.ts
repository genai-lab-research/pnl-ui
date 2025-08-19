import { useState, useCallback } from 'react';
import type { 
  CreateContainerRequest, 
  UpdateContainerRequest, 
  ShutdownContainerRequest,
  Container 
} from '../types';
import { containerService } from '../services';

interface UseContainerActionsOptions {
  onContainerCreated?: (container: Container) => void;
  onContainerUpdated?: (container: Container) => void;
  onContainerDeleted?: (id: number) => void;
  onContainerShutdown?: (id: number) => void;
  onError?: (error: string, action: string) => void;
}

interface UseContainerActionsResult {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isShuttingDown: boolean;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  shutdownError: string | null;
  createContainer: (data: CreateContainerRequest) => Promise<Container>;
  updateContainer: (id: number, data: UpdateContainerRequest) => Promise<Container>;
  deleteContainer: (id: number) => Promise<void>;
  shutdownContainer: (id: number, request: ShutdownContainerRequest) => Promise<void>;
  clearErrors: () => void;
  clearError: (action: 'create' | 'update' | 'delete' | 'shutdown') => void;
}

export const useContainerActions = ({
  onContainerCreated,
  onContainerUpdated,
  onContainerDeleted,
  onContainerShutdown,
  onError
}: UseContainerActionsOptions = {}): UseContainerActionsResult => {
  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  // Error states
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [shutdownError, setShutdownError] = useState<string | null>(null);

  const createContainer = useCallback(async (data: CreateContainerRequest): Promise<Container> => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const container = await containerService.createContainer(data);
      onContainerCreated?.(container);
      return container;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create container';
      setCreateError(errorMessage);
      onError?.(errorMessage, 'create');
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [onContainerCreated, onError]);

  const updateContainer = useCallback(async (id: number, data: UpdateContainerRequest): Promise<Container> => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const container = await containerService.updateContainer(id, data);
      onContainerUpdated?.(container);
      return container;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update container';
      setUpdateError(errorMessage);
      onError?.(errorMessage, 'update');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [onContainerUpdated, onError]);

  const deleteContainer = useCallback(async (id: number): Promise<void> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await containerService.deleteContainer(id);
      onContainerDeleted?.(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete container';
      setDeleteError(errorMessage);
      onError?.(errorMessage, 'delete');
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [onContainerDeleted, onError]);

  const shutdownContainer = useCallback(async (id: number, request: ShutdownContainerRequest): Promise<void> => {
    setIsShuttingDown(true);
    setShutdownError(null);

    try {
      await containerService.shutdownContainer(id, request);
      onContainerShutdown?.(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to shutdown container';
      setShutdownError(errorMessage);
      onError?.(errorMessage, 'shutdown');
      throw error;
    } finally {
      setIsShuttingDown(false);
    }
  }, [onContainerShutdown, onError]);

  const clearErrors = useCallback(() => {
    setCreateError(null);
    setUpdateError(null);
    setDeleteError(null);
    setShutdownError(null);
  }, []);

  const clearError = useCallback((action: 'create' | 'update' | 'delete' | 'shutdown') => {
    switch (action) {
      case 'create':
        setCreateError(null);
        break;
      case 'update':
        setUpdateError(null);
        break;
      case 'delete':
        setDeleteError(null);
        break;
      case 'shutdown':
        setShutdownError(null);
        break;
    }
  }, []);

  return {
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isShuttingDown,

    // Error states
    createError,
    updateError,
    deleteError,
    shutdownError,

    // Actions
    createContainer,
    updateContainer,
    deleteContainer,
    shutdownContainer,
    clearErrors,
    clearError
  };
};

// Specialized hook for table row actions
export const useContainerTableActions = (
  onRowActionComplete?: (action: string, containerId: string) => void
) => {
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set());

  const containerActions = useContainerActions({
    onContainerUpdated: (container) => {
      onRowActionComplete?.('edit', container.id.toString());
    },
    onContainerDeleted: (id) => {
      onRowActionComplete?.('delete', id.toString());
    },
    onContainerShutdown: (id) => {
      onRowActionComplete?.('shutdown', id.toString());
    }
  });

  const executeRowAction = useCallback(async (
    rowId: string, 
    action: 'view' | 'edit' | 'delete' | 'shutdown',
    additionalData?: Record<string, unknown>
  ) => {
    const actionKey = `${action}-${rowId}`;
    setPendingActions(prev => new Set([...prev, actionKey]));

    try {
      switch (action) {
        case 'view':
          // Navigate to detailed view - this would typically use router
          console.log('Navigate to container details:', rowId);
          break;

        case 'edit':
          // This would typically open an edit dialog/modal
          console.log('Open edit dialog for container:', rowId);
          break;

        case 'delete':
          await containerActions.deleteContainer(parseInt(rowId));
          break;

        case 'shutdown': {
          const shutdownRequest: ShutdownContainerRequest = { 
            reason: 'Manual shutdown', 
            force: false,
            ...(additionalData as Partial<ShutdownContainerRequest> || {})
          };
          await containerActions.shutdownContainer(parseInt(rowId), shutdownRequest);
          break;
        }

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } finally {
      setPendingActions(prev => {
        const next = new Set(prev);
        next.delete(actionKey);
        return next;
      });
    }
  }, [containerActions]);

  const isActionPending = useCallback((action: string, rowId: string): boolean => {
    return pendingActions.has(`${action}-${rowId}`);
  }, [pendingActions]);

  return {
    ...containerActions,
    executeRowAction,
    isActionPending,
    hasPendingActions: pendingActions.size > 0
  };
};