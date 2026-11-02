import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Compass,
  Layers,
  FlaskConical,
  Palette,
  Calculator,
  BookOpen,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Currency, ScreenId } from '../types.ts';

const SCREEN_TITLES: Record<ScreenId, string> = {
  'home': 'Storefront',
  'skin-upload': 'Skin Intelligence Scanner',
  'skin-results': 'Optical Diagnostic Results',
  'dashboard': 'Personal Beauty Overview',
  'routines': 'Routine Studio',
  'products': 'Product Discovery',
  'product-detail': 'Formulation Details',
  'ingredients': 'Ingredient Intelligence',
  'virtual-studio': 'Virtual Beauty Studio',
  'journal': 'Beauty Journal',
  'budget-guardian': 'Budget Guardian',
  'assistant': 'AI Beauty Assistant',
  'profile': 'Personal Profile',
  'privacy': 'Privacy & Data Rights'
};

export const Navigation: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    cart,
    wishlist,
    setBagOpen,
    user,
    setAuthModalOpen,
    currency,
    setCurrency
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (screen: ScreenId) => {
    navigateTo(screen);
    setMobileMenuOpen(false);
  };

  const isStorefront = currentScreen === 'home';

  return (
    <>
      {/* 1. Top Editorial Announcement Strip (Only on Storefront) */}
      {isStorefront && (
        <div className="bg-[#302B27] text-[#E8DCCB] text-[11px] tracking-widest uppercase py-1.5 px-4 text-center font-medium border-b border-[#302B27]/40 flex items-center justify-between max-w-full">
          <span className="hidden sm:inline-block text-[#C6A77D]">High-Potency Skincare & AI Intelligence</span>
          <span className="mx-auto font-sans font-normal">Complimentary Global Delivery on orders over ₹2,500</span>
          <div className="relative hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="text-xs hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{currency}</span>
              <span className="text-[9px]">▼</span>
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#FFFFFF] text-[#302B27] shadow-xl rounded-md py-1 px-1 z-50 text-xs border border-[#E8DCCB] min-w-[70px]">
                {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F8F4ED] ${currency === c ? 'font-bold text-[#96734C]' : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#F8F4ED]/95 backdrop-blur-md border-b border-[#E8DCCB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          
          {/* Left Zone: Brand or Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#302B27] hover:text-[#96734C] transition-colors cursor-pointer lg:hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Wordmark */}
            <button
              onClick={() => handleNavClick('home')}
              className="text-2xl font-serif tracking-tight text-[#302B27] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer text-left"
            >
              <span>GLOWVERSE</span>
              <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-[#96734C] border border-[#C6A77D]/60 px-1 py-0.2 rounded">
                AI
              </span>
            </button>

            {!isStorefront && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#302B27]/50 font-sans border-l border-[#E8DCCB] pl-3 ml-1">
                <span>Platform</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#96734C]" />
                <span className="text-[#302B27] font-semibold">
                  {SCREEN_TITLES[currentScreen] || 'Intelligence'}
                </span>
              </div>
            )}
          </div>

          {/* Center Zone: Clean Single-Line Nav Links (Storefront only) */}
          {isStorefront && (
            <nav className="hidden lg:flex items-center gap-8 text-[13.5px] font-medium tracking-wide text-[#302B27]/80">
              <button
                onClick={() => handleNavClick('skin-upload')}
                className="hover:text-[#302B27] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Skin Intelligence
              </button>
              <button
                onClick={() => handleNavClick('routines')}
                className="hover:text-[#302B27] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Routine Studio
              </button>
              <button
                onClick={() => handleNavClick('products')}
                className="hover:text-[#302B27] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Discover Products
              </button>
              <button
                onClick={() => handleNavClick('ingredients')}
                className="hover:text-[#302B27] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Ingredients
              </button>
              <button
                onClick={() => handleNavClick('virtual-studio')}
                className="hover:text-[#302B27] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
              >
                Virtual Studio
              </button>
            </nav>
          )}

          {/* Right Zone: Actions, Currency, Bag & Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Currency Selector (Always accessible in Platform view) */}
            {!isStorefront && (
              <div className="relative hidden md:flex items-center">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="px-2.5 py-1.5 text-xs text-[#302B27] hover:bg-[#E8DCCB]/40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium border border-[#E8DCCB]"
                >
                  <span>{currency}</span>
                  <span className="text-[9px] text-[#96734C]">▼</span>
                </button>
                {currencyDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-[#FFFFFF] text-[#302B27] shadow-xl rounded-xl py-1 px-1 z-50 text-xs border border-[#E8DCCB] min-w-[80px]">
                    {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F8F4ED] ${currency === c ? 'font-bold text-[#96734C]' : ''}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick AI Advisor */}
            <button
              onClick={() => handleNavClick('assistant')}
              className={`p-2 transition-colors cursor-pointer rounded-xl ${
                currentScreen === 'assistant'
                  ? 'bg-[#302B27] text-white'
                  : 'text-[#302B27]/70 hover:text-[#96734C] hover:bg-white'
              }`}
              title="AI Beauty Assistant"
              aria-label="AI Beauty Assistant"
            >
              <Sparkles className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('journal')}
              className="p-2 text-[#302B27]/70 hover:text-[#96734C] transition-colors relative cursor-pointer rounded-xl hover:bg-white"
              title="Wishlist & Journal"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#96734C] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Drawer Trigger */}
            <button
              onClick={() => setBagOpen(true)}
              className="p-2 text-[#302B27]/70 hover:text-[#96734C] transition-colors relative cursor-pointer rounded-xl hover:bg-white"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#302B27] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase text-[#FFFFFF] bg-[#302B27] rounded-xl hover:bg-[#433C37] transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C6A77D]" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#FFFFFF] bg-[#96734C] rounded-xl hover:bg-[#80603D] transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </header>

      {/* 3. Responsive Mobile Menu Drawer (Complete 10 Feature Access) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#FFFFFF] border-l border-[#E8DCCB] h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
                <div className="font-serif text-xl text-[#302B27] flex items-center gap-1.5">
                  <span>GLOWVERSE</span>
                  <span className="text-[10px] font-bold text-[#96734C] border border-[#C6A77D] px-1 py-0.2 rounded font-sans">
                    AI
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#302B27]/70 hover:text-[#302B27] rounded-lg hover:bg-[#F8F4ED]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency Selector */}
              <div className="py-3 border-b border-[#E8DCCB] flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#302B27]/70 font-medium">Currency</span>
                <div className="flex gap-1">
                  {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                        currency === c
                          ? 'bg-[#302B27] text-white font-bold'
                          : 'bg-[#F8F4ED] text-[#302B27] border border-[#E8DCCB]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 py-4">
                {[
                  { id: 'home', label: 'Editorial Storefront', icon: Compass },
                  { id: 'dashboard', label: 'Personal Dashboard', icon: Compass },
                  { id: 'skin-upload', label: 'Skin Intelligence Scan', icon: Sparkles },
                  { id: 'routines', label: 'Routine Studio', icon: Layers },
                  { id: 'products', label: 'Product Discovery', icon: ShoppingBag },
                  { id: 'ingredients', label: 'Ingredient Intelligence', icon: FlaskConical },
                  { id: 'virtual-studio', label: 'Virtual Beauty Studio', icon: Palette },
                  { id: 'budget-guardian', label: 'Budget Guardian', icon: Calculator },
                  { id: 'journal', label: 'Beauty Journal', icon: BookOpen },
                  { id: 'assistant', label: 'AI Beauty Assistant', icon: Sparkles },
                  { id: 'profile', label: 'Profile & Preferences', icon: UserIcon },
                  { id: 'privacy', label: 'Privacy & Data Rights', icon: ShieldCheck }
                ].map(link => {
                  const Icon = link.icon;
                  const active = currentScreen === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id as ScreenId)}
                      className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        active
                          ? 'bg-[#302B27] text-white font-semibold'
                          : 'text-[#302B27]/80 hover:bg-[#F8F4ED]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#C6A77D]' : 'text-[#302B27]/60'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Auth */}
            <div className="pt-4 border-t border-[#E8DCCB]">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-[#302B27]/70 truncate">
                    Signed in as <strong>{user.displayName}</strong>
                  </div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full py-2.5 bg-[#302B27] text-white text-xs font-semibold tracking-wider uppercase rounded-xl"
                  >
                    Open Dashboard
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#96734C] text-white text-xs font-semibold tracking-wider uppercase rounded-xl"
                >
                  Sign In / Register
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
