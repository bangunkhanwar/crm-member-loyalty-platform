import { memberApi } from './api';

export async function getHistory({ month, year } = {}) {
  const params = {};
  if (month) params.month = month;
  if (year) params.year = year;
  return await memberApi.get('/member/points/history', { params });
}

export async function redeem(rewardId) {
  return await memberApi.post('/reward/redeem', { rewardId });
}