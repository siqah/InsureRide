import axios from 'axios';

// Create axios instance with base URL mapping to Spring Boot backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization token for hospital/claims endpoints
API.interceptors.request.use(
  (config) => {
    if (config.url.includes('/claims') || config.url.includes('/hospitals/me')) {
      const token = localStorage.getItem('hospitalJwtToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth token expiry redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hospitalJwtToken');
      window.location.href = '/hospital'; // Portal page base url
    }
    return Promise.reject(error);
  }
);

export default API;
