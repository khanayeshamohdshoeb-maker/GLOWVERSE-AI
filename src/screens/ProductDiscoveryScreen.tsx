import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LuxuryProductCard } from '../components/LuxuryProductCard.tsx';
import { Product } from '../types.ts';
import { Search, Filter, SlidersHorizontal, X, Sparkles, Scale } from 'lucide-react';

export const ProductDiscoveryScreen: React.FC = () => {
  const { products, formatPrice, compareProductIds, clearCompare } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('All');
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const CATEGORIES = ['All', 'Cleansers', 'Moisturisers', 'Sunscreens', 'Serums', 'Lip care', 'Makeup', 'Beauty accessories'];
  const CONCERNS = ['All', 'Dehydration', 'Dullness', 'Barrier Support', 'Fine Lines', 'Sun Protection', 'Pores & Congestion', 'Redness'];
  const SKIN_TYPES = ['All', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'];
  const INGREDIENTS = ['All', 'Hyaluronic Acid', 'Vitamin C', 'Ceramides', 'Niacinamide', 'Retinoids', 'Salicylic Acid', 'Peptides', 'Squalane'];

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.keyIngredients.some(i => i.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Concern
    if (selectedConcern !== 'All') {
      result = result.filter(p => p.concerns.some(c => c.toLowerCase() === selectedConcern.toLowerCase()));
    }

    // Skin Type
    if (selectedSkinType !== 'All') {
      result = result.filter(p => p.skinTypes.includes('All') || p.skinTypes.includes(selectedSkinType as any));
    }

    // Key Ingredient
    if (selectedIngredient !== 'All') {
      result = result.filter(p => p.keyIngredients.some(i => i.toLowerCase().includes(selectedIngredient.toLowerCase())));
    }

    // Price Limit
    result = result.filter(p => p.priceINR <= maxPriceLimit);

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedConcern, selectedSkinType, selectedIngredient, maxPriceLimit, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedConcern('All');
    setSelectedSkinType('All');
    setSelectedIngredient('All');
    setMaxPriceLimit(4000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Verified Formulations
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            Discover Formulations
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
            Luxury botanical skincare and high-potency actives with complete ingredient disclosures.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by product, active, or brand..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E8DCCB] rounded-lg text-xs text-[#302B27] placeholder:text-[#302B27]/40 focus:outline-[#96734C]"
          />
          <Search className="w-4 h-4 text-[#302B27]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#302B27]/40 hover:text-[#302B27]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Filter Bar (Interactive Controls) */}
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

      {/* Desktop & Mobile Filter Bar Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Skin Concern Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#302B27]/60 font-medium">Concern:</span>
            <select
              value={selectedConcern}
              onChange={e => setSelectedConcern(e.target.value)}
              className="bg-[#F8F4ED] border border-[#E8DCCB] rounded px-2.5 py-1 text-xs text-[#302B27] focus:outline-[#96734C]"
            >
              {CONCERNS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Skin Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#302B27]/60 font-medium">Skin Type:</span>
            <select
              value={selectedSkinType}
              onChange={e => setSelectedSkinType(e.target.value)}
              className="bg-[#F8F4ED] border border-[#E8DCCB] rounded px-2.5 py-1 text-xs text-[#302B27] focus:outline-[#96734C]"
            >
              {SKIN_TYPES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Ingredient Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#302B27]/60 font-medium">Key Active:</span>
            <select
              value={selectedIngredient}
              onChange={e => setSelectedIngredient(e.target.value)}
              className="bg-[#F8F4ED] border border-[#E8DCCB] rounded px-2.5 py-1 text-xs text-[#302B27] focus:outline-[#96734C]"
            >
              {INGREDIENTS.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E8DCCB]">
            <span className="text-[#302B27]/60 font-medium">Under:</span>
            <input
              type="range"
              min={600}
              max={4000}
              step={100}
              value={maxPriceLimit}
              onChange={e => setMaxPriceLimit(Number(e.target.value))}
              className="w-24 accent-[#96734C]"
            />
            <span className="font-semibold text-[#302B27] tabular-nums">{formatPrice(maxPriceLimit)}</span>
          </div>

        </div>

        {/* Sort and Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#302B27]/60 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#F8F4ED] border border-[#E8DCCB] rounded px-2.5 py-1 text-xs text-[#302B27] focus:outline-[#96734C]"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="text-xs text-[#96734C] hover:underline font-semibold cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Comparison Drawer Notification if active */}
      {compareProductIds.length > 0 && (
        <div className="p-3 bg-[#302B27] text-white rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#C6A77D]" />
            <span>Comparing {compareProductIds.length} formulations side-by-side</span>
          </div>
          <button
            onClick={clearCompare}
            className="text-[#C6A77D] hover:underline font-medium"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F8F4ED] flex items-center justify-center text-[#96734C] mx-auto">
            ✦
          </div>
          <h3 className="font-serif text-xl text-[#302B27]">No Formulations Match Your Criteria</h3>
          <p className="text-xs text-[#302B27]/70 max-w-sm mx-auto">
            Try adjusting your active concern, price slider, or search terms to uncover more verified skincare products.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#302B27] text-white text-xs font-semibold uppercase tracking-wider rounded"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <LuxuryProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
