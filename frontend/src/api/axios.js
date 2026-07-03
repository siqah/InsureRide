import axios from 'axios';

// Create axios instance with base URL mapping to Spring Boot backend
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key for hospital/claims endpoints
API.interceptors.request.use(
  (config) => {
    if (config.url.includes('/claims') || config.url.includes('/hospitals/me')) {
      const apiKey = localStorage.getItem('hospitalApiKey');
      if (apiKey) {
        config.headers['X-API-KEY'] = apiKey;
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
      localStorage.removeItem('hospitalApiKey');
      window.location.href = '/hospital/login';
    }
    return Promise.reject(error);
  }
);

export default API;
