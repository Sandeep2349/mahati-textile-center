import React from 'react';
import { User, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { isValidPhone, isValidPinCode } from '../../utils/validators';

const OrderForm = ({ customer, onChange, errors = {} }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">
          Customer & Delivery Address
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Please enter your delivery or store pickup contact information
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Full Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="fullName"
              value={customer.fullName || ''}
              onChange={onChange}
              placeholder="e.g. Ananya Sharma"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none transition ${
                errors.fullName
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-slate-300 focus:border-red-800'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mobile Number (10 Digits) <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              name="phone"
              maxLength={10}
              value={customer.phone || ''}
              onChange={(e) =>
                onChange({ target: { name: 'phone', value: e.target.value.replace(/\D/g, '') } })
              }
              placeholder="9876543210"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none transition ${
                errors.phone
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-slate-300 focus:border-red-800'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* WhatsApp Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            WhatsApp Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              name="whatsappNumber"
              maxLength={10}
              value={customer.whatsappNumber || ''}
              onChange={(e) =>
                onChange({ target: { name: 'whatsappNumber', value: e.target.value.replace(/\D/g, '') } })
              }
              placeholder="Leave empty if same as phone"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800"
            />
          </div>
        </div>

        {/* Street Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Flat, House No., Street, Colony <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              name="address"
              value={customer.address || ''}
              onChange={onChange}
              placeholder="House #12, 3rd Cross, Gandhi Nagar, or specify 'Store Counter Pickup'"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none transition ${
                errors.address
                  ? 'border-red-500 ring-2 ring-red-500/20'
                  : 'border-slate-300 focus:border-red-800'
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.address}
            </p>
          )}
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Landmark (Optional)
          </label>
          <input
            type="text"
            name="landmark"
            value={customer.landmark || ''}
            onChange={onChange}
            placeholder="e.g. Near Vinayaka Temple"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800"
          />
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Postal PIN Code (6 Digits) <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="pinCode"
            maxLength={6}
            value={customer.pinCode || ''}
            onChange={(e) =>
              onChange({ target: { name: 'pinCode', value: e.target.value.replace(/\D/g, '') } })
            }
            placeholder="500001"
            className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none transition ${
              errors.pinCode
                ? 'border-red-500 ring-2 ring-red-500/20'
                : 'border-slate-300 focus:border-red-800'
            }`}
          />
          {errors.pinCode && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.pinCode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
