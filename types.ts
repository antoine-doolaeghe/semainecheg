export enum IngredientCategory {
  PRODUCE = "Fruits & Légumes",
  PROTEIN = "Protéines",
  DAIRY = "Crèmerie",
  PANTRY = "Épicerie",
  FROZEN = "Surgelés",
  OTHER = "Divers"
}

export interface Ingredient {
  name: string;
  quantity: string; // e.g., "200" or "2"
  unit: string;     // e.g., "g", "ml", "pcs", ""
  category: IngredientCategory;
  checked?: boolean; // UI state
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  dayNumber: number; // 1-7
  name: string;
  description: string;
  totalTimeMinutes: number;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string;
  macros?: Macros;
}

export type MealPlan = Recipe[];

export interface UserPreferences {
  goal: 'balanced' | 'quick' | 'cheap' | 'sport' | 'vegetarian';
  restrictions: string;
  cookingLevel: 'beginner' | 'intermediate';
  pantryItems: string;
  numberOfMeals: number;
}

export type ViewState = 'onboarding' | 'planning' | 'groceries' | 'history';

export interface SavedMealPlan {
  id: string;
  createdAt: string;
  preferences: UserPreferences;
  recipes: Recipe[];
}