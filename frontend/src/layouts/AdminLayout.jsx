import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F7F9FB]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopNav />
        <main className="flex-1 p-0">{children}</main>
      </div>
    </div>
  );
}