import logoImg from '../assets/elcorps.png';

export default function MemberHeader({ onMenuClick }) {
  return (
    <header className="h-16 flex items-center justify-between px-5 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2 h-full">
        <img src={logoImg} alt="Elcorps" className="h-8 sm:h-9 w-auto object-contain" />
        <span className="inline mt-2 font-bold text-primary text-sm text-base">Member</span>
      </div>
      <button onClick={onMenuClick} aria-label="Buka menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191C1E" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}