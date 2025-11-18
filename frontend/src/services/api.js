import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', 
  },
});

// Faculty API
export const facultyAPI = {
  getAll: (params) => api.get('/faculty', { params }),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (data) => api.post('/faculty', data),
  update: (id, data) => api.put(`/faculty/${id}`, data),
  delete: (id) => api.delete(`/faculty/${id}`),
};

// Events API
export const eventAPI = {
  getAll: (params) => api.get("/events", { params }),
  getUpcoming: () => api.get("/events/upcoming"),
  getFeatured: () => api.get("/events/featured"),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// News API
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

//study api
export const studyMaterialAPI = {
  getAll: (params) => api.get("/study-materials", { params }),
  getGrouped: () => api.get("/study-materials/grouped"),
  getById: (id) => api.get(`/study-materials/${id}`),
  create: (data) => api.post("/study-materials", data),
  update: (id, data) => api.put(`/study-materials/${id}`, data),
  delete: (id) => api.delete(`/study-materials/${id}`),
};
//gallery api
export const galleryAPI = {
  getAll: (params) => api.get("/gallery", { params }),
  getFeatured: () => api.get("/gallery/featured"),
  getByCategory: (category) => api.get(`/gallery/category/${category}`),
  getById: (id) => api.get(`/gallery/${id}`),
  create: (data) => api.post("/gallery", data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
  like: (id) => api.post(`/gallery/${id}/like`),
};
//achievement api
export const achievementAPI = {
  getAll: (params) => api.get("/achievements", { params }),
  getFeatured: () => api.get("/achievements/featured"),
  getByCategory: (category) => api.get(`/achievements/category/${category}`),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (data) => api.post("/achievements", data),
  update: (id, data) => api.put(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
};
export default api;