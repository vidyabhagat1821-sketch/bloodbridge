import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bloodbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error. Please check backend connection.';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  sendOtp: (mobileNumber) => api.post('/auth/send-otp', { mobileNumber }),
  verifyOtp: (mobileNumber, otp) => api.post('/auth/verify-otp', { mobileNumber, otp }),
  register: (payload) => api.post('/auth/register', payload),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

export const donorApi = {
  getAll: (params) => api.get('/donors', { params }),
  getById: (id) => api.get(`/donors/${id}`),
  update: (id, data) => api.put(`/donors/${id}`, data),
  updateAvailability: (id, isAvailable) => api.put(`/donors/${id}/availability`, { isAvailable })
};

export const hospitalApi = {
  getAll: () => api.get('/hospitals'),
  getById: (id) => api.get(`/hospitals/${id}`),
  update: (id, data) => api.put(`/hospitals/${id}`, data)
};

export const requestApi = {
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  matchDonors: (id, params) => api.post(`/requests/${id}/match`, params),
  respond: (id, data) => api.post(`/requests/${id}/respond`, data),
  complete: (id) => api.post(`/requests/${id}/complete`)
};

export const notificationApi = {
  getAll: (recipientId) => api.get('/notifications', { params: { recipientId } }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: (recipientId) => api.put('/notifications/read-all', { recipientId })
};

export const aiApi = {
  parseBloodRequest: (text) => api.post('/ai/parse-blood-request', { text })
};

export const chatbotApi = {
  ask: (question, history) => api.post('/chatbot/ask', { question, history }),
  getHistory: () => api.get('/chatbot/history')
};

export const documentApi = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id) => api.delete(`/documents/${id}`),
  reprocess: (id) => api.post(`/documents/${id}/reprocess`),
  searchTest: (query, topK) => api.post('/documents/search-test', { query, topK })
};

export default api;
