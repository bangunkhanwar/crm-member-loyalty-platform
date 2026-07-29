import { Navigate } from 'react-router-dom';
import { getCurrentAdminUser } from '../../../services/AdminAuthService';

export default function ProtectedAdminRoute({ children }) {
  const admin = getCurrentAdminUser();
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}