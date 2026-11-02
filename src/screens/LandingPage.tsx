import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LuxuryProductCard } from '../components/LuxuryProductCard.tsx';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Layers,
  Calculator,
  Palette,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Eye,
  Check,
  RefreshCw,
  Scale
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, products, ingredients, formatPrice } = useApp();

  // Interactive previews on landing page
  const [selectedRoutineTime, setSelectedRoutineTime] = useState<'morning' | 'evening'>('morning');
  const [virtualLipShade, setVirtualLipShade] = useState({ name: 'Velvet Rose', hex: '#C25A68', finish: 'Satin' });

  const featuredProducts = products.slice(0, 3);
  const featuredIngredients = ingredients.slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 2 & 3. Full-Width Editorial Hero Section with Strong Headline & Tagline */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-[#E8DCCB] bg-gradient-to-b from-[#FFFFFF] via-[#F8F4ED] to-[#F8F4ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#96734C]">
                <span>Cosmetic Intelligence Platform</span>
                <span aria-hidden="true">·</span>
                <span>International Formulation Science</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#302B27] leading-[1.12] text-balance tracking-tight">
                  Your Skin. Your Style. <br />
                  <span className="italic font-normal text-[#96734C]">Your Smarter Beauty Journey.</span>
                </h1>
                <p className="text-sm sm:text-base text-[#302B27]/75 font-sans leading-relaxed max-w-xl">
                  GLOWVERSE AI connects optical skin diagnostics with verified formulation chemistry. Explore your skin parameters, build tailored cosmetic rituals, test shades virtually, and shop with complete ingredient transparency.
                </p>
              </div>

              {/* 5. Primary and Secondary CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigateTo('skin-upload')}
                  className="px-8 py-3.5 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-widest rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C6A77D]" />
                  <span>Launch Skin Analysis</span>
                </button>
                <button
                  onClick={() => navigateTo('products')}
                  className="px-8 py-3.5 bg-[#FFFFFF] hover:bg-[#F8F4ED] text-[#302B27] border border-[#E8DCCB] hover:border-[#96734C] text-xs font-semibold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E8DCCB]/60 flex flex-wrap items-center gap-6 text-xs text-[#302B27]/65">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#96734C]" />
                  <span>Non-Medical Skin Science</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#96734C]" />
                  <span>Biometric Zero-Retention Charter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#96734C]" />
                  <span>100% INCI Disclosures</span>
                </div>
              </div>

            </div>

            {/* 4. Luxury Visual Showcase Canvas */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-7 shadow-lg space-y-6">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
                  <div>
                    <span className="text-[11px] font-semibold text-[#96734C] uppercase tracking-wider">
                      Live Optical Metric Preview
                    </span>
                    <h2 className="font-serif text-lg text-[#302B27] mt-0.5">
                      Skin Intelligence Scan
                    </h2>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-[#F8F4ED] text-xs font-bold text-[#302B27] border border-[#E8DCCB] tabular-nums">
                    Overall 84 / 100
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#302B27]">Surface Radiance & Glow</span>
                      <span className="text-[#96734C] font-bold tabular-nums">86%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden">
                      <div className="h-full bg-[#96734C] rounded-full" style={{ width: '86%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#302B27]">Skin Barrier Hydration</span>
                      <span className="text-[#96734C] font-bold tabular-nums">79%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden">
                      <div className="h-full bg-[#96734C] rounded-full" style={{ width: '79%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#302B27]">Optical Texture & Smoothness</span>
                      <span className="text-[#96734C] font-bold tabular-nums">82%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden">
                      <div className="h-full bg-[#96734C] rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#302B27]">Chroma Vascular Balance</span>
                      <span className="text-[#96734C] font-bold tabular-nums">91%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden">
                      <div className="h-full bg-[#96734C] rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>
                </div>

                {/* Skin-to-Shelf Match Card */}
                <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-1.5">
                  <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#96734C]">
                    Matched Formulation
                  </div>
                  <div className="text-xs font-semibold text-[#302B27]">
                    Celestial Dew Quadruple Hyaluronic Essence
                  </div>
                  <p className="text-[11px] text-[#302B27]/70 leading-normal">
                    Targets current 79% hydration with 4 molecular weights of hyaluronic acid and provitamin B5.
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('skin-upload')}
                  className="w-full py-3 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors text-center cursor-pointer shadow-xs"
                >
                  Start Your Analysis
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Brand Introduction: The GLOWVERSE Philosophy */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
          The GLOWVERSE Philosophy
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#302B27] text-balance">
          Beauty Empowered by Intelligence, Not Insecurity.
        </h2>
        <p className="text-sm sm:text-base text-[#302B27]/75 font-sans leading-relaxed max-w-2xl mx-auto">
          We reject fear-driven marketing and artificial perfection. GLOWVERSE AI was founded on the principle that understanding your skin’s biological rhythm and cosmetic formulation science is the truest luxury. Every tool we create exists to give you clarity, agency, and confidence.
        </p>
      </section>

      {/* 7. Skin Intelligence Feature Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
              Pillar 01 · Diagnostic Science
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
              Optical Skin Intelligence: Real Diagnostics, Zero Pretense.
            </h2>
            <p className="text-sm text-[#302B27]/75 leading-relaxed">
              Our camera algorithms assess eight distinct cosmetic dimensions: surface texture, hydration levels, pore visibility, radiance, firmness, fine lines, dark circles, and transient redness.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl flex items-start gap-3.5 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#96734C] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-[#302B27]">Explain My Skin Contextualization</div>
                  <div className="text-[#302B27]/70 leading-relaxed">
                    Clear disclosures explain what each score means scientifically, and transparently details what optical cameras cannot measure.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl flex items-start gap-3.5 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#96734C] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-[#302B27]">Live Cam or Curated Sample Galleries</div>
                  <div className="text-[#302B27]/70 leading-relaxed">
                    Test with your own device camera or explore pre-calibrated international skin models to see the diagnostic engine in action.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('skin-upload')}
              className="px-6 py-3 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Analyze Your Complexion
            </button>
          </div>

          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
              <div className="font-serif text-lg text-[#302B27]">8-Parameter Diagnostic Suite</div>
              <span className="text-xs text-[#96734C] font-semibold">Calibrated Metrics</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { name: 'Texture', score: '82%', note: 'Micro-roughness reflection' },
                { name: 'Radiance', score: '86%', note: 'Specular gloss dispersion' },
                { name: 'Hydration', score: '79%', note: 'Epidermal water retention' },
                { name: 'Tone Balance', score: '91%', note: 'Vascular erythema map' },
                { name: 'Fine Lines', score: '88%', note: 'Elastic contour depth' },
                { name: 'Pore Refinement', score: '78%', note: 'Follicular optical profile' }
              ].map((p, idx) => (
                <div key={idx} className="p-3 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60 space-y-1">
                  <div className="flex justify-between font-bold text-[#302B27]">
                    <span>{p.name}</span>
                    <span className="text-[#96734C] tabular-nums">{p.score}</span>
                  </div>
                  <p className="text-[10px] text-[#302B27]/60 leading-tight">{p.note}</p>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-[#302B27]/60 italic flex items-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#96734C] shrink-0" />
              <span>Non-medical cosmetic analysis for skincare optimization only.</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Skin-to-Shelf Intelligence Showcase */}
      <section className="bg-[#FFFFFF] border-y border-[#E8DCCB] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
                Pillar 02 · Skin-to-Shelf Matching
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
                From Optical Scan Directly to Targeted Actives
              </h2>
              <p className="text-sm text-[#302B27]/70 font-sans mt-1 max-w-xl">
                Every product in our catalog links mathematically to your diagnostic results. No guessing, no marketing jargon—only purposeful formulations.
              </p>
            </div>

            <button
              onClick={() => navigateTo('products')}
              className="text-xs font-semibold text-[#302B27] hover:text-[#96734C] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore All 16 Formulations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <LuxuryProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Routine Studio Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
                Pillar 03 · Routine Studio
              </div>
              <h2 className="text-3xl font-serif text-[#302B27]">
                Architect Your Daily Skincare Ritual
              </h2>
              <p className="text-sm text-[#302B27]/75 font-sans leading-relaxed">
                Sequence products from thinnest to thickest to avoid formulation pilling, maximize ingredient absorption, and prevent active clashes like Vitamin C and exfoliating acids.
              </p>

              {/* Time Toggle */}
              <div className="flex items-center gap-2 p-1 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] w-fit">
                <button
                  onClick={() => setSelectedRoutineTime('morning')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    selectedRoutineTime === 'morning'
                      ? 'bg-[#302B27] text-white shadow-xs'
                      : 'text-[#302B27]/70 hover:text-[#302B27]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-[#C6A77D]" />
                  <span>Morning Ritual</span>
                </button>
                <button
                  onClick={() => setSelectedRoutineTime('evening')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    selectedRoutineTime === 'evening'
                      ? 'bg-[#302B27] text-white shadow-xs'
                      : 'text-[#302B27]/70 hover:text-[#302B27]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#C6A77D]" />
                  <span>Evening Recovery</span>
                </button>
              </div>

              <button
                onClick={() => navigateTo('routines')}
                className="px-6 py-3 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Open Full Routine Studio
              </button>
            </div>

            <div className="lg:col-span-7 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-[#E8DCCB]">
                <span className="font-serif font-bold text-sm text-[#302B27]">
                  {selectedRoutineTime === 'morning' ? 'Daily Morning Sequence (4 Steps)' : 'Night Repair Sequence (4 Steps)'}
                </span>
                <span className="text-[#96734C] text-[11px] font-semibold">Scientifically Sequenced</span>
              </div>

              {selectedRoutineTime === 'morning' ? (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Purifying Gel Cleanser</div>
                        <div className="text-[10px] text-[#302B27]/60">Gentle lukewarm rinse</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Prep</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Lumière Solaire 15% Vitamin C</div>
                        <div className="text-[10px] text-[#302B27]/60">Antioxidant photoprotection layer</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Active</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">3</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Ceramide Barrier Restorative Cream</div>
                        <div className="text-[10px] text-[#302B27]/60">Locks cellular hydration</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Moisture</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#96734C] text-white flex items-center justify-center text-[11px] font-bold">4</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Voile Solaire Invisible Fluid SPF 50+</div>
                        <div className="text-[10px] text-[#302B27]/60">Non-negotiable broad spectrum shield</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-bold">Shield</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Micellar Pre-Cleanse & Milk</div>
                        <div className="text-[10px] text-[#302B27]/60">Dissolves sunscreen and environmental debris</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Cleanse</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Quadruple Hyaluronic Essence</div>
                        <div className="text-[10px] text-[#302B27]/60">Deep trans-epidermal hydration</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Hydrate</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">3</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Nocturne Renewal 0.3% Retinol</div>
                        <div className="text-[10px] text-[#302B27]/60">Overnight cell renewal turnover</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Renew</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8DCCB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[11px] font-bold">4</span>
                      <div>
                        <div className="font-semibold text-[#302B27]">Midnight Recovery Lipid Balm</div>
                        <div className="text-[10px] text-[#302B27]/60">Squalane and phytoceramides barrier seal</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#96734C] font-semibold">Seal</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 10. Virtual Beauty Studio Preview */}
      <section className="bg-[#FFFFFF] border-y border-[#E8DCCB] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Interactive Swatch Canvas */}
            <div className="lg:col-span-6 bg-[#F8F4ED] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
                <div>
                  <span className="text-[11px] font-semibold text-[#96734C] uppercase tracking-wider">Interactive Preview</span>
                  <h3 className="font-serif text-lg text-[#302B27]">Virtual Shade Tester</h3>
                </div>
                <div className="text-xs font-semibold text-[#302B27] bg-white px-3 py-1 rounded-lg border border-[#E8DCCB]">
                  Finish: {virtualLipShade.finish}
                </div>
              </div>

              {/* Studio Canvas Simulation */}
              <div className="relative h-60 rounded-xl overflow-hidden bg-gradient-to-tr from-[#302B27] to-[#433C37] flex items-center justify-center p-6 text-white shadow-inner">
                <div className="text-center space-y-3">
                  <div
                    className="w-20 h-20 rounded-full mx-auto shadow-lg border-2 border-white/60 transition-colors duration-500"
                    style={{ backgroundColor: virtualLipShade.hex }}
                  />
                  <div className="font-serif text-xl">{virtualLipShade.name}</div>
                  <div className="text-xs text-[#E8DCCB]/80 font-sans">
                    Formulated with Camellia Seed Oil & Botanical Squalane
                  </div>
                </div>
              </div>

              {/* Swatch Selectors */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#302B27]">Choose Velvet Lip Shade:</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Velvet Rose', hex: '#C25A68', finish: 'Satin' },
                    { name: 'Champagne Nectar', hex: '#C6A77D', finish: 'Dewy' },
                    { name: 'Warm Terracotta', hex: '#A85741', finish: 'Matte' },
                    { name: 'Midnight Berry', hex: '#692C3D', finish: 'Velvet' }
                  ].map((shade, i) => (
                    <button
                      key={i}
                      onClick={() => setVirtualLipShade(shade)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        virtualLipShade.name === shade.name
                          ? 'border-[#302B27] bg-white shadow-xs'
                          : 'border-[#E8DCCB] bg-white/50 hover:bg-white'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full" style={{ backgroundColor: shade.hex }} />
                      <span className="text-[10px] font-medium text-[#302B27] truncate w-full text-center">
                        {shade.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Explanatory Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
                Pillar 04 · Virtual Beauty Studio
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
                Live Cosmetic Shade Testing, True to Skin Undertones
              </h2>
              <p className="text-sm text-[#302B27]/75 font-sans leading-relaxed">
                Experience high-precision color visualization. Compare cheek tints, luminizers, and velvet lip finishes with our split-screen before-and-after view before purchasing.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#302B27]">
                  <Check className="w-4 h-4 text-[#96734C]" />
                  <span>Real-time opacity, saturation, and finish controls (Matte, Satin, Dewy).</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#302B27]">
                  <Check className="w-4 h-4 text-[#96734C]" />
                  <span>Interactive Split-Screen before/after comparison slider.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#302B27]">
                  <Check className="w-4 h-4 text-[#96734C]" />
                  <span>Direct one-click addition of tested shades to your shopping bag.</span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('virtual-studio')}
                className="px-6 py-3 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Launch Virtual Studio
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 11. Budget Guardian Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
                Pillar 05 · Budget Guardian
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
                Smart Formulations Without the Luxury Markup
              </h2>
              <p className="text-sm text-[#302B27]/75 font-sans leading-relaxed">
                Skincare results should never depend on financial strain. The GLOWVERSE Budget Guardian tracks your monthly routine allocation in real time and automatically identifies scientifically identical active formulations at accessible price points.
              </p>

              <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-2 text-xs">
                <div className="font-semibold text-[#302B27] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#96734C]" />
                  <span>The Active Molecule Match Algorithm:</span>
                </div>
                <p className="text-[#302B27]/70 leading-relaxed">
                  When you select an international luxury formulation, Budget Guardian inspects the primary actives (e.g. 10% Niacinamide + Zinc) and suggests verified clean alternatives saving up to 55% per bottle.
                </p>
              </div>

              <button
                onClick={() => navigateTo('budget-guardian')}
                className="px-6 py-3 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Calculate Skincare Budget
              </button>
            </div>

            {/* Interactive Budget Snapshot */}
            <div className="lg:col-span-6 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl p-6 space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8DCCB]">
                <div className="font-serif font-bold text-sm text-[#302B27]">Budget Health Monitor</div>
                <span className="text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                  Within Target (68%)
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-[#302B27]">Monthly Skincare Target: ₹5,000</span>
                  <span className="text-[#96734C] font-bold">Allocated: ₹3,400</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#E8DCCB]">
                  <div className="h-full bg-[#96734C] rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-[#302B27]/60 mt-1">
                  <span>₹0</span>
                  <span>Remaining: ₹1,600</span>
                  <span>₹5,000</span>
                </div>
              </div>

              {/* Formulation Alternative Example */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8DCCB] space-y-2 text-xs">
                <div className="text-[10.5px] uppercase tracking-wider text-[#96734C] font-semibold">
                  Active Molecule Swap Recommendation
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#302B27]">Lumière Solaire Vitamin C</div>
                    <div className="text-[#302B27]/50 text-[11px]">₹3,450 / 30ml</div>
                  </div>
                  <div className="text-center text-[#96734C] font-bold">→</div>
                  <div>
                    <div className="font-semibold text-emerald-800">C-Radiance Pure Daily</div>
                    <div className="text-emerald-700 font-bold text-[11px]">₹1,650 (Save 52%)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 12. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">Methodology</div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#302B27]">The GLOWVERSE Pathway</h2>
          <p className="text-sm text-[#302B27]/70 font-sans">
            Four disciplined steps engineered for clarity, trust, and informed skincare decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="text-3xl font-serif text-[#96734C]">01.</div>
            <h3 className="font-serif text-lg text-[#302B27]">Optical Capture</h3>
            <p className="text-xs text-[#302B27]/70 leading-relaxed font-sans">
              Provide consent, upload a well-lit photo or choose from our sample gallery. Images are processed temporarily without permanent storage.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="text-3xl font-serif text-[#96734C]">02.</div>
            <h3 className="font-serif text-lg text-[#302B27]">Deconstruct Metrics</h3>
            <p className="text-xs text-[#302B27]/70 leading-relaxed font-sans">
              Inspect 8 cosmetic parameters from surface hydration to vascular redness with transparent scientific explanations.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="text-3xl font-serif text-[#96734C]">03.</div>
            <h3 className="font-serif text-lg text-[#302B27]">Ritual & Actives</h3>
            <p className="text-xs text-[#302B27]/70 leading-relaxed font-sans">
              Build your morning and evening routines, verify compatibility, and test makeup shades in the Virtual Studio.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="text-3xl font-serif text-[#96734C]">04.</div>
            <h3 className="font-serif text-lg text-[#302B27]">Continuous AI Care</h3>
            <p className="text-xs text-[#302B27]/70 leading-relaxed font-sans">
              Consult the AI Beauty Assistant anytime for active compatibility, ingredient questions, or routine adjustments.
            </p>
          </div>

        </div>
      </section>

      {/* 13. Privacy and Trust Section */}
      <section className="bg-[#302B27] text-white py-20 border-y border-[#302B27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C6A77D]">
              Ethical Computing & Biometric Integrity
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">
              The GLOWVERSE Privacy Charter
            </h2>
            <p className="text-sm text-[#E8DCCB]/80 leading-relaxed">
              We believe your biometric data belongs exclusively to you. We hold ourselves to strict international privacy standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#433C37]/50 rounded-2xl border border-white/10 space-y-3">
              <Lock className="w-6 h-6 text-[#C6A77D]" />
              <h3 className="font-serif text-lg text-white">Zero Biometric Retention</h3>
              <p className="text-xs text-[#E8DCCB]/70 leading-relaxed">
                Images submitted for skin analysis are processed in volatile memory and purged immediately after parameter extraction. No facial photos are sold or used for training.
              </p>
            </div>

            <div className="p-6 bg-[#433C37]/50 rounded-2xl border border-white/10 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#C6A77D]" />
              <h3 className="font-serif text-lg text-white">Non-Medical Regulatory Boundary</h3>
              <p className="text-xs text-[#E8DCCB]/70 leading-relaxed">
                We strictly separate cosmetic skin health optimization from medical diagnosis. We never claim to diagnose melanoma, eczema, or cystic conditions.
              </p>
            </div>

            <div className="p-6 bg-[#433C37]/50 rounded-2xl border border-white/10 space-y-3">
              <RefreshCw className="w-6 h-6 text-[#C6A77D]" />
              <h3 className="font-serif text-lg text-white">Full Right to Erasure</h3>
              <p className="text-xs text-[#E8DCCB]/70 leading-relaxed">
                With a single click in Settings & Privacy, permanently purge all analysis history, routines, journals, and conversation records from our databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#96734C]">
          <span>Begin Your Transformation</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#302B27] text-balance">
          Elevate Your Skincare with Real Intelligence.
        </h2>
        <p className="text-sm sm:text-base text-[#302B27]/70 max-w-xl mx-auto leading-relaxed">
          Join discerning beauty enthusiasts worldwide who make confident skincare choices backed by formulation science.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={() => navigateTo('skin-upload')}
            className="px-8 py-3.5 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
          >
            Start Free Skin Analysis
          </button>
        </div>
      </section>

    </div>
  );
};
