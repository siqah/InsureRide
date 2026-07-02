import API from './axios';

export const paymentApi = {
  // Process daily premium payment
  processPayment: (phoneNumber, amount, transactionReference) => 
    API.post('/payments/process', {
      phoneNumber,
      amount,
      transactionReference,
    }),
  
  // Get payment history for worker
  getWorkerPayments: (phoneNumber) => 
    API.get(`/payments/worker/${phoneNumber}`),
};
