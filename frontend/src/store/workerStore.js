import { create } from 'zustand';
import { workerApi } from '../api/workerApi';
import { paymentApi } from '../api/paymentApi';

export const useWorkerStore = create((set, get) => ({
  worker: null,
  payments: [],
  loading: false,
  error: null,
  success: null,

  fetchWorkerByPhone: async (phoneNumber) => {
    set({ loading: true, error: null, success: null });
    try {
      const workerResponse = await workerApi.getByPhone(phoneNumber);
      set({ worker: workerResponse.data });
      
      // Load payment history alongside worker data
      try {
        const paymentResponse = await paymentApi.getWorkerPayments(phoneNumber);
        set({ payments: paymentResponse.data });
      } catch (payErr) {
        console.error('Failed to load payment history:', payErr);
      }
      
      set({ loading: false });
    } catch (err) {
      set({
        worker: null,
        payments: [],
        loading: false,
        error: err.response?.status === 404 || err.response?.status === 500
          ? 'Worker not found. Would you like to register?'
          : 'Failed to fetch worker details',
      });
      throw err;
    }
  },

  registerWorker: async (name, phoneNumber) => {
    set({ loading: true, error: null, success: null });
    try {
      const response = await workerApi.register(name, phoneNumber);
      set({
        worker: response.data,
        payments: [],
        loading: false,
        success: 'Registration successful!',
      });
      return response.data;
    } catch (err) {
      set({
        loading: false,
        error: 'Registration failed. Please try again.',
      });
      throw err;
    }
  },

  processPayment: async (phoneNumber, amount, reference) => {
    set({ loading: true, error: null, success: null });
    try {
      const txRef = reference || `MPESA-${Date.now()}`;
      const response = await paymentApi.processPayment(phoneNumber, amount, txRef);
      set({
        success: response.data.message,
        loading: false,
      });
      // Reload worker coverage status and payments after a successful transaction
      await get().fetchWorkerByPhone(phoneNumber);
      return response.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Payment failed. Please try again.',
      });
      throw err;
    }
  },
  
  clearWorker: () => {
    set({
      worker: null,
      payments: [],
      error: null,
      success: null,
    });
  }
}));
