import api from './api';

export async function requestOTP(phone) {
  return await api.post('/auth/request-otp', { phone });
}

export async function verifyOTP(phone, code) {
  const response = await api.post('/auth/verify-otp', { phone, otp: code });
  if (response.token) {
    // Simpan untuk kompatibilitas
    localStorage.setItem('token', response.token);
    localStorage.setItem('member', JSON.stringify(response.member));

    // Simpan ke key yang dibaca AuthContext
    const authData = {
      token: response.token,
      role: response.member.role, // pastikan backend mengirim role di member
      user: response.member,
    };
    localStorage.setItem('elcorps_auth', JSON.stringify(authData));
  }
  return response;
}

export async function resendOTP(phone) {
  return await api.post('/auth/request-otp', { phone });
}

export function getCurrentMember() {
  const memberStr = localStorage.getItem('member');
  return memberStr ? JSON.parse(memberStr) : null;
}

export function logoutMember() {
  localStorage.removeItem('token');
  localStorage.removeItem('member');
}

// Fungsi register baru
export async function register(data) {
  const response = await api.post('/auth/register', data);
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('member', JSON.stringify(response.member));
  }
  return response;
}