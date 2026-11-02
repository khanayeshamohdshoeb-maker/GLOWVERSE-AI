import { INITIAL_PRODUCTS, INITIAL_INGREDIENTS, Product, Ingredient } from './mockData.js';

export interface User {
  id: string;
  email: string;
  displayName: string;
  passwordHash?: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  monthlyBudget: number;
  beautyInterests: string[];
  skinType: 'All' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal';
  skinConcerns: string[];
  ingredientPreferences: string[];
  routinePreference: 'Minimalist (3 steps)' | 'Standard (5 steps)' | 'Comprehensive (7+ steps)';
}

export interface SkinAnalysisRecord {
  id: string;
  userId: string;
  date: string;
  source: 'live-youcam' | 'demo' | 'demo-simulation';
  isDemo: boolean;
  overallScore: number;
  parameters: {
    texture: { score: number; label: string; explanation: string; limitation: string };
    radiance: { score: number; label: string; explanation: string; limitation: string };
    hydration: { score: number; label: string; explanation: string; limitation: string };
    fineLines: { score: number; label: string; explanation: string; limitation: string };
    pores: { score: number; label: string; explanation: string; limitation: string };
    redness: { score: number; label: string; explanation: string; limitation: string };
    firmness: { score: number; label: string; explanation: string; limitation: string };
    darkCircles: { score: number; label: string; explanation: string; limitation: string };
  };
  recommendedIngredientIds: string[];
  recommendedProductIds: string[];
  notes: string;
  imageDataUri?: string; // only stored temporarily if user consented
}

export interface RoutineItem {
  id: string;
  stepNumber: number;
  stepName: string; // e.g. "Gentle Cleanser", "Antioxidant Serum"
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

export interface ChatMessageRecord {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  model?: string;
  disclaimer?: string;
  suggestedQuestions?: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessageRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyPreferences {
  userId: string;
  allowTemporaryImageProcessing: boolean;
  storeAnalysisHistory: boolean;
  allowPersonalizedRecommendations: boolean;
  marketingEmails: boolean;
  consentedAt: string;
}

// In-Memory Database store with pre-seeded demo user
class InMemoryDatabase {
  users: Map<string, User> = new Map();
  profiles: Map<string, UserProfile> = new Map();
  analyses: Map<string, SkinAnalysisRecord> = new Map();
  routines: Map<string, Routine> = new Map();
  wishlists: Map<string, Set<string>> = new Map(); // userId -> Set of productIds
  journals: Map<string, JournalEntry[]> = new Map();
  privacyPrefs: Map<string, PrivacyPreferences> = new Map();
  conversations: Map<string, Conversation> = new Map();
  products: Product[] = [...INITIAL_PRODUCTS];
  ingredients: Ingredient[] = [...INITIAL_INGREDIENTS];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoUserId = 'usr-demo-001';
    
    // Seed Demo User
    const demoUser: User = {
      id: demoUserId,
      email: 'guest@glowverse.ai',
      displayName: 'Aria Vance',
      createdAt: new Date().toISOString()
    };
    this.users.set(demoUserId, demoUser);

    // Seed Profile
    this.profiles.set(demoUserId, {
      userId: demoUserId,
      displayName: 'Aria Vance',
      currency: 'INR',
      monthlyBudget: 5000,
      beautyInterests: ['Skin Barrier Health', 'Clean Formulations', 'Radiance', 'Sun Defense'],
      skinType: 'Combination',
      skinConcerns: ['Dehydration', 'Fine Lines', 'Uneven Tone'],
      ingredientPreferences: ['Niacinamide', 'Hyaluronic Acid', 'Ceramides'],
      routinePreference: 'Standard (5 steps)'
    });

    // Seed Privacy Preferences
    this.privacyPrefs.set(demoUserId, {
      userId: demoUserId,
      allowTemporaryImageProcessing: true,
      storeAnalysisHistory: true,
      allowPersonalizedRecommendations: true,
      marketingEmails: false,
      consentedAt: new Date().toISOString()
    });

    // Seed Demo Analysis
    const demoAnalysis: SkinAnalysisRecord = {
      id: 'analysis-sample-01',
      userId: demoUserId,
      date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      source: 'demo-simulation',
      isDemo: true,
      overallScore: 84,
      parameters: {
        texture: {
          score: 82,
          label: 'Refined Surface',
          explanation: 'Optical evaluation of surface micro-roughness. Higher score denotes smoother light reflectance across cheek and forehead zones.',
          limitation: 'Optical surface reflectance does not evaluate subsurface dermal cellular layers.'
        },
        radiance: {
          score: 86,
          label: 'Healthy Luminous Glow',
          explanation: 'Measures high-specular diffused light scatter, indicating balanced lipid balance and adequate stratum corneum hydration.',
          limitation: 'Lighting direction and environment ambient intensity can influence optical luminosity values.'
        },
        hydration: {
          score: 79,
          label: 'Moderate Dehydration',
          explanation: 'Superficial cutaneous moisture assessment based on micro-crease patterns and epidermal plumpness.',
          limitation: 'Non-invasive visual imaging estimates superficial barrier comfort; it does not replace corneometer capacitance measurements.'
        },
        fineLines: {
          score: 85,
          label: 'Minimal Expression Lines',
          explanation: 'Calculated contrast depth of dynamic and shallow static lines around periorbital and nasolabial contours.',
          limitation: 'Facial expressions during photo capture can cause slight metric variations.'
        },
        pores: {
          score: 88,
          label: 'Refined & Clear',
          explanation: 'Analyzes visual density and perimeter of follicular openings in the T-zone and central cheek region.',
          limitation: 'Camera sensor resolution and distance to lens directly impact pore diameter calculations.'
        },
        redness: {
          score: 91,
          label: 'Even & Calm Tone',
          explanation: 'Chroma distribution map evaluating capillary blushing or localized erythema across cheeks and nasal wings.',
          limitation: 'Cannot diagnose vascular conditions such as rosacea or dermatitis.'
        },
        firmness: {
          score: 83,
          label: 'Resilient Elasticity',
          explanation: 'Visual assessment of facial contour definition and gravitational sag markers along jawline.',
          limitation: 'Visual heuristics approximate skin resilience without physical elastometry testing.'
        },
        darkCircles: {
          score: 78,
          label: 'Mild Periorbital Shadowing',
          explanation: 'Chrominance contrast beneath lower eyelid margin, identifying vascular or structural shadow undertones.',
          limitation: 'Fatigue, bone structure, and ambient overhead shadows naturally accentuate periorbital depth.'
        }
      },
      recommendedIngredientIds: ['hyaluronic-acid', 'ceramides', 'niacinamide', 'vitamin-c'],
      recommendedProductIds: ['prod-01', 'prod-02', 'prod-03', 'prod-05'],
      notes: 'Initial baseline assessment. Focus on barrier hydration and morning antioxidant defense.'
    };
    this.analyses.set(demoAnalysis.id, demoAnalysis);

    // Seed Demo Routine
    const demoRoutine: Routine = {
      id: 'routine-001',
      userId: demoUserId,
      name: 'Aria’s Luminous Morning & Restorative Evening Ritual',
      description: 'Balanced 5-step ritual prioritizing barrier hydration, daily photoprotection, and gentle cell renewal.',
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'step-1',
          stepNumber: 1,
          stepName: 'Gentle Hydrating Cleanser',
          timeOfDay: 'morning',
          productId: 'prod-04',
          productName: 'Petal Foam Conditioning Gentle Cleanser',
          instructions: 'Massage 1 pump onto wet face for 60 seconds; rinse with tepid water.',
          isCompleted: true
        },
        {
          id: 'step-2',
          stepNumber: 2,
          stepName: 'Quadruple Hyaluronic Essence',
          timeOfDay: 'morning',
          productId: 'prod-01',
          productName: 'Celestial Dew Multi-Weight Hyaluronic Essence',
          instructions: 'Pat 3–4 drops onto damp skin to lock in deep hydration.',
          isCompleted: true
        },
        {
          id: 'step-3',
          stepNumber: 3,
          stepName: 'Antioxidant Shield',
          timeOfDay: 'morning',
          productId: 'prod-02',
          productName: 'Radiance Alchemy 15% Vitamin C + Ferulic Serum',
          instructions: 'Smooth 4 drops over face and neck for daytime environmental defense.',
          isCompleted: false
        },
        {
          id: 'step-4',
          stepNumber: 4,
          stepName: 'Silk Fluid Sunscreen SPF 50+',
          timeOfDay: 'morning',
          productId: 'prod-05',
          productName: 'Solar Veil Invisible Silk Fluid SPF 50+ PA++++',
          instructions: 'Apply 2 finger lengths as the final morning veil before makeup or exposure.',
          isCompleted: false
        },
        {
          id: 'step-5',
          stepNumber: 5,
          stepName: 'Velvet Barrier Night Cream',
          timeOfDay: 'evening',
          productId: 'prod-03',
          productName: 'Velvet Cloud Barrier Restorative Cream',
          instructions: 'Warm a dime-sized amount between palms and seal in overnight moisture.',
          isCompleted: false
        }
      ]
    };
    this.routines.set(demoRoutine.id, demoRoutine);

    // Seed Wishlist
    this.wishlists.set(demoUserId, new Set(['prod-01', 'prod-03', 'prod-14']));

    // Seed Journal
    this.journals.set(demoUserId, [
      {
        id: 'journal-01',
        userId: demoUserId,
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        title: 'Morning Routine Consistency & Hydration Check',
        content: 'Noticed cheek roughness has subsided significantly after 4 consecutive days of applying the Hyaluronic Essence on wet skin followed by Velvet Cloud cream. No redness or tingling noted.',
        mood: 'radiant',
        skinFeel: 'Comfortable, dewy, no midday tightness',
        activeProductsUsed: ['Celestial Dew Essence', 'Velvet Cloud Cream', 'Solar Veil SPF 50+'],
        tags: ['Hydration', 'Barrier Support', 'Morning Ritual']
      },
      {
        id: 'journal-02',
        userId: demoUserId,
        date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        title: 'Introduced Vitamin C into Morning Sequence',
        content: 'Layered 15% Vitamin C after essence. Skin felt energized and clear throughout the afternoon. Remember to wait 2 minutes before applying SPF 50 to let the serum absorb.',
        mood: 'balanced',
        skinFeel: 'Luminous glow with zero oiliness',
        activeProductsUsed: ['Radiance Alchemy 15% Vitamin C', 'Solar Veil SPF 50+'],
        tags: ['Antioxidant', 'Glow', 'Daytime']
      }
    ]);

    // Seed Demo Conversation
    const demoConvId = 'conv-demo-001';
    this.conversations.set(demoConvId, {
      id: demoConvId,
      userId: demoUserId,
      title: 'Skincare Actives & Routine Guidance',
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-init-1',
          conversationId: demoConvId,
          sender: 'assistant',
          text: `Welcome to GLOWVERSE AI Beauty Intelligence. I am your cosmetic education and formulation science guide.\n\nI can help you understand cosmetic ingredients, evaluate how your routine steps interact, decode your non-clinical skin analysis parameters, and navigate the Beauty Budget Guardian.\n\n*Note: I provide non-medical cosmetic education for beauty routine guidance. For persistent skin conditions, always consult a licensed dermatologist.*`,
          provider: 'GLOWVERSE Beauty Intelligence Engine',
          model: 'gemini-3.1-flash-lite',
          disclaimer: 'Educational cosmetic guidance only. Does not replace professional dermatological consultation.',
          suggestedQuestions: [
            'What is niacinamide?',
            'What does hyaluronic acid do?',
            'Explain sunscreen SPF.',
            'What is a basic skincare routine?',
            'What is the difference between a serum and moisturiser?',
            'Explain my saved skin-analysis results.',
            'What are ceramides?'
          ],
          createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
        }
      ]
    });
  }
}

export const db = new InMemoryDatabase();
