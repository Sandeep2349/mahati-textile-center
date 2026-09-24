import React from 'react';
import { Store, MapPin, Phone, MessageCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Zero Cost / Assurance Strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Zero Surcharge UPI</h4>
              <p className="text-xs text-slate-400">Direct NPCI bank transfer via GPay, PhonePe, Paytm</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Physical Counter Sales</h4>
              <p className="text-xs text-slate-400">Real-time inventory sync for walk-in shopping & pickup</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">100% Zero Ongoing Cost</h4>
              <p className="text-xs text-slate-400">Built on permanent free tiers for zero merchant overhead</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Store Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center text-white font-bold text-base">
              M
            </div>
            <span className="text-lg font-bold text-white tracking-wide">
              Mahati <span className="text-red-400">Textile Center</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your neighborhood trusted destination for pure Kanchipuram silk sarees, readymade apparel, traditional dhotis, glass bangles, daily wear fabrics, and comfortable innerwear.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-amber-300 font-medium">
            <span>₹0 / $0 Platform Maintenance</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
            Catalog Nuances
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-amber-400 transition">
                Women's Sarees & Kurtis
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-amber-400 transition">
                Men's Shirts & Dhotis (Veshti)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-amber-400 transition">
                Glass & Metal Bangles (2.4, 2.6, 2.8)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-amber-400 transition">
                Comfort Innerwear (Cup & Chest sizes)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop')} className="hover:text-amber-400 transition">
                Home Fabrics, Towels & Bedspreads
              </button>
            </li>
          </ul>
        </div>

        {/* Store Location & Hours */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
            Physical Store
          </h3>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <a
                href="https://maps.google.com/?q=Hajipally+Road+Shadnagar+509216"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-400 transition underline underline-offset-2"
              >
                Hajipally Road, Shadnagar, 509216
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <a
                href="tel:+919912565482"
                className="hover:text-red-400 transition font-semibold"
              >
                +91 99125 65482
              </a>
            </div>
            <p className="text-[11px] text-slate-500 pt-2">
              Walk-in Store: 10:30 AM to 9:30 PM (Open all 7 days)
            </p>
          </div>
        </div>

        {/* WhatsApp Assistance */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
            Instant Assistance
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Need photo verification of a saree border or size consultation? Chat directly with the store counter staff on WhatsApp.
          </p>
          <a
            href="https://wa.me/919912565482?text=Hello%20Mahati%20Textile%20Center,%20I%20have%20an%20inquiry%20regarding%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} Mahati Textile Center. All rights reserved.</span>
        <div className="flex items-center gap-1 mt-2 sm:mt-0">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          <span>for local retail commerce</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
