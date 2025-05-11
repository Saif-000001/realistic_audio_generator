// src/services/api.js
import axios from 'axios';

// Get API URL from environment variable or use a default
const API_URL = import.meta.env.VITE_API_URL;

// Create API instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error);
    
    // Add custom error handling if needed
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // Redirect to login if needed
    }
    
    return Promise.reject(error);
  }
);

export default api;
