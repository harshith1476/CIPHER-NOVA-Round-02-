import React, { createContext, useContext, useState, useEffect } from 'react';
import { enhancedLogout } from '../utils/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// API base URL - uses proxy in development, direct URL as fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Token decode error:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      // Try proxy first, fallback to direct URL
      let response;
      try {
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
      } catch (proxyError) {
        // Fallback to direct backend URL
        response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const { token: newToken } = data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      
      // Redirect to dashboard after successful login
      window.location.href = '/';
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const performLogout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    enhancedLogout(performLogout);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  const value = {
    user,
    login,
    register,
    logout,
    fetchUserProfile,
    loading,
    isAuthenticated: !!user,
    isRetailer: user?.role === 'retailer',
    isDistributor: user?.role === 'distributor',
    isAdmin: user?.role === 'admin',
    isHeadRetailer: user?.role === 'head_retailer',
    isHeadDistributor: user?.role === 'head_distributor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
