import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/elcorps.png';

const NAV_ITEMS = [
  { section: '', items: [
    { label: 'Dashboard', icon: 'fa-chart-pie', path: '/admin/dashboard' },
    { label: 'Member Management', icon: 'fa-users', path: '/admin/members' },
    { label: 'History Point Adjustment', icon: 'fa-edit', path: '/admin/point-adjustment' },
    { label: 'Reward Management', icon: 'fa-gift', path: '/admin/rewards' },
  ]},
  { section: 'Support', items: [
    { label: 'Setting', icon: 'fa-cog', path: '/admin/settings' },
  ]},
];

export default function AdminSidebar({ isOpen = true, mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const adminUser = auth?.user || { fullName: 'Admin', role: 'Admin' };

  const handleLogout = () => {
    logout();
    window.location.replace('/admin/login');
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-[fadeIn_0.2s_ease-out]" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 w-[260px] h-screen bg-white shadow-[3px_0px_20px_rgba(0,0,0,0.25)]
          px-4 py-6 flex flex-col gap-2 font-inter z-50 transition-transform duration-300 ease-out will-change-transform
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="Elcorps" className="h-10 w-auto object-contain shrink-0" />
            <div className="flex flex-col min-w-0">
              <h1 className="font-hanken text-base text-secondary truncate">Dashboard</h1>
              <span className="text-[11px] tracking-wide uppercase text-admin-text">CRM</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-admin-text shrink-0" aria-label="Tutup menu">
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-[15px] flex-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((group) => (
            <div key={group.section}>
              <div className="text-xs text-text-black my-4">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-1.5 py-2.5 rounded-xl text-sm transition-colors
                    ${isActive ? 'bg-primary text-white' : 'text-text-black hover:bg-bg-alt'}`
                  }
                >
                  <i className={`fas ${item.icon} w-6 text-center text-xl shrink-0`} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-border pt-4 flex items-center gap-3 shrink-0">
          <div className="w-[39px] h-[39px] border border-text-black rounded-lg flex items-center justify-center shrink-0">
            <i className="fas fa-user text-xl" />
          </div>
          <div className="flex flex-col min-w-0">
            <strong className="text-base text-admin-navy truncate">{adminUser.fullName}</strong>
            <small className="text-[11px] text-admin-text">{adminUser.role}</small>
          </div>
          <button onClick={handleLogout} aria-label="Logout" className="ml-auto text-xl text-admin-text hover:text-danger transition-colors shrink-0">
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      </aside>
    </>
  );
}