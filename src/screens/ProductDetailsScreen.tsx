import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LuxuryProductCard } from '../components/LuxuryProductCard.tsx';
import {
  Heart,
  Plus,
  Scale,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Clock,
  Layers,
  FlaskConical,
  Calculator
} from 'lucide-react';

export const ProductDetailsScreen: React.FC = () => {
  const {
    selectedProductId,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToBudget,
    toggleCompareProduct,
    compareProductIds,
    navigateTo,
    showToast
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'usage' | 'science'>('ingredients');

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const isWished = isInWishlist(product.id);
  const isCompared = compareProductIds.includes(product.id);

  // Alternatives for Budget Guardian
  const alternatives = product.alternativeIds
    ? products.filter(p => product.alternativeIds?.includes(p.id))
    : [];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <button
        onClick={() => navigateTo('products')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#302B27]/70 hover:text-[#96734C] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to All Formulations</span>
      </button>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Gallery / Illustration Column (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="relative bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-10 flex items-center justify-center min-h-[420px] shadow-xs overflow-hidden">
            
            {/* Ambient halo */}
            <div className="absolute w-64 h-64 rounded-full bg-[#C6A77D]/10 blur-3xl pointer-events-none" />

            {/* Custom SVG Illustration */}
            <div className="relative z-10 scale-125">
              <svg viewBox="0 0 160 220" className="w-40 h-56 drop-shadow-xl">
                <rect x="68" y="10" width="24" height="26" rx="4" fill="#302B27" />
                <rect x="74" y="4" width="12" height="8" rx="2" fill="#96734C" />
                <rect x="64" y="36" width="32" height="6" rx="1" fill="#C6A77D" />
                <rect x="45" y="42" width="70" height="135" rx="10" fill="#96734C" opacity="0.85" />
                <rect x="49" y="46" width="62" height="127" rx="8" fill="#B38F64" opacity="0.3" />
                <path d="M 45 95 Q 80 90 115 95 L 115 167 Q 115 177 105 177 L 55 177 Q 45 177 45 167 Z" fill="#D4AF37" opacity="0.6" />
                <rect x="52" y="90" width="56" height="65" rx="3" fill="#F8F4ED" />
                <line x1="58" y1="102" x2="102" y2="102" stroke="#302B27" strokeWidth="1.5" />
                <line x1="62" y1="112" x2="98" y2="112" stroke="#96734C" strokeWidth="1" />
                <circle cx="80" cy="138" r="4" fill="#C6A77D" />
              </svg>
            </div>

            {/* Quick Actions Top Bar */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-[#FFFFFF] border border-[#E8DCCB] text-[#302B27]/70 hover:text-[#302B27] cursor-pointer"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-2 rounded-full bg-[#FFFFFF] border border-[#E8DCCB] text-[#302B27] hover:text-[#96734C] cursor-pointer"
                title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-[#96734C] text-[#96734C]' : ''}`} />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-[#302B27]/60 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded border border-[#E8DCCB]">
              Verified Formulation · {product.volume}
            </div>
          </div>
        </div>

        {/* Right Contiguous Purchase & Details Module (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-3 pb-6 border-b border-[#E8DCCB]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#96734C] uppercase tracking-widest">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#302B27]/60">{product.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-xs text-[#302B27]/70">
              <span className="font-semibold text-[#302B27]">★ {product.rating}</span>
              <span>({product.reviewsCount} verified reviews)</span>
              <span aria-hidden="true">·</span>
              <span>Texture: <strong className="text-[#302B27]">{product.texture}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Finish: <strong className="text-[#302B27]">{product.finish}</strong></span>
            </div>

            <div className="text-3xl font-bold text-[#302B27] tabular-nums pt-2">
              {formatPrice(product.priceINR)}
            </div>

            <p className="text-sm text-[#302B27]/80 leading-relaxed font-sans pt-1">
              {product.description}
            </p>
          </div>

          {/* Quantity & Bag / Budget Actions */}
          <div className="space-y-4 p-6 bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#302B27]">Quantity:</span>
                <div className="flex items-center border border-[#E8DCCB] rounded bg-[#F8F4ED]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-xs font-semibold text-[#302B27] hover:bg-[#E8DCCB] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-xs font-semibold text-[#302B27] hover:bg-[#E8DCCB] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToBudget(product.id, quantity)}
                  className="px-4 py-2.5 bg-[#F8F4ED] hover:bg-[#E8DCCB] border border-[#E8DCCB] text-[#302B27] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-[#96734C]" />
                  <span>Allocate to Budget</span>
                </button>

                <button
                  onClick={() => toggleCompareProduct(product.id)}
                  className={`px-3 py-2.5 border rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isCompared
                      ? 'bg-[#302B27] text-white border-[#302B27]'
                      : 'bg-[#FFFFFF] text-[#302B27] border-[#E8DCCB] hover:border-[#96734C]'
                  }`}
                  title="Compare product"
                >
                  <Scale className="w-4 h-4" />
                  <span>{isCompared ? 'In Compare Tray' : 'Compare'}</span>
                </button>
              </div>

            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="w-full py-3.5 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Shopping Bag ({formatPrice(product.priceINR * quantity)})</span>
            </button>
          </div>

          {/* Deep Tabs: Ingredients, How to Use, Formulation Science */}
          <div className="space-y-4">
            <div className="flex border-b border-[#E8DCCB] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'ingredients'
                    ? 'border-[#96734C] text-[#302B27]'
                    : 'border-transparent text-[#302B27]/50 hover:text-[#302B27]'
                }`}
              >
                Key Actives & Full INCI
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'usage'
                    ? 'border-[#96734C] text-[#302B27]'
                    : 'border-transparent text-[#302B27]/50 hover:text-[#302B27]'
                }`}
              >
                Application Ritual
              </button>
              <button
                onClick={() => setActiveTab('science')}
                className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'science'
                    ? 'border-[#96734C] text-[#302B27]'
                    : 'border-transparent text-[#302B27]/50 hover:text-[#302B27]'
                }`}
              >
                Compatibility & Suitability
              </button>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl text-xs space-y-4 leading-relaxed">
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#302B27] mb-2">Key Active Ingredients (Click to learn more):</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.keyIngredients.map(ing => (
                        <button
                          key={ing}
                          onClick={() => navigateTo('ingredients')}
                          className="px-3 py-1 bg-[#F8F4ED] hover:bg-[#E8DCCB] text-[#96734C] font-semibold rounded border border-[#E8DCCB] cursor-pointer"
                        >
                          {ing} →
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8DCCB]">
                    <h4 className="font-semibold text-[#302B27] mb-1">Complete INCI Formulation List:</h4>
                    <p className="text-[#302B27]/70 font-mono text-[11px] leading-relaxed">
                      {product.allIngredients.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#302B27]">Application Instructions:</h4>
                  <p className="text-[#302B27]/80">{product.howToUse}</p>
                  <div className="p-3 bg-[#F8F4ED] rounded-lg border border-[#E8DCCB] text-[#302B27]/70 mt-2">
                    <strong>Ritual Tip:</strong> For highest absorption, press into slightly damp skin rather than aggressively rubbing.
                  </div>
                </div>
              )}

              {activeTab === 'science' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-[#302B27]">Recommended Skin Profiles: </span>
                    <span>{product.skinTypes.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#302B27]">Targeted Skin Concerns: </span>
                    <span>{product.concerns.join(' · ')}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E8DCCB] text-[#302B27]/70">
                    Formulated without parabens, synthetic dyes, harsh phthalates, or artificial animal testing.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Budget Guardian Alternative Suggestions */}
          {alternatives.length > 0 && (
            <div className="p-6 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#96734C]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#96734C]">
                  Budget Guardian Smart Alternatives
                </span>
              </div>
              <p className="text-xs text-[#302B27]/70 leading-relaxed">
                Looking to maintain your monthly beauty budget? Here is a verified formulation featuring matching active ingredients at a lower price point:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map(alt => (
                  <div
                    key={alt.id}
                    onClick={() => navigateTo('product-detail', { productId: alt.id })}
                    className="p-4 bg-white border border-[#E8DCCB] rounded-lg hover:border-[#96734C] transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-[#96734C] uppercase">{alt.brand}</div>
                      <div className="text-xs font-semibold text-[#302B27] line-clamp-1">{alt.name}</div>
                      <div className="text-xs font-bold text-[#302B27] tabular-nums mt-1">{formatPrice(alt.priceINR)}</div>
                    </div>
                    <span className="text-xs text-[#96734C] font-semibold ml-2">Switch →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
