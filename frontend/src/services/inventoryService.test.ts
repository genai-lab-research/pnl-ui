import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import inventoryService from './inventoryService';
import config from './config';
import { server } from '../test/mocks/server';
import {
  NurseryStationData,
  CultivationAreaData,
  TrayCreate,
  TrayResponse,
  PanelCreate,
  PanelResponse,
  CropHistory,
} from '../shared/types/inventory';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('InventoryService', () => {
  beforeAll(() => {
    // Close the MSW server for these tests since we want to mock fetch directly
    server.close();
  });

  afterAll(() => {
    // Restart MSW server after tests
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
    // Reset config to enable real API calls (disable mock fallback)
    vi.spyOn(config.api, 'enableMockFallback', 'get').mockReturnValue(false);
    vi.spyOn(config.api, 'isDevelopment', 'get').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getNurseryStationData', () => {
    it('should fetch nursery station data successfully', async () => {
      const mockResponse: NurseryStationData = {
        utilization_percentage: 75,
        upper_shelf: {
          slots: [
            {
              slot_number: 1,
              occupied: true,
              tray: {
                id: "TR-10-595383-3131",
                utilization_percentage: 85,
                crop_count: 170,
                utilization_level: "high",
                rfid_tag: "A1B2C3D4",
                crops: [
                  {
                    id: "crop-001",
                    seed_type: "Someroots",
                    row: 5,
                    column: 10,
                    age_days: 14,
                    seeded_date: "2025-01-15",
                    planned_transplanting_date: "2025-02-05",
                    overdue_days: 0,
                    health_status: "healthy",
                    size: "medium"
                  }
                ]
              }
            }
          ]
        },
        lower_shelf: {
          slots: []
        },
        off_shelf_trays: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.getNurseryStationData('container-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/containers/container-123/inventory/nursery'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch nursery station data with date parameter', async () => {
      const mockResponse: NurseryStationData = {
        utilization_percentage: 50,
        upper_shelf: { slots: [] },
        lower_shelf: { slots: [] },
        off_shelf_trays: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.getNurseryStationData('container-123', '2025-01-30T10:30:00Z');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('date=2025-01-30T10%3A30%3A00Z'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Container not found',
      } as Response);

      await expect(
        inventoryService.getNurseryStationData('invalid-container')
      ).rejects.toThrow('API request failed: 404 Not Found. Container not found');
    });
  });

  describe('getCultivationAreaData', () => {
    it('should fetch cultivation area data successfully', async () => {
      const mockResponse: CultivationAreaData = {
        utilization_percentage: 90,
        walls: [
          {
            wall_number: 1,
            name: "Wall 1",
            slots: [
              {
                slot_number: 1,
                occupied: true,
                panel: {
                  id: "PN-10-662850-5223",
                  utilization_percentage: 75,
                  crop_count: 45,
                  utilization_level: "high",
                  rfid_tag: "J9K0L1M2",
                  channels: [
                    {
                      channel_number: 1,
                      crops: [
                        {
                          id: "crop-101",
                          seed_type: "Basil",
                          channel: 1,
                          position: 25,
                          age_days: 28,
                          seeded_date: "2025-01-01",
                          transplanted_date: "2025-01-15",
                          planned_harvesting_date: "2025-03-01",
                          overdue_days: 0,
                          health_status: "healthy",
                          size: "large"
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        ],
        overflow_panels: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.getCultivationAreaData('container-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/containers/container-123/inventory/cultivation'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors with proper error message', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(
        inventoryService.getCultivationAreaData('container-123')
      ).rejects.toThrow('Network error: Unable to connect to the API server. Please check if the backend is running.');
    });
  });

  describe('provisionTray', () => {
    it('should provision a new tray successfully', async () => {
      const trayData: TrayCreate = {
        rfid_tag: 'A1B2C3D4',
        location: { shelf: 'upper', slot_number: 5 }
      };

      const mockResponse: TrayResponse = {
        id: "TR-10-595383-3133",
        rfid_tag: "A1B2C3D4",
        location: { shelf: "upper", slot_number: 5 },
        provisioned_at: "2025-01-30T10:30:00Z",
        status: "available"
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.provisionTray('container-123', trayData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/containers/container-123/inventory/trays'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(trayData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation errors', async () => {
      const invalidTrayData: TrayCreate = {
        rfid_tag: '',
        location: { shelf: 'upper', slot_number: 0 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: async () => 'Invalid tray data: RFID tag cannot be empty',
      } as Response);

      await expect(
        inventoryService.provisionTray('container-123', invalidTrayData)
      ).rejects.toThrow('API request failed: 400 Bad Request. Invalid tray data: RFID tag cannot be empty');
    });
  });

  describe('provisionPanel', () => {
    it('should provision a new panel successfully', async () => {
      const panelData: PanelCreate = {
        rfid_tag: 'J9K0L1M2',
        location: { wall: 'wall_1', slot_number: 15 }
      };

      const mockResponse: PanelResponse = {
        id: "PN-10-662850-5225",
        rfid_tag: "J9K0L1M2",
        location: { wall: "wall_1", slot_number: 15 },
        provisioned_at: "2025-01-30T10:30:00Z",
        status: "available"
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.provisionPanel('container-123', panelData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/containers/container-123/inventory/panels'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(panelData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCropHistory', () => {
    it('should fetch crop history successfully', async () => {
      const mockResponse: CropHistory = {
        crop_id: "crop-001",
        history: [
          {
            date: "2025-01-15",
            event: "seeded",
            location: {
              type: "tray",
              tray_id: "TR-10-595383-3131",
              row: 5,
              column: 10
            },
            health_status: "healthy",
            size: "small",
            notes: "Initial seeding"
          },
          {
            date: "2025-01-22",
            event: "growth_update",
            location: {
              type: "tray",
              tray_id: "TR-10-595383-3131",
              row: 5,
              column: 10
            },
            health_status: "healthy",
            size: "medium",
            notes: "Normal growth progression"
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.getCropHistory('container-123', 'crop-001');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/containers/container-123/crops/crop-001/history'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch crop history with date range', async () => {
      const mockResponse: CropHistory = {
        crop_id: "crop-001",
        history: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const result = await inventoryService.getCropHistory(
        'container-123',
        'crop-001',
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/start_date=2025-01-01T00%3A00%3A00Z.*end_date=2025-01-31T23%3A59%3A59Z/),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling and timeout', () => {
    it('should handle timeout errors', async () => {
      // Mock AbortController to simulate timeout
      const mockAbortController = {
        signal: { aborted: false },
        abort: vi.fn()
      };
      
      global.AbortController = vi.fn(() => mockAbortController) as any;
      
      mockFetch.mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));

      await expect(
        inventoryService.getNurseryStationData('container-123')
      ).rejects.toThrow();
    });

    it('should handle empty responses for DELETE operations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({}),
      } as Response);

      // This would be for a hypothetical delete operation
      const result = await inventoryService.getNurseryStationData('container-123');
      
      // For 204 status, we expect an empty object
      expect(result).toEqual({});
    });
  });

  describe('URL construction', () => {
    it('should construct URLs correctly without query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ utilization_percentage: 0, upper_shelf: { slots: [] }, lower_shelf: { slots: [] }, off_shelf_trays: [] }),
      } as Response);

      await inventoryService.getNurseryStationData('test-container');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/containers\/test-container\/inventory\/nursery$/),
        expect.any(Object)
      );
    });

    it('should construct URLs correctly with query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ crop_id: 'test', history: [] }),
      } as Response);

      await inventoryService.getCropHistory('test-container', 'test-crop', '2025-01-01', '2025-01-31');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/start_date=2025-01-01.*end_date=2025-01-31/),
        expect.any(Object)
      );
    });
  });
});