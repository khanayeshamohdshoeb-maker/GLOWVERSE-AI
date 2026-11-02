import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Plus, Sparkles } from 'lucide-react';

export const ProductCompareModal: React.FC = () => {
  const {
    compareProductIds,
    clearCompare,
    toggleCompareProduct,
    products,
    formatPrice,
    addToCart,
    navigateTo
  } = useApp();

  if (compareProductIds.length === 0) return null;

  const comparedProducts = products.filter(p => compareProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#96734C] font-semibold">Formulation Audit</div>
            <h3 className="font-serif text-2xl text-[#302B27]">Side-by-Side Product Comparison</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-[#302B27]/60 hover:text-[#302B27] underline cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={clearCompare}
              className="p-1.5 text-[#302B27]/60 hover:text-[#302B27] rounded-full hover:bg-[#F8F4ED]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {comparedProducts.map(prod => (
            <div key={prod.id} className="border border-[#E8DCCB] rounded-lg p-5 flex flex-col justify-between bg-[#F8F4ED]/30">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-[#96734C] uppercase tracking-wider">{prod.brand}</span>
                  <button
                    onClick={() => toggleCompareProduct(prod.id)}
                    className="text-[#302B27]/40 hover:text-red-700"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h4
                  onClick={() => {
                    clearCompare();
                    navigateTo('product-detail', { productId: prod.id });
                  }}
                  className="font-serif text-lg text-[#302B27] hover:text-[#96734C] cursor-pointer"
                >
                  {prod.name}
                </h4>

                <div className="text-lg font-bold text-[#302B27] tabular-nums">
                  {formatPrice(prod.priceINR)}
                </div>

                <div className="space-y-2 text-xs border-t border-[#E8DCCB] pt-3">
                  <div>
                    <span className="font-semibold text-[#302B27]">Category: </span>
                    <span className="text-[#302B27]/70">{prod.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#302B27]">Volume: </span>
                    <span className="text-[#302B27]/70">{prod.volume}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#302B27]">Texture: </span>
                    <span className="text-[#302B27]/70">{prod.texture}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#302B27]">Finish: </span>
                    <span className="text-[#302B27]/70">{prod.finish}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#302B27]">Suitable Skin Types: </span>
                    <span className="text-[#302B27]/70">{prod.skinTypes.join(', ')}</span>
                  </div>
                </div>

                <div className="border-t border-[#E8DCCB] pt-3 text-xs">
                  <div className="font-semibold text-[#302B27] mb-1">Key Actives:</div>
                  <div className="flex flex-wrap gap-1">
                    {prod.keyIngredients.map(ing => (
                      <span key={ing} className="bg-white border border-[#E8DCCB] px-2 py-0.5 rounded text-[11px] text-[#96734C]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8DCCB] mt-4 flex gap-2">
                <button
                  onClick={() => addToCart(prod)}
                  className="flex-1 py-2 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold rounded uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}

          {comparedProducts.length < 3 && (
            <div className="border border-dashed border-[#C6A77D] rounded-lg p-6 flex flex-col items-center justify-center text-center text-[#302B27]/60 min-h-[300px]">
              <Sparkles className="w-8 h-8 text-[#96734C] mb-2" />
              <div className="font-serif text-base text-[#302B27]">Add another product</div>
              <div className="text-xs max-w-xs mt-1">Select the scale icon on any product card in Discover Products to compare up to 3 items side by side.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
