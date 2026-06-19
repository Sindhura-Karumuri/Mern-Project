import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from './api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    try {
      const savedUser  = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user)  localStorage.setItem('user', JSON.stringify(user));
    else       localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token);
    else       localStorage.removeItem('token');
  }, [user, token]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await API.post('/auth/signup', payload);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
