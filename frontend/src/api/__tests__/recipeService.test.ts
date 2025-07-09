import { recipeService } from '../recipeService';
import { TokenStorage } from '../../utils/tokenStorage';
import { 
  RecipeMaster, 
  RecipeVersion, 
  RecipeCreateRequest, 
  RecipeVersionCreateRequest, 
  RecipeFilterCriteria 
} from '../../types/recipe';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock TokenStorage
jest.mock('../../utils/tokenStorage');
const mockTokenStorage = TokenStorage as jest.Mocked<typeof TokenStorage>;

describe('RecipeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockTokenStorage.getAccessToken.mockReturnValue('mock-token');
  });

  const mockRecipeMaster: RecipeMaster = {
    id: 1,
    name: 'Test Recipe',
    crop_type: 'lettuce',
    notes: 'Test recipe for lettuce',
    versions: []
  };

  const mockRecipeVersion: RecipeVersion = {
    id: 1,
    recipe_id: 1,
    version: '1.0',
    valid_from: '2023-01-01T00:00:00Z',
    valid_to: '2023-12-31T23:59:59Z',
    tray_density: 24,
    air_temperature: 22,
    humidity: 65,
    co2: 400,
    water_temperature: 18,
    ec: 1.2,
    ph: 6.5,
    water_hours: 16,
    light_hours: 14,
    created_by: 'testuser'
  };

  describe('getAllRecipes', () => {
    it('should fetch all recipes successfully', async () => {
      const mockRecipes = [mockRecipeMaster];
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecipes),
        headers: new Headers({ 'content-type': 'application/json' })
      } as Response);

      const result = await recipeService.getAllRecipes();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/recipes/',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result).toEqual(mockRecipes);
    });

    it('should fetch recipes with filters', async () => {
      const filters: RecipeFilterCriteria = {
        search: 'lettuce',
        crop_type: 'lettuce',
        active_only: true,
        page: 1,
        limit: 10
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockRecipeMaster])
      } as Response);

      await recipeService.getAllRecipes(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/recipes/?search=lettuce&crop_type=lettuce&active_only=true&page=1&limit=10',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: 'Internal server error' })
      } as Response);

      await expect(recipeService.getAllRecipes()).rejects.toThrow('Internal server error');
    });
  });

  describe('getRecipeById', () => {
    it('should fetch recipe by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecipeMaster)
      } as Response);

      const result = await recipeService.getRecipeById(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/recipes/1',
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockRecipeMaster);
    });

    it('should handle 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ detail: 'Recipe not found' })
      } as Response);

      await expect(recipeService.getRecipeById(999)).rejects.toThrow('Recipe not found');
    });
  });

  describe('createRecipe', () => {
    it('should create recipe successfully', async () => {
      const createRequest: RecipeCreateRequest = {
        name: 'New Recipe',
        crop_type: 'spinach',
        notes: 'Test spinach recipe'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockRecipeMaster, ...createRequest })
      } as Response);

      const result = await recipeService.createRecipe(createRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/recipes/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(createRequest),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          })
        })
      );
      expect(result.name).toBe(createRequest.name);
      expect(result.crop_type).toBe(createRequest.crop_type);
    });

    it('should handle validation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ detail: 'Validation error' })
      } as Response);

      const invalidRequest = {
        name: '',
        crop_type: '',
        notes: ''
      };

      await expect(recipeService.createRecipe(invalidRequest)).rejects.toThrow('Validation error');
    });
  });

  describe('updateRecipe', () => {
    it('should update recipe successfully', async () => {
      const updateRequest: RecipeCreateRequest = {
        name: 'Updated Recipe',
        crop_type: 'kale',
        notes: 'Updated notes'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockRecipeMaster, ...updateRequest })
      } as Response);

      const result = await recipeService.updateRecipe(1, updateRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/recipes/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateRequest)
        })
      );
      expect(result.name).toBe(updateRequest.name);
    });
  });

  describe('deleteRecipe', () => {
    it('should delete recipe successfully', async () => {
      const mockResponse = { message: 'Recipe deleted successfully' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await recipeService.deleteRecipe(1);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/recipes/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Recipe Version Management', () => {
    describe('createRecipeVersion', () => {
      it('should create recipe version successfully', async () => {
        const versionRequest: RecipeVersionCreateRequest = {
          version: '2.0',
          valid_from: '2024-01-01T00:00:00Z',
          tray_density: 36,
          air_temperature: 24,
          humidity: 70,
          created_by: 'testuser'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockRecipeVersion, ...versionRequest })
        } as Response);

        const result = await recipeService.createRecipeVersion(1, versionRequest);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/recipes/1/versions/',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(versionRequest)
          })
        );
        expect(result.version).toBe(versionRequest.version);
      });
    });

    describe('getRecipeVersionById', () => {
      it('should fetch recipe version by ID successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRecipeVersion)
        } as Response);

        const result = await recipeService.getRecipeVersionById(1);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/recipe-versions/1',
          expect.objectContaining({
            method: 'GET'
          })
        );
        expect(result).toEqual(mockRecipeVersion);
      });
    });

    describe('updateRecipeVersion', () => {
      it('should update recipe version successfully', async () => {
        const updateRequest: RecipeVersionCreateRequest = {
          version: '2.1',
          valid_from: '2024-01-01T00:00:00Z',
          tray_density: 40,
          created_by: 'testuser'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockRecipeVersion, ...updateRequest })
        } as Response);

        const result = await recipeService.updateRecipeVersion(1, updateRequest);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/recipe-versions/1',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updateRequest)
          })
        );
        expect(result.version).toBe(updateRequest.version);
      });
    });

    describe('deleteRecipeVersion', () => {
      it('should delete recipe version successfully', async () => {
        const mockResponse = { message: 'Recipe version deleted successfully' };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        } as Response);

        const result = await recipeService.deleteRecipeVersion(1);

        expect(mockFetch).toHaveBeenCalledWith(
          '/api/v1/recipe-versions/1',
          expect.objectContaining({
            method: 'DELETE'
          })
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Convenience Methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockRecipeMaster])
      } as Response);
    });

    it('should get active recipes', async () => {
      await recipeService.getActiveRecipes();
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('active_only=true'),
        expect.any(Object)
      );
    });

    it('should search recipes', async () => {
      await recipeService.searchRecipes('lettuce');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=lettuce'),
        expect.any(Object)
      );
    });

    it('should get recipes by crop type', async () => {
      await recipeService.getRecipesByCropType('spinach');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('crop_type=spinach'),
        expect.any(Object)
      );
    });

    it('should get recipes by creator', async () => {
      await recipeService.getRecipesByCreator('testuser');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('created_by=testuser'),
        expect.any(Object)
      );
    });

    it('should get paginated recipes', async () => {
      await recipeService.getPaginatedRecipes(2, 20, { crop_type: 'kale' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2&limit=20&crop_type=kale'),
        expect.any(Object)
      );
    });
  });

  describe('Authentication', () => {
    it('should handle 401 errors by attempting token refresh', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: 'Token expired' })
      } as Response);

      await expect(recipeService.getAllRecipes()).rejects.toThrow('Authentication required');
    });

    it('should include authorization headers in all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      } as Response);

      await recipeService.getAllRecipes();

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