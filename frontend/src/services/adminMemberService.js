import { adminApi } from './api';

export async function getDashboardKPIs(filters = {}) {
  return await adminApi.get('/admin/dashboard-kpi', { params: filters });
}

export async function getMemberList(search = '', storeCode = '') {
  return await adminApi.get('/admin/members', { params: { search, storeCode } });
}

export async function getMemberDetail(memberCode) {
  return await adminApi.get(`/admin/members/${memberCode}`);
}

export async function adjustPoints(memberCode, type, nominal, reason) {
  return await adminApi.post('/admin/adjust-points', { memberCode, type, nominal, reason });
}

export async function registerNewMember(name, phone, email, storeCode, categoryCode = 'MEMBER', tierMember = 'Silver', initialBalance = 0) {
  return await adminApi.post('/admin/register-member', { name, phone, email, storeCode, categoryCode, tierMember, initialBalance });
}

export async function updateMember(memberCode, data) {
  return await adminApi.put(`/admin/members/${memberCode}`, data);
}