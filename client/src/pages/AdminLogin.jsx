import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Store, ShieldAlert, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess, onBackToStore }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await login(username, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. If deployed, verify your backend URL in VITE_API_URL.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Back link */}
        <button
          onClick={onBackToStore}
          className="text-xs text-slate-500 hover:text-red-800 flex items-center gap-1 font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>

        {/* Brand & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-red-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Store className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Merchant & Walk-In POS Portal
          </h2>
          <p className="text-xs text-slate-500">
            Mahati Textile Center Administration & Inventory
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-900 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {loading ? 'Authenticating...' : 'Sign In to Merchant Dashboard'}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Authorized Store Personnel Only • 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
