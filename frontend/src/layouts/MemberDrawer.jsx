import { useNavigate } from 'react-router-dom';

const CORE_NAV = [
  { label: 'Beranda', path: '/member/dashboard' },
  { label: 'Poin Saya', path: '/member/poin' },
  { label: 'Reward & Promo', path: '/member/reward' },
  { label: 'Riwayat Transaksi', path: '/member/riwayat' },
];

export default function MemberDrawer({ open, onClose, member, onLogoutClick }) {
  const navigate = useNavigate();

  if (!open) return null;

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer panel */}
      <aside className="relative w-[85%] max-w-[330px] h-full bg-bg-page shadow-elevated flex flex-col justify-between">
        <div className="flex flex-col">
          {/* Header drawer */}
          <div className="h-16 flex items-center px-5 bg-white">
            <span className="font-bold text-primary text-base">Elcorps Member</span>
          </div>

          {/* Zone 1: Profile & Core nav */}
          <div className="flex flex-col gap-6 px-6 py-5">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-secondary bg-[#E6E8EA]" />
                <div className="flex flex-col gap-0.5 flex-1">
                    <h3 className="font-bold text-xl text-text-black">{member?.name || 'Member'}</h3>
                    <span className="text-secondary font-bold text-[13px]">
                      {(member?.totalPoint ?? 0).toLocaleString('id-ID')} Poin
                    </span>
                </div>
                <button onClick={() => goTo('/member/profile')} aria-label="Edit profil" className="p-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006A64" strokeWidth="2">
                    <path d="M12 20h9" strokeLinecap="round" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <nav className="flex flex-col gap-1">
              {CORE_NAV.map((item) => (
                <button
                  key={item.label}
                  onClick={() => goTo(item.path)}
                  className="flex items-center gap-4 h-12 px-4 rounded-xl text-left font-medium text-text-body hover:bg-secondary/10"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Zone 3: Logout */}
        <div className="p-6 border-t border-border-soft flex flex-col gap-4">
          <button
            onClick={onLogoutClick}
            className="flex items-center justify-between h-[60px] px-4 rounded-xl bg-danger-bright/[0.03]"
          >
            <span className="font-bold text-xl text-danger-dark">Keluar Akun</span>
          </button>
          <p className="text-center text-[10px] tracking-wider text-text-body/40">
            ELCORPS LOYALTY V 0.1
          </p>
        </div>
      </aside>
    </div>
  );
}