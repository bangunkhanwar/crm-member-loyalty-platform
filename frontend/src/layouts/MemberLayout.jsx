import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';

export default function MemberLayout() {
  return (
    <ProtectedRoute allowedRoles={['member']}>
      <Outlet />
    </ProtectedRoute>
  );
}