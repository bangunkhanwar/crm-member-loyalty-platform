import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RewardPromo from '../pages/RewardPromo';
import RiwayatPoin from '../pages/RiwayatPoin';
import Profile from '../pages/Profile';
import PoinSaya from '../pages/PoinSaya';
import DetailPromo from '../pages/DetailPromo';
import RedeemSuccess from '../pages/RedeemSuccess';
import ProtectedRoute from '../../../routes/ProtectedRoute';

export default function MemberRoutes() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/login" element={<Login />} />

      {/* Halaman terlindungi */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reward"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <RewardPromo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/riwayat"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <RiwayatPoin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/poin"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <PoinSaya />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reward/:id"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <DetailPromo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reward/success"
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <RedeemSuccess />
          </ProtectedRoute>
        }
      />

      {/* Redirect default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}