import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const MEMBER_AUTH_KEY = 'elcorps_auth';


function getMemberToken() {
  const raw = localStorage.getItem(MEMBER_AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

function getAdminToken() {
  const raw = localStorage.getItem(MEMBER_AUTH_KEY); // pakai key yang sama: 'elcorps_auth'
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

function memberSessionExpired() {
  localStorage.removeItem(MEMBER_AUTH_KEY);
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
}

function adminSessionExpired() {
  localStorage.removeItem(MEMBER_AUTH_KEY); // hapus 'elcorps_auth'
  if (window.location.pathname !== '/admin/login') {
    window.location.href = '/admin/login';
  }
}

function createApiInstance(getToken, on401) {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) on401();
      const message = error.response?.data?.message || 'Terjadi kesalahan sistem.';
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}

export const memberApi = createApiInstance(getMemberToken, memberSessionExpired);
export const adminApi = createApiInstance(getAdminToken, adminSessionExpired);

export default memberApi;