import api from './api';

export async function getRewards() {
  return await api.get('/reward');
}

export async function redeemReward(rewardId) {
  return await api.post('/reward/redeem', { rewardId });
}
