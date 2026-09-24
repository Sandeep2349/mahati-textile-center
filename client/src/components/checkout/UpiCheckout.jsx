import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Copy, Check, Smartphone, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { isValidUtr } from '../../utils/validators';

const UpiCheckout = ({ totalAmount, orderNumber = 'SALE', utrNumber, onUtrChange, error }) => {
  const [copied, setCopied] = useState(false);

  const vpa = import.meta.env.VITE_STORE_UPI_VPA || 'mahatitextiles@upi';
  const storeName = import.meta.env.VITE_STORE_NAME || 'Mahati Textile Center';

  // Build standard NPCI UPI URI:
  // upi://pay?pa={VPA}&pn={NAME}&am={TOTAL_AMOUNT}&tn={NOTE}&cu=INR
  const formattedAmount = Number(totalAmount).toFixed(2);
  const upiUri = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(storeName)}&am=${formattedAmount}&tn=${encodeURIComponent(`MTC_Order_${orderNumber}`)}&cu=INR`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isUtrValid = isValidUtr(utrNumber);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Title & Trust Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-base font-bold text-slate-900">
              Direct NPCI UPI Payment (₹0 Fee)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pay directly from your bank account with 0% gateway commission
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Payable</span>
          <span className="text-xl font-extrabold text-red-900">
            {formatINR(totalAmount)}
          </span>
        </div>
      </div>

      {/* UPI QR Code Container (Desktop & Tablet) */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 shrink-0 flex flex-col items-center">
          <QRCodeSVG
            value={upiUri}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg',
              x: undefined,
              y: undefined,
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
          <span className="text-[10px] font-bold text-slate-500 mt-2 tracking-wider uppercase">
            Scan with any UPI App
          </span>
        </div>

        {/* Supported Apps & Manual VPA */}
        <div className="flex-1 space-y-3.5 w-full text-center sm:text-left">
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-1">
              Supported Banking Apps
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-[11px] font-medium text-slate-600">
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                Google Pay
              </span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                PhonePe
              </span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                Paytm
              </span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                BHIM / Cred
              </span>
            </div>
          </div>

          {/* Copyable VPA */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              Store UPI Virtual Address (VPA)
            </span>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs max-w-full">
              <span className="font-mono text-xs font-bold text-slate-800 select-all truncate">
                {vpa}
              </span>
              <button
                type="button"
                onClick={handleCopyVpa}
                className="text-slate-500 hover:text-red-800 p-1 transition"
                title="Copy VPA"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Deep Link CTA */}
          <div className="pt-1">
            <a
              href={upiUri}
              className="inline-flex sm:hidden items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Pay via Any UPI App</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* UTR Verification Section */}
      <div className="space-y-3 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            12-Digit Bank UTR / Transaction Reference ID <span className="text-red-600">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2">
            After making payment in Google Pay / PhonePe / Paytm, copy the 12-digit numeric Reference / UTR number from the payment receipt.
          </p>

          <div className="relative">
            <input
              type="text"
              maxLength={12}
              value={utrNumber}
              onChange={(e) => onUtrChange(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 423456789012"
              className={`w-full px-3.5 py-2.5 text-sm font-mono tracking-wider bg-slate-50 border rounded-xl focus:outline-none transition ${
                isUtrValid
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                  : error
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-slate-300 focus:border-red-800 focus:ring-2 focus:ring-red-800/10'
              }`}
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-xs">
              {isUtrValid ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Valid 12 Digits
                </span>
              ) : (
                <span className="text-slate-400 font-mono">
                  {utrNumber ? `${utrNumber.length}/12` : '0/12'}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>

        {/* Security / Verification Note */}
        <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            Once submitted, your order status will be set to <strong>PENDING_VERIFICATION</strong>. The store counter admin will match the UTR and dispatch your items immediately.
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpiCheckout;
