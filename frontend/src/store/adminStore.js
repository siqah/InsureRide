import { create } from 'zustand';
import { adminApi } from '../api/adminApi';

export const useAdminStore = create((set, get) => ({
  token: localStorage.getItem('adminJwtToken') || '',
  isAuthenticated: !!localStorage.getItem('adminJwtToken'),
  loading: false,
  error: null,
  workers: [],
  claims: [],
  payments: [],

  loginAdmin: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await adminApi.login(username, password);
      const { token } = response.data;
      localStorage.setItem('adminJwtToken', token);
      set({ token, isAuthenticated: true, loading: false });
    } catch (err) {
      localStorage.removeItem('adminJwtToken');
      set({
        token: '',
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || 'Authentication failed. Please check admin credentials.',
      });
      throw err;
    }
  },

  logoutAdmin: () => {
    localStorage.removeItem('adminJwtToken');
    set({
      token: '',
      isAuthenticated: false,
      workers: [],
      claims: [],
      payments: [],
      error: null,
    });
  },

  fetchWorkers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminApi.getWorkers();
      set({ workers: response.data, loading: false });
    } catch (err) {
      set({ loading: false, error: 'Failed to fetch workers.' });
    }
  },

  updateWorkerStatus: async (workerId, status) => {
    try {
      await adminApi.updateWorkerStatus(workerId, status);
      // Refresh local list
      await get().fetchWorkers();
    } catch (err) {
      set({ error: 'Failed to update worker status.' });
    }
  },

  fetchClaims: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminApi.getClaims();
      set({ claims: response.data, loading: false });
    } catch (err) {
      set({ loading: false, error: 'Failed to fetch claims logs.' });
    }
  },

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminApi.getPayments();
      set({ payments: response.data, loading: false });
    } catch (err) {
      set({ loading: false, error: 'Failed to fetch payments logs.' });
    }
  },
}));
