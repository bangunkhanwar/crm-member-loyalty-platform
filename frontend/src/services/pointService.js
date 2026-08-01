import { memberApi } from './api';

export async function getHistory({ startDate, endDate, limit } = {}) {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (limit) params.limit = limit;
  return await memberApi.get('/member/points/history', { params });
}

export async function redeem(rewardId) {
  return await memberApi.post('/reward/redeem', { rewardId });
}