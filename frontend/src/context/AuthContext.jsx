import { createContext, useState, useEffect, useContext } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Get user info from token or API if needed
      setUser({ username: localStorage.getItem('username') });
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', credentials.username);
      setToken(data.access_token);
      setUser({ username: credentials.username });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerApi(userData);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false,

        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;