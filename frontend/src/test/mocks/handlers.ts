import { http, HttpResponse } from 'msw';
import { mockContainerDetail, mockContainerMetrics, mockContainerCrops, mockContainerActivities } from '../../services/mockData';
import config from '../../services/config';

const baseUrl = config.api.baseUrl;

export const handlers = [
  // Backend docs endpoint
  http.get('http://localhost:8000/docs', () => {
    return new HttpResponse(
      `<!DOCTYPE html>
<html>
<head>
<title>API Documentation</title>
</head>
<body>
<div id="swagger-ui"></div>
</body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }),

  // Backend OpenAPI spec
  http.get('http://localhost:8000/openapi.json', () => {
    return HttpResponse.json({
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {
        '/api/v1/containers': {
          get: {
            summary: 'Get containers',
          },
        },
      },
    });
  }),

  // Backend root endpoint
  http.get('http://localhost:8000/', () => {
    return HttpResponse.json({
      app: 'Vertical Farming Control Panel API',
      version: '0.1.0',
      status: 'running',
      docs: '/docs',
    });
  }),

  // Health check endpoint
  http.get(`http://localhost:8000/api/v1/health`, () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // CORS preflight OPTIONS request
  http.options(`http://localhost:8000/api/v1/containers`, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }),

  // Invalid endpoint handler
  http.get(`http://localhost:8000/api/v1/invalid-endpoint`, () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // Get container by ID
  http.get(`${baseUrl}/containers/:containerId`, ({ params }) => {
    const { containerId } = params;
    
    if (containerId === 'farm-container-04') {
      return HttpResponse.json(mockContainerDetail);
    }
    
    if (containerId === 'not-found') {
      return new HttpResponse(null, { status: 404 });
    }

    // Handle stats endpoint separately
    if (containerId === 'stats') {
      return HttpResponse.json({
        physical_count: 12,
        virtual_count: 8
      });
    }
    
    // Return dashboard format for individual containers
    const containerMap: Record<string, any> = {
      'container-1': {
        id: 'container-1',
        name: 'Physical Container Alpha',
        type: 'PHYSICAL',
        tenant_name: 'Acme Corp',
        purpose: 'Production',
        location_city: 'New York',
        location_country: 'USA',
        status: 'ACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: true
      },
      'container-2': {
        id: 'container-2',
        name: 'Virtual Container Beta',
        type: 'VIRTUAL',
        tenant_name: 'TechStart Inc',
        purpose: 'Development',
        location_city: 'San Francisco',
        location_country: 'USA',
        status: 'ACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: false
      },
      'container-3': {
        id: 'container-3',
        name: 'Physical Container Gamma',
        type: 'PHYSICAL',
        tenant_name: 'GreenGrow Ltd',
        purpose: 'Research',
        location_city: 'Boston',
        location_country: 'USA',
        status: 'MAINTENANCE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: false
      }
    };

    const container = containerMap[containerId as string];
    if (container) {
      return HttpResponse.json(container);
    }
    
    // Default fallback - convert to dashboard format
    return HttpResponse.json({
      id: containerId as string,
      name: `Container ${containerId}`,
      type: 'PHYSICAL',
      tenant_name: 'Default Tenant',
      purpose: 'Development',
      location_city: 'Unknown',
      location_country: 'Unknown',
      status: 'ACTIVE',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      has_alerts: false
    });
  }),

  // Get container metrics
  http.get(`${baseUrl}/containers/:containerId/metrics`, ({ request, params }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('time_range') || 'WEEK';
    
    // Simulate different data based on time range
    const metrics = {
      ...mockContainerMetrics,
      // Modify values based on time range for testing
      temperature: {
        ...mockContainerMetrics.temperature,
        current: timeRange === 'MONTH' ? 22 : mockContainerMetrics.temperature.current,
      },
    };
    
    return HttpResponse.json(metrics);
  }),

  // Get container crops
  http.get(`${baseUrl}/containers/:containerId/crops`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const pageSize = parseInt(url.searchParams.get('page_size') || '10');
    const seedType = url.searchParams.get('seed_type');
    
    let results = mockContainerCrops.results;
    
    // Filter by seed type if provided
    if (seedType) {
      results = results.filter(crop => 
        crop.seed_type.toLowerCase().includes(seedType.toLowerCase())
      );
    }
    
    // Paginate results
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      total: results.length,
      results: paginatedResults,
    });
  }),

  // Get container activities
  http.get(`${baseUrl}/containers/:containerId/activities`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');
    
    const limitedActivities = mockContainerActivities.activities.slice(0, limit);
    
    return HttpResponse.json({
      activities: limitedActivities,
    });
  }),

  // Get all containers (dashboard format)
  http.get(`${baseUrl}/containers`, ({ request }) => {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const name = url.searchParams.get('name');
    const tenant_id = url.searchParams.get('tenant_id');
    const type = url.searchParams.get('type');
    const purpose = url.searchParams.get('purpose');
    const status = url.searchParams.get('status');
    const has_alerts = url.searchParams.get('has_alerts');
    const location = url.searchParams.get('location');
    
    // Create mock containers in dashboard format
    const baseContainers = [
      {
        id: 'container-1',
        name: 'Physical Container Alpha',
        type: 'PHYSICAL',
        tenant_name: 'Acme Corp',
        purpose: 'Production',
        location_city: 'New York',
        location_country: 'USA',
        status: 'ACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: true
      },
      {
        id: 'container-2',
        name: 'Virtual Container Beta',
        type: 'VIRTUAL',
        tenant_name: 'TechStart Inc',
        purpose: 'Development',
        location_city: 'San Francisco',
        location_country: 'USA',
        status: 'ACTIVE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: false
      },
      {
        id: 'container-3',
        name: 'Physical Container Gamma',
        type: 'PHYSICAL',
        tenant_name: 'GreenGrow Ltd',
        purpose: 'Research',
        location_city: 'Boston',
        location_country: 'USA',
        status: 'MAINTENANCE',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        has_alerts: false
      }
    ];
    
    // Apply filters
    let filteredContainers = baseContainers;
    
    if (name) {
      filteredContainers = filteredContainers.filter(c => 
        c.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (tenant_id) {
      // Mock tenant mapping
      const tenantMap: Record<string, string> = {
        '1': 'Acme Corp',
        '2': 'TechStart Inc',
        '3': 'GreenGrow Ltd'
      };
      const tenantName = tenantMap[tenant_id];
      if (tenantName) {
        filteredContainers = filteredContainers.filter(c => c.tenant_name === tenantName);
      }
    }
    
    if (type) {
      filteredContainers = filteredContainers.filter(c => c.type === type);
    }
    
    if (purpose) {
      filteredContainers = filteredContainers.filter(c => c.purpose === purpose);
    }
    
    if (status) {
      filteredContainers = filteredContainers.filter(c => c.status === status);
    }
    
    if (has_alerts === 'true') {
      filteredContainers = filteredContainers.filter(c => c.has_alerts === true);
    } else if (has_alerts === 'false') {
      filteredContainers = filteredContainers.filter(c => c.has_alerts === false);
    }
    
    if (location) {
      filteredContainers = filteredContainers.filter(c => 
        c.location_city?.toLowerCase().includes(location.toLowerCase()) ||
        c.location_country?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Paginate results
    const paginatedContainers = filteredContainers.slice(skip, skip + limit);
    
    return HttpResponse.json({
      total: filteredContainers.length,
      results: paginatedContainers,
    });
  }),


  // Update container
  http.put(`${baseUrl}/containers/:containerId`, async ({ request, params }) => {
    const updateData = await request.json() as any;
    const { containerId } = params;
    
    if (containerId === 'not-found') {
      return new HttpResponse(null, { status: 404 });
    }
    
    const updatedContainer = {
      ...mockContainerDetail,
      ...updateData,
      id: containerId as string,
      modified: new Date().toISOString(),
    };
    
    return HttpResponse.json(updatedContainer);
  }),

  // Delete container
  http.delete(`${baseUrl}/containers/:containerId`, ({ params }) => {
    const { containerId } = params;
    
    if (containerId === 'not-found') {
      return new HttpResponse(null, { status: 404 });
    }
    
    if (containerId === 'forbidden') {
      return new HttpResponse('Permission denied', { status: 403 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Error simulation endpoints
  http.get(`${baseUrl}/containers/timeout-test`, () => {
    // Simulate a timeout by not responding
    return new Promise(() => {});
  }),

  http.get(`${baseUrl}/containers/server-error`, () => {
    return new HttpResponse('Internal Server Error', { status: 500 });
  }),

  http.get(`${baseUrl}/containers/network-error`, () => {
    return HttpResponse.error();
  }),

  // Dashboard specific endpoints

  // Get container statistics
  http.get(`${baseUrl}/containers/stats`, () => {
    return HttpResponse.json({
      physical_count: 12,
      virtual_count: 8
    });
  }),

  // Shutdown container
  http.post(`${baseUrl}/containers/:containerId/shutdown`, ({ params }) => {
    const { containerId } = params;
    
    if (containerId === 'not-found') {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json({
      id: containerId as string,
      name: `Container ${containerId}`,
      type: 'PHYSICAL',
      tenant_name: 'Acme Corp',
      purpose: 'Production',
      location_city: 'New York',
      location_country: 'USA',
      status: 'INACTIVE',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
      has_alerts: false
    });
  }),

  // Get container metrics (dashboard format)
  http.get(`${baseUrl}/metrics/container/:containerId`, ({ request, params }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('time_range') || 'WEEK';
    const startDate = url.searchParams.get('start_date');
    
    const baseMetrics = {
      yield_data: [
        { date: '2024-01-01', value: 25 },
        { date: '2024-01-02', value: 30 },
        { date: '2024-01-03', value: 22 },
        { date: '2024-01-04', value: 28 },
        { date: '2024-01-05', value: 35 },
        { date: '2024-01-06', value: 27 },
        { date: '2024-01-07', value: 32 }
      ],
      space_utilization_data: [
        { date: '2024-01-01', value: 75 },
        { date: '2024-01-02', value: 80 },
        { date: '2024-01-03', value: 72 },
        { date: '2024-01-04', value: 78 },
        { date: '2024-01-05', value: 85 },
        { date: '2024-01-06', value: 77 },
        { date: '2024-01-07', value: 82 }
      ],
      average_yield: 28.4,
      total_yield: 199,
      average_space_utilization: 78.4,
      current_temperature: 22.5,
      current_humidity: 65,
      current_co2: 850,
      crop_counts: {
        seeded: 150,
        transplanted: 120,
        harvested: 80
      },
      is_daily: true
    };

    // Modify data based on time range
    if (timeRange === 'MONTH') {
      baseMetrics.yield_data = Array.from({ length: 30 }, (_, i) => ({
        date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
        value: Math.floor(Math.random() * 40) + 20
      }));
      baseMetrics.space_utilization_data = Array.from({ length: 30 }, (_, i) => ({
        date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
        value: Math.floor(Math.random() * 30) + 60
      }));
      baseMetrics.is_daily = false;
    }
    
    return HttpResponse.json(baseMetrics);
  }),

  // Get performance overview
  http.get(`${baseUrl}/performance`, ({ request }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('time_range') || 'WEEK';
    
    return HttpResponse.json({
      physical: {
        count: 12,
        yield: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [25, 20, 24, 18, 23, 19, 22],
          avgYield: 63,
          totalYield: 81
        },
        spaceUtilization: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [80, 75, 83, 76, 82, 70, 75],
          avgUtilization: 80
        }
      },
      virtual: {
        count: 8,
        yield: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [22, 19, 23, 18, 21, 17, 20],
          avgYield: 63,
          totalYield: 81
        },
        spaceUtilization: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [65, 60, 68, 62, 66, 59, 64],
          avgUtilization: 80
        }
      }
    });
  }),

  // Get tenants (updated for page 2 format)
  http.get(`${baseUrl}/tenants`, () => {
    return HttpResponse.json({
      total: 5,
      results: [
        { id: 'tenant-001', name: 'Skybridge Farms' },
        { id: 'tenant-002', name: 'EcoGrow Solutions' },
        { id: 'tenant-003', name: 'UrbanLeaf Inc.' },
        { id: 'tenant-004', name: 'AgroTech Research' },
        { id: 'tenant-005', name: 'FarmFusion Labs' }
      ]
    });
  }),

  // Get seed types (page 2 endpoints)
  http.get(`${baseUrl}/seed-types`, () => {
    return HttpResponse.json([
      { id: 'seed-001', name: 'Someroots', variety: 'Standard', supplier: 'BioCrop' },
      { id: 'seed-002', name: 'Sunflower', variety: 'Giant', supplier: 'SeedPro' },
      { id: 'seed-003', name: 'Basil', variety: 'Sweet', supplier: 'HerbGarden' },
      { id: 'seed-004', name: 'Lettuce', variety: 'Romaine', supplier: 'GreenLeaf' },
      { id: 'seed-005', name: 'Kale', variety: 'Curly', supplier: 'Nutrifoods' },
      { id: 'seed-006', name: 'Spinach', variety: 'Baby', supplier: 'GreenLeaf' },
      { id: 'seed-007', name: 'Arugula', variety: 'Wild', supplier: 'HerbGarden' },
      { id: 'seed-008', name: 'Microgreens', variety: 'Mixed', supplier: 'SproutLife' }
    ]);
  }),

  // Get metrics performance overview (missing endpoint)
  http.get(`${baseUrl}/metrics/performance`, ({ request }) => {
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('time_range') || 'WEEK';
    
    return HttpResponse.json({
      physical: {
        count: 12,
        yield: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [25, 20, 24, 18, 23, 19, 22],
          avgYield: 63,
          totalYield: 81
        },
        spaceUtilization: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [80, 75, 83, 76, 82, 70, 75],
          avgUtilization: 80
        }
      },
      virtual: {
        count: 8,
        yield: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [22, 19, 23, 18, 21, 17, 20],
          avgYield: 63,
          totalYield: 81
        },
        spaceUtilization: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [65, 60, 68, 62, 66, 59, 64],
          avgUtilization: 80
        }
      }
    });
  }),

  // Create container (page 2 format) - override the existing one for form data
  http.post(`${baseUrl}/containers`, async ({ request }) => {
    const containerData = await request.json() as any;
    
    // Check if this is page 2 form data format
    if (containerData.seed_types && Array.isArray(containerData.seed_types)) {
      // Page 2 format response
      return HttpResponse.json({
        id: 'container-123',
        name: containerData.name || 'farm-container-04',
        type: (containerData.type === 'physical' || containerData.type === 'PHYSICAL') ? 'PHYSICAL' : 'VIRTUAL',
        tenant_name: 'Skybridge Farms',
        purpose: containerData.purpose || 'Production',
        location_city: 'Lviv',
        location_country: 'Ukraine',
        status: 'CREATED',
        created_at: '2023-07-25T10:30:00Z',
        updated_at: '2023-07-25T10:30:00Z',
        has_alerts: false,
        shadow_service_enabled: containerData.shadow_service_enabled || false,
        ecosystem_connected: containerData.connect_to_other_systems || false
      }, { status: 201 });
    }
    
    // Original format for backwards compatibility
    const newContainer = {
      ...containerData,
      id: `new-container-${Date.now()}`,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    return HttpResponse.json(newContainer, { status: 201 });
  }),
];