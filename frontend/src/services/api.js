import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function createApiInstance(tokenKey) {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message = error.response?.data?.message || 'Terjadi kesalahan sistem.';
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}

// Member Portal pakai token 'token'
export const memberApi = createApiInstance('token');

// Admin Portal pakai token 'adminToken'
export const adminApi = createApiInstance('adminToken');

// default export tetap ada untuk kompatibilitas (kalau ada import lama `import api from './api'`)
export default memberApi;