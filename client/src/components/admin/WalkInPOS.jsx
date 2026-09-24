import React, { useState, useEffect } from 'react';
import { fetchProducts, createWalkInSale } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  CreditCard,
  Banknote,
  Receipt,
  RotateCcw,
} from 'lucide-react';

const WalkInPOS = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [posCart, setPosCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-In Customer');
  const [customerPhone, setCustomerPhone] = useState('9999999999');
  const [paymentMethod, setPaymentMethod] = useState('COUNTER_CASH');
  const [processing, setProcessing] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const [mobilePosTab, setMobilePosTab] = useState('catalog'); // 'catalog' | 'cart'

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts();
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products for POS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product, variant) => {
    if (variant.stock <= 0) {
      alert('Selected variant is out of stock!');
      return;
    }

    setPosCart((prev) => {
      const idx = prev.findIndex((item) => item.sku === variant.sku);
      if (idx > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[idx].quantity + 1, variant.stock);
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          subtotal: newQty * (variant.discountPrice || variant.price),
        };
        return updated;
      } else {
        const price = variant.discountPrice || variant.price;
        const attrs = variant.attributes instanceof Map
          ? Object.fromEntries(variant.attributes)
          : variant.attributes || {};

        return [
          ...prev,
          {
            productId: product._id,
            productName: product.name,
            sku: variant.sku,
            variantAttributes: attrs,
            unitPrice: price,
            stock: variant.stock,
            quantity: 1,
            subtotal: price,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (sku, delta) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.sku === sku) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const capped = Math.min(newQty, item.stock);
            return {
              ...item,
              quantity: capped,
              subtotal: capped * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (sku) => {
    setPosCart((prev) => prev.filter((item) => item.sku !== sku));
  };

  const posTotal = posCart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCompleteSale = async () => {
    if (posCart.length === 0) {
      alert('Cart is empty. Please select products to complete counter sale.');
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        items: posCart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variantAttributes: item.variantAttributes,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        paymentMethod,
        customerName,
        customerPhone,
        notes: `Physical Counter POS Sale (${paymentMethod})`,
      };

      const res = await createWalkInSale(payload);
      if (res.data.success) {
        setCompletedSale(res.data.data);
        setPosCart([]);
        loadProducts(); // refresh live stock
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete sale');
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.subCategory.toLowerCase().includes(term) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4">
      {/* Mobile Segmented Switcher (For Store Owner on Phone) */}
      <div className="lg:hidden flex items-center bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobilePosTab('catalog')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            mobilePosTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          📦 Catalog ({filteredProducts.length})
        </button>
        <button
          type="button"
          onClick={() => setMobilePosTab('cart')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            mobilePosTab === 'cart' ? 'bg-white text-red-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Current Bill ({posCart.length})</span>
          {posCart.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Product Catalog Picker (Left 7 Cols) */}
        <div className={`lg:col-span-7 space-y-4 ${mobilePosTab === 'catalog' ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, category, or SKU for counter sale..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-800 font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading catalog...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2"
              >
                <div className="flex gap-2">
                  <img
                    src={
                      (p.images && p.images[0]) ||
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={p.name}
                    className="w-14 h-16 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider block">
                      {p.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                  </div>
                </div>

                {/* Variants Quick Add */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block">Select Variant:</span>
                  <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-0.5">
                    {p.variants.map((v) => {
                      const effectivePrice = v.discountPrice || v.price;
                      const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
                      const desc = Object.entries(attrs).map(([k, val]) => `${k}:${val}`).join(' ');

                      return (
                        <button
                          key={v.sku}
                          type="button"
                          disabled={v.stock <= 0}
                          onClick={() => handleAddToCart(p, v)}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-left text-[11px] border transition ${
                            v.stock > 0
                              ? 'border-slate-200 hover:border-red-700 hover:bg-red-50/50'
                              : 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-slate-800">{v.sku}</span>
                            <span className="text-slate-500 ml-1">({desc})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-900">{formatINR(effectivePrice)}</span>
                            <span
                              className={`text-[9px] font-bold px-1 rounded ${
                                v.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              Stk: {v.stock}
                            </span>
                            {v.stock > 0 && <Plus className="w-3 h-3 text-red-700" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POS Cart & Bill (Right 5 Cols) */}
      <div className={`lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 ${mobilePosTab === 'cart' ? 'block' : 'hidden lg:flex'}`}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-800" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Walk-In POS Bill
              </h3>
            </div>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-slate-400 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Customer Details Input */}
          <div className="grid grid-cols-2 gap-2 my-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto my-3 pr-1">
            {posCart.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No items in counter bill. Click any product variant on the left to add.
              </div>
            ) : (
              posCart.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h5 className="font-bold text-slate-800 truncate">{item.productName}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">{item.sku}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                      <button
                        onClick={() => handleUpdateQuantity(item.sku, -1)}
                        className="p-1 text-slate-600 hover:text-red-700"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.sku, 1)}
                        className="p-1 text-slate-600 hover:text-red-700"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="w-16 text-right font-bold text-red-900">
                      {formatINR(item.subtotal)}
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.sku)}
                      className="text-slate-400 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment & Checkout Section */}
        <div className="border-t border-slate-200 pt-3 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Payment Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('COUNTER_CASH')}
                className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === 'COUNTER_CASH'
                    ? 'bg-red-800 text-white border-red-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash Counter</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI_DIRECT')}
                className={`flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === 'UPI_DIRECT'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Store UPI QR</span>
              </button>
            </div>
          </div>

          {/* Subtotal & Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-slate-700">Bill Payable</span>
            <span className="text-xl font-extrabold text-red-900">{formatINR(posTotal)}</span>
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={processing || posCart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{processing ? 'Processing...' : 'Complete Walk-In Sale & Sync Stock'}</span>
          </button>
        </div>
      </div>
    </div>

      {/* Floating Mobile Bill Indicator */}
      {mobilePosTab === 'catalog' && posCart.length > 0 && (
        <div className="lg:hidden fixed bottom-16 left-3 right-3 z-30">
          <button
            type="button"
            onClick={() => setMobilePosTab('cart')}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-2xl shadow-xl font-bold text-xs flex items-center justify-between transition active:scale-98"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-300" />
              <span>{posCart.length} item(s) in counter bill</span>
            </div>
            <div className="flex items-center gap-1.5 font-extrabold text-amber-300">
              <span>{formatINR(posTotal)}</span>
              <span>• View Bill & Pay →</span>
            </div>
          </button>
        </div>
      )}

      {/* Sale Confirmation Dialog */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Counter Sale Completed!</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Receipt No: <span className="font-bold text-slate-800">{completedSale.orderNumber}</span>
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Amount Paid:</span>
                <span className="text-red-900">{formatINR(completedSale.billing?.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-semibold">{completedSale.payment?.method}</span>
              </div>
              <div className="flex justify-between">
                <span>Stock Synchronized:</span>
                <span className="text-emerald-700 font-semibold">Immediate</span>
              </div>
            </div>
            <button
              onClick={() => setCompletedSale(null)}
              className="w-full py-2.5 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Start Next Counter Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkInPOS;
