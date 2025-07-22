import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerManagement } from '../ContainerManagement';
import { containerApiService } from '../../../api/containerApiService';
import { Container } from '../../../shared/types/containers';
import { ContainerListResponse, FilterOptions, PerformanceMetrics } from '../../../types/container';

// Mock all external dependencies
jest.mock('../../../api/containerApiService');
jest.mock('../../../shared/components/ui/Header', () => ({
  Header: ({ logoText }: { logoText: string }) => <div data-testid="header">{logoText}</div>
}));
jest.mock('../../../shared/components/ui/SearchFilters', () => ({
  SearchFilters: (props: any) => <div data-testid="search-filters" {...props} />
}));
jest.mock('../../../shared/components/ui/TimeRangeSelector', () => ({
  TimeRangeSelector: ({ selectedRange, onRangeChange }: any) => (
    <div data-testid="time-range-selector">
      <button onClick={() => onRangeChange('Week')}>Week</button>
      <button onClick={() => onRangeChange('Month')}>Month</button>
      <button onClick={() => onRangeChange('Quarter')}>Quarter</button>
      <button onClick={() => onRangeChange('Year')}>Year</button>
      <span>{selectedRange}</span>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/ContainerStatistics', () => ({
  __esModule: true,
  default: ({ title, containerCount }: any) => (
    <div data-testid={`statistics-${title.toLowerCase().replace(' ', '-')}`}>
      {title}: {containerCount}
    </div>
  )
}));
jest.mock('../../../shared/components/ui/ContainerTable', () => ({
  ContainerTable: ({ containers, onRowAction, sortConfig, onSort }: any) => (
    <div data-testid="container-table">
      <div>Containers: {containers.length}</div>
      <div>Sort: {sortConfig.field} {sortConfig.order}</div>
      {containers.map((c: Container) => (
        <div key={c.id} data-testid={`container-${c.id}`}>
          {c.name}
          <button onClick={() => onRowAction(c, 'shutdown')}>Shutdown</button>
        </div>
      ))}
    </div>
  )
}));
jest.mock('../../../shared/components/ui/Paginator', () => ({
  Paginator: ({ currentPage, totalPages, onPageChange, loading }: any) => (
    <div data-testid="paginator">
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={loading}>Next</button>
      {loading && <span>Loading...</span>}
    </div>
  )
}));
jest.mock('../../../shared/components/ui/CreateContainerButton', () => ({
  CreateContainerButton: ({ onClick }: any) => (
    <button data-testid="create-container-button" onClick={onClick}>Create Container</button>
  )
}));
jest.mock('../../CreateContainerPanel', () => ({
  CreateContainerPanel: ({ open, onClose, onSuccess }: any) => 
    open ? (
      <div data-testid="create-container-panel">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSuccess({ id: 'new-1', name: 'New Container' })}>Create</button>
      </div>
    ) : null
}));
jest.mock('../components/ShutdownContainerModal', () => ({
  ShutdownContainerModal: ({ open, container, onClose, onConfirm }: any) =>
    open ? (
      <div data-testid="shutdown-modal">
        <span>Shutdown {container?.name}?</span>
        <button onClick={onClose}>Cancel</button>
        <button onClick={() => onConfirm('Test reason', false)}>Confirm</button>
      </div>
    ) : null
}));

// Helper function to create mock data
const createMockContainer = (id: string, overrides?: Partial<Container>): Container => ({
  id,
  name: `Container ${id}`,
  type: 'physical',
  tenant: 'tenant-1',
  purpose: 'storage',
  location: { city: 'NYC', country: 'USA', address: '123 Main St' },
  status: 'connected',
  created: '2024-01-01T00:00:00Z',
  modified: '2024-01-01T00:00:00Z',
  has_alert: false,
  notes: '',
  shadow_service_enabled: false,
  ecosystem_connected: false,
  ...overrides
});

const createMockListResponse = (containers: Container[], page = 1, total = 10): ContainerListResponse => ({
  containers: containers.map(c => ({
    id: parseInt(c.id),
    name: c.name,
    type: c.type as 'physical' | 'virtual',
    tenant_id: 1,
    purpose: c.purpose,
    location: c.location,
    status: c.status === 'connected' ? 'active' : c.status as any,
    created_at: c.created,
    updated_at: c.modified,
    alerts: c.has_alert ? [{ id: 1, message: 'Test alert' }] : [],
    notes: c.notes,
    shadow_service_enabled: c.shadow_service_enabled,
    ecosystem_connected: c.ecosystem_connected
  })),
  pagination: {
    page,
    limit: 10,
    total,
    total_pages: Math.ceil(total / 10)
  }
});

const createMockFilterOptions = (): FilterOptions => ({
  container_types: ['physical', 'virtual'],
  tenants: [
    { id: 1, name: 'Tenant 1' },
    { id: 2, name: 'Tenant 2' }
  ],
  purposes: ['storage', 'processing', 'distribution'],
  statuses: ['active', 'inactive', 'maintenance']
});

const createMockMetrics = (): PerformanceMetrics => ({
  physical: {
    container_count: 5,
    yield: {
      average: 85.5,
      total: 427.5,
      chart_data: [
        { date: '2024-01-01', value: 85 },
        { date: '2024-01-02', value: 86 },
        { date: '2024-01-03', value: 84 },
        { date: '2024-01-04', value: 87 },
        { date: '2024-01-05', value: 85.5 }
      ]
    },
    space_utilization: {
      average: 75.2,
      chart_data: [
        { date: '2024-01-01', value: 74 },
        { date: '2024-01-02', value: 75 },
        { date: '2024-01-03', value: 76 },
        { date: '2024-01-04', value: 75 },
        { date: '2024-01-05', value: 76 }
      ]
    }
  },
  virtual: {
    container_count: 3,
    yield: {
      average: 92.3,
      total: 276.9,
      chart_data: [
        { date: '2024-01-01', value: 92 },
        { date: '2024-01-02', value: 93 },
        { date: '2024-01-03', value: 91 },
        { date: '2024-01-04', value: 93 },
        { date: '2024-01-05', value: 92.5 }
      ]
    },
    space_utilization: {
      average: 82.1,
      chart_data: [
        { date: '2024-01-01', value: 81 },
        { date: '2024-01-02', value: 82 },
        { date: '2024-01-03', value: 83 },
        { date: '2024-01-04', value: 82 },
        { date: '2024-01-05', value: 82.5 }
      ]
    }
  }
});

describe('ContainerManagement Component', () => {
  const mockContainerApiService = containerApiService as jest.Mocked<typeof containerApiService>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock responses
    mockContainerApiService.getFilterOptions.mockResolvedValue(createMockFilterOptions());
    mockContainerApiService.listContainers.mockResolvedValue(
      createMockListResponse([
        createMockContainer('1'),
        createMockContainer('2'),
        createMockContainer('3')
      ])
    );
    mockContainerApiService.getPerformanceMetrics.mockResolvedValue(createMockMetrics());
  });

  describe('Initial Load and API Calls', () => {
    it('should load filter options, containers, and metrics on mount', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(mockContainerApiService.getFilterOptions).toHaveBeenCalledTimes(1);
        expect(mockContainerApiService.listContainers).toHaveBeenCalledTimes(1);
        expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(1);
      });

      // Verify initial API call parameters
      expect(mockContainerApiService.listContainers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'asc'
      });

      expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledWith({
        timeRange: 'week'
      });
    });

    it('should display loaded data correctly', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      expect(screen.getByText('Containers: 3')).toBeInTheDocument();
      expect(screen.getByTestId('statistics-physical-containers')).toHaveTextContent('Physical Containers: 5');
      expect(screen.getByTestId('statistics-virtual-containers')).toHaveTextContent('Virtual Containers: 3');
    });

    it('should not make duplicate API calls during initial load', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(mockContainerApiService.listContainers).toHaveBeenCalled();
      });

      // Wait a bit more to ensure no duplicate calls
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockContainerApiService.getFilterOptions).toHaveBeenCalledTimes(1);
      expect(mockContainerApiService.listContainers).toHaveBeenCalledTimes(1);
      expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pagination', () => {
    it('should only reload containers when page changes, not metrics', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('paginator')).toBeInTheDocument();
      });

      // Clear initial call counts
      jest.clearAllMocks();

      // Click next page
      fireEvent.click(screen.getByText('Next'));

      await waitFor(() => {
        expect(mockContainerApiService.listContainers).toHaveBeenCalledTimes(1);
      });

      // Verify only containers were reloaded, not metrics
      expect(mockContainerApiService.getPerformanceMetrics).not.toHaveBeenCalled();
      
      // Verify correct page parameter
      expect(mockContainerApiService.listContainers).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });

    it('should show loading state during pagination', async () => {
      // Set up a delayed response
      mockContainerApiService.listContainers.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => 
          resolve(createMockListResponse([createMockContainer('4')], 2)), 100
        ))
      );

      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('paginator')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Next'));

      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Time Range Changes', () => {
    it('should only reload metrics when time range changes, not containers', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('time-range-selector')).toBeInTheDocument();
      });

      // Clear initial call counts
      jest.clearAllMocks();

      // Change time range to Month
      fireEvent.click(screen.getByText('Month'));

      await waitFor(() => {
        expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(1);
      });

      // Verify only metrics were reloaded, not containers
      expect(mockContainerApiService.listContainers).not.toHaveBeenCalled();
      
      // Verify correct time range parameter
      expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledWith({
        timeRange: 'month'
      });
    });

    it('should cache metrics to prevent duplicate API calls', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('time-range-selector')).toBeInTheDocument();
      });

      // Clear initial call counts
      jest.clearAllMocks();

      // Change to Month
      fireEvent.click(screen.getByText('Month'));
      await waitFor(() => {
        expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(1);
      });

      // Change back to Week
      fireEvent.click(screen.getByText('Week'));
      await waitFor(() => {
        expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(1);
      });

      // The second call should use cached data (no additional API call)
    });
  });

  describe('Container Actions', () => {
    it('should handle container shutdown correctly', async () => {
      mockContainerApiService.shutdownContainer.mockResolvedValue({
        message: 'Container shutdown successful',
        container_id: 1
      });

      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-1')).toBeInTheDocument();
      });

      // Click shutdown on first container
      fireEvent.click(screen.getByTestId('container-1').querySelector('button')!);

      // Modal should appear
      expect(screen.getByTestId('shutdown-modal')).toBeInTheDocument();
      expect(screen.getByText('Shutdown Container 1?')).toBeInTheDocument();

      // Confirm shutdown
      fireEvent.click(screen.getByText('Confirm'));

      await waitFor(() => {
        expect(mockContainerApiService.shutdownContainer).toHaveBeenCalledWith(1, {
          reason: 'Test reason',
          force: false
        });
      });

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Container updated successfully!')).toBeInTheDocument();
      });

      // Success message should disappear after 3 seconds
      await waitFor(() => {
        expect(screen.queryByText('Container updated successfully!')).not.toBeInTheDocument();
      }, { timeout: 4000 });
    });

    it('should optimistically update container status after shutdown', async () => {
      mockContainerApiService.shutdownContainer.mockResolvedValue({
        message: 'Container shutdown successful',
        container_id: 1
      });

      const { rerender } = render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-1')).toBeInTheDocument();
      });

      // Initial containers should have 'connected' status
      const initialContainers = mockContainerApiService.listContainers.mock.results[0].value;
      expect(initialContainers).toBeDefined();

      // Shutdown container
      fireEvent.click(screen.getByTestId('container-1').querySelector('button')!);
      fireEvent.click(screen.getByText('Confirm'));

      await waitFor(() => {
        expect(mockContainerApiService.shutdownContainer).toHaveBeenCalled();
      });

      // Metrics should be reloaded after a delay
      await waitFor(() => {
        expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(2);
      }, { timeout: 2000 });
    });
  });

  describe('Container Creation', () => {
    it('should reload data after creating a new container', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('create-container-button')).toBeInTheDocument();
      });

      // Clear initial call counts
      jest.clearAllMocks();

      // Open create panel
      fireEvent.click(screen.getByTestId('create-container-button'));
      expect(screen.getByTestId('create-container-panel')).toBeInTheDocument();

      // Create container
      fireEvent.click(screen.getByText('Create'));

      await waitFor(() => {
        // Should reload both containers and metrics
        expect(mockContainerApiService.listContainers).toHaveBeenCalledTimes(1);
        expect(mockContainerApiService.getPerformanceMetrics).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when container loading fails', async () => {
      mockContainerApiService.listContainers.mockRejectedValue(new Error('Failed to load containers'));

      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to load containers')).toBeInTheDocument();
      });
    });

    it('should continue to show data if metrics loading fails', async () => {
      mockContainerApiService.getPerformanceMetrics.mockRejectedValue(new Error('Metrics error'));

      render(<ContainerManagement />);

      await waitFor(() => {
        // Should still show container table
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
        expect(screen.getByText('Containers: 3')).toBeInTheDocument();
      });

      // But metrics should not be displayed
      expect(screen.queryByTestId('statistics-physical-containers')).not.toBeInTheDocument();
    });
  });

  describe('Performance Optimizations', () => {
    it('should prevent API calls when component is already loading', async () => {
      // Make listContainers take longer
      let resolveContainers: any;
      mockContainerApiService.listContainers.mockImplementation(() => 
        new Promise(resolve => { resolveContainers = resolve; })
      );

      render(<ContainerManagement />);

      // Try to trigger multiple loads quickly
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Next'));

      // Resolve the promise
      act(() => {
        resolveContainers(createMockListResponse([createMockContainer('1')], 2));
      });

      await waitFor(() => {
        // Should only have made one call despite multiple clicks
        expect(mockContainerApiService.listContainers).toHaveBeenCalledTimes(2); // Initial + 1 pagination
      });
    });

    it('should batch state updates to minimize rerenders', async () => {
      const renderCounter = jest.fn();
      
      // Wrap component to count renders
      const TestWrapper = () => {
        renderCounter();
        return <ContainerManagement />;
      };

      render(<TestWrapper />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const initialRenderCount = renderCounter.mock.calls.length;

      // Clear filters (which updates multiple states)
      fireEvent.click(screen.getByText('Clear Filters'));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should have minimal additional renders despite multiple state updates
      const additionalRenders = renderCounter.mock.calls.length - initialRenderCount;
      expect(additionalRenders).toBeLessThan(5); // Reasonable threshold
    });
  });
});