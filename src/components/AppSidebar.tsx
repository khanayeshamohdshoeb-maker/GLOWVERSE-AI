import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Compass,
  Sparkles,
  Layers,
  ShoppingBag,
  FlaskConical,
  Palette,
  BookOpen,
  Calculator,
  MessageSquare,
  User as UserIcon,
  ShieldCheck,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { ScreenId } from '../types.ts';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const PRIMARY_NAV_ITEMS: { category: string; items: NavItem[] }[] = [
  {
    category: 'Core Intelligence',
    items: [
      { id: 'dashboard', label: 'Overview', icon: Compass },
      { id: 'skin-upload', label: 'Skin Intelligence', icon: Sparkles },
      { id: 'routines', label: 'Routine Studio', icon: Layers }
    ]
  },
  {
    category: 'Discovery & Studio',
    items: [
      { id: 'products', label: 'Product Discovery', icon: ShoppingBag },
      { id: 'ingredients', label: 'Ingredient Intelligence', icon: FlaskConical },
      { id: 'virtual-studio', label: 'Virtual Beauty Studio', icon: Palette }
    ]
  },
  {
    category: 'Beauty Stewardship',
    items: [
      { id: 'journal', label: 'Beauty Journal', icon: BookOpen },
      { id: 'budget-guardian', label: 'Budget Guardian', icon: Calculator },
      { id: 'assistant', label: 'AI Beauty Assistant', icon: MessageSquare, badge: 'Active' }
    ]
  },
  {
    category: 'Personal & Legal',
    items: [
      { id: 'profile', label: 'Personal Profile', icon: UserIcon },
      { id: 'privacy', label: 'Privacy & Data Rights', icon: ShieldCheck }
    ]
  }
];

export const AppSidebar: React.FC = () => {
  const { currentScreen, navigateTo, user, setAuthModalOpen } = useApp();

  const isScreenActive = (id: ScreenId) => {
    if (id === 'skin-upload') {
      return currentScreen === 'skin-upload' || currentScreen === 'skin-results';
    }
    if (id === 'products') {
      return currentScreen === 'products' || currentScreen === 'product-detail';
    }
    return currentScreen === id;
  };

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#E8DCCB] h-screen sticky top-0 flex flex-col justify-between shrink-0 select-none hidden lg:flex">
      
      {/* Top Brand Header */}
      <div>
        <div className="p-6 border-b border-[#E8DCCB] bg-[#F8F4ED]/60">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 group cursor-pointer text-left w-full"
            title="Return to GLOWVERSE Storefront"
          >
            <div>
              <div className="font-serif text-xl tracking-tight text-[#302B27] group-hover:text-[#96734C] transition-colors flex items-center gap-1.5">
                <span>GLOWVERSE</span>
                <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-[#96734C] border border-[#C6A77D]/60 px-1 py-0.2 rounded">
                  AI
                </span>
              </div>
              <div className="text-[10.5px] text-[#302B27]/60 tracking-wider uppercase mt-0.5 font-medium flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-[#96734C] group-hover:-translate-x-0.5 transition-transform" />
                <span>Editorial Storefront</span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin">
          {PRIMARY_NAV_ITEMS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#96734C]">
                {section.category}
              </div>

              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const active = isScreenActive(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-[#302B27] text-[#FFFFFF] shadow-xs'
                          : 'text-[#302B27]/80 hover:bg-[#F8F4ED] hover:text-[#302B27]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#C6A77D]' : 'text-[#302B27]/60'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && !active && (
                        <span className="text-[9px] font-semibold tracking-wider uppercase text-[#96734C] bg-[#F8F4ED] border border-[#E8DCCB] px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}

                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#C6A77D]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Anchor */}
      <div className="p-4 border-t border-[#E8DCCB] bg-[#F8F4ED]/50">
        {user ? (
          <div
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E8DCCB] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#302B27] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user.displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#302B27] truncate">
                {user.displayName}
              </div>
              <div className="text-[10px] text-[#302B27]/60 truncate">
                {user.email}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-2 bg-[#96734C] hover:bg-[#80603D] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-colors cursor-pointer text-center"
          >
            Sign In / Register
          </button>
        )}
      </div>

    </aside>
  );
};
