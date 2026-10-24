import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('autoria_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('autoria_token');
      const savedUser = localStorage.getItem('autoria_user');
      
      if (savedToken) {
        try {
          const response = await authAPI.getMe();
          if (response?.data) {
            setUser(response.data);
            setToken(savedToken);
            localStorage.setItem('autoria_user', JSON.stringify(response.data));
          } else if (savedUser) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          }
        } catch {
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
              setToken(savedToken);
            } catch {
              localStorage.removeItem('autoria_token');
              localStorage.removeItem('autoria_user');
              setToken(null);
              setUser(null);
            }
          } else {
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login handler - strictly authenticates against real backend
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response?.token && response?.data?.user) {
        const loggedUser = response.data.user;
        localStorage.setItem('autoria_token', response.token);
        localStorage.setItem('autoria_user', JSON.stringify(loggedUser));
        setToken(response.token);
        setUser(loggedUser);
        toast.success(`Welcome back, ${loggedUser.firstName}!`);
        return { success: true, user: loggedUser, role: loggedUser.role };
      }

      throw new Error(response?.message || 'Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password. Please try again.');
      return { success: false, message: error.message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response?.token && response?.data?.user) {
        const newUser = response.data.user;
        localStorage.setItem('autoria_token', response.token);
        localStorage.setItem('autoria_user', JSON.stringify(newUser));
        setToken(response.token);
        setUser(newUser);
        toast.success(`Account created successfully! Welcome to Autoria, ${newUser.firstName}!`);
        return { success: true, user: newUser, role: newUser.role };
      }
      throw new Error(response?.message || 'Failed to register account');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please check your details.');
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    try {
      authAPI.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('autoria_token');
    localStorage.removeItem('autoria_user');
    setToken(null);
    setUser(null);
    toast.success('You have been signed out');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('autoria_user', JSON.stringify(userData));
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};