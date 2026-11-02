import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Home,
  Sparkles,
  Layers,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { ScreenId } from '../types.ts';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  const navItems: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Editorial', icon: Home },
    { id: 'skin-upload', label: 'Skin Scan', icon: Sparkles },
    { id: 'routines', label: 'Routines', icon: Layers },
    { id: 'products', label: 'Shop', icon: ShoppingBag },
    { id: 'assistant', label: 'AI Advisor', icon: MessageSquare }
  ];

  const isItemActive = (id: ScreenId) => {
    if (id === 'skin-upload') return currentScreen === 'skin-upload' || currentScreen === 'skin-results';
    if (id === 'products') return currentScreen === 'products' || currentScreen === 'product-detail';
    return currentScreen === id;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E8DCCB] px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isItemActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all min-h-[44px] cursor-pointer ${
                active ? 'text-[#302B27]' : 'text-[#302B27]/50 hover:text-[#302B27]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-[#96734C]' : 'currentColor'}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#96734C]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 font-medium ${active ? 'font-semibold text-[#302B27]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
