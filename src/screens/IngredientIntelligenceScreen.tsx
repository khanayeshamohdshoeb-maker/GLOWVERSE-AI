import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Ingredient } from '../types.ts';
import { LuxuryProductCard } from '../components/LuxuryProductCard.tsx';
import {
  FlaskConical,
  Search,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export const IngredientIntelligenceScreen: React.FC = () => {
  const { ingredients, products, selectedIngredientId, navigateTo } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeIngredientId, setActiveIngredientId] = useState<string>(
    selectedIngredientId || ingredients[0]?.id || 'niacinamide'
  );

  const CATEGORIES = ['All', 'Hydrators', 'Barrier Repair', 'Antioxidants', 'Anti-Aging', 'Exfoliants', 'Soothing'];

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch =
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || ing.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeIngredient =
    ingredients.find(i => i.id === activeIngredientId) || ingredients[0];

  // Linked catalogue products
  const relatedProducts = products.filter(p =>
    p.keyIngredients.some(k =>
      k.toLowerCase().includes(activeIngredient?.name.toLowerCase().split(' ')[0] || '')
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Formulation Encyclopedia
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            Ingredient Intelligence Library
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
            Demystifying skincare chemistry with peer-reviewed references, formulation guidelines, and ingredient compatibility.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search active ingredients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E8DCCB] rounded-lg text-xs text-[#302B27] placeholder:text-[#302B27]/40 focus:outline-[#96734C]"
          />
          <Search className="w-4 h-4 text-[#302B27]/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-medium">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-[#302B27] text-white border-[#302B27] font-semibold'
                : 'bg-white text-[#302B27]/80 border-[#E8DCCB] hover:border-[#96734C]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Master-Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of Ingredients (4 cols) */}
        <div className="lg:col-span-4 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredIngredients.map(ing => {
            const isActive = ing.id === activeIngredient?.id;
            return (
              <div
                key={ing.id}
                onClick={() => setActiveIngredientId(ing.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFFFF] border-[#96734C] shadow-sm'
                    : 'bg-[#F8F4ED] border-[#E8DCCB] hover:bg-[#FFFFFF]'
                }`}
              >
                <div className="flex justify-between items-center text-[11px] text-[#96734C] font-semibold uppercase tracking-wider mb-1">
                  <span>{ing.category}</span>
                  <span className="text-[#302B27]/50 font-normal">{ing.optimalConcentration}</span>
                </div>
                <h4 className="font-serif text-base text-[#302B27]">{ing.name}</h4>
                <p className="text-xs text-[#302B27]/70 line-clamp-2 mt-1 leading-normal">
                  {ing.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane (8 cols) */}
        {activeIngredient && (
          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-8 shadow-xs space-y-8">
            
            {/* Header info */}
            <div className="border-b border-[#E8DCCB] pb-6 space-y-2">
              <span className="text-xs font-semibold text-[#96734C] uppercase tracking-widest">
                {activeIngredient.category}
              </span>
              <h2 className="text-3xl font-serif text-[#302B27]">{activeIngredient.name}</h2>
              <p className="text-sm text-[#302B27]/80 leading-relaxed font-sans pt-1">
                {activeIngredient.description}
              </p>
            </div>

            {/* Scientific Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-2">
                <h4 className="font-semibold text-[#302B27]">Common Cosmetic Uses</h4>
                <ul className="space-y-1 text-[#302B27]/75">
                  {activeIngredient.commonUses.map((use, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#96734C]">✦</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-2">
                <h4 className="font-semibold text-[#302B27]">Formulation & Optimal Strength</h4>
                <p className="text-[#302B27]/75 leading-relaxed">
                  {activeIngredient.formulationDetails}
                </p>
                <div className="pt-2 text-[#96734C] font-semibold">
                  Standard Concentration: {activeIngredient.optimalConcentration}
                </div>
              </div>

            </div>

            {/* Precautions & Compatibility */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-[#302B27]">Safety, Precautions & Mixing Science</h3>
              
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Important Precautions & Contraindications</span>
                </div>
                <ul className="space-y-1 text-amber-800">
                  {activeIngredient.precautions.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span>·</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Pairs Wonderfully With:</span>
                  </div>
                  <p className="text-[#302B27]/75">
                    {activeIngredient.compatibleWith.length > 0
                      ? activeIngredient.compatibleWith.join(' · ')
                      : 'Universally tolerated across all skincare formulations.'}
                  </p>
                </div>

                <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-800">
                    <XCircle className="w-4 h-4 text-rose-700" />
                    <span>Space Apart From:</span>
                  </div>
                  <p className="text-[#302B27]/75">
                    {activeIngredient.avoidMixingWith.length > 0
                      ? activeIngredient.avoidMixingWith.join(' · ')
                      : 'No severe active clashes noted under typical cosmetic concentrations.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Peer-Reviewed References */}
            <div className="pt-4 border-t border-[#E8DCCB] space-y-2 text-xs">
              <h4 className="font-semibold text-[#302B27]">Scientific Citations & Literature Sources:</h4>
              <ul className="space-y-1 text-[#302B27]/60 italic font-mono text-[11px]">
                {activeIngredient.referenceSources.map((ref, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#96734C]" />
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Linked Formulations in Catalogue */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-[#E8DCCB] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg text-[#302B27]">
                    Formulations Containing {activeIngredient.name.split(' ')[0]}
                  </h3>
                  <button
                    onClick={() => navigateTo('products')}
                    className="text-xs text-[#96734C] font-semibold hover:underline"
                  >
                    View Catalogue →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedProducts.slice(0, 2).map(prod => (
                    <LuxuryProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
