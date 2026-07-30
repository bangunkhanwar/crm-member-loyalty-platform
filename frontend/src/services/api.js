import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MEMBER_AUTH_KEY = 'elcorps_auth';
const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_USER_KEY = 'adminUser';

function handleUnauthorized(tokenKey) {
  if (tokenKey === 'token') {
    // Sesi Member habis — hapus auth & lempar ke landing page
    localStorage.removeItem(MEMBER_AUTH_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    if (window.location.pathname.startsWith('/member')) {
      window.location.href = '/';
    }
  } else if (tokenKey === 'adminToken') {
    // Sesi Operator (Admin/Toko/Head) habis — hapus auth & lempar ke admin login
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
  }
}

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
      if (error.response?.status === 401) {
        handleUnauthorized(tokenKey);
      }
      const message = error.response?.data?.message || 'Terjadi kesalahan sistem.';
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}

export const memberApi = createApiInstance('token');
export const adminApi = createApiInstance('adminToken');

export default memberApi;