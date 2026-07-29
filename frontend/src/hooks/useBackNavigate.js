import { useNavigate } from 'react-router-dom';

/**
 * Hook navigasi "kembali" yang aman untuk production.
 * Kalau ada riwayat di dalam app, mundur normal.
 * Kalau tidak ada (refresh / akses langsung / deep link), fallback ke rute default.
 */
export function useBackNavigate(fallbackPath = '/dashboard') {
  const navigate = useNavigate();

  return () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };
}