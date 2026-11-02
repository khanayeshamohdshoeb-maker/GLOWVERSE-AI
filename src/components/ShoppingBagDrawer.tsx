import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ShoppingBagDrawer: React.FC = () => {
  const {
    bagOpen,
    setBagOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    cartTotalINR
  } = useApp();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  // Checkout form
  const [fullName, setFullName] = useState('Aria Vance');
  const [address, setAddress] = useState('74 Luxury Boulevard, Apt 4B');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');

  const FREE_SHIPPING_THRESHOLD_INR = 2500;
  const progressPercent = Math.min(100, Math.round((cartTotalINR / FREE_SHIPPING_THRESHOLD_INR) * 100));
  const diffINR = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - cartTotalINR);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `GLOW-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderComplete(orderId);
    clearCart();
  };

  if (!bagOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-[#F8F4ED] border-l border-[#E8DCCB] h-full shadow-2xl flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8DCCB] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-[#302B27]">Shopping Bag</h2>
            <div className="text-xs text-[#302B27]/60 mt-0.5">
              {cart.length === 0 ? 'Your bag is empty' : `${cart.reduce((s, i) => s + i.quantity, 0)} luxury beauty items`}
            </div>
          </div>
          <button
            onClick={() => setBagOpen(false)}
            className="p-2 text-[#302B27]/70 hover:text-[#302B27] cursor-pointer rounded-full hover:bg-[#E8DCCB]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FFFFFF] px-6 py-3 border-b border-[#E8DCCB] text-xs">
          {diffINR === 0 ? (
            <div className="text-[#96734C] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#96734C]" />
              <span>You have unlocked complimentary luxury courier delivery!</span>
            </div>
          ) : (
            <div className="text-[#302B27]/80">
              Add <span className="font-semibold text-[#96734C]">{formatPrice(diffINR)}</span> more for complimentary shipping.
            </div>
          )}
          <div className="w-full h-1.5 bg-[#E8DCCB] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#96734C] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#302B27]/60 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#E8DCCB]/50 flex items-center justify-center text-[#96734C]">
                ✦
              </div>
              <p className="font-serif text-lg text-[#302B27]">Your bag awaits</p>
              <p className="text-xs max-w-xs">Explore our skin intelligence analysis and curated botanical formulations to add products to your ritual.</p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-lg p-4 flex gap-4 items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#96734C]">
                    {item.product.brand}
                  </div>
                  <h4 className="text-sm font-semibold text-[#302B27] line-clamp-1">{item.product.name}</h4>
                  <div className="text-xs text-[#302B27]/60 mt-0.5">{item.product.volume}</div>
                  <div className="text-sm font-bold text-[#302B27] tabular-nums mt-2">
                    {formatPrice(item.product.priceINR * item.quantity)}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#302B27]/40 hover:text-red-700 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-[#E8DCCB] rounded bg-[#F8F4ED]">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-0.5 text-xs font-semibold text-[#302B27] hover:bg-[#E8DCCB] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-semibold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-0.5 text-xs font-semibold text-[#302B27] hover:bg-[#E8DCCB] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#FFFFFF] border-t border-[#E8DCCB] space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#302B27]/70">Subtotal</span>
              <span className="font-bold text-[#302B27] tabular-nums text-lg">
                {formatPrice(cartTotalINR)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#302B27]/60">
              <span>Estimated Luxury Courier</span>
              <span>{diffINR === 0 ? 'Complimentary' : formatPrice(150)}</span>
            </div>

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <span className="text-sm">→</span>
            </button>

            <div className="text-[11px] text-center text-[#302B27]/60 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#96734C]" />
              <span>Complimentary Returns & 100% Verified Authentic Formulations</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal Simulation */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-[#302B27]/60 hover:text-[#302B27]"
            >
              <X className="w-5 h-5" />
            </button>

            {orderComplete ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EAD9D2] text-[#96734C] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#302B27]">Order Confirmed</h3>
                <p className="text-xs text-[#302B27]/70 max-w-sm mx-auto">
                  Thank you, {fullName}. Your order <span className="font-bold text-[#302B27]">{orderComplete}</span> has been received and is being prepared with white-glove packaging.
                </p>
                <div className="p-4 bg-[#F8F4ED] rounded-lg text-xs space-y-1 text-left">
                  <div className="font-semibold text-[#302B27]">Delivery Address:</div>
                  <div className="text-[#302B27]/70">{address}</div>
                  <div className="text-[#302B27]/70">Contact: {phone}</div>
                  <div className="font-semibold text-[#96734C] pt-2">
                    Payment Method: {paymentMethod === 'cod' ? 'Cash on Delivery (Verified)' : 'Card Payment Secured'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    setOrderComplete(null);
                    setBagOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#302B27] text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Return to Exploration
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="border-b border-[#E8DCCB] pb-3">
                  <div className="text-xs font-semibold text-[#96734C] uppercase tracking-wider">Fast Checkout</div>
                  <h3 className="font-serif text-xl text-[#302B27]">Shipping & Payment Verification</h3>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#302B27] mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DCCB] rounded text-sm bg-[#F8F4ED] focus:outline-[#96734C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#302B27] mb-1">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DCCB] rounded text-sm bg-[#F8F4ED] focus:outline-[#96734C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#302B27] mb-1">Mobile Phone for Delivery Updates</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8DCCB] rounded text-sm bg-[#F8F4ED] focus:outline-[#96734C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#302B27] mb-2">Payment Terms</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 text-left border rounded text-xs transition-colors ${
                        paymentMethod === 'cod' ? 'border-[#96734C] bg-[#F8F4ED] font-semibold text-[#302B27]' : 'border-[#E8DCCB] text-[#302B27]/70'
                      }`}
                    >
                      <div className="font-semibold text-sm">Cash on Delivery</div>
                      <div className="text-[11px] text-[#302B27]/60 mt-0.5">Pay upon delivery verification</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 text-left border rounded text-xs transition-colors ${
                        paymentMethod === 'card' ? 'border-[#96734C] bg-[#F8F4ED] font-semibold text-[#302B27]' : 'border-[#E8DCCB] text-[#302B27]/70'
                      }`}
                    >
                      <div className="font-semibold text-sm">Prepaid Card / UPI</div>
                      <div className="text-[11px] text-[#302B27]/60 mt-0.5">Encrypted gateway simulation</div>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#F8F4ED] rounded text-xs flex justify-between items-center">
                  <span>Order Total:</span>
                  <span className="font-bold text-sm text-[#302B27] tabular-nums">
                    {formatPrice(cartTotalINR)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-widest rounded transition-all cursor-pointer shadow-md"
                >
                  Confirm & Place Order
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
