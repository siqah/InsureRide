import API from './axios';

export const hospitalApi = {
  // Register new hospital
  register: (name, contactEmail, phoneNumber) => 
    API.post('/hospitals/register', {
      name,
      contactEmail,
      phoneNumber,
    }),
};
