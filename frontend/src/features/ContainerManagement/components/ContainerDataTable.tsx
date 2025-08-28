import React, { useCallback, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../../context/AuthContext';

import { VerticalFarmingTable, TableRow } from '../../../shared/components/ui/VerticalFarmingTable';
import { PaginationBlock } from '../../../shared/components/ui/PaginationBlock';
import { CreateContainer } from '../../../shared/components/ui/CreateContainer';
import { ContainerCreationModal } from '../../ContainerCreation/components/ContainerCreationModal';
import { EditContainerModal } from '../../ContainerEdit/components/EditContainerModal';
import { ShutdownConfirmDialog } from './ShutdownConfirmDialog';
import { useContainerActions } from '../hooks/useContainerActions';
import { useContainerFilters } from '../hooks/useContainerFilters';
import { containerService } from '../services/containerService';
import { ContainerDataTableViewModel } from '../viewmodels/ContainerDataTableViewModel';
import { StyledContainerDataTable } from './ContainerDataTable.style';
import type { Container, ContainerTableRow } from '../types';

interface ContainerDataTableProps {
  className?: string;
  containerFilters?: ReturnType<typeof useContainerFilters>;
}



export const ContainerDataTable: React.FC<ContainerDataTableProps> = ({ 
  className, 
  containerFilters: passedFilters 
}) => {
  const navigate = useNavigate();
  const authState = useAuthState();
  const viewModel = new ContainerDataTableViewModel();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContainerId, setEditContainerId] = useState<number | null>(null);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const [shutdownContainerId, setShutdownContainerId] = useState<string | null>(null);
  const [shutdownContainerName, setShutdownContainerName] = useState<string>('');
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [containers, setContainers] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Get current filter state for data fetching
  const defaultFilters = useContainerFilters();
  const { filters } = passedFilters || defaultFilters;
  
  const { createContainer, isCreating } = useContainerActions({
    onContainerCreated: () => {
      refreshData();
    }
  });

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const params = {
      search: filters.search && filters.search.trim() !== '' ? filters.search.trim() : undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      tenant: filters.tenant !== 'all' ? filters.tenant : undefined,
      purpose: filters.purpose !== 'all' ? filters.purpose : undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      alerts: filters.alerts ? true : undefined,
      page: currentPage,
      limit: 10 as const,
      field: 'name' as const,
      order: 'asc' as const
    };

    console.log('Search API call with params:', params);
    
    try {

      const response = await containerService.getContainers(params);
      
      // Transform API response to match table format
      const transformedContainers: TableRow[] = response.data.map(container => ({
        id: container.id.toString(),
        type: container.type === 'physical' ? 'container' : 'virtual' as const,
        name: container.name,
        tenant: 'Tenant ' + container.tenant_id, // Will be replaced with actual tenant name from API
        purpose: container.purpose.charAt(0).toUpperCase() + container.purpose.slice(1) as 'Development' | 'Research',
        location: container.location ? `${container.location.city}, ${container.location.country}` : 'N/A',
        status: (() => {
          switch (container.status) {
            case 'active':
              return 'Active';
            case 'inactive':
              return 'Inactive';
            case 'created':
              return 'Created';
            case 'maintenance':
              return 'Maintenance';
            default:
              return 'Inactive';
          }
        })() as 'Active' | 'Inactive' | 'Created' | 'Maintenance',
        created: new Date(container.created_at).toLocaleDateString(),
        modified: new Date(container.updated_at).toLocaleDateString(),
        hasAlert: container.alerts && container.alerts.length > 0
      }));
      
      setContainers(transformedContainers);
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch containers');
      
      // Fallback to mock data for demo purposes with filtering
      let mockContainers: TableRow[] = [
        {
          id: '1',
          type: 'container',
          name: 'farm-container-07',
          tenant: 'tenant-123',
          purpose: 'Development',
          location: 'Agriville, USA',
          status: 'Active',
          created: '25/01/2025',
          modified: '26/01/2025',
          hasAlert: false
        },
        {
          id: '2',
          type: 'virtual',
          name: 'virtual-farm-04',
          tenant: 'tenant-123',
          purpose: 'Development',
          location: 'Agriville, USA',
          status: 'Active',
          created: '30/01/2025',
          modified: '30/01/2025',
          hasAlert: true
        },
        {
          id: '3',
          type: 'container',
          name: 'farm-container-06',
          tenant: 'tenant-5',
          purpose: 'Research',
          location: 'Scienceville, Germany',
          status: 'Active',
          created: '12/01/2025',
          modified: '18/01/2025',
          hasAlert: false
        },
        {
          id: '4',
          type: 'virtual',
          name: 'virtual-farm-02',
          tenant: 'tenant-123',
          purpose: 'Development',
          location: 'Croptown, USA',
          status: 'Inactive',
          created: '13/01/2025',
          modified: '15/01/2025',
          hasAlert: true
        },
        {
          id: '5',
          type: 'container',
          name: 'farm-container-04',
          tenant: 'tenant-222',
          purpose: 'Research',
          location: 'Techville, Canada',
          status: 'Created',
          created: '25/01/2025',
          modified: '26/01/2025',
          hasAlert: false
        },
        {
          id: '6',
          type: 'virtual',
          name: 'virtual-farm-03',
          tenant: 'tenant-222',
          purpose: 'Research',
          location: 'Farmington, USA',
          status: 'Maintenance',
          created: '30/01/2025',
          modified: '30/01/2025',
          hasAlert: false
        }
      ];

      // Apply search and filter logic to mock data
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        mockContainers = mockContainers.filter(container =>
          container.name.toLowerCase().includes(searchLower) ||
          container.tenant.toLowerCase().includes(searchLower) ||
          container.purpose.toLowerCase().includes(searchLower) ||
          container.location.toLowerCase().includes(searchLower) ||
          container.status.toLowerCase().includes(searchLower)
        );
      }

      if (params.type) {
        mockContainers = mockContainers.filter(container => container.type === params.type);
      }

      if (params.purpose) {
        mockContainers = mockContainers.filter(container => 
          container.purpose.toLowerCase() === params.purpose?.toLowerCase()
        );
      }

      if (params.status) {
        // Map API status to table status
        const tableStatus = (() => {
          switch (params.status) {
            case 'active':
              return 'Active';
            case 'inactive':
              return 'Inactive';
            case 'created':
              return 'Created';
            case 'maintenance':
              return 'Maintenance';
            default:
              return params.status;
          }
        })();
        mockContainers = mockContainers.filter(container => container.status === tableStatus);
      }

      if (params.alerts) {
        mockContainers = mockContainers.filter(container => container.hasAlert);
      }

      console.log('Filtered mock containers:', mockContainers.length, 'results for search:', params.search);
      
      setContainers(mockContainers);
      setTotalPages(Math.max(1, Math.ceil(mockContainers.length / 10)));
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  // Load data when authenticated and filters change
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      refreshData();
    }
  }, [refreshData, authState.isAuthenticated, authState.isLoading]);

  // Reset to page 1 when filters change  
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters.search, filters.type, filters.tenant, filters.purpose, filters.status, filters.alerts]);

  const selectContainer = useCallback((rowId: string) => {
    setSelectedRowId(rowId === selectedRowId ? null : rowId);
  }, [selectedRowId]);

  const handleRowAction = useCallback(async (rowId: string, action: string) => {
    try {
      console.log(`Executing ${action} on row ${rowId}`);
      
      // Handle different actions
      switch (action) {
        case 'edit':
          console.log(`Edit container ${rowId}`);
          setEditContainerId(parseInt(rowId));
          setShowEditModal(true);
          break;
        case 'shutdown':
          console.log(`Preparing to shutdown container ${rowId}`);
          // Find container name for the dialog
          const container = containers.find(c => c.id === rowId);
          setShutdownContainerId(rowId);
          setShutdownContainerName(container?.name || `Container ${rowId}`);
          setShowShutdownDialog(true);
          break;
        case 'delete':
          console.log(`Delete container ${rowId}`);
          await refreshData();
          break;
        case 'view':
          console.log(`View container ${rowId}`);
          navigate(`/containers/${rowId}`);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Failed to execute ${action} action:`, error);
    }
  }, [containers, refreshData, navigate]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleRowSelect = useCallback((rowId: string) => {
    // Navigate to container detail page on row click
    navigate(`/containers/${rowId}`);
  }, [navigate]);

  const handleRowToggleSelect = useCallback((rowId: string) => {
    // Only toggle selection state without navigation
    selectContainer(rowId);
  }, [selectContainer]);

  const handleCreateContainerClick = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCreateContainerClose = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCreateContainerSuccess = useCallback(() => {
    setShowCreateModal(false);
    refreshData();
  }, [refreshData]);

  const handleRowActionClick = useCallback((rowId: string, action: string) => {
    handleRowAction(rowId, action);
  }, [handleRowAction]);

  const handleShutdownConfirm = useCallback(async (reason: string, force: boolean) => {
    if (!shutdownContainerId) return;
    
    setIsShuttingDown(true);
    try {
      await containerService.shutdownContainer(parseInt(shutdownContainerId), {
        reason,
        force
      });
      console.log(`Container ${shutdownContainerId} shutdown successfully`);
      
      // Close dialog and refresh data
      setShowShutdownDialog(false);
      setShutdownContainerId(null);
      setShutdownContainerName('');
      await refreshData();
    } catch (error) {
      console.error(`Failed to shutdown container ${shutdownContainerId}:`, error);
      alert(`Failed to shutdown container: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsShuttingDown(false);
    }
  }, [shutdownContainerId, refreshData]);

  const handleShutdownCancel = useCallback(() => {
    setShowShutdownDialog(false);
    setShutdownContainerId(null);
    setShutdownContainerName('');
  }, []);

  return (
    <StyledContainerDataTable className={className}>
      <Box className="table-header">
        <Typography variant="h5" component="h2" className="table-title">
          Container List
        </Typography>
        <CreateContainer
          text="Create Container"
          onClick={handleCreateContainerClick}
          loading={isCreating}
          disabled={isCreating}
          type="button"
          aria-label="Create new container"
        />
      </Box>

      <Box className="table-wrapper">
        {error && (
          <Box sx={{ p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="warning.main">
              ⚠️ {error}. Showing demo data instead. Search functionality is still working with filtered mock data.
            </Typography>
          </Box>
        )}
        <VerticalFarmingTable
          data={containers}
          isLoading={isLoading}
          selectedRowId={selectedRowId}
          onRowSelect={handleRowSelect}
          onRowAction={handleRowActionClick}
          emptyStateTitle="No containers found"
          emptyStateMessage="Create your first container or adjust your filters to see containers here."
        />
      </Box>

      <Box className="pagination-wrapper">
        <PaginationBlock
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousClick={goToPreviousPage}
          onNextClick={goToNextPage}
          isPreviousDisabled={isLoading || currentPage <= 1}
          isNextDisabled={isLoading || currentPage >= totalPages}
        />
      </Box>

      <ContainerCreationModal
        open={showCreateModal}
        onClose={handleCreateContainerClose}
        onSuccess={handleCreateContainerSuccess}
      />

      {/* Edit Container Modal */}
      <EditContainerModal
        open={showEditModal}
        containerId={editContainerId}
        onClose={() => {
          setShowEditModal(false);
          setEditContainerId(null);
        }}
        onSuccess={() => {
          console.log('🔄 ContainerDataTable: Edit modal success callback triggered, refreshing data...');
          setShowEditModal(false);
          setEditContainerId(null);
          refreshData();
        }}
      />

      {/* Shutdown Confirmation Dialog */}
      <ShutdownConfirmDialog
        open={showShutdownDialog}
        containerName={shutdownContainerName}
        containerId={shutdownContainerId || ''}
        onConfirm={handleShutdownConfirm}
        onCancel={handleShutdownCancel}
        isLoading={isShuttingDown}
      />
    </StyledContainerDataTable>
  );
};

export default ContainerDataTable;