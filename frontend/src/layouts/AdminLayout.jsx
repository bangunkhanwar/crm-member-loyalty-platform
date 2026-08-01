import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import { useAuth } from '../context/AuthContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

export default function AdminLayout({ children }) {
  const { auth } = useAuth();
  const adminUser = auth?.user || { fullName: 'Admin', role: 'Admin' };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useLockBodyScroll(mobileOpen);

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <AdminSidebar isOpen={sidebarOpen} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className={`flex flex-col min-h-screen transition-[padding] duration-300 ease-out ${sidebarOpen ? 'lg:pl-[260px]' : 'lg:pl-0'}`}>
        <AdminTopNav
          adminUser={adminUser}
          onMenuClick={() => setMobileOpen(true)}
          sidebarOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        <main className="flex-1 pt-[66px]">{children}</main>
      </div>
    </div>
  );
}