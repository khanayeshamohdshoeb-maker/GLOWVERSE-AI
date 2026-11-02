import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Calculator,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  PieChart,
  ShieldCheck
} from 'lucide-react';

export const BudgetGuardianScreen: React.FC = () => {
  const {
    budgetItems,
    addToBudget,
    removeFromBudget,
    updateBudgetQuantity,
    targetBudget,
    setTargetBudget,
    products,
    formatPrice,
    addToCart,
    setBagOpen,
    showToast,
    navigateTo
  } = useApp();

  const [customBudgetInput, setCustomBudgetInput] = useState<number>(targetBudget);

  // Compute itemized items & subtotal
  let subtotalINR = 0;
  const itemizedList = budgetItems
    .map(item => {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) return null;
      const lineTotal = prod.priceINR * item.quantity;
      subtotalINR += lineTotal;

      // Find cheaper alternative
      let cheaperAlt = undefined;
      if (prod.alternativeIds && prod.alternativeIds.length > 0) {
        cheaperAlt = products.find(p => prod.alternativeIds?.includes(p.id));
      }

      return {
        product: prod,
        quantity: item.quantity,
        lineTotal,
        cheaperAlt
      };
    })
    .filter(Boolean) as Array<{
      product: typeof products[0];
      quantity: number;
      lineTotal: number;
      cheaperAlt?: typeof products[0];
    }>;

  const remainingINR = targetBudget - subtotalINR;
  const percentageUsed = Math.min(100, Math.round((subtotalINR / targetBudget) * 100));
  const isOver = subtotalINR > targetBudget;

  // Category spending breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    itemizedList.forEach(item => {
      const cat = item.product.category;
      map[cat] = (map[cat] || 0) + item.lineTotal;
    });
    return Object.entries(map).map(([category, total]) => ({
      category,
      total,
      percent: subtotalINR > 0 ? Math.round((total / subtotalINR) * 100) : 0
    }));
  }, [itemizedList, subtotalINR]);

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetBudget(customBudgetInput);
    showToast(`Monthly budget set to ${formatPrice(customBudgetInput)}`, 'success');
  };

  const handleSwitchToAlternative = (currentProductId: string, altProductId: string, quantity: number) => {
    removeFromBudget(currentProductId);
    addToBudget(altProductId, quantity);
    showToast('Swapped for verified affordable formulation with matching actives', 'success');
  };

  const handleTransferAllToBag = () => {
    itemizedList.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    setBagOpen(true);
    showToast('All allocated items moved to your shopping bag', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Cosmetic Spending Stewardship
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            Budget Guardian
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
            Maintain thoughtful spending discipline. Set a target monthly budget, audit active product totals, and uncover verified accessible alternatives.
          </p>
        </div>

        <button
          onClick={() => navigateTo('products')}
          className="px-5 py-2.5 bg-[#FFFFFF] hover:bg-[#F8F4ED] border border-[#E8DCCB] text-[#302B27] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4 text-[#96734C]" />
          <span>Add More Formulations</span>
        </button>
      </div>

      {/* 2. Top Interactive Budget Meter & Target Setter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs">
        
        {/* Left: Target Budget Configuration */}
        <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#E8DCCB] pb-6 lg:pb-0 lg:pr-8">
          <span className="text-xs font-semibold text-[#96734C] uppercase tracking-wider">
            Target Allocation
          </span>
          <form onSubmit={handleUpdateBudget} className="space-y-3">
            <label className="block text-xs font-medium text-[#302B27]">Set Personal Monthly Target</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={500}
                step={250}
                value={customBudgetInput}
                onChange={e => setCustomBudgetInput(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-sm text-[#302B27] font-bold tabular-nums focus:outline-[#96734C]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                Set
              </button>
            </div>
            <div className="text-[11px] text-[#302B27]/60">
              Active target ceiling: <strong className="text-[#302B27]">{formatPrice(targetBudget)}</strong>
            </div>
          </form>
        </div>

        {/* Right: Live Utilization & Remaining Gauge */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs text-[#302B27]/60">Total Cart Allocated:</div>
              <div className="text-3xl font-serif text-[#302B27] font-bold tabular-nums">
                {formatPrice(subtotalINR)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-[#302B27]/60">Remaining Budget:</div>
              <div className={`text-2xl font-serif font-bold tabular-nums ${isOver ? 'text-red-700' : 'text-[#96734C]'}`}>
                {isOver ? `Over by ${formatPrice(Math.abs(remainingINR))}` : formatPrice(remainingINR)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-[#F8F4ED] rounded-full overflow-hidden border border-[#E8DCCB]">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOver ? 'bg-red-600' : percentageUsed > 80 ? 'bg-amber-600' : 'bg-[#96734C]'
              }`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-[#302B27]/70">
            <span>{percentageUsed}% of monthly target engaged</span>
            <span className="font-semibold text-[#96734C]">
              {isOver ? 'Exceeds Target Limit' : `${formatPrice(remainingINR)} Unallocated`}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Category Spending Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8DCCB]">
            <PieChart className="w-4 h-4 text-[#96734C]" />
            <h3 className="font-serif font-bold text-sm text-[#302B27]">Spending by Routine Category</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="p-3.5 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB]/60 space-y-1">
                <div className="text-[11px] font-semibold text-[#96734C] uppercase tracking-wider">{cat.category}</div>
                <div className="text-sm font-bold text-[#302B27] tabular-nums">{formatPrice(cat.total)}</div>
                <div className="text-[10px] text-[#302B27]/60">{cat.percent}% of total allocation</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Itemized Formulations Table & Smart Formulation Alternatives */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#E8DCCB] pb-3">
          <h2 className="font-serif text-xl text-[#302B27]">Allocated Formulations ({itemizedList.length})</h2>
          {itemizedList.length > 0 && (
            <button
              onClick={handleTransferAllToBag}
              className="px-4 py-2 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Transfer All to Shopping Bag</span>
            </button>
          )}
        </div>

        {itemizedList.length === 0 ? (
          <div className="p-16 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl text-center space-y-4">
            <Calculator className="w-10 h-10 text-[#96734C] mx-auto" />
            <h3 className="font-serif text-xl text-[#302B27]">Your Budget Guardian Tray is Empty</h3>
            <p className="text-xs text-[#302B27]/70 max-w-sm mx-auto leading-relaxed">
              Add products from the Discover Formulations catalog to monitor your monthly cosmetic allocation and uncover active-matched alternatives.
            </p>
            <button
              onClick={() => navigateTo('products')}
              className="px-6 py-2.5 bg-[#302B27] text-white text-xs font-semibold uppercase tracking-wider rounded-xl"
            >
              Browse Products Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {itemizedList.map(({ product, quantity, lineTotal, cheaperAlt }) => {
              const unitSavings = cheaperAlt ? product.priceINR - cheaperAlt.priceINR : 0;
              const totalSavings = unitSavings * quantity;

              return (
                <div
                  key={product.id}
                  className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Product Basic Info */}
                  <div className="flex-1 space-y-1">
                    <div className="text-[11px] font-semibold text-[#96734C] uppercase tracking-wider">
                      {product.brand} · {product.category}
                    </div>
                    <h3
                      onClick={() => navigateTo('product-detail', { productId: product.id })}
                      className="font-serif text-lg text-[#302B27] hover:text-[#96734C] cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="text-xs text-[#302B27]/60">
                      Unit: {formatPrice(product.priceINR)} · Actives: {product.keyIngredients.join(', ')}
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-[#E8DCCB] rounded-lg bg-[#F8F4ED]">
                      <button
                        onClick={() => updateBudgetQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#302B27] hover:bg-[#E8DCCB] rounded-l-lg cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold tabular-nums">{quantity}</span>
                      <button
                        onClick={() => updateBudgetQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#302B27] hover:bg-[#E8DCCB] rounded-r-lg cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <div className="text-xs text-[#302B27]/60">Line Total:</div>
                      <div className="text-base font-bold text-[#302B27] tabular-nums">
                        {formatPrice(lineTotal)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromBudget(product.id)}
                      className="text-[#302B27]/40 hover:text-red-700 transition-colors p-1.5 cursor-pointer"
                      title="Remove from budget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Smart Cheaper Alternative Box */}
                  {cheaperAlt && (
                    <div className="md:w-80 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl p-3.5 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-[#96734C] font-semibold">
                        <TrendingDown className="w-4 h-4" />
                        <span>Active-Matched Alternative</span>
                      </div>
                      <div className="text-[#302B27] font-medium">{cheaperAlt.name}</div>
                      <div className="flex justify-between items-center text-[11px] text-[#302B27]/70">
                        <span>Unit: {formatPrice(cheaperAlt.priceINR)}</span>
                        <span className="text-emerald-800 font-bold">Save {formatPrice(totalSavings)}</span>
                      </div>
                      <button
                        onClick={() => handleSwitchToAlternative(product.id, cheaperAlt.id, quantity)}
                        className="w-full py-2 bg-[#FFFFFF] hover:bg-[#E8DCCB] border border-[#E8DCCB] text-[#302B27] text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-[#96734C]" />
                        <span>Switch & Save {formatPrice(totalSavings)}</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
