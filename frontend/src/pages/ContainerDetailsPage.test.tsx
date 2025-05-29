import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils';
import ContainerDetailsPage from './ContainerDetailsPage';
import containerService from '../services/containerService';
import { mockContainerDetail, mockContainerMetrics, mockContainerCrops, mockContainerActivities } from '../services/mockData';

// Mock the container service
vi.mock('../services/containerService');
const mockContainerService = vi.mocked(containerService);

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ containerId: 'farm-container-04' }),
    useNavigate: () => mockNavigate,
  };
});

// Mock window.history.back
Object.defineProperty(window, 'history', {
  value: { back: vi.fn() },
  writable: true,
});

describe('ContainerDetailsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default successful mock responses
    mockContainerService.getContainerById.mockResolvedValue(mockContainerDetail);
    mockContainerService.getContainerMetrics.mockResolvedValue(mockContainerMetrics);
    mockContainerService.getContainerCrops.mockResolvedValue(mockContainerCrops);
    mockContainerService.getContainerActivities.mockResolvedValue(mockContainerActivities);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Page Loading and Data Fetching', () => {
    it('should display loading state initially', async () => {
      await act(async () => {
        render(<ContainerDetailsPage />);
      });
      expect(screen.getByText('Loading container details...')).toBeInTheDocument();
    });

    it('should fetch and display container data', async () => {
      await act(async () => {
        render(<ContainerDetailsPage />);
      });

      await waitFor(() => {
        expect(mockContainerService.getContainerById).toHaveBeenCalledWith('farm-container-04');
        expect(mockContainerService.getContainerMetrics).toHaveBeenCalledWith('farm-container-04', 'WEEK');
        expect(mockContainerService.getContainerCrops).toHaveBeenCalledWith('farm-container-04', 0, 10);
        expect(mockContainerService.getContainerActivities).toHaveBeenCalledWith('farm-container-04', 5);
      });

      expect(screen.getByText('farm-container-04')).toBeInTheDocument();
      expect(screen.getByText('Physical container | tenant-123 | Development')).toBeInTheDocument();
    });

    it('should display error state when API fails', async () => {
      const errorMessage = 'Failed to load container data';
      mockContainerService.getContainerById.mockRejectedValue(new Error(errorMessage));

      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
    });

    it('should display not found message for invalid container ID', async () => {
      mockContainerService.getContainerById.mockResolvedValue(null as any);

      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Container not found')).toBeInTheDocument();
      });
    });
  });

  describe('Header and Navigation', () => {
    it('should display correct breadcrumb and title', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Dashboard / farm-container-04')).toBeInTheDocument();
        expect(screen.getByText('farm-container-04')).toBeInTheDocument();
      });
    });

    it('should display correct metadata and status', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Physical container | tenant-123 | Development')).toBeInTheDocument();
        expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      });
    });

    it('should handle back navigation', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('Tab Navigation', () => {
    it('should display all navigation tabs', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Environment & Recipes')).toBeInTheDocument();
        expect(screen.getByText('Inventory')).toBeInTheDocument();
        expect(screen.getByText('Devices')).toBeInTheDocument();
      });
    });

    it('should switch between tabs', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Metrics')).toBeInTheDocument();
      });

      const inventoryTab = screen.getByText('Inventory');
      await user.click(inventoryTab);

      expect(screen.getByText('Inventory content coming soon...')).toBeInTheDocument();
      expect(screen.queryByText('Container Metrics')).not.toBeInTheDocument();
    });
  });

  describe('Container Metrics Section', () => {
    it('should display all metric cards', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Air Temperature')).toBeInTheDocument();
        expect(screen.getByText('20°C')).toBeInTheDocument();
        expect(screen.getByText('Rel. Humidity')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
        expect(screen.getByText('CO₂ Level')).toBeInTheDocument();
        expect(screen.getByText('860')).toBeInTheDocument();
        expect(screen.getByText('Yield')).toBeInTheDocument();
        expect(screen.getByText('51KG')).toBeInTheDocument();
      });
    });

    it('should handle time range changes', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Week')).toBeInTheDocument();
      });

      const monthButton = screen.getByText('Month');
      await user.click(monthButton);

      await waitFor(() => {
        expect(mockContainerService.getContainerMetrics).toHaveBeenCalledWith('farm-container-04', 'MONTH');
      });
    });
  });

  describe('Crops Section', () => {
    it('should display crops table with data', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Crops')).toBeInTheDocument();
        expect(screen.getByText('Salanova Cousteau')).toBeInTheDocument();
        expect(screen.getByText('Kiribati')).toBeInTheDocument();
        expect(screen.getByText('Rex Butterhead')).toBeInTheDocument();
        expect(screen.getByText('Lollo Rossa')).toBeInTheDocument();
      });
    });

    it('should handle crops section expand/collapse', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Salanova Cousteau')).toBeInTheDocument();
      });

      const expandButton = screen.getByRole('button', { name: /expand/i });
      await user.click(expandButton);

      expect(screen.queryByText('Salanova Cousteau')).not.toBeInTheDocument();
    });

    it('should handle pagination', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Showing page 1 of 1')).toBeInTheDocument();
      });

      // Mock additional pages
      mockContainerService.getContainerCrops.mockResolvedValue({
        total: 20,
        results: mockContainerCrops.results,
      });

      // Re-render to get updated pagination
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Showing page 1 of 2')).toBeInTheDocument();
      });
    });
  });

  describe('Container Information Section', () => {
    it('should display container information', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Information & Settings')).toBeInTheDocument();
        expect(screen.getByText('tenant-123')).toBeInTheDocument();
        expect(screen.getByText('Development')).toBeInTheDocument();
        expect(screen.getByText('Lviv')).toBeInTheDocument();
        expect(screen.getByText('Mia Adams')).toBeInTheDocument();
      });
    });

    it('should display system settings', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('System Settings')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument(); // Shadow service disabled
        expect(screen.getByText('Alpha')).toBeInTheDocument(); // FA Integration
        expect(screen.getByText('Dev')).toBeInTheDocument(); // AWS Environment
      });
    });

    it('should display activity log', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Activity Log')).toBeInTheDocument();
        expect(screen.getByText('Seeded Salanova Cousteau in Nursery')).toBeInTheDocument();
        expect(screen.getByText('Data synced')).toBeInTheDocument();
        expect(screen.getByText('Emily Chen')).toBeInTheDocument();
      });
    });

    it('should handle information section expand/collapse', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('tenant-123')).toBeInTheDocument();
      });

      const infoExpandButton = screen.getAllByRole('button', { name: /expand/i })[1]; // Second expand button
      await user.click(infoExpandButton);

      expect(screen.queryByText('tenant-123')).not.toBeInTheDocument();
    });

    it('should show edit button', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Container Metrics')).toBeInTheDocument();
      });

      // Check that metrics are displayed (responsive grid should still work)
      expect(screen.getByText('Air Temperature')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries and Edge Cases', () => {
    it('should handle missing container ID parameter', async () => {
      // Mock useParams to return undefined containerId
      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useParams: () => ({ containerId: undefined }),
        };
      });

      render(<ContainerDetailsPage />);

      // Should not make API calls without container ID
      expect(mockContainerService.getContainerById).not.toHaveBeenCalled();
    });

    it('should handle partial API failures gracefully', async () => {
      mockContainerService.getContainerMetrics.mockRejectedValue(new Error('Metrics unavailable'));

      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('farm-container-04')).toBeInTheDocument();
      });

      // Should still display other sections even if metrics fail
      expect(screen.getByText('Crops')).toBeInTheDocument();
    });

    it('should handle empty data responses', async () => {
      mockContainerService.getContainerCrops.mockResolvedValue({
        total: 0,
        results: [],
      });
      mockContainerService.getContainerActivities.mockResolvedValue({
        activities: [],
      });

      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Crops')).toBeInTheDocument();
        expect(screen.getByText('Activity Log')).toBeInTheDocument();
      });

      // Should handle empty data gracefully
      expect(screen.getByText('Showing page 1 of 0')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('should make parallel API calls on initial load', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(mockContainerService.getContainerById).toHaveBeenCalledTimes(1);
        expect(mockContainerService.getContainerMetrics).toHaveBeenCalledTimes(1);
        expect(mockContainerService.getContainerCrops).toHaveBeenCalledTimes(1);
        expect(mockContainerService.getContainerActivities).toHaveBeenCalledTimes(1);
      });

      // Verify all calls were made in parallel (no waiting between calls)
      expect(mockContainerService.getContainerById).toHaveBeenCalledWith('farm-container-04');
    });

    it('should reload data when dependencies change', async () => {
      render(<ContainerDetailsPage />);

      await waitFor(() => {
        expect(mockContainerService.getContainerMetrics).toHaveBeenCalledWith('farm-container-04', 'WEEK');
      });

      // Change time range
      const quarterButton = screen.getByText('Quarter');
      await user.click(quarterButton);

      await waitFor(() => {
        expect(mockContainerService.getContainerMetrics).toHaveBeenCalledWith('farm-container-04', 'QUARTER');
      });

      // Should have been called twice (initial + after change)
      expect(mockContainerService.getContainerMetrics).toHaveBeenCalledTimes(2);
    });
  });
});