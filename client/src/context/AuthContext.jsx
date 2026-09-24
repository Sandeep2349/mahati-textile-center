import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getAdminProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('mtc_admin_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mtc_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on initial load
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          const res = await getAdminProfile();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('mtc_admin_user', JSON.stringify(res.data.user));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (username, password) => {
    const res = await loginAdmin({ username, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('mtc_admin_token', newToken);
      localStorage.setItem('mtc_admin_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Login failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mtc_admin_token');
    localStorage.removeItem('mtc_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
