import { useBackNavigate } from '../hooks/useBackNavigate';

export default function BackHeader({ title, variant = 'light', fallbackPath = '/dashboard' }) {
  const goBack = useBackNavigate(fallbackPath);
  const isDark = variant === 'dark';

  return (
    <header className={`h-16 flex items-center gap-4 px-5 ${isDark ? '' : 'bg-white'}`}>
      <button onClick={goBack} aria-label="Kembali">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 13L5 8L10 3" stroke={isDark ? '#FFFFFF' : '#006A64'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-primary'}`}>{title}</h1>
    </header>
  );
}