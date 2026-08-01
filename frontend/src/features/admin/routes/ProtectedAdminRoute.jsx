import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) return null; // ⬅️ tunggu context siap
  if (!auth || auth.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}