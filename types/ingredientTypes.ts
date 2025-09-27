export interface Ingredient {
  id: string;
  inciName: string;
  commonName: string;
  concentration: string;
  isAllergen: boolean;
  category?: string;
  all_functions?: string[] | string;
  selectedFunction?: string;
}

export interface QuickAddIngredientsProps {
  onAddIngredient: (ingredientName: string) => void;
}

export interface IngredientFormProps {
  ingredient?: Ingredient; 
  onAdd: (ingredient: Omit<Ingredient, 'id'>) => void;
  onUpdate: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
  isEditing?: boolean;
}

export interface IngredientSummaryProps {
  totalIngredients: number;
  allergens: number;
  withConcentration: number;
  status: string;
}
