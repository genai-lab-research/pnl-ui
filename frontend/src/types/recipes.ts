/**
 * Recipe Management Data Models
 * Based on p5_datamodels.md specification
 */

// Environment Parameters
export interface EnvironmentParameters {
  tray_density?: number;
  air_temperature?: number;
  humidity?: number;
  co2?: number;
  water_temperature?: number;
  ec?: number;
  ph?: number;
  water_hours?: number;
  light_hours?: number;
}

// Active Recipe
export interface ActiveRecipe {
  recipe_version_id: number;
  recipe_name: string;
  version: string;
  crop_type: string;
  applied_at: string;
  applied_by: string;
  environment_parameters: EnvironmentParameters;
}

// Recipe Application
export interface RecipeApplication {
  id: number;
  container_id: number;
  recipe_version_id: number;
  applied_at: string;
  applied_by: string;
  previous_recipe_version_id?: number;
  changes_summary?: Record<string, any>;
  environment_sync_status?: string;
}

// Recipe Version
export interface RecipeVersion {
  recipe_version_id: number;
  recipe_id: number;
  recipe_name: string;
  version: string;
  crop_type: string;
  valid_from: string;
  valid_to?: string;
  created_by: string;
  environment_parameters: EnvironmentParameters;
}

// Apply Recipe Request
export interface ApplyRecipeRequest {
  recipe_version_id: number;
  applied_by: string;
  environment_sync?: boolean;
}

// Apply Recipe Response
export interface ApplyRecipeResponse {
  success: boolean;
  message: string;
  application_id: number;
  environment_sync_status: string;
  applied_at: string;
}

// Recipe Management Integration
export interface RecipeManagementIntegration {
  active_recipes: ActiveRecipe[];
  recipe_history: RecipeApplication[];
  environment_recipes: RecipeVersion[];
}

// Recipe History Query Parameters
export interface RecipeHistoryQueryParams {
  limit?: number;
  start_date?: string;
  end_date?: string;
}

// Available Recipes Query Parameters
export interface AvailableRecipesQueryParams {
  crop_type?: string;
  active_only?: boolean;
}