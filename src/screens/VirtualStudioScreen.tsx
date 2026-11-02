import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Palette,
  Sparkles,
  Sliders,
  Bookmark,
  Heart,
  Share2,
  RefreshCw,
  Camera,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface Shade {
  id: string;
  name: string;
  hex: string;
  category: 'Lipstick' | 'Blush' | 'Glow';
  finish: 'Satin' | 'Matte' | 'Glass Gloss';
}

const SHADES: Shade[] = [
  { id: 's1', name: 'Nude Satin Cashmere', hex: '#C28D75', category: 'Lipstick', finish: 'Satin' },
  { id: 's2', name: 'Champagne Velvet', hex: '#B57C69', category: 'Lipstick', finish: 'Satin' },
  { id: 's3', name: 'Rose Petal Hydration', hex: '#D66D75', category: 'Lipstick', finish: 'Glass Gloss' },
  { id: 's4', name: 'Deep Plum Couture', hex: '#7E384D', category: 'Lipstick', finish: 'Matte' },
  { id: 's5', name: 'Berry Glaze Nectar', hex: '#9C3D54', category: 'Lipstick', finish: 'Glass Gloss' },
  { id: 's6', name: 'Scarlet Pure Sovereign', hex: '#A82835', category: 'Lipstick', finish: 'Matte' },
  // Blush & Radiance
  { id: 'b1', name: 'Warm Terracotta Sand', hex: '#D28C6E', category: 'Blush', finish: 'Satin' },
  { id: 'b2', name: 'Pale Rose Bloom', hex: '#E2979C', category: 'Blush', finish: 'Satin' },
  { id: 'g1', name: 'Celestial Champagne Sheen', hex: '#EADBB6', category: 'Glow', finish: 'Glass Gloss' },
];

export const VirtualStudioScreen: React.FC = () => {
  const { showToast, addJournalEntry } = useApp();

  const [selectedLipShade, setSelectedLipShade] = useState<Shade>(SHADES[0]);
  const [selectedBlushShade, setSelectedBlushShade] = useState<Shade | null>(SHADES[6]);
  const [intensity, setIntensity] = useState<number>(75);
  const [finish, setFinish] = useState<'Satin' | 'Matte' | 'Glass Gloss'>('Satin');
  const [sliderPos, setSliderPos] = useState<number>(50); // Split screen slider
  const [selectedModel, setSelectedModel] = useState<'model1' | 'model2'>('model1');

  const handleSaveLook = async () => {
    await addJournalEntry({
      title: `Virtual Studio Look: ${selectedLipShade.name}`,
      content: `Tested ${selectedLipShade.name} in a ${finish} finish at ${intensity}% pigment intensity paired with ${selectedBlushShade?.name || 'natural contour'}. Saved to personal beauty record.`,
      mood: 'radiant',
      skinFeel: 'Dewy & luminous',
      activeProductsUsed: [selectedLipShade.name, selectedBlushShade?.name || 'Silk Petal Lip Oil'],
      tags: ['Virtual Look', 'Shade Trial', selectedLipShade.category]
    });
    showToast('Look saved to your personal Beauty Journal', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Interactive Beauty Try-On
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            Virtual Beauty Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
            Simulate luxury lipstick shades, blush flushes, and satin radiance finishes with interactive Before / After comparison.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#F8F4ED] border border-[#E8DCCB] text-[11px] font-semibold text-[#96734C]">
            Interactive Simulation Ready
          </span>
        </div>
      </div>

      {/* Main Studio Workspace: Left Canvas, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-4">
          
          <div className="flex justify-between items-center text-xs">
            <div className="font-semibold text-[#302B27] flex items-center gap-1.5">
              <span>Interactive Model Canvas</span>
              <span className="text-[#302B27]/50 font-normal">· Drag center divider to compare Before & After</span>
            </div>
            
            {/* Model switcher */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedModel('model1')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${selectedModel === 'model1' ? 'bg-[#302B27] text-white font-bold' : 'bg-[#F8F4ED] text-[#302B27]'}`}
              >
                Profile A
              </button>
              <button
                onClick={() => setSelectedModel('model2')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${selectedModel === 'model2' ? 'bg-[#302B27] text-white font-bold' : 'bg-[#F8F4ED] text-[#302B27]'}`}
              >
                Profile B
              </button>
            </div>
          </div>

          {/* Interactive Split-Screen Canvas */}
          <div className="relative w-full h-[460px] rounded-xl overflow-hidden bg-[#F8F4ED] border border-[#E8DCCB] select-none">
            
            {/* Base "Before" Layer */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#EAD9D2]/40 to-[#E8DCCB]/60">
              <svg viewBox="0 0 320 420" className="w-64 h-96 drop-shadow-md">
                <rect width="320" height="420" fill="transparent" />
                {/* Face Contour */}
                <ellipse cx="160" cy="200" rx="90" ry="120" fill="#E8DCCB" />
                {/* Subtle natural eyes */}
                <ellipse cx="125" cy="175" rx="14" ry="7" fill="#FFFFFF" />
                <circle cx="125" cy="175" r="5" fill="#302B27" />
                <ellipse cx="195" cy="175" rx="14" ry="7" fill="#FFFFFF" />
                <circle cx="195" cy="175" r="5" fill="#302B27" />
                {/* Natural bare lips */}
                <path d="M 130 250 Q 160 242 190 250 Q 160 270 130 250 Z" fill="#D3A79E" />
                {/* Hair Outline */}
                <path d="M 70 180 Q 70 80 160 80 Q 250 80 250 180 Q 260 270 240 340 L 80 340 Q 60 270 70 180 Z" fill="#302B27" opacity="0.9" />
              </svg>
              <div className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-[#302B27]/70 bg-white/80 px-2 py-0.5 rounded">
                Bare Skin
              </div>
            </div>

            {/* "After" Overlay Layer clipped by slider */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F8F4ED]/30 to-[#E8DCCB]/40 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <svg viewBox="0 0 320 420" className="w-64 h-96 drop-shadow-md">
                <rect width="320" height="420" fill="transparent" />
                <ellipse cx="160" cy="200" rx="90" ry="120" fill="#E8DCCB" />
                
                {/* Applied Blush Tint */}
                {selectedBlushShade && (
                  <>
                    <ellipse cx="110" cy="210" rx="26" ry="16" fill={selectedBlushShade.hex} opacity={intensity * 0.005} />
                    <ellipse cx="210" cy="210" rx="26" ry="16" fill={selectedBlushShade.hex} opacity={intensity * 0.005} />
                  </>
                )}

                {/* Eyes with subtle liner */}
                <ellipse cx="125" cy="175" rx="14" ry="7" fill="#FFFFFF" />
                <circle cx="125" cy="175" r="5" fill="#302B27" />
                <path d="M 110 170 Q 125 167 140 170" stroke="#302B27" strokeWidth="2" fill="none" />
                
                <ellipse cx="195" cy="175" rx="14" ry="7" fill="#FFFFFF" />
                <circle cx="195" cy="175" r="5" fill="#302B27" />
                <path d="M 180 170 Q 195 167 210 170" stroke="#302B27" strokeWidth="2" fill="none" />

                {/* Applied High-Pigment Lip Color with selected finish */}
                <path
                  d="M 130 250 Q 160 240 190 250 Q 160 272 130 250 Z"
                  fill={selectedLipShade.hex}
                  opacity={intensity * 0.01}
                />
                
                {/* Gloss / Satin Highlights */}
                {finish === 'Glass Gloss' && (
                  <ellipse cx="160" cy="254" rx="12" ry="3" fill="#FFFFFF" opacity="0.6" />
                )}
                {finish === 'Satin' && (
                  <ellipse cx="160" cy="254" rx="8" ry="2" fill="#FFFFFF" opacity="0.3" />
                )}

                {/* Hair */}
                <path d="M 70 180 Q 70 80 160 80 Q 250 80 250 180 Q 260 270 240 340 L 80 340 Q 60 270 70 180 Z" fill="#302B27" opacity="0.9" />
              </svg>

              <div className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wider text-[#96734C] bg-white/90 px-2 py-0.5 rounded border border-[#E8DCCB]">
                {selectedLipShade.name} · {finish}
              </div>
            </div>

            {/* Split Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-[#302B27] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                ⇄
              </div>
            </div>

            {/* Hidden native range slider over canvas for drag support */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={e => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Split comparison slider"
            />
          </div>

          {/* Interactive footer details */}
          <div className="flex items-center justify-between text-xs text-[#302B27]/70 pt-2">
            <div>Current Formulation: <strong className="text-[#302B27]">{selectedLipShade.name}</strong></div>
            <button
              onClick={handleSaveLook}
              className="px-4 py-2 bg-[#302B27] hover:bg-[#96734C] text-white font-semibold rounded uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Look to Journal</span>
            </button>
          </div>

        </div>

        {/* Right Palette & Formula Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Lipstick Shades Picker */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8DCCB] pb-3">
              <span className="text-xs font-semibold text-[#96734C] uppercase tracking-wider">Couture Lip Palette</span>
              <span className="text-xs font-medium text-[#302B27]">{selectedLipShade.name}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SHADES.filter(s => s.category === 'Lipstick').map(shade => {
                const isSelected = selectedLipShade.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={() => {
                      setSelectedLipShade(shade);
                      setFinish(shade.finish);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'border-[#96734C] bg-[#F8F4ED] shadow-xs'
                        : 'border-[#E8DCCB] bg-white hover:border-[#C6A77D]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                      style={{ backgroundColor: shade.hex }}
                    />
                    <div className="text-[11px] font-semibold text-[#302B27] line-clamp-1">{shade.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blush & Radiance Picker */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8DCCB] pb-3">
              <span className="text-xs font-semibold text-[#96734C] uppercase tracking-wider">Cheek Radiance & Flush</span>
              <span className="text-xs font-medium text-[#302B27]">{selectedBlushShade?.name || 'None'}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SHADES.filter(s => s.category === 'Blush' || s.category === 'Glow').map(shade => {
                const isSelected = selectedBlushShade?.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedBlushShade(isSelected ? null : shade)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'border-[#96734C] bg-[#F8F4ED] shadow-xs'
                        : 'border-[#E8DCCB] bg-white hover:border-[#C6A77D]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                      style={{ backgroundColor: shade.hex }}
                    />
                    <div className="text-[11px] font-semibold text-[#302B27] line-clamp-1">{shade.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish & Intensity Sliders */}
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs space-y-5 text-xs">
            
            <div>
              <label className="block font-medium text-[#302B27] mb-2">Formulation Finish</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Satin', 'Matte', 'Glass Gloss'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`py-2 text-center rounded border font-semibold transition-colors ${
                      finish === f
                        ? 'bg-[#302B27] text-white border-[#302B27]'
                        : 'bg-[#F8F4ED] text-[#302B27]/70 border-[#E8DCCB] hover:border-[#96734C]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#302B27] mb-1">
                <span>Pigment Saturation Intensity:</span>
                <span className="font-bold tabular-nums text-[#96734C]">{intensity}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="w-full accent-[#96734C]"
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
