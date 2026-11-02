import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ScreenId,
  Currency,
  Product,
  Ingredient,
  SkinAnalysisResult,
  Routine,
  JournalEntry,
  UserProfile,
  User,
  CartItem
} from '../types.ts';

interface AppContextType {
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, params?: { productId?: string; ingredientId?: string }) => void;
  selectedProductId: string | null;
  selectedIngredientId: string | null;
  user: User | null;
  profile: UserProfile;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (inr: number) => string;
  products: Product[];
  ingredients: Ingredient[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalINR: number;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  // Budget Guardian
  budgetItems: { productId: string; quantity: number }[];
  addToBudget: (productId: string, quantity?: number) => void;
  removeFromBudget: (productId: string) => void;
  updateBudgetQuantity: (productId: string, quantity: number) => void;
  targetBudget: number;
  setTargetBudget: (amt: number) => void;
  // Skin Analysis
  activeAnalysis: SkinAnalysisResult | null;
  setActiveAnalysis: (res: SkinAnalysisResult | null) => void;
  // Routines
  routines: Routine[];
  toggleRoutineStep: (routineId: string, stepId: string) => void;
  saveRoutine: (routine: Routine) => Promise<void>;
  deleteRoutine: (routineId: string) => Promise<void>;
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'date'>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  // Auth
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, displayName: string) => void;
  logoutUser: () => void;
  // Profile update
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  // Product Comparison
  compareProductIds: string[];
  toggleCompareProduct: (productId: string) => void;
  clearCompare: () => void;
  // Toast notifications
  toast: { message: string; type?: 'info' | 'success' | 'alert' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'alert') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Conversion rates relative to INR
const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0095 }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>({
    id: 'usr-demo-001',
    email: 'guest@glowverse.ai',
    displayName: 'Aria Vance'
  });

  const [profile, setProfile] = useState<UserProfile>({
    userId: 'usr-demo-001',
    displayName: 'Aria Vance',
    currency: 'INR',
    monthlyBudget: 5000,
    beautyInterests: ['Skin Barrier Health', 'Radiance', 'Sun Defense'],
    skinType: 'Combination',
    skinConcerns: ['Dehydration', 'Fine Lines', 'Uneven Tone'],
    ingredientPreferences: ['Niacinamide', 'Hyaluronic Acid', 'Ceramides'],
    routinePreference: 'Standard (5 steps)'
  });

  const [currency, setCurrencyState] = useState<Currency>('INR');
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-01', 'prod-03', 'prod-14']);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Budget Guardian state
  const [budgetItems, setBudgetItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: 'prod-01', quantity: 1 },
    { productId: 'prod-03', quantity: 1 }
  ]);
  const [targetBudget, setTargetBudget] = useState<number>(5000);

  // Analysis, Routines, Journal
  const [activeAnalysis, setActiveAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Compare
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'alert' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3800);
  };

  // Initial data loading from server API
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [prodRes, ingRes, routRes, jourRes, profileRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/ingredients'),
          fetch('/api/routines'),
          fetch('/api/journal'),
          fetch('/api/profile')
        ]);

        if (prodRes.ok) {
          const prods = await prodRes.json();
          setProducts(prods);
        }
        if (ingRes.ok) {
          const ings = await ingRes.json();
          setIngredients(ings);
        }
        if (routRes.ok) {
          const routs = await routRes.json();
          setRoutines(routs);
        }
        if (jourRes.ok) {
          const jours = await jourRes.json();
          setJournalEntries(jours);
        }
        if (profileRes.ok) {
          const prof = await profileRes.json();
          setProfile(prof);
          if (prof.currency) setCurrencyState(prof.currency);
          if (prof.monthlyBudget) setTargetBudget(prof.monthlyBudget);
        }
      } catch (err) {
        console.error('Initial data fetch error:', err);
      }
    }
    loadInitialData();
  }, []);

  const navigateTo = (screen: ScreenId, params?: { productId?: string; ingredientId?: string }) => {
    if (params?.productId) {
      setSelectedProductId(params.productId);
    }
    if (params?.ingredientId) {
      setSelectedIngredientId(params.ingredientId);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    setProfile(prev => ({ ...prev, currency: c }));
    showToast(`Currency updated to ${c}`, 'info');
  };

  const formatPrice = (inr: number): string => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = inr * config.rate;
    if (currency === 'INR') {
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to luxury wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to shopping bag`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => setCart([]);

  const cartTotalINR = cart.reduce((sum, item) => sum + item.product.priceINR * item.quantity, 0);

  // Budget Guardian actions
  const addToBudget = (productId: string, quantity = 1) => {
    setBudgetItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
    showToast('Allocated to Beauty Budget Guardian', 'success');
  };

  const removeFromBudget = (productId: string) => {
    setBudgetItems(prev => prev.filter(item => item.productId !== productId));
    showToast('Removed from budget calculation', 'info');
  };

  const updateBudgetQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBudget(productId);
      return;
    }
    setBudgetItems(prev => prev.map(item => (item.productId === productId ? { ...item, quantity } : item)));
  };

  // Routine steps toggling & saving
  const toggleRoutineStep = (routineId: string, stepId: string) => {
    setRoutines(prev =>
      prev.map(r => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          items: r.items.map(i => (i.id === stepId ? { ...i, isCompleted: !i.isCompleted } : i))
        };
      })
    );
  };

  const saveRoutine = async (routine: Routine) => {
    try {
      const res = await fetch(`/api/routines/${routine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routine)
      });
      if (res.ok) {
        const updated = await res.json();
        setRoutines(prev => prev.map(r => (r.id === updated.id ? updated : r)));
        showToast('Routine ritual saved successfully', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Could not save routine', 'alert');
    }
  };

  const deleteRoutine = async (routineId: string) => {
    try {
      const res = await fetch(`/api/routines/${routineId}`, { method: 'DELETE' });
      if (res.ok) {
        setRoutines(prev => prev.filter(r => r.id !== routineId));
        showToast('Routine removed', 'info');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Journal
  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'userId' | 'date'>) => {
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const created = await res.json();
        setJournalEntries(prev => [created, ...prev]);
        showToast('Beauty journal entry recorded', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteJournalEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJournalEntries(prev => prev.filter(e => e.id !== id));
        showToast('Journal entry deleted', 'info');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Profile
  const updateProfile = async (updated: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        if (data.profile.currency) setCurrencyState(data.profile.currency);
        if (data.profile.monthlyBudget) setTargetBudget(data.profile.monthlyBudget);
        showToast('Personal beauty profile updated', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compare
  const toggleCompareProduct = (productId: string) => {
    setCompareProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        showToast('You can compare at most 3 products side by side', 'alert');
        return prev;
      }
      showToast('Added product to comparison tray', 'info');
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareProductIds([]);

  // Auth
  const loginUser = (email: string, displayName: string) => {
    setUser({ id: 'usr-demo-001', email, displayName });
    showToast(`Welcome back, ${displayName}`, 'success');
    setAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Signed out of GLOWVERSE AI', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedProductId,
        selectedIngredientId,
        user,
        profile,
        currency,
        setCurrency,
        formatPrice,
        products,
        ingredients,
        wishlist,
        toggleWishlist,
        isInWishlist,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalINR,
        bagOpen,
        setBagOpen,
        budgetItems,
        addToBudget,
        removeFromBudget,
        updateBudgetQuantity,
        targetBudget,
        setTargetBudget,
        activeAnalysis,
        setActiveAnalysis,
        routines,
        toggleRoutineStep,
        saveRoutine,
        deleteRoutine,
        journalEntries,
        addJournalEntry,
        deleteJournalEntry,
        authModalOpen,
        setAuthModalOpen,
        loginUser,
        logoutUser,
        updateProfile,
        compareProductIds,
        toggleCompareProduct,
        clearCompare,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
