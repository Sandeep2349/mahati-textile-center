import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/formatters';

const CartDrawer = ({ onNavigateToCheckout }) => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItemsCount,
  } = useCart();

  if (!isDrawerOpen) return null;

  const freeDeliveryThreshold = 999;
  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    closeDrawer();
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-400" />
              <h2 className="text-base font-bold tracking-wide">
                Your Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-amber-50 border-b border-amber-200/60 px-5 py-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
              <span>
                {neededForFreeDelivery > 0
                  ? `Add ${formatINR(neededForFreeDelivery)} more for FREE Delivery`
                  : '🎉 You have qualified for FREE Home Delivery!'}
              </span>
              <span>{deliveryProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Your bag is empty</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Browse sarees, kurtas, bangles, and innerwear to add items.
                </p>
                <button
                  onClick={closeDrawer}
                  className="px-5 py-2.5 bg-red-800 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.sku}
                  className="flex gap-3 bg-slate-50 border border-slate-200/70 rounded-xl p-3 relative"
                >
                  {/* Thumbnail */}
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={item.productName}
                    className="w-16 h-20 object-cover rounded-lg bg-white shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="text-slate-400 hover:text-red-700 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="text-[11px] text-slate-500 mt-0.5 space-x-1.5 flex flex-wrap">
                        {item.variantAttributes &&
                          Object.entries(item.variantAttributes).map(([k, v]) => (
                            <span key={k} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                              {k}: {v}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Quantity & Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-red-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-red-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-red-900">
                          {formatINR(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="text-red-900 font-extrabold">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero gateway fee • 0% MDR Direct NPCI UPI</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition transform active:scale-98"
              >
                <span>Proceed to Zero-Fee Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
