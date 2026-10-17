import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_token') || null);
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('portfolio_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.data.success) {
            setAdmin(res.data.admin);
            localStorage.setItem('portfolio_admin', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();

    const handleAuthChange = () => {
      setToken(null);
      setAdmin(null);
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.data.success) {
      const { token: newToken, admin: newAdmin } = res.data;
      setToken(newToken);
      setAdmin(newAdmin);
      localStorage.setItem('portfolio_token', newToken);
      localStorage.setItem('portfolio_admin', JSON.stringify(newAdmin));
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Login failed' };
  };

  const register = async (name, email, password) => {
    const res = await registerApi(name, email, password);
    if (res.data.success) {
      const { token: newToken, admin: newAdmin } = res.data;
      setToken(newToken);
      setAdmin(newAdmin);
      localStorage.setItem('portfolio_token', newToken);
      localStorage.setItem('portfolio_admin', JSON.stringify(newAdmin));
      return { success: true };
    }
    return { success: false, message: res.data.message || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        loading,
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
