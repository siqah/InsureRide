import axios from 'axios';

// Get sanitized and formatted base URL
const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  // Trim trailing slash
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  // Ensure it ends with /api
  return url.endsWith('/api') ? url : `${url}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization token based on portal
API.interceptors.request.use(
  (config) => {
    let token = null;
    if (config.url.includes('/admin')) {
      token = localStorage.getItem('adminJwtToken');
    } else if (config.url.includes('/claims') || config.url.includes('/hospitals/me')) {
      token = localStorage.getItem('hospitalJwtToken');
    } else if (config.url.includes('/workers') || config.url.includes('/payments')) {
      token = localStorage.getItem('workerJwtToken') || localStorage.getItem('adminJwtToken');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
      if (error.config.url.includes('/admin')) {
        localStorage.removeItem('adminJwtToken');
        window.location.href = '/admin';
      } else if (error.config.url.includes('/claims') || error.config.url.includes('/hospitals')) {
        localStorage.removeItem('hospitalJwtToken');
        window.location.href = '/hospital';
      } else {
        localStorage.removeItem('workerJwtToken');
        window.location.href = '/worker';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
