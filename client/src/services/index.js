import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

export const leadService = {
  getLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
};

export const noteService = {
  getNotes: (leadId) => api.get(`/leads/${leadId}/notes`),
  addNote: (leadId, data) => api.post(`/leads/${leadId}/notes`, data),
  updateNote: (leadId, noteId, data) => api.put(`/leads/${leadId}/notes/${noteId}`, data),
  deleteNote: (leadId, noteId) => api.delete(`/leads/${leadId}/notes/${noteId}`),
};

export const analyticsService = {
  getAnalytics: () => api.get('/analytics'),
};
