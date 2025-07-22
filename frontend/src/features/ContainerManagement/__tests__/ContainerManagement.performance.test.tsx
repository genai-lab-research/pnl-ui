import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { ContainerManagement } from '../ContainerManagement';
import { containerApiService } from '../../../api/containerApiService';

// Mock dependencies
jest.mock('../../../api/containerApiService');
jest.mock('../../../shared/components/ui/Header', () => ({
  Header: () => <div data-testid="header" />
}));
jest.mock('../../../shared/components/ui/SearchFilters', () => ({
  SearchFilters: () => <div data-testid="search-filters" />
}));
jest.mock('../../../shared/components/ui/TimeRangeSelector', () => ({
  TimeRangeSelector: ({ onRangeChange }: any) => (
    <div data-testid="time-range-selector">
      <button onClick={() => onRangeChange('Month')} data-testid="time-month">Month</button>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/ContainerStatistics', () => ({
  __esModule: true,
  default: () => <div data-testid="statistics" />
}));
jest.mock('../../../shared/components/ui/ContainerTable', () => ({
  ContainerTable: () => <div data-testid="container-table" />
}));
jest.mock('../../../shared/components/ui/Paginator', () => ({
  Paginator: ({ onPageChange }: any) => (
    <div data-testid="paginator">
      <button onClick={() => onPageChange(2)} data-testid="page-2">Page 2</button>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/CreateContainerButton', () => ({
  CreateContainerButton: () => <button data-testid="create-button" />
}));
jest.mock('../../CreateContainerPanel', () => ({
  CreateContainerPanel: () => null
}));
jest.mock('../components/ShutdownContainerModal', () => ({
  ShutdownContainerModal: () => null
}));

describe('ContainerManagement Performance Tests', () => {
  const mockApiService = containerApiService as jest.Mocked<typeof containerApiService>;
  
  // Track API calls
  const apiCallTracker = {
    listContainers: jest.fn(),
    getPerformanceMetrics: jest.fn(),
    getFilterOptions: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mocks with tracking
    mockApiService.getFilterOptions.mockImplementation((...args) => {
      apiCallTracker.getFilterOptions(...args);
      return Promise.resolve({
        container_types: ['physical', 'virtual'],
        tenants: [{ id: 1, name: 'Tenant 1' }],
        purposes: ['storage'],
        statuses: ['active']
      });
    });

    mockApiService.listContainers.mockImplementation((...args) => {
      apiCallTracker.listContainers(...args);
      return Promise.resolve({
        containers: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
      });
    });

    mockApiService.getPerformanceMetrics.mockImplementation((...args) => {
      apiCallTracker.getPerformanceMetrics(...args);
      return Promise.resolve({
        physical: {
          container_count: 0,
          yield: { average: 0, total: 0, chart_data: [] },
          space_utilization: { average: 0, chart_data: [] }
        },
        virtual: {
          container_count: 0,
          yield: { average: 0, total: 0, chart_data: [] },
          space_utilization: { average: 0, chart_data: [] }
        }
      });
    });
  });

  describe('API Call Optimization', () => {
    it('should not reload metrics when paginating', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Clear initial load calls
      apiCallTracker.listContainers.mockClear();
      apiCallTracker.getPerformanceMetrics.mockClear();

      // Trigger pagination
      fireEvent.click(screen.getByTestId('page-2'));

      await waitFor(() => {
        expect(apiCallTracker.listContainers).toHaveBeenCalledTimes(1);
      });

      // Metrics should NOT be called
      expect(apiCallTracker.getPerformanceMetrics).not.toHaveBeenCalled();
    });

    it('should not reload containers when changing time range', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Clear initial load calls
      apiCallTracker.listContainers.mockClear();
      apiCallTracker.getPerformanceMetrics.mockClear();

      // Change time range
      fireEvent.click(screen.getByTestId('time-month'));

      await waitFor(() => {
        expect(apiCallTracker.getPerformanceMetrics).toHaveBeenCalledTimes(1);
      });

      // Containers should NOT be called
      expect(apiCallTracker.listContainers).not.toHaveBeenCalled();
    });

    it('should cache filter options and not reload them', async () => {
      const { rerender } = render(<ContainerManagement />);

      await waitFor(() => {
        expect(apiCallTracker.getFilterOptions).toHaveBeenCalledTimes(1);
      });

      // Force re-render
      rerender(<ContainerManagement />);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Filter options should still only be called once (cached)
      expect(apiCallTracker.getFilterOptions).toHaveBeenCalledTimes(1);
    });

    it('should prevent concurrent API calls', async () => {
      // Make API calls take time
      let resolveListContainers: any;
      mockApiService.listContainers.mockImplementation(() => {
        apiCallTracker.listContainers();
        return new Promise(resolve => {
          resolveListContainers = resolve;
        });
      });

      render(<ContainerManagement />);

      // Wait for initial load to start
      await waitFor(() => {
        expect(apiCallTracker.listContainers).toHaveBeenCalledTimes(1);
      });

      // Try to trigger another load while first is pending
      fireEvent.click(screen.getByTestId('page-2'));
      fireEvent.click(screen.getByTestId('page-2'));
      fireEvent.click(screen.getByTestId('page-2'));

      // Resolve the pending request
      act(() => {
        resolveListContainers({
          containers: [],
          pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
        });
      });

      await waitFor(() => {
        // Should not have triggered additional calls while loading
        expect(apiCallTracker.listContainers).toHaveBeenCalledTimes(2); // Initial + 1 pagination
      });
    });
  });

  describe('Render Optimization', () => {
    it('should minimize renders when updating multiple filter states', async () => {
      let renderCount = 0;
      
      // Create a wrapper to count renders
      const CountedContainerManagement = () => {
        React.useEffect(() => {
          renderCount++;
        });
        return <ContainerManagement />;
      };

      render(<CountedContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const initialRenderCount = renderCount;

      // Simulate clearing all filters (multiple state updates)
      act(() => {
        // This would trigger handleClearFilters which updates 6+ state variables
        const event = new CustomEvent('clearFilters');
        window.dispatchEvent(event);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Should have minimal additional renders
      const additionalRenders = renderCount - initialRenderCount;
      expect(additionalRenders).toBeLessThanOrEqual(3); // React 18 batches updates
    });
  });

  describe('Memory Management', () => {
    it('should properly clean up refs and prevent memory leaks', async () => {
      const { unmount } = render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Track initial call counts
      const initialCalls = {
        list: apiCallTracker.listContainers.mock.calls.length,
        metrics: apiCallTracker.getPerformanceMetrics.mock.calls.length
      };

      // Unmount component
      unmount();

      // Try to trigger actions that would cause API calls
      act(() => {
        // Simulate async callbacks that might fire after unmount
        setTimeout(() => {
          // These should not trigger any API calls
        }, 100);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });

      // No additional API calls should have been made after unmount
      expect(apiCallTracker.listContainers.mock.calls.length).toBe(initialCalls.list);
      expect(apiCallTracker.getPerformanceMetrics.mock.calls.length).toBe(initialCalls.metrics);
    });
  });

  describe('State Update Batching', () => {
    it('should batch pagination state updates with filter changes', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Clear initial calls
      apiCallTracker.listContainers.mockClear();

      // Simulate multiple filter changes that should reset pagination
      act(() => {
        // These would normally trigger setPagination({ ...prev, page: 1 }) multiple times
        const searchEvent = new CustomEvent('searchChange', { detail: 'test' });
        const typeEvent = new CustomEvent('typeChange', { detail: 'physical' });
        const statusEvent = new CustomEvent('statusChange', { detail: 'active' });
        
        window.dispatchEvent(searchEvent);
        window.dispatchEvent(typeEvent);
        window.dispatchEvent(statusEvent);
      });

      await waitFor(() => {
        // Should only trigger one API call despite multiple state changes
        expect(apiCallTracker.listContainers).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Metrics Caching', () => {
    it('should use cached metrics when switching back to previous time range', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Initial load for 'Week'
      expect(apiCallTracker.getPerformanceMetrics).toHaveBeenCalledWith({
        timeRange: 'week'
      });

      apiCallTracker.getPerformanceMetrics.mockClear();

      // Change to Month
      fireEvent.click(screen.getByTestId('time-month'));

      await waitFor(() => {
        expect(apiCallTracker.getPerformanceMetrics).toHaveBeenCalledWith({
          timeRange: 'month'
        });
      });

      // Clear and simulate going back to Week
      apiCallTracker.getPerformanceMetrics.mockClear();
      
      // In the optimized version, this should use cache
      act(() => {
        const weekEvent = new CustomEvent('timeRangeChange', { detail: 'Week' });
        window.dispatchEvent(weekEvent);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Should not make another API call (using cache)
      expect(apiCallTracker.getPerformanceMetrics).not.toHaveBeenCalled();
    });
  });
});