import { adminApi } from './api';

export async function getRewardInventory(search = '') {
  return await adminApi.get('/admin/rewards', { params: { search } });
}
export async function getRewardStats() {
  return await adminApi.get('/admin/rewards/stats');
}
function toFormData(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    fd.append(key, value);
  });
  return fd;
}

export async function createReward(payload) {
  return await adminApi.post('/admin/rewards', toFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
export async function updateReward(giftId, payload) {
  return await adminApi.put(`/admin/rewards/${giftId}`, toFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
export async function restockReward(giftId, addStock) {
  return await adminApi.post(`/admin/rewards/${giftId}/restock`, { addStock });
}
export async function toggleRewardActive(giftId) {
  return await adminApi.patch(`/admin/rewards/${giftId}/toggle`);
}
export async function deleteReward(giftId) {
  return await adminApi.delete(`/admin/rewards/${giftId}`);
}