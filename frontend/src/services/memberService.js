import { memberApi } from './api';

export async function getMemberProfile() {
  return await memberApi.get('/member/profile');
}

export async function updateMemberProfile(data) {
  return await memberApi.put('/member/profile', data);
}

export async function getPointHistory(month, year) {
  const params = {};
  if (month) params.month = month;
  if (year) params.year = year;
  return await memberApi.get('/member/points/history', { params });
}

export async function getMemberVouchers() {
  return await memberApi.get('/member/vouchers');
}

export async function getBanners() {
  return await memberApi.get('/member/banners');
}