import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

// Single user configuration from environment variables
const SINGLE_USER = {
  firstName: import.meta.env.VITE_ADMIN_FIRST_NAME,
  lastName: import.meta.env.VITE_ADMIN_LAST_NAME,
  email: import.meta.env.VITE_ADMIN_EMAIL,
  password: import.meta.env.VITE_ADMIN_PASSWORD,
  role: 'admin',
  phone: import.meta.env.VITE_ADMIN_PHONE,
  bio: import.meta.env.VITE_ADMIN_BIO
};

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
      
      if (savedToken && savedUser) {
        try {
          // Try to fetch fresh user data from backend
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          
          if (response.ok) {
            try {
              const data = await response.json();
              setUser(data.data);
              setToken(savedToken);
            } catch (parseError) {
              console.error('Error parsing user data from backend:', parseError);
              // Clear corrupted data
              localStorage.removeItem('autoria_token');
              localStorage.removeItem('autoria_user');
              setToken(null);
              setUser(null);
            }
          } else {
            // If backend fetch fails, use saved user data
            try {
              setUser(JSON.parse(savedUser));
              setToken(savedToken);
            } catch (parseError) {
              console.error('Error parsing saved user data:', parseError);
              // Clear corrupted data
              localStorage.removeItem('autoria_token');
              localStorage.removeItem('autoria_user');
              setToken(null);
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fall back to saved user data
          try {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } catch (parseError) {
            console.error('Error parsing saved user data:', parseError);
            // Clear corrupted data
            localStorage.removeItem('autoria_token');
            localStorage.removeItem('autoria_user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Check against single user credentials
      if (email === SINGLE_USER.email && password === SINGLE_USER.password) {
        const authToken = 'autoria_admin_token_' + Date.now();
        
        // Store token
        localStorage.setItem('autoria_token', authToken);
        setToken(authToken);
        
        // Fetch user data from backend instead of using hardcoded SINGLE_USER
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (response.ok) {
            try {
              const data = await response.json();
              const userData = data.data;
              setUser(userData);
              // Persist user data to localStorage
              localStorage.setItem('autoria_user', JSON.stringify(userData));
              toast.success(`Welcome to Autoria Dashboard, ${userData.firstName}!`);
              return { success: true, user: userData, role: userData.role };
            } catch (parseError) {
              console.error('Error parsing user data on login:', parseError);
              // Fallback to SINGLE_USER if parsing fails
              setUser(SINGLE_USER);
              localStorage.setItem('autoria_user', JSON.stringify(SINGLE_USER));
              toast.success(`Welcome to Autoria Dashboard, ${SINGLE_USER.firstName}!`);
              return { success: true, user: SINGLE_USER, role: SINGLE_USER.role };
            }
          } else {
            // Fallback to SINGLE_USER if backend fails
            setUser(SINGLE_USER);
            localStorage.setItem('autoria_user', JSON.stringify(SINGLE_USER));
            toast.success(`Welcome to Autoria Dashboard, ${SINGLE_USER.firstName}!`);
            return { success: true, user: SINGLE_USER, role: SINGLE_USER.role };
          }
        } catch (error) {
          console.error('Error fetching user on login:', error);
          // Fallback to SINGLE_USER if fetch fails
          setUser(SINGLE_USER);
          localStorage.setItem('autoria_user', JSON.stringify(SINGLE_USER));
          toast.success(`Welcome to Autoria Dashboard, ${SINGLE_USER.firstName}!`);
          return { success: true, user: SINGLE_USER, role: SINGLE_USER.role };
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password. Please try again.');
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('autoria_token');
    localStorage.removeItem('autoria_user');
    setToken(null);
    setUser(null);
    toast.success('You have been logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Persist updated user data to localStorage
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
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};