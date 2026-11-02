import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Routine, RoutineItem } from '../types.ts';
import {
  Layers,
  Sun,
  Moon,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Clock
} from 'lucide-react';

const WEEKDAYS = [
  { day: 'Mon', date: 'Oct 26', amDone: true, pmDone: true },
  { day: 'Tue', date: 'Oct 27', amDone: true, pmDone: true },
  { day: 'Wed', date: 'Oct 28', amDone: true, pmDone: false },
  { day: 'Thu', date: 'Oct 29', amDone: true, pmDone: true },
  { day: 'Fri', date: 'Oct 30', amDone: true, pmDone: true },
  { day: 'Sat', date: 'Oct 31', amDone: true, pmDone: true },
  { day: 'Sun', date: 'Nov 01', amDone: true, pmDone: false }
];

export const RoutineStudioScreen: React.FC = () => {
  const { routines, saveRoutine, products, toggleRoutineStep, showToast, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [activeRoutine, setActiveRoutine] = useState<Routine>(
    routines[0] || {
      id: 'routine-custom',
      userId: 'usr-demo-001',
      name: 'Personalized Daily Ritual',
      description: 'Layered cosmetic routine designed for balanced barrier hydration and environmental photoprotection.',
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'step-1',
          stepNumber: 1,
          stepName: 'Gentle Conditioning Cleanser',
          timeOfDay: 'morning',
          productId: 'prod-04',
          productName: 'Petal Foam Conditioning Gentle Cleanser',
          instructions: 'Massage 1 pump onto wet face for 60 seconds; rinse with tepid water.',
          isCompleted: false
        },
        {
          id: 'step-2',
          stepNumber: 2,
          stepName: 'Hydrating Essence',
          timeOfDay: 'morning',
          productId: 'prod-01',
          productName: 'Celestial Dew Multi-Weight Hyaluronic Essence',
          instructions: 'Pat 3–4 drops onto damp skin before serums to draw in moisture.',
          isCompleted: false
        },
        {
          id: 'step-3',
          stepNumber: 3,
          stepName: 'Antioxidant Defense',
          timeOfDay: 'morning',
          productId: 'prod-02',
          productName: 'Radiance Alchemy 15% Vitamin C + Ferulic Serum',
          instructions: 'Smooth 4 drops over face and neck for daytime environmental defense.',
          isCompleted: false
        },
        {
          id: 'step-4',
          stepNumber: 4,
          stepName: 'Silk Fluid Sunscreen SPF 50+',
          timeOfDay: 'morning',
          productId: 'prod-05',
          productName: 'Solar Veil Invisible Silk Fluid SPF 50+ PA++++',
          instructions: 'Apply 2 finger lengths as the final morning step.',
          isCompleted: false
        },
        {
          id: 'step-5',
          stepNumber: 1,
          stepName: 'Gentle Evening Cleanse',
          timeOfDay: 'evening',
          productId: 'prod-04',
          productName: 'Petal Foam Conditioning Gentle Cleanser',
          instructions: 'Cleanse away daytime sunscreen and urban pollutants.',
          isCompleted: false
        },
        {
          id: 'step-6',
          stepNumber: 2,
          stepName: 'Midnight Barrier Night Cream',
          timeOfDay: 'evening',
          productId: 'prod-03',
          productName: 'Velvet Cloud Barrier Restorative Cream',
          instructions: 'Warm between fingertips and seal in overnight lipid hydration.',
          isCompleted: false
        }
      ]
    }
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStepName, setNewStepName] = useState('');
  const [newStepProduct, setNewStepProduct] = useState('');
  const [newStepInstructions, setNewStepInstructions] = useState('');

  const currentTabItems = activeRoutine.items.filter(i => i.timeOfDay === activeTab);

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepName.trim()) return;

    const matchedProd = products.find(p => p.name.toLowerCase() === newStepProduct.toLowerCase());

    const newItem: RoutineItem = {
      id: `step-${Date.now()}`,
      stepNumber: currentTabItems.length + 1,
      stepName: newStepName.trim(),
      timeOfDay: activeTab,
      productId: matchedProd?.id,
      productName: newStepProduct.trim() || 'Custom Formulation',
      instructions: newStepInstructions.trim() || 'Apply gently according to formulation texture.',
      isCompleted: false
    };

    const updatedRoutine = {
      ...activeRoutine,
      items: [...activeRoutine.items, newItem],
      updatedAt: new Date().toISOString()
    };

    setActiveRoutine(updatedRoutine);
    saveRoutine(updatedRoutine);
    setShowAddModal(false);
    setNewStepName('');
    setNewStepProduct('');
    setNewStepInstructions('');
    showToast('Step added to your ritual', 'success');
  };

  const handleRemoveStep = (id: string) => {
    const updatedItems = activeRoutine.items.filter(i => i.id !== id);
    const updatedRoutine = {
      ...activeRoutine,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    };
    setActiveRoutine(updatedRoutine);
    saveRoutine(updatedRoutine);
    showToast('Step removed from ritual', 'info');
  };

  const completedCount = currentTabItems.filter(i => i.isCompleted).length;
  const progressPercent = currentTabItems.length > 0
    ? Math.round((completedCount / currentTabItems.length) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Cosmetic Planner & Layering Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            Routine Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 mt-1 font-sans">
            Build and track structured cosmetic sequences. Layer formulations logically from thinnest to thickest without chemical conflict.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A77D]" />
          <span>Add Custom Step</span>
        </button>
      </div>

      {/* 2. Weekly Calendar Consistency Tracker */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#96734C]" />
            <h3 className="font-serif font-bold text-sm text-[#302B27]">7-Day Ritual Consistency</h3>
          </div>
          <span className="text-xs text-[#96734C] font-semibold">Current Week</span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {WEEKDAYS.map((w, idx) => (
            <div
              key={idx}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                idx === 6
                  ? 'bg-[#F8F4ED] border-[#C6A77D]'
                  : 'bg-white border-[#E8DCCB]'
              }`}
            >
              <div className="text-[11px] font-bold text-[#302B27]">{w.day}</div>
              <div className="text-[10px] text-[#302B27]/50 mt-0.5">{w.date}</div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span
                  title="Morning Step"
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                    w.amDone ? 'bg-[#96734C] text-white' : 'bg-[#E8DCCB]/60 text-[#302B27]/40'
                  }`}
                >
                  AM
                </span>
                <span
                  title="Evening Step"
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                    w.pmDone ? 'bg-[#302B27] text-white' : 'bg-[#E8DCCB]/60 text-[#302B27]/40'
                  }`}
                >
                  PM
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Routine Architecture & Time Selector */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl text-[#302B27]">{activeRoutine.name}</h2>
            <p className="text-xs text-[#302B27]/70 mt-1 max-w-xl">{activeRoutine.description}</p>
          </div>

          <div className="text-right sm:self-auto self-start">
            <div className="text-xs text-[#96734C] font-semibold">
              {completedCount} of {currentTabItems.length} steps completed ({progressPercent}%)
            </div>
            <div className="w-40 h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden mt-1.5 border border-[#E8DCCB]">
              <div className="h-full bg-[#96734C] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Tab Switcher: Morning vs Evening */}
        <div className="grid grid-cols-2 p-1 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('morning')}
            className={`py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'morning'
                ? 'bg-[#FFFFFF] text-[#302B27] shadow-xs font-bold'
                : 'text-[#302B27]/60 hover:text-[#302B27]'
            }`}
          >
            <Sun className="w-4 h-4 text-[#C6A77D]" />
            <span>Morning Sequence (Protection & Hydration)</span>
          </button>

          <button
            onClick={() => setActiveTab('evening')}
            className={`py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'evening'
                ? 'bg-[#FFFFFF] text-[#302B27] shadow-xs font-bold'
                : 'text-[#302B27]/60 hover:text-[#302B27]'
            }`}
          >
            <Moon className="w-4 h-4 text-[#96734C]" />
            <span>Evening Sequence (Recovery & Lipid Repair)</span>
          </button>
        </div>
      </div>

      {/* 4. Sequenced Routine Steps List */}
      <div className="space-y-4">
        {currentTabItems.length === 0 ? (
          <div className="p-12 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl text-center text-[#302B27]/60">
            No steps listed for this ritual. Click "Add Custom Step" above to add a product or step.
          </div>
        ) : (
          currentTabItems.map((item, index) => {
            const linkedProduct = products.find(p => p.id === item.productId);

            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-5 hover:border-[#96734C] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleRoutineStep(activeRoutine.id, item.id)}
                    className="mt-1 text-[#302B27]/40 hover:text-[#96734C] cursor-pointer shrink-0"
                    title={item.isCompleted ? 'Mark step incomplete' : 'Mark step complete'}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-[#96734C]" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#96734C] uppercase tracking-wider">
                        Step {index + 1}
                      </span>
                      <span aria-hidden="true" className="text-[#302B27]/30">·</span>
                      <h4 className={`text-sm font-semibold ${item.isCompleted ? 'line-through text-[#302B27]/50' : 'text-[#302B27]'}`}>
                        {item.stepName}
                      </h4>
                    </div>

                    <div className="text-xs text-[#302B27]/80">
                      Product: <strong className="text-[#302B27]">{item.productName}</strong>
                    </div>

                    <p className="text-xs text-[#302B27]/60 leading-relaxed max-w-2xl">
                      {item.instructions}
                    </p>

                    {linkedProduct && (
                      <div className="pt-1 flex items-center gap-2 text-[11px] text-[#96734C]">
                        <span>Key Actives: {linkedProduct.keyIngredients.slice(0, 3).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  {item.productId && (
                    <button
                      onClick={() => navigateTo('product-detail', { productId: item.productId })}
                      className="text-xs font-semibold text-[#96734C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Formulation Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveStep(item.id)}
                    className="p-1.5 text-[#302B27]/40 hover:text-red-700 transition-colors cursor-pointer"
                    title="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Layering Science Educational Guide */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-serif text-lg text-[#302B27]">
          <BookOpen className="w-5 h-5 text-[#96734C]" />
          <span>The Golden Principle of Cosmetic Layering</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#302B27]/75">
          <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-1">
            <strong className="text-[#302B27] block">1. Viscosity Hierarchy</strong>
            Layer from the most watery, low-viscosity solutions (essences, watery toners) to thicker serums, ending with lipid-rich occlusive creams.
          </div>
          <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-1">
            <strong className="text-[#302B27] block">2. Daytime vs Nighttime Actives</strong>
            Reserve antioxidant defense (pure Vitamin C) and UV filters for morning. Schedule cell-renewing Retinoids and exfoliating BHAs for nighttime recovery.
          </div>
          <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-1">
            <strong className="text-[#302B27] block">3. Barrier Priming</strong>
            Never apply pure Hyaluronic Acid to parched, bone-dry skin in arid climates; always mist face first and seal with ceramides to lock moisture in.
          </div>
        </div>
      </div>

      {/* Add Step Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DCCB] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl text-[#302B27]">Add Step to {activeTab === 'morning' ? 'Morning' : 'Evening'} Ritual</h3>

            <form onSubmit={handleAddStep} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#302B27] mb-1">Step Purpose / Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eye Cream, BHA Exfoliant, Calming Essence"
                  value={newStepName}
                  onChange={e => setNewStepName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-xs text-[#302B27] focus:outline-[#96734C]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#302B27] mb-1">Product Formulation Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Dew Essence or Custom Formulation"
                  value={newStepProduct}
                  onChange={e => setNewStepProduct(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-xs text-[#302B27] focus:outline-[#96734C]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#302B27] mb-1">Application Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Gently press 3 drops into skin with fingertips..."
                  value={newStepInstructions}
                  onChange={e => setNewStepInstructions(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-xs text-[#302B27] focus:outline-[#96734C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E8DCCB] rounded-xl hover:bg-[#F8F4ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#302B27] text-white font-semibold rounded-xl hover:bg-[#96734C]"
                >
                  Add Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
