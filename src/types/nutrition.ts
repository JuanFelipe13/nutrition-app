// Tipos de datos para la información nutricional
export interface NutrientDetails {
  calories?: number;
  proteins?: number;
  carbohydrates?: number;
  energy?: number;
  salt?: number;
  sodium?: number;
}

export interface NutritionInfo {
  food_name: string;
  nutrients?: NutrientDetails;
  allergens?: string[];
  brand?: string;
  categories?: string;
  image_url?: string | null;
  ingredients_text?: string;
  origins?: string | null;
  product_code?: string;
  serving_size?: string;
}

export interface NutritionResponse {
  status: 'success' | 'error' | 'partial';
  message?: string;
  data?: NutritionInfo;
  alternatives?: NutritionInfo[];
}

export interface SearchParams {
  query: string;
}

export interface NutritionState {
  loading: boolean;
  data: NutritionInfo | null;
  alternatives: NutritionInfo[];
  error: string | null;
} 