import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentAdminUser, logoutAdmin } from '../services/AdminAuthService';

const NAV_ITEMS = [
  { section: 'General', items: [
    { label: 'Dashboard', icon: 'fa-chart-pie', path: '/admin/dashboard' },
    { label: 'Member Management', icon: 'fa-users', path: '/admin/members' },
    { label: 'History Point Adjustment', icon: 'fa-edit', path: '/admin/point-adjustment' },
    { label: 'Reward Inventory', icon: 'fa-gift', path: '/admin/rewards' },
  ]},
  { section: 'Support', items: [
    { label: 'Setting', icon: 'fa-cog', path: '/admin/settings' },
    { label: 'Pusat Bantuan', icon: 'fa-question-circle', path: '/admin/help' },
  ]},
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const adminUser = getCurrentAdminUser() || { name: 'Admin', role: 'Admin' };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <aside className="fixed top-0 left-0 w-[260px] h-screen bg-white shadow-[3px_0px_20px_rgba(0,0,0,0.25)] p-4 flex flex-col gap-2 font-inter">
      <div className="flex items-center gap-1 mb-8">
        <div className="w-[120px] h-[42px] bg-[url('/logo-elcorps.png')] bg-no-repeat bg-contain bg-center" />
        <div className="flex flex-col">
          <h1 className="font-hanken text-base text-secondary">Dashboard</h1>
          <span className="text-[11px] tracking-wide uppercase text-admin-text">CRM</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-[15px] flex-1">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div className="text-xs text-text-black my-4">{group.section}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-1.5 py-2.5 rounded-xl text-sm transition-colors
                  ${isActive ? 'bg-primary text-white' : 'text-text-black hover:bg-bg-alt'}`
                }
              >
                <i className={`fas ${item.icon} w-6 text-center text-xl`} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-border pt-4 flex items-center gap-3">
        <div className="w-[39px] h-[39px] border border-text-black rounded-lg flex items-center justify-center">
          <i className="fas fa-user text-xl" />
        </div>
        <div className="flex flex-col">
          <strong className="text-base text-admin-navy">{adminUser.name}</strong>
          <small className="text-[11px] text-admin-text">{adminUser.role}</small>
        </div>
        <button onClick={handleLogout} aria-label="Logout" className="ml-auto text-xl text-admin-text hover:text-danger transition-colors">
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>
    </aside>
  );
}