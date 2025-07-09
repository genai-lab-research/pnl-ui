import { cropMeasurementsService } from '../cropMeasurementsService';
import { TokenStorage } from '../../utils/tokenStorage';
import { 
  CropMeasurements, 
  CropMeasurementsCreateRequest 
} from '../../types/recipe';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

describe('CropMeasurementsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockTokenStorage.getAccessToken.mockReturnValue('mock-token');
  });

  const mockMeasurements: CropMeasurements = {
    id: 1,
    radius: 5.5,
    width: 10.0,
    height: 8.0,
    area: 80.0,
    area_estimated: 85.0,
    weight: 150.5
  };

  describe('createCropMeasurements', () => {
    it('should create crop measurements successfully', async () => {
      const createRequest: CropMeasurementsCreateRequest = {
        radius: 5.5,
        width: 10.0,
        height: 8.0,
        area: 80.0,
        area_estimated: 85.0,
        weight: 150.5
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMeasurements)
      } as Response);

      const result = await cropMeasurementsService.createCropMeasurements(createRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crop-measurements/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(createRequest),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result).toEqual(mockMeasurements);
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: 'Invalid measurements data' })
      } as Response);

      const invalidRequest = {
        radius: -1,
        width: -1
      };

      await expect(cropMeasurementsService.createCropMeasurements(invalidRequest))
        .rejects.toThrow('Invalid measurements data');
    });
  });

  describe('getCropMeasurementsById', () => {
    it('should fetch crop measurements by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMeasurements)
      } as Response);

      const result = await cropMeasurementsService.getCropMeasurementsById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crop-measurements/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result).toEqual(mockMeasurements);
    });

    it('should handle 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ detail: 'Measurements not found' })
      } as Response);

      await expect(cropMeasurementsService.getCropMeasurementsById(999))
        .rejects.toThrow('Measurements not found');
    });
  });

  describe('updateCropMeasurements', () => {
    it('should update crop measurements successfully', async () => {
      const updateRequest: CropMeasurementsCreateRequest = {
        radius: 6.0,
        width: 11.0,
        height: 9.0,
        area: 99.0,
        area_estimated: 100.0,
        weight: 175.0
      };

      const updatedMeasurements = { ...mockMeasurements, ...updateRequest };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedMeasurements)
      } as Response);

      const result = await cropMeasurementsService.updateCropMeasurements(1, updateRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/crop-measurements/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateRequest),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result.radius).toBe(updateRequest.radius);
      expect(result.weight).toBe(updateRequest.weight);
    });
  });

  describe('Convenience Methods', () => {
    describe('recordPhysicalMeasurements', () => {
      it('should record physical measurements successfully', async () => {
        const expectedRequest = {
          radius: 5.5,
          width: 10.0,
          height: 8.0,
          weight: 150.5
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockMeasurements, ...expectedRequest })
        } as Response);

        const result = await cropMeasurementsService.recordPhysicalMeasurements(5.5, 10.0, 8.0, 150.5);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crop-measurements/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(expectedRequest)
          })
        );
        expect(result.radius).toBe(5.5);
        expect(result.weight).toBe(150.5);
      });

      it('should handle partial physical measurements', async () => {
        const expectedRequest = {
          radius: 5.5,
          width: undefined,
          height: undefined,
          weight: 150.5
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMeasurements)
        } as Response);

        await cropMeasurementsService.recordPhysicalMeasurements(5.5, undefined, undefined, 150.5);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crop-measurements/',
          expect.objectContaining({
            body: JSON.stringify(expectedRequest)
          })
        );
      });
    });

    describe('recordAreaMeasurements', () => {
      it('should record area measurements successfully', async () => {
        const expectedRequest = {
          area: 80.0,
          area_estimated: 85.0
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockMeasurements, ...expectedRequest })
        } as Response);

        const result = await cropMeasurementsService.recordAreaMeasurements(80.0, 85.0);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crop-measurements/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(expectedRequest)
          })
        );
        expect(result.area).toBe(80.0);
        expect(result.area_estimated).toBe(85.0);
      });

      it('should record area measurements without estimated area', async () => {
        const expectedRequest = {
          area: 80.0,
          area_estimated: undefined
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMeasurements)
        } as Response);

        await cropMeasurementsService.recordAreaMeasurements(80.0);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/crop-measurements/',
          expect.objectContaining({
            body: JSON.stringify(expectedRequest)
          })
        );
      });
    });

    describe('updateWeight', () => {
      it('should update weight successfully', async () => {
        // Mock the GET request to fetch existing measurements
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMeasurements)
        } as Response);

        // Mock the PUT request to update measurements
        const updatedMeasurements = { ...mockMeasurements, weight: 200.0 };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(updatedMeasurements)
        } as Response);

        const result = await cropMeasurementsService.updateWeight(1, 200.0);

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/v1/crop-measurements/1', expect.objectContaining({
          method: 'GET'
        }));
        expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/v1/crop-measurements/1', expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ ...mockMeasurements, weight: 200.0 })
        }));
        expect(result.weight).toBe(200.0);
      });
    });

    describe('updateDimensions', () => {
      it('should update dimensions successfully', async () => {
        // Mock the GET request to fetch existing measurements
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMeasurements)
        } as Response);

        // Mock the PUT request to update measurements
        const dimensions = { radius: 6.0, width: 12.0, height: 10.0 };
        const updatedMeasurements = { ...mockMeasurements, ...dimensions };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(updatedMeasurements)
        } as Response);

        const result = await cropMeasurementsService.updateDimensions(1, dimensions);

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/v1/crop-measurements/1', expect.objectContaining({
          method: 'GET'
        }));
        expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/v1/crop-measurements/1', expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ ...mockMeasurements, ...dimensions })
        }));
        expect(result.radius).toBe(6.0);
        expect(result.width).toBe(12.0);
        expect(result.height).toBe(10.0);
      });

      it('should update partial dimensions successfully', async () => {
        // Mock the GET request to fetch existing measurements
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMeasurements)
        } as Response);

        // Mock the PUT request to update measurements
        const dimensions = { radius: 6.0 };
        const updatedMeasurements = { ...mockMeasurements, ...dimensions };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(updatedMeasurements)
        } as Response);

        const result = await cropMeasurementsService.updateDimensions(1, dimensions);

        expect(result.radius).toBe(6.0);
        expect(result.width).toBe(mockMeasurements.width); // Original value preserved
        expect(result.height).toBe(mockMeasurements.height); // Original value preserved
      });
    });
  });

  describe('Authentication', () => {
    it('should handle 401 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Token expired' })
      } as Response);

      await expect(cropMeasurementsService.getCropMeasurementsById(1))
        .rejects.toThrow('Authentication required');
    });

    it('should include authorization headers in all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMeasurements)
      } as Response);

      await cropMeasurementsService.getCropMeasurementsById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
    });
  });
});