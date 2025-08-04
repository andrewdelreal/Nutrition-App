export interface UserRow {
  username: string;
  hashedPassword: string;
}

export interface UserIdRow {
  userId: number;
}

export interface PortionWithNutrition {
  portionId: number;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  weight: number;
  date: string;
  quantity: number;
}