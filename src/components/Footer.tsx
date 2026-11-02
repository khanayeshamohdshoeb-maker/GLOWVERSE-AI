import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-[#302B27] text-[#E8DCCB] border-t border-[#302B27]/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8DCCB]/20">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="font-serif text-2xl text-[#FFFFFF] tracking-wide flex items-center gap-2">
              <span>GLOWVERSE</span>
              <span className="text-[10px] tracking-widest font-sans font-semibold text-[#C6A77D] border border-[#C6A77D]/60 px-1.5 py-0.5 rounded">AI</span>
            </div>
            <p className="text-xs text-[#E8DCCB]/70 leading-relaxed font-sans">
              Your Skin. Your Style. Your Smarter Beauty Journey. An international luxury beauty intelligence and smart eCommerce platform connecting precision skin diagnostics with clean formulation science.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C6A77D] pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Ethical AI · Zero Insecurity Marketing</span>
            </div>
          </div>

          {/* Experience Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FFFFFF]">Beauty Intelligence</div>
            <ul className="space-y-2 text-xs text-[#E8DCCB]/80 font-sans">
              <li>
                <button onClick={() => navigateTo('skin-upload')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  AI Skin Intelligence Scan
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('routines')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Smart Routine Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('virtual-studio')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Virtual Beauty Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('budget-guardian')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Beauty Budget Guardian
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('assistant')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Cosmetic Science Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FFFFFF]">Formulations & Discover</div>
            <ul className="space-y-2 text-xs text-[#E8DCCB]/80 font-sans">
              <li>
                <button onClick={() => navigateTo('products')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Curated Product Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ingredients')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Ingredient Intelligence Library
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('journal')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Personal Beauty Journal
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('dashboard')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer text-left">
                  Personal Beauty Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy, Ethics & Trust */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#FFFFFF]">Trust & Data Rights</div>
            <p className="text-xs text-[#E8DCCB]/70 leading-relaxed font-sans">
              We uphold strict privacy standards. Facial scans are processed ephemerally with zero permanent image retention unless explicitly requested.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('privacy')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#433C37] hover:bg-[#524943] text-white text-xs rounded transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#C6A77D]" />
                <span>Privacy & Data Controls</span>
              </button>
            </div>
          </div>

        </div>

        {/* Regulatory & Scientific Disclaimer */}
        <div className="py-6 border-b border-[#E8DCCB]/15 text-[11px] text-[#E8DCCB]/60 leading-relaxed font-sans">
          <strong className="text-[#E8DCCB]/90 font-medium">Cosmetic Disclaimer:</strong> GLOWVERSE AI provides optical cosmetic assessments and formulation education for personal routine guidance only. It does not provide medical diagnosis, dermatological clinical evaluation, or prescribe treatment for skin conditions. If you experience persistent dermatological conditions, eczema, severe acne, or unusual skin lesions, consult a board-certified dermatologist.
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8DCCB]/50 gap-4">
          <div>© {new Date().getFullYear()} GLOWVERSE AI. All rights reserved. Crafted for luxury beauty intelligence.</div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('privacy')} className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo('privacy')} className="hover:text-[#FFFFFF] transition-colors">Terms of Service</button>
            <button onClick={() => navigateTo('privacy')} className="hover:text-[#FFFFFF] transition-colors">Ethical AI Charter</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
