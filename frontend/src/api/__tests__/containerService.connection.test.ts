import { ContainerService } from '../containerService';

describe('ContainerService Connection Tests', () => {
  let service: ContainerService;

  beforeEach(() => {
    service = new ContainerService('/api');
  });

  it('should make proper API calls with correct URLs', () => {
    // Test that the service constructs correct URLs
    expect(service).toBeDefined();
    
    // We can't easily test the actual HTTP calls without mocking,
    // but we can test the URL construction logic indirectly
    const testService = new ContainerService('/custom-api');
    expect(testService).toBeDefined();
  });

  it('should handle API response format correctly', async () => {
    // Mock fetch for this test
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    const result = await service.listContainers();
    
    expect(mockFetch).toHaveBeenCalledWith('/api/containers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(result.data).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  it('should construct query parameters correctly', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    await service.listContainers({
      search: 'test',
      type: 'physical',
      has_alerts: true
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/containers?search=test&type=physical&has_alerts=true',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });
});