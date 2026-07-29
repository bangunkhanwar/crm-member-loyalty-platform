import { adminApi } from './api';

export async function loginAdmin({ username, phone, password }) {
  const payload = phone ? { phone, password } : { username, password };
  const response = await adminApi.post('/auth/operator-login', payload);
  if (response.token) {
    localStorage.setItem('adminToken', response.token);
    localStorage.setItem('adminUser', JSON.stringify(response.user));
  }
  return response;
}

export function getCurrentAdminUser() {
  const userStr = localStorage.getItem('adminUser');
  return userStr ? JSON.parse(userStr) : null;
}

export function logoutAdmin() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
}