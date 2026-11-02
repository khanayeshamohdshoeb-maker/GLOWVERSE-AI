import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  Layers,
  ShoppingBag,
  FlaskConical,
  BookOpen,
  Calculator,
  Palette,
  CheckCircle2,
  Circle,
  ArrowRight,
  User,
  Heart,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    profile,
    activeAnalysis,
    routines,
    toggleRoutineStep,
    journalEntries,
    budgetItems,
    targetBudget,
    products,
    wishlist,
    formatPrice,
    navigateTo
  } = useApp();

  const currentRoutine = routines[0];
  const latestJournal = journalEntries[0];

  // Calculate budget allocation
  const allocatedBudgetINR = budgetItems.reduce((sum, item) => {
    const prod = products.find(p => p.id === item.productId);
    return sum + (prod ? prod.priceINR * item.quantity : 0);
  }, 0);
  const budgetUsagePercent = Math.min(100, Math.round((allocatedBudgetINR / targetBudget) * 100));

  // Wishlist products
  const favouriteProducts = products.filter(p => wishlist.includes(p.id)).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Elegant Welcome Header */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Personal Beauty Stewardship
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
            Welcome, {user?.displayName || 'Beauty Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans max-w-xl">
            Your centralized intelligence workspace uniting calibrated optical metrics, daily routine checklists, and formulation stewardship.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigateTo('skin-upload')}
            className="px-5 py-2.5 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#C6A77D]" />
            <span>Launch Skin Scan</span>
          </button>
          <button
            onClick={() => navigateTo('routines')}
            className="px-5 py-2.5 bg-[#F8F4ED] hover:bg-[#E8DCCB] text-[#302B27] border border-[#E8DCCB] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Routine Studio
          </button>
        </div>
      </div>

      {/* 2. Profile Summary Bar */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB] mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#96734C]" />
            <h3 className="font-serif font-bold text-sm text-[#302B27]">Skin Profile Parameters</h3>
          </div>
          <button
            onClick={() => navigateTo('profile')}
            className="text-xs text-[#96734C] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Edit Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60">
            <div className="text-[10.5px] uppercase tracking-wider text-[#302B27]/60">Skin Type</div>
            <div className="font-bold text-[#302B27] text-sm mt-0.5">{profile.skinType || 'Combination'}</div>
          </div>

          <div className="p-3 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60">
            <div className="text-[10.5px] uppercase tracking-wider text-[#302B27]/60">Primary Focus</div>
            <div className="font-bold text-[#302B27] text-sm mt-0.5 truncate">
              {profile.skinConcerns?.slice(0, 2).join(', ') || 'Barrier Health'}
            </div>
          </div>

          <div className="p-3 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60">
            <div className="text-[10.5px] uppercase tracking-wider text-[#302B27]/60">Routine Level</div>
            <div className="font-bold text-[#302B27] text-sm mt-0.5 truncate">
              {profile.routinePreference?.split(' ')[0] || 'Standard'}
            </div>
          </div>

          <div className="p-3 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60">
            <div className="text-[10.5px] uppercase tracking-wider text-[#302B27]/60">Monthly Budget</div>
            <div className="font-bold text-[#96734C] text-sm mt-0.5 tabular-nums">
              {formatPrice(targetBudget)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Balanced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Skin Analysis & Routine Checklist */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Latest Skin Intelligence Card */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#96734C]">
                  Optical Diagnostics
                </span>
                <h3 className="font-serif text-xl text-[#302B27] mt-0.5">
                  Latest Skin Intelligence Report
                </h3>
              </div>
              {activeAnalysis ? (
                <div className="px-3 py-1 rounded-xl bg-[#F8F4ED] border border-[#E8DCCB] text-xs font-bold text-[#302B27] tabular-nums">
                  Score: {activeAnalysis.overallScore} / 100
                </div>
              ) : (
                <span className="text-xs text-[#302B27]/60 font-sans">Pre-calibrated Model Active</span>
              )}
            </div>

            {activeAnalysis ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60 space-y-0.5">
                    <div className="text-[11px] text-[#302B27]/60">Surface Texture</div>
                    <div className="text-lg font-bold text-[#302B27] tabular-nums">
                      {activeAnalysis.parameters.texture.score}%
                    </div>
                    <div className="text-[10px] text-[#96734C] truncate">{activeAnalysis.parameters.texture.label}</div>
                  </div>
                  <div className="p-3.5 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60 space-y-0.5">
                    <div className="text-[11px] text-[#302B27]/60">Radiance & Glow</div>
                    <div className="text-lg font-bold text-[#302B27] tabular-nums">
                      {activeAnalysis.parameters.radiance.score}%
                    </div>
                    <div className="text-[10px] text-[#96734C] truncate">{activeAnalysis.parameters.radiance.label}</div>
                  </div>
                  <div className="p-3.5 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60 space-y-0.5">
                    <div className="text-[11px] text-[#302B27]/60">Barrier Hydration</div>
                    <div className="text-lg font-bold text-[#302B27] tabular-nums">
                      {activeAnalysis.parameters.hydration.score}%
                    </div>
                    <div className="text-[10px] text-[#96734C] truncate">{activeAnalysis.parameters.hydration.label}</div>
                  </div>
                  <div className="p-3.5 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60 space-y-0.5">
                    <div className="text-[11px] text-[#302B27]/60">Tone Uniformity</div>
                    <div className="text-lg font-bold text-[#302B27] tabular-nums">
                      {activeAnalysis.parameters.redness.score}%
                    </div>
                    <div className="text-[10px] text-[#96734C] truncate">{activeAnalysis.parameters.redness.label}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs pt-2 gap-2">
                  <span className="text-[#302B27]/60">
                    Conducted: {new Date(activeAnalysis.analyzedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => navigateTo('skin-results')}
                    className="text-[#96734C] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Full 8-Parameter Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3 bg-[#F8F4ED]/40 rounded-xl p-6 border border-dashed border-[#E8DCCB]">
                <p className="text-xs text-[#302B27]/70 max-w-md mx-auto leading-relaxed">
                  No personal optical scan has been recorded yet. Launch our cosmetic skin intelligence scanner to receive non-clinical optical feedback and custom ingredient pairings.
                </p>
                <button
                  onClick={() => navigateTo('skin-upload')}
                  className="px-6 py-2.5 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Start Your First Analysis
                </button>
              </div>
            )}
          </div>

          {/* Routine Studio Daily Tracker */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#96734C]">
                  Daily Ritual
                </span>
                <h3 className="font-serif text-xl text-[#302B27] mt-0.5">
                  Today's Skincare Sequence
                </h3>
              </div>
              <button
                onClick={() => navigateTo('routines')}
                className="text-xs text-[#96734C] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Routine Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentRoutine ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#302B27]">
                  <span>{currentRoutine.name}</span>
                  <span className="text-[11px] text-[#96734C]">Click to check off completed steps</span>
                </div>
                <div className="space-y-2">
                  {currentRoutine.items.slice(0, 5).map(step => (
                    <div
                      key={step.id}
                      onClick={() => toggleRoutineStep(currentRoutine.id, step.id)}
                      className="p-3.5 bg-[#F8F4ED]/50 border border-[#E8DCCB] rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#F8F4ED] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-[#96734C] shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#302B27]/30 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className={`text-xs font-semibold truncate ${step.isCompleted ? 'line-through text-[#302B27]/50' : 'text-[#302B27]'}`}>
                            Step {step.stepNumber}: {step.stepName}
                          </div>
                          <div className="text-[11px] text-[#302B27]/60 truncate">{step.productName}</div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-[#96734C] tracking-wider px-2 py-0.5 rounded-lg bg-white border border-[#E8DCCB] shrink-0 ml-2">
                        {step.timeOfDay}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#302B27]/60">
                No routine created yet. Create a morning or evening sequence in the Routine Studio.
              </div>
            )}
          </div>

          {/* Product Favourites Carousel */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#96734C]" />
                <h3 className="font-serif font-bold text-base text-[#302B27]">Saved Formulations (Wishlist)</h3>
              </div>
              <button
                onClick={() => navigateTo('products')}
                className="text-xs text-[#96734C] font-semibold hover:underline"
              >
                Browse Catalog →
              </button>
            </div>

            {favouriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {favouriteProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigateTo('product-detail', { productId: p.id })}
                    className="p-3 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] hover:border-[#96734C] cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#96734C]">
                        {p.brand}
                      </div>
                      <div className="text-xs font-semibold text-[#302B27] mt-0.5 line-clamp-1">
                        {p.name}
                      </div>
                    </div>
                    <div className="pt-2 text-xs font-bold text-[#302B27] tabular-nums flex justify-between items-center">
                      <span>{formatPrice(p.priceINR)}</span>
                      <span className="text-[10px] text-[#96734C]">View Details</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[#302B27]/60">
                No items saved to your wishlist yet.
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Budget Guardian Snapshot & Quick Links */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Budget Guardian Widget */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#96734C]">
                  Formulation Stewardship
                </span>
                <h3 className="font-serif text-lg text-[#302B27] mt-0.5">Budget Guardian</h3>
              </div>
              <Calculator className="w-5 h-5 text-[#96734C]" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#302B27]/70">Allocated Cart:</span>
                <span className="text-base font-bold text-[#302B27] tabular-nums">
                  {formatPrice(allocatedBudgetINR)}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-xs text-[#302B27]/60">
                <span>Monthly Target:</span>
                <span className="tabular-nums font-semibold">{formatPrice(targetBudget)}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#F8F4ED] rounded-full overflow-hidden border border-[#E8DCCB]">
                <div
                  className={`h-full transition-all duration-300 ${
                    budgetUsagePercent > 90 ? 'bg-amber-600' : 'bg-[#96734C]'
                  }`}
                  style={{ width: `${budgetUsagePercent}%` }}
                />
              </div>

              <div className="text-[11px] text-[#302B27]/60 flex items-center justify-between pt-1">
                <span>{budgetUsagePercent}% Utilized</span>
                <span className="font-semibold text-[#96734C]">
                  {formatPrice(Math.max(0, targetBudget - allocatedBudgetINR))} Remaining
                </span>
              </div>

              <button
                onClick={() => navigateTo('budget-guardian')}
                className="w-full py-2.5 bg-[#F8F4ED] hover:bg-[#E8DCCB] text-[#302B27] border border-[#E8DCCB] text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors mt-2 cursor-pointer"
              >
                Open Budget Guardian
              </button>
            </div>
          </div>

          {/* Quick-Action Cards */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="font-serif text-base text-[#302B27] border-b border-[#E8DCCB] pb-2">
              Studio & Intelligence
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => navigateTo('virtual-studio')}
                className="w-full p-3 bg-[#F8F4ED] hover:bg-[#E8DCCB]/60 rounded-xl text-left text-xs text-[#302B27] font-medium flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-[#96734C]" />
                  <span>Virtual Shade & Finish Studio</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#302B27]/40" />
              </button>

              <button
                onClick={() => navigateTo('ingredients')}
                className="w-full p-3 bg-[#F8F4ED] hover:bg-[#E8DCCB]/60 rounded-xl text-left text-xs text-[#302B27] font-medium flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FlaskConical className="w-4 h-4 text-[#96734C]" />
                  <span>Ingredient Encyclopedia (10 Actives)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#302B27]/40" />
              </button>

              <button
                onClick={() => navigateTo('assistant')}
                className="w-full p-3 bg-[#F8F4ED] hover:bg-[#E8DCCB]/60 rounded-xl text-left text-xs text-[#302B27] font-medium flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#96734C]" />
                  <span>AI Skincare Formulator Assistant</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#302B27]/40" />
              </button>

              <button
                onClick={() => navigateTo('journal')}
                className="w-full p-3 bg-[#F8F4ED] hover:bg-[#E8DCCB]/60 rounded-xl text-left text-xs text-[#302B27] font-medium flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#96734C]" />
                  <span>Personal Beauty Journal & Log</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#302B27]/40" />
              </button>
            </div>
          </div>

          {/* Educational Content Card */}
          <div className="bg-[#302B27] text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C6A77D]">
              Formulation Science Insight
            </div>
            <h4 className="font-serif text-base text-white">
              The 3:1:1 Ceramide Ratio
            </h4>
            <p className="text-xs text-[#E8DCCB]/80 leading-relaxed font-sans">
              To repair compromised stratum corneum lipids, topical moisturizers perform best with a physiological molar ratio of 3 Ceramides to 1 Cholesterol to 1 Free Fatty Acid.
            </p>
            <button
              onClick={() => navigateTo('ingredients', { ingredientId: 'ing-03' })}
              className="text-xs text-[#C6A77D] hover:underline font-semibold flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Explore Ceramide Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Latest Journal Snippet */}
          {latestJournal && (
            <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-[11px] text-[#302B27]/60">
                <span className="font-semibold uppercase tracking-wider text-[#96734C]">Latest Journal Note</span>
                <span>{new Date(latestJournal.date).toLocaleDateString()}</span>
              </div>
              <h4 className="text-xs font-semibold text-[#302B27]">{latestJournal.title}</h4>
              <p className="text-[11px] text-[#302B27]/70 line-clamp-2 leading-relaxed">
                {latestJournal.content}
              </p>
              <button
                onClick={() => navigateTo('journal')}
                className="text-[11px] font-semibold text-[#96734C] hover:underline pt-1 inline-block"
              >
                View all reflections →
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
