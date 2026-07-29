import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import MemberManagement from '../pages/MemberManagement';
import MemberDetail from '../pages/MemberDetail';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      {/* TODO: tambah route Member Management, Point Adjustment, Reward Inventory — bungkus dengan ProtectedAdminRoute juga */}
      <Route
        path="members"
        element={
          <ProtectedAdminRoute>
            <MemberManagement />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="members/:id"
        element={
          <ProtectedAdminRoute>
            <MemberDetail />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}