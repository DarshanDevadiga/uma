import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('uma_token') || null);
  const [loading, setLoading] = useState(true);

  // Check if token is valid on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('uma_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Login handler
  const login = async (usernameOrEmail, password) => {
    try {
      const res = await api.post('/auth/login', { usernameOrEmail, password });
      const { token, user } = res.data;
      
      localStorage.setItem('uma_token', token);
      localStorage.setItem('uma_user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please try again.';
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('uma_token');
    localStorage.removeItem('uma_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
