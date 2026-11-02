import React from 'react';
import { Product } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { Heart, Plus, Scale, Sparkles, Check } from 'lucide-react';

interface Props {
  product: Product;
  featured?: boolean;
}

export const LuxuryProductCard: React.FC<Props> = ({ product }) => {
  const {
    navigateTo,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToBudget,
    toggleCompareProduct,
    compareProductIds
  } = useApp();

  const isWished = isInWishlist(product.id);
  const isCompared = compareProductIds.includes(product.id);

  // High-fidelity luxury cosmetic vector illustration for reliable rendering
  const renderProductIllustration = () => {
    switch (product.category) {
      case 'Serums':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8F4ED] to-[#E8DCCB]/40 group-hover:scale-105 transition-transform duration-500">
            {/* Ambient luxury halo */}
            <div className="absolute w-32 h-32 rounded-full bg-[#C6A77D]/15 blur-2xl pointer-events-none" />
            <svg viewBox="0 0 160 220" className="w-28 h-40 drop-shadow-md">
              {/* Dropper Cap */}
              <rect x="68" y="10" width="24" height="26" rx="4" fill="#302B27" />
              <rect x="74" y="4" width="12" height="8" rx="2" fill="#96734C" />
              <rect x="64" y="36" width="32" height="6" rx="1" fill="#C6A77D" />
              {/* Glass Bottle Body */}
              <rect x="45" y="42" width="70" height="135" rx="10" fill="#96734C" opacity="0.85" />
              <rect x="49" y="46" width="62" height="127" rx="8" fill="#B38F64" opacity="0.3" />
              {/* Liquid Level */}
              <path d="M 45 95 Q 80 90 115 95 L 115 167 Q 115 177 105 177 L 55 177 Q 45 177 45 167 Z" fill="#D4AF37" opacity="0.6" />
              {/* Luxury Label */}
              <rect x="52" y="90" width="56" height="65" rx="3" fill="#F8F4ED" />
              <line x1="58" y1="102" x2="102" y2="102" stroke="#302B27" strokeWidth="1.5" />
              <line x1="62" y1="112" x2="98" y2="112" stroke="#96734C" strokeWidth="1" />
              <line x1="65" y1="120" x2="95" y2="120" stroke="#96734C" strokeWidth="0.8" />
              <circle cx="80" cy="138" r="4" fill="#C6A77D" />
            </svg>
          </div>
        );
      case 'Moisturisers':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8F4ED] to-[#E8DCCB]/40 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute w-32 h-32 rounded-full bg-[#EAD9D2]/40 blur-2xl pointer-events-none" />
            <svg viewBox="0 0 180 200" className="w-32 h-36 drop-shadow-md">
              {/* Frosted Jar Lid */}
              <rect x="40" y="55" width="100" height="22" rx="4" fill="#C6A77D" />
              <rect x="44" y="50" width="92" height="5" rx="2" fill="#E8DCCB" />
              {/* Glass Jar Body */}
              <path d="M 32 80 L 148 80 L 142 145 Q 140 160 120 160 L 60 160 Q 40 160 38 145 Z" fill="#FFFFFF" stroke="#E8DCCB" strokeWidth="2" />
              {/* Velvet Cream Texture Fill */}
              <path d="M 40 85 L 140 85 L 136 138 Q 134 150 116 150 L 64 150 Q 46 150 44 138 Z" fill="#F8F4ED" />
              {/* Minimalist Label */}
              <rect x="55" y="100" width="70" height="36" rx="2" fill="#F8F4ED" stroke="#E8DCCB" strokeWidth="1" />
              <line x1="65" y1="112" x2="115" y2="112" stroke="#302B27" strokeWidth="1.2" />
              <line x1="72" y1="122" x2="108" y2="122" stroke="#96734C" strokeWidth="0.8" />
            </svg>
          </div>
        );
      case 'Cleansers':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8F4ED] to-[#E8DCCB]/40 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute w-32 h-32 rounded-full bg-[#E8DCCB]/30 blur-2xl pointer-events-none" />
            <svg viewBox="0 0 160 220" className="w-28 h-40 drop-shadow-md">
              {/* Pump Dispenser */}
              <path d="M 60 20 L 85 20 L 85 35 L 75 35 L 75 42 L 85 42 L 85 35 L 100 35 L 100 20" fill="none" stroke="#302B27" strokeWidth="3" strokeLinecap="round" />
              <rect x="68" y="42" width="24" height="12" rx="2" fill="#C6A77D" />
              {/* Tall Bottle Body */}
              <rect x="42" y="54" width="76" height="135" rx="14" fill="#FFFFFF" stroke="#E8DCCB" strokeWidth="1.5" />
              {/* Rose hydrosol soft gradient */}
              <rect x="46" y="58" width="68" height="127" rx="10" fill="#EAD9D2" opacity="0.35" />
              {/* Minimalist Label */}
              <rect x="52" y="96" width="56" height="60" rx="2" fill="#FFFFFF" />
              <line x1="60" y1="112" x2="100" y2="112" stroke="#302B27" strokeWidth="1.5" />
              <line x1="64" y1="122" x2="96" y2="122" stroke="#96734C" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'Sunscreens':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8F4ED] to-[#E8DCCB]/40 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute w-32 h-32 rounded-full bg-[#C6A77D]/25 blur-2xl pointer-events-none" />
            <svg viewBox="0 0 160 220" className="w-28 h-40 drop-shadow-md">
              {/* Squeeze Tube Cap */}
              <rect x="60" y="155" width="40" height="25" rx="3" fill="#302B27" />
              {/* Tube Body */}
              <path d="M 50 40 L 110 40 L 100 155 L 60 155 Z" fill="#F8F4ED" stroke="#E8DCCB" strokeWidth="1.5" />
              {/* Golden Sun Symbol */}
              <circle cx="80" cy="85" r="14" fill="#C6A77D" opacity="0.8" />
              <line x1="65" y1="115" x2="95" y2="115" stroke="#302B27" strokeWidth="1.5" />
              <line x1="70" y1="125" x2="90" y2="125" stroke="#96734C" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'Lip care':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8F4ED] to-[#E8DCCB]/40 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute w-32 h-32 rounded-full bg-[#EAD9D2]/60 blur-2xl pointer-events-none" />
            <svg viewBox="0 0 160 200" className="w-24 h-36 drop-shadow-md">
              {/* Gold Cap */}
              <rect x="62" y="30" width="36" height="42" rx="4" fill="#C6A77D" />
              <rect x="64" y="32" width="32" height="38" rx="2" fill="#E8DCCB" opacity="0.4" />
              {/* Glass Vial with Rosy Plump Nectar */}
              <rect x="56" y="72" width="48" height="90" rx="8" fill="#FFFFFF" stroke="#E8DCCB" strokeWidth="1.5" />
              <rect x="60" y="76" width="40" height="82" rx="6" fill="#C25A68" opacity="0.45" />
              <circle cx="80" cy="116" r="6" fill="#FFFFFF" opacity="0.6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F8F4ED] to-[#E8DCCB]/40 group-hover:scale-105 transition-transform duration-500">
            <div className="w-24 h-24 rounded-full border border-[#C6A77D]/40 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#96734C]" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="group relative bg-[#FFFFFF] border border-[#E8DCCB] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#C6A77D] hover:shadow-md transition-all duration-300">
      
      {/* Top Image Canvas (70% of card visual) */}
      <div
        onClick={() => navigateTo('product-detail', { productId: product.id })}
        className="relative w-full h-64 overflow-hidden cursor-pointer"
      >
        {renderProductIllustration()}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E8DCCB] text-[#302B27] hover:text-[#96734C] transition-colors cursor-pointer z-10"
          title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-[#96734C] text-[#96734C]' : ''}`} />
        </button>

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompareProduct(product.id);
          }}
          className={`absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-sm border text-[11px] font-medium transition-colors cursor-pointer z-10 flex items-center gap-1 ${
            isCompared
              ? 'bg-[#302B27] text-white border-[#302B27]'
              : 'bg-[#FFFFFF]/90 text-[#302B27]/70 border-[#E8DCCB] hover:text-[#302B27]'
          }`}
          title="Compare product"
          aria-label="Compare product"
        >
          {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
        </button>

        {/* Volume & Texture subtle badge */}
        <div className="absolute bottom-3 left-3 text-[11px] text-[#302B27]/60 bg-[#FFFFFF]/80 backdrop-blur-xs px-2 py-0.5 rounded">
          {product.volume}
        </div>
      </div>

      {/* Product Information Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3 border-t border-[#E8DCCB]/60">
        <div>
          {/* Brand & Category in unboxed text */}
          <div className="flex items-center gap-1.5 text-xs text-[#96734C] font-semibold tracking-wider uppercase mb-1">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#302B27]/50 font-normal">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="text-[15px] font-semibold text-[#302B27] hover:text-[#96734C] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Key Actives Snippet */}
          <p className="text-xs text-[#302B27]/65 line-clamp-1 mt-1">
            {product.keyIngredients.join(' · ')}
          </p>
        </div>

        {/* Price & Primary Purchase Actions */}
        <div className="pt-2 border-t border-[#E8DCCB]/40 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-[#302B27] tabular-nums">
              {formatPrice(product.priceINR)}
            </div>
            <div className="text-[11px] text-[#302B27]/50">
              ★ {product.rating} ({product.reviewsCount})
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToBudget(product.id)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#302B27] bg-[#F8F4ED] border border-[#E8DCCB] hover:border-[#96734C] rounded transition-colors cursor-pointer"
              title="Add to Budget Guardian"
            >
              Budget
            </button>
            <button
              onClick={() => addToCart(product)}
              className="px-3 py-1.5 text-xs font-semibold tracking-wide text-[#FFFFFF] bg-[#302B27] hover:bg-[#96734C] rounded transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bag</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
