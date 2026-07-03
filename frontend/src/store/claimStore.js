import { create } from 'zustand';
import { claimApi } from '../api/claimApi';

export const useClaimStore = create((set, get) => ({
  claims: [],
  loading: false,
  error: null,
  verificationResult: null,

  fetchClaimsHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await claimApi.getHistory();
      set({
        claims: response.data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: 'Failed to load claims history.',
      });
    }
  },

  verifyClaim: async (workerPhoneNumber, billAmount) => {
    set({ loading: true, error: null, verificationResult: null });
    try {
      const response = await claimApi.verify(workerPhoneNumber, parseFloat(billAmount));
      set({
        verificationResult: response.data,
        loading: false,
      });
      // Automatically refresh the claims log if the verification succeeds
      await get().fetchClaimsHistory();
      return response.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Verification failed. Make sure your API Key is valid.',
      });
      throw err;
    }
  },

  clearVerificationResult: () => {
    set({ verificationResult: null });
  }
}));
