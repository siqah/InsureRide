import { create } from 'zustand';
import { hospitalApi } from '../api/hospitalApi';

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('hospitalJwtToken') || '',
  isAuthenticated: !!localStorage.getItem('hospitalJwtToken'),
  hospitalName: null,
  loading: false,
  error: null,

  login: async (apiKey) => {
    set({ loading: true, error: null });
    try {
      // 1. Submit API key to get JWT token
      const loginResponse = await hospitalApi.login(apiKey);
      const { token } = loginResponse.data;

      // 2. Save token to localStorage so interceptor can attach it
      localStorage.setItem('hospitalJwtToken', token);

      // 3. Retrieve hospital name/details using JWT authentication
      const meResponse = await hospitalApi.getMe();
      
      set({
        token,
        isAuthenticated: true,
        hospitalName: meResponse.data.name,
        loading: false,
      });
    } catch (err) {
      localStorage.removeItem('hospitalJwtToken');
      set({
        token: '',
        isAuthenticated: false,
        hospitalName: null,
        loading: false,
        error: err.response?.data?.message || 'Authentication failed. Please check your API Key.',
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('hospitalJwtToken');
    set({
      token: '',
      isAuthenticated: false,
      hospitalName: null,
      error: null,
    });
  },

  fetchHospitalInfo: async () => {
    const { token } = get();
    if (!token) return;
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
