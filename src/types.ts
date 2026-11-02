export type ScreenId =
  | 'home'
  | 'skin-upload'
  | 'skin-results'
  | 'dashboard'
  | 'routines'
  | 'products'
  | 'product-detail'
  | 'ingredients'
  | 'virtual-studio'
  | 'journal'
  | 'budget-guardian'
  | 'assistant'
  | 'profile'
  | 'privacy';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Cleansers' | 'Moisturisers' | 'Sunscreens' | 'Serums' | 'Lip care' | 'Makeup' | 'Beauty accessories';
  priceINR: number;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  description: string;
  skinTypes: ('All' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal')[];
  concerns: string[];
  keyIngredients: string[];
  allIngredients: string[];
  howToUse: string;
  volume: string;
  texture: string;
  finish: string;
  isVerified: boolean;
  alternativeIds?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'Hydrators' | 'Exfoliants' | 'Antioxidants' | 'Barrier Repair' | 'Anti-Aging' | 'Soothing';
  description: string;
  commonUses: string[];
  formulationDetails: string;
  optimalConcentration: string;
  precautions: string[];
  referenceSources: string[];
  compatibleWith: string[];
  avoidMixingWith: string[];
}

export interface ParameterMetric {
  score: number;
  label: string;
  explanation: string;
  limitation: string;
  source?: 'api_analyzed' | 'educational_guidance' | 'simulated';
}

export interface SkinAnalysisResult {
  id: string;
  taskId: string;
  mode: 'live-youcam' | 'demo';
  isDemo: boolean;
  provider?: string;
  analyzedAt: string;
  overallScore: number;
  parameters: {
    texture: ParameterMetric;
    radiance: ParameterMetric;
    hydration: ParameterMetric;
    fineLines: ParameterMetric;
    pores: ParameterMetric;
    redness: ParameterMetric;
    firmness: ParameterMetric;
    darkCircles: ParameterMetric;
  };
  recommendedIngredientIds: string[];
  recommendedProductIds: string[];
  disclaimer: string;
  previewImage?: string;
  sampleId?: string;
  imageMeta?: {
    format: string;
    sizeKb: number;
    hashPreview: string;
  };
}

export interface RoutineItem {
  id: string;
  stepNumber: number;
  stepName: string;
  timeOfDay: 'morning' | 'evening';
  productId?: string;
  productName: string;
  instructions: string;
  isCompleted?: boolean;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description: string;
  items: RoutineItem[];
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  mood: 'radiant' | 'balanced' | 'reactive' | 'dry' | 'breakout';
  skinFeel: string;
  activeProductsUsed: string[];
  tags: string[];
}

export interface UserProfile {
  userId: string;
  displayName: string;
  currency: Currency;
  monthlyBudget: number;
  beautyInterests: string[];
  skinType: 'All' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal';
  skinConcerns: string[];
  ingredientPreferences: string[];
  routinePreference: 'Minimalist (3 steps)' | 'Standard (5 steps)' | 'Comprehensive (7+ steps)';
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
