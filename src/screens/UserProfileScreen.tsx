import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Currency } from '../types.ts';
import { User, ShieldCheck, Check, Sparkles, DollarSign } from 'lucide-react';

export const UserProfileScreen: React.FC = () => {
  const { profile, updateProfile, user, logoutUser, formatPrice, navigateTo } = useApp();

  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [currency, setCurrency] = useState<Currency>(profile.currency || 'INR');
  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget || 5000);
  const [skinType, setSkinType] = useState(profile.skinType || 'Combination');
  const [routinePreference, setRoutinePreference] = useState(profile.routinePreference || 'Standard (5 steps)');

  const [beautyInterests, setBeautyInterests] = useState<string[]>(profile.beautyInterests || []);
  const [skinConcerns, setSkinConcerns] = useState<string[]>(profile.skinConcerns || []);
  const [ingredientPreferences, setIngredientPreferences] = useState<string[]>(profile.ingredientPreferences || []);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const ALL_INTERESTS = ['Skin Barrier Health', 'Clean Formulations', 'Radiance & Glow', 'Sun Defense', 'Minimalist Layering', 'Luxury Fragrance'];
  const ALL_CONCERNS = ['Dehydration', 'Fine Lines', 'Uneven Tone', 'Pores & Congestion', 'Sensitivity', 'Dullness'];
  const ALL_INGREDIENTS = ['Niacinamide', 'Hyaluronic Acid', 'Ceramides', 'Vitamin C', 'Peptides', 'Centella Asiatica', 'Squalane'];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      displayName,
      currency,
      monthlyBudget: Number(monthlyBudget),
      skinType: skinType as any,
      routinePreference: routinePreference as any,
      beautyInterests,
      skinConcerns,
      ingredientPreferences
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Editorial Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">Personal Beauty Profile</div>
          <h1 className="text-3xl font-serif text-[#302B27] mt-1">Curate Your Skincare Preferences</h1>
          <p className="text-xs text-[#302B27]/70 mt-1">
            Configure your beauty goals, preferred spending currency, and active ingredient interests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('privacy')}
            className="px-3.5 py-1.5 text-xs text-[#302B27] bg-[#FFFFFF] border border-[#E8DCCB] rounded hover:border-[#96734C] transition-colors"
          >
            Privacy Controls
          </button>
          <button
            onClick={logoutUser}
            className="px-3.5 py-1.5 text-xs text-red-700 bg-[#FFFFFF] border border-red-200 rounded hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Identity & Currency */}
        <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="font-serif text-lg text-[#302B27] border-b border-[#E8DCCB] pb-3">
            Account & Regional Currency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27] focus:outline-[#96734C]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">Registered Email</label>
              <input
                type="text"
                disabled
                value={user?.email || 'guest@glowverse.ai'}
                className="w-full px-3 py-2.5 bg-[#F8F4ED]/60 border border-[#E8DCCB] rounded text-xs text-[#302B27]/60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27] focus:outline-[#96734C]"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">
                Target Monthly Beauty Budget (in INR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={500}
                  step={250}
                  value={monthlyBudget}
                  onChange={e => setMonthlyBudget(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27] focus:outline-[#96734C]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#302B27]/50 tabular-nums">
                  ≈ {formatPrice(monthlyBudget)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skin Attributes */}
        <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="font-serif text-lg text-[#302B27] border-b border-[#E8DCCB] pb-3">
            Skin Characteristics & Ritual Complexity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">Primary Skin Profile</label>
              <select
                value={skinType}
                onChange={e => setSkinType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27] focus:outline-[#96734C]"
              >
                <option value="Combination">Combination (Balanced T-Zone & Cheeks)</option>
                <option value="Dry">Dry (Prone to tightness & flake)</option>
                <option value="Oily">Oily (Excess surface sebum)</option>
                <option value="Sensitive">Sensitive (Reactive to strong actives)</option>
                <option value="Normal">Normal (Comfortable balance)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">Routine Complexity Preference</label>
              <select
                value={routinePreference}
                onChange={e => setRoutinePreference(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27] focus:outline-[#96734C]"
              >
                <option value="Minimalist (3 steps)">Minimalist (3 steps: Cleanse, Hydrate, Protect)</option>
                <option value="Standard (5 steps)">Standard (5 steps: Cleanse, Essence, Serum, Cream, SPF)</option>
                <option value="Comprehensive (7+ steps)">Comprehensive (7+ steps: Targeted Multi-Step Ritual)</option>
              </select>
            </div>
          </div>

          {/* Skin Concerns multi-select */}
          <div>
            <label className="block text-xs font-medium text-[#302B27] mb-2">Primary Skin Focus Areas</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CONCERNS.map(item => {
                const active = skinConcerns.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(skinConcerns, setSkinConcerns, item)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer border ${
                      active
                        ? 'bg-[#302B27] text-white border-[#302B27]'
                        : 'bg-[#F8F4ED] text-[#302B27]/80 border-[#E8DCCB] hover:border-[#96734C]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredient preferences */}
          <div>
            <label className="block text-xs font-medium text-[#302B27] mb-2">Preferred Key Actives</label>
            <div className="flex flex-wrap gap-2">
              {ALL_INGREDIENTS.map(item => {
                const active = ingredientPreferences.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(ingredientPreferences, setIngredientPreferences, item)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer border ${
                      active
                        ? 'bg-[#96734C] text-white border-[#96734C]'
                        : 'bg-[#F8F4ED] text-[#302B27]/80 border-[#E8DCCB] hover:border-[#96734C]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Save button and feedback */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-[#302B27]/60">
            {savedSuccess && (
              <span className="text-[#96734C] font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved successfully
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-widest rounded transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {saving ? 'Updating Profile...' : 'Save Profile Preferences'}
          </button>
        </div>

      </form>
    </div>
  );
};
