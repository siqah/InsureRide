import API from './axios';

export const adminApi = {
  // Login admin
  login: (username, password) => 
    API.post('/admin/login', { username, password }),

  // Get all workers
  getWorkers: () => 
    API.get('/admin/workers'),

  // Toggle/Update worker status
  updateWorkerStatus: (workerId, status) => 
    API.put(`/admin/workers/${workerId}/status`, { status }),

  // Audit Claims history
  getClaims: () => 
    API.get('/admin/claims'),

  // Audit Payments list
  getPayments: () => 
    API.get('/admin/payments'),
};
