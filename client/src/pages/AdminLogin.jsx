import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Store, ShieldAlert, ArrowLeft } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess, onBackToStore }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('AdminPassword123!');
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
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
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
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-800 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {loading ? 'Authenticating...' : 'Sign In to Merchant Dashboard'}
          </button>
        </form>

        {/* Default Credential Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
          <span className="font-bold block mb-0.5">Seeded Store Admin Credentials:</span>
          <span>Username: <strong className="font-mono">admin</strong></span>
          <br />
          <span>Password: <strong className="font-mono">AdminPassword123!</strong></span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
