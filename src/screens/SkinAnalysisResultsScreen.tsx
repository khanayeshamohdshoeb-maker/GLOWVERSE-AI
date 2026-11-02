import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LuxuryProductCard } from '../components/LuxuryProductCard.tsx';
import {
  Sparkles,
  Info,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';

export const SkinAnalysisResultsScreen: React.FC = () => {
  const { activeAnalysis, products, ingredients, navigateTo, showToast } = useApp();

  const [expandedParam, setExpandedParam] = useState<string | null>('hydration');

  // Fallback demo data if user visits directly without scanning
  const analysis = activeAnalysis || {
    id: 'analysis-sample-01',
    taskId: 'task-demo-default',
    mode: 'demo' as const,
    isDemo: true,
    analyzedAt: new Date().toISOString(),
    overallScore: 84,
    parameters: {
      texture: {
        score: 82,
        label: 'Refined Surface',
        explanation: 'Optical evaluation of surface micro-roughness. Higher score denotes smoother light reflectance across cheek and forehead zones.',
        limitation: 'Optical surface reflectance does not evaluate subsurface dermal cellular layers.'
      },
      radiance: {
        score: 86,
        label: 'Healthy Luminous Glow',
        explanation: 'Measures high-specular diffused light scatter, indicating balanced lipid balance and adequate stratum corneum hydration.',
        limitation: 'Lighting direction and environment ambient intensity can influence optical luminosity values.'
      },
      hydration: {
        score: 79,
        label: 'Moderate Dehydration',
        explanation: 'Superficial cutaneous moisture assessment based on micro-crease patterns and epidermal plumpness.',
        limitation: 'Non-invasive visual imaging estimates superficial barrier comfort; it does not replace corneometer capacitance measurements.'
      },
      fineLines: {
        score: 85,
        label: 'Minimal Expression Lines',
        explanation: 'Calculated contrast depth of dynamic and shallow static lines around periorbital and nasolabial contours.',
        limitation: 'Facial expressions during photo capture can cause slight metric variations.'
      },
      pores: {
        score: 88,
        label: 'Refined & Clear',
        explanation: 'Analyzes visual density and perimeter of follicular openings in the T-zone and central cheek region.',
        limitation: 'Camera sensor resolution and distance to lens directly impact pore diameter calculations.'
      },
      redness: {
        score: 91,
        label: 'Even & Calm Tone',
        explanation: 'Chroma distribution map evaluating capillary blushing or localized erythema across cheeks and nasal wings.',
        limitation: 'Cannot diagnose vascular conditions such as rosacea or dermatitis.'
      },
      firmness: {
        score: 83,
        label: 'Resilient Elasticity',
        explanation: 'Visual assessment of facial contour definition and gravitational sag markers along jawline.',
        limitation: 'Visual heuristics approximate skin resilience without physical elastometry testing.'
      },
      darkCircles: {
        score: 78,
        label: 'Mild Periorbital Shadowing',
        explanation: 'Chrominance contrast beneath lower eyelid margin, identifying vascular or structural shadow undertones.',
        limitation: 'Fatigue, bone structure, and ambient overhead shadows naturally accentuate periorbital depth.'
      }
    },
    recommendedIngredientIds: ['hyaluronic-acid', 'ceramides', 'niacinamide', 'vitamin-c'],
    recommendedProductIds: ['prod-01', 'prod-02', 'prod-03', 'prod-05'],
    disclaimer: 'This cosmetic analysis is an optical evaluation for personal beauty routine guidance only and does NOT constitute medical diagnosis or clinical advice.'
  };

  const paramEntries = Object.entries(analysis.parameters) as [string, typeof analysis.parameters.texture][];

  // Matched products for Skin-to-Shelf
  const matchedProducts = products.filter(p => analysis.recommendedProductIds.includes(p.id));
  const matchedIngredients = ingredients.filter(i => analysis.recommendedIngredientIds.includes(i.id));

  const handleSaveToJournal = () => {
    showToast('Saved analysis summary to your personal beauty journal', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Banner with Mode & Date */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-[#302B27]/70 font-sans">
            <span className="font-bold uppercase tracking-wider text-[#96734C]">
              {analysis.isDemo ? 'DEMO SIMULATION MODE' : 'LIVE YOUCAM API SCAN'}
            </span>
            <span aria-hidden="true">·</span>
            <span>Conducted on {new Date(analysis.analyzedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
            Skin Intelligence Assessment
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
            Optical evaluation of 8 skin surface markers synthesized into personalized formulation guidance.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-[#96734C] font-semibold">Overall Index</div>
            <div className="text-4xl font-serif text-[#302B27] tabular-nums font-bold">
              {analysis.overallScore}<span className="text-lg text-[#302B27]/50 font-sans font-normal"> / 100</span>
            </div>
          </div>
          <button
            onClick={handleSaveToJournal}
            className="p-3 bg-[#F8F4ED] hover:bg-[#E8DCCB] border border-[#E8DCCB] rounded-lg text-[#302B27] transition-colors cursor-pointer"
            title="Save to Journal"
          >
            <Bookmark className="w-5 h-5 text-[#96734C]" />
          </button>
        </div>
      </div>

      {/* 2. Parameters Radar & Explain My Skin Deep Dive */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
              Explain My Skin (Feature C)
            </div>
            <h2 className="text-2xl font-serif text-[#302B27]">
              8-Parameter Optical Breakdown & Scientific Scope
            </h2>
          </div>
          <span className="text-xs text-[#302B27]/60 hidden sm:inline-block">Click any metric to inspect biological scope & limitations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paramEntries.map(([key, param]) => {
            const isExpanded = expandedParam === key;
            return (
              <div
                key={key}
                className={`bg-[#FFFFFF] border rounded-xl p-5 transition-all cursor-pointer ${
                  isExpanded ? 'border-[#96734C] shadow-sm' : 'border-[#E8DCCB] hover:border-[#C6A77D]'
                }`}
                onClick={() => setExpandedParam(isExpanded ? null : key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold capitalize text-[#302B27]">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-xs text-[#96734C] font-medium">({param.label})</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#F8F4ED] rounded-full overflow-hidden border border-[#E8DCCB] mt-2 max-w-xs">
                      <div
                        className="h-full bg-[#96734C] rounded-full transition-all duration-500"
                        style={{ width: `${param.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#302B27] tabular-nums">
                      {param.score}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#302B27]/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#302B27]/50" />
                    )}
                  </div>
                </div>

                {/* Expanded Explain My Skin scientific detail */}
                {isExpanded && (
                  <div className="pt-4 mt-4 border-t border-[#E8DCCB] space-y-3 text-xs text-[#302B27]/80">
                    <div className="p-3 bg-[#F8F4ED] rounded-lg">
                      <strong className="text-[#302B27] block mb-1">What This Metric Measures:</strong>
                      <p className="leading-relaxed">{param.explanation}</p>
                    </div>

                    <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg">
                      <strong className="text-amber-900 block mb-1">Scientific Limitation (What It Cannot Establish):</strong>
                      <p className="text-amber-800 leading-relaxed">{param.limitation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Skin-to-Shelf Active Ingredients Match */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
              Formulation Alignment
            </div>
            <h2 className="text-2xl font-serif text-[#302B27]">
              Recommended Active Ingredients for Your Skin Profile
            </h2>
          </div>
          <button
            onClick={() => navigateTo('ingredients')}
            className="text-xs font-semibold text-[#96734C] hover:underline flex items-center gap-1"
          >
            <span>Explore All 10 Ingredients</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {matchedIngredients.map(ing => (
            <div
              key={ing.id}
              onClick={() => navigateTo('ingredients', { ingredientId: ing.id })}
              className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-5 hover:border-[#96734C] transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[11px] font-semibold text-[#96734C] uppercase tracking-wider">{ing.category}</span>
                <h3 className="font-serif text-base text-[#302B27] mt-1">{ing.name}</h3>
                <p className="text-xs text-[#302B27]/70 line-clamp-3 mt-1.5">{ing.description}</p>
              </div>
              <div className="pt-2 border-t border-[#E8DCCB] text-[11px] text-[#96734C] font-semibold">
                View formulation science →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Skin-to-Shelf Product Discovery */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
              Skin-to-Shelf Intelligence (Feature A)
            </div>
            <h2 className="text-2xl font-serif text-[#302B27]">
              Targeted Catalogue Formulations
            </h2>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="text-xs font-semibold text-[#302B27] hover:text-[#96734C] flex items-center gap-1"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matchedProducts.map(prod => (
            <LuxuryProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 5. Non-Medical Regulatory Disclaimer */}
      <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E8DCCB] text-xs text-[#302B27]/70 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-[#302B27]">
          <ShieldCheck className="w-4 h-4 text-[#96734C]" />
          <span>Non-Medical Guidance Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          {analysis.disclaimer}
        </p>
      </div>

    </div>
  );
};
