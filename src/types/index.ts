export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  preparation: string;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
}

export type Category = 'all' | 'stir-fry' | 'stew' | 'fry' | 'soup' | 'staple' | 'dessert';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  description: string;
  coverImage: string;
  prepTime: number;
  cookTime: number;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: Step[];
  tips: string[];
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const categoryLabels: Record<Category, string> = {
  'all': '全部',
  'stir-fry': '热炒',
  'stew': '炖煮',
  'fry': '煎炸',
  'soup': '汤',
  'staple': '主食',
  'dessert': '甜品',
};

export const difficultyLabels: Record<Difficulty, string> = {
  'easy': '简单',
  'medium': '中等',
  'hard': '困难',
};
