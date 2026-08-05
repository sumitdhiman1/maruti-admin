import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('maruti_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('maruti_token'));
  const [loading, setLoading] = useState(false);

  // Sync URL bar on session change
  useEffect(() => {
    if (user && window.location.pathname === '/login') {
      const savedTab = localStorage.getItem('maruti_admin_tab') || 'dashboard';
      const targetPath = savedTab === 'dashboard' ? '/' : `/${savedTab}`;
      window.history.replaceState(null, '', targetPath);
    } else if (!user && window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      setUser(data);
      setToken(data.token);
      localStorage.setItem('maruti_token', data.token);
      localStorage.setItem('maruti_user', JSON.stringify(data));
      
      const savedTab = localStorage.getItem('maruti_admin_tab') || 'dashboard';
      const targetPath = savedTab === 'dashboard' ? '/' : `/${savedTab}`;
      if (window.location.pathname === '/login') {
        window.history.replaceState(null, '', targetPath);
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('maruti_token');
    localStorage.removeItem('maruti_user');
    localStorage.removeItem('maruti_admin_tab');
    if (window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
