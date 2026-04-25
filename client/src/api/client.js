import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('m4u_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const BASE = import.meta.env.BASE_URL || '/';
const adminPath = `${BASE}admin`.replace(/\/+/g, '/');
const adminLogin = `${BASE}admin/login`.replace(/\/+/g, '/');

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('m4u_token');
      if (window.location.pathname.startsWith(adminPath) && window.location.pathname !== adminLogin) {
        window.location.href = adminLogin;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
