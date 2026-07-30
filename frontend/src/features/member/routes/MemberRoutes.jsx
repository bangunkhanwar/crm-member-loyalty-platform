import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import MemberLayout from '../../../layouts/MemberLayout';
import Dashboard from '../pages/Dashboard';
import RewardPromo from '../pages/RewardPromo';
import RiwayatPoin from '../pages/RiwayatPoin';
import Profile from '../pages/Profile';
import PoinSaya from '../pages/PoinSaya';
import DetailPromo from '../pages/DetailPromo';
import RedeemSuccess from '../pages/RedeemSuccess';

export default function MemberRoutes() {
  return (
    <Routes>
      {/* Publik — tidak boleh dibungkus proteksi */}
      <Route path="/login" element={<Login />} />

      {/* Global Protected Route — seluruh halaman member terkunci di sini */}
      <Route element={<MemberLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reward" element={<RewardPromo />} />
        <Route path="/reward/:id" element={<DetailPromo />} />
        <Route path="/reward/success" element={<RedeemSuccess />} />
        <Route path="/riwayat" element={<RiwayatPoin />} />
        <Route path="/poin" element={<PoinSaya />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}