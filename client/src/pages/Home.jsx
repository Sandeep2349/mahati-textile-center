import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Store, Truck, MessageCircle, Heart } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const Home = ({ onNavigate, onSelectProduct, products = [] }) => {
  const categories = [
    {
      id: 'Womens',
      title: "Women's Sarees & Kurtis",
      subtitle: 'Pure Kanchipuram silk, Chanderi kurtis & dress materials',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Mens',
      title: "Men's Shirts & Dhotis",
      subtitle: 'Pure linen shirts, traditional 9x5 zari border dhotis',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Bangles',
      title: 'Glass & Metal Bangles',
      subtitle: 'Traditional handcrafted bangles in sizes 2.4, 2.6 & 2.8',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'Innerwear',
      title: 'Comfort Innerwear',
      subtitle: 'Precision cup bras (32B, 34B, 36C) and combed cotton vests',
      image: 'https://images.unsplash.com/photo-1596783049978-57775988e404?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'DailyWear',
      title: 'Towels & Bedspreads',
      subtitle: 'Pure honeycomb quick-dry towels and woven jacquard bedsheets',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-800/60 border border-amber-400/30 text-amber-200 text-xs font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Mahati Textile Center • Trusted Physical & Online Retailer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Authentic Indian <span className="text-amber-300">Textiles</span> & Handlooms.
            </h1>

            <p className="text-sm sm:text-base text-amber-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              From ceremonial pure silk bridal sarees and traditional double dhotis to handcrafted glass bangles and daily home comfort fabrics. Shop online with direct zero-fee NPCI UPI or visit our walk-in counter.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/919912565482?text=Hello%20Mahati%20Textile%20Center,%20I%20would%20like%20to%20inquire%20about%20textiles"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Store Inquiry</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 border-t border-red-800/60 text-center lg:text-left text-xs text-amber-200/90">
              <div>
                <span className="font-extrabold text-white block text-sm">₹0 / 0% MDR</span>
                <span>Zero Gateway Surcharge</span>
              </div>
              <div>
                <span className="font-extrabold text-white block text-sm">Sizes 2.4 - 2.8</span>
                <span>Glass Bangle Diameters</span>
              </div>
              <div>
                <span className="font-extrabold text-white block text-sm">Store Pickup</span>
                <span>Instant Counter Sync</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/20 group">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Pure Kanchipuram Silk Saree"
                className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Featured Bridal Handloom
                </span>
                <h3 className="text-lg font-bold">Pure Kanchipuram Silk Bridal Saree</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Handwoven golden zari border with authentic blouse piece.
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-amber-300">₹7,499</span>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-xs font-bold transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Policy Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Direct NPCI UPI</h4>
              <p className="text-[11px] text-slate-500">100% Zero-fee bank payments</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Physical Store Pickup</h4>
              <p className="text-[11px] text-slate-500">Counter sales & instant checkout</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Free Delivery Above ₹999</h4>
              <p className="text-[11px] text-slate-500">Carefully packed local delivery</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">WhatsApp Helpdesk</h4>
              <p className="text-[11px] text-slate-500">Live saree photos & size support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">
              Explore Departments
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Store Catalog Nuances
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop')}
              className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer aspect-16/10 bg-slate-900"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <h3 className="text-base font-bold group-hover:text-amber-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Items</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection Row */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                Trending in Store
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Featured Highlights
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1 transition"
            >
              <span>View Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
