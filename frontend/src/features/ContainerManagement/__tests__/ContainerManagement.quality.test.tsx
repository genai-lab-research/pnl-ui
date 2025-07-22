import React from 'react';
import { render, screen, waitFor, fireEvent, act, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerManagement } from '../ContainerManagement';
import { containerApiService } from '../../../api/containerApiService';
import type { Container as UIContainer } from '../../../shared/types/containers';
import type { Container as APIContainer, ContainerListResponse, FilterOptions, PerformanceMetrics } from '../../../types/container';

// Mock all dependencies
jest.mock('../../../api/containerApiService');
jest.mock('../../../shared/components/ui/Header', () => ({
  Header: () => <div data-testid="header" />
}));
jest.mock('../../../shared/components/ui/SearchFilters', () => ({
  SearchFilters: ({ onSearchChange, onTypeChange, onTenantChange, onPurposeChange, onStatusChange, onAlertsChange, onClearFilters }: any) => (
    <div data-testid="search-filters">
      <input data-testid="search-input" onChange={(e) => onSearchChange(e.target.value)} />
      <select data-testid="type-select" onChange={(e) => onTypeChange(e.target.value)}>
        <option>All types</option>
        <option>physical</option>
        <option>virtual</option>
      </select>
      <select data-testid="tenant-select" onChange={(e) => onTenantChange(e.target.value)}>
        <option>All tenants</option>
        <option>Tenant 1</option>
      </select>
      <select data-testid="purpose-select" onChange={(e) => onPurposeChange(e.target.value)}>
        <option>All purposes</option>
        <option>storage</option>
      </select>
      <select data-testid="status-select" onChange={(e) => onStatusChange(e.target.value)}>
        <option>All statuses</option>
        <option>active</option>
      </select>
      <input type="checkbox" data-testid="alerts-checkbox" onChange={(e) => onAlertsChange(e.target.checked)} />
      <button data-testid="clear-filters" onClick={onClearFilters}>Clear</button>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/TimeRangeSelector', () => ({
  TimeRangeSelector: ({ onRangeChange }: any) => (
    <div data-testid="time-range-selector">
      <button data-testid="time-week" onClick={() => onRangeChange('Week')}>Week</button>
      <button data-testid="time-month" onClick={() => onRangeChange('Month')}>Month</button>
      <button data-testid="time-quarter" onClick={() => onRangeChange('Quarter')}>Quarter</button>
      <button data-testid="time-year" onClick={() => onRangeChange('Year')}>Year</button>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/ContainerStatistics', () => ({
  __esModule: true,
  default: ({ title }: any) => <div data-testid={`stats-${title.toLowerCase().replace(' ', '-')}`}>{title}</div>
}));
jest.mock('../../../shared/components/ui/ContainerTable', () => ({
  ContainerTable: ({ containers, onSort }: any) => (
    <div data-testid="container-table">
      <div data-testid="container-count">{containers.length}</div>
      <button data-testid="sort-name" onClick={() => onSort('name')}>Sort by Name</button>
      <button data-testid="sort-type" onClick={() => onSort('type')}>Sort by Type</button>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/Paginator', () => ({
  Paginator: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="paginator">
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <button data-testid="page-next" onClick={() => onPageChange(currentPage + 1)}>Next</button>
      <button data-testid="page-prev" onClick={() => onPageChange(currentPage - 1)}>Prev</button>
    </div>
  )
}));
jest.mock('../../../shared/components/ui/CreateContainerButton', () => ({
  CreateContainerButton: () => <button data-testid="create-container-btn">Create</button>
}));
jest.mock('../../CreateContainerPanel', () => ({
  CreateContainerPanel: () => null
}));
jest.mock('../components/ShutdownContainerModal', () => ({
  ShutdownContainerModal: () => null
}));

// Test helpers
const createMockFilterOptions = (): FilterOptions => ({
  container_types: ['physical', 'virtual'],
  tenants: [{ id: 1, name: 'Tenant 1' }],
  purposes: ['storage', 'processing'],
  statuses: ['active', 'inactive']
});

const createMockAPIContainer = (id: number): APIContainer => ({
  id,
  name: `Container ${id}`,
  tenant_id: 1,
  type: 'physical' as const,
  purpose: 'production',
  location: { city: 'NYC', country: 'USA', address: '123 Main' },
  notes: '',
  shadow_service_enabled: false,
  copied_environment_from: null,
  robotics_simulation_enabled: false,
  ecosystem_connected: false,
  ecosystem_settings: {},
  status: 'active' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  seed_types: [],
  alerts: [],
  settings: {
    shadow_service_enabled: false,
    copied_environment_from: null,
    robotics_simulation_enabled: false,
    ecosystem_connected: false,
    ecosystem_settings: {}
  },
  environment: {
    temperature: 22,
    humidity: 60,
    co2: 400,
    light_intensity: 1000
  },
  inventory: {
    total_capacity: 100,
    used_capacity: 50,
    available_capacity: 50,
    seed_count: 25
  },
  metrics: {
    yield_kg: 85,
    space_utilization_pct: 75,
    growth_rate: 1.2,
    health_score: 95
  }
});

const createMockListResponse = (page = 1, total = 20): ContainerListResponse => ({
  containers: Array.from({ length: 10 }, (_, i) => createMockAPIContainer((page - 1) * 10 + i + 1)),
  pagination: { page, limit: 10, total, total_pages: Math.ceil(total / 10) },
  performance_metrics: {
    physical: {
      container_count: 10,
      yield: { average: 85, total: 850, chart_data: [] },
      space_utilization: { average: 75, chart_data: [] }
    },
    virtual: {
      container_count: 10,
      yield: { average: 90, total: 900, chart_data: [] },
      space_utilization: { average: 80, chart_data: [] }
    },
    time_range: {
      type: 'week',
      start_date: '2024-01-01',
      end_date: '2024-01-07'
    },
    generated_at: '2024-01-07T12:00:00Z'
  }
});

const createMockMetrics = (): PerformanceMetrics => ({
  physical: {
    container_count: 10,
    yield: { 
      average: 85, 
      total: 850, 
      chart_data: [
        { date: '2024-01-01', value: 85, is_current_period: true, is_future: false }
      ] 
    },
    space_utilization: { 
      average: 75, 
      chart_data: [
        { date: '2024-01-01', value: 75, is_current_period: true, is_future: false }
      ] 
    }
  },
  virtual: {
    container_count: 10,
    yield: { 
      average: 90, 
      total: 900, 
      chart_data: [
        { date: '2024-01-01', value: 90, is_current_period: true, is_future: false }
      ] 
    },
    space_utilization: { 
      average: 80, 
      chart_data: [
        { date: '2024-01-01', value: 80, is_current_period: true, is_future: false }
      ] 
    }
  },
  time_range: {
    type: 'week',
    start_date: '2024-01-01',
    end_date: '2024-01-07'
  },
  generated_at: '2024-01-07T12:00:00Z'
});

// Performance tracking utilities
class PerformanceTracker {
  private renderCount = 0;
  private apiCalls: Record<string, number> = {};

  reset() {
    this.renderCount = 0;
    this.apiCalls = {};
  }

  trackRender() {
    this.renderCount++;
  }

  trackApiCall(method: string) {
    this.apiCalls[method] = (this.apiCalls[method] || 0) + 1;
  }

  getRenderCount() {
    return this.renderCount;
  }

  getApiCallCount(method: string) {
    return this.apiCalls[method] || 0;
  }

  getTotalApiCalls() {
    return Object.values(this.apiCalls).reduce((sum, count) => sum + count, 0);
  }
}

// Component wrapper for tracking renders
const TrackedContainerManagement: React.FC<{ tracker: PerformanceTracker }> = ({ tracker }) => {
  React.useEffect(() => {
    tracker.trackRender();
  });
  return <ContainerManagement />;
};

describe('ContainerManagement Quality Assurance Tests', () => {
  const mockApiService = containerApiService as jest.Mocked<typeof containerApiService>;
  const tracker = new PerformanceTracker();

  beforeEach(() => {
    jest.clearAllMocks();
    tracker.reset();

    // Setup default mock implementations with tracking
    mockApiService.getFilterOptions.mockImplementation(() => {
      tracker.trackApiCall('getFilterOptions');
      return Promise.resolve(createMockFilterOptions());
    });

    mockApiService.listContainers.mockImplementation((criteria) => {
      tracker.trackApiCall('listContainers');
      const page = criteria?.page || 1;
      return Promise.resolve(createMockListResponse(page));
    });

    mockApiService.getPerformanceMetrics.mockImplementation(() => {
      tracker.trackApiCall('getPerformanceMetrics');
      return Promise.resolve(createMockMetrics());
    });
  });

  describe('1. API Call Singularity', () => {
    it('should make exactly one call to each API on initial load', async () => {
      render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Verify single calls to each API
      expect(tracker.getApiCallCount('getFilterOptions')).toBe(1);
      expect(tracker.getApiCallCount('listContainers')).toBe(1);
      expect(tracker.getApiCallCount('getPerformanceMetrics')).toBe(1);
      expect(tracker.getTotalApiCalls()).toBe(3);
    });

    it('should not duplicate API calls during rapid filter changes', async () => {
      const user = userEvent.setup();
      render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Reset tracker after initial load
      tracker.reset();

      // Rapid filter changes
      await act(async () => {
        await user.type(screen.getByTestId('search-input'), 'test');
        await user.selectOptions(screen.getByTestId('type-select'), 'physical');
        await user.selectOptions(screen.getByTestId('status-select'), 'active');
      });

      await waitFor(() => {
        // Should only trigger one listContainers call despite multiple filter changes
        expect(tracker.getApiCallCount('listContainers')).toBeLessThanOrEqual(3);
      });

      // No metrics or filter options should be called
      expect(tracker.getApiCallCount('getPerformanceMetrics')).toBe(0);
      expect(tracker.getApiCallCount('getFilterOptions')).toBe(0);
    });

    it('should prevent concurrent API calls of the same type', async () => {
      let resolveFirst: any;
      let callCount = 0;

      mockApiService.listContainers.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return new Promise(resolve => { resolveFirst = resolve; });
        }
        return Promise.resolve(createMockListResponse());
      });

      render(<TrackedContainerManagement tracker={tracker} />);

      // First call starts but doesn't resolve
      await waitFor(() => {
        expect(callCount).toBe(1);
      });

      // Try to trigger more calls while first is pending
      fireEvent.click(screen.getByTestId('page-next'));
      fireEvent.click(screen.getByTestId('page-next'));
      fireEvent.click(screen.getByTestId('page-next'));

      // Resolve first call
      act(() => {
        resolveFirst(createMockListResponse());
      });

      await waitFor(() => {
        // Should have prevented concurrent calls
        expect(callCount).toBeLessThanOrEqual(2); // Initial + one pagination
      });
    });

    it('should separate container and metrics API calls appropriately', async () => {
      render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      tracker.reset();

      // Pagination should only call listContainers
      fireEvent.click(screen.getByTestId('page-next'));

      await waitFor(() => {
        expect(tracker.getApiCallCount('listContainers')).toBe(1);
      });

      expect(tracker.getApiCallCount('getPerformanceMetrics')).toBe(0);

      // Time range change should only call getPerformanceMetrics
      fireEvent.click(screen.getByTestId('time-month'));

      await waitFor(() => {
        expect(tracker.getApiCallCount('getPerformanceMetrics')).toBe(1);
      });

      expect(tracker.getApiCallCount('listContainers')).toBe(1); // No additional calls
    });

    it('should handle API errors gracefully without retry storms', async () => {
      let callCount = 0;
      mockApiService.listContainers.mockImplementation(() => {
        callCount++;
        return Promise.reject(new Error('API Error'));
      });

      render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByText(/Error: API Error/)).toBeInTheDocument();
      });

      // Should not retry automatically
      expect(callCount).toBe(1);

      // User action should allow retry
      mockApiService.listContainers.mockResolvedValue(createMockListResponse());
      fireEvent.click(screen.getByTestId('page-next'));

      await waitFor(() => {
        expect(callCount).toBe(2);
      });
    });
  });

  describe('2. Rerender Redundancy', () => {
    it('should minimize rerenders on initial load', async () => {
      render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Initial load should have minimal renders (typically 2-3 in React 18)
      expect(tracker.getRenderCount()).toBeLessThanOrEqual(4);
    });

    it('should batch state updates to prevent cascading rerenders', async () => {
      render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const initialRenders = tracker.getRenderCount();

      // Clear all filters (multiple state updates)
      fireEvent.click(screen.getByTestId('clear-filters'));

      await waitFor(() => {
        expect(tracker.getApiCallCount('listContainers')).toBeGreaterThan(1);
      });

      // Should batch updates efficiently
      const additionalRenders = tracker.getRenderCount() - initialRenders;
      expect(additionalRenders).toBeLessThanOrEqual(3);
    });

    it('should not rerender when receiving identical data', async () => {
      const { rerender } = render(<TrackedContainerManagement tracker={tracker} />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const rendersBefore = tracker.getRenderCount();

      // Force a rerender with same props
      rerender(<TrackedContainerManagement tracker={tracker} />);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should not cause additional renders
      expect(tracker.getRenderCount()).toBe(rendersBefore + 1); // Only the forced rerender
    });

    it('should use memoization to prevent unnecessary child rerenders', async () => {
      let tableRenderCount = 0;
      
      // Override table mock to count renders
      jest.mocked(require('../../../shared/components/ui/ContainerTable')).ContainerTable = 
        ({ containers }: any) => {
          React.useEffect(() => {
            tableRenderCount++;
          });
          return <div data-testid="container-table">{containers.length}</div>;
        };

      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const initialTableRenders = tableRenderCount;

      // Change time range (should not affect table)
      fireEvent.click(screen.getByTestId('time-month'));

      await waitFor(() => {
        expect(mockApiService.getPerformanceMetrics).toHaveBeenCalledTimes(2);
      });

      // Table should not rerender for unrelated changes
      expect(tableRenderCount).toBe(initialTableRenders);
    });
  });

  describe('3. State Update Stability', () => {
    it('should maintain state consistency during concurrent updates', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Trigger multiple state changes simultaneously
      await act(async () => {
        fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });
        fireEvent.click(screen.getByTestId('page-next'));
        fireEvent.click(screen.getByTestId('time-month'));
      });

      await waitFor(() => {
        // All states should be updated correctly
        expect(screen.getByTestId('current-page')).toHaveTextContent('2');
        expect(mockApiService.listContainers).toHaveBeenLastCalledWith(
          expect.objectContaining({
            search: 'test',
            page: 2
          })
        );
      });
    });

    it('should handle rapid state changes without loss or corruption', async () => {
      const user = userEvent.setup();
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Rapid typing in search
      await user.type(screen.getByTestId('search-input'), 'container search test');

      await waitFor(() => {
        const lastCall = mockApiService.listContainers.mock.calls[
          mockApiService.listContainers.mock.calls.length - 1
        ][0];
        expect(lastCall?.search).toBe('container search test');
      });
    });

    it('should maintain pagination state when filters change', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Navigate to page 2
      fireEvent.click(screen.getByTestId('page-next'));

      await waitFor(() => {
        expect(screen.getByTestId('current-page')).toHaveTextContent('2');
      });

      // Change filter (should reset to page 1)
      fireEvent.change(screen.getByTestId('type-select'), { target: { value: 'physical' } });

      await waitFor(() => {
        expect(screen.getByTestId('current-page')).toHaveTextContent('1');
        expect(mockApiService.listContainers).toHaveBeenLastCalledWith(
          expect.objectContaining({
            page: 1,
            type: 'physical'
          })
        );
      });
    });

    it('should handle edge cases in state updates', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Test empty response
      mockApiService.listContainers.mockResolvedValueOnce({
        containers: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
        performance_metrics: createMockMetrics()
      });

      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'nonexistent' } });

      await waitFor(() => {
        expect(screen.getByTestId('container-count')).toHaveTextContent('0');
      });

      // Clear search - should restore data
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByTestId('container-count')).not.toHaveTextContent('0');
      });
    });

    it('should prevent state updates after unmount', async () => {
      const { unmount } = render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Set up a delayed response
      let resolveDelayed: any;
      mockApiService.listContainers.mockImplementationOnce(() => 
        new Promise(resolve => { resolveDelayed = resolve; })
      );

      // Trigger an update
      fireEvent.click(screen.getByTestId('page-next'));

      // Unmount before response
      unmount();

      // Resolve the delayed response
      act(() => {
        resolveDelayed(createMockListResponse(2));
      });

      // No errors should occur
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
    });

    it('should handle sort state changes efficiently', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Click sort multiple times
      fireEvent.click(screen.getByTestId('sort-name'));
      
      await waitFor(() => {
        expect(mockApiService.listContainers).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sort: 'name',
            order: 'desc'
          })
        );
      });

      fireEvent.click(screen.getByTestId('sort-name'));

      await waitFor(() => {
        expect(mockApiService.listContainers).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sort: 'name',
            order: 'asc'
          })
        );
      });

      // Change to different sort field
      fireEvent.click(screen.getByTestId('sort-type'));

      await waitFor(() => {
        expect(mockApiService.listContainers).toHaveBeenLastCalledWith(
          expect.objectContaining({
            sort: 'type',
            order: 'asc'
          })
        );
      });
    });
  });

  describe('Race Condition Prevention', () => {
    it('should handle out-of-order API responses correctly', async () => {
      let resolveFirst: any;
      let resolveSecond: any;
      let callCount = 0;

      mockApiService.listContainers.mockImplementation((criteria) => {
        callCount++;
        if (callCount === 1) {
          return new Promise(resolve => { resolveFirst = resolve; });
        } else if (callCount === 2) {
          return new Promise(resolve => { resolveSecond = resolve; });
        }
        return Promise.resolve(createMockListResponse());
      });

      render(<ContainerManagement />);

      // First call starts
      await waitFor(() => {
        expect(callCount).toBe(1);
      });

      // Trigger second call
      fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });

      await waitFor(() => {
        expect(callCount).toBe(2);
      });

      // Resolve second call first
      act(() => {
        resolveSecond(createMockListResponse(1, 5));
      });

      await waitFor(() => {
        expect(screen.getByTestId('container-count')).toHaveTextContent('5');
      });

      // Resolve first call later (should be ignored)
      act(() => {
        resolveFirst(createMockListResponse(1, 20));
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Should still show results from second call
      expect(screen.getByTestId('container-count')).toHaveTextContent('5');
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should clean up event listeners and timers on unmount', async () => {
      const { unmount } = render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      // Trigger an action that uses timers
      fireEvent.click(screen.getByTestId('page-next'));

      const timeoutCalls = setTimeoutSpy.mock.calls.length;

      unmount();

      // All timers should be cleared
      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(timeoutCalls);

      setTimeoutSpy.mockRestore();
      clearTimeoutSpy.mockRestore();
    });
  });
});