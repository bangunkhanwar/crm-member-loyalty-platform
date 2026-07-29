// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import ScrollToTop from './utils/ScrollToTop';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const MemberRoutes = lazy(() => import('./features/member/routes/MemberRoutes'));
const AdminRoutes = lazy(() => import('./features/admin/routes/AdminRoutes'));

function Loading() {
  return <div className="p-4 text-center">Memuat halaman...</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/member/*"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <MemberRoutes />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<h1>404 - Halaman tidak ditemukan</h1>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}