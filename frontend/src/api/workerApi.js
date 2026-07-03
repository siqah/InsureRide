import API from './axios';

export const workerApi = {
  // Get all workers
  getAll: () => API.get('/workers'),
  
  // Get worker by phone
  getByPhone: (phoneNumber) => API.get(`/workers/phone/${phoneNumber}`),
  
  // Register new worker (sends JSON request body)
  register: (name, phoneNumber) => 
    API.post('/workers/register', { name, phoneNumber }),
  
  // Update worker status (sends JSON request body with coverageStatus)
  updateStatus: (workerId, status) => 
    API.put(`/workers/${workerId}/status`, { coverageStatus: status }),
  
  // Delete worker
  delete: (workerId) => API.delete(`/workers/${workerId}`),
};
