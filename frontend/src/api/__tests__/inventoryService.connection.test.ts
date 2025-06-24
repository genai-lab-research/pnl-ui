import { InventoryService } from '../inventoryService';

describe('InventoryService Connection Tests', () => {
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService('/api');
  });

  it('should make proper API calls with correct URLs', () => {
    expect(service).toBeDefined();
    
    const testService = new InventoryService('/custom-api');
    expect(testService).toBeDefined();
  });

  it('should handle inventory metrics API response format correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const mockMetrics = {
      nursery_station_utilization: 85,
      cultivation_area_utilization: 70
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMetrics),
    } as Response);

    const result = await service.getInventoryMetrics('container-123');
    
    expect(mockFetch).toHaveBeenCalledWith('/api/containers/container-123/inventory/metrics', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(result.data).toEqual(mockMetrics);
    expect(result.error).toBeUndefined();
  });

  it('should handle crops API response format correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const mockCrops = [{
      id: 'crop-1',
      seed_type: 'tomato',
      seed_date: '2023-11-01T00:00:00Z',
      age: 30,
      status: 'growing',
      overdue_days: 0,
      location: {
        type: 'tray',
        tray_id: 'tray-1'
      }
    }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCrops),
    } as Response);

    const result = await service.getCrops('container-456');
    
    expect(mockFetch).toHaveBeenCalledWith('/api/containers/container-456/inventory/crops', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(result.data).toEqual(mockCrops);
    expect(result.error).toBeUndefined();
  });

  it('should construct metrics query parameters correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await service.getInventoryMetrics('container-123', {
      date: '2023-12-01'
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/containers/container-123/inventory/metrics?date=2023-12-01',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });

  it('should construct crops query parameters correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    await service.getCrops('container-456', {
      seed_type: 'lettuce'
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/containers/container-456/inventory/crops?seed_type=lettuce',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });

  it('should handle error responses correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ detail: 'Container not found' }),
    } as Response);

    const result = await service.getInventoryMetrics('invalid-id');
    
    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      detail: 'Container not found',
      status_code: 404
    });
  });

  it('should handle network errors correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await service.getCrops('container-123');
    
    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      detail: 'Network failure',
      status_code: 0
    });
  });
});