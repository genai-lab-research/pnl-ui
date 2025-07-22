import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContainerManagement } from '../ContainerManagement';
import { containerApiService } from '../../../api/containerApiService';
import {
  ApiCallTracker,
  StateStabilityTracker,
  renderWithTracking,
  measurePerformance,
  createDelayedMockResponse,
  waitForStableState
} from './test-utils';

// Mock dependencies
jest.mock('../../../api/containerApiService');
jest.mock('../../../shared/components/ui/Header', () => ({
  Header: () => <div data-testid="header" />
}));
jest.mock('../../../shared/components/ui/SearchFilters', () => ({
  SearchFilters: ({ onSearchChange }: any) => (
    <input data-testid="search-input" onChange={(e) => onSearchChange(e.target.value)} />
  )
}));
jest.mock('../../../shared/components/ui/TimeRangeSelector', () => ({
  TimeRangeSelector: ({ onRangeChange }: any) => (
    <button data-testid="time-range" onClick={() => onRangeChange('Month')}>Change Time</button>
  )
}));
jest.mock('../../../shared/components/ui/ContainerStatistics', () => ({
  __esModule: true,
  default: () => <div data-testid="statistics" />
}));
jest.mock('../../../shared/components/ui/ContainerTable', () => ({
  ContainerTable: ({ containers }: any) => (
    <div data-testid="container-table">{containers.length} containers</div>
  )
}));
jest.mock('../../../shared/components/ui/Paginator', () => ({
  Paginator: ({ onPageChange, currentPage }: any) => (
    <button data-testid="next-page" onClick={() => onPageChange(currentPage + 1)}>Next</button>
  )
}));
jest.mock('../../../shared/components/ui/CreateContainerButton', () => ({
  CreateContainerButton: () => null
}));
jest.mock('../../CreateContainerPanel', () => ({
  CreateContainerPanel: () => null
}));
jest.mock('../components/ShutdownContainerModal', () => ({
  ShutdownContainerModal: () => null
}));

describe('ContainerManagement Performance Benchmarks', () => {
  const mockApiService = containerApiService as jest.Mocked<typeof containerApiService>;
  const apiTracker = new ApiCallTracker();
  const stateTracker = new StateStabilityTracker();

  beforeEach(() => {
    jest.clearAllMocks();
    apiTracker.reset();
    stateTracker.reset();

    // Default mock responses
    mockApiService.getFilterOptions.mockResolvedValue({
      container_types: ['physical', 'virtual'],
      tenants: [{ id: 1, name: 'Tenant 1' }],
      purposes: ['storage'],
      statuses: ['active']
    });

    mockApiService.listContainers.mockResolvedValue({
      containers: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Container ${i + 1}`,
        type: 'physical' as const,
        tenant_id: 1,
        purpose: 'storage',
        location: { city: 'NYC', country: 'USA', address: '123 Main' },
        status: 'active' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        alerts: [],
        notes: '',
        shadow_service_enabled: false,
        ecosystem_connected: false
      })),
      pagination: { page: 1, limit: 10, total: 100, total_pages: 10 }
    });

    mockApiService.getPerformanceMetrics.mockResolvedValue({
      physical: {
        container_count: 50,
        yield: { average: 85, total: 4250, chart_data: [] },
        space_utilization: { average: 75, chart_data: [] }
      },
      virtual: {
        container_count: 50,
        yield: { average: 90, total: 4500, chart_data: [] },
        space_utilization: { average: 80, chart_data: [] }
      }
    });
  });

  describe('Initial Load Performance', () => {
    it('should complete initial load within performance budget', async () => {
      const performance = await measurePerformance(async () => {
        const { unmount } = render(<ContainerManagement />);
        await waitFor(() => {
          expect(screen.getByTestId('container-table')).toBeInTheDocument();
        });
        unmount();
      }, 3);

      console.log('Initial load performance:', performance);
      
      // Performance budgets
      expect(performance.avgDuration).toBeLessThan(1000); // 1 second
      expect(performance.maxDuration).toBeLessThan(1500); // 1.5 seconds max
    });

    it('should make parallel API calls efficiently', async () => {
      // Track API call timing
      const callTimings: Record<string, number> = {};
      
      mockApiService.getFilterOptions.mockImplementation(() => {
        callTimings.filterStart = Date.now();
        return createDelayedMockResponse({
          container_types: ['physical', 'virtual'],
          tenants: [{ id: 1, name: 'Tenant 1' }],
          purposes: ['storage'],
          statuses: ['active']
        }, 100).then(result => {
          callTimings.filterEnd = Date.now();
          return result;
        });
      });

      mockApiService.listContainers.mockImplementation(() => {
        callTimings.listStart = Date.now();
        return createDelayedMockResponse({
          containers: [],
          pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
        }, 150).then(result => {
          callTimings.listEnd = Date.now();
          return result;
        });
      });

      mockApiService.getPerformanceMetrics.mockImplementation(() => {
        callTimings.metricsStart = Date.now();
        return createDelayedMockResponse({
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
        }, 200).then(result => {
          callTimings.metricsEnd = Date.now();
          return result;
        });
      });

      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      }, { timeout: 500 });

      // Verify calls were made in parallel (not sequential)
      const filterDuration = callTimings.filterEnd - callTimings.filterStart;
      const listDuration = callTimings.listEnd - callTimings.listStart;
      const metricsDuration = callTimings.metricsEnd - callTimings.metricsStart;
      
      const totalSequentialTime = filterDuration + listDuration + metricsDuration;
      const actualTotalTime = Math.max(
        callTimings.filterEnd,
        callTimings.listEnd,
        callTimings.metricsEnd
      ) - Math.min(
        callTimings.filterStart,
        callTimings.listStart,
        callTimings.metricsStart
      );

      // Actual time should be significantly less than sequential time
      expect(actualTotalTime).toBeLessThan(totalSequentialTime * 0.7);
    });
  });

  describe('Interaction Performance', () => {
    it('should handle rapid search input efficiently', async () => {
      const user = userEvent.setup({ delay: null });
      const { getRenderCount } = renderWithTracking(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const initialRenders = getRenderCount();
      const initialApiCalls = mockApiService.listContainers.mock.calls.length;

      // Simulate rapid typing
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'container test search query', { delay: 10 });

      await waitFor(() => {
        const lastCall = mockApiService.listContainers.mock.calls[
          mockApiService.listContainers.mock.calls.length - 1
        ];
        expect(lastCall[0]?.search).toBe('container test search query');
      });

      const totalRenders = getRenderCount() - initialRenders;
      const totalApiCalls = mockApiService.listContainers.mock.calls.length - initialApiCalls;

      // Should batch updates efficiently
      expect(totalRenders).toBeLessThan(30); // Less than one render per character
      expect(totalApiCalls).toBeLessThan(10); // Debouncing should reduce API calls
    });

    it('should maintain 60fps during pagination', async () => {
      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Measure frame timing during pagination
      const frameTimings: number[] = [];
      let lastFrameTime = performance.now();

      const measureFrame = () => {
        const currentTime = performance.now();
        frameTimings.push(currentTime - lastFrameTime);
        lastFrameTime = currentTime;
      };

      // Set up frame measurement
      const rafId = requestAnimationFrame(function measure() {
        measureFrame();
        requestAnimationFrame(measure);
      });

      // Trigger pagination
      fireEvent.click(screen.getByTestId('next-page'));

      await waitFor(() => {
        expect(mockApiService.listContainers).toHaveBeenCalledTimes(2);
      });

      cancelAnimationFrame(rafId);

      // Analyze frame timings
      const longFrames = frameTimings.filter(timing => timing > 16.67); // 60fps = 16.67ms per frame
      const longFramePercentage = (longFrames.length / frameTimings.length) * 100;

      expect(longFramePercentage).toBeLessThan(5); // Less than 5% dropped frames
    });
  });

  describe('Memory Performance', () => {
    it('should not leak memory during extended usage', async () => {
      const { unmount } = render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      // Get initial memory (if available)
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Simulate extended usage
      for (let i = 0; i < 20; i++) {
        fireEvent.click(screen.getByTestId('next-page'));
        await waitFor(() => {
          expect(mockApiService.listContainers).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByTestId('time-range'));
        await waitFor(() => {
          expect(mockApiService.getPerformanceMetrics).toHaveBeenCalled();
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreasePercentage = (memoryIncrease / initialMemory) * 100;
        
        expect(memoryIncreasePercentage).toBeLessThan(50); // Less than 50% increase
      }

      unmount();
    });
  });

  describe('Concurrent Operations Performance', () => {
    it('should handle multiple concurrent operations efficiently', async () => {
      const { getRenderCount } = renderWithTracking(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const initialRenders = getRenderCount();

      // Trigger multiple operations simultaneously
      await Promise.all([
        userEvent.type(screen.getByTestId('search-input'), 'test'),
        fireEvent.click(screen.getByTestId('next-page')),
        fireEvent.click(screen.getByTestId('time-range'))
      ]);

      await waitForStableState(() => getRenderCount(), 2000);

      const totalRenders = getRenderCount() - initialRenders;
      
      // Should batch updates efficiently even with concurrent operations
      expect(totalRenders).toBeLessThan(10);
    });
  });

  describe('Large Dataset Performance', () => {
    it('should handle large container lists efficiently', async () => {
      // Mock large dataset
      mockApiService.listContainers.mockResolvedValue({
        containers: Array.from({ length: 1000 }, (_, i) => ({
          id: i + 1,
          name: `Container ${i + 1}`,
          type: (i % 2 === 0 ? 'physical' : 'virtual') as const,
          tenant_id: (i % 5) + 1,
          purpose: ['storage', 'processing', 'distribution'][i % 3],
          location: { city: 'NYC', country: 'USA', address: `${i} Main St` },
          status: ['active', 'inactive', 'maintenance'][i % 3] as any,
          created_at: new Date(2024, 0, 1, 0, 0, i).toISOString(),
          updated_at: new Date(2024, 0, 1, 0, 0, i).toISOString(),
          alerts: i % 10 === 0 ? [{ id: i, message: 'Alert' }] : [],
          notes: `Notes for container ${i}`,
          shadow_service_enabled: i % 3 === 0,
          ecosystem_connected: i % 4 === 0
        })),
        pagination: { page: 1, limit: 1000, total: 10000, total_pages: 10 }
      });

      const startTime = performance.now();

      render(<ContainerManagement />);

      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });

      const renderTime = performance.now() - startTime;

      // Should render large datasets within reasonable time
      expect(renderTime).toBeLessThan(2000); // 2 seconds max
      expect(screen.getByText('1000 containers')).toBeInTheDocument();
    });
  });

  describe('Performance Regression Prevention', () => {
    it('should maintain performance benchmarks across component lifecycle', async () => {
      const benchmarks = {
        initialLoad: 0,
        pagination: 0,
        filtering: 0,
        timeRangeChange: 0
      };

      // Measure initial load
      const loadStart = performance.now();
      render(<ContainerManagement />);
      await waitFor(() => {
        expect(screen.getByTestId('container-table')).toBeInTheDocument();
      });
      benchmarks.initialLoad = performance.now() - loadStart;

      // Measure pagination
      const paginationStart = performance.now();
      fireEvent.click(screen.getByTestId('next-page'));
      await waitFor(() => {
        expect(mockApiService.listContainers).toHaveBeenCalledTimes(2);
      });
      benchmarks.pagination = performance.now() - paginationStart;

      // Measure filtering
      const filterStart = performance.now();
      await userEvent.type(screen.getByTestId('search-input'), 'test');
      await waitFor(() => {
        expect(mockApiService.listContainers).toHaveBeenLastCalledWith(
          expect.objectContaining({ search: 'test' })
        );
      });
      benchmarks.filtering = performance.now() - filterStart;

      // Measure time range change
      const timeRangeStart = performance.now();
      fireEvent.click(screen.getByTestId('time-range'));
      await waitFor(() => {
        expect(mockApiService.getPerformanceMetrics).toHaveBeenCalledTimes(2);
      });
      benchmarks.timeRangeChange = performance.now() - timeRangeStart;

      // Log benchmarks for tracking
      console.log('Performance Benchmarks:', benchmarks);

      // Assert performance thresholds
      expect(benchmarks.initialLoad).toBeLessThan(1000);
      expect(benchmarks.pagination).toBeLessThan(500);
      expect(benchmarks.filtering).toBeLessThan(300);
      expect(benchmarks.timeRangeChange).toBeLessThan(300);
    });
  });
});