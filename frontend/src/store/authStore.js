import { create } from 'zustand';
import { hospitalApi } from '../api/hospitalApi';

export const useAuthStore = create((set, get) => ({
  apiKey: localStorage.getItem('hospitalApiKey') || '',
  isAuthenticated: !!localStorage.getItem('hospitalApiKey'),
  hospitalName: null,
  loading: false,
  error: null,

  login: async (apiKey) => {
    set({ loading: true, error: null });
    try {
      // Set temporary item in localStorage so the request interceptor can attach it
      localStorage.setItem('hospitalApiKey', apiKey);
      const response = await hospitalApi.getMe();
      set({
        apiKey,
        isAuthenticated: true,
        hospitalName: response.data.name,
        loading: false,
      });
    } catch (err) {
      localStorage.removeItem('hospitalApiKey');
      set({
        apiKey: '',
        isAuthenticated: false,
        hospitalName: null,
        loading: false,
        error: err.response?.data?.message || 'Invalid API Key',
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('hospitalApiKey');
    set({
      apiKey: '',
      isAuthenticated: false,
      hospitalName: null,
      error: null,
    });
  },

  fetchHospitalInfo: async () => {
    const { apiKey } = get();
    if (!apiKey) return;
    set({ loading: true });
    try {
      const response = await hospitalApi.getMe();
      set({ hospitalName: response.data.name, loading: false });
    } catch (err) {
      if (err.response?.status === 401) {
        get().logout();
      }
      set({ loading: false });
    }
  },
}));
