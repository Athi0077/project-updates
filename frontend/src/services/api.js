import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development mode, point to local backend port 5001
  if (import.meta.env.DEV) {
    return 'http://localhost:5001/api';
  }
  // In production (Vercel, custom domain, etc.), use the live Render backend API
  return 'https://project-updates-toa1.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses and brief network retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry safe GET requests if backend was still spinning up
    if (
      (!error.response || error.code === 'ERR_NETWORK') &&
      config &&
      config.method === 'get' &&
      (!config.__retryCount || config.__retryCount < 2)
    ) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return api(config);
    }

    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('portfolio_token')) {
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_admin');
        window.dispatchEvent(new Event('auth-change'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginApi = (email, password) => api.post('/auth/login', { email, password });
export const registerApi = (name, email, password) => api.post('/auth/register', { name, email, password });
export const getMeApi = () => api.get('/auth/me');

// Project endpoints
export const getProjectsApi = (params = {}) => api.get('/projects', { params });
export const getProjectStatsApi = () => api.get('/projects/stats');
export const getProjectByIdApi = (id) => api.get(`/projects/${id}`);
export const createProjectApi = (data) => api.post('/projects', data);
export const updateProjectApi = (id, data) => api.put(`/projects/${id}`, data);
export const updateProjectStatusApi = (id, status, progress) =>
  api.patch(`/projects/${id}/status`, { status, progress });
export const deleteProjectApi = (id) => api.delete(`/projects/${id}`);

// Cloudinary image upload
export const uploadImageApi = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Booking endpoints
export const createBookingApi = (data) => api.post('/bookings', data);
export const getMyBookingsApi = (mobile) => api.get('/bookings/my-booking', { params: { mobile } });
export const getAllBookingsApi = (params = {}) => api.get('/bookings', { params });
export const getBookingStatsApi = () => api.get('/bookings/stats');
export const confirmBookingApi = (id, data) => api.put(`/bookings/${id}/confirm`, data);
export const updateBookingStatusApi = (id, data) => api.patch(`/bookings/${id}/status`, data);
export const deleteBookingApi = (id) => api.delete(`/bookings/${id}`);

// Category endpoints
export const getCategoriesApi = () => api.get('/categories');
export const createCategoryApi = (data) => api.post('/categories', data);
export const updateCategoryApi = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);

export default api;
