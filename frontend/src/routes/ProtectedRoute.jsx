import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles = ['member'], children }) {
  const { auth, loading } = useAuth();

  if (loading) return null;
  if (!auth || !auth.token || !auth.role) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/" replace />;

  return children;
}