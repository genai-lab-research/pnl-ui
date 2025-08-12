import * as React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
import { CreateContainer } from '../../../../shared/components/ui/CreateContainer';
import { VerticalFarmingTable } from '../../../../shared/components/ui/VerticalFarmingTable';
import { PaginationBlock, DeleteConfirmationDialog } from '../../../../shared/components';
import { EditContainerContainer } from '../../../edit-container/containers/EditContainerContainer';
import { ContainerDomainModel, PaginationDomainModel } from '../../models';
import { transformContainersToTableRows } from '../../utils/containerDataTransformer';

interface ContainerListSectionProps {
  containers: ContainerDomainModel[];
  pagination: PaginationDomainModel;
  isLoading: boolean;
  selectedContainerId: number | null;
  onCreateContainer: () => void;
  onDeleteContainer: (id: number) => Promise<{ success: boolean; error?: string }>;
  onShutdownContainer: (id: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  onSelectContainer: (id: number) => void;
  onPageChange: (page: number) => Promise<void>;
}

export const ContainerListSection = ({
  containers,
  pagination,
  isLoading,
  selectedContainerId,
  onCreateContainer,
  onDeleteContainer,
  onShutdownContainer,
  onSelectContainer,
  onPageChange,
}: ContainerListSectionProps) => {
  const [editContainerId, setEditContainerId] = React.useState<number | null>(null);
  const [deleteContainerId, setDeleteContainerId] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const containerToDelete = deleteContainerId 
    ? containers.find(c => c.id === deleteContainerId)
    : null;
  const handleRowAction = async (rowId: string, action: string) => {
    const container = containers.find(c => c.id.toString() === rowId);
    if (!container) return;
    
    switch (action) {
      case 'menu':
      case 'view':
        onSelectContainer(container.id);
        break;
      case 'edit':
        setEditContainerId(container.id);
        break;
      case 'shutdown':
        await onShutdownContainer(container.id);
        break;
      case 'delete':
        setDeleteContainerId(container.id);
        break;
    }
  };

  const handleEditClose = () => {
    setEditContainerId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteContainerId) return;
    
    setIsDeleting(true);
    try {
      const result = await onDeleteContainer(deleteContainerId);
      if (result.success) {
        setDeleteContainerId(null);
      }
      // If deletion fails, keep the dialog open to show error
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteContainerId(null);
    }
  };
  
  const handleRowSelect = (rowId: string) => {
    const container = containers.find(c => c.id.toString() === rowId);
    if (container) {
      onSelectContainer(container.id);
    }
  };

  // Transform containers to table rows
  const tableData = transformContainersToTableRows(containers);

  return (
    <Box sx={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: 3,
      boxShadow: '0 2px 4px rgba(65, 64, 69, 0.1)',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          gap: 2,
          alignItems: 'stretch',
        },
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Container List
        </Typography>
        {React.createElement(CreateContainer, {
          onClick: onCreateContainer,
          loading: isLoading,
        })}
      </Box>

      <VerticalFarmingTable
        data={tableData}
        isLoading={isLoading}
        selectedRowId={selectedContainerId?.toString() || null}
        onRowSelect={handleRowSelect}
        onRowAction={handleRowAction}
        emptyStateTitle="No containers found"
        emptyStateMessage="Try adjusting your search criteria or create a new container."
      />

      {/* Pagination Controls */}
      {!pagination.isSinglePage() && (
        <Box sx={{ mt: 2 }}>
          <PaginationBlock
            currentPage={pagination.state.currentPage}
            totalPages={pagination.state.totalPages}
            onPreviousClick={() => onPageChange(pagination.state.currentPage - 1)}
            onNextClick={() => onPageChange(pagination.state.currentPage + 1)}
            isPreviousDisabled={!pagination.hasPreviousPage() || isLoading}
            isNextDisabled={!pagination.hasNextPage() || isLoading}
          />
        </Box>
      )}

      {/* Edit Container Modal */}
      {editContainerId && (
        <EditContainerContainer
          containerId={editContainerId}
          open={true}
          onClose={handleEditClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteContainerId !== null}
        title="Delete Container"
        itemName={containerToDelete?.name}
        message={containerToDelete ? 
          `Are you sure you want to delete the container "${containerToDelete.name}"? This action cannot be undone and will permanently remove all associated data.` : 
          undefined
        }
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};