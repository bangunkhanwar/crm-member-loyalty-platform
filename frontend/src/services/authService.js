import api from './api';

const AUTH_KEY = 'elcorps_auth';

export async function registerMember({ name, phone, email, categoryCode }) {
  return await api.post('/auth/register', { name, phone, email, categoryCode });
}

export async function requestOTP(phone) {
  return await api.post('/auth/request-otp', { phone });
}

export async function verifyOTP(phone, code) {
  const response = await api.post('/auth/verify-otp', { phone, otp: code });
  if (response.token) {
    const authData = {
      token: response.token,
      role: 'member', // semua kategori (Member/Reseller/Agent) tetap login sebagai role portal 'member'
      user: response.member,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  }
  return response;
}

export async function resendOTP(phone) {
  return await api.post('/auth/request-otp', { phone });
}

export function getCurrentMember() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw).user : null;
}

export function logoutMember() {
  localStorage.removeItem(AUTH_KEY);
}