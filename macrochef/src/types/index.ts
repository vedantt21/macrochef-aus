export type MacroTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";

export type RecipeVisibility = "PUBLIC" | "FRIENDS" | "PRIVATE";

export type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  isVerified: boolean;
  isPrivate: boolean;
  dailyCalorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
};
