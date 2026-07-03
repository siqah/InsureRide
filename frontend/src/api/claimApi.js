import API from './axios';

export const claimApi = {
  // Verify claim (requires API key in header)
  verify: (workerPhoneNumber, billAmount) => 
    API.post('/claims/verify', {
      workerPhoneNumber,
      billAmount,
    }),

  // Get hospital claims history
  getHistory: () => API.get('/claims'),
};
