import { BaseApiService } from './baseService';
import { apiConfig } from './config';
import {
  RecipeMaster,
  RecipeVersion,
  RecipeCreateRequest,
  RecipeVersionCreateRequest,
  RecipeFilterCriteria,
  RecipeDeleteResponse
} from '../types/recipe';

export class RecipeService extends BaseApiService {
  constructor(baseUrl: string = apiConfig.baseUrl) {
    super(baseUrl);
  }

  // Recipe Master Management
  async getAllRecipes(filters?: RecipeFilterCriteria): Promise<RecipeMaster[]> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    return this.get<RecipeMaster[]>(`/recipes/${queryString}`);
  }

  async getRecipeById(id: number): Promise<RecipeMaster> {
    return this.get<RecipeMaster>(`/recipes/${id}`);
  }

  async createRecipe(recipeData: RecipeCreateRequest): Promise<RecipeMaster> {
    return this.post<RecipeMaster>('/recipes/', recipeData);
  }

  async updateRecipe(id: number, recipeData: RecipeCreateRequest): Promise<RecipeMaster> {
    return this.put<RecipeMaster>(`/recipes/${id}`, recipeData);
  }

  async deleteRecipe(id: number): Promise<RecipeDeleteResponse> {
    return this.delete<RecipeDeleteResponse>(`/recipes/${id}`);
  }

  // Recipe Version Management
  async createRecipeVersion(
    recipeId: number, 
    versionData: RecipeVersionCreateRequest
  ): Promise<RecipeVersion> {
    return this.post<RecipeVersion>(`/recipes/${recipeId}/versions/`, versionData);
  }

  async getRecipeVersionById(id: number): Promise<RecipeVersion> {
    return this.get<RecipeVersion>(`/recipe-versions/${id}`);
  }

  async updateRecipeVersion(
    id: number, 
    versionData: RecipeVersionCreateRequest
  ): Promise<RecipeVersion> {
    return this.put<RecipeVersion>(`/recipe-versions/${id}`, versionData);
  }

  async deleteRecipeVersion(id: number): Promise<RecipeDeleteResponse> {
    return this.delete<RecipeDeleteResponse>(`/recipe-versions/${id}`);
  }

  // Convenience methods
  async getActiveRecipes(): Promise<RecipeMaster[]> {
    return this.getAllRecipes({ active_only: true });
  }

  async searchRecipes(searchTerm: string): Promise<RecipeMaster[]> {
    return this.getAllRecipes({ search: searchTerm });
  }

  async getRecipesByCropType(cropType: string): Promise<RecipeMaster[]> {
    return this.getAllRecipes({ crop_type: cropType });
  }

  async getRecipesByCreator(creator: string): Promise<RecipeMaster[]> {
    return this.getAllRecipes({ created_by: creator });
  }

  async getPaginatedRecipes(
    page: number = 1, 
    limit: number = 10, 
    filters?: Partial<RecipeFilterCriteria>
  ): Promise<RecipeMaster[]> {
    return this.getAllRecipes({ page, limit, ...filters });
  }
}

export const recipeService = new RecipeService();
export default recipeService;